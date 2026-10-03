/* dcalacrity.com/sw.js — this website has no service worker. This file removes one.
 *
 * WHY IT EXISTS (2026-10-03)
 * Pure Alacrity lives at dcalacrity.com/pure/ and has its own service worker
 * there (scope /pure/). Once, its files were also deployed at the ROOT of this
 * site, and a browser that opened the app there registered its worker for the
 * whole domain (scope /). That worker answers every page from its cached copy
 * of the app, so dcalacrity.com showed Pure Alacrity instead of the website,
 * and kept doing so even after the right files were deployed.
 *
 * Browsers re-check /sw.js on every visit. Finding this file, they install it
 * in place of the stray worker. It then:
 *   · takes over the pages the stray worker held,
 *   · unregisters itself, so nothing controls dcalacrity.com/ any more,
 *   · reloads those pages from the network, so the website shows.
 * It deletes NO caches and NO storage. Pure Alacrity's data and its own
 * worker at /pure/ are a different registration and are untouched.
 * Keep this file deployed for a few months; it is harmless and tiny.
 */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try { await self.clients.claim(); } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
    var clients = [];
    try { clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }); } catch (_) {}
    clients.forEach(function (c) {
      try { if (!new URL(c.url).pathname.startsWith('/pure')) c.navigate(c.url); } catch (_) {}
    });
  })());
});
/* no fetch handler: every request goes to the network */
