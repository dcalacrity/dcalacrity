/* dcalacrity.com — Part 3: the widgets, sixth pass.
   The dot-matrix art on the product cards and the capability stages (each
   one a picture of what that thing actually handles — a stripboard, a
   branching graph, a timeline, a bundle, a signal going out), the stage
   tabs, the question filter, and the statement that inks in as it is read.
   Everything works without this file: the stages list every panel, the
   questions all show, the statement is already dark. No library. */

(function () {
  "use strict";
  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var REDUCED = mq("(prefers-reduced-motion: reduce)");

  /* ── the capability: tabs over five panels ─────────────────────────────── */
  [].forEach.call(document.querySelectorAll("[data-stages]"), function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
    var count = box.querySelector("[data-stage-count]");
    if (!tabs.length || panels.some(function (p) { return !p; })) return;
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        panels[j].classList.toggle("is-on", on);
        panels[j].hidden = !on;
      });
      if (count) count.textContent = (i + 1) + "/" + tabs.length;
      if (focus) tabs[i].focus();
      panels.forEach(function (p, j) { var a = p.querySelector("[data-art]"); if (j !== i && a && a.__art) a.__art.stop(); });
      var art = panels[i].querySelector("[data-art]");
      if (art && art.__art) { art.__art.resize(); art.__art.play(); }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length, k = e.key, to = -1;
        if (k === "ArrowDown" || k === "ArrowRight") to = (i + 1) % n;
        else if (k === "ArrowUp" || k === "ArrowLeft") to = (i - 1 + n) % n;
        else if (k === "Home") to = 0;
        else if (k === "End") to = n - 1;
        if (to > -1) { e.preventDefault(); select(to, true); }
      });
    });
    box.classList.add("is-ready");
    select(0);
  });

  /* ── questions: filter by topic ────────────────────────────────────────── */
  [].forEach.call(document.querySelectorAll("[data-faq]"), function (box) {
    var chips = [].slice.call(box.querySelectorAll(".chip"));
    var items = [].slice.call(box.querySelectorAll(".qa"));
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var cat = c.getAttribute("data-cat");
        chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        items.forEach(function (it) { it.hidden = !(cat === "all" || it.getAttribute("data-cat") === cat); });
      });
    });
    box.classList.add("is-ready");
  });

  /* ── the statement inks in as it is read ───────────────────────────────── */
  if (!REDUCED) {
    var fills = [].slice.call(document.querySelectorAll("[data-fill]")).map(function (el) {
      return { el: el, words: [].slice.call(el.querySelectorAll(".w")), n: -1 };
    }).filter(function (f) { return f.words.length; });
    if (fills.length) {
      var ticking = false;
      var paint = function () {
        ticking = false;
        var vh = window.innerHeight || 800;
        fills.forEach(function (f) {
          var r = f.el.getBoundingClientRect();
          var p = (vh * 0.86 - r.top) / (r.height + vh * 0.3);
          var n = Math.round(Math.max(0, Math.min(1, p)) * f.words.length);
          if (n === f.n) return;
          f.n = n;
          f.words.forEach(function (w, i) { w.classList.toggle("on", i < n); });
        });
      };
      fills.forEach(function (f) { f.el.classList.add("is-filling"); });
      paint();
      window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
      window.addEventListener("resize", paint, { passive: true });
    }
  }

  /* ═══ dot art ═══════════════════════════════════════════════════════════
     Canvas 2D, a few hundred dots each. At rest every picture shows its one
     spark — today's column, the route taken, the playhead — so a still page
     is already telling the truth. On hover (cards) or while open (stages)
     that spark moves. Dots are batched into one path per colour. */
  var cs = getComputedStyle(document.documentElement);
  var tok = function (n, fb) { return (cs.getPropertyValue(n).trim() || fb); };
  var C = { faint: "rgba(165,183,191,0.16)", tide: "#2b4d58", dim: "#5f7680", mist: tok("--c-mist", "#a5b7bf"), paper: tok("--c-paper", "#f7fafb"), spark: tok("--c-spark", "#00c2ff") };
  var rnd = function (seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; };

  function Art(host, kind) {
    this.host = host; this.kind = kind;
    this.c = document.createElement("canvas");
    host.insertBefore(this.c, host.firstChild);
    this.x = this.c.getContext("2d");
    this.t = 0; this.playing = false; this.seed = 7 + kind.length * 131;
    host.__art = this;
    this.resize();
  }
  Art.prototype.resize = function () {
    var w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr);
    this.x.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cell = w < 420 ? 9 : 11;
    this.cols = Math.floor(w / this.cell); this.rows = Math.floor(h / this.cell);
    this.ox = (w - (this.cols - 1) * this.cell) / 2; this.oy = (h - (this.rows - 1) * this.cell) / 2;
    this.build();
    this.draw(this.rest());
  };
  Art.prototype.px = function (cx, cy) { return [this.ox + cx * this.cell, this.oy + cy * this.cell]; };
  /* the rest state: where the spark sits on a still page */
  Art.prototype.rest = function () { return { board: 0.62, graph: 0.55, route: 1, timeline: 0.38, bundle: 1, rings: 0.45 }[this.kind]; };

  Art.prototype.build = function () {
    var R = rnd(this.seed), cols = this.cols, rows = this.rows, self = this;
    var grid = []; /* [cx, cy, brightness, group] */
    var k = this.kind;
    if (k === "board") {
      /* a stripboard: days as bands, each band a few strips, a strip's lit
         runs are its scenes */
      var y = 1;
      while (y < rows - 1) {
        var strips = 2 + Math.floor(R() * 2);
        for (var s = 0; s < strips && y < rows - 1; s++, y++) {
          var x = 1 + Math.floor(R() * 3);
          while (x < cols - 1) {
            var len = 2 + Math.floor(R() * 6), b = 0.18 + R() * 0.42;
            for (var i = 0; i < len && x < cols - 1; i++, x++) grid.push([x, y, b, 0]);
            x += 1 + Math.floor(R() * 4);
          }
        }
        y += 1;
      }
    } else if (k === "graph" || k === "route") {
      /* a branching story in miniature: nodes by column, edges as dotted
         lines between them */
      var colsN = [1, 2, 3, 2, 3];
      var nodes = [];
      colsN.forEach(function (n, ci) {
        for (var j = 0; j < n; j++) nodes.push({ c: ci, x: 2 + ci * (cols - 4) / (colsN.length - 1), y: rows * ((j + 1) / (n + 1)) + (R() - 0.5) * rows * 0.08 });
      });
      var edges = [];
      nodes.forEach(function (a, ai) {
        nodes.forEach(function (b, bi) { if (b.c === a.c + 1 && Math.abs(b.y - a.y) < rows * 0.42) edges.push([ai, bi]); });
      });
      this.nodes = nodes; this.edges = edges;
      edges.forEach(function (e, ei) {
        var a = nodes[e[0]], b = nodes[e[1]], d = Math.hypot(b.x - a.x, b.y - a.y), steps = Math.max(2, Math.round(d / 0.9));
        for (var i = 1; i < steps; i++) { var t = i / steps; grid.push([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 0.42, 10 + ei, t]); }
      });
      nodes.forEach(function (n, ni) { grid.push([n.x, n.y, 1, 100 + ni]); });
      /* a route through it, chosen once and kept: first node to the last column */
      var route = [0], at = 0;
      while (true) { var outs = edges.filter(function (e) { return e[0] === at; }); if (!outs.length) break; var pick = outs[Math.floor(R() * outs.length)]; route.push(pick[1]); at = pick[1]; }
      this.route = route;
    } else if (k === "timeline") {
      /* four lanes of an edit — two picture, two sound — with clips on them */
      var lanes = 4, laneH = Math.max(2, Math.floor((rows - 2) / lanes));
      for (var l = 0; l < lanes; l++) {
        var ly = 1 + l * laneH, x2 = 1 + Math.floor(R() * 2);
        while (x2 < cols - 1) {
          var len2 = 3 + Math.floor(R() * 7), b2 = l < 2 ? 0.28 + R() * 0.3 : 0.22 + R() * 0.2;
          for (var i2 = 0; i2 < len2 && x2 < cols - 1; i2++, x2++) for (var r2 = 0; r2 < laneH - 1; r2++) grid.push([x2, ly + r2, b2, l]);
          x2 += 1 + Math.floor(R() * 2);
        }
      }
    } else if (k === "bundle") {
      /* many loose pieces on the left, one dense file on the right */
      var bx = Math.round(cols * 0.72), by = Math.round(rows * 0.5), bs = Math.max(3, Math.round(Math.min(cols, rows) * 0.22));
      for (var n2 = 0; n2 < cols * rows * 0.16; n2++) {
        var sx = 1 + R() * (cols * 0.45), sy = 1 + R() * (rows - 2);
        grid.push([sx, sy, 0.25 + R() * 0.55, 1, R()]);
      }
      for (var yy = -bs; yy <= bs; yy++) for (var xx = -bs; xx <= bs; xx++) grid.push([bx + xx, by + yy, 1, 2]);
      this.block = [bx, by, bs];
    } else if (k === "rings") {
      /* one source, a signal going out to wherever people are */
      var ox = Math.round(cols * 0.16), oy = Math.round(rows * 0.5);
      for (var gy = 0; gy < rows; gy++) for (var gx = 0; gx < cols; gx++) {
        var d2 = Math.hypot(gx - ox, gy - oy);
        var ring = Math.abs(d2 / 3 - Math.round(d2 / 3));
        if (ring < 0.22 && d2 > 0.5) grid.push([gx, gy, Math.max(0.2, 1 - d2 / (cols * 0.95)), 0, d2]);
      }
      grid.push([ox, oy, 1, 1, 0]);
      this.origin = [ox, oy];
    }
    this.dots = grid;
  };

  /* draw with the spark at phase p (0..1) */
  Art.prototype.draw = function (p) {
    var x = this.x, cell = this.cell, k = this.kind, self = this;
    x.clearRect(0, 0, this.w, this.h);
    /* the screen underneath: every cell a faint dot */
    x.fillStyle = C.faint; x.beginPath();
    for (var gy = 0; gy < this.rows; gy++) for (var gx = 0; gx < this.cols; gx++) { var q = this.px(gx, gy); x.moveTo(q[0] + 1.1, q[1]); x.arc(q[0], q[1], 1.1, 0, 6.2832); }
    x.fill();
    var paths = { tide: [], dim: [], mist: [], paper: [], spark: [] };
    var put = function (col, cx, cy, b) { paths[col].push(self.px(cx, cy).concat([cell * 0.5 * Math.sqrt(Math.max(0, Math.min(1, b)))])); };
    var litEdges = {}, head = null, i;
    if (k === "graph" || k === "route") {
      /* how much of the route is lit: p runs 0..1 across it */
      var steps = this.route.length - 1, along = p * steps;
      for (i = 0; i < steps; i++) {
        var a = this.route[i], b = this.route[i + 1];
        var ei = -1; this.edges.forEach(function (e, j) { if (e[0] === a && e[1] === b) ei = j; });
        var f = Math.max(0, Math.min(1, along - i));
        if (f > 0) litEdges[ei] = f;
        if (f > 0 && f < 1) { var na = this.nodes[a], nb = this.nodes[b]; head = [na.x + (nb.x - na.x) * f, na.y + (nb.y - na.y) * f]; }
      }
      if (!head) { var last = this.nodes[this.route[Math.min(steps, Math.floor(along))]]; head = [last.x, last.y]; }
    }
    this.dots.forEach(function (d) {
      var cx = d[0], cy = d[1], b = d[2], g = d[3];
      if (k === "board") {
        var col = Math.round(p * (self.cols - 1));
        if (Math.abs(cx - col) < 0.5) put("spark", cx, cy, Math.min(1, b + 0.45)); else put(b > 0.5 ? "mist" : "dim", cx, cy, b);
      } else if (k === "graph" || k === "route") {
        if (g >= 100) { var onRoute = self.route.indexOf(g - 100); var reached = onRoute > -1 && onRoute <= p * (self.route.length - 1) + 0.001; put(reached ? "spark" : "paper", cx, cy, 1); }
        else { var le = litEdges[g - 10]; if (le && d[4] <= le) put("spark", cx, cy, 0.7); else put("mist", cx, cy, b); }
      } else if (k === "timeline") {
        var ph = p * (self.cols - 1);
        if (Math.abs(cx - ph) < 0.5) put("spark", cx, cy, 0.85); else put(g < 2 ? (cx < ph ? "mist" : "dim") : "tide", cx, cy, b);
      } else if (k === "bundle") {
        if (g === 1) {
          /* loose pieces travel toward the file as p grows */
          var tt = Math.max(0, Math.min(1, p * 1.4 - d[4] * 0.4)), bx = self.block[0] - self.block[2] - 1, by = self.block[1];
          var mx = cx + (bx - cx) * tt * 0.85, my = cy + (by - cy) * tt * 0.85;
          put(tt > 0.8 ? "spark" : "mist", mx, my, b * (1 - tt * 0.5));
        } else put("paper", cx, cy, 1);
      } else if (k === "rings") {
        if (g === 1) { put("spark", cx, cy, 1); return; }
        var front = p * self.cols * 0.95;
        if (Math.abs(d[4] - front) < 1.6) put("spark", cx, cy, Math.min(1, b + 0.4)); else put(b > 0.7 ? "paper" : "mist", cx, cy, b * 0.8);
      }
    });
    if (head) paths.spark.push(this.px(head[0], head[1]).concat([cell * 0.62]));
    var colour = { tide: C.tide, dim: C.dim, mist: C.mist, paper: C.paper, spark: C.spark };
    ["tide", "dim", "mist", "paper", "spark"].forEach(function (name) {
      var list = paths[name]; if (!list.length) return;
      x.fillStyle = colour[name]; x.beginPath();
      list.forEach(function (d) { if (d[2] < 0.4) return; x.moveTo(d[0] + d[2], d[1]); x.arc(d[0], d[1], d[2], 0, 6.2832); });
      x.fill();
    });
  };

  var arts = [].map.call(document.querySelectorAll("[data-art]"), function (el) { return new Art(el, el.getAttribute("data-art")); });
  if (!arts.length) return;

  /* motion: a card's art plays while it is hovered or focused; the open
     stage's art plays while it is on screen. One loop for all of them. */
  var playing = [], raf = 0, last = 0;
  var PERIOD = { board: 5.5, graph: 4.2, route: 4.2, timeline: 6, bundle: 3.6, rings: 3.2 };
  function loop(now) {
    raf = 0;
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    playing = playing.filter(function (a) { return a.playing; });
    playing.forEach(function (a) {
      a.t += dt / PERIOD[a.kind];
      var p = a.t % 1;
      /* the graph kinds draw the route, hold it, then start again */
      if (a.kind === "graph" || a.kind === "route" || a.kind === "bundle") p = Math.min(1, (a.t % 1) * 1.35);
      a.draw(p);
    });
    if (playing.length) raf = requestAnimationFrame(loop);
  }
  Art.prototype.play = function () {
    if (REDUCED || this.playing) return;
    this.playing = true; this.t = 0;
    if (playing.indexOf(this) < 0) playing.push(this);
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  Art.prototype.stop = function () { if (!this.playing) return; this.playing = false; this.draw(this.rest()); };

  arts.forEach(function (a) {
    var card = a.host.closest(".card");
    if (card) {
      card.addEventListener("pointerenter", function () { a.play(); });
      card.addEventListener("pointerleave", function () { a.stop(); });
      card.addEventListener("focus", function () { a.play(); });
      card.addEventListener("blur", function () { a.stop(); });
    }
  });
  var panelArts = arts.filter(function (a) { return a.host.closest(".stage-panel"); });
  if (panelArts.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var a = x.target.__art; if (!a) return;
        var open = !x.target.closest(".stage-panel").hidden;
        if (x.isIntersecting && open) a.play(); else a.stop();
      });
    }, { threshold: 0.35 });
    panelArts.forEach(function (a) { io.observe(a.host); });
  }
  /* a panel that is hidden has no size: size it when it opens (see select) */
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function (en) { en.forEach(function (x) { if (x.target.__art) x.target.__art.resize(); }); });
    arts.forEach(function (a) { ro.observe(a.host); });
  }
  window.DCA = window.DCA || {};
  window.DCA.arts = arts.length;
})();
