/**
 * D.C Alacrity — official site Worker (www.dcalacrity.com)
 *
 * Serves the static marketing site from ./public via the ASSETS binding.
 * Pure Alacrity at /pure is a SEPARATE Worker (purealacrity) — this script
 * never steals those routes when Cloudflare path matching is configured
 * correctly. If a /pure request somehow lands here, we bounce to the
 * Pure canonical URL.
 */

const CONFIG = {
  CANONICAL_HOST: 'www.dcalacrity.com',
  // Hosts that 301 to https://www.dcalacrity.com + path
  REDIRECT_HOSTS: new Set([
    'dcalacrity.com',
  ]),
  PURE_CANONICAL: 'https://dcalacrity.com/pure',
  RATE_LIMIT: {
    WINDOW_MS: 60_000,
    MAX_REQUESTS: 180,
    SCANNER_MAX: 20,
  },
};

CONFIG.CANONICAL_ORIGIN = 'https://' + CONFIG.CANONICAL_HOST;

const BLOCKED_PATH_PREFIXES = [
  '/.git', '/.env', '/.htaccess', '/.htpasswd', '/WEB-INF', '/META-INF',
  '/.ssh', '/.aws', '/.azure', '/node_modules', '/.npmrc', '/.yarnrc',
  '/vendor', '/config/', '/.svn', '/.hg', '/.wrangler',
];

const BLOCKED_PATH_EXACT = new Set([
  '/.env', '/.env.local', '/.env.production', '/.dev.vars',
  '/package.json', '/package-lock.json', '/wrangler.toml', '/worker.js',
  '/.DS_Store', '/Thumbs.db', '/README.md', '/LICENSE',
  '/server-status', '/server-info', '/phpinfo.php', '/.git/config',
]);

const BLOCKED_PATH_CONTAINS = [
  '../', '..%2f', '..%5c', '%00', '<script',
  'select%20', 'union%20select', 'eval(', 'base64_decode',
];

const BLOCKED_UA_PATTERNS = [
  /zgrab/i, /masscan/i, /nmap/i, /nikto/i, /sqlmap/i, /acunetix/i,
  /dirbuster/i, /gobuster/i, /ffuf/i, /wfuzz/i, /burpsuite/i,
];

const BLOCKED_QUERY_PATTERNS = [
  /allow_url_include/i, /auto_prepend_file/i, /\bexec\s*\(/i,
  /\bsystem\s*\(/i, /\beval\s*\(/i, /\.\.\/\.\.\//,
  /\bunion\b.*\bselect\b/i, /<script/i, /javascript:/i,
];

function getSecurityHeaders(isHtml = false) {
  const headers = {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'same-site',
    'Server': 'Cloudflare',
  };

  if (isHtml) {
    // Marketing site: self + Google Fonts. Pure Alacrity app has its own CSP.
    const csp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "form-action 'self' mailto:",
      "upgrade-insecure-requests",
    ].join('; ');

    headers['Content-Security-Policy'] = csp;
    headers['Cache-Control'] = 'public, max-age=300, must-revalidate';
  } else {
    headers['Cache-Control'] = 'public, max-age=604800, immutable';
  }

  return headers;
}

const rateLimitStore = new Map();

function checkRateLimit(request, isScanner = false) {
  const key = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const max = isScanner ? CONFIG.RATE_LIMIT.SCANNER_MAX : CONFIG.RATE_LIMIT.MAX_REQUESTS;
  let entry = rateLimitStore.get(key);
  if (!entry || now - entry.windowStart > CONFIG.RATE_LIMIT.WINDOW_MS) {
    entry = { windowStart: now, count: 0 };
  }
  entry.count++;
  rateLimitStore.set(key, entry);
  if (rateLimitStore.size > 1000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now - v.windowStart > CONFIG.RATE_LIMIT.WINDOW_MS * 2) rateLimitStore.delete(k);
    }
  }
  return {
    limited: entry.count > max,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.windowStart + CONFIG.RATE_LIMIT.WINDOW_MS,
    total: max,
  };
}

function safeDecode(s) {
  try { return decodeURIComponent(s); } catch (_) { return s; }
}

function isBlockedPath(pathname) {
  const lower = pathname.toLowerCase();
  if (BLOCKED_PATH_EXACT.has(lower)) return true;
  if (BLOCKED_PATH_PREFIXES.some((p) => lower.startsWith(p))) return true;
  const ext = lower.split('.').pop();
  const blockedExts = new Set([
    'php', 'asp', 'aspx', 'jsp', 'cgi', 'bak', 'sql', 'env', 'pem', 'key',
  ]);
  if (blockedExts.has(ext) && pathname !== '/') return true;
  return false;
}

function isScannerRequest(request, url) {
  const ua = request.headers.get('User-Agent') || '';
  const path = url.pathname.toLowerCase();
  const query = url.search.toLowerCase();
  if (BLOCKED_UA_PATTERNS.some((p) => p.test(ua))) return true;
  if (!ua && path !== '/') return true;
  if (query && BLOCKED_QUERY_PATTERNS.some((p) => p.test(safeDecode(query)))) return true;
  const raw = url.pathname + url.search;
  if (BLOCKED_PATH_CONTAINS.some((s) => raw.toLowerCase().includes(s))) return true;
  return false;
}

function isHttps(request) {
  const visitor = request.headers.get('CF-Visitor');
  if (visitor) {
    try {
      const parsed = JSON.parse(visitor);
      if (parsed.scheme === 'https') return true;
      if (parsed.scheme === 'http') return false;
    } catch (_) { /* fall through */ }
  }
  return urlProtocol(request) === 'https:';
}

function urlProtocol(request) {
  try { return new URL(request.url).protocol; } catch (_) { return 'https:'; }
}

function redirectTo(location, status = 301) {
  return new Response(null, {
    status,
    headers: { Location: location, ...getSecurityHeaders(false) },
  });
}

function notFound() {
  return new Response('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain', ...getSecurityHeaders(false) },
  });
}

function forbidden(reason = 'Forbidden') {
  return new Response('Forbidden', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain',
      'X-Block-Reason': reason,
      ...getSecurityHeaders(false),
    },
  });
}

function rateLimited(rl) {
  return new Response('Too Many Requests', {
    status: 429,
    headers: {
      'Content-Type': 'text/plain',
      'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
      'X-RateLimit-Limit': String(rl.total),
      'X-RateLimit-Remaining': String(rl.remaining),
      ...getSecurityHeaders(false),
    },
  });
}

function isPurePath(pathname) {
  return pathname === '/pure' || pathname.startsWith('/pure/');
}

function withAssetHeaders(assetResponse) {
  const contentType = assetResponse.headers.get('Content-Type') || '';
  const isHtml = contentType.includes('text/html');
  const headers = new Headers(assetResponse.headers);
  const sec = getSecurityHeaders(isHtml);
  for (const [k, v] of Object.entries(sec)) headers.set(k, v);
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = (url.hostname || '').toLowerCase();
    const method = request.method.toUpperCase();

    if (method !== 'GET' && method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD', ...getSecurityHeaders(false) },
      });
    }

    // /pure belongs to the Pure Alacrity Worker — bounce if we ever see it.
    if (isPurePath(url.pathname)) {
      const rest = url.pathname === '/pure' ? '' : url.pathname.slice('/pure'.length);
      return redirectTo(CONFIG.PURE_CANONICAL + rest + url.search);
    }

    if (!isHttps(request)) {
      return redirectTo('https://' + host + url.pathname + url.search);
    }

    // *.workers.dev → canonical www
    if (host.endsWith('.workers.dev') || CONFIG.REDIRECT_HOSTS.has(host)) {
      return redirectTo(CONFIG.CANONICAL_ORIGIN + url.pathname + url.search);
    }

    if (host !== CONFIG.CANONICAL_HOST) {
      return redirectTo(CONFIG.CANONICAL_ORIGIN + url.pathname + url.search);
    }

    if (isBlockedPath(url.pathname)) return notFound();

    const scanner = isScannerRequest(request, url);
    const rl = checkRateLimit(request, scanner);
    if (rl.limited) {
      console.warn('rate_limit', { ip: request.headers.get('CF-Connecting-IP'), path: url.pathname });
      return rateLimited(rl);
    }
    if (scanner && isBlockedPath(url.pathname)) return forbidden('scanner');

    if (!env.ASSETS) {
      return new Response('Assets binding missing', { status: 500 });
    }

    // Normalize /work → /work/ for directory indexes when needed
    let assetUrl = request.url;
    if (url.pathname === '/work') {
      assetUrl = CONFIG.CANONICAL_ORIGIN + '/work/' + url.search;
    }

    const assetRequest = new Request(assetUrl, request);
    const assetResponse = await env.ASSETS.fetch(assetRequest);

    if (assetResponse.status === 404 && !url.pathname.includes('.')) {
      // Soft 404 page = home (or leave as 404)
      return withAssetHeaders(assetResponse);
    }

    return withAssetHeaders(assetResponse);
  },
};
