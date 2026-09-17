# D.C Alacrity — dcalacrity.com

Official site. Cloudflare Pages, no build command, `public/` is what deploys.

| URL | What |
| --- | --- |
| **https://dcalacrity.com** | This site (canonical) |
| https://www.dcalacrity.com | Must resolve in DNS, then 301 → apex |
| https://dcalacrity.com/pure | **Pure Alacrity** — a separate Worker, not in this repo |

---

## The pages are generated. Never hand-edit `public/*.html`.

Eleven pages share one `<head>`, one navigation and one footer, so they live in
`_build/` and are rendered into `public/`. A hand edit is overwritten by the
next build without warning.

```bash
node "dcalacrity-com/_build/build.mjs"
```

| File | What is in it |
| --- | --- |
| `_build/shell.mjs` | head, nav, the full-screen menu, footer, `SITE.descriptor` |
| `_build/pages-core.mjs` | home · technology · research · about (Company) · press |
| `_build/pages-work.mjs` | work index and the four property pages |
| `_build/pages-rest.mjs` | services · contact · 404 |
| `_build/build.mjs` | renders, **checks**, writes `public/`, refreshes the sitemap, mirrors |

**The build refuses to write if a check fails**, and the checks are the point:

- every relative link resolves to a file that exists, and every `#fragment` has
  a target on its own page
- exactly one `<h1>` per page, and balanced tags
- `pure@dcalacrity.com` is the only address offered anywhere
- `data-area` / `t-*` only use areas the stylesheet actually defines
- **the company description rules** — "full-stack media company", "North
  Carolina–based production company", "media studio" and bare "production
  company" are refused, and so is any sentence saying Sidequest was made on
  Pure Alacrity

Two files are **not** generated and are edited directly:
`public/css/site.css` and `public/js/site.js`.

---

## Looking at it — do not judge this site from source

The in-app browser preview reports `prefers-reduced-motion: reduce`, so the
hero's WebGL layer never starts there and you will only ever see the fallback.
Use the site's own probe, which emulates no-preference:

```bash
node "dcalacrity-com/_build/shot.mjs" index.html out.png --w 1440 --h 900
```

| flag | what it does |
| --- | --- |
| `--calm` | emulate reduced motion — how the SVG fallback really looks |
| `--headed` | a real window with the real GPU |
| `--widths 390,834,1280,1600` | re-run `--eval` and shoot at each width |
| `--eval "<js>"` | print a value from the page |
| `--full` | capture past the viewport |
| `--no-shot` | measure only |

`index.html#compiler` and the other section ids work as the page argument.

⚠ **Do not use Pure Alacrity's `_scramble/shot.js` here.** Its server does not
send a usable content type for `.css`, so the page renders completely unstyled
and looks broken when it is not.

### Measured, 1440×900, real Chrome

| | avg frame | frames > 32 ms | worst |
| --- | --- | --- | --- |
| hero, WebGL on | 16.6 ms | 0 of 182 | 16.8 ms |
| hero, reduced motion | 16.6 ms | 0 of 182 | 16.8 ms |
| phone (390) | 16.6 ms | 0 of 182 | 16.8 ms |

First visit transfers **210 KB** uncompressed: GSAP 71, ScrollTrigger 44,
site.css 45, site.js 34, favicon 12, logo 4. The product screenshots are below
the fold and lazy-loaded. `DCA.measure(ms)` returns those numbers from any page.

---

## The hero

The signature is the **story graph of *Right Here Right Now!*** — the real
topology of a released interactive film, read out of the bundle the Unity
runtime plays, drawn in WebGL as a plane in perspective with a pulse travelling
every choice. `GRAPH` in `public/js/site.js` holds it.

It does not run on a phone, under reduced motion, without WebGL or with
`saveData`, and a watchdog stops it if more than 12 of the first 60 frames take
longer than 58 ms. In every one of those cases the same graph, the same camera
and the same warmth rule are drawn once as inline SVG. Both paths must agree —
if you change `PLANE`, `cam` or the colours, you have changed both.

⚠ **Layer order in the hero is load-bearing.** `stage__floor` before
`stage__sun`, or the floor's dark gradient paints over the sun and it turns
grey. The rays are `mix-blend-mode: screen`; composited normally, a warm
translucent wedge on a deep blue sky reads as a *dark* streak.

⚠ **The rays element is larger than the stage** so rotating it never shows an
edge — which means the sun's position inside it is not the same percentage as
inside the stage. `inset: -12%` makes it 124%, so 79%/64.5% of the stage is
73.4%/61.7% of the element. Get this wrong and the rays are drawn off-frame and
look like they are missing.

---

## Copy rules (enforced by the build)

- The company is **a technology and media company**. Not a studio, not a
  production company, not a media company.
- **D.C Alacrity Productions is a production credit**, not a description of
  the company. It stays on credits and call sheets.
- **Pure Alacrity was built out of Sidequest, not for it.** Development began
  January 2026; it has run real productions since March 2026. The season was
  not made on it.
- Every number on the site shipped or was measured. No testimonials, no
  third-party logos.

`SITE.descriptor` in `_build/shell.mjs` is the one-sentence description used in
the footer of every page and in the press boilerplate. Change it there.

---

## The other two things in `public/`

- **`work/rhrn.html`** — the Right Here Right Now! experience microsite, 22 MB
  with its footage inlined. Never hand-edit it; `_build/patch-rhrn.mjs` makes
  surgical changes, refuses if the file size moves by more than 4 KB, and
  mirrors. It passes a **function** to every replacement, because a `$`
  followed by a quote in a replacement string means "everything after the
  match" and has spliced a file into itself in this repo before.
- **`vendor/`** — GSAP 3.15.0 and ScrollTrigger, self-hosted so the page pulls
  no third-party script. Cached for a year by `_headers`.

## The mirror

`../dcalacrity-website/` is an edit copy with no `functions/` and no
`wrangler.toml`, so **it does not deploy**. `build.mjs` overwrites it from
`public/` on every run, so the two cannot disagree. Editing it does nothing.

---

## Pages build settings

| Field | Value |
| --- | --- |
| Framework preset | None |
| Build command | *(empty)* |
| **Build output directory** | **`public`** |
| Root directory | *(empty)* |

If `*.pages.dev` 404s, the output directory is wrong.

## Contact form

`POST /api/contact` (a Pages Function) stores the lead, then emails
`pure@dcalacrity.com`. `GET /api/contact` is a health check. See
`CONTACT-FORM.md`; tests in `tests/` and deliberately not in `functions/`,
which Cloudflare would try to serve as routes.
