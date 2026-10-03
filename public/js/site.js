/* dcalacrity.com — behaviour, sixth pass.
   Part 1: navigation, the contact form, the year. Runs everywhere.
   Part 2: sections arriving, and the halftone plates — raw WebGL points, no
   library. See ../../DESIGN.md §9. */

(function () {
  "use strict";
  var top = document.querySelector(".top");
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".menu");

  if (burger && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    };
    burger.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false); });
    setMenu(false);
  }

  var onScroll = function () { if (top) top.classList.toggle("is-scrolled", window.scrollY > 16); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* contact form — the endpoint captures the lead before it emails, so the
     visitor is only handed a mail draft when the site itself is unreachable */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = document.querySelector("#contact-status");
    var submitBtn = document.querySelector("#contact-submit");
    var setStatus = function (kind, text) { if (!status) return; status.hidden = false; status.className = "form-status" + (kind ? " is-" + kind : ""); status.textContent = text; };
    var params = new URLSearchParams(window.location.search), topic = params.get("topic"), sel = document.getElementById("topic");
    if (topic && sel) {
      var found = false;
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === topic) { sel.selectedIndex = i; found = true; break; }
      if (!found) { var opt = document.createElement("option"); opt.value = topic; opt.textContent = topic; opt.selected = true; sel.appendChild(opt); }
    }
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      form.querySelectorAll(".is-invalid").forEach(function (el) { el.classList.remove("is-invalid"); });
      var data = new FormData(form), get = function (k) { return (data.get(k) || "").toString().trim(); };
      var payload = { name: get("name"), email: get("email"), phone: get("phone"), organization: get("organization"), topic: get("topic"), projectType: get("projectType"), budget: get("budget"), timeline: get("timeline"), source: get("source"), message: get("message"), website: get("website") };
      var valid = true;
      ["name", "email", "topic", "message"].forEach(function (key) { var f = form.elements.namedItem(key); if (!payload[key] && f) { f.classList.add("is-invalid"); valid = false; } });
      if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) { var f = form.elements.namedItem("email"); if (f) f.classList.add("is-invalid"); valid = false; }
      if (!valid) { setStatus("error", "Please fill in the required fields."); return; }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      setStatus("", "Sending your message…");
      try {
        var res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
        var result = await res.json().catch(function () { return {}; });
        if (!res.ok || !result.ok) throw new Error(result.error || "Send failed");
        form.reset();
        setStatus("success", result.message || (result.emailed === false ? "Message received" + (result.ref ? " (ref " + result.ref + ")" : "") + ". We have it — no need to resend." : "Message sent. We reply within two business days on commercial estimates."));
      } catch (err) {
        var subject = encodeURIComponent("[dcalacrity.com] " + (payload.topic || "Inquiry") + " — " + payload.name);
        var body = encodeURIComponent(["Name: " + payload.name, "Email: " + payload.email, "Phone: " + (payload.phone || "—"), "Organization: " + (payload.organization || "—"), "Topic: " + payload.topic, "Project type: " + (payload.projectType || "—"), "Budget: " + (payload.budget || "—"), "Timeline: " + (payload.timeline || "—"), "Found us via: " + (payload.source || "—"), "", payload.message].join("\n"));
        setStatus("error", "Couldn’t reach us from the site just now — opening an email draft so nothing you wrote is lost. You can also write support@dcalacrity.com directly.");
        window.location.href = "mailto:support@dcalacrity.com?subject=" + subject + "&body=" + body;
      } finally { if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send message"; } }
    });
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   Part 2 — arrivals, and the halftone plates.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var root = document.documentElement;
  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var ENV = {
    reduced: mq("(prefers-reduced-motion: reduce)"),
    fine: mq("(pointer: fine)"),
    save: !!(navigator.connection && navigator.connection.saveData)
  };
  window.DCA = window.DCA || {};
  window.DCA.env = ENV;

  /* ── sections arrive ─────────────────────────────────────────────────────
     Whatever is already on screen is marked arrived BEFORE the hiding rule
     can apply, so nothing above the fold ever blinks out and back. With no
     script, or with motion turned down, nothing is ever hidden at all. */
  var rises = [].slice.call(document.querySelectorAll("[data-rise]"));
  if (!ENV.reduced && "IntersectionObserver" in window) {
    var vh = window.innerHeight || 800;
    rises.forEach(function (el) { if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add("is-in"); });
    root.classList.add("rise-ready");
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    rises.forEach(function (el) { if (!el.classList.contains("is-in")) io.observe(el); });
  } else {
    rises.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ── the proof that the page costs nothing ─────────────────────────────── */
  window.DCA.measure = function (ms) {
    return new Promise(function (resolve) {
      var t = performance.now(), last = t, n = 0, over32 = 0, worst = 0, sum = 0;
      (function tick(now) { var d = now - last; last = now; if (n > 0) { sum += d; if (d > 32) over32++; if (d > worst) worst = d; } n++; if (now - t < (ms || 2000)) requestAnimationFrame(tick); else resolve({ frames: n, over32: over32, worst: Math.round(worst * 10) / 10, avg: Math.round(sum / Math.max(1, n - 1) * 10) / 10, plates: (window.DCA.plates || []).map(function (p) { return p.mode + ":" + p.points + (p.live ? "" : ":static"); }) }); })(t);
    });
  };

  /* ═══ the plates ══════════════════════════════════════════════════════════
     A halftone: one dot per cell of a screen, its SIZE following brightness.
     It is drawn as GL points — one vertex per cell — so every per-cell sum
     (the smoke, the graph, the pointer's lens) runs once per dot in the
     vertex shader and the fragment shader only has to draw a disc.

     'graph' plates draw a branching story: nodes and edges as denser dots,
     and a playhead that walks from the start, CHOOSES at every fork, and
     lights the route it took, until it reaches an ending and begins again.
     'image' plates halftone a picture — the page's own subject — sampled
     once per cell on the CPU and drifted by the same slow smoke.

     No WebGL, reduced motion, save-data: the CSS dot screen under the canvas
     stays (no WebGL), or one still frame is drawn with a finished route
     (reduced motion). A watchdog stills everything if frames run long. ── */
  var hosts = [].slice.call(document.querySelectorAll("[data-plate]"));
  window.DCA.plates = [];
  if (!hosts.length) return;

  var probe = document.createElement("canvas");
  var probeGL = null;
  try { probeGL = probe.getContext("webgl", { failIfMajorPerformanceCaveat: true }) || probe.getContext("experimental-webgl"); } catch (_) {}
  if (!probeGL) return;
  var ext = probeGL.getExtension("WEBGL_lose_context");
  if (ext) ext.loseContext();

  var hex = function (h) { h = h.replace("#", "").trim(); if (h.length === 3) h = h.replace(/./g, "$&$&"); var n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
  var cs = getComputedStyle(root);
  var tok = function (name, fb) { var v = cs.getPropertyValue(name).trim(); return hex(v || fb); };
  var COL = { tide: tok("--c-tide", "#15313b"), mist: tok("--c-mist", "#a5b7bf"), paper: tok("--c-paper", "#f7fafb"), spark: tok("--c-spark", "#00c2ff") };

  var MAXSEG = 26, MAXNODE = 18;
  var VS = [
    "precision highp float;",
    "attribute vec2 a_pos; attribute float a_val;",
    "uniform vec2 u_res; uniform float u_cell; uniform float u_time; uniform float u_mode;",
    "uniform vec2 u_ptr; uniform float u_lens;",
    "uniform vec4 u_seg[" + MAXSEG + "]; uniform float u_lit[" + MAXSEG + "]; uniform int u_nseg;",
    "uniform vec3 u_node[" + MAXNODE + "]; uniform int u_nnode; uniform vec3 u_head;",
    "uniform vec3 u_tide; uniform vec3 u_mist; uniform vec3 u_paper; uniform vec3 u_spark;",
    "varying vec3 v_col; varying float v_size;",
    "float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }",
    "float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }",
    "float sd(vec2 p, vec4 s) { vec2 pa = p - s.xy, ba = s.zw - s.xy; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.001), 0.0, 1.0); return length(pa - ba * h); }",
    "void main() {",
    "  vec2 uv = a_pos / u_res;",
    "  vec2 q = a_pos / max(u_res.y, 1.0);",
    "  float t = u_time;",
    "  vec2 w = vec2(fbm(q * 1.4 + vec2(t * 0.020, -t * 0.013)), fbm(q * 1.4 + vec2(5.2, 1.3) - t * 0.017));",
    "  float smoke = fbm(q * 2.1 + w * 1.5 + vec2(t * 0.008, 0.0));",
    "  float edge = smoothstep(0.0, 0.16, uv.x) * smoothstep(1.0, 0.84, uv.x) * smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);",
    "  float b; vec3 col;",
    "  if (u_mode < 0.5) {",
    "    float s = smoothstep(0.40, 0.86, smoke) * (0.3 + 0.7 * edge);",
    "    float sig = u_cell * 1.05; float g = 0.0; float lit = 0.0;",
    "    for (int i = 0; i < " + MAXSEG + "; i++) { if (i >= u_nseg) break; float d = sd(a_pos, u_seg[i]); float k = exp(-d * d / (2.0 * sig * sig)); g = max(g, k * (0.5 + 0.5 * u_lit[i])); lit = max(lit, k * u_lit[i]); }",
    "    float nd = 0.0; float end = 0.0;",
    "    for (int i = 0; i < " + MAXNODE + "; i++) { if (i >= u_nnode) break; float r = u_cell * (1.35 + 0.55 * u_node[i].z); float d = length(a_pos - u_node[i].xy); float k = exp(-d * d / (2.0 * r * r)); nd = max(nd, k); end = max(end, k * u_node[i].z); }",
    "    float hd = length(a_pos - u_head.xy); float hr = u_cell * 2.4; float head = u_head.z * exp(-hd * hd / (2.0 * hr * hr));",
    "    b = max(s * 0.52, max(g * 0.74, max(nd * 0.95, head)));",
    "    col = mix(u_tide, u_mist, s);",
    "    col = mix(col, u_mist, max(g, nd) * 0.9);",
    "    col = mix(col, u_paper, end * 0.85);",
    "    col = mix(col, u_spark, clamp(max(lit, head), 0.0, 1.0));",
    "  } else {",
    "    b = clamp(a_val + (smoke - 0.5) * 0.24, 0.0, 1.0) * (0.55 + 0.45 * edge);",
    "    col = mix(u_tide, u_mist, smoothstep(0.12, 0.72, b));",
    "    col = mix(col, u_paper, smoothstep(0.8, 1.0, b) * 0.8);",
    "  }",
    "  float pd = length(a_pos - u_ptr); float lr = u_cell * 15.0; float lens = u_lens * exp(-pd * pd / (2.0 * lr * lr));",
    "  float size = u_cell * sqrt(clamp(b, 0.0, 1.0)) * (0.98 + 0.42 * lens);",
    "  v_size = size; v_col = col;",
    "  gl_PointSize = size;",
    "  gl_Position = vec4(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, 0.0, 1.0);",
    "}"
  ].join("\n");
  var FS = [
    "precision mediump float;",
    "varying vec3 v_col; varying float v_size;",
    "void main() {",
    "  if (v_size < 0.8) discard;",
    "  vec2 c = gl_PointCoord * 2.0 - 1.0;",
    "  float a = clamp((1.0 - length(c)) * v_size * 0.5 + 0.5, 0.0, 1.0);",
    "  if (a <= 0.0) discard;",
    "  gl_FragColor = vec4(v_col * a, a);",
    "}"
  ].join("\n");

  /* the story graph — a small branching film. x across (0..1), y down (0..1).
     Four endings, a merge in the middle: the shape of a real branching script,
     not a tree that only ever divides. */
  var NODES = [
    [0.00, 0.50], [0.16, 0.30], [0.16, 0.70], [0.33, 0.16], [0.33, 0.50], [0.33, 0.84],
    [0.50, 0.34], [0.50, 0.68], [0.67, 0.18], [0.67, 0.50], [0.67, 0.82],
    [0.84, 0.10], [0.84, 0.38], [0.84, 0.64], [0.84, 0.92], [1.00, 0.28], [1.00, 0.74]
  ];
  var EDGES = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 6], [4, 7], [5, 7], [6, 8], [6, 9], [7, 9], [7, 10],
    [8, 11], [8, 12], [9, 12], [9, 13], [10, 13], [10, 14], [12, 15], [13, 15], [13, 16]];
  var OUT = NODES.map(function (_, n) { var o = []; EDGES.forEach(function (e, i) { if (e[0] === n) o.push(i); }); return o; });
  var ENDING = NODES.map(function (_, n) { return OUT[n].length === 0; });
  var STILL_ROUTE = [1, 4, 8, 13, 18, 22];   /* the route drawn when motion is off */

  function Plate(el) {
    this.el = el;
    this.mode = el.getAttribute("data-plate") === "image" ? "image" : "graph";
    this.src = el.getAttribute("data-src");
    this.visible = true;
    this.ready = this.mode === "graph";
    this.points = 0;
    this.ptr = [-1e5, -1e5]; this.lensTarget = 0; this.lens = 0;
    this.seed = Math.random() * 100;
    var c = this.canvas = document.createElement("canvas");
    el.appendChild(c);
    var gl = this.gl = c.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) { this.dead = true; c.remove(); return; }
    /* the dots are GL points; a driver that cannot draw a point this size cannot draw the plate */
    var range = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    if (range && range[1] < 24) { this.dead = true; c.remove(); return; }
    var self = this;
    c.addEventListener("webglcontextlost", function (e) { e.preventDefault(); self.dead = true; el.classList.remove("is-live"); });
    var sh = function (t, src) { var o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    var pr = this.prog = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr);
    this.U = {};
    ["u_res", "u_cell", "u_time", "u_mode", "u_ptr", "u_lens", "u_seg", "u_lit", "u_nseg", "u_node", "u_nnode", "u_head", "u_tide", "u_mist", "u_paper", "u_spark"].forEach(function (n) { self.U[n] = gl.getUniformLocation(pr, n); });
    this.aPos = gl.getAttribLocation(pr, "a_pos"); this.aVal = gl.getAttribLocation(pr, "a_val");
    this.bPos = gl.createBuffer(); this.bVal = gl.createBuffer();
    gl.uniform3fv(this.U.u_tide, COL.tide); gl.uniform3fv(this.U.u_mist, COL.mist); gl.uniform3fv(this.U.u_paper, COL.paper); gl.uniform3fv(this.U.u_spark, COL.spark);
    gl.uniform1f(this.U.u_mode, this.mode === "image" ? 1 : 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    /* the story's own state */
    this.lit = new Float32Array(EDGES.length);
    this.S = { at: 0, edge: -1, t: 0, dur: 1, hold: 0.9, phase: "hold", fade: 1, pulse: 0 };
    if (this.mode === "image" && this.src) this.load();
    if (ENV.fine && !ENV.reduced) {
      var host = el.closest(".stage, .close__plate, .desk__side, .lost, .phero") || el;
      host.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(); self.ptr = [(e.clientX - r.left) * self.dpr, (e.clientY - r.top) * self.dpr]; self.lensTarget = 1; kick(); }, { passive: true });
      host.addEventListener("pointerleave", function () { self.lensTarget = 0; });
    }
  }

  Plate.prototype.size = function () {
    if (this.dead) return;
    var el = this.el, dpr = this.dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.max(2, Math.round(el.clientWidth * dpr)), h = Math.max(2, Math.round(el.clientHeight * dpr));
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.canvas.width = w; this.canvas.height = h;
    var cssCell = el.clientWidth < 700 ? 6 : 7;
    var cell = this.cell = cssCell * dpr;
    /* a halftone screen: rows offset by half a cell, like the print it imitates */
    var rowH = cell * 0.866;
    var cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / rowH) + 1;
    var n = cols * rows, pos = new Float32Array(n * 2), k = 0;
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) { pos[k++] = (x + (y & 1 ? 0.5 : 0)) * cell; pos[k++] = y * rowH + cell * 0.5; }
    this.cols = cols; this.rows = rows; this.rowH = rowH; this.points = n;
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bPos); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    gl.viewport(0, 0, w, h);
    gl.uniform2f(this.U.u_res, w, h); gl.uniform1f(this.U.u_cell, cell);
    if (this.mode === "graph") this.layout(); else this.sample();
  };

  /* the graph in pixels: clear of the nav above and the captions below */
  Plate.prototype.layout = function () {
    var w = this.w, h = this.h, narrow = this.el.clientWidth < 700;
    /* a portrait plate (a phone) runs the story top to bottom, the way the
       page itself is read there; a landscape one runs it left to right */
    var tall = h > w * 0.9;
    var x0 = w * (tall ? 0.14 : narrow ? 0.09 : 0.1), x1 = w * (tall ? 0.86 : narrow ? 0.91 : 0.9);
    var y0 = h * (tall ? 0.17 : narrow ? 0.26 : 0.24), y1 = h * (tall ? 0.74 : narrow ? 0.72 : 0.76);
    var seed = this.seed;
    var jit = function (i, k) { var v = Math.sin(i * 12.9898 + k * 78.233 + seed) * 43758.5453; return (v - Math.floor(v)) - 0.5; };
    this.P = NODES.map(function (p, i) {
      var along = p[0], across = p[1];
      return tall
        ? [x0 + (x1 - x0) * across + jit(i, 1) * w * 0.03, y0 + (y1 - y0) * along + jit(i, 2) * h * 0.012]
        : [x0 + (x1 - x0) * along + jit(i, 1) * w * 0.018, y0 + (y1 - y0) * across + jit(i, 2) * h * 0.05];
    });
    var seg = new Float32Array(MAXSEG * 4), self = this;
    EDGES.forEach(function (e, i) { var a = self.P[e[0]], b = self.P[e[1]]; seg.set([a[0], a[1], b[0], b[1]], i * 4); });
    this.seg = seg;
    var node = new Float32Array(MAXNODE * 3);
    this.P.forEach(function (p, i) { node.set([p[0], p[1], ENDING[i] ? 1 : 0], i * 3); });
    var gl = this.gl;
    gl.uniform3fv(this.U.u_node, node); gl.uniform1i(this.U.u_nnode, NODES.length);
  };

  /* an image, once per cell: cover-fit, luminance, a curve that lets the
     shadows fall away so the dots carry the shape rather than the murk */
  Plate.prototype.load = function () {
    var self = this, img = new Image();
    img.decoding = "async";
    img.onload = function () { self.img = img; self.sample(); self.ready = true; draw1(self); kick(); };
    img.src = this.src;
  };
  Plate.prototype.sample = function () {
    if (!this.img || !this.cols) return;
    var cols = this.cols, rows = this.rows, cv = document.createElement("canvas");
    cv.width = cols; cv.height = rows;
    var cx = cv.getContext("2d", { willReadFrequently: true });
    var iw = this.img.naturalWidth, ih = this.img.naturalHeight;
    var aspect = (cols * this.cell) / (rows * this.rowH);
    var sw = iw, sh = iw / aspect; if (sh > ih) { sh = ih; sw = ih * aspect; }
    cx.drawImage(this.img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, cols, rows);
    var d; try { d = cx.getImageData(0, 0, cols, rows).data; } catch (_) { return; }
    /* levels from the 3rd and 97th percentile, not the extremes: a night
       scene is mostly shadow, and min/max would leave only the moon */
    var val = new Float32Array(cols * rows), hist = new Uint32Array(256), i;
    for (i = 0; i < val.length; i++) { var l = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255; val[i] = l; hist[Math.min(255, Math.floor(l * 256))]++; }
    var pct = function (q) { var want = val.length * q, acc = 0; for (var j = 0; j < 256; j++) { acc += hist[j]; if (acc >= want) return j / 255; } return 1; };
    var lo = pct(0.03), hi = pct(0.97), span = Math.max(0.08, hi - lo);
    for (i = 0; i < val.length; i++) { var v = Math.max(0, Math.min(1, (val[i] - lo) / span)); v = v * v * (3 - 2 * v); val[i] = Math.pow(v, 0.85); }
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bVal); gl.bufferData(gl.ARRAY_BUFFER, val, gl.STATIC_DRAW);
    this.hasVal = true;
  };

  var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  /* the playhead: walk, choose, light the route, reach an ending, begin again */
  Plate.prototype.step = function (dt) {
    var S = this.S, P = this.P;
    if (!P) return [0, 0, 0];
    if (S.phase === "hold") {
      S.hold -= dt;
      if (S.hold <= 0) {
        var o = OUT[S.at];
        if (!o.length) { S.phase = "fade"; S.fade = 1.3; }
        else {
          S.edge = o[Math.floor(Math.random() * o.length)];
          var a = P[EDGES[S.edge][0]], b = P[EDGES[S.edge][1]];
          S.dur = Math.max(0.75, Math.hypot(b[0] - a[0], b[1] - a[1]) / (190 * this.dpr));
          S.t = 0; S.phase = "move";
        }
      }
    } else if (S.phase === "move") {
      S.t += dt / S.dur;
      if (S.t >= 1) { this.lit[S.edge] = 1; S.at = EDGES[S.edge][1]; S.edge = -1; S.phase = "hold"; S.hold = OUT[S.at].length ? 0.5 : 2.4; }
    } else if (S.phase === "fade") {
      S.fade -= dt;
      if (S.fade <= 0) { this.lit.fill(0); S.at = 0; S.phase = "hold"; S.hold = 0.9; }
    }
    var fadeK = S.phase === "fade" ? Math.max(0, S.fade / 1.3) : 1;
    if (S.phase === "move") {
      var e = EDGES[S.edge], p0 = P[e[0]], p1 = P[e[1]], k = ease(Math.min(1, S.t));
      return [p0[0] + (p1[0] - p0[0]) * k, p0[1] + (p1[1] - p0[1]) * k, 1, fadeK, p0];
    }
    var at = P[S.at];
    return [at[0], at[1], (ENDING[S.at] ? 1 : 0.85) * fadeK, fadeK, null];
  };

  Plate.prototype.render = function (time, dt, still) {
    if (this.dead || !this.points) return;
    var gl = this.gl, U = this.U;
    if (this.mode === "image" && !this.hasVal) return;
    this.lens += (this.lensTarget - this.lens) * Math.min(1, dt * 5);
    gl.uniform1f(U.u_time, time + this.seed);
    gl.uniform2f(U.u_ptr, this.ptr[0], this.ptr[1]);
    gl.uniform1f(U.u_lens, still ? 0 : this.lens);
    if (this.mode === "graph") {
      var head, lit = new Float32Array(MAXSEG), seg = this.seg, n = EDGES.length, i;
      if (still) {
        STILL_ROUTE.forEach(function (ix) { lit[ix] = 1; });
        var endAt = this.P[EDGES[STILL_ROUTE[STILL_ROUTE.length - 1]][1]];
        head = [endAt[0], endAt[1], 1];
      } else {
        var h = this.step(dt), fk = h[3];
        for (i = 0; i < n; i++) lit[i] = this.lit[i] * fk;
        if (h[4]) { seg[n * 4] = h[4][0]; seg[n * 4 + 1] = h[4][1]; seg[n * 4 + 2] = h[0]; seg[n * 4 + 3] = h[1]; lit[n] = 1; n++; }
        head = [h[0], h[1], h[2]];
      }
      gl.uniform4fv(U.u_seg, seg); gl.uniform1fv(U.u_lit, lit); gl.uniform1i(U.u_nseg, n);
      gl.uniform3f(U.u_head, head[0], head[1], head[2]);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bPos); gl.enableVertexAttribArray(this.aPos); gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
    if (this.mode === "image") { gl.bindBuffer(gl.ARRAY_BUFFER, this.bVal); gl.enableVertexAttribArray(this.aVal); gl.vertexAttribPointer(this.aVal, 1, gl.FLOAT, false, 0, 0); }
    else { gl.disableVertexAttribArray(this.aVal); gl.vertexAttrib1f(this.aVal, 0); }
    gl.drawArrays(gl.POINTS, 0, this.points);
    if (!this.shown) { this.shown = true; this.el.classList.add("is-live"); }
  };

  var plates = [];
  hosts.forEach(function (el) { try { var p = new Plate(el); if (!p.dead) plates.push(p); } catch (e) { if (window.console) console.warn("plate:", e.message); } });
  window.DCA.plates = plates.map(function (p) { return { get mode() { return p.mode; }, get points() { return p.points; }, get live() { return !STILL; } }; });
  if (!plates.length) return;

  var STILL = ENV.reduced || ENV.save;
  var raf = 0, last = 0, clock = 0;
  var slow = 0, frames = 0;
  function draw1(p) { p.size(); p.render(STILL ? 12 : clock, 0.016, STILL); }
  function loop(now) {
    raf = 0;
    var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now; clock += dt;
    /* the watchdog: a machine that cannot keep up gets a still plate, not a stutter */
    if (frames < 90) { frames++; if (dt > 0.049) slow++; if (slow > 18) { STILL = true; plates.forEach(draw1); return; } }
    var any = false;
    plates.forEach(function (p) { if (p.visible && p.ready && !p.dead) { p.render(clock, dt, false); any = true; } });
    if (any && !document.hidden) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!STILL && !raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } }

  plates.forEach(function (p) { p.size(); });
  if (STILL) plates.forEach(draw1);
  if ("IntersectionObserver" in window) {
    var pio = new IntersectionObserver(function (en) { en.forEach(function (x) { plates.forEach(function (p) { if (p.el === x.target) p.visible = x.isIntersecting; }); }); kick(); });
    plates.forEach(function (p) { pio.observe(p.el); });
  }
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function () { plates.forEach(function (p) { if (STILL) draw1(p); else p.size(); }); });
    plates.forEach(function (p) { ro.observe(p.el); });
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) kick(); });
  kick();
})();

/* A stray service worker at the site root (Pure Alacrity's, see /sw.js) made
   dcalacrity.com show the app. Any page that loads removes one; /pure/'s own
   worker is a different scope and is left alone. */
(function () {
  try {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then(function (rs) {
      rs.forEach(function (r) { try { if (new URL(r.scope).pathname === '/') r.unregister(); } catch (_) {} });
    });
  } catch (_) {}
})();
