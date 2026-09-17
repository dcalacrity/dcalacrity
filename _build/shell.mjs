/* dcalacrity.com — the page shell.
   One source of truth for <head>, the navigation and the footer, so eleven
   pages cannot drift apart. Run ../_build/build.mjs to write public/.
   The output is committed; Cloudflare Pages has no build command. */

export const SITE = {
  origin: 'https://dcalacrity.com',
  name: 'D.C Alacrity',
  /* The company description. It appears in the footer of every page, in the
     press boilerplate and in the metadata, and it is the sentence the site is
     asking to be quoted by. Change it here or not at all. */
  descriptor: 'A technology and media company building the Experience Industry.',
  email: 'pure@dcalacrity.com',
  app: 'https://dcalacrity.com/pure'
};

/* The five areas. `area` sets the accent colour used by the whole page. */
export const NAV = [
  { id: 'technology', href: 'technology.html', label: 'Technology', area: 'tech', note: 'Pure Alacrity · Alacrity Player · Alacrity Bridge' },
  { id: 'work', href: 'work/index.html', label: 'Experiences', area: 'media', note: 'Media & experiences we own' },
  { id: 'research', href: 'research.html', label: 'R&D', area: 'rnd', note: 'What we are investigating' },
  { id: 'about', href: 'about.html', label: 'Company', area: 'co', note: 'The Experience Industry, and why we build' },
  { id: 'services', href: 'services.html', label: 'Services', area: 'svc', note: 'Hire the commercial unit' },
  { id: 'contact', href: 'contact.html', label: 'Contact', area: 'co', note: 'Clients · partners · press · crew' }
];

const rel = (href, depth) => (/^(https?:|mailto:|#)/.test(href) ? href : '../'.repeat(depth) + href);

function nav(current, depth) {
  const links = NAV.map((n) => {
    const cur = n.id === current ? ' aria-current="page"' : '';
    return `<a href="${rel(n.href, depth)}"${cur}>${n.label}</a>`;
  }).join('\n        ');
  return `      <nav class="nav" aria-label="Primary">
        ${links}
        <a class="btn btn--arc btn--sm" href="${SITE.app}">Open Pure Alacrity</a>
      </nav>`;
}

function menu(current, depth) {
  const links = NAV.map((n) => {
    const cur = n.id === current ? ' aria-current="page"' : '';
    return `        <a href="${rel(n.href, depth)}" data-area="${n.area}"${cur}>${n.label} <small>${n.note}</small></a>`;
  }).join('\n');
  return `  <div class="menu" id="menu" aria-hidden="true">
    <nav class="menu__links" aria-label="All pages">
${links}
    </nav>
    <div class="menu__foot">
      <a href="mailto:${SITE.email}">${SITE.email}</a>
      <a class="btn btn--arc btn--sm" href="${SITE.app}">Open Pure Alacrity</a>
    </div>
  </div>`;
}

function footer(depth, note) {
  const r = (h) => rel(h, depth);
  return `  <footer class="foot">
    <div class="wrap">
      <div class="foot__grid">
        <div>
          <div class="foot__brand"><b>D.C</b> Alacrity</div>
          <p>${note || SITE.descriptor}</p>
          <div class="foot__graph" data-graph aria-hidden="true"></div>
        </div>
        <div>
          <h4>Company</h4>
          <nav>
            <a href="${r('about.html')}">Company &amp; vision</a>
            <a href="${r('research.html')}">Research &amp; development</a>
            <a href="${r('press.html')}">Press kit</a>
            <a href="${r('contact.html')}">Contact</a>
          </nav>
        </div>
        <div>
          <h4>Technology</h4>
          <nav>
            <a href="${r('technology.html')}">Overview</a>
            <a href="${SITE.app}">Pure Alacrity</a>
            <a href="${r('work/right-here-right-now.html')}">Alacrity Player</a>
            <a href="${r('services.html')}">Services</a>
          </nav>
        </div>
        <div>
          <h4>Experiences</h4>
          <nav>
            <a href="${r('work/index.html')}">All work</a>
            <a href="${r('work/sidequest.html')}">Sidequest</a>
            <a href="${r('work/right-here-right-now.html')}">Right Here Right Now!</a>
            <a href="${r('work/prize-pool.html')}">Prize Pool</a>
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
 * page({ slug, title, description, area, current, body, head, footNote, ogImage })
 * `slug` is the path inside public/ — 'index.html', 'work/sidequest.html'.
 */
export function page(o) {
  const depth = (o.slug.match(/\//g) || []).length;
  const r = (h) => rel(h, depth);
  const canonical = SITE.origin + '/' + (o.slug === 'index.html' ? '' : o.slug.replace(/\/index\.html$/, '/'));
  const og = o.ogImage || 'assets/img/dcalacrity.jpg';
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
  <meta name="theme-color" content="#05090f"/>
  <link rel="icon" href="${r('assets/img/favicon.png')}" type="image/png"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&display=swap"/>
  <link rel="stylesheet" href="${r('css/site.css')}"/>${o.head ? '\n' + o.head : ''}
</head>
<body${o.area ? ` class="t-${o.area}"` : ''}>
  <a class="skip" href="#main">Skip to content</a>

  <header class="top">
    <a class="brand" href="${r('index.html')}">
      <img src="${r('assets/img/logo-mark.jpg')}" alt="" width="34" height="34" fetchpriority="high"/>
      <span><b>D.C</b> Alacrity</span>
    </a>
${nav(o.current, depth)}
    <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu">
      <span></span><span></span><span></span>
    </button>
  </header>

${menu(o.current, depth)}

  <main id="main">
${o.body}
  </main>

${footer(depth, o.footNote)}

  <script src="${r('vendor/gsap.min.js')}" defer></script>
  <script src="${r('vendor/ScrollTrigger.min.js')}" defer></script>
  <script src="${r('js/site.js')}" defer></script>
</body>
</html>
`;
}

/* ——— small builders used by more than one page ——— */

export const band = (title, lede, actions) => `    <section class="band">
      <div class="wrap" data-rise>
        <h2>${title}</h2>
        <p class="lede">${lede}</p>
        <div class="btn-row">${actions}</div>
      </div>
    </section>`;

export const phero = (o) => `    <header class="phero">
      <div class="wrap">
        <div class="phero__grid">
          <div>
            <p class="eyebrow">${o.eyebrow}</p>
            <h1>${o.title}</h1>
            <p class="lede">${o.lede}</p>
            ${o.actions ? `<div class="btn-row">${o.actions}</div>` : ''}
          </div>
          ${o.aside ? `<div>${o.aside}</div>` : ''}
        </div>
      </div>
    </header>`;

export const facts = (rows) => `      <div class="facts" data-rise>
${rows.map((f) => `        <article><strong>${f[0]}</strong><span>${f[1]}</span></article>`).join('\n')}
      </div>`;
