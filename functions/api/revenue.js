/**
 * POST /api/revenue — inbound deal sync for Pure Alacrity's Revenue Bridge.
 * GET  /api/revenue — health check (never reveals the secret).
 *
 * Why this exists: a sales rep should work in a sales tool. Rather than guess at
 * any particular vendor's endpoints — most are undocumented and all of them
 * change — we define OUR side of the contract and let anything push to it: a
 * CRM's own API, Zapier, Make, or a five-line script.
 *
 * Same rule as the contact form: PERSIST BEFORE ANYTHING ELSE. A deal that
 * reached us must never be lost because a downstream step failed.
 */

const ALLOWED_STAGES = ['Discovery', 'Qualified', 'Pitch', 'Bid', 'Contract', 'Won', 'Lost'];

/* Mirrors AH.RevBridge.normStage so both sides agree on what a stage means. */
const STAGE_RULES = [
  [/closed[\s\-_]*won|won|signed|booked/i, 'Won'],
  [/closed[\s\-_]*lost|lost|dead|disqualif|churn|no[\s\-]*decision/i, 'Lost'],
  [/contract|negotiat|legal|redline|verbal|po\b|purchase order/i, 'Contract'],
  [/bid|quote|estimate|proposal sent|sow/i, 'Bid'],
  [/pitch|demo|present|deck|meeting held/i, 'Pitch'],
  [/qualif|mql|sql|discovery call|scoping/i, 'Qualified'],
  [/discover|new|lead|prospect|inbound|open|top of funnel/i, 'Discovery']
];
function normStage(v) {
  const s = String(v == null ? '' : v).trim();
  if (!s) return 'Discovery';
  const exact = ALLOWED_STAGES.find(x => x.toLowerCase() === s.toLowerCase());
  if (exact) return exact;
  for (const [re, out] of STAGE_RULES) if (re.test(s)) return out;
  return 'Discovery';
}

function clean(v, max) { return String(v == null ? '' : v).trim().slice(0, max); }
function money(v) {
  const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}
function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

/* Constant-time-ish comparison so a wrong secret cannot be probed byte by byte. */
function secretMatches(given, expected) {
  const a = String(given || ''), b = String(expected || '');
  if (!b) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestGet(context) {
  const env = context.env || {};
  return json({
    ok: true, service: 'revenue',
    configured: !!env.REVENUE_SECRET,
    leadStore: !!(env.LEADS && typeof env.LEADS.put === 'function'),
    stages: ALLOWED_STAGES,
    expects: 'POST { secret, source, deals: [{ extId, org, title, stage, value, probability, closeDate, owner, contact, email, phone, source, note }] }',
    note: 'stage accepts any vendor wording — "Closed Won", "won" and "Signed" all normalise to Won.'
  }, 200);
}

export async function onRequestPost(context) {
  const env = context.env || {};

  if (!env.REVENUE_SECRET) {
    return json({ ok: false, error: 'Endpoint is not configured. Set REVENUE_SECRET in the Pages project.' }, 503);
  }

  let body;
  try { body = await context.request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON body.' }, 400); }

  /* Accept the secret in a header or the body — some senders can only do one. */
  const given = context.request.headers.get('X-Alacrity-Secret') || body.secret;
  if (!secretMatches(given, env.REVENUE_SECRET)) {
    return json({ ok: false, error: 'Unauthorised.' }, 401);
  }

  const raw = Array.isArray(body.deals) ? body.deals
    : (Array.isArray(body.records) ? body.records : (body.deal ? [body.deal] : null));
  if (!raw || !raw.length) return json({ ok: false, error: 'No deals in payload.' }, 400);
  if (raw.length > 500) return json({ ok: false, error: 'Too many deals in one request (max 500).' }, 413);

  const source = clean(body.source, 40) || 'api';
  const at = new Date().toISOString();
  const batch = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

  const deals = [];
  const rejected = [];
  raw.forEach((d, i) => {
    const org = clean(d.org || d.company || d.account, 160);
    const title = clean(d.title || d.name || d.opportunity, 200) || (org ? `${org} — enquiry` : '');
    if (!org && !title) { rejected.push({ index: i, why: 'needs an org or a title' }); return; }
    let prob = money(d.probability);
    if (prob > 0 && prob <= 1) prob = Math.round(prob * 100);
    deals.push({
      extId: clean(d.extId || d.id, 120),
      org, title,
      stage: normStage(d.stage || d.status),
      value: money(d.value ?? d.amount),
      probability: Math.max(0, Math.min(100, Math.round(prob))),
      closeDate: clean(d.closeDate || d.close_date, 40),
      owner: clean(d.owner, 120),
      contact: clean(d.contact, 160),
      email: clean(d.email, 160),
      phone: clean(d.phone, 40),
      source: clean(d.source, 60) || source,
      note: clean(d.note || d.description, 2000)
    });
  });

  if (!deals.length) return json({ ok: false, error: 'No usable deals.', rejected }, 400);

  /* Persist first — the app pulls from here, so a deal is safe the moment it
     lands even if nobody opens Pure Alacrity for a week. */
  let stored = false, storeError = null;
  if (env.LEADS && typeof env.LEADS.put === 'function') {
    try {
      await env.LEADS.put(`deals:${batch}`, JSON.stringify({ batch, at, source, deals }),
        { metadata: { source, at, count: deals.length } });
      stored = true;
    } catch (e) { storeError = String((e && e.message) || e).slice(0, 140); }
  }

  const won = deals.filter(d => d.stage === 'Won');

  /* A won deal is a job that has to be scheduled — worth a nudge, not silence. */
  if (won.length && env.DEAL_WEBHOOK) {
    try {
      await fetch(env.DEAL_WEBHOOK, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Deal won via ${source}: ` + won.map(w =>
            `${w.org || w.title}${w.value ? ' ($' + w.value.toLocaleString() + ')' : ''}`).join(', ') +
            ' — open Revenue Bridge to turn it into a production.'
        })
      });
    } catch (_) { /* notification is a courtesy, never a failure */ }
  }

  return json({
    ok: true, batch, stored, storeError,
    accepted: deals.length,
    won: won.length,
    rejected: rejected.length ? rejected : undefined,
    note: stored
      ? 'Stored. Import it in Pure Alacrity → Revenue Bridge.'
      : 'Accepted but NOT stored — bind a LEADS KV namespace so nothing can be lost.'
  }, 200);
}

export async function onRequest(context) {
  const m = context.request.method;
  if (m === 'POST') return onRequestPost(context);
  if (m === 'GET') return onRequestGet(context);
  return json({ ok: false, error: 'Method not allowed' }, 405);
}
