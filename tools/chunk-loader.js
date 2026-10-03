
(function () {
  'use strict';
  var M = __PA_MANIFEST__;
  var loaded = {}, inflight = {};

  /* ⚠ Take the placeholder out BEFORE the real code runs. Every addon that
     registers a catalogue entry guards it —
         if (AH.moduleById && !AH.moduleById['book']) { …register… }
     — so a stub still sitting there means the addon skips its own entry and
     the placeholder becomes permanent. Measured: 2397 -> 2395, BookEditor
     and SheetRoute both failing "it is searchable". */
  function dropStubs(chunkName) {
    try {
      if (!window.AH || !AH.moduleById) return;
      Object.keys(M.stubOwner || {}).forEach(function (id) {
        if (M.stubOwner[id] !== chunkName) return;
        if (AH.moduleById[id] !== M.stubs[id]) return;   /* not ours any more */
        delete AH.moduleById[id];
        if (Array.isArray(AH.modules)) {
          var i = AH.modules.indexOf(M.stubs[id]);
          if (i > -1) AH.modules.splice(i, 1);
        }
        try {
          var p = AH.modulesByParent && AH.modulesByParent[M.stubs[id].parent];
          if (p) { var k = p.indexOf(M.stubs[id]); if (k > -1) p.splice(k, 1); }
        } catch (_) {}
      });
    } catch (_) {}
  }

  function one(name) {
    if (loaded[name]) return Promise.resolve();
    if (inflight[name]) return inflight[name];
    inflight[name] = new Promise(function (res, rej) {
      dropStubs(name);
      var s = document.createElement('script');
      s.src = M.base + name + '.js?v=' + M.build;
      s.async = false;
      s.onload = function () {
        loaded[name] = true;
        /* [CHUNK-DECL] say so: an addon that patches a chunked module re-wires exactly now */
        try { window.dispatchEvent(new CustomEvent('ah:chunk', { detail: { name: name } })); } catch (_) {}
        /* ⚠ DO NOT re-run stubCatalogue() here. A stub exists to fill the rail
           BEFORE its chunk arrives; once the chunk has run, the addon owns its
           own entry and AH.RailTrim owns the curation — it removes eight
           routes, reparents others and settles duplicate names, and its last
           pass is at 9000 ms. A re-apply after a chunk load happens LATER than
           that and puts back exactly what RailTrim took out.

           Measured by the split gate on the build of 2026-09-23: the shell
           alone was clean, and with every chunk loaded FIVE RailTrim
           assertions failed — "every trimmed route is out of the catalogue",
           "and out of the module list", the rail-parent check, the duplicate
           "Shooting Schedule" name, and the money rail. 2477 in the one file
           against 2472 in the split build.

           Not re-applying is also exact parity with the single file: there, an
           addon that registers no catalogue entry simply has none. */
        res();
      };
      s.onerror = function () { rej(new Error('chunk failed: ' + name)); };
      document.head.appendChild(s);
    });
    return inflight[name];
  }

  /* Chunks are loaded in order: an addon's boot guard retries until what it
     needs exists, so an out-of-order load only costs time — but a serial
     chain is also what makes a failure legible. */
  function chain(names) {
    return names.reduce(function (p, n) {
      return p.then(function () { return one(n); });
    }, Promise.resolve());
  }

  /* ⚠ A script's onload is NOT the addon being ready.
     Every addon in this app boots from a retry loop (if the thing it needs is
     not there yet, it sets a timeout and tries again), so the file can be
     fetched, parsed and executed
     while the thing it registers does not exist yet for another third of a
     second. Navigating on onload rendered the dashboard instead of the route,
     which is exactly the bug the chunk loader was supposed to prevent. */
  function booted(names) {
    for (var i = 0; i < names.length; i++) {
      var ns = M.provides[names[i]];
      if (!ns) continue;                        /* nothing to wait for */
      try { if (!window.AH || !AH[ns]) return false; } catch (_) { return false; }
    }
    return true;
  }
  function untilBooted(names, ms) {
    var deadline = Date.now() + (ms || 8000);
    return new Promise(function (res) {
      (function poll() {
        if (booted(names) || Date.now() > deadline) return res(booted(names));
        setTimeout(poll, 60);
      })();
    });
  }

  var Chunks = window.AHChunks = {
    manifest: M,
    loaded: loaded,
    load: one,
    forRoute: function (id) { return M.routes[id] || []; },
    ensure: function (id) {
      var want = M.routes[id] || [];
      var need = want.filter(function (n) { return !loaded[n]; });
      if (!need.length && booted(want)) return Promise.resolve();
      return chain(need).then(function () { return untilBooted(want); });
    },
    /* everything, for a self-test or an export that needs the lot */
    all: function () {
      return chain(M.order.filter(function (n) { return !loaded[n]; }))
        .then(function () { return untilBooted(M.order); });
    }
  };

  /* ── hook the router ─────────────────────────────────────────────────── */
  function hook() {
    if (!window.AH || !AH.Router || AH.Router.__chunked) return setTimeout(hook, 60);
    var go = AH.Router.go;
    /* Every navigation gets a ticket. A chunk can take a second to arrive, and
       in that second the reader may well have clicked something else — so when
       it lands we check the ticket is still the current one before navigating.
       Without this, opening a heavy route and changing your mind drags you
       back to the first one the moment its chunk finishes. */
    var seq = 0;
    AH.Router.go = function (id) {
      var self = this, args = arguments;
      var chunked = !!(M.routes[id] && M.routes[id].length);
      var chunks = M.routes[id] || [];
      var ready = chunked && chunks.every(function (n) { return loaded[n]; }) && booted(chunks);
      /* Already registered, or never chunked: go straight there. Otherwise we
         must wait even when every file is already fetched — the warm prefetch
         marks a chunk loaded on its script's onload, which happens a retry
         loop BEFORE the addon inside it registers its route. Skipping the wait
         on that basis navigated to the dashboard instead. */
      if (!chunked || ready) { seq++; return go.apply(self, args); }
      var ticket = ++seq;
      var need = M.routes[id].filter(function (n) { return !loaded[n]; });
      var ws = document.getElementById('workspace');
      if (ws) {
        ws.innerHTML = '<div class="view is-active"><div style="padding:40px;text-align:center;' +
          'color:var(--fg-55,#7e8b9c);font:500 13px/1.6 system-ui">Opening…</div></div>';
      }
      return chain(need).then(function () { return untilBooted(chunks); })
        .then(function () {
          if (ticket !== seq) return;          /* they went somewhere else */
          return go.apply(self, args);
        })
        .catch(function (e) {
          if (ticket !== seq) return;
          if (ws) {
            ws.innerHTML = '<div class="view is-active"><div style="padding:40px;text-align:center">' +
              '<b>That part of the app did not load.</b><div style="margin-top:8px;color:#8a94a6">' +
              'Check your connection and try again.</div></div></div>';
          }
          console.error(e);
        });
    };
    AH.Router.__chunked = true;
    AH.Chunks = Chunks;
  }
  hook();

  /* ── the catalogue, before the code ──────────────────────────────────
     A chunked module is not in AH.moduleById until its chunk arrives, and
     the rail is built from AH.modules — so on the web deploy 15 routes had
     nothing linking to them. Registering the harvested entry gives the rail
     something to draw; the real addon overwrites it when its chunk lands.

     ⚠ AH.RailTrim REMOVES routes on purpose, and re-applies from 400 ms to
     9000 ms. Every pass here finishes well before that, so RailTrim always
     gets the last word and a redirected id does not come back. Its table is
     skipped as well, so the two never argue in the first place.

     ⚠ Idempotent and additive: an id already in the registry is left alone,
     which is what makes running it six times safe. */
  function stubCatalogue() {
    if (!window.AH || !AH.moduleById || !Array.isArray(AH.modules)) return;
    var gone = (window.AH.RailTrim && AH.RailTrim.REDIRECT) || {};
    Object.keys(M.stubs || {}).forEach(function (id) {
      if (AH.moduleById[id] || gone[id]) return;
      var e = M.stubs[id];
      AH.moduleById[id] = e;
      if (!AH.modules.some(function (x) { return x.id === id; })) AH.modules.push(e);
      try {
        var p = AH.modulesByParent && AH.modulesByParent[e.parent];
        if (p && !p.some(function (x) { return x.id === id; })) p.push(e);
      } catch (_) {}
    });
    try {
      if (AH.SimpleMode && AH.SimpleMode.words) {
        Object.keys(M.words || {}).forEach(function (id) {
          if (!AH.SimpleMode.words[id]) AH.SimpleMode.words[id] = M.words[id];
        });
      }
    } catch (_) {}
  }
  [0, 150, 400, 900, 2000, 4000].forEach(function (t) { setTimeout(stubCatalogue, t); });

  /* Warm the chunks the user is most likely to want next, once the shell is
     idle and only on a connection that is not metered or slow. */
  function warm() {
    try {
      var c = navigator.connection || {};
      if (c.saveData) return;
      if (/(^|-)2g$/.test(c.effectiveType || '')) return;
    } catch (_) {}
    (M.warm || []).forEach(function (n) { if (!loaded[n]) one(n).catch(function () {}); });
  }
  if (window.requestIdleCallback) requestIdleCallback(warm, { timeout: 8000 });
  else setTimeout(warm, 4000);
})();
