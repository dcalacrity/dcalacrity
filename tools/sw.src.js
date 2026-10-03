/* Pure Alacrity - service worker.
   Keeps the app shell cached so the installed app opens even offline.
   Never intercepts cross-origin traffic (Firebase, Google, reCAPTCHA). */
'use strict';

const CACHE = 'pure-alacrity-1a54048e19f7';

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    try {
      const c = await caches.open(CACHE);
      const shell = await fetch('./');
      if (shell.ok) {
        await c.put('__shell__', shell.clone());
        /* [IMG-LIFT] the pictures the web shell names (lifted out of it by build-webdeploy.js:
           the splash logo, the landing page's screenshots) are its front door. Precached with the
           shell, because an app installed on its first visit fetched them before this worker
           controlled the page — so they were never cached, and it opened offline broken. */
        try {
          const names = [...new Set((await shell.text()).match(/pa-(?:logo|img-[0-9a-f]{10})\.jpg/g) || [])];
          await Promise.all(names.map(async (n) => { try { const r = await fetch(n); if (r.ok) await c.put(n, r); } catch (_) { /* fills in on first use */ } }));
        } catch (_) { /* the shell is cached; the pictures fill in on first use */ }
      }
    } catch (_) { /* offline install - shell fills in on first online nav */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return; // Firebase/Google go straight out

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req, { ignoreSearch: true }) || await c.match('__shell__');
      // A known app shell opens immediately even if a captive portal or a
      // school network is slow. Each release changes CACHE, so install() has
      // already fetched a fresh shell before this cache-first path is used.
      if (hit) return hit;

      const fresh = await fetch(req);
      if (fresh && fresh.ok) {
        try {
          await c.put(req, fresh.clone());
          await c.put('__shell__', fresh.clone());
        } catch (_) { /* a successful navigation remains usable without a cache write */ }
      }
      return fresh;
    })());
    return;
  }

  /* Route chunks: cache-first, and CACHED ON FIRST USE rather than precached.
     The split web build loads a route's code the first time somebody navigates
     to it (see _scramble/split-build.js). Without this rule those requests
     fall straight through to the network — the app opens offline and then
     every chunked route fails, which is a worse promise than not being
     offline-capable at all.

     Not precached in install(): the chunks are 11 MB against a 13 MB shell,
     and downloading all of it up front would undo the entire point of
     splitting. The honest behaviour is that a route you have opened once
     works offline afterwards, and a route you never opened does not.

     Cache-first is safe because every chunk URL carries ?v=<buildId>: a new
     release requests different URLs, and the old ones are dropped wholesale
     when activate() deletes the previous CACHE. */
  if (/\/chunks\/[A-Z0-9_]+\.js$/.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req);
      if (hit) return hit;
      const fresh = await fetch(req);
      if (fresh && fresh.ok) {
        try { await c.put(req, fresh.clone()); } catch (_) { /* quota — still usable */ }
      }
      return fresh;
    })());
    return;
  }

  /* [OCR-FILES] the OCR engine (public/ocr/): cached on FIRST USE, like the chunks — ~9 MB is not
     something to precache for a feature most visits never touch, and a scan read once should read
     again offline. The files are versioned by the release (the cache is per build). */
  if (/\/ocr\/(tesseract\.min\.js|worker\.min\.js|tesseract-core-lstm\.wasm\.js|eng\.traineddata)$/.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req);
      if (hit) return hit;
      const fresh = await fetch(req);
      if (fresh && fresh.ok) { try { await c.put(req, fresh.clone()); } catch (_) { /* quota — still usable */ } }
      return fresh;
    })());
    return;
  }

  /* [IMG-LIFT] the lifted pictures: cache-first. pa-img-* is named by its content, so a cached
     copy can never be stale; pa-logo.jpg is kept per build like everything else here. */
  if (/\/(pa-logo\.jpg|pa-img-[0-9a-f]{10}\.jpg)$/.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req);
      if (hit) return hit;
      const fresh = await fetch(req);
      if (fresh && fresh.ok) { try { await c.put(req, fresh.clone()); } catch (_) { /* quota — still usable */ } }
      return fresh;
    })());
    return;
  }

  // PWA statics: cache-first with background refresh
  if (/(manifest\.webmanifest|icon-\d+\.png)$/.test(url.pathname)) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req);
      const refresh = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
      return hit || refresh.then((r) => { if (!r) throw new Error('offline'); return r; });
    })());
  }
});
