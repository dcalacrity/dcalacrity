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
 *   2. Google Apps Script, when APPS_SCRIPT_URL / APPS_SCRIPT_SECRET are bound.
 *      dcalacrity.com runs on Google Workspace, so the simplest real sender is
 *      a tiny script deployed AS support@ (tools/apps-script/Code.gs): it
 *      sends through Workspace Gmail, from support@ to support@. No Google
 *      Cloud project, no OAuth client, no refresh token. The script only ever
 *      mails the address set inside it, so a leaked secret cannot spam anyone.
 *   3. Resend, when RESEND_API_KEY is bound. A real transactional provider with
 *      a delivery log we can point at.
 *   4. Gmail API, when GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN
 *      are bound. dcalacrity.com's mail is Google Workspace (MX smtp.google.com),
 *      so this sends from support@ itself, through Google, with no third party.
 *   5. FormSubmit, as a no-key fallback. NOTE: FormSubmit requires a one-time
 *      confirmation click in the destination inbox before it will EVER send.
 *
 *   + NOTIFY_WEBHOOK (optional): a Google Chat / Slack / Discord incoming
 *     webhook pinged on every lead, whether or not mail went out.
 *
 * ⚠ THE BUG THIS FILE HAD (found 2026-10-02): FormSubmit answers HTTP 200 with
 *   {"success":"false"} when it refuses a message, and this code treated any
 *   200 as delivered. Called from a server with no Origin/Referer, FormSubmit
 *   refuses EVERY message ("Make sure you open this page through a web
 *   server"). So the site told every visitor "Message sent", nothing was sent,
 *   and with no LEADS binding nothing was kept either. A provider now counts
 *   as delivered only when its own answer says so.
 *
 * The response tells the truth about what actually happened (stored vs emailed)
 * instead of reporting success because one leg of the chain returned 200.
 */

const TO = 'support@dcalacrity.com';
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

/* ── 2 · Google Apps Script (Workspace: a web app deployed as support@) ─── */
function appsScriptConfigured(env) { return !!(env && env.APPS_SCRIPT_URL && env.APPS_SCRIPT_SECRET && /^https:\/\/script\.google\.com\//.test(env.APPS_SCRIPT_URL)); }
async function sendAppsScript(env, fields, meta) {
  if (!appsScriptConfigured(env)) return { sent: false, skipped: 'no-apps-script' };
  try {
    /* Apps Script answers a POST with a 302 to script.googleusercontent.com; fetch follows it */
    const res = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret: env.APPS_SCRIPT_SECRET,
        replyTo: fields.email,
        subject: `[dcalacrity.com] ${fields.topic} — ${fields.name}`,
        html: asHTML(fields, meta),
        text: asText(fields, meta),
        ref: meta.ref,
      }),
    });
    const text = await res.text();
    let j = null; try { j = JSON.parse(text); } catch { /* an HTML page means the deployment is not public */ }
    if (res.ok && j && j.ok === true) return { sent: true, via: 'apps-script' };
    const why = j ? (j.error || 'refused') : (/accounts\.google\.com|Sign in/i.test(text) ? 'the web app asks for a Google sign-in: redeploy it with "Who has access: Anyone"' : 'HTTP ' + res.status);
    return { sent: false, via: 'apps-script', error: String(why).slice(0, 200) };
  } catch (e) {
    return { sent: false, via: 'apps-script', error: String((e && e.message) || e).slice(0, 160) };
  }
}

/* ── 3 · Resend ──────────────────────────────────────────────────────────── */
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

/* ── 4 · Gmail API (Google Workspace: send as support@ through Google) ──── */
function b64url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function mimeWord(s) { return /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(s)))}?=`; }
function headerSafe(s) { return String(s || '').replace(/[\r\n]+/g, ' ').slice(0, 300); }

export function buildMime(env, fields, meta) {
  const to = (env && env.MAIL_TO) || TO;
  const from = (env && env.GMAIL_SENDER) || to;
  const boundary = 'dca-' + meta.ref;
  const subject = headerSafe(`[dcalacrity.com] ${fields.topic} — ${fields.name}`);
  return [
    `From: ${mimeWord('D.C Alacrity website')} <${headerSafe(from)}>`,
    `To: ${headerSafe(to)}`,
    `Reply-To: ${mimeWord(headerSafe(fields.name))} <${headerSafe(fields.email)}>`,
    `Subject: ${mimeWord(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    asText(fields, meta),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    asHTML(fields, meta),
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

function gmailConfigured(env) { return !!(env && env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN); }

async function gmailToken(env) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
    }).toString(),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.access_token) throw new Error('token: ' + (j.error_description || j.error || res.status));
  return j.access_token;
}

async function sendGmail(env, fields, meta) {
  if (!gmailConfigured(env)) return { sent: false, skipped: 'no-gmail' };
  try {
    const token = await gmailToken(env);
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: b64url(buildMime(env, fields, meta)) }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.id) return { sent: true, via: 'gmail', id: j.id };
    return { sent: false, via: 'gmail', error: ((j.error && j.error.message) || res.status + '').slice(0, 200) };
  } catch (e) {
    return { sent: false, via: 'gmail', error: String((e && e.message) || e).slice(0, 200) };
  }
}

/* ── 5 · FormSubmit (no key, but needs the inbox confirmed once) ─────────── */
/* ⚠ FormSubmit answers 200 even when it refuses, with {"success":"false"} —
   only its own `success` says whether anything was sent. And it refuses any
   request without a browser Origin/Referer, which a server call has unless
   we set them. */
async function sendFormSubmit(env, fields, meta) {
  const to = (env && env.MAIL_TO) || TO;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', Accept: 'application/json',
        Origin: 'https://dcalacrity.com', Referer: 'https://dcalacrity.com/contact',
      },
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
    const ok = res.ok && parsed && (parsed.success === true || parsed.success === 'true');
    if (ok) return { sent: true, via: 'formsubmit', message: parsed.message };
    const why = ((parsed && (parsed.message || parsed.error)) || text || ('HTTP ' + res.status)).slice(0, 200);
    return { sent: false, via: 'formsubmit', error: why, needsActivation: /activat/i.test(why) };
  } catch (e) {
    return { sent: false, via: 'formsubmit', error: String((e && e.message) || e).slice(0, 160) };
  }
}

/* ── + a ping on every lead (Google Chat / Slack / Discord incoming webhook) */
async function notify(env, fields, meta, mail) {
  if (!env || !env.NOTIFY_WEBHOOK) return { pinged: false };
  const line = `New dcalacrity.com enquiry — ${fields.topic} — ${fields.name} <${fields.email}>` +
    `${fields.organization ? ' (' + fields.organization + ')' : ''} · ref ${meta.ref}` +
    ` · ${mail.sent ? 'emailed via ' + mail.via : 'NOT emailed — read it from the lead store'}\n\n${fields.message.slice(0, 900)}`;
  try {
    const res = await fetch(env.NOTIFY_WEBHOOK, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      /* text: Google Chat and Slack; content: Discord */
      body: JSON.stringify({ text: line, content: line.slice(0, 1900) }),
    });
    return { pinged: res.ok };
  } catch { return { pinged: false }; }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

/* Health check — lets us confirm the form is wired without emailing a fake lead.
   ?check=1 also PROVES the credentials (Resend key, Gmail token) without sending. */
export async function onRequestGet(context) {
  const origin = context.request.headers.get('Origin') || '';
  const env = context.env || {};
  const out = {
    ok: true,
    service: 'contact',
    deliversTo: env.MAIL_TO || TO,
    providers: {
      appsScript: appsScriptConfigured(env),
      resend: !!env.RESEND_API_KEY,
      gmail: gmailConfigured(env),
      formsubmit: true,
    },
    leadStore: !!(env.LEADS && typeof env.LEADS.put === 'function'),
    notify: !!env.NOTIFY_WEBHOOK,
    note: 'POST a submission here. FormSubmit will not deliver until the destination inbox has confirmed it once. Add ?check=1 to test the Apps Script / Resend / Gmail credentials without sending.',
  };
  let check = false; try { check = new URL(context.request.url).searchParams.get('check') === '1'; } catch { /* ignore */ }
  if (check) {
    out.checks = {};
    if (appsScriptConfigured(env)) {
      try {
        const u = new URL(env.APPS_SCRIPT_URL); u.searchParams.set('check', '1'); u.searchParams.set('secret', env.APPS_SCRIPT_SECRET);
        const r = await fetch(u.toString(), { redirect: 'follow' }); const j = await r.json().catch(() => null);
        out.checks.appsScript = j && j.ok ? 'script answers, sending as ' + j.from + ' to ' + j.to : (j ? 'script refused: ' + (j.error || 'wrong secret') : 'not reachable as a public web app (' + r.status + ')');
      } catch (e) { out.checks.appsScript = 'unreachable: ' + String(e && e.message || e).slice(0, 80); }
    }
    if (env.RESEND_API_KEY) {
      try { const r = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` } }); out.checks.resend = r.ok ? 'key accepted' : 'key refused (' + r.status + ')'; }
      catch (e) { out.checks.resend = 'unreachable: ' + String(e && e.message || e).slice(0, 80); }
    }
    if (gmailConfigured(env)) {
      try {
        const t = await gmailToken(env);
        const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', { headers: { Authorization: `Bearer ${t}` } });
        const j = await r.json().catch(() => ({}));
        out.checks.gmail = r.ok ? 'token ok, sending as ' + j.emailAddress : 'token ok but profile refused (' + r.status + ') — the gmail.send scope alone cannot read the profile; that is fine';
      } catch (e) { out.checks.gmail = 'refused: ' + String(e && e.message || e).slice(0, 120); }
    }
  }
  return json(out, 200, origin);
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

  const tried = [];
  let mail = { sent: false };
  for (const send of [sendAppsScript, sendResend, sendGmail, sendFormSubmit]) {
    const r = await send(env, fields, meta);
    if (r.sent) { mail = r; break; }
    if (!r.skipped) tried.push(r);
  }
  if (!mail.sent) {
    mail = { sent: false, tried };
    /* the reason goes to the Pages function log, where the owner can read it */
    try { console.error('[contact] not emailed', meta.ref, JSON.stringify(tried)); } catch { /* ignore */ }
  }
  const pinged = (await notify(env, fields, meta, mail)).pinged;

  if (mail.sent) {
    return json({
      ok: true, stored: !!stored.stored, emailed: true, via: mail.via, ref: meta.ref,
      message: 'Message sent. We reply within two business days on commercial estimates.',
    }, 200, origin);
  }

  // Mail failed. If it was captured, this is still a success for the visitor —
  // say so plainly rather than sending them away to write their own email.
  if (stored.stored || pinged) {
    return json({
      ok: true, stored: !!stored.stored, notified: !!pinged, emailed: false, ref: meta.ref,
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
