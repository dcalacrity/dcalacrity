# dcalacrity.com — design

**Current: the sixth pass, the halftone plate — §9.** §1–§8 are the fourth and
fifth passes (the sky and the glass arrowhead), kept as the record of what was
tried and why; their visual system is retired.

## The fourth pass (2026-09-17)

Started over. The three passes before this (kept in `DESIGN-passes-1-3.md`)
were rejected as ugly, and on reflection they were: each stacked more effects
on the last — sky gradient, cloud plates, light shafts, bloom, a floor grid,
dust, grain, a graph, a custom cursor, decrypting labels, cards tilting out of
the floor. That is spectacle. The brief is **clean, cinematic, 3D, blue and
violet, with sky**.

## 1 · What the research says, and what it means here

Read before designing: the 2026 Awwwards class (Lando Norris SOTY, Igloo Inc,
Lusion's Oryzo, Hubtown, Iventions, Resend), Utsubo's and MDX's technique
breakdowns, a juror's ten, the Igloo case study, Lusion's Oryzo BTS.

| what wins, consistently | so on this site |
|---|---|
| **One hero object, sold properly.** "A single product, lit and animated with real material response and an orbiting camera, out-performs a busy scene" (Utsubo on Oryzo). "One excellent shader on simple geometry beats a complex scene" (MDX on Resend). Hubtown: one monolith. Igloo: one shard. | **The mark — the electric arrow — is the only object.** Rendered in WebGL as a glass arrowhead with the bolt as its lit core, alone, slowly turning. Nothing else moves in the first screen. |
| **Two colours.** Igloo Inc's palette is exactly two hexes. Lando Norris: two. | Ground `#061018`, ink white, **cyan `#00C2FF`** as the one accent. Violet `#8143FF` lives inside the object and in the sky's last stop, nowhere else. The per-area colour system is gone. |
| **Restraint over spectacle.** "WebGL used for atmosphere instead of spectacle" (juror on Iventions). "Award-winners aren't decorated templates; every type choice, colour and layout grid serves a single idea." | No beams, bloom blobs, floor grid, dust, grain, custom cursor, decrypting text, pinned 3D rail, fanned screenshots. Sections fade in by 24px. That is the whole motion vocabulary besides the object. |
| **Copy as annotation.** Oryzo: "text complements rather than explains the object… brief." Igloo: razor-thin grotesque caps, huge space. | One sentence per section. Headlines in Unbounded at weight 500, not 800. Generous vertical rhythm — 12rem between ideas on a laptop. |
| **Scroll is a camera.** Z-depth, not sliding layers; "each scroll beat advances the narrative." | Scrolling out of the hero moves the object up and away and fades the sky to the ground. Below that the page is still, editorial. |
| **Sky, when it works, is calm.** Craft and Cluely: soft sky gradients, airy, lots of space — never layered photographic drama. | One calm gradient, indigo to blue to a violet horizon, with the brand image's own cloud at low contrast. No second cloud layer. |
| **60 fps on mid-range mobile, reduced-motion paths built deliberately.** | The object never runs on a phone, under reduced motion, or without WebGL; the brand's PNG mark stands in. Watchdog kept. |

## 2 · Tokens

| | |
|---|---|
| ground | `#061018` — the brand's navy, everywhere below the hero |
| ink | `#f2f7fb` · `.62` · `.40` |
| cyan | `#00c2ff` — links, the one button, the diagram, the object's core |
| violet | `#8143ff` — the object's rim and the sky's last stop only |
| line | `rgba(214,236,248,.10)` |
| display | Unbounded 500 (h1 `clamp(2.4rem, 5vw, 4.6rem)`, h2 `clamp(1.6rem, 2.6vw, 2.5rem)`); the thesis phrase at 300 |
| body | Inter 400/500, 17/1.6; lede 20/1.5 |
| labels | JetBrains Mono 11.5px, uppercase, .16em — on section eyebrows only |
| grid | 1200 wrap · 12 columns · gutters `clamp(20px, 4vw, 48px)` · section gap `clamp(6rem, 12vw, 12rem)` |

## 3 · The home page, one idea per screen

1. **Hero.** The sky. The object right of centre, ~44% of the viewport tall.
   Left: eyebrow, *Building the Experience Industry.*, one sentence, one
   button and one text link. Nothing else.
2. **The definition.** One large statement in three lines — *what a person
   meets · the technology that delivers it · the systems that let others
   build it* — and one sentence under it.
3. **Technology.** One product screen, large and flat, with three lines
   beside it and a link. The product's own dark UI on the dark ground.
4. **The compile path.** A single horizontal diagram of five stops. Cyan.
5. **Experiences.** Four properties, 2×2, large images, one line each.
6. **Company.** One paragraph. One link.
7. **Close.** One sentence, one button.

Inner pages use the same rhythm: a plain hero (eyebrow · h1 · lede · one
action), then prose and one visual per section.

## 4 · The object

A chevron arrowhead — tip `(0,1)`, barbs `(±1,-.85)`, notch `(0,-.45)` —
extruded and bevelled, drawn twice (back faces dim, then front) with a fresnel
rim that runs cyan at the tip to violet at the base, a single key highlight,
and the bolt as an emissive ribbon of soft points hanging from the notch. It
turns at 0.12 rad/s, leans toward the pointer, and on scroll rises and recedes
while the sky fades into the ground. Under reduced motion, on a phone, or
without WebGL the brand's PNG mark sits in its place. ~300 lines, no library.

## 5 · Removed from public copy (private)

- Sidequest's on-set spend figure. Never published again — the build refuses
  `1,400` and "on-set spend".
- Welcome to Wilmy's distribution: festival, Cucalorus, cutdowns, release
  windows. Its public status is *in production* and nothing more — the build
  refuses "Cucalorus", "festival cut", "cutdown" and "picture lock" on that page.

## 6 · Built, measured (2026-09-17)

- Home at 1440: the shard is 275 × 490 px right of centre, three-quarter view,
  white tip → cyan → violet base, edges as lines, the bolt a lit ribbon.
  `DCA.measure`: 16.7 ms avg, 0 frames over 32 ms, worst 16.8 ms, scrolled
  half out of the hero with the sky at 0.48.
- ⚠ **The canvas is premultiplied alpha.** With `premultipliedAlpha: false`
  the additive bolt accumulated colour but almost no coverage, and the
  compositor multiplied it away — it rendered as a thin line. Every shader
  writes `vec4(rgb * a, a)`; additive passes blend `ONE, ONE`.
- Phone: the PNG mark sits at 19 % of the hero, 104 px wide, 22–37 px above
  the eyebrow on 844 and 667 px tall screens. Facts stay two columns down to 360.
- All 13 pages at 360 · 390 · 768 · 1024 · 1280 · 1600: no horizontal overflow,
  no text under 11 px, no tap target under 44 px on touch.
- `css/site.css?v=<hash>` and `js/site.js?v=<hash>` — `_build/shell.mjs` hashes
  the files, so `_headers` can cache both for a year without a returning
  visitor ever running one pass's script against another's markup.
- `public/vendor/` is gone. No library.

## 7 · Fifth pass — "even better, more research, more sky" (2026-09-17)

Research this time went to the atmospheric sites specifically: Leeroy's
**ATMOS** (Awwwards case study — a sky as an inverted sphere with animated
noise and a palette sequence, cloud meshes duplicated with only their
transforms changed, the camera on a Catmull-Rom spline, "so lightweight it
didn't need a loader"), Outpost's **Explore Primland** (SOTD Feb 2026 — real
terrain, atmospheric fog, drifting clouds, the camera gliding on scroll),
**Cluely** (the sky-to-mountain blue gradient used only in the hero, never as a
full-page background; white on blue; one vivid accent), Maxime Heckel's
volumetric cloudscapes (raymarched, Beer's law, blue-noise dithering — more
than a company page should spend), and a GLSL atmosphere budget: **~5 ms on
desktop, ~2 ms on a phone**, and "layering simple techniques — fog, noise,
gradients — until the sum exceeds the parts".

What changed:

- **The sky is the whole site.** Every page starts in the brand's daylight —
  its blue sampled from the brand image (`#2f5a98` → `#5b8ec6`) — and reads
  down through the brand violet (`#1f2a6e` → `#6a4fd6`) into the ground. How
  far down is per page: the home page keeps its first three ideas in the sky
  (`--sky-dusk: 2.2`, `--sky-night: 4.2` viewport heights); an inner page has
  its hero and first section there (`0.7` / `1.5`).
- **The static sky is CSS** — a document-length gradient plus the brand's
  cloud plate — and is what phones, reduced motion and no-WebGL get.
- **The live sky is one fragment shader** at 0.6 resolution: two layers of
  value-noise fbm cloud (six octaves; the near layer domain-warped for
  cauliflower edges), lit from the upper left by a second sample, over the
  same six colours keyed to scroll. Clouds are quieted behind the hero copy
  and the nav, thinned to a third where the page is read, and dimmed to almost
  nothing at night. Measured with the object also live: **16.6 ms avg, 0
  frames over 32 ms.**
- **On the sky the accent is white**, not cyan — cyan has no contrast on blue.
  `.on-sky` swaps the ink tokens (ink-2 .84, ink-3 .66), the button to white
  on navy, links to white, the eyebrow to white .72. Cyan returns in the night
  sections. The nav button is white everywhere.
- The h1's second half is `#cdf2ff` on the sky — the two-tone survives, softly.

## 8 · The widgets (2026-09-17, later)

"Make the widget designs cooler. Seriously search up what a 3D cinematic
website is supposed to look like." What the cinematic sites do with their
components, read off Igloo Inc (WebGL text, frost and chromatic transitions,
ice materials), Oryzo/Hubtown (one object with material response and a
pointer-reveal), the react-bits catalogue the user attached (SpotlightCard,
BorderGlow, TiltedCard, ElectricBorder, CountUp, Magnet, PillNav), and Lenis
(inertia). Built in `public/js/widgets.js` (no library) and the widget block
at the end of `site.css`:

- **Glass** (`.glass`): frosted surface with a rim light — property tiles and
  rate cards. The clouds drift behind them. On the sky the glass is whiter.
- **One pointer-light**: `--mx/--my` on the surface under the pointer — a soft
  radial and a brighter run of the border there.
- **Tilt + sheen** (`.tilt`): product screens and card images lean ≤5° toward
  the pointer with a specular sweep.
- **Electric edge**: a noise-displaced stroke traced around the hovered card on
  a small canvas — cyan at night, white on the sky. The brand's electricity.
- **Counters**: facts count up on arrival (never a number with a word before
  it — "Oct 2026" stays).
- **Signal**: a light runs the compile path every 5.5 s.
- **Nav pill**, **magnetic buttons** (±8 px), arrivals that rise *and* sharpen
  (blur 6 → 0) with a stagger inside grids.
- **Inertia on the wheel**: deltas become a target the page eases toward at
  0.12/frame; a scroll we did not make (scrollbar, keys, anchors) resyncs.
  Off on touch and under reduced motion.
- Measured with a card under the pointer: 16.6 ms avg, 0 over 32 ms.

Right Here Right Now! now carries its own pictures (`assets/img/rhrn-*.jpg`:
the poster, the warehouse set, the two Titans and the Canon) — never the
brand's hand image again.

## 9 · Sixth pass — the halftone plate (2026-09-23)

Brief: *"D.C Alacrity page should look something like this"* (the QDT.AI landing
page, Eloqwnt, on Dribbble) and *"seriously revamp the UI"*. The user's
direction wins over §1–§8: the sky, the glass arrowhead, the frosted glass,
the electric edge, the tilt and the wheel inertia are retired, and the build
refuses their classes.

### What the reference does, and what it became here

| QDT.AI | dcalacrity.com |
|---|---|
| a dithered, blurred smoke photo as the hero, small copy in two corners | **the plate**: a live halftone. On home and Technology it is a *story graph* whose playhead chooses a route at every fork — the company's actual capability — with the descriptor bottom-left and *Now in pre-production · Prize Pool VR* bottom-right |
| a white panel carrying the headline, a dark button | `.panel.paper` — eyebrow tag, h1, lede and actions beside it |
| three product cards with dot-matrix art | Pure Alacrity · Alacrity Player · Alacrity Bridge, each art a picture of what it handles: a stripboard, a branching graph, an edit timeline |
| "Select an item 1/4" list beside a detail panel | the five stages of the capability (Author → Deliver), a real `tablist`; numbered because it IS a sequence |
| a white band with a statement that fills in | *What a person meets…* inking in word by word, with three finished things under it |
| numbered 01/02/03 cards, a client-logo strip | **not used** — our properties are not a sequence, and the site shows no third-party logos |
| FAQ with topic chips | eight questions, every answer a sentence the site already stands behind elsewhere |
| contact form with underline inputs beside a smoky card | the contact desk, and the close card on every page — both on a halftone of the brand's own cloud |

### Tokens

| | |
|---|---|
| ink `#03080c` | the ground — between the reference's `#020507` and the brand navy `#061018` |
| well `#0a151c` | cards, the desk, the close |
| tide `#15313b` | the halftone's deep tone — the reference's `#253D42` pulled toward the brand |
| slate `#5e7680` · mist `#a5b7bf` | secondary text, the halftone's light tone |
| paper `#f7fafb` | the panels and white bands (`.paper` swaps every semantic token) |
| spark `#00c2ff` | the brand cyan, used as a **signal only**: the lit route, tag dots, the playhead, focus rings on ink. Never text on paper (2:1) |
| type | Mona Sans — headlines at `font-stretch: 116%` (the wordmark's width), reading at 100%; Geist Mono for labels |

### Measured

- Home at 1440, real GPU: 16.7 ms average, 0 of 181 frames over 32 ms, with the
  16,353-dot graph and the 8,010-dot close plate both live.
- 13 pages × 360 · 390 · 768 · 1024 · 1280 · 1600: no horizontal overflow, no
  text under 11 px, no tap target under 44 px at phone widths (inline links in
  sentences excepted, as WCAG does). Found and fixed on the way: a `1fr` grid
  track that grew to a scrolling row's width (675 px at 360), a 10.9 px label.
- The contact form: validation, the topic from `?topic=`, the eleven fields
  POSTed to `/api/contact`, the success line — unchanged, re-verified with the
  network stubbed. `tests/contact.test.mjs` 14/14.
