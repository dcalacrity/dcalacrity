#!/usr/bin/env node
/*
  Pure Alacrity — web deploy build.

  Rebuilds WEB-DEPLOY/public from the single-file Master:

    public/index.html          the app shell: route chunks cut out, every app
                               script scrambled, embedded images lifted into files
    public/chunks/*.js         one file per chunked addon, scripts scrambled
    public/chunks/manifest.json
    public/Pure-Alacrity.html  the single-file download: whole app, scrambled,
                               images kept inside so it works offline
    public/pa-logo.jpg, public/pa-img-*.jpg
    public/sw.js               from tools/sw.src.js: cache name bumped so
                               visitors get this build, then scrambled

  "Scrambled" means: identifiers renamed, comments and whitespace removed,
  numbers turned into expressions, member access written as brackets. Strings
  stay as they are (the app builds markup and handlers from them), globals
  keep their names (inline onclick handlers call them).

  Left exactly as written, as the previous build did:
    - scripts that open with a vendor marker  /*!  (jsPDF, GSAP, pdf-lib,
      the logo, the screenshot data): third-party code keeps its licence text
    - scripts with a type attribute (JSON-LD, embedded pdf.js stored as text,
      the AI kit data)

  Also removed from the HTML: descriptive HTML comments and CSS comments.
  Kept: the <!--[AH-…]--> markers the loader and tooling use.

  Usage (from the repository root or anywhere):
    npm --prefix WEB-DEPLOY install
    node WEB-DEPLOY/tools/build-webdeploy.js [path/to/Master.html]
*/
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const JavaScriptObfuscator = require('javascript-obfuscator');

const DEPLOY = path.resolve(__dirname, '..');
const PUBLIC = path.resolve(process.env.PA_PUBLIC_DIR || path.join(DEPLOY, 'public'));
const MASTER = path.resolve(process.argv[2] || path.join(DEPLOY, '..', 'Pure Alacrity - Master.html'));
const CACHE_DIR = path.join(__dirname, '.cache');
const LOADER_TPL = path.join(__dirname, 'chunk-loader.js');

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const log = (...a) => console.log('[build]', ...a);

/* ── scrambling ────────────────────────────────────────────────────────── */
const OPTIONS = {
  compact: true,
  simplify: true,
  target: 'browser',
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true,
  renameGlobals: false,
  renameProperties: false,
  stringArray: false,
  transformObjectKeys: false,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  selfDefending: false,
  debugProtection: false,
  disableConsoleOutput: false,
  unicodeEscapeSequence: false,
  sourceMap: false,
};
fs.mkdirSync(CACHE_DIR, { recursive: true });
const stats = { scrambled: 0, cached: 0, kept: 0, failed: [] };
function isVendor(code) { return /^\s*\/\*!/.test(code); }
function scramble(code, label) {
  if (!code.trim()) return code;
  if (isVendor(code)) { stats.kept++; return code; }
  const key = sha(JSON.stringify(OPTIONS) + '\0' + code);
  const hit = path.join(CACHE_DIR, key + '.js');
  if (fs.existsSync(hit)) { stats.cached++; return fs.readFileSync(hit, 'utf8'); }
  try {
    const out = JavaScriptObfuscator.obfuscate(code, Object.assign({ seed: parseInt(key.slice(0, 8), 16) }, OPTIONS)).getObfuscatedCode();
    /* a scrambled script must still be safe inside a <script> element */
    const safe = out.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');   /* keep the case: </ScriptNote> is Final Draft XML */
    fs.writeFileSync(hit, safe);
    stats.scrambled++;
    return safe;
  } catch (e) {
    stats.failed.push(label + ': ' + String(e.message || e).split('\n')[0] + ' (saved as .cache/failed-' + key.slice(0, 8) + '.js)');
    fs.writeFileSync(path.join(CACHE_DIR, 'failed-' + key.slice(0, 8) + '.js'), code);
    return code;
  }
}

/* ── CSS: comments out, strings and data URIs untouched ─────────────────── */
function stripCss(css) {
  let out = '', i = 0, q = null;
  while (i < css.length) {
    const c = css[i];
    if (q) { out += c; if (c === '\\') { out += css[i + 1] || ''; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; out += c; i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? css.length : e + 2; continue; }
    out += c; i++;
  }
  return out;
}

/* ── one pass over the HTML, the way a browser reads it ─────────────────── */
/* Returns the document with scripts scrambled, CSS and HTML comments
   stripped. A <script> body runs to the first </script>, as in a browser. */
function processHtml(html, label) {
  let out = '', i = 0;
  /* ASCII-only lowercase: String#toLowerCase changes the length of some
     characters (İ → i̇), which would shift every position after them */
  const lower = html.replace(/[A-Z]+/g, (x) => x.toLowerCase());
  while (i < html.length) {
    const s = lower.indexOf('<script', i), st = lower.indexOf('<style', i), cm = html.indexOf('<!--', i);
    const next = Math.min(...[s, st, cm].map((x) => (x < 0 ? Infinity : x)));
    if (next === Infinity) { out += html.slice(i); break; }
    out += html.slice(i, next);
    if (next === cm) {
      const e = html.indexOf('-->', cm + 4); const end = e < 0 ? html.length : e + 3;
      const body = html.slice(cm, end);
      if (/^<!--\[(AH-|\/AH-|if|endif)/.test(body)) out += body;      /* markers and conditionals stay */
      i = end; continue;
    }
    const isScript = next === s;
    const tagEnd = html.indexOf('>', next) + 1;
    const open = html.slice(next, tagEnd);
    const closeTag = isScript ? '</script' : '</style';
    /* a script ends at </script followed by space, / or > — never at
       </ScriptNote> inside a Final Draft string, as a browser reads it */
    let ci = lower.indexOf(closeTag, tagEnd);
    while (ci >= 0 && !/[\s/>]/.test(html[ci + closeTag.length] || '>')) ci = lower.indexOf(closeTag, ci + 1);
    const closeEnd = html.indexOf('>', ci) + 1;
    const body = html.slice(tagEnd, ci);
    let nb = body;
    if (isScript) {
      const attrs = open.slice(7, -1);
      const plain = !/\bsrc\s*=/.test(attrs) && !/\btype\s*=/.test(attrs);
      nb = plain ? scramble(body, label + ' @' + next) : body;
    } else {
      nb = stripCss(body);
    }
    out += open + nb + html.slice(ci, closeEnd);
    i = closeEnd;
  }
  return out;
}

/* ── the chunk files ───────────────────────────────────────────────────── */
function block(html, name) {
  const o = '<!--[AH-ADDON:' + name + ']-->', c = '<!--[/AH-ADDON:' + name + ']-->';
  const a = html.indexOf(o), b = html.indexOf(c);
  if (a < 0 || b < 0) throw new Error('chunk ' + name + ' has no AH-ADDON block in the Master');
  return { start: a, end: b + c.length, inner: html.slice(a + o.length, b) };
}
function chunkFile(name, inner) {
  const parts = ['/* Pure Alacrity chunk: ' + name + ' */'];
  const re = /<(script|style)([^>]*)>([\s\S]*?)<\/\1(?=[\s/>])[^>]*>/gi;
  let m;
  while ((m = re.exec(inner))) {
    const [, tag, attrs, body] = m;
    if (tag.toLowerCase() === 'style') {
      parts.push('(function(){var s=document.createElement("style");s.setAttribute("data-chunk",' + JSON.stringify(name) +
        ');s.textContent=' + JSON.stringify(stripCss(body)) + ';document.head.appendChild(s);})();');
    } else {
      if (/\bsrc\s*=/.test(attrs)) throw new Error('chunk ' + name + ' has an external script it cannot carry: ' + attrs);
      if (/\btype\s*=/.test(attrs)) {
        /* a data script (pdf.js kept as text, read back by id): recreate the
           element as it is in the single file — never run it, never scramble it */
        const at = {}; attrs.replace(/([\w-]+)\s*=\s*"([^"]*)"/g, (x, k, v) => { at[k] = v; });
        parts.push('(function(){var s=document.createElement("script");' +
          Object.keys(at).map((k) => 's.setAttribute(' + JSON.stringify(k) + ',' + JSON.stringify(at[k]) + ');').join('') +
          's.textContent=' + JSON.stringify(body).replace(/<\/(script)/gi, '<\\/$1') + ';document.head.appendChild(s);})();');
        continue;
      }
      parts.push(scramble(body, 'chunk ' + name) + '\n;');
    }
  }
  return parts.join('\n') + '\n';
}

/* ── build ─────────────────────────────────────────────────────────────── */
const t0 = Date.now();
log('Master:', MASTER);
const master = fs.readFileSync(MASTER, 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'chunks', 'manifest.json'), 'utf8'));
const build = Date.now().toString(36);
manifest.build = build;

/* 1 · chunks out of the shell */
let shell = master;
const chunkDir = path.join(PUBLIC, 'chunks');
for (const name of manifest.order) {
  const b = block(shell, name);
  fs.writeFileSync(path.join(chunkDir, name + '.js'), chunkFile(name, b.inner));
  shell = shell.slice(0, b.start) + '<!--[AH-CHUNK:' + name + ']-->' + shell.slice(b.end);
}
fs.writeFileSync(path.join(chunkDir, 'manifest.json'), JSON.stringify(manifest, null, 1));
log('chunks:', manifest.order.length);

/* 2 · images out of the shell (the download keeps them inside) */
const LOGO_RE = /(\/\*! The logo[\s\S]*?var SRC = ")data:image\/jpeg;base64,([A-Za-z0-9+/=]+)"/;
shell = shell.replace(LOGO_RE, (all, pre, b64) => { fs.writeFileSync(path.join(PUBLIC, 'pa-logo.jpg'), Buffer.from(b64, 'base64')); return pre + 'pa-logo.jpg"'; });
const lifted = new Set();
shell = shell.replace(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/g, (all, b64) => {
  const buf = Buffer.from(b64, 'base64');
  const file = 'pa-img-' + sha(buf).slice(0, 10) + '.jpg';
  if (!lifted.has(file)) { fs.writeFileSync(path.join(PUBLIC, file), buf); lifted.add(file); }
  return file;
});
log('images lifted:', ['pa-logo.jpg'].concat([...lifted]).join(', '));

/* 3 · logo preload and the chunk loader */
shell = shell.replace(/<head>/i, '<head><link rel="preload" as="image" href="pa-logo.jpg">');
const loader = fs.readFileSync(LOADER_TPL, 'utf8').replace('__PA_MANIFEST__', JSON.stringify(manifest));
const bodyEnd = shell.lastIndexOf('</body>');
shell = shell.slice(0, bodyEnd) + '<script>' + loader + '</script>\n' + shell.slice(bodyEnd);

/* 4 · scramble and write */
fs.writeFileSync(path.join(PUBLIC, 'index.html'), processHtml(shell, 'shell'));
log('index.html written');
fs.writeFileSync(path.join(PUBLIC, 'Pure-Alacrity.html'), processHtml(master, 'download'));
log('Pure-Alacrity.html written');

/* 5 · a new service-worker cache, so returning visitors take this build */
/* tools/sw.src.js is the readable source; public/sw.js is written scrambled */
const swSrc = fs.readFileSync(path.join(__dirname, 'sw.src.js'), 'utf8');
const shellHash = sha(fs.readFileSync(path.join(PUBLIC, 'index.html'))).slice(0, 12);
const swOut = swSrc.replace(/const CACHE = 'pure-alacrity-[a-z0-9]+';/, "const CACHE = 'pure-alacrity-" + shellHash + "';");
if (swOut === swSrc) throw new Error('sw.src.js has no CACHE constant to bump');
fs.writeFileSync(path.join(PUBLIC, 'sw.js'), scramble(swOut, 'sw.js'));

log('build', build, '· scrambled', stats.scrambled, '· from cache', stats.cached, '· vendor kept', stats.kept, '·', ((Date.now() - t0) / 1000).toFixed(0) + 's');
if (stats.failed.length) {
  console.error('[build] could not scramble ' + stats.failed.length + ' script(s); they were left as written:\n  ' + stats.failed.join('\n  '));
  process.exitCode = 1;
}
