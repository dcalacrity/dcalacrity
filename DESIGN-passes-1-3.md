# dcalacrity.com — design plan (2026-09-16)

Written before the code. The brief: the site kept describing a production
company that also writes software; the company is a technology and media
company whose first productions are the first applications of a broader
mission. And the interface should be 3D and cinematic, a complete change.

## 1 · Subject, audience, one job

**Subject.** D.C Alacrity: original IP, software and interactive experiences.
The organising idea is the Experience Industry — what people experience, the
technology that delivers it, and the systems that let other people create it.
The concrete capability under all three is a written branching story compiled
into a playable experience (story graph → bundle → Alacrity Player → headset),
and Pure Alacrity, the production suite that runs real productions.

**Who arrives.** A partner or investor deciding what kind of company this is.
A journalist reusing the boilerplate. A filmmaker deciding whether to open
Pure Alacrity. A local business looking at the rate card. A crew member.

**The page's one job.** A new visitor can say, unaided: what D.C Alacrity is,
what it has built so far, and why those first products support a broader future.

## 2 · Where the look comes from — sunlight on a stage, and the graph on it

**Revised mid-build on the user's note: "more sunlight."** The first pass was a
near-black stage, which was wrong for this brand — the company's own mark is a
hand raised against a bright sky. The hero is now lit: a sun sitting on the
horizon at 79% / 64.5%, light shafts fanning up through haze, and the story
graph crossing in front of it. The floor plane in the WebGL layer converges at
the same point the sun occupies, so the picture agrees with itself.

Four things were learned the hard way and are recorded in the README:

- **Layer order is load-bearing.** The floor must be painted before the sun or
  its dark gradient covers the sun and turns it grey.
- **Light shafts must be `mix-blend-mode: screen`.** Composited normally, a
  warm translucent wedge over a deep blue sky reads as a *dark* streak.
- **The rays element is bigger than the stage**, so the sun's position inside
  it is a different percentage. Getting this wrong drew them off-frame.
- **Additive glow cannot read on a bright background.** Lifting the whole sky
  made the graph vanish; the answer was a dark sky with one brilliant quarter,
  not an evenly bright one.



Every branching story the company has shipped exists first as a graph: nodes,
choices, paths. The hero is that graph — the real topology of *Right Here
Right Now!* (14 scene nodes, 18 choices, exported from the shipped bundle) —
standing in three-dimensional space, receding into the dark like a set seen
from the camera position, with a pulse of light travelling the paths. Scrolling
dollies the camera into it. Nothing else on the site competes with it.

This continues the product's "lit stage" (the Pure Alacrity front door): the
same blue-black, the same warm key light on the media side, the same monospace
labels. The company site is the wide shot; the product is the close-up.

### Tokens

| token | value | role |
|---|---|---|
| `--void` | `#05090f` | the dark. Blue-biased, taken from the logo's sky at dusk |
| `--deep` | `#0b1622` / `--deep-2` `#10202f` | surfaces, flats |
| `--arc` | `#35d6ff` | the bolt in the logo. **Technology** |
| `--arc-hot` | `#a6f2ff` | its highlight |
| `--ember` | `#ffb35c` | tungsten key light. **Media & experiences** |
| `--plasma` | `#b04dff` | the violet flare at the logo's base. **Research & development** |
| `--sky` | `#4b8fd9` | daylight fill. **Services** |
| `--ink` | `#eef5f9` | reading colour; `--ink-2` at .66, `--ink-3` at .42 |

The three area colours are structure, not decoration: technology is cyan,
media is ember, research is plasma, everywhere on the site.

**Type.** Display and body: *Bricolage Grotesque* (variable, optical sizes —
warm, slightly hand-made, the opposite of a template grotesk). Accent:
*Instrument Serif* italic for the phrases that carry the thesis. Labels and
data: *JetBrains Mono* at 11–12px, uppercase, .16em tracking (the product uses
the same monospace label layer). Scale: h1 `clamp(44px, 7.2vw, 112px)` at
tracking −.035em, h2 `clamp(30px, 3.6vw, 56px)`, lede 20/1.5, body 17/1.6.

**Layout.** 1280 wrap, twelve columns, `clamp(20px, 4vw, 48px)` gutters.
Sections are flats that stand up out of the floor as they arrive (a shallow
`rotateX` from below, perspective on the section, never on the page).

**Signature.** The story graph in WebGL: points and lines with perspective,
additive glow, pulses along every path, tilted by the pointer, dollied by the
scroll. A third of the resolution is not needed here — a few hundred vertices —
but the same watchdog as the product door stops it on a machine that drops
frames. Under reduced motion, on a phone, without WebGL or with `saveData`, the
same graph is drawn once as inline SVG. Real HTML text sits over it throughout.

## 3 · Structure

| nav | page | what the visitor finds |
|---|---|---|
| Technology | `technology.html` (new) | Pure Alacrity (available), Alacrity Player (shipped in RHRN!), Alacrity Bridge (in development): interfaces, the problems each solves, how they connect, who can use them |
| Media & Experiences | `work/` | Sidequest, Right Here Right Now!, Prize Pool, Welcome to Wilmy as owned properties and applications of the capabilities |
| R&D | `research.html` (new) | what is being investigated; **available · in development · ambition** kept visibly apart |
| Company | `about.html` | the definition of the Experience Industry, why the company was founded, the principles guiding expansion, the founder as the decisions behind the company, credits |
| Services | `services.html` | the commercial arm, with the rate card where those visitors need it |
| Contact | `contact.html` | the form, routed by topic |

Homepage order: purpose → the definition → areas of activity → technology
evidence → media evidence → how it extends → routes to watch, use, hire, partner.

## 4 · Motion

Load: the graph fades up (0.8 s), the headline rises word by word (from 150 ms),
lede and actions follow, one key-light sweep across the hero. Scroll: GSAP
ScrollTrigger, scrub `0.8`, native scroll kept (Lenis's own manifesto argues
against hijacking it; the smoothing lives in the scrub). Flats rise on entry;
the compiler rail pins on a laptop and is a snap strip on a phone; product
screens fan in depth and cycle. Hover: flats tilt 3°, a spotlight follows the
pointer. `prefers-reduced-motion: reduce` turns everything off, not down.
Nothing is hidden waiting for JavaScript.

Libraries: GSAP 3.15 core + ScrollTrigger, self-hosted in `public/vendor/`
(117 KB, deferred). No three.js, no React; the hero shader is ~60 lines of GLSL.

## 5 · What the research said (and what was taken)

- The Awwwards class of 2026 drives whole experiences from scroll and stages
  each section as a beat — entrance, hold, exit — rather than stacking effects
  ([Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)).
- One visual idea, committed to completely; real HTML text under the WebGL;
  every site runs on a phone; typography and pacing matter more than polygon
  count ([Dappasol, ten cinematic sites](https://dappasol.com/guides/cinematic-website-examples/)).
- GSAP as the orchestrator, one frame loop, `will-change` only while moving,
  scenes warmed before they are visible, separate desktop and mobile logic via
  `gsap.matchMedia()` ([Codrops, the Trionn architecture](https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/)).
- Restraint wins: By-Kin took four awards with editorial type and weighted
  scroll; Iventions used three.js for mood, not show
  ([a juror's ten](https://www.hontran.dev/blog/best-award-winning-websites-2026)).
- Lazy-load the canvas behind a poster so a weak connection still gets a fast
  first paint ([2026 trend surveys](https://designmodo.com/web-design-trends/)).

Left out on purpose: a full three.js scene (615 KB for a graph that needs
none of it), Vanta's effects (they carry three.js), scroll hijacking, a
preloader, sound.

## 6 · Copy rules that hold on every page

- The company is *a technology and media company*. "Production company",
  "studio" and "media studio" are not used for the company. *D.C Alacrity
  Productions* is a production credit.
- Pure Alacrity was **built out of Sidequest, not for it** — development began
  January 2026, it has run real productions since March 2026. The season was
  not made on it.
- Every number on the site is something that shipped or was measured. No
  testimonials, no logos of other companies, no "trusted by".
- `support@dcalacrity.com` is the only address. Shoot windows and release aims
  already published stay; nothing private is added.

## 7 · What was measured when it was finished

| | |
|---|---|
| Frame time, hero, WebGL on, 1440×900 | **16.6 ms avg · 0 of 182 frames over 32 ms** |
| Frame time, reduced motion and phone | 16.6 ms avg · 0 over 32 ms |
| First visit, uncompressed | **210 KB** (was 419 KB before the logo was resized) |
| Horizontal overflow, 9 pages × 4 widths | none |
| Text under 11px | none |
| Standalone touch targets under 44px | none |
| Contact endpoint tests | 14 of 14 |
| Build checks (links, h1, tags, copy rules) | 0 problems across 13 pages |

Three checks earned their place by catching real mistakes on the first run: a
`data-area` value the stylesheet did not define, the Sidequest page having no
`h1` because its title was an image, and the word "production company" being
used rather than mentioned.

## 8 · Second pass — "make it even cooler" (2026-09-16, later)

What the reference sites have that the first pass did not: **one continuous
scene**. The hero is not a picture followed by a page; the camera moves through
it, and the page happens inside it. Everything below is in service of that.

| move | what it is | cost |
|---|---|---|
| **The flythrough** | The sky, sun and graph become fixed layers. Scrolling out of the hero dollies the camera *into* the graph — nodes grow, pass the viewer and dissolve — while the sun and floor fade behind. The first two sections are glass over the field. Ends by 2.2 viewports; the canvas stops there. | same draw calls |
| **The sun rises** | On load the sun comes up over the horizon (1.4 s), the rays fade in behind it, then the words. One orchestrated beat, nothing waits for it. | 0 |
| **Dust in the light** | 160 warm motes drifting slowly through the beams. Light you can see is light with something in it. | 160 points |
| **The cursor is a lamp** | On a fine pointer the cursor is a dot and a slow ring; the ring takes the area colour over anything interactive, and in the hero the nodes near it brighten — the graph answers the hand. Native cursor kept over text fields. | one uniform |
| **Labels decrypt** | Mono eyebrows resolve from noise, left to right, as they enter. 600 ms. A screen reader gets the real text. | 0 |
| **Headlines wipe** | Section titles reveal by clip-path from below rather than sliding. | 0 |
| **Tiles breathe** | Property images drift a few percent against their frame while scrolling. | 0 |
| **The rail carries a light** | A pulse travels the compile path as it scrubs. | 0 |
| **Pages cross-fade** | 220 ms out, 260 ms in, on same-site links. The site behaves like one place. | 0 |
| **The graph signs the footer** | The authored story map, drawn flat at its real coordinates, small and dim, on every page. | 0 |

Kept off: a preloader, sound, scroll hijacking, horizontal scrolling. Under
reduced motion every one of these is off, not slower, and the layout is the
first pass's.

## 9 · Third pass — "the main colors are blue and purple, I wanted some sky"

I had read "more sunlight" as a warm sunset on a dark stage. The brand image
is a bright blue sky, clouds and electricity in cyan and violet — a different
picture. Amber is gone from the site entirely; the palette now lives between
`#00C2FF` and `#8143FF` with white-hot tips, and the sky is real cloud cut from
the brand image (`assets/brand/sky.jpg`, `sky-cloud.jpg`, `clouds.jpg`).

Three directions were drafted as artboards in `_design/` and saved as a canvas
(**D.C Alacrity Sky Directions**,
https://claude.ai/code/artifact/64a6a000-1f2f-4435-9ca2-6dfb6ca9f563):

| direction | what it is | trade-off |
|---|---|---|
| **Electric hour** (recommended, built) | the hour after sunset — indigo overhead, still bright blue at the horizon, the deck lit violet, the mark rising as the light | the least literal reading of the brand image |
| **Daylight** | the brand image as the whole world — full blue sky, navy type, the hand raising the arrow | light ground: the WebGL glow and the dark product screens need reworking |
| **Skybreak** | above the clouds — a deck across the lower half, the graph lying on it, the page scrolling down through it into navy | the busiest hero |

The site was rebuilt to Electric hour while the choice is open, because every
direction shares the plates, the mark-as-light and the palette; the other two
are a smaller move from here than from the amber pass.

Two traps from this pass, both mine: writing `inset: auto` AFTER `left`/`top`
in a declaration resets them (the mark and its bloom jumped to the corner);
and `background-clip: text` does not survive the headline's word-split spans —
the thesis phrase is solid pale cyan on the site, the gradient only in the
artboards. The field's `z-index: 1` rule was swallowed by a block rewrite and
the graph vanished a third time — it is now guarded with a comment.

`_build/shot.mjs --root <dir>` renders any folder, which is how the artboards
were checked in real Chrome before saving.
