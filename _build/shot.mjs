/* Real screenshots and real measurements of this site, in real Chrome.
   The in-app preview pane reports prefers-reduced-motion: reduce, so the
   motion and the WebGL hero cannot be judged there at all — this emulates
   no-preference. Headless uses a software renderer, which correctly trips the
   hero's own frame watchdog, so --headed is the way to see the WebGL path.

   node dcalacrity-com/_build/shot.mjs <page> <out.png>
        [--w 1440] [--h 900] [--dsf 1] [--calm] [--headed] [--full]
        [--eval "<js>"] [--widths 390,768,1280,1600] [--no-shot] [--wait 2500] [--scroll 900|1.4vh]
        [--hover "<css selector>"]   move a real pointer over an element before the shot, settle 900 ms
*/
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const A = process.argv.slice(2);
const arg = (n, d) => { const i = A.indexOf('--' + n); return i > -1 ? A[i + 1] : d; };
const has = (n) => A.includes('--' + n);
const PUB = arg('root', '') ? path.resolve(arg('root', '')) : path.join(HERE, '..', 'public');   // --root <dir> serves another folder (the design artboards)

const PAGE = (A[0] || 'index.html').replace(/^\/+/, '');
const OUT = A[1] || path.join(HERE, '..', '..', 'shot.png');
const W = +arg('w', 1440), H = +arg('h', 900), DSF = +arg('dsf', 1);
const WAIT = +arg('wait', 2500);
const EVAL = arg('eval', '');
const WIDTHS = arg('widths', '');
const SCROLL = arg('scroll', '');
const HOVER = arg('hover', '');     // a real mouse move (Input.dispatchMouseEvent) to the centre of the first match   // scroll to a pixel offset (or 'N vh') before the shot, and let the scrub settle
const PORT = 8231, DP = 9231;

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4' };

const server = http.createServer((req, res) => {
  let f = decodeURIComponent((req.url || '/').split('?')[0]);
  /* clean URLs, as Cloudflare Pages serves them: /x → x.html, /x/ → x/index.html */
  if (f.endsWith('/')) f += 'index.html';
  else if (!/\.[a-z0-9]+$/i.test(f)) f += '.html';
  const fp = path.join(PUB, f);
  if (!fp.startsWith(PUB)) { res.writeHead(403); res.end(); return; }
  fs.readFile(fp, (e, d) => {
    if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('not found: ' + f); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
    res.end(d);
  });
});

const CHROME = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found'); process.exit(1); }

const PROFILE = path.join(process.env.TEMP || '/tmp', 'dca-shot-' + process.pid);
function killTree(child) {
  try { if (process.platform === 'win32' && child?.pid) spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true }); } catch {}
  try { child.kill(); } catch {}
}

const run = async () => {
  await new Promise((r) => server.listen(PORT, r));
  const flags = [
    `--remote-debugging-port=${DP}`, `--user-data-dir=${PROFILE}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    `--window-size=${W},${H}`, 'about:blank'
  ];
  if (!has('headed')) flags.unshift('--headless=new');
  const chrome = spawn(CHROME, flags, { stdio: 'ignore', windowsHide: true });

  const ws = await (async () => {
    for (let i = 0; i < 60; i++) {
      try {
        const v = await fetch(`http://127.0.0.1:${DP}/json/version`).then((r) => r.json());
        if (v.webSocketDebuggerUrl) return v.webSocketDebuggerUrl;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    throw new Error('devtools never came up');
  })();

  const { WebSocket } = await import('node:worker_threads').then(() => ({ WebSocket: globalThis.WebSocket }));
  const sock = new WebSocket(ws);
  await new Promise((r, j) => { sock.onopen = r; sock.onerror = j; });
  let id = 0; const waiting = new Map();
  sock.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && waiting.has(d.id)) { waiting.get(d.id)(d); waiting.delete(d.id); } };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
    const n = ++id; waiting.set(n, (d) => (d.error ? rej(new Error(d.error.message)) : res(d.result)));
    sock.send(JSON.stringify({ id: n, method, params, sessionId }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const S = (m, p) => send(m, p, sessionId);
  await S('Page.enable'); await S('Runtime.enable');
  await S('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: has('calm') ? 'reduce' : 'no-preference' }, { name: 'prefers-color-scheme', value: 'dark' }] });
  await S('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DSF, mobile: W < 768 });
  /* Without this the page reports pointer: fine at any width, so every
     touch-only rule silently never applies and cannot be verified. */
  await S('Emulation.setTouchEmulationEnabled', { enabled: W < 1024, maxTouchPoints: 5 });
  await S('Emulation.setEmitTouchEventsForMouse', { enabled: W < 1024, configuration: 'mobile' }).catch(function () {});

  const evaluate = async (expr) => {
    const r = await S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, timeout: 30000 });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
    return r.result.value;
  };

  await S('Page.navigate', { url: `http://localhost:${PORT}/${PAGE}` });
  await new Promise((r) => setTimeout(r, WAIT));
  if (SCROLL) {
    const px = /vh$/.test(SCROLL) ? `innerHeight * ${parseFloat(SCROLL)}` : SCROLL;
    /* small steps, so scroll-driven work sees a scroll rather than a jump */
    await evaluate(`(async()=>{const t=${px};for(let i=1;i<=12;i++){window.scrollTo(0,t*i/12);await new Promise(r=>setTimeout(r,45));}return scrollY})()`);
    await new Promise((r) => setTimeout(r, 1100));
  }

  if (HOVER) {
    const box = await evaluate(`(function(){var el=document.querySelector(${JSON.stringify(HOVER)});if(!el)return null;var r=el.getBoundingClientRect();return {x:r.left+r.width*0.62,y:r.top+r.height*0.4};})()`);
    if (box) {
      for (let i = 1; i <= 8; i++) { await S('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x - 40 + i * 5, y: box.y + 10 - i, pointerType: 'mouse' }); await new Promise((r) => setTimeout(r, 30)); }
      await new Promise((r) => setTimeout(r, 900));
    } else console.log('hover: no match for ' + HOVER);
  }

  if (WIDTHS) {
    for (const w of WIDTHS.split(',').map(Number)) {
      await S('Emulation.setDeviceMetricsOverride', { width: w, height: H, deviceScaleFactor: 1, mobile: w < 768 });
      await S('Emulation.setTouchEmulationEnabled', { enabled: w < 1024, maxTouchPoints: 5 });
      await new Promise((r) => setTimeout(r, 700));
      console.log(w + 'px  ' + JSON.stringify(await evaluate(EVAL || '1')));
      if (!has('no-shot')) {
        const s = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        const o = OUT.replace(/\.png$/, `.${w}.png`);
        fs.mkdirSync(path.dirname(o), { recursive: true }); fs.writeFileSync(o, Buffer.from(s.data, 'base64'));
        console.log('  wrote ' + o);
      }
    }
  } else {
    if (!has('no-shot')) {
      const s = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!has('full') });
      fs.mkdirSync(path.dirname(OUT), { recursive: true });
      fs.writeFileSync(OUT, Buffer.from(s.data, 'base64'));
      console.log(`wrote ${OUT}  (${W}×${H} @${DSF}x)`);
    }
    if (EVAL) console.log(JSON.stringify(await evaluate(EVAL)));
  }

  try { sock.close(); } catch {}
  killTree(chrome);
  server.close();
  await new Promise((r) => setTimeout(r, 400));
  try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch {}
  process.exit(0);
};

run().catch((e) => { console.error(String(e)); try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch {} process.exit(1); });
