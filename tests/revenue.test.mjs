/* Revenue endpoint tests — node tests/revenue.test.mjs
   Mocks the Cloudflare env (KV, secret, webhook) and global fetch. */
import { onRequest } from '../functions/api/revenue.js';

const results = [];
function check(name, pass, detail) {
  results.push(pass);
  console.log((pass ? 'PASS  ' : 'FAIL  ') + name + (detail ? '  → ' + detail : ''));
}
const SECRET = 'shh-super-secret';
function ctx(method, body, env, headers) {
  return {
    request: new Request('https://dcalacrity.com/api/revenue', {
      method,
      headers: { 'Content-Type': 'application/json', ...(headers || {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    }),
    env: env || {}
  };
}
function kv() { const store = new Map(); return { store, put: async (k, v, o) => { store.set(k, { v, o }); } }; }

const DEAL = {
  extId: 'CRM-1042', org: 'Acme Studios', title: 'Brand film — Q4',
  stage: 'Closed Won', value: '$48,000', probability: 100, closeDate: '2026-09-15',
  owner: 'Rep', contact: 'Jane Buyer', email: 'jane@acme.com', phone: '+1 910 555 0142',
  note: 'Two shoot days'
};

(async () => {
  globalThis.fetch = async () => new Response('{}', { status: 200 });

  /* health */
  let r = await onRequest(ctx('GET', undefined, { REVENUE_SECRET: SECRET }));
  let j = await r.json();
  check('GET reports configured without leaking the secret',
    r.status === 200 && j.configured === true && !JSON.stringify(j).includes(SECRET),
    'stages ' + j.stages.length);

  /* refuses when unconfigured */
  r = await onRequest(ctx('POST', { deals: [DEAL] }, {}));
  check('refuses to accept anything when REVENUE_SECRET is unset', r.status === 503);

  /* auth */
  r = await onRequest(ctx('POST', { deals: [DEAL] }, { REVENUE_SECRET: SECRET }));
  check('rejects a missing secret', r.status === 401);
  r = await onRequest(ctx('POST', { secret: 'wrong', deals: [DEAL] }, { REVENUE_SECRET: SECRET }));
  check('rejects a wrong secret', r.status === 401);
  r = await onRequest(ctx('POST', { deals: [DEAL] }, { REVENUE_SECRET: SECRET }, { 'X-Alacrity-Secret': SECRET }));
  check('accepts the secret via header (some senders cannot set a body field)', r.status === 200);

  /* happy path + normalisation */
  const k = kv();
  r = await onRequest(ctx('POST', { secret: SECRET, source: 'crm', deals: [DEAL] },
    { REVENUE_SECRET: SECRET, LEADS: k }));
  j = await r.json();
  check('accepts a deal, stores it, counts the win',
    j.ok && j.accepted === 1 && j.won === 1 && j.stored === true, 'batch ' + j.batch);
  const saved = JSON.parse([...k.store.values()][0].v).deals[0];
  check('"$48,000" normalised to a number', saved.value === 48000, String(saved.value));
  check('"Closed Won" normalised to Won', saved.stage === 'Won', saved.stage);
  check('extId preserved so re-sends update instead of duplicating', saved.extId === 'CRM-1042');

  /* vendor stage vocabularies */
  const stages = ['Negotiation', 'Proposal Sent', 'Demo', 'MQL', 'New Lead', 'closed-lost', 'Signed'];
  r = await onRequest(ctx('POST', { secret: SECRET, deals: stages.map((s, i) => ({ org: 'Co' + i, stage: s })) },
    { REVENUE_SECRET: SECRET, LEADS: kv() }));
  j = await r.json();
  check('7 vendor stage names all accepted', j.ok && j.accepted === 7, 'won=' + j.won);

  /* probability given as a fraction */
  const k2 = kv();
  await onRequest(ctx('POST', { secret: SECRET, deals: [{ org: 'X', probability: 0.35 }] },
    { REVENUE_SECRET: SECRET, LEADS: k2 }));
  check('probability 0.35 read as 35%', JSON.parse([...k2.store.values()][0].v).deals[0].probability === 35);

  /* garbage in */
  r = await onRequest(ctx('POST', { secret: SECRET, deals: [] }, { REVENUE_SECRET: SECRET }));
  check('empty deals array rejected', r.status === 400);
  r = await onRequest(ctx('POST', { secret: SECRET, deals: [{ note: 'no org, no title' }] }, { REVENUE_SECRET: SECRET }));
  j = await r.json();
  check('a row with no org and no title is rejected with a reason',
    r.status === 400 && j.rejected && j.rejected[0].why, j.rejected ? j.rejected[0].why : '-');
  r = await onRequest(ctx('POST', { secret: SECRET, deals: new Array(501).fill({ org: 'A' }) }, { REVENUE_SECRET: SECRET }));
  check('refuses an oversized batch (>500)', r.status === 413);

  /* honest about not storing */
  r = await onRequest(ctx('POST', { secret: SECRET, deals: [DEAL] }, { REVENUE_SECRET: SECRET }));
  j = await r.json();
  check('says plainly when there is no KV binding to store into',
    j.ok && j.stored === false && /NOT stored/.test(j.note), j.note);

  /* won-deal notification is a courtesy, never a failure */
  globalThis.fetch = async () => { throw new Error('webhook down'); };
  r = await onRequest(ctx('POST', { secret: SECRET, deals: [DEAL] },
    { REVENUE_SECRET: SECRET, LEADS: kv(), DEAL_WEBHOOK: 'https://hooks.example/x' }));
  check('a dead notification webhook does not fail the request', r.status === 200);

  r = await onRequest(ctx('DELETE', undefined, { REVENUE_SECRET: SECRET }));
  check('other methods rejected', r.status === 405);

  const bad = results.filter(x => !x).length;
  console.log('\n' + (results.length - bad) + '/' + results.length + ' checks passed');
  process.exit(bad ? 1 : 0);
})();
