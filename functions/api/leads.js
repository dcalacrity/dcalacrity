/**
 * GET /api/leads — read back the enquiries the contact form stored.
 *
 * Every valid submission is written to the LEADS KV store BEFORE any email is
 * attempted (see contact.js). This is how you read them when mail is down or
 * a message went to spam: nothing the site captured is ever only in an inbox.
 *
 *   curl -H "Authorization: Bearer $LEADS_TOKEN" https://dcalacrity.com/api/leads
 *   curl -H "Authorization: Bearer $LEADS_TOKEN" "https://dcalacrity.com/api/leads?ref=ABC123"
 *
 * Locked: without a LEADS_TOKEN secret bound to the Pages project this answers
 * 404 to everyone, and a wrong token gets the same 404 — the endpoint does not
 * admit it exists.
 */

function json(data, status) {
  return new Response(JSON.stringify(data, null, 1), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

/* constant-time compare, so the token cannot be guessed a byte at a time */
function same(a, b) {
  a = String(a || ''); b = String(b || '');
  let d = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) d |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return d === 0;
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!env.LEADS_TOKEN || String(env.LEADS_TOKEN).length < 16 || !same(token, env.LEADS_TOKEN)) return json({ ok: false, error: 'Not found' }, 404);
  if (!env.LEADS || typeof env.LEADS.list !== 'function') return json({ ok: false, error: 'No LEADS KV namespace is bound to this Pages project.' }, 503);

  const url = new URL(context.request.url);
  const ref = (url.searchParams.get('ref') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (ref) {
    const v = await env.LEADS.get('lead:' + ref);
    return v ? json({ ok: true, lead: JSON.parse(v) }, 200) : json({ ok: false, error: 'No lead ' + ref }, 404);
  }
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit'), 10) || 50));
  const out = [];
  let cursor;
  do {
    const page = await env.LEADS.list({ prefix: 'lead:', cursor, limit: 1000 });
    for (const k of page.keys) out.push({ ref: k.name.slice(5), ...(k.metadata || {}) });
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor && out.length < 5000);
  out.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
  return json({ ok: true, total: out.length, leads: out.slice(0, limit), read: 'add ?ref=<ref> for the full message' }, 200);
}

export async function onRequest(context) {
  if (context.request.method === 'GET') return onRequestGet(context);
  return json({ ok: false, error: 'Not found' }, 404);
}
