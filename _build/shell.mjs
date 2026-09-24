/* dcalacrity.com — the page shell.
   One source of truth for <head>, the navigation and the footer, so the
   pages cannot drift apart. Run ../_build/build.mjs to write public/.
   The output is committed; Cloudflare Pages has no build command. */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

/* css and js are cached hard by _headers, so their URLs carry a content hash —
   a new build is a new URL, and no visitor runs last pass's script against
   this pass's markup */
const PUB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
export const ver = (rel) => crypto.createHash('sha1').update(fs.readFileSync(path.join(PUB, rel))).digest('hex').slice(0, 10);
export const ASSET = { css: '/css/site.css?v=' + ver('css/site.css'), js: '/js/site.js?v=' + ver('js/site.js'), widgets: '/js/widgets.js?v=' + ver('js/widgets.js') };

export const SITE = {
  origin: 'https://dcalacrity.com',
  name: 'D.C Alacrity',
  /* The company description. Footer of every page, press boilerplate,
     metadata. It is the sentence the site is asking to be quoted by. */
  descriptor: 'A technology and media company building the Experience Industry.',
  email: 'support@dcalacrity.com',
  app: 'https://dcalacrity.com/pure'
};

export const NAV = [
  { id: 'technology', href: 'technology.html', label: 'Technology', note: 'Pure Alacrity · Alacrity Player · Alacrity Bridge' },
  { id: 'work', href: 'work/index.html', label: 'Experiences', note: 'Media and experiences we own' },
  { id: 'research', href: 'research.html', label: 'R&D', note: 'What we are investigating' },
  { id: 'about', href: 'about.html', label: 'Company', note: 'The Experience Industry, and why we build' },
  { id: 'services', href: 'services.html', label: 'Services', note: 'Hire the commercial unit' },
  { id: 'contact', href: 'contact.html', label: 'Contact', note: 'Clients · partners · press · crew' }
];

/* Every internal link is root-relative and extensionless — the form Cloudflare
   Pages serves without a redirect hop (it 301s /x.html to /x on its own). */
export const clean = (href) => {
  if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) return href;
  const m = href.match(/^([^?#]*)(.*)$/);
  let p = m[1], rest = m[2] || '';
  p = p.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
  if (/\.html$/.test(p)) p = p.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
  return '/' + p + rest;
};
const r = clean;

function nav(current) {
  return `      <nav class="nav" aria-label="Primary">
        ${NAV.map((n) => `<a href="${r(n.href)}"${n.id === current ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n        ')}
      </nav>`;
}

function menu(current) {
  return `  <div class="menu" id="menu" aria-hidden="true">
    <nav class="menu__links" aria-label="All pages">
${NAV.map((n) => `        <a href="${r(n.href)}"${n.id === current ? ' aria-current="page"' : ''}>${n.label} <small>${n.note}</small></a>`).join('\n')}
    </nav>
    <div class="menu__foot">
      <a href="mailto:${SITE.email}">${SITE.email}</a>
      <a class="btn btn--sm" href="${SITE.app}">Open Pure Alacrity</a>
    </div>
  </div>`;
}

function footer(note) {
  return `  <footer class="foot">
    <div class="wrap">
      <div class="foot__grid">
        <div>
          <img class="foot__lockup" src="/assets/brand/lockup.png" alt="D.C Alacrity" width="1400" height="440" loading="lazy"/>
          <p>${note || SITE.descriptor}</p>
        </div>
        <div>
          <h4>Company</h4>
          <nav aria-label="Company">
            <a href="${r('about.html')}">Company &amp; vision</a>
            <a href="${r('research.html')}">Research &amp; development</a>
            <a href="${r('press.html')}">Press kit</a>
            <a href="${r('contact.html')}">Contact</a>
          </nav>
        </div>
        <div>
          <h4>Technology</h4>
          <nav aria-label="Technology">
            <a href="${r('technology.html')}">Overview</a>
            <a href="${SITE.app}">Pure Alacrity</a>
            <a href="${r('technology.html#player')}">Alacrity Player</a>
            <a href="${r('services.html')}">Services</a>
          </nav>
        </div>
        <div>
          <h4>Experiences</h4>
          <nav aria-label="Experiences">
            <a href="${r('work/index.html')}">All work</a>
            <a href="${r('work/sidequest.html')}">Sidequest</a>
            <a href="${r('work/right-here-right-now.html')}">Right Here Right Now!</a>
            <a href="${r('work/prize-pool.html')}">Prize Pool VR</a>
            <a href="${r('work/welcome-to-wilmy.html')}">Welcome to Wilmy</a>
          </nav>
        </div>
      </div>
      <div class="foot__bottom">
        <span>© <span data-year>2026</span> D.C Alacrity · North Carolina</span>
        <span><a href="mailto:${SITE.email}">${SITE.email}</a></span>
      </div>
    </div>
  </footer>`;
}

/**
 * page({ slug, title, description, current, body, head, footNote, ogImage })
 * `slug` is the path inside public/ — 'index.html', 'work/sidequest.html'.
 */
export function page(o) {
  const canonical = SITE.origin + clean(o.slug);
  const og = o.ogImage || 'assets/brand/og.jpg';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${o.title}</title>
  <meta name="description" content="${o.description}"/>
  <link rel="canonical" href="${canonical}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="D.C Alacrity"/>
  <meta property="og:title" content="${o.ogTitle || o.title}"/>
  <meta property="og:description" content="${o.ogDescription || o.description}"/>
  <meta property="og:image" content="${SITE.origin}/${og}"/>
  <meta property="og:url" content="${canonical}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="theme-color" content="#03080c"/>
  <link rel="icon" href="/assets/brand/favicon.png" type="image/png"/>
  <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wdth,wght@0,75..125,200..900;1,75..125,200..900&family=Geist+Mono:wght@400;500&display=swap"/>
  <link rel="stylesheet" href="${ASSET.css}"/>${o.head ? '\n' + o.head : ''}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

  <header class="top">
    <a class="brand" href="/" aria-label="D.C Alacrity — home">
      <img class="brand__mark" src="/assets/brand/mark.png" alt="" width="176" height="320" fetchpriority="high"/>
      <img class="brand__word" src="/assets/brand/wordmark.png" alt="D.C Alacrity" width="1200" height="407"/>
    </a>
${nav(o.current)}
    <div class="top__end">
      <a class="btn btn--sm btn--quiet top__cta" href="${SITE.app}">Open Pure Alacrity</a>
      <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

${menu(o.current)}

  <main id="main">
${o.body}
  </main>

${footer(o.footNote)}

  <script src="${ASSET.js}" defer></script>
  <script src="${ASSET.widgets}" defer></script>
</body>
</html>
`;
}

/* ——— builders shared by pages ——— */

/* The plate: a halftone of the page's own subject. 'graph' draws the live
   story graph; anything else is an image path under public/, rendered as
   dots whose size follows its brightness. The CSS layer under the canvas is
   what shows without WebGL. Decorative — the words live beside it. */
export const plate = (src, size) => {
  const img = src && src !== 'graph';
  return `<div class="plate plate--${size}${img ? ' plate--img' : ''}" data-plate="${img ? 'image' : 'graph'}"${img ? ` data-src="/${src}" style="--plate-img:url(/${src})"` : ''} aria-hidden="true"></div>`;
};

/* An inner page's opening: its plate, then a paper panel with the headline.
   `lead` makes room for a first section that rises over the panel's edge. */
export const phero = (o) => `    <header class="phero">
      ${plate(o.plate || 'assets/brand/sky-cloud.jpg', 'page')}
      <div class="panel paper${o.lead ? ' panel--lead' : ''}">
        <div class="wrap panel__grid">
          <div>
            <p class="eyebrow">${o.eyebrow}</p>
            <h1>${o.title}</h1>
          </div>
          <div class="panel__side">
            <p class="lede">${o.lede}</p>
            ${o.actions ? `<div class="btn-row">${o.actions}</div>` : ''}
          </div>
        </div>
      </div>
    </header>`;

/* Every page ends at one card: what to do next, the direct line, and a door
   into the app on a plate of the brand's own cloud. */
export const close = (title, lede, actions) => `    <section class="close">
      <div class="wrap" data-rise>
        <div class="close__card">
          <div class="close__copy">
            <h2>${title}</h2>
            <p class="lede">${lede}</p>
            <dl class="close__facts">
              <div><dt>Write to</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd></div>
              <div><dt>Based in</dt><dd>North Carolina</dd></div>
              <div><dt>The suite</dt><dd><a href="${SITE.app}">dcalacrity.com/pure</a></dd></div>
            </dl>
            <div class="btn-row">${actions}</div>
          </div>
          <div class="close__plate">
            ${plate('assets/brand/sky-cloud.jpg', 'fill')}
            <a class="close__note" href="${SITE.app}"><span><b>Pure Alacrity is free.</b>No account, and it works with no internet.</span></a>
          </div>
        </div>
      </div>
    </section>`;

export const facts = (rows) => `      <div class="facts" data-rise>
${rows.map((f) => `        <div><strong>${f[0]}</strong><span>${f[1]}</span></div>`).join('\n')}
      </div>`;

/* A statement that inks in as it is read: each word its own span, so the
   script only has to count. [text, bold] pairs. */
export const fill = (parts) => parts.map(([text, bold]) => {
  const w = text.split(/\s+/).filter(Boolean).map((x) => `<span class="w">${x}</span>`).join(' ');
  return bold ? `<b>${w}</b>` : w;
}).join(' ');
