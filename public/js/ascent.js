/* ═══════════════════════════════════════════════════════════════════════════
   dcalacrity.com — the ascent (home hero, seventh pass)

   The official D.C Alacrity image — the hand, the lightning, the arrow — is
   the hero, alive: one WebGL pass over the photograph and a depth map made
   from it (assets/brand/official-depth.png: R depth, G the lightning, B the
   clouds), so it moves like a scene, not a picture.

     · parallax by depth: the pointer (or a slow drift) moves the near hand
       more than the far sky — the 2.5D "spatial photo" technique
     · the lightning crackles, the arrow breathes, the clouds drift
     · scroll is a camera: the stage is pinned while the camera dollies in
       on the arrow and the image sinks into the site's ink below
     · film grain, a hair of lens fringe, a vignette — then nothing more

   It costs nothing it does not need: drawn at ≤1.5× DPR, paused off-screen
   and in background tabs, and a frame watchdog falls back to the still if a
   device cannot hold it. Reduced motion gets the still and no pin. No
   library.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.querySelector('[data-ascent]');
  if (!root) return;
  var stage = root.querySelector('.ascent__stage');
  var still = root.querySelector('.ascent__still');
  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var reduced = mq('(prefers-reduced-motion: reduce)');
  var save = !!(navigator.connection && navigator.connection.saveData);

  /* the pinned, scroll-driven scene is opt-in: no script, reduced motion or
     data saver get the still layout the stylesheet gives by default */
  if (!reduced && !save) root.classList.add('is-pinned');

  /* every scroll reader runs in one animation frame: reads, then writes */
  var onScrollTasks = [], scrollPending = false;
  function onScroll() { if (scrollPending) return; scrollPending = true; requestAnimationFrame(function () { scrollPending = false; for (var i = 0; i < onScrollTasks.length; i++) onScrollTasks[i](); }); }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── scroll progress through the pinned run, 0 → 1 ───────────────────── */
  var prog = 0;
  function measure() {
    var r = root.getBoundingClientRect(), run = Math.max(1, root.offsetHeight - window.innerHeight);
    prog = Math.max(0, Math.min(1, -r.top / run));
    root.style.setProperty('--p', prog.toFixed(4));
    var chapter = prog < 0.34 ? 0 : prog < 0.7 ? 1 : 2;
    if (root._ch !== chapter) { root._ch = chapter; root.setAttribute('data-ch', chapter); }
  }
  measure();
  onScrollTasks.push(measure);
  window.addEventListener('resize', measure);

  /* the statement inks in word by word with the scroll */
  var words = [].slice.call(root.querySelectorAll('.ascent__say .w'));
  function inkWords() {
    var t = (prog - 0.28) / 0.42;
    var n = Math.round(Math.max(0, Math.min(1, t)) * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);
  }
  if (!reduced && !save) onScrollTasks.push(inkWords);
  else words.forEach(function (w) { w.classList.add('on'); });
  inkWords();

  /* cards: a light that follows the pointer, and a lean toward it */
  if (mq('(hover: hover) and (pointer: fine)')) {
    [].slice.call(document.querySelectorAll('.card, .prop, .backers__item, .proof > div, .momentum__grid > div, .horizon__step')).forEach(function (el) {
      el.classList.add('lit');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        if (!reduced && el.classList.contains('card')) el.style.setProperty('--lean', 'perspective(900px) rotateX(' + ((0.5 - y) * 5).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 6).toFixed(2) + 'deg)');
      });
      el.addEventListener('pointerleave', function () { el.style.removeProperty('--lean'); });
    });
  }

  /* the numbers count up once, when they arrive */
  var counts = [].slice.call(document.querySelectorAll('[data-count]'));
  if (counts.length && 'IntersectionObserver' in window && !reduced) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = +el.getAttribute('data-count'), t0 = performance.now(), dur = 1300 + Math.min(900, to * 6);
        (function tick(now) { var k = Math.min(1, (now - t0) / dur), v = 1 - Math.pow(1 - k, 3); el.textContent = String(Math.round(to * v)); if (k < 1) requestAnimationFrame(tick); })(t0);
      });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }
  /* the horizon line lights as you read along it */
  var hz = document.querySelector('[data-horizon]');
  if (hz) {
    var hzMeasure = function () { var r = hz.getBoundingClientRect(), vh = window.innerHeight; var t = (vh * 0.85 - r.top) / (r.height + vh * 0.35); hz.style.setProperty('--hz', Math.max(0, Math.min(1, t)).toFixed(3)); };
    if (reduced) hz.style.setProperty('--hz', '1'); else { onScrollTasks.push(hzMeasure); hzMeasure(); }
  }

  if (reduced || save) { root.classList.add('is-still'); return; }

  /* ── WebGL ───────────────────────────────────────────────────────────── */
  var canvas = document.createElement('canvas');
  canvas.className = 'ascent__gl';
  canvas.setAttribute('aria-hidden', 'true');
  var gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) { root.classList.add('is-still'); return; }

  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision highp float;',
    'varying vec2 v;',
    'uniform sampler2D uImg,uDep;',
    'uniform vec2 uRes,uMouse,uFocus;',
    'uniform float uT,uP,uIn;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
    'void main(){',
    /* cover-fit a square image, then the camera: a dolly toward the arrow */
    '  vec2 uv=v; uv.y=1.-uv.y;',
    '  float ar=uRes.x/uRes.y; vec2 s=ar>1.?vec2(1.,1./ar):vec2(ar,1.);',
    '  float zoom=1.045+uP*uP*1.35+(1.-uIn)*.1;',
    /* at rest the whole arrow is in shot (the tip sits ~12% down the square) */
    '  vec2 c=mix(vec2(.5,.41),uFocus,smoothstep(0.,1.,uP*1.1));',
    '  uv=c+(uv-.5)*s/zoom;',
    /* parallax by depth, three steps so the near hand slides over the sky */
    '  vec2 drift=vec2(sin(uT*.17),cos(uT*.13))*.35;',
    '  vec2 m=(uMouse+drift*.5)*(.022+uP*.01);',
    '  vec2 q=uv; float d=0.;',
    '  for(int i=0;i<3;i++){d=texture2D(uDep,q).r;q=uv-m*(d-.32);}',
    '  vec3 dm=texture2D(uDep,q).rgb;',
    /* the clouds drift on their own */
    '  q.x+=dm.b*(1.-dm.r)*sin(uT*.05)*.006;',
    /* a hair of lens fringe toward the edges */
    '  vec2 off=(v-.5)*.0016*(1.+uP*2.);',
    '  vec3 col=vec3(texture2D(uImg,q+off).r,texture2D(uImg,q).g,texture2D(uImg,q-off).b);',
    /* the lightning crackles, the arrow breathes */
    '  float L=dm.g;',
    '  float halo=0.; for(int k=0;k<6;k++){float a=float(k)*1.0472; halo+=texture2D(uDep,q+vec2(cos(a),sin(a))*.012).g;} halo/=6.;',
    '  float fl=.55+.45*n(q*38.+uT*9.)*n(q*11.-uT*3.);',
    '  float pulse=.75+.25*sin(uT*2.1);',
    '  col+=vec3(.42,.82,1.)*(L*fl*.55+halo*.35*pulse);',
    '  col+=vec3(.55,.35,1.)*halo*.12*(1.-pulse);',
    /* grade: a touch of contrast, the brand blue in the shadows */
    '  col=mix(col,col*col*(3.-2.*col),.18);',
    '  col=mix(col,vec3(.012,.03,.047),smoothstep(.55,1.,uP)*.92);',
    '  float vig=smoothstep(1.25,.25,length((v-.5)*vec2(ar,1.)*.9));',
    '  col*=mix(.55,1.,vig);',
    '  col+=(h(v*uRes+fract(uT)*100.)-.5)*.035;',
    '  col*=uIn;',
    '  gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
  var prog_;
  try { prog_ = gl.createProgram(); gl.attachShader(prog_, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog_, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog_); if (!gl.getProgramParameter(prog_, gl.LINK_STATUS)) throw new Error('link'); }
  catch (e) { root.classList.add('is-still'); return; }
  gl.useProgram(prog_);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog_, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {}; ['uImg', 'uDep', 'uRes', 'uMouse', 'uFocus', 'uT', 'uP', 'uIn'].forEach(function (k) { U[k] = gl.getUniformLocation(prog_, k); });

  function tex(unit, img) {
    var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  function load(src) { return new Promise(function (res, rej) { var i = new Image(); i.decoding = 'async'; i.onload = function () { res(i); }; i.onerror = rej; i.src = src; }); }

  var big = window.innerWidth * Math.min(1.5, window.devicePixelRatio || 1) > 1100;
  var imgSrc = root.getAttribute('data-img-' + (big ? 'lg' : 'sm')) || root.getAttribute('data-img-lg');
  onScrollTasks.push(function () { if (paused) start(); });
  Promise.all([load(imgSrc), load(root.getAttribute('data-depth'))]).then(function (r) {
    tex(0, r[0]); tex(1, r[1]);
    gl.uniform1i(U.uImg, 0); gl.uniform1i(U.uDep, 1);
    gl.uniform2f(U.uFocus, 0.452, 0.24);   /* the arrow, in image coordinates */
    stage.insertBefore(canvas, stage.firstChild);
    start();
  }, function () { root.classList.add('is-still'); });

  /* ── the loop ────────────────────────────────────────────────────────── */
  var mx = 0, my = 0, tx = 0, ty = 0, t0 = performance.now(), raf = 0, visible = true, onScreen = true, frames = 0, slow = 0, last = 0;
  function size() {
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    var w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  function frame(now) {
    raf = 0;
    if (!visible || !onScreen) return;
    /* paused: hold the frame, but keep following the scroll so the camera still moves with the page */
    if (paused && Math.abs(prog - (frame._p == null ? -1 : frame._p)) < 1e-4 && frame._drawn) return;
    /* the watchdog: a device that cannot hold the scene gets the still */
    var gap = now - last; last = now;
    if (frames < 90) { frames++; if (frames > 10 && gap > 48) slow++; if (frames === 90 && slow > 30) { canvas.remove(); root.classList.add('is-still'); return; } }
    size();
    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
    if (paused) { t0 += gap; } frame._p = prog; frame._drawn = true;
    var tt = (now - t0) / 1000;
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform2f(U.uMouse, mx, my);
    gl.uniform1f(U.uT, tt);
    gl.uniform1f(U.uP, prog);
    gl.uniform1f(U.uIn, Math.min(1, tt / 1.6));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(frame);
  }
  /* moving content that plays on its own for more than five seconds gets a pause (WCAG 2.2.2) */
  var paused = false, pauseBtn = root.querySelector('[data-ascent-pause]');
  try { paused = localStorage.getItem('dca_motion') === 'off'; } catch (_) {}
  function setPaused(p) {
    paused = p; root.classList.toggle('is-paused', p);
    if (pauseBtn) { pauseBtn.setAttribute('aria-pressed', p ? 'true' : 'false'); pauseBtn.setAttribute('aria-label', p ? 'Play the hero animation' : 'Pause the hero animation'); }
    try { localStorage.setItem('dca_motion', p ? 'off' : 'on'); } catch (_) {}
    if (!p) start();
  }
  if (pauseBtn) { pauseBtn.hidden = false; pauseBtn.addEventListener('click', function () { setPaused(!paused); }); }
  function start() { root.classList.add('is-live'); if (!raf) raf = requestAnimationFrame(frame); }
  window.addEventListener('pointermove', function (e) { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; }, { passive: true });
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) start(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; if (onScreen) start(); }, { threshold: 0 }).observe(root);
  window.addEventListener('resize', function () { if (!raf) start(); });

  window.DCA = window.DCA || {};
  window.DCA.ascent = { progress: function () { return prog; }, live: function () { return !!raf; } };
})();
