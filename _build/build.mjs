/* Build the site: render every page, write public/, refresh the sitemap, and
   then CHECK the output — links that resolve, one h1 per page, the copy rules
   from DESIGN.md §6, and the area tokens the CSS actually defines.
   A check that fails stops the build; nothing half-written is left behind.
   Run:  node "dcalacrity-com/_build/build.mjs"  */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, SITE, NAV } from './shell.mjs';
import core from './pages-core.mjs';
import work from './pages-work.mjs';
import rest from './pages-rest.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const PUB = path.join(ROOT, 'public');
const MIRROR = path.join(ROOT, '..', 'dcalacrity-website');

const PAGES = [...core, ...work, ...rest];
const rendered = new Map();
for (const p of PAGES) {
  if (rendered.has(p.slug)) throw new Error('two pages claim ' + p.slug);
  rendered.set(p.slug, page(p));
}

/* ─── checks ───────────────────────────────────────────────────────────── */
const problems = [];
const note = (slug, msg) => problems.push(`${slug}: ${msg}`);

/* Files that exist in public/ but are not generated here — the RHRN microsite,
   the assets, the vendor scripts. A link may point at any of them. */
const exists = (rel) => fs.existsSync(path.join(PUB, rel));

const AREAS = new Set(['tech', 'media', 'rnd', 'co', 'svc', 'sq', 'teal']);

/* The company is a technology and media company. These describe one of the
   things it does and must not describe the company itself. */
const BANNED = [
  /\bfull-stack media company\b/i,
  /North Carolina[–—-]?based (?:media )?production company/i,
  /North Carolina media studio/i,
  /\bis a (?:North Carolina[^.]{0,20})?media company\b/i,
  /(?<!["“])\bproduction company\b/i   /* quoted = a mention, as in "please avoid ..." */
];
/* Pure Alacrity post-dates the Sidequest shoot — never say the season ran on it. */
const ORIGIN = [/Sidequest[^.]{0,60}\b(?:ran|was made|was shot) on Pure Alacrity/i, /the pipeline behind Right Here Right Now!? and Sidequest/i];

for (const [slug, html] of rendered) {
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) note(slug, `${h1} <h1> elements, expected 1`);

  for (const re of BANNED) { const m = html.match(re); if (m) note(slug, `banned company description: “${m[0]}”`); }
  for (const re of ORIGIN) { const m = html.match(re); if (m) note(slug, `Pure Alacrity origin misstated: “${m[0]}”`); }

  /* only pure@ is ever offered as an address */
  const mails = [...html.matchAll(/mailto:([^"'?]+)/g)].map((m) => m[1]);
  mails.filter((m) => m !== SITE.email).forEach((m) => note(slug, `contact address ${m} — only ${SITE.email} ships`));

  /* area tokens must be ones the stylesheet defines */
  [...html.matchAll(/data-area="([a-z]+)"/g)].forEach((m) => { if (!AREAS.has(m[1])) note(slug, `data-area="${m[1]}" is not a defined area`); });
  [...html.matchAll(/class="[^"]*\bt-([a-z]+)\b/g)].forEach((m) => { if (!AREAS.has(m[1])) note(slug, `t-${m[1]} is not a defined area`); });

  /* every relative link resolves to a real file */
  const dir = path.posix.dirname(slug);
  [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]).forEach((href) => {
    if (/^(https?:|mailto:|data:|#)/.test(href)) return;
    const target = path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, href.split('#')[0].split('?')[0]));
    if (!target || target === '.') return;
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
let written = 0;
for (const [slug, html] of rendered) {
  const out = path.join(PUB, slug);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');
  written++;
}

/* sitemap — every generated page plus the two things that are not generated */
const urls = [...rendered.keys()]
  .filter((s) => s !== '404.html')
  .map((s) => SITE.origin + '/' + (s === 'index.html' ? '' : s.replace(/\/index\.html$/, '/')))
  .concat([SITE.origin + '/work/rhrn.html', SITE.origin + '/pure']);
fs.writeFileSync(path.join(PUB, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n', 'utf8');

/* the mirror: dcalacrity-website/ is an edit copy with no functions. Keeping
   it byte-identical is the only way it cannot disagree with what deploys. */
let mirrored = 0; const pruned = [];
if (fs.existsSync(MIRROR)) {
  const copy = (from, to) => {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
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
