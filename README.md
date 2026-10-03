# Pure Alacrity — web deploy

Drag this whole folder into your GitHub repo and deploy. Nothing else to do.

```bash
npm install
npx wrangler deploy
```

## Opening the app costs 3.5 MB

> **The biggest file in this folder is not the app.**
> `public/Pure-Alacrity.html` is the single-file build offered as a
> *download*. Nothing fetches it when somebody opens the site. Neither the
> `.apk` nor the demo videos load either. If you size this folder up and
> conclude the split did not happen, that file is why.

What a first visit actually downloads:

| | on disk | on the wire |
|---|---|---|
| `public/index.html` — the app shell | 12.8 MB | **3.5 MB** |

Cloudflare compresses `text/html` and `text/javascript` automatically, so the
on-disk number is never what a visitor pays. Route chunks arrive after the app
is already usable, and only the ones that route needs.

## What is in here

**Loaded when the app opens**

| | |
|---|---|
| `public/index.html` | the app shell — 12.8 MB, 3.5 MB gzipped |
| `public/chunks/*.js` | 41 route chunks, 5.9 MB total, fetched on demand |
| `public/sw.js` | service worker — caches each chunk the first time its route opens |
| `worker.js` | security gateway, redirects, and the `/chunks/*.js` route |
| `wrangler.toml` | Cloudflare config — serves `./public` |

**Carried, never loaded** — these are downloads and demo assets. They cost
repository size and nothing else.

| | |
|---|---|
| `public/Pure-Alacrity.html` | 19.3 MB |
| `public/Pure-Alacrity.apk` | 9.1 MB |
| `public/pa-demo-desktop.mp4` | 5.8 MB |
| `public/pa-demo-mobile.mp4` | 3.2 MB |

Delete any of them if you do not want it offered; the app does not reference
them at load. `Pure-Alacrity.html` is linked from the site as a download and
is served as an attachment, so removing it removes that offer and nothing else.

## Why it is split

The whole app is one file by design. For the web that file is 19.3 MB, and the browser must
download and parse all of it before anything appears. The shell here is 12.8 MB;
the rest arrives when somebody opens a route that needs it.

About three quarters of the shell is application core, which has no addon
seams to cut. Splitting further means splitting the core itself, not adding
more chunks.

Desktop, mobile and the downloadable build all keep the single file.

## Two rules if you change the Worker

1. `/chunks/*.js` must be served BEFORE the catch-all that returns
   `index.html`. Without it a chunk request returns the HTML shell with a
   JavaScript content type and every chunked route breaks.
2. `sw.js` must keep its `chunks` rule, or the installed app opens offline
   and then fails on every route it has not already cached.

## Rebuilding after a change

Everything in `public/` that carries app code is generated from the single-file
Master (`../Pure Alacrity - Master.html`). Never edit `public/index.html`,
`public/Pure-Alacrity.html`, `public/chunks/*` or `public/sw.js` by hand.

```bash
npm install          # once: wrangler + javascript-obfuscator
npm run build        # rebuilds public/ from the Master
npx wrangler deploy
```

`tools/build-webdeploy.js` writes the shell, the 41 route chunks, the
single-file download, the lifted images and `sw.js`. It also gives `sw.js` a new
cache name, so returning visitors pick up the new build instead of a cached
one. It exits non-zero if any script could not be scrambled.

## What is scrambled

Every script the app ships is scrambled:
- identifiers are renamed
- comments and whitespace are removed
- numbers are written as expressions
- member access is written as brackets

HTML and CSS comments are stripped too. The served files carry no readable app
source and none of the developer notes.

Left as written, on purpose:

- **Third-party libraries** that open with a `/*!` licence marker (jsPDF, GSAP,
  pdf-lib, pdf.js, Tesseract). Their licences require the notice, and they are
  public code.
- **Strings.** The app builds its markup and handlers from them. Text the user
  sees, storage key names and the Firebase web config therefore stay readable.
  The Firebase web API key is public by design. Protect the project with
  Firebase security rules and by restricting the key to your domains in Google
  Cloud, not by hiding it.
- **Global names** called from inline `onclick` handlers (for example
  `AH.Router.go`).

Scrambling makes the code impractical to read or lift. It cannot make
browser code secret: anything a browser runs can be stepped through. Keep
anything that must stay private (keys with spending power, business logic you
cannot expose) on a server.

`tools/` (the build, `chunk-loader.js`, `sw.src.js`) holds readable source and
is not served: `wrangler.toml` only serves `./public`.
