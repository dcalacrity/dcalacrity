/* Build the site: render every page, write public/, refresh the sitemap, and
   then CHECK the output — links that resolve, one h1 per page, the copy rules
   from DESIGN.md §6, and the area tokens the CSS actually defines.
   A check that fails stops the build; nothing half-written is left behind.
   Run:  node "dcalacrity-com/_build/build.mjs"  */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, SITE, NAV, clean } from './shell.mjs';
import core from './pages-core.mjs';
import work from './pages-work.mjs';
import rest from './pages-rest.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const PUB = path.join(ROOT, 'public');
const MIRROR = path.join(ROOT, '..', 'dcalacrity-website');

const PAGES = [...core, ...work, ...rest];
const rendered = new Map();
/* Page bodies are written with relative links ('work/sidequest.html',
   '../contact.html?topic=…') because that reads naturally. The build resolves
   each against its page and emits the clean root-relative form. */
const rewriteLinks = (html, slug) => {
  const dir = path.posix.dirname(slug);
  return html.replace(/(href|src)="([^"]+)"/g, (m, attr, href) => {
    if (/^(https?:|mailto:|tel:|#|data:|\/)/.test(href)) return m;
    const mm = href.match(/^([^?#]*)(.*)$/);
    const p = mm[1], rest = mm[2] || '';
    const abs = path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, p));
    if (/\.(css|js|png|jpg|jpeg|svg|webp|mp4|json|xml|txt)$/i.test(abs)) return attr + '="/' + abs + rest + '"';
    return attr + '="' + clean(abs) + rest + '"';
  });
};
for (const p of PAGES) {
  if (rendered.has(p.slug)) throw new Error('two pages claim ' + p.slug);
  rendered.set(p.slug, rewriteLinks(page(p), p.slug));
}
/* a clean URL maps back to the file that answers it */
const fileFor = (u) => {
  u = u.replace(/^\//, '');
  if (u === '') return 'index.html';
  if (u.endsWith('/')) return u + 'index.html';
  if (/\.[a-z0-9]+$/i.test(u)) return u;
  return u + '.html';
};

/* ─── checks ───────────────────────────────────────────────────────────── */
const problems = [];
const note = (slug, msg) => problems.push(`${slug}: ${msg}`);

/* Files that exist in public/ but are not generated here — the RHRN microsite,
   the assets, the vendor scripts. A link may point at any of them. */
const exists = (rel) => fs.existsSync(path.join(PUB, rel));

/* The company is a technology and media company. These describe one of the
   things it does and must not describe the company itself. */
const BANNED = [
  /\bfull-stack media company\b/i,
  /North Carolina[–—-]?based (?:media )?production company/i,
  /North Carolina media studio/i,
  /\bis a (?:North Carolina[^.]{0,20})?media company\b/i,
  /(?<!["“])\bproduction company\b/i   /* quoted = a mention, as in "please avoid ..." */
];
/* Private. Never published: the Sidequest on-set spend, and Welcome to
   Wilmy's distribution (festival, cutdowns, release) — undecided. */
const PRIVATE = [
  { re: /\b1,400\b/, why: 'Sidequest on-set spend is private' },
  { re: /on-set spend/i, why: 'Sidequest on-set spend is private' }
];
const WILMY_PRIVATE = /Cucalorus|festival cut|cutdown|picture lock|festival assembly|release window/i;

/* Pure Alacrity post-dates the Sidequest shoot — never say the season ran on it. */
const ORIGIN = [/Sidequest[^.]{0,60}\b(?:ran|was made|was shot) on Pure Alacrity/i, /the pipeline behind Right Here Right Now!? and Sidequest/i];

for (const [slug, html] of rendered) {
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) note(slug, `${h1} <h1> elements, expected 1`);

  for (const re of BANNED) { const m = html.match(re); if (m) note(slug, `banned company description: “${m[0]}”`); }
  for (const re of ORIGIN) { const m = html.match(re); if (m) note(slug, `Pure Alacrity origin misstated: “${m[0]}”`); }
  for (const { re, why } of PRIVATE) { const m = html.match(re); if (m) note(slug, `private figure “${m[0]}” — ${why}`); }
  if (/welcome-to-wilmy/.test(slug)) { const m = html.match(WILMY_PRIVATE); if (m) note(slug, `Wilmy distribution is undecided and private — “${m[0]}”`); }

  /* only SITE.email is ever offered as an address */
  const mails = [...html.matchAll(/mailto:([^"'?]+)/g)].map((m) => m[1]);
  mails.filter((m) => m !== SITE.email).forEach((m) => note(slug, `contact address ${m} — only ${SITE.email} ships`));

  /* the pass-3 per-area vocabulary is gone */
  if (/data-area=|\bt-(?:tech|media|rnd|co|svc|sq|teal)\b|btn--area|btn--ghost|btn--arc|class="band|class="flat/.test(html)) note(slug, 'uses a class from the retired pass-3 vocabulary');
  /* and so is the pass-5 sky: its stylesheet is gone, so these would render unstyled */
  if (/class="[^"]*\b(?:glass|on-sky|skyline|object__still|tilt|sheen)\b/.test(html)) note(slug, 'uses a class from the retired pass-5 sky vocabulary');

  /* a plate whose image is missing draws nothing at all, silently */
  [...html.matchAll(/data-src="([^"]+)"/g)].forEach((m) => { if (!exists(m[1].replace(/^\//, ''))) note(slug, `plate image ${m[1]} does not exist`); });

  /* every internal link is clean, root-relative, and answered by a real file.
     A link carrying .html would be 301'd by Pages on every click, and a
     redirect rule pointing at .html loops — "redirected you too many times". */
  [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]).forEach((href) => {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) return;
    if (!href.startsWith('/')) { note(slug, `link ${href} is not root-relative`); return; }
    if (/\.html([?#]|$)/.test(href)) { note(slug, `link ${href} carries .html`); return; }
    const target = fileFor(href.split(/[?#]/)[0]);
    if (!rendered.has(target) && !exists(target)) note(slug, `link to ${href} → ${target} does not exist`);
  });

  /* a fragment link must have its target on the same page */
  [...html.matchAll(/href="#([^"]+)"/g)].forEach((m) => { if (m[1] !== 'main' && !html.includes(`id="${m[1]}"`)) note(slug, `#${m[1]} has no target on the page`); });

  /* the tags we open, we close */
  for (const tag of ['section', 'article', 'div', 'main', 'header', 'footer', 'nav', 'ul', 'table', 'figure']) {
    const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
    const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) note(slug, `${open} <${tag}> vs ${close} </${tag}>`);
  }
}

if (problems.length) {
  console.error('BUILD STOPPED — ' + problems.length + ' problem(s):');
  problems.forEach((p) => console.error('  · ' + p));
  process.exit(1);
}

/* ─── write ────────────────────────────────────────────────────────────── */
/* On this machine a write can fail transiently with UNKNOWN -4094 while a
   preview server or watcher has the file open. It clears in well under a
   second; a build that dies on it leaves public/ half-written. */
const writeRetry = (file, data) => {
  for (let i = 0; ; i++) {
    try { fs.writeFileSync(file, data, 'utf8'); return; }
    catch (e) { if (i >= 6 || !/UNKNOWN|EBUSY|EPERM/.test(String(e.code))) throw e; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250 * (i + 1)); }
  }
};
let written = 0;
for (const [slug, html] of rendered) {
  const out = path.join(PUB, slug);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  writeRetry(out, html);
  written++;
}

/* sitemap — every generated page plus the two things that are not generated */
const urls = [...rendered.keys()]
  .filter((s) => s !== '404.html')
  .map((s) => SITE.origin + clean(s))
  .concat([SITE.origin + '/work/rhrn', SITE.origin + '/pure']);
writeRetry(path.join(PUB, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n', 'utf8');

/* the mirror: dcalacrity-website/ is an edit copy with no functions. Keeping
   it byte-identical is the only way it cannot disagree with what deploys. */
let mirrored = 0; const pruned = [];
if (fs.existsSync(MIRROR)) {
  const copy = (from, to) => {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    /* the same transient UNKNOWN -4094 the writes see, most often on the 22 MB microsite */
    for (let i = 0; ; i++) {
      try { fs.copyFileSync(from, to); break; }
      catch (e) { if (i >= 6 || !/UNKNOWN|EBUSY|EPERM/.test(String(e.code))) throw e; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250 * (i + 1)); }
    }
    mirrored++;
  };
  const seen = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(PUB, dir), { withFileTypes: true })) {
      const rel = path.posix.join(dir, e.name);
      if (e.isDirectory()) walk(rel);
      else { seen.add(rel); copy(path.join(PUB, rel), path.join(MIRROR, rel)); }
    }
  };
  walk('');
  /* Copying alone lets a file deleted from public/ live on in the mirror, and
     a stale page there is exactly the trap this mirror exists to avoid. */
  const prune = (dir) => {
    const here = path.join(MIRROR, dir);
    if (!fs.existsSync(here)) return;
    for (const e of fs.readdirSync(here, { withFileTypes: true })) {
      const rel = path.posix.join(dir, e.name);
      if (e.isDirectory()) prune(rel);
      else if (!seen.has(rel) && rel !== 'README.md') { fs.rmSync(path.join(MIRROR, rel)); pruned.push(rel); }
    }
  };
  prune('');
}

console.log(`${written} pages written, ${urls.length} urls in the sitemap, ${mirrored} files mirrored${pruned.length ? ', ' + pruned.length + ' stale removed (' + pruned.join(', ') + ')' : ''}, 0 problems.`);
console.log('nav: ' + NAV.map((n) => n.label).join(' · '));
