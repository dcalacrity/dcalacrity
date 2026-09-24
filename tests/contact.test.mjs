/* Contact endpoint tests — run: node tests/contact.test.mjs
   Mocks the Cloudflare env (KV binding, provider keys) and global fetch so the
   delivery chain can be exercised without sending anyone a real email. */
import { onRequest } from '../functions/api/contact.js';

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass });
  console.log((pass ? 'PASS  ' : 'FAIL  ') + name + (detail ? '  → ' + detail : ''));
}

const GOOD = {
  name: 'DC Alacrity', email: 'someone@example.com', topic: 'Client / commercial',
  projectType: 'VR / interactive', message: 'Prize Pool VR. Lets do it!',
};

function ctx(method, body, env, origin) {
  const req = new Request('https://dcalacrity.com/api/contact', {
    method,
    headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return { request: req, env: env || {} };
}
function kv() {
  const store = new Map();
  return { store, put: async (k, v, o) => { store.set(k, { v, o }); } };
}
function mockFetch(handler) { globalThis.fetch = handler; }

(async () => {
  /* health check */
  let r = await onRequest(ctx('GET', undefined, {}));
  let j = await r.json();
  check('GET reports config without sending anything',
    r.status === 200 && j.ok && j.deliversTo === 'support@dcalacrity.com' && j.providers.resend === false,
    'deliversTo=' + j.deliversTo + ' leadStore=' + j.leadStore);

  /* validation */
  r = await onRequest(ctx('POST', { name: 'x' }, {}));
  check('missing fields are rejected', r.status === 400, 'status ' + r.status);
  r = await onRequest(ctx('POST', { ...GOOD, email: 'not-an-email' }, {}));
  check('bad email is rejected', r.status === 400);

  /* honeypot: looks successful, stores nothing */
  const hkv = kv();
  r = await onRequest(ctx('POST', { ...GOOD, website: 'http://spam' }, { LEADS: hkv }));
  j = await r.json();
  check('honeypot answers like success but stores nothing', j.ok === true && hkv.store.size === 0);

  /* persist-first: no provider configured at all */
  mockFetch(async () => new Response('nope', { status: 500 }));
  const k1 = kv();
  r = await onRequest(ctx('POST', GOOD, { LEADS: k1 }));
  j = await r.json();
  check('mail down but lead CAPTURED → visitor still told success',
    j.ok === true && j.stored === true && j.emailed === false && k1.store.size === 1,
    'ref ' + j.ref);
  const saved = JSON.parse([...k1.store.values()][0].v);
  check('stored lead keeps every field', saved.message === GOOD.message && saved.email === GOOD.email && !!saved.receivedAt);

  /* Resend path */
  let hit = null;
  mockFetch(async (url, opts) => {
    hit = { url: String(url), auth: opts.headers.Authorization, body: JSON.parse(opts.body) };
    return new Response('{"id":"x"}', { status: 200 });
  });
  const k2 = kv();
  r = await onRequest(ctx('POST', GOOD, { LEADS: k2, RESEND_API_KEY: 're_test', MAIL_TO: 'support@dcalacrity.com' }));
  j = await r.json();
  check('Resend is used when a key is bound',
    j.ok && j.emailed === true && /api\.resend\.com/.test(hit.url) && hit.auth === 'Bearer re_test');
  check('Resend addresses pure@ and sets reply-to to the enquirer',
    hit.body.to[0] === 'support@dcalacrity.com' && hit.body.reply_to === GOOD.email,
    hit.body.to[0] + ' reply→' + hit.body.reply_to);

  /* Resend fails → FormSubmit fallback */
  const seen = [];
  mockFetch(async (url) => {
    seen.push(String(url));
    if (/resend/.test(String(url))) return new Response('bad key', { status: 401 });
    return new Response('{"message":"sent"}', { status: 200 });
  });
  r = await onRequest(ctx('POST', GOOD, { LEADS: kv(), RESEND_API_KEY: 'bad' }));
  j = await r.json();
  check('falls back to FormSubmit when Resend fails',
    j.ok && j.emailed === true && seen.length === 2 && /formsubmit\.co/.test(seen[1]),
    seen.map(u => u.replace(/https:\/\//, '')).join(' → '));
  check('FormSubmit is addressed to support@dcalacrity.com',
    decodeURIComponent(seen[1]).includes('support@dcalacrity.com'));

  /* everything fails and nothing to store → honest 502 */
  mockFetch(async () => new Response('down', { status: 500 }));
  r = await onRequest(ctx('POST', GOOD, {}));
  j = await r.json();
  check('total failure with no store → honest error naming support@',
    r.status === 502 && j.ok === false && /support@dcalacrity\.com/.test(j.error), j.error);

  /* CORS */
  r = await onRequest(ctx('POST', GOOD, {}, 'https://dcalacrity.com'));
  check('CORS echoes an allowed origin',
    r.headers.get('Access-Control-Allow-Origin') === 'https://dcalacrity.com');
  r = await onRequest(ctx('POST', GOOD, {}, 'https://evil.example'));
  check('CORS refuses an unknown origin',
    r.headers.get('Access-Control-Allow-Origin') === 'https://dcalacrity.com');
  r = await onRequest(ctx('POST', GOOD, {}, 'not a url'));
  check('malformed Origin does not crash the endpoint', r.status === 200 || r.status === 502);

  const failed = results.filter(x => !x.pass);
  console.log('\n' + (results.length - failed.length) + '/' + results.length + ' checks passed');
  process.exit(failed.length ? 1 : 0);
})();
