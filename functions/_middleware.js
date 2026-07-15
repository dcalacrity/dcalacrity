/**
 * Cloudflare Pages middleware — D.C Alacrity marketing site
 *
 * Canonical host is dcalacrity.com.
 * www → apex: requires a DNS record for www (see README). Once www hits this
 * Pages project, this middleware (and public/_redirects) 301 to apex.
 * Do not handle /pure — that path belongs to the purealacrity Worker.
 */

const CANONICAL_HOST = 'dcalacrity.com';

function securityHeaders() {
  return {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
}

function withHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(securityHeaders())) {
    headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();

  if (host === 'www.dcalacrity.com') {
    return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
  }

  const response = await context.next();
  return withHeaders(response);
}
