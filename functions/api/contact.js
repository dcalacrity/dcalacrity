/**
 * POST /api/contact — D.C Alacrity marketing site contact form.
 * Forwards validated submissions to dcalacrity@gmail.com via FormSubmit.
 * First live send may require a one-time confirmation email to that inbox.
 */

const TO = 'dcalacrity@gmail.com';
const ALLOWED_ORIGINS = new Set([
  'https://dcalacrity.com',
  'https://www.dcalacrity.com',
  'https://dcalacrity.pages.dev',
]);

function corsHeaders(origin) {
  const allow = origin && (ALLOWED_ORIGINS.has(origin) || /\.pages\.dev$/.test(new URL(origin).hostname))
    ? origin
    : 'https://dcalacrity.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });
}

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin') || '';
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400, origin);
  }

  // Honeypot
  if (clean(body.website, 200)) {
    return json({ ok: true }, 200, origin);
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const organization = clean(body.organization, 160);
  const topic = clean(body.topic, 120);
  const projectType = clean(body.projectType, 120);
  const budget = clean(body.budget, 80);
  const timeline = clean(body.timeline, 80);
  const source = clean(body.source, 80);
  const message = clean(body.message, 5000);

  if (!name || !email || !topic || !message) {
    return json({ ok: false, error: 'Name, email, topic, and message are required.' }, 400, origin);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400, origin);
  }

  const payload = {
    name,
    email,
    phone: phone || '—',
    organization: organization || '—',
    topic,
    projectType: projectType || '—',
    budget: budget || '—',
    timeline: timeline || '—',
    source: source || '—',
    message,
    _replyto: email,
    _subject: `[dcalacrity.com] ${topic} — ${name}`,
    _template: 'table',
    _captcha: 'false',
  };

  try {
    const upstream = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TO)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch { /* plain text */ }

    if (!upstream.ok) {
      const detail = (parsed && (parsed.message || parsed.error)) || text || 'Upstream mail error';
      return json({ ok: false, error: detail }, 502, origin);
    }

    return json({
      ok: true,
      message: (parsed && parsed.message) || 'Message sent. We will get back to you soon.',
    }, 200, origin);
  } catch (err) {
    return json({ ok: false, error: 'Could not reach the mail service. Try emailing dcalacrity@gmail.com directly.' }, 502, origin);
  }
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return onRequestOptions(context);
  if (context.request.method === 'POST') return onRequestPost(context);
  const origin = context.request.headers.get('Origin') || '';
  return json({ ok: false, error: 'Method not allowed' }, 405, origin);
}
