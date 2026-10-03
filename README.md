# D.C Alacrity — dcalacrity.com

Official site. Cloudflare Pages, no build command, `public/` is what deploys.

| URL | What |
| --- | --- |
| **https://dcalacrity.com** | This site (canonical) |
| https://www.dcalacrity.com | Must resolve in DNS, then 301 → apex |
| https://dcalacrity.com/pure | **Pure Alacrity** — a separate Worker, not in this repo |

---

## ⚠ Clean URLs — and the redirect loop that shipped once

Cloudflare Pages serves `/technology.html` at **`/technology`** and **301s the
`.html` form to the clean one on its own.** So a `_redirects` rule of the form
`/technology /technology.html` loops — Pages sends it straight back — and the
browser says *"redirected you too many times"*. That rule was live for part of
2026-09-16. Never point a redirect at a `.html` path.

Every internal link on the site is therefore **root-relative and extensionless**
(`/technology`, `/work/`, `/work/sidequest`, `/contact?topic=…`). Page sources
are still written with relative `.html` links because that reads naturally;
`build.mjs` rewrites them and **refuses to write** if any emitted link carries
`.html` or is not root-relative. `shot.mjs` serves clean URLs the way Pages does.
The canonical tags and the sitemap use the clean form.

## The pages are generated. Never hand-edit `public/*.html`.

Eleven pages share one `<head>`, one navigation and one footer, so they live in
`_build/` and are rendered into `public/`. A hand edit is overwritten by the
next build without warning.

⚠ **It has happened.** On 2026-09-23 the Prize Pool VR page, the switch to
`support@dcalacrity.com` and the Prize Pool naming across eight pages had been
made in `public/` only. The generator still held the old page (`~35 nodes`,
`6–8 endings`), so the next build would have silently put it back. Found by
building into a scratch copy and diffing it against `public/` — do that before
any build if you suspect a hand edit: every difference that is not a
`?v=` hash is work the generator does not know about.

```bash
node "dcalacrity-com/_build/build.mjs"
```

| File | What is in it |
| --- | --- |
| `_build/shell.mjs` | head, nav, the full-screen menu, footer, `SITE.descriptor`, and the shared builders `phero` · `plate` · `close` · `facts` · `fill` |
| `_build/pages-core.mjs` | home · technology · research · about (Company) · press |
| `_build/pages-work.mjs` | work index and the four property pages |
| `_build/pages-rest.mjs` | services · contact · 404 |
| `_build/build.mjs` | renders, **checks**, writes `public/`, refreshes the sitemap, mirrors |

**The build refuses to write if a check fails**, and the checks are the point:

- every relative link resolves to a file that exists, and every `#fragment` has
  a target on its own page
- exactly one `<h1>` per page, and balanced tags
- `support@dcalacrity.com` is the only address offered anywhere
- nothing from the retired pass-3 vocabulary (`data-area`, `t-*`, `btn--area`,
  `band`, `flat`) or the pass-5 sky (`glass`, `on-sky`, `skyline`, `tilt`,
  `sheen`) — the stylesheet no longer defines either
- every plate's `data-src` image exists — a missing one draws nothing, silently
- **two private things never ship**: Sidequest's on-set spend (`1,400`,
  "on-set spend") anywhere, and Welcome to Wilmy's distribution — "Cucalorus",
  "festival cut", "cutdown", "picture lock", "release window" — on its page.
  Its public status is *in production* and nothing more; distribution is
  undecided.
- **the company description rules** — "full-stack media company", "North
  Carolina–based production company", "media studio" and bare "production
  company" are refused, and so is any sentence saying Sidequest was made on
  Pure Alacrity

Three files are **not** generated and are edited directly:
`public/css/site.css`, `public/js/site.js` and `public/js/widgets.js`.

---

## Looking at it — do not judge this site from source

The in-app browser preview reports `prefers-reduced-motion: reduce`, so the
plates only ever draw their still frame there.
Use the site's own probe, which emulates no-preference:

```bash
node "dcalacrity-com/_build/shot.mjs" index.html out.png --w 1440 --h 900
```

| flag | what it does |
| --- | --- |
| `--calm` | emulate reduced motion — the plates draw one still frame, and nothing waits to arrive (use it for layout review) |
| `--headed` | a real window with the real GPU |
| `--widths 390,834,1280,1600` | re-run `--eval` and shoot at each width |
| `--eval "<js>"` | print a value from the page |
| `--full` | capture past the viewport |
| `--no-shot` | measure only |

`index.html#compiler` and the other section ids work as the page argument.

⚠ **Do not use Pure Alacrity's `_scramble/shot.js` here.** Its server does not
send a usable content type for `.css`, so the page renders completely unstyled
and looks broken when it is not.

### Measured, 1440×900, real Chrome (sixth pass)

| | avg frame | frames > 32 ms | worst |
| --- | --- | --- | --- |
| home, the graph plate live (16,353 dots) + the close plate (8,010) — sixth pass, `--headed` | 16.7 ms | 0 of 181 | 16.8 ms |
| home, scrolled to the close card, both plates live | 16.6 ms | 0 of 182 | 16.9 ms |

No vendor script. First visit is site.css, site.js (~27 KB), widgets.js, the
mark and the wordmark, and the page's plate image; product screenshots and
property images are below the fold and lazy-loaded. `DCA.measure(ms)` returns
those numbers from any page, with the plates it is drawing.
Every page at 360 · 390 · 768 · 1024 · 1280 · 1600: no horizontal overflow, no
text under 11 px, no tap target under 44 px on touch. Tables scroll inside
`.table-wrap`.

---

## The brand

`D.C Alacrity Brand Package v2.pdf` (2026-09-16) is the source. Its measured
values are the tokens: ground **#061018**, cyan **#00C2FF** (the wordmark's period
square), violet **#8143FF** (the bolt's tail), white-hot **#E7FAFF** (the tip).
The assets in `public/assets/brand/` were cut from the PDF's embedded images
with their alpha channels (`mark.png`, `wordmark.png`, `lockup.png`,
`hero-hand.jpg`, `favicon.png`, `apple-touch-icon.png`, `og.jpg`). The nav is
the real mark + wordmark; the footer is the lockup; the press kit offers them.

Type (sixth pass): **Mona Sans** throughout, with its width axis doing the
pairing — headlines at `font-stretch: 116%`, which echoes the wordmark's
extended letterforms, reading text at 100%. **Geist Mono** for labels, tags
and figures. Both from Google Fonts, the only font host.

## The plate — sixth pass (2026-09-23)

Asked for: *"D.C Alacrity page should look something like this"* — the QDT.AI
landing page by Eloqwnt on Dribbble — and *"seriously revamp the UI"*. What was
read off that shot, frame by frame: a near-black and deep-teal palette
(`#020507 #253D42 #526367 #6F858F #9EACB0 #FDFEFE`), a **dithered halftone
image** as the hero with small copy in its corners, a **white panel** under it
carrying the headline, dot-matrix art on product cards, a list-and-detail
selector, a statement that inks in, a filtered FAQ, and a contact form beside a
smoky card. DESIGN.md §9 has the mapping.

**Every page opens on a halftone plate of its own subject**, then a paper panel
with the headline. `plate(src, size)` in `shell.mjs`; the engine is part 2 of
`public/js/site.js`, raw WebGL, no library.

- **One GL point per halftone cell.** The screen is rows offset by half a cell,
  like print. Everything per-cell — the smoke, the story graph, the pointer's
  lens — runs once per dot in the **vertex** shader, which sets
  `gl_PointSize`; the fragment shader only draws a disc. ~16k dots on a laptop
  hero, one draw call.
- **`'graph'`** (home, Technology, 404): a 17-node branching story with a merge
  and four endings. A playhead walks from the start, **chooses at every fork**,
  and the route it takes lights up in the brand cyan until an ending, then it
  fades and begins again. On a portrait plate (a phone) the story runs top to
  bottom. With motion off, one still frame is drawn with a finished route.
- **An image path** (every other page): the picture is sampled once per cell on
  the CPU, levelled from its **3rd–97th percentile** — min/max left a night
  scene as nothing but the moon — and drifted by the same slow smoke.
- **Fallbacks.** No WebGL (or a driver whose points cannot reach 24 px): the
  CSS layer under the canvas is a uniform dot screen over the same field, or
  the image through a teal filter. Reduced motion or save-data: one still
  frame. A watchdog stills every plate if more than 18 of the first 90 frames
  run long.

**The widgets** (`public/js/widgets.js`): Canvas-2D dot art on the three
product cards and the five capability stages, each a picture of what that
thing handles — a stripboard, a branching graph, an edit timeline, loose pieces
becoming one bundle, a signal going out. At rest each shows its one spark; on
hover (cards) or while open (stages) the spark moves. The stages are a real
`tablist` with arrow keys, Home and End; the questions are `<details>` with a
topic filter; the paper-band statement inks in word by word as it is read. With
no script every panel and every answer shows and the statement is already dark.

⚠ **A single-column grid must be `minmax(0, 1fr)`, never `1fr`.** The stage
tabs become one horizontally scrolling row on a phone, and a `1fr` track grows
to that row's full width: at 360 px the page measured **675 px wide** and Chrome
widened the layout viewport to fit it. Every one-column fallback in `site.css`
is `minmax(0, 1fr)` now; the width sweep is what caught it.

⚠ **`[data-rise]` hides nothing until the script has marked what is already on
screen** (`html.rise-ready`). A full-page capture that does not scroll will
still show blank bands below the fold — that is the arrival waiting, not a
missing section. Use `--calm` for layout review.

## Copy rules (enforced by the build)

- The company is **a technology and media company**. Not a studio, not a
  production company, not a media company.
- **D.C Alacrity Productions is a production credit**, not a description of
  the company. It stays on credits and call sheets.
- **Sidequest is pitched Adam-first.** The lead is Adam Dawnbringer — 21, freshly
  fired, treats life like a video game, gets the crew back together; the heist
  comedy is the front story; the Trojan Stallion, the Cyber Realm and the Igbo
  death-deity Ogbunabali are the antagonist's origin — *the world underneath*,
  never the logline. Source: the series' own deck in `Sidequest.production.json`
  → `ipWorkspace.pitchDecks` and `ipBible.premise`. Tagline: *No job too illegal.
  No debt too deep. No exit from the game.*
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
- There is no `vendor/` any more: since pass 4 the site loads no library.

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
`support@dcalacrity.com`. `GET /api/contact` is a health check. See
`CONTACT-FORM.md`; tests in `tests/` and deliberately not in `functions/`,
which Cloudflare would try to serve as routes.
