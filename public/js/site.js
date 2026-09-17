/* dcalacrity.com — behaviour.
   Part 1: navigation, the contact form, the year. Runs everywhere.
   Part 2: motion — the story graph in the hero, the reveals, the compiler
   rail, the screen fan. Runs only where motion is allowed, and nothing in
   the markup or CSS waits for it. See ../../DESIGN.md. */

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

  /* the desktop nav's travelling highlight */
  var nav = document.querySelector(".nav");
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (nav && !calm && window.matchMedia("(min-width: 1024px)").matches) {
    var ind = document.createElement("span");
    ind.className = "nav__ind"; ind.setAttribute("aria-hidden", "true");
    nav.appendChild(ind);
    var items = [].slice.call(nav.querySelectorAll("a")).filter(function (a) { return !a.classList.contains("btn"); });
    var current = nav.querySelector('a[aria-current="page"]');
    var moveTo = function (el) {
      if (!el) { nav.classList.remove("ind-on"); return; }
      ind.style.width = el.offsetWidth + "px";
      ind.style.transform = "translateX(" + el.offsetLeft + "px)";
      nav.classList.add("ind-on");
    };
    var rest = function () { moveTo(current); };
    items.forEach(function (a) { a.addEventListener("mouseenter", function () { moveTo(a); }); a.addEventListener("focus", function () { moveTo(a); }); });
    nav.addEventListener("mouseleave", rest);
    nav.addEventListener("focusout", function (e) { if (!nav.contains(e.relatedTarget)) rest(); });
    rest();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rest);
    window.addEventListener("resize", rest, { passive: true });
  }

  /* contact form — the endpoint captures the lead before it emails, so the
     visitor is only handed a mail draft when the site itself is unreachable */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = document.querySelector("#contact-status");
    var submitBtn = document.querySelector("#contact-submit");
    var setStatus = function (kind, text) {
      if (!status) return;
      status.hidden = false;
      status.className = "form-status" + (kind ? " is-" + kind : "");
      status.textContent = text;
    };
    var params = new URLSearchParams(window.location.search);
    var topic = params.get("topic");
    var sel = document.getElementById("topic");
    if (topic && sel) {
      var found = false;
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === topic) { sel.selectedIndex = i; found = true; break; }
      if (!found) { var opt = document.createElement("option"); opt.value = topic; opt.textContent = topic; opt.selected = true; sel.appendChild(opt); }
    }
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      form.querySelectorAll(".is-invalid").forEach(function (el) { el.classList.remove("is-invalid"); });
      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || "").toString().trim(); };
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
        setStatus("success", result.message || (result.emailed === false
          ? "Message received" + (result.ref ? " (ref " + result.ref + ")" : "") + ". We have it — no need to resend."
          : "Message sent. We reply within two business days on commercial estimates."));
      } catch (err) {
        var subject = encodeURIComponent("[dcalacrity.com] " + (payload.topic || "Inquiry") + " — " + payload.name);
        var body = encodeURIComponent(["Name: " + payload.name, "Email: " + payload.email, "Phone: " + (payload.phone || "—"), "Organization: " + (payload.organization || "—"), "Topic: " + payload.topic, "Project type: " + (payload.projectType || "—"), "Budget: " + (payload.budget || "—"), "Timeline: " + (payload.timeline || "—"), "Found us via: " + (payload.source || "—"), "", payload.message].join("\n"));
        setStatus("error", "Couldn’t reach us from the site just now — opening an email draft so nothing you wrote is lost. You can also write pure@dcalacrity.com directly.");
        window.location.href = "mailto:pure@dcalacrity.com?subject=" + subject + "&body=" + body;
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send message"; }
      }
    });
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   Motion. The rules: only transform, opacity and filter move; reduced motion
   turns everything off, not down; WebGL never runs on a phone, under
   reduced motion, with saveData, or on a machine that drops frames.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var conn = navigator.connection || {};
  var ENV = {
    reduced: mq("(prefers-reduced-motion: reduce)"),
    fine: mq("(hover: hover) and (pointer: fine)"),
    phone: mq("(max-width: 768px)"),
    tablet: mq("(max-width: 1023px)"),
    saveData: !!conn.saveData
  };
  var hasGL = function () { try { var c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch (_) { return false; } };
  var G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) G.registerPlugin(ST);
  window.DCA = window.DCA || {};
  window.DCA.env = ENV;

  /* ── the story graph: the real topology of Right Here Right Now! ─────────
     14 scene nodes, 18 choices, read from the shipped Alacrity Player bundle.
     Columns are story progression and become depth; a node with no way out
     is an ending. Labels are not drawn: the shape is the statement. */
  var GRAPH = {
    start: "event_zero",
    nodes: [["event_zero", 80, 60], ["event_1A", 320, 60], ["event_2A", 320, 220], ["event_1B", 560, 60], ["event_2B", 560, 220], ["event_3B", 560, 380], ["event_4B", 560, 540], ["event_1C", 800, 60], ["event_2C", 800, 220], ["event_1D", 1040, 60], ["event_5D", 800, 540], ["event_9D", 800, 380], ["event_13D", 800, 700], ["event_16D", 800, 860]],
    links: [["event_zero", "event_1A"], ["event_zero", "event_2A"], ["event_1A", "event_1B"], ["event_1A", "event_2B"], ["event_2A", "event_3B"], ["event_2A", "event_4B"], ["event_1B", "event_1C"], ["event_1B", "event_2C"], ["event_2B", "event_9D"], ["event_2B", "event_5D"], ["event_3B", "event_13D"], ["event_3B", "event_16D"], ["event_4B", "event_1C"], ["event_4B", "event_2C"], ["event_1C", "event_1D"], ["event_1C", "event_9D"], ["event_2C", "event_5D"], ["event_2C", "event_9D"]]
  };
  var ARC = [0.21, 0.84, 1.0], EMBER = [1.0, 0.70, 0.36], PLASMA = [0.69, 0.30, 1.0];

  /* The graph is a plane — it was authored as one — so it is presented as a
     plane in perspective rather than scattered into a cloud. Story order runs
     along it and recedes to the right; branches stack across it. The result
     still reads as the same diagram, which is the point. */
  var PLANE = { turn: 0.66, along: 1.18, across: 0.78, x0: 2.2, y0: 0.62, z0: -1.5 };

  function buildGraph() {
    var byId = {}, outs = {};
    GRAPH.links.forEach(function (l) { outs[l[0]] = (outs[l[0]] || 0) + 1; });
    var ct = Math.cos(PLANE.turn), st = Math.sin(PLANE.turn);
    var nodes = GRAPH.nodes.map(function (n, i) {
      var col = Math.round((n[1] - 80) / 240);          /* 0..4 — story order */
      var row = (n[2] - 460) / 400;                      /* -1..1 — which branch */
      var along = col * PLANE.along - 3;
      var wobble = Math.sin(i * 12.9898) * 0.06;         /* hand-placed, not a lattice */
      var p = {
        id: n[0],
        x: along * ct + PLANE.x0 + wobble,
        y: -row * PLANE.across + PLANE.y0 + wobble,
        z: -along * st + PLANE.z0,
        kind: n[0] === GRAPH.start ? "start" : (outs[n[0]] ? "scene" : "end")
      };
      p.c = p.kind === "start" ? EMBER : p.kind === "end" ? PLASMA : ARC;
      byId[n[0]] = p;
      return p;
    });
    var links = GRAPH.links.map(function (l, i) { return { a: byId[l[0]], b: byId[l[1]], phase: (i * 0.618) % 1, speed: 0.14 + ((i * 7) % 5) * 0.02 }; });
    return { nodes: nodes, links: links };
  }

  /* camera: a perspective projection with a pointer tilt and a scroll dolly */
  function makeCamera() {
    var cam = { z: 5.1, y: 0.5, tx: 0, ty: 0, dolly: 0, fov: 1.05 };
    cam.project = function (p, w, h) {
      var cz = cam.z - cam.dolly * 5.2;
      var dx = p.x, dy = p.y - cam.y, dz = p.z - cz;
      var ry = cam.tx * 0.35, rx = -0.16 + cam.ty * 0.25;
      var x1 = dx * Math.cos(ry) - dz * Math.sin(ry), z1 = dx * Math.sin(ry) + dz * Math.cos(ry);
      var y1 = dy * Math.cos(rx) - z1 * Math.sin(rx), z2 = dy * Math.sin(rx) + z1 * Math.cos(rx);
      if (z2 > -0.2) return null;
      var f = 1 / Math.tan(cam.fov / 2), aspect = w / h;
      return { x: (x1 * f / aspect) / -z2, y: (y1 * f) / -z2, depth: -z2 };
    };
    return cam;
  }

  var stage = document.querySelector(".stage");
  var graph = stage ? buildGraph() : null;
  var cam = makeCamera();

  /* Warmth by depth: the far end of the graph is nearer the sun, so it picks
     up the key light. Same rule in the shader and in the SVG fallback, so the
     two paths cannot look like different pages. */
  var NEAR_W = 3.6, FAR_W = 8.4;
  function warmth(depth) { return Math.min(1, Math.max(0, (depth - NEAR_W) / (FAR_W - NEAR_W))); }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function css(c) { return "rgb(" + c.map(function (v) { return Math.round(v * 255); }).join(",") + ")"; }

  /* the fallback: the same graph, the same camera, drawn once as inline SVG */
  var svgRaf = 0;
  function drawSVG() {
    if (!stage) return;
    var old = stage.querySelector(".stage__svg");
    var w = Math.max(320, stage.clientWidth), h = Math.max(320, stage.clientHeight);
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "stage__svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    var px = function (p) { var q = cam.project(p, w, h); return q ? { x: w / 2 + q.x * w / 2, y: h / 2 - q.y * h / 2, d: q.depth } : null; };
    var g = document.createElementNS(NS, "g");
    graph.links.forEach(function (l) {
      var a = px(l.a), b = px(l.b); if (!a || !b) return;
      var t = warmth((a.d + b.d) / 2);
      var path = document.createElementNS(NS, "path");
      var mid = px({ x: (l.a.x + l.b.x) / 2, y: (l.a.y + l.b.y) / 2 + 0.28, z: (l.a.z + l.b.z) / 2 });
      path.setAttribute("d", mid
        ? "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " Q" + mid.x.toFixed(1) + " " + mid.y.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1)
        : "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + "L" + b.x.toFixed(1) + " " + b.y.toFixed(1));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", css(mix(ARC, EMBER, t)));
      path.setAttribute("stroke-opacity", (0.5 - t * 0.14).toFixed(2));
      path.setAttribute("stroke-width", (2 - t * 0.9).toFixed(2));
      g.appendChild(path);
    });
    graph.nodes.forEach(function (n) {
      var p = px(n); if (!p) return;
      var t = warmth(p.d);
      var base = n.kind === "start" ? EMBER : n.kind === "end" ? PLASMA : ARC;
      var c = css(mix(base, EMBER, t * 0.7));
      var r = Math.max(3, 26 / p.d * 2.4);
      var halo = document.createElementNS(NS, "circle");
      halo.setAttribute("cx", p.x.toFixed(1)); halo.setAttribute("cy", p.y.toFixed(1));
      halo.setAttribute("r", (r * 2.3).toFixed(1));
      halo.setAttribute("fill", c); halo.setAttribute("fill-opacity", (0.16 - t * 0.05).toFixed(2));
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", p.x.toFixed(1)); dot.setAttribute("cy", p.y.toFixed(1));
      dot.setAttribute("r", r.toFixed(1));
      dot.setAttribute("fill", c); dot.setAttribute("fill-opacity", (0.95 - t * 0.25).toFixed(2));
      g.appendChild(halo); g.appendChild(dot);
    });
    svg.appendChild(g);
    if (old) old.replaceWith(svg); else stage.insertBefore(svg, stage.firstChild);
  }
  function redrawSVG() { if (svgRaf) return; svgRaf = requestAnimationFrame(function () { svgRaf = 0; if (stage.querySelector(".stage__svg")) drawSVG(); }); }

  /* the WebGL graph: points and lines with perspective, additive glow,
     a pulse travelling every choice. A few hundred vertices. */
  function startGL() {
    if (!stage || ENV.reduced || ENV.phone || ENV.saveData || !hasGL()) return false;
    var c = document.createElement("canvas"); c.className = "stage__gl"; c.setAttribute("aria-hidden", "true");
    var gl = c.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return false;
    /* WM is the key light's colour. Everything the far end of the graph is
       made of drifts toward it, because that end is nearer the sun. */
    var VS = "attribute vec3 p;attribute vec3 col;attribute float sz;uniform vec2 R;uniform vec3 C;uniform vec2 T;uniform float D;uniform vec3 WM;uniform float SC;varying vec3 vc;varying float va;" +
      "void main(){float cz=C.z-D*5.2;vec3 d=vec3(p.x,p.y-C.y,p.z-cz);float ry=T.x*.35,rx=-.16+T.y*.25;" +
      "float x1=d.x*cos(ry)-d.z*sin(ry),z1=d.x*sin(ry)+d.z*cos(ry);float y1=d.y*cos(rx)-z1*sin(rx),z2=d.y*sin(rx)+z1*cos(rx);" +
      "float f=1./tan(.525);float a=R.x/R.y;float w=-z2;gl_Position=vec4(x1*f/a,y1*f,w*.1,w);" +
      "float fog=clamp(1.-(w-2.2)/14.,0.,1.);va=pow(fog,1.25);" +
      "float t=clamp((w-3.6)/4.8,0.,1.);vc=mix(col,WM,t*.72);" +
      "gl_PointSize=sz*SC*clamp(3.6/w,.3,2.4);}";
    /* A point is a soft disc, not a square. The wide, gentle falloff is what
       makes a few hundred vertices read as light rather than as confetti. */
    var FS = "precision mediump float;varying vec3 vc;varying float va;uniform float P;" +
      "void main(){float a=va;if(P>.5){vec2 q=gl_PointCoord-.5;float r=length(q)*2.;if(r>1.)discard;" +
      "float k=pow(1.-r,1.7);a*=k*(.42+.58*smoothstep(.55,0.,r));}gl_FragColor=vec4(vc,a);}";
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
    var prog;
    try { prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link"); } catch (e) { return false; }
    gl.useProgram(prog);
    var aP = gl.getAttribLocation(prog, "p"), aC = gl.getAttribLocation(prog, "col"), aS = gl.getAttribLocation(prog, "sz");
    var uR = gl.getUniformLocation(prog, "R"), uC = gl.getUniformLocation(prog, "C"), uT = gl.getUniformLocation(prog, "T"), uD = gl.getUniformLocation(prog, "D"), uP = gl.getUniformLocation(prog, "P"), uW = gl.getUniformLocation(prog, "WM"), uSC = gl.getUniformLocation(prog, "SC");
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.disable(gl.DEPTH_TEST);

    /* geometry: floor grid, links as curved polylines, nodes, pulses */
    var lines = [], SEG = 14;
    var pushV = function (arr, x, y, z, c, s) { arr.push(x, y, z, c[0], c[1], c[2], s); };
    var FLOOR = -1.5, DIM = [0.13, 0.30, 0.42];
    for (var gx = -8; gx <= 8; gx++) { pushV(lines, gx, FLOOR, 2, DIM, 0); pushV(lines, gx, FLOOR, -16, DIM, 0); }
    for (var gz = 2; gz >= -16; gz -= 1) { pushV(lines, -8, FLOOR, gz, DIM, 0); pushV(lines, 8, FLOOR, gz, DIM, 0); }
    /* Links are drawn as a run of small lights rather than as GL LINES.
       A GL line is one pixel wide whatever the screen, which at this scale
       disappears; a trace of points carries depth, thickness and glow. */
    var pts = [];
    SEG = 26;
    graph.links.forEach(function (l) {
      for (var i = 0; i <= SEG; i++) {
        var t = i / SEG, u = 1 - t;
        var bx = (l.a.x + l.b.x) / 2, by = (l.a.y + l.b.y) / 2 + 0.3, bz = (l.a.z + l.b.z) / 2;
        var x = u * u * l.a.x + 2 * u * t * bx + t * t * l.b.x;
        var y = u * u * l.a.y + 2 * u * t * by + t * t * l.b.y;
        var z = u * u * l.a.z + 2 * u * t * bz + t * t * l.b.z;
        pushV(pts, x, y, z, ARC, 30);
      }
    });
    /* Each node is three passes: a wide bloom, the body, and a white core. */
    graph.nodes.forEach(function (n) {
      var big = n.kind === "start" ? 260 : n.kind === "end" ? 210 : 175;
      pushV(pts, n.x, n.y, n.z, n.c, big);
      pushV(pts, n.x, n.y, n.z, n.c, big * 0.42);
      pushV(pts, n.x, n.y, n.z, [1, 0.97, 0.9], n.kind === "start" ? 22 : 15);
    });
    var lineBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
    var ptBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
    var pulse = new Float32Array(graph.links.length * 7);
    var pulseBuf = gl.createBuffer();
    var bind = function (buf) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(aC); gl.vertexAttribPointer(aC, 3, gl.FLOAT, false, 28, 12);
      gl.enableVertexAttribArray(aS); gl.vertexAttribPointer(aS, 1, gl.FLOAT, false, 28, 24);
    };

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 2, H = 2;
    var size = function () { var w = Math.max(2, Math.floor(stage.clientWidth * dpr)), h = Math.max(2, Math.floor(stage.clientHeight * dpr)); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; W = w; H = h; gl.viewport(0, 0, w, h); } };
    var tx = 0, ty = 0, gx2 = 0, gy2 = 0, visible = !document.hidden, onScreen = true, raf = 0, t0 = performance.now(), last = 0, fade = 0;
    var slow = 0, checked = 0, alive = true;
    var lineAlpha = 0.22;
    function frame(now) {
      raf = 0;
      if (!alive || !visible || !onScreen) return;
      var gap = now - last;
      if (checked < 60 && last) { checked++; if (gap > 58) slow++; if (checked === 60 && slow > 12) { window.DCA.glDegraded = true; stop(); drawSVG(); return; } }
      last = now; size();
      fade = Math.min(1, fade + 0.02);
      gx2 += (tx - gx2) * 0.06; gy2 += (ty - gy2) * 0.06;
      var t = (now - t0) / 1000;
      var breathe = Math.sin(t * 0.35) * 0.02;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uR, W, H); gl.uniform3f(uC, 0, cam.y + breathe, cam.z); gl.uniform2f(uT, gx2, gy2); gl.uniform1f(uD, cam.dolly);
      gl.uniform3f(uW, EMBER[0], EMBER[1], EMBER[2]);
      /* Point sizes are in device pixels, so they scale with the canvas — a
         node must not shrink because the screen is denser. */
      gl.uniform1f(uSC, H / 900);
      /* the floor */
      gl.uniform1f(uP, 0); bind(lineBuf);
      gl.drawArrays(gl.LINES, 0, lines.length / 7);
      /* the graph */
      gl.uniform1f(uP, 1); bind(ptBuf);
      gl.drawArrays(gl.POINTS, 0, pts.length / 7);
      /* pulses: one light travelling each choice */
      for (var i = 0; i < graph.links.length; i++) {
        var l = graph.links[i], k = (t * l.speed + l.phase) % 1, u = 1 - k;
        var by = (l.a.y + l.b.y) / 2 + 0.28, bz = (l.a.z + l.b.z) / 2, bx = (l.a.x + l.b.x) / 2;
        var o = i * 7;
        pulse[o] = u * u * l.a.x + 2 * u * k * bx + k * k * l.b.x; pulse[o + 1] = u * u * l.a.y + 2 * u * k * by + k * k * l.b.y; pulse[o + 2] = u * u * l.a.z + 2 * u * k * bz + k * k * l.b.z;
        var e = Math.sin(k * Math.PI);
        pulse[o + 3] = 0.7 + 0.3 * e; pulse[o + 4] = 0.95; pulse[o + 5] = 1; pulse[o + 6] = 36 * e + 7;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, pulseBuf); gl.bufferData(gl.ARRAY_BUFFER, pulse, gl.DYNAMIC_DRAW); bind(pulseBuf);
      gl.drawArrays(gl.POINTS, 0, graph.links.length);
      c.style.opacity = String(fade * (1 - Math.min(1, cam.dolly * 1.4)));
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && alive && visible && onScreen) raf = requestAnimationFrame(frame); }
    function stop() { alive = false; if (raf) cancelAnimationFrame(raf); raf = 0; try { c.remove(); } catch (_) {} window.DCA.gl = null; }
    if (ENV.fine) {
      stage.addEventListener("pointermove", function (e) { var r = stage.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; }, { passive: true });
      stage.addEventListener("pointerleave", function () { tx = 0; ty = 0; });
    }
    document.addEventListener("visibilitychange", function () { visible = !document.hidden; kick(); });
    if ("IntersectionObserver" in window) { new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; kick(); }, { threshold: 0.02 }).observe(stage); }
    window.addEventListener("resize", function () { size(); }, { passive: true });
    c.style.opacity = "0";
    stage.insertBefore(c, stage.firstChild);
    window.DCA.gl = { canvas: c, stop: stop, cam: cam };
    kick();
    return true;
  }

  if (stage) {
    var ok = false;
    try { ok = startGL(); } catch (e) { ok = false; }
    if (!ok) drawSVG();
    /* the scroll dolly: the camera moves into the graph as the hero leaves */
    var dollyFrame = function () {
      var r = stage.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.9)));
      cam.dolly = p;
    };
    if (!ENV.reduced) { window.addEventListener("scroll", dollyFrame, { passive: true }); dollyFrame(); }
    window.addEventListener("resize", redrawSVG, { passive: true });
  }

  /* ── the proof that the stage costs nothing ─────────────────────────── */
  window.DCA.measure = function (ms) {
    return new Promise(function (resolve) {
      var t = performance.now(), last = t, n = 0, over32 = 0, over50 = 0, worst = 0, sum = 0;
      (function tick(now) {
        var d = now - last; last = now;
        if (n > 0) { sum += d; if (d > 32) over32++; if (d > 50) over50++; if (d > worst) worst = d; }
        n++;
        if (now - t < (ms || 2000)) requestAnimationFrame(tick);
        else resolve({ frames: n, over32: over32, over50: over50, worst: Math.round(worst * 10) / 10, avg: Math.round(sum / Math.max(1, n - 1) * 10) / 10, gl: !!window.DCA.gl });
      })(t);
    });
  };

  if (ENV.reduced || !G) return;

  /* ── progress rail ──────────────────────────────────────────────────── */
  var prog = document.createElement("div"); prog.className = "progress"; prog.setAttribute("aria-hidden", "true");
  var fill = document.createElement("i"); prog.appendChild(fill); document.body.appendChild(prog);
  var pTick = false;
  var pFrame = function () { pTick = false; var doc = document.documentElement; var max = (doc.scrollHeight - window.innerHeight) || 1; fill.style.transform = "scaleX(" + Math.min(1, Math.max(0, window.scrollY / max)) + ")"; };
  window.addEventListener("scroll", function () { if (!pTick) { pTick = true; requestAnimationFrame(pFrame); } }, { passive: true });
  pFrame();

  /* ── the hero's one orchestrated moment ─────────────────────────────── */
  var h1 = document.querySelector(".stage h1");
  function splitWords(node) {
    [].slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = String(child.nodeValue).split(/(\s+)/), frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var box = document.createElement("span"); box.className = "w";
          var inner = document.createElement("span"); inner.textContent = part; box.appendChild(inner); frag.appendChild(box);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && !child.classList.contains("w")) splitWords(child);
    });
  }
  if (h1 && stage) {
    splitWords(h1);
    var words = h1.querySelectorAll(".w > span");
    var tl = G.timeline({ defaults: { ease: "expo.out" } });
    tl.from(words, { yPercent: 110, duration: 1.1, stagger: 0.07 }, 0.15)
      .from(stage.querySelectorAll(".stage__copy .eyebrow, .stage .lede, .stage .btn-row, .stage__aside > *"), { y: 26, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.55)
      .fromTo(".stage__key", { opacity: 0, rotate: -10 }, { opacity: 0.9, rotate: 0, duration: 1.4, ease: "power2.out" }, 0.4)
      .to(".stage__key", { opacity: 0.35, rotate: 5, duration: 2.2, ease: "power1.inOut" }, 1.8);
    G.to(".stage__key", { rotate: "+=6", duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4 });
  }

  /* ── sections rise; flats stand up out of the floor ──────────────────── */
  ST.batch("[data-rise]", {
    start: "top 88%",
    once: true,
    onEnter: function (els) { G.from(els, { y: 42, opacity: 0, duration: 1.05, ease: "expo.out", stagger: 0.08, clearProps: "transform,opacity" }); }
  });
  G.utils.toArray(".stagey").forEach(function (sec) {
    var flats = sec.querySelectorAll("[data-flat]");
    if (!flats.length) return;
    ST.batch(flats, {
      start: "top 90%",
      once: true,
      onEnter: function (els) { G.from(els, { rotateX: 16, y: 56, opacity: 0, transformOrigin: "50% 100%", transformPerspective: 1400, duration: 1.2, ease: "expo.out", stagger: 0.09, clearProps: "transform,opacity" }); }
    });
  });

  /* ── the compiler rail — pinned dolly on a laptop, a snap strip below ── */
  var rail = document.querySelector(".rail");
  if (rail) {
    var mm = G.matchMedia();
    mm.add("(min-width: 1024px)", function () {
      var track = rail.querySelector(".rail__track"), nodes = G.utils.toArray(rail.querySelectorAll(".node"));
      /* The focused card sits near the left edge and the rest recede to the
         right and back, so the rail reads in the direction it is read in. */
      var STEP_X = 300, STEP_Z = 380, BASE_X = -474, n = nodes.length;
      nodes.forEach(function (el, i) { el.style.transform = "translate3d(" + (i * STEP_X) + "px,0," + (-i * STEP_Z) + "px)"; el.style.opacity = "1"; });
      track.style.transform = "translate3d(" + BASE_X + "px,0,0)";
      var st = ST.create({
        trigger: rail, start: "top top", end: "+=" + (n * 640), pin: rail.querySelector(".rail__pin"), scrub: 0.8,
        onUpdate: function (self) {
          var p = self.progress * (n - 1);
          track.style.transform = "translate3d(" + (BASE_X - p * STEP_X) + "px,0," + (p * STEP_Z) + "px)";
          nodes.forEach(function (el, i) {
            var d = i - p;
            var op = d < -0.6 ? Math.max(0, 1 - (-d - 0.6) * 1.6) : Math.max(0.18, 1 - Math.abs(d) * 0.33);
            el.style.opacity = String(op);
            var flat = el.firstElementChild; if (flat) flat.style.filter = Math.abs(d) < 0.5 ? "none" : "brightness(" + (0.9 - Math.min(0.45, Math.abs(d) * 0.18)) + ")";
          });
        }
      });
      return function () { st.kill(); nodes.forEach(function (el) { el.style.transform = ""; el.style.opacity = ""; }); track.style.transform = ""; };
    });
  }

  /* ── the app's screens, fanned in depth ─────────────────────────────── */
  var fan = document.querySelector(".fan");
  if (fan) {
    var shots = [].slice.call(fan.querySelectorAll(".fan__shot")), dots = [].slice.call(fan.querySelectorAll(".fan__dots button"));
    var order = ["is-a", "is-b", "is-c", "is-d"], cur = 0, timer = 0;
    var show = function (idx) {
      cur = idx;
      shots.forEach(function (s, i) { s.className = "fan__shot " + order[Math.min(order.length - 1, (i - idx + shots.length) % shots.length)]; });
      dots.forEach(function (d, i) { d.setAttribute("aria-current", i === idx ? "true" : "false"); });
    };
    var next = function () { show((cur + 1) % shots.length); };
    var arm = function () { clearInterval(timer); timer = setInterval(next, 4600); };
    dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i); arm(); }); });
    show(0);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { if (en[0].isIntersecting) arm(); else clearInterval(timer); }, { threshold: 0.2 }).observe(fan); else arm();
    if (ENV.fine && !ENV.tablet) {
      var fx = 0, fy = 0, fraf = 0;
      var apply = function () { fraf = 0; fan.style.transform = "rotateY(" + (fx * 6).toFixed(2) + "deg) rotateX(" + (-fy * 4).toFixed(2) + "deg)"; };
      fan.style.transformStyle = "preserve-3d"; fan.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
      fan.addEventListener("pointermove", function (e) { var r = fan.getBoundingClientRect(); fx = (e.clientX - r.left) / r.width - 0.5; fy = (e.clientY - r.top) / r.height - 0.5; if (!fraf) fraf = requestAnimationFrame(apply); });
      fan.addEventListener("pointerleave", function () { fx = 0; fy = 0; if (!fraf) fraf = requestAnimationFrame(apply); });
    }
  }

  if (!ENV.fine) return;   /* everything below is a hover behaviour */

  /* ── spotlight follows the pointer across flats and rows ─────────────── */
  document.addEventListener("pointermove", function (e) {
    var el = e.target.closest && e.target.closest(".flat, .area");
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
  }, { passive: true });

  /* ── flats lean toward the pointer, shallow on purpose ───────────────── */
  G.utils.toArray("[data-tilt]").forEach(function (el) {
    var raf = 0, rx = 0, ry = 0;
    var apply = function () { raf = 0; el.style.transform = "perspective(1000px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateZ(0)"; };
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      ry = ((e.clientX - r.left) / r.width - 0.5) * 6; rx = (0.5 - (e.clientY - r.top) / r.height) * 6;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    el.addEventListener("pointerleave", function () { if (raf) cancelAnimationFrame(raf); raf = 0; el.style.transform = ""; });
  });

  /* ── buttons acknowledge the cursor without chasing it ───────────────── */
  G.utils.toArray(".btn").forEach(function (btn) {
    var raf = 0, dx = 0, dy = 0;
    var apply = function () { raf = 0; btn.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)"; };
    btn.addEventListener("pointermove", function (e) {
      var r = btn.getBoundingClientRect();
      dx = Math.max(-5, Math.min(5, (e.clientX - (r.left + r.width / 2)) * 0.16)); dy = Math.max(-4, Math.min(4, (e.clientY - (r.top + r.height / 2)) * 0.16));
      if (!raf) raf = requestAnimationFrame(apply);
    });
    btn.addEventListener("pointerleave", function () { if (raf) cancelAnimationFrame(raf); raf = 0; btn.style.transform = ""; });
  });
})();
