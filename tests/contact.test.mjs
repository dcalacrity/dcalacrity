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

  /* Resend fails → FormSubmit fallback (FormSubmit's own `success` decides) */
  const seen = []; let fsHeaders = null;
  mockFetch(async (url, opts) => {
    seen.push(String(url));
    if (/resend/.test(String(url))) return new Response('bad key', { status: 401 });
    fsHeaders = opts.headers;
    return new Response('{"success":"true","message":"The form was submitted successfully."}', { status: 200 });
  });
  r = await onRequest(ctx('POST', GOOD, { LEADS: kv(), RESEND_API_KEY: 'bad' }));
  j = await r.json();
  check('falls back to FormSubmit when Resend fails',
    j.ok && j.emailed === true && j.via === 'formsubmit' && seen.length === 2 && /formsubmit\.co/.test(seen[1]),
    seen.map(u => u.replace(/https:\/\//, '')).join(' → '));
  check('FormSubmit is addressed to support@dcalacrity.com',
    decodeURIComponent(seen[1]).includes('support@dcalacrity.com'));
  check('FormSubmit is sent the site Origin and Referer (it refuses server calls without them)',
    fsHeaders && fsHeaders.Origin === 'https://dcalacrity.com' && /dcalacrity\.com/.test(fsHeaders.Referer));

  /* THE BUG: FormSubmit refuses with HTTP 200 + success:"false" */
  for (const refusal of [
    '{"success":"false","message":"Make sure you open this page through a web server, FormSubmit will not work in pages browsed as HTML files."}',
    '{"success":"false","message":"This form needs Activation. We\'ve sent you an email containing an \'Activate Form\' link."}',
  ]) {
    mockFetch(async () => new Response(refusal, { status: 200 }));
    r = await onRequest(ctx('POST', GOOD, {}));
    j = await r.json();
    check('a FormSubmit refusal answered with HTTP 200 is NOT reported as sent (' + (/activat/i.test(refusal) ? 'activation' : 'no origin') + ')',
      j.emailed !== true && j.ok === false && r.status === 502, JSON.stringify(j).slice(0, 90));
  }
  mockFetch(async () => new Response('{"success":"false","message":"needs Activation"}', { status: 200 }));
  const k3 = kv();
  r = await onRequest(ctx('POST', GOOD, { LEADS: k3 }));
  j = await r.json();
  check('refused by FormSubmit but CAPTURED → visitor told "received", never "sent"',
    j.ok === true && j.emailed === false && j.stored === true && /received/i.test(j.message) && !/sent/i.test(j.message.split('.')[0]));

  /* Gmail API (Google Workspace) */
  const g = [];
  mockFetch(async (url, opts) => {
    g.push(String(url));
    if (/oauth2\.googleapis\.com\/token/.test(String(url))) {
      const b = new URLSearchParams(opts.body);
      return new Response(JSON.stringify(b.get('refresh_token') === 'rt' && b.get('grant_type') === 'refresh_token' ? { access_token: 'at' } : { error: 'invalid_grant' }), { status: b.get('refresh_token') === 'rt' ? 200 : 400 });
    }
    if (/gmail\.googleapis\.com/.test(String(url))) {
      g.raw = JSON.parse(opts.body).raw; g.auth = opts.headers.Authorization;
      return new Response('{"id":"msg1"}', { status: 200 });
    }
    return new Response('{"success":"false"}', { status: 200 });
  });
  const GENV = { GMAIL_CLIENT_ID: 'cid', GMAIL_CLIENT_SECRET: 'sec', GMAIL_REFRESH_TOKEN: 'rt', GMAIL_SENDER: 'support@dcalacrity.com' };
  r = await onRequest(ctx('POST', { ...GOOD, name: 'Zoë Ñ' }, { LEADS: kv(), ...GENV }));
  j = await r.json();
  check('Gmail API sends when its credentials are bound (after Resend is absent)',
    j.ok && j.emailed === true && j.via === 'gmail' && g.auth === 'Bearer at' && !g.some(u => /formsubmit/.test(u)), g.join(' → ').replace(/https:\/\//g, ''));
  const mime = Buffer.from(g.raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  check('the Gmail message is addressed to support@, replies go to the enquirer, UTF-8 survives',
    /^To: support@dcalacrity\.com/m.test(mime) && /^Reply-To: .*<someone@example\.com>/m.test(mime) && mime.includes('Zoë Ñ') && /^Subject: =\?UTF-8\?B\?/m.test(mime));
  check('a header-injection attempt in the name cannot add headers',
    !/^Bcc:/im.test((await import('../functions/api/contact.js')).buildMime({}, { ...GOOD, name: 'x\r\nBcc: evil@example.com' }, { ref: 'R', at: 'now' }).split('\r\n\r\n')[0]));
  mockFetch(async (url, opts) => /token/.test(String(url)) ? new Response('{"error":"invalid_grant"}', { status: 400 }) : new Response('{"success":"true"}', { status: 200 }));
  r = await onRequest(ctx('POST', GOOD, { LEADS: kv(), ...GENV, GMAIL_REFRESH_TOKEN: 'revoked' }));
  j = await r.json();
  check('a revoked Gmail token falls through to the next provider', j.ok && j.via === 'formsubmit');

  /* notify webhook */
  let ping = null;
  mockFetch(async (url, opts) => { if (/hooks/.test(String(url))) { ping = JSON.parse(opts.body); return new Response('ok'); } return new Response('{"success":"false"}', { status: 200 }); });
  r = await onRequest(ctx('POST', GOOD, { NOTIFY_WEBHOOK: 'https://chat.googleapis.com/hooks/x' }));
  j = await r.json();
  check('the webhook is pinged on every lead, and a ping alone counts as captured',
    ping && /someone@example\.com/.test(ping.text) && /NOT emailed/.test(ping.text) && j.ok === true && j.notified === true);

  /* health check with ?check=1 proves credentials without sending */
  mockFetch(async (url) => /token/.test(String(url)) ? new Response('{"access_token":"at"}') : /profile/.test(String(url)) ? new Response('{"emailAddress":"support@dcalacrity.com"}') : new Response('{}', { status: 401 }));
  r = await onRequest({ request: new Request('https://dcalacrity.com/api/contact?check=1'), env: { ...GENV, RESEND_API_KEY: 'bad' } });
  j = await r.json();
  check('?check=1 proves the Gmail token and reports a refused Resend key, sending nothing',
    j.providers.gmail === true && /support@dcalacrity\.com/.test(j.checks.gmail) && /refused/.test(j.checks.resend), JSON.stringify(j.checks));

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

  /* Google Apps Script (Workspace) */
  const AS = { APPS_SCRIPT_URL: 'https://script.google.com/macros/s/ABC/exec', APPS_SCRIPT_SECRET: 's3cret-s3cret' };
  let asBody = null, asCalls = 0;
  mockFetch(async (url, init) => { if (String(url).startsWith('https://script.google.com/')) { asCalls++; asBody = JSON.parse(init.body); return new Response(JSON.stringify({ ok: true }), { status: 200 }); } return new Response('should not be reached', { status: 500 }); });
  r = await onRequest(ctx('POST', GOOD, { ...AS }));
  j = await r.json();
  check('Apps Script configured → sent through Workspace, first in the chain', j.ok && j.emailed && j.via === 'apps-script' && asCalls === 1, 'via ' + j.via);
  check('…carrying the secret, the reply-to and both bodies', asBody.secret === 's3cret-s3cret' && asBody.replyTo === GOOD.email && /Prize Pool/.test(asBody.text) && /<table/.test(asBody.html));
  mockFetch(async url => String(url).startsWith('https://script.google.com/') ? new Response('<html>Sign in - Google Accounts accounts.google.com</html>', { status: 200 }) : new Response('{"success":"false","message":"x"}', { status: 200 }));
  const kAS = kv();
  r = await onRequest(ctx('POST', GOOD, { ...AS, LEADS: kAS }));
  j = await r.json();
  check('a private (sign-in) deployment is NOT counted as sent; the lead is kept', j.ok && j.emailed === false && kAS.store.size === 1);
  mockFetch(async () => new Response(JSON.stringify({ ok: false, error: 'forbidden' }), { status: 200 }));
  r = await onRequest(ctx('POST', GOOD, { ...AS, LEADS: kv() }));
  j = await r.json();
  check('a wrong secret is NOT counted as sent', j.emailed === false);
  r = await onRequest(ctx('GET', undefined, { APPS_SCRIPT_URL: 'https://evil.example/exec', APPS_SCRIPT_SECRET: 'x' }));
  j = await r.json();
  check('only a script.google.com URL is accepted as the Apps Script sender', j.providers.appsScript === false);
  mockFetch(async url => new Response(JSON.stringify(/check=1/.test(String(url)) ? { ok: true, from: 'support@dcalacrity.com', to: 'support@dcalacrity.com' } : {}), { status: 200 }));
  r = await onRequest({ request: new Request('https://dcalacrity.com/api/contact?check=1'), env: { ...AS } });
  j = await r.json();
  check('?check=1 proves the Apps Script without sending', j.providers.appsScript === true && /sending as support@dcalacrity\.com/.test(j.checks.appsScript), j.checks.appsScript);

  /* setup problems are named, values never shown */
  r = await onRequest({ request: new Request('https://dcalacrity.com/api/contact?check=1'), env: {} });
  j = await r.json();
  check('?check=1 says the variables are not reaching the deployment', /Production/.test(j.checks.appsScriptSetup || ''), j.checks.appsScriptSetup);
  mockFetch(async () => new Response(JSON.stringify({ ok: true, from: 'support@dcalacrity.com', to: 'support@dcalacrity.com' }), { status: 200 }));
  r = await onRequest({ request: new Request('https://dcalacrity.com/api/contact?check=1'), env: { APPS_SCRIPT_URL: '  "https://script.google.com/a/macros/dcalacrity.com/s/ABC/exec"\n', APPS_SCRIPT_SECRET: ' s3cret ' } });
  j = await r.json();
  check('pasted spaces, quotes and newlines are tolerated (Workspace /a/macros/ URL)', j.providers.appsScript === true && !j.checks.appsScriptSetup, JSON.stringify(j.checks));
  r = await onRequest({ request: new Request('https://dcalacrity.com/api/contact?check=1'), env: { APPS_SCRIPT_URL: 'https://script.google.com/macros/s/ABC/dev', APPS_SCRIPT_SECRET: 'x' } });
  j = await r.json();
  check('a /dev URL is named as the problem', /\/exec/.test(j.checks.appsScriptSetup || ''));

  /* the lead reader is locked */
  const { onRequest: leads } = await import('../functions/api/leads.js');
  const store = new Map([['lead:AAA1', JSON.stringify({ name: 'A', message: 'hi' })]]);
  const LEADS = { get: async k => store.get(k) || null, list: async () => ({ keys: [{ name: 'lead:AAA1', metadata: { topic: 'T', at: '2026-10-02' } }], list_complete: true }) };
  const req = (tok, q) => ({ request: new Request('https://dcalacrity.com/api/leads' + (q || ''), { headers: tok ? { Authorization: 'Bearer ' + tok } : {} }), env: { LEADS, LEADS_TOKEN: 'a-long-secret-token-123' } });
  r = await leads(req()); check('lead reader: no token → 404', r.status === 404);
  r = await leads(req('wrong-token-wrong-token')); check('lead reader: wrong token → 404', r.status === 404);
  r = await leads({ request: new Request('https://x/api/leads', { headers: { Authorization: 'Bearer ' } }), env: { LEADS } }); check('lead reader: no LEADS_TOKEN bound → 404 for everyone', r.status === 404);
  r = await leads(req('a-long-secret-token-123')); j = await r.json(); check('lead reader: right token lists leads', j.ok && j.total === 1 && j.leads[0].ref === 'AAA1');
  r = await leads(req('a-long-secret-token-123', '?ref=aaa1')); j = await r.json(); check('lead reader: ?ref returns the full message', j.ok && j.lead.message === 'hi');

  const failed = results.filter(x => !x.pass);
  console.log('\n' + (results.length - failed.length) + '/' + results.length + ' checks passed');
  process.exit(failed.length ? 1 : 0);
})();
