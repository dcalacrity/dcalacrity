/**
 * POST /api/contact — D.C Alacrity contact form.
 * GET  /api/contact — health check: reports which delivery paths are configured,
 *                     so the form can be verified without sending a real lead.
 *
 * Delivery is deliberately layered, because losing a business inquiry is worse
 * than any other failure here:
 *
 *   1. PERSIST FIRST. Every valid submission is written to the LEADS KV store
 *      before a single email is attempted. If mail is down, misconfigured, or
 *      the provider silently rejects us, the lead still exists and can be read
 *      back. Previously a failed send left nothing but a mailto: draft the
 *      visitor had to finish themselves — which is how leads disappear.
 *   2. Resend, when RESEND_API_KEY is bound. A real transactional provider with
 *      a delivery log we can point at.
 *   3. FormSubmit, as a no-key fallback. NOTE: FormSubmit requires a one-time
 *      confirmation click in the destination inbox before it will EVER send.
 *      An unconfirmed address is the usual reason this form "just stops".
 *
 * The response tells the truth about what actually happened (stored vs emailed)
 * instead of reporting success because one leg of the chain returned 200.
 */

const TO = 'pure@dcalacrity.com';
const ALLOWED_ORIGINS = new Set([
  'https://dcalacrity.com',
  'https://www.dcalacrity.com',
  'https://dcalacrity.pages.dev',
]);

function corsHeaders(origin) {
  let allow = 'https://dcalacrity.com';
  try {
    if (origin && (ALLOWED_ORIGINS.has(origin) || /\.pages\.dev$/.test(new URL(origin).hostname))) allow = origin;
  } catch { /* malformed Origin — keep the default */ }
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) },
  });
}

function clean(v, max) { return String(v == null ? '' : v).trim().slice(0, max); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/* ── shape the submission once, use it everywhere ────────────────────────── */
function readSubmission(body) {
  const f = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    organization: clean(body.organization, 160),
    topic: clean(body.topic, 120),
    projectType: clean(body.projectType, 120),
    budget: clean(body.budget, 80),
    timeline: clean(body.timeline, 80),
    source: clean(body.source, 80),
    message: clean(body.message, 5000),
  };
  if (!f.name || !f.email || !f.topic || !f.message) {
    return { error: 'Name, email, topic, and message are required.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return { error: 'Please enter a valid email address.' };
  }
  return { fields: f };
}

const ROWS = [
  ['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Organization', 'organization'],
  ['Topic', 'topic'], ['Project type', 'projectType'], ['Budget', 'budget'],
  ['Timeline', 'timeline'], ['Found us via', 'source'],
];

function asText(f, meta) {
  return ROWS.map(([label, k]) => `${label}: ${f[k] || '—'}`).join('\n') +
    `\n\nMessage:\n${f.message}\n\n— received ${meta.at}${meta.ref ? ` · ref ${meta.ref}` : ''}`;
}
function asHTML(f, meta) {
  const rows = ROWS.map(([label, k]) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap">${label}</td>` +
    `<td style="padding:6px 0"><b>${esc(f[k] || '—')}</b></td></tr>`).join('');
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.6">
<h2 style="margin:0 0 12px">New inquiry — ${esc(f.topic)}</h2>
<table style="border-collapse:collapse;margin-bottom:16px">${rows}</table>
<div style="white-space:pre-wrap;border-left:3px solid #17b;padding-left:12px">${esc(f.message)}</div>
<p style="color:#888;font-size:12px;margin-top:18px">Received ${esc(meta.at)}${meta.ref ? ` · ref ${esc(meta.ref)}` : ''}. Reply directly to reach ${esc(f.email)}.</p>
</div>`;
}

/* ── 1 · persist ─────────────────────────────────────────────────────────── */
async function persist(env, fields, meta) {
  if (!env || !env.LEADS || typeof env.LEADS.put !== 'function') {
    return { stored: false, reason: 'no-kv-binding' };
  }
  try {
    await env.LEADS.put(`lead:${meta.ref}`, JSON.stringify({ ...fields, receivedAt: meta.at, ref: meta.ref }), {
      metadata: { topic: fields.topic, email: fields.email, at: meta.at },
    });
    return { stored: true };
  } catch (e) {
    return { stored: false, reason: String((e && e.message) || e).slice(0, 120) };
  }
}

/* ── 2 · Resend ──────────────────────────────────────────────────────────── */
async function sendResend(env, fields, meta) {
  if (!env || !env.RESEND_API_KEY) return { sent: false, skipped: 'no-key' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'D.C Alacrity <onboarding@resend.dev>',
        to: [env.MAIL_TO || TO],
        reply_to: fields.email,
        subject: `[dcalacrity.com] ${fields.topic} — ${fields.name}`,
        html: asHTML(fields, meta),
        text: asText(fields, meta),
      }),
    });
    if (res.ok) return { sent: true, via: 'resend' };
    return { sent: false, via: 'resend', error: (await res.text()).slice(0, 200) };
  } catch (e) {
    return { sent: false, via: 'resend', error: String((e && e.message) || e).slice(0, 160) };
  }
}

/* ── 3 · FormSubmit (no key, but needs the inbox confirmed once) ─────────── */
async function sendFormSubmit(env, fields, meta) {
  const to = (env && env.MAIL_TO) || TO;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...fields,
        _replyto: fields.email,
        _subject: `[dcalacrity.com] ${fields.topic} — ${fields.name}`,
        _template: 'table',
        _captcha: 'false',
        received: meta.at,
        ref: meta.ref,
      }),
    });
    const text = await res.text();
    let parsed = null; try { parsed = JSON.parse(text); } catch { /* plain text */ }
    if (res.ok) return { sent: true, via: 'formsubmit', message: parsed && parsed.message };
    return { sent: false, via: 'formsubmit', error: ((parsed && (parsed.message || parsed.error)) || text || '').slice(0, 200) };
  } catch (e) {
    return { sent: false, via: 'formsubmit', error: String((e && e.message) || e).slice(0, 160) };
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

/* Health check — lets us confirm the form is wired without emailing a fake lead. */
export async function onRequestGet(context) {
  const origin = context.request.headers.get('Origin') || '';
  const env = context.env || {};
  return json({
    ok: true,
    service: 'contact',
    deliversTo: env.MAIL_TO || TO,
    providers: {
      resend: !!env.RESEND_API_KEY,
      formsubmit: true,
    },
    leadStore: !!(env.LEADS && typeof env.LEADS.put === 'function'),
    note: 'POST a submission here. FormSubmit will not deliver until the destination inbox has confirmed it once.',
  }, 200, origin);
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin') || '';
  const env = context.env || {};

  let body;
  try { body = await context.request.json(); }
  catch { return json({ ok: false, error: 'Invalid JSON body.' }, 400, origin); }

  // Honeypot: bots fill hidden fields. Answer exactly like a success so they
  // learn nothing, but do not store or forward.
  if (clean(body.website, 200)) return json({ ok: true, message: 'Message sent.' }, 200, origin);

  const parsed = readSubmission(body);
  if (parsed.error) return json({ ok: false, error: parsed.error }, 400, origin);
  const fields = parsed.fields;

  const meta = {
    at: new Date().toISOString(),
    ref: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase(),
  };

  // Capture before delivery — this is what makes a lead un-losable.
  const stored = await persist(env, fields, meta);

  let mail = await sendResend(env, fields, meta);
  if (!mail.sent) {
    const fs = await sendFormSubmit(env, fields, meta);
    mail = fs.sent ? fs : { sent: false, tried: [mail, fs] };
  }

  if (mail.sent) {
    return json({
      ok: true, stored: !!stored.stored, emailed: true, ref: meta.ref,
      message: 'Message sent. We reply within two business days on commercial estimates.',
    }, 200, origin);
  }

  // Mail failed. If it was captured, this is still a success for the visitor —
  // say so plainly rather than sending them away to write their own email.
  if (stored.stored) {
    return json({
      ok: true, stored: true, emailed: false, ref: meta.ref,
      message: `Message received (ref ${meta.ref}). Our mail relay is being stubborn, so we have logged your inquiry and will follow up — no need to resend.`,
    }, 200, origin);
  }

  return json({
    ok: false, stored: false, emailed: false,
    error: `Could not deliver right now. Please email ${env.MAIL_TO || TO} directly.`,
  }, 502, origin);
}

export async function onRequest(context) {
  const m = context.request.method;
  if (m === 'OPTIONS') return onRequestOptions(context);
  if (m === 'POST') return onRequestPost(context);
  if (m === 'GET') return onRequestGet(context);
  return json({ ok: false, error: 'Method not allowed' }, 405, context.request.headers.get('Origin') || '');
}
