/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║            PURE ALACRITY — CLOUDFLARE WORKER SECURITY GATEWAY                  ║
 * ║            Production-grade edge security + canonical routing                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * The app is a single, self-contained HTML file (public/index.html) served under
 * the /pure path of the apex domain. This Worker runs FIRST for every matching
 * request (see run_worker_first in wrangler.toml) and is responsible for:
 *
 *   1.  Serving Pure Alacrity on:
 *         · https://dcalacrity.com/pure   (path on apex)
 *         · https://pure.dcalacrity.com/  (subdomain — stays here, no bounce)
 *       www.dcalacrity.com/pure and *.workers.dev 301 → apex /pure
 *   2.  Forcing HTTPS.
 *   3.  Blocking scanners, injection probes, and sensitive-path enumeration.
 *   4.  Rate limiting per IP.
 *   5.  Serving the app shell with a strict security-header + CSP set.
 *
 * Serving note: assets are fetched through the ASSETS binding with
 * `env.ASSETS.fetch(...)`, which resolves files directly from ./public and does
 * NOT re-invoke this Worker — so there is no subrequest loop even with
 * run_worker_first enabled. (An earlier ERR_TOO_MANY_REDIRECTS was caused by an
 * always-true `protocol === 'http:'` check, now fixed via the CF-Visitor header.)
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CONFIG = {
    // Primary path home of the app (apex).
    CANONICAL_HOST: 'dcalacrity.com',
    CANONICAL_BASE: '/pure',            // no trailing slash

    // Subdomain that also serves the app at / (no redirect away).
    PURE_HOST: 'pure.dcalacrity.com',

    // Hosts that 301 to https://dcalacrity.com/pure (not pure. itself).
    // (*.workers.dev is always redirected as well — see isRedirectHost.)
    REDIRECT_HOSTS: new Set([
        'www.dcalacrity.com',
    ]),

    // Rate limiting: max requests per IP per window.
    RATE_LIMIT: {
        WINDOW_MS: 60_000,   // 1 minute window
        MAX_REQUESTS: 120,   // 120 req/min for normal users
        SCANNER_MAX: 15,     // drop hard once scanner behaviour is detected
    },
};

CONFIG.CANONICAL_URL = 'https://' + CONFIG.CANONICAL_HOST + CONFIG.CANONICAL_BASE;

// ─── Static app files ────────────────────────────────────────────────────────
// Exact-name allowlist served verbatim from ./public (PWA install layer + the
// universal single-file browser download). Everything else still gets the shell.
const STATIC_APP_FILES = {
    'manifest.webmanifest': { type: 'application/manifest+json', cache: 'public, max-age=3600' },
    // The branded 404, also served (with status 404) for any path that is neither
    // the app, a listed file nor a route chunk — see notFoundPage().
    '404.html':             { type: 'text/html; charset=utf-8', cache: 'public, max-age=3600' },
    'sw.js':                { type: 'text/javascript; charset=utf-8', cache: 'no-cache', extra: { 'Service-Worker-Allowed': '/' } },
    'icon-192.png':         { type: 'image/png', cache: 'public, max-age=604800' },
    // The splash logo, lifted out of the HTML by build-webdeploy.js. As a real
    // file it is fetched in parallel and cached for a week, instead of 328 KB of
    // base64 being parsed as JavaScript on every first visit. The other lifted
    // pictures are pa-img-<hash>.jpg — see step 8.55 [IMG-LIFT].
    'pa-logo.jpg':          { type: 'image/jpeg', cache: 'public, max-age=604800' },
    'icon-512.png':         { type: 'image/png', cache: 'public, max-age=604800' },
    'Pure-Alacrity.html':   { type: 'text/html; charset=utf-8', cache: 'no-cache', extra: { 'Content-Disposition': 'attachment; filename="Pure-Alacrity.html"' } },
    'Pure-Alacrity.apk':    { type: 'application/vnd.android.package-archive', cache: 'public, max-age=3600', extra: { 'Content-Disposition': 'attachment; filename="Pure-Alacrity.apk"' } },
    // Product demo page + its two (web-light) video walkthroughs.
    'demo.html':            { type: 'text/html; charset=utf-8', cache: 'public, max-age=3600' },
    'pa-demo-desktop.mp4':  { type: 'video/mp4', cache: 'public, max-age=604800', extra: { 'Accept-Ranges': 'bytes' } },
    'pa-demo-mobile.mp4':   { type: 'video/mp4', cache: 'public, max-age=604800', extra: { 'Accept-Ranges': 'bytes' } },
    // The ChatGPT kit (Pure Alacrity/ai-kit/), so an AI assistant — a custom GPT, a
    // ChatGPT Project, ChatGPT's agent in a browser — can read how to write for the app.
    // Copied by build-webdeploy.js; without these entries the catch-all would answer
    // /llms.txt with the app's HTML.
    'llms.txt':                           { type: 'text/plain; charset=utf-8', cache: 'public, max-age=3600' },
    'ai-kit/INSTRUCTIONS.md':             { type: 'text/markdown; charset=utf-8', cache: 'public, max-age=3600' },
    'ai-kit/KNOWLEDGE.md':                { type: 'text/markdown; charset=utf-8', cache: 'public, max-age=3600' },
    'ai-kit/README.md':                   { type: 'text/markdown; charset=utf-8', cache: 'public, max-age=3600' },
    'ai-kit/pure-production.schema.json': { type: 'application/schema+json; charset=utf-8', cache: 'public, max-age=3600' },
    'ai-kit/example-production.json':     { type: 'application/json; charset=utf-8', cache: 'public, max-age=3600' },
    'ai-kit/example-branching.fountain':  { type: 'text/plain; charset=utf-8', cache: 'public, max-age=3600' },
    // [OCR-FILES] The OCR engine (Pure Alacrity/_vendor/ocr, tesseract.js 7, Apache-2.0), copied by
    // build-webdeploy.js. Fetched only when somebody reads a scanned PDF; without these entries
    // the catch-all would hand tesseract the app's HTML as its worker.
    'ocr/tesseract.min.js':               { type: 'text/javascript; charset=utf-8', cache: 'public, max-age=604800' },
    'ocr/worker.min.js':                  { type: 'text/javascript; charset=utf-8', cache: 'public, max-age=604800' },
    'ocr/tesseract-core-lstm.wasm.js':    { type: 'text/javascript; charset=utf-8', cache: 'public, max-age=604800' },
    'ocr/eng.traineddata':                { type: 'application/octet-stream', cache: 'public, max-age=604800' },
    'ocr/NOTICE.txt':                     { type: 'text/plain; charset=utf-8', cache: 'public, max-age=604800' },
    'ocr/LICENSE-Apache-2.0.txt':         { type: 'text/plain; charset=utf-8', cache: 'public, max-age=604800' },
};

// ─── BLOCKED PATHS ────────────────────────────────────────────────────────────

const BLOCKED_PATH_PREFIXES = [
    '/.git',
    '/.env',
    '/.htaccess',
    '/.htpasswd',
    '/WEB-INF',
    '/META-INF',
    '/.ssh',
    '/.aws',
    '/.azure',
    '/node_modules',
    '/.npmrc',
    '/.yarnrc',
    '/vendor',
    '/config/',
    '/.svn',
    '/.hg',
    '/.bzr',
    '/CVS',
    '/BitKeeper',
    '/._darcs',
    '/.wrangler',
];

const BLOCKED_PATH_EXACT = new Set([
    '/.env',
    '/.env.local',
    '/.env.production',
    '/.env.staging',
    '/.env.development',
    '/.env.backup',
    '/.dev.vars',
    '/server.key',
    '/privatekey.key',
    '/myserver.key',
    '/key.pem',
    '/id_rsa',
    '/id_dsa',
    '/adminer.php',
    '/phpinfo.php',
    '/info.php',
    '/i.php',
    '/test.php',
    '/shell.php',
    '/vb_test.php',
    '/lfm.php',
    '/filezilla.xml',
    '/sitemanager.xml',
    '/FileZilla.xml',
    '/winscp.ini',
    '/WinSCP.ini',
    '/WS_FTP.INI',
    '/WS_FTP.ini',
    '/ws_ftp.ini',
    '/sftp-config.json',
    '/composer.json',
    '/composer.lock',
    '/package.json',
    '/package-lock.json',
    '/.DS_Store',
    '/Thumbs.db',
    '/DEADJOE',
    '/CHANGELOG.txt',
    '/CHANGELOG.md',
    '/README.md',
    '/LICENSE',
    '/server-status',
    '/server-info',
    '/elmah.axd',
    '/trace.axd',
    '/vim_settings.xml',
    '/.idea',
    '/app/etc/local.xml',
    '/_wpeprivate/config.json',
    '/_framework/blazor.boot.json',
    '/core',
    '/openapi.json',
    '/openapi.yaml',
    '/swagger.json',
    '/swagger.yaml',
    '/swagger',
    '/api-docs',
    '/v2/api-docs',
    '/v3/api-docs',
    '/actuator/health',
    '/actuator',
    '/wrangler.toml',
    '/worker.js',
    '/workers.js',
]);

const BLOCKED_PATH_CONTAINS = [
    '../',
    '..%2f',
    '..%5c',
    '%00',
    '<script',
    'select%20',
    'union%20select',
    'eval(',
    'base64_decode',
    'phpunit',
    'autodiscover',
    'owa/auth',
];

// ─── SCANNER / ATTACK SIGNATURES ─────────────────────────────────────────────

const BLOCKED_UA_PATTERNS = [
    /zgrab/i,
    /masscan/i,
    /nmap/i,
    /nikto/i,
    /sqlmap/i,
    /havij/i,
    /acunetix/i,
    /nessus/i,
    /openvas/i,
    /dirbuster/i,
    /gobuster/i,
    /ffuf/i,
    /wfuzz/i,
    /burpsuite/i,
    /python-requests\/[01]\./i,
    /go-http-client\/1\.1/i,
    /curl\/[0-6]\./i,
    /^-$/,
    /^$/,
];

const BLOCKED_QUERY_PATTERNS = [
    /allow_url_include/i,
    /auto_prepend_file/i,
    /class\.module\.classLoader/i,
    /\bexec\s*\(/i,
    /\bpassthru\s*\(/i,
    /\bsystem\s*\(/i,
    /\bpopen\s*\(/i,
    /\bproc_open\s*\(/i,
    /\bshell_exec\s*\(/i,
    /\beval\s*\(/i,
    /\.\.\/\.\.\//,
    /\bselect\b.*\bfrom\b/i,
    /\bunion\b.*\bselect\b/i,
    /\binsert\b.*\binto\b/i,
    /\bdrop\b.*\btable\b/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    // ThinkPHP multi-language RCE (CNVD-2022-86535) — PHP framework attack,
    // irrelevant to this stack but blocked explicitly to suppress scanner noise.
    /pearcmd/i,
    /config-create/i,
    /lang=.*\.\./i,
];

// ─── SECURITY HEADERS ─────────────────────────────────────────────────────────

function getSecurityHeaders(isHtml = false) {
    const headers = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(self), payment=(), usb=(), bluetooth=(), serial=(), midi=()',
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Cross-Origin-Resource-Policy': 'same-site',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        'Server': 'Cloudflare',
    };

    if (isHtml) {
        const csp = [
            "default-src 'self'",
            // The single-file app is inline today, but optional document/OCR
            // engines and Google Identity are deliberate, named integrations.
            // Keep this an allowlist — never broaden it to an arbitrary host.
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com https://www.google.com https://accounts.google.com https://apis.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' https://images.unsplash.com blob: data:",
            // Auth/RTDB/App Check plus the app's explicit AI, news, webhook,
            // and local-model providers. Arbitrary webhook/AI URLs are not
            // allowed because this app still uses inline/eval-capable scripts.
            "connect-src 'self' https://*.firebaseio.com wss://*.firebaseio.com https://*.googleapis.com https://firebaseinstallations.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.google.com https://www.gstatic.com https://api.groq.com https://openrouter.ai https://api.openai.com https://api.anthropic.com https://api.rss2json.com https://api.allorigins.win https://hooks.slack.com https://hooks.zapier.com https://huggingface.co https://*.hf.co http://localhost:* http://127.0.0.1:*",
            "worker-src 'self' blob:",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            // Firebase Auth handler iframe (pure-alacrity) + Google sign-in / reCAPTCHA.
            "frame-src https://pure-alacrity.firebaseapp.com https://*.firebaseapp.com https://accounts.google.com https://www.google.com https://recaptcha.google.com",
            "upgrade-insecure-requests",
        ].join('; ');

        headers['Content-Security-Policy'] = csp;
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        headers['Pragma'] = 'no-cache';
    }

    return headers;
}

// ─── RATE LIMITING ────────────────────────────────────────────────────────────
// Note: this Map lives per-isolate and is best-effort (not a global counter). It
// absorbs bursts from a single IP hitting one edge location; Cloudflare's own
// network-level protections handle distributed volumetric attacks.

const rateLimitStore = new Map();

function getRateLimitKey(request) {
    return request.headers.get('CF-Connecting-IP') || 'unknown';
}

function checkRateLimit(request, isScanner = false) {
    const key = getRateLimitKey(request);
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
            if (now - v.windowStart > CONFIG.RATE_LIMIT.WINDOW_MS * 2) {
                rateLimitStore.delete(k);
            }
        }
    }

    const remaining = Math.max(0, max - entry.count);
    const resetAt = entry.windowStart + CONFIG.RATE_LIMIT.WINDOW_MS;

    return { limited: entry.count > max, remaining, resetAt, total: max };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function isPureSubdomain(host) {
    return host === CONFIG.PURE_HOST;
}

function isRedirectHost(host) {
    return CONFIG.REDIRECT_HOSTS.has(host) || host.endsWith('.workers.dev');
}

// Path used for security probes. On apex strip /pure; on pure. host use as-is.
function toProbePath(pathname, host) {
    if (isPureSubdomain(host)) {
        return pathname || '/';
    }
    if (pathname === CONFIG.CANONICAL_BASE) return '/';
    if (pathname.startsWith(CONFIG.CANONICAL_BASE + '/')) {
        return pathname.slice(CONFIG.CANONICAL_BASE.length) || '/';
    }
    return pathname;
}

function isScannerRequest(request, url, probePath) {
    const ua = request.headers.get('User-Agent') || '';
    const path = probePath.toLowerCase();
    const query = url.search.toLowerCase();

    if (BLOCKED_UA_PATTERNS.some(p => p.test(ua))) return true;
    if (!ua && path !== '/') return true;
    if (query && BLOCKED_QUERY_PATTERNS.some(p => p.test(safeDecode(query)))) return true;

    const rawPath = probePath + url.search;
    if (BLOCKED_PATH_CONTAINS.some(s => rawPath.toLowerCase().includes(s))) return true;

    return false;
}

function safeDecode(s) {
    try { return decodeURIComponent(s); } catch (_) { return s; }
}

function isBlockedPath(pathname) {
    const lower = pathname.toLowerCase();
    if (BLOCKED_PATH_EXACT.has(lower)) return true;
    if (BLOCKED_PATH_PREFIXES.some(prefix => lower.startsWith(prefix))) return true;

    const ext = lower.split('.').pop();
    const blockedExts = new Set([
        'php', 'asp', 'aspx', 'jsp', 'cgi', 'pl', 'py', 'rb',
        'bak', 'backup', 'old', 'orig', 'tmp', 'temp', 'swp',
        'sql', 'dump', 'db', 'sqlite', 'sqlite3',
        'log', 'logs',
        'pem', 'key', 'cer', 'crt', 'p12', 'pfx',
        'ppk', 'config',
    ]);

    if (blockedExts.has(ext) && pathname !== '/') return true;
    return false;
}

// ─── RESPONSE BUILDERS ────────────────────────────────────────────────────────

function redirectTo(location, status = 301) {
    return new Response(null, {
        status,
        headers: { 'Location': location, ...getSecurityHeaders(false) },
    });
}

function notFoundResponse() {
    return new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain', ...getSecurityHeaders(false) },
    });
}

// The branded 404 (public/404.html) for a person in a browser; the plain one
// for everything else, and always for blocked paths — a scanner learns nothing.
async function notFoundPage(env, url, request) {
    try {
        const accept = (request && request.headers.get('Accept')) || '';
        if (env && env.ASSETS && /text\/html/i.test(accept)) {
            const page = await env.ASSETS.fetch(new URL('/404.html', url.origin));
            if (page.ok) {
                return new Response(page.body, {
                    status: 404,
                    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', ...getSecurityHeaders(false) },
                });
            }
        }
    } catch (_) { /* fall through to the plain response */ }
    return notFoundResponse();
}

function forbiddenResponse(reason = 'Forbidden') {
    return new Response('Forbidden', {
        status: 403,
        headers: { 'Content-Type': 'text/plain', 'X-Block-Reason': reason, ...getSecurityHeaders(false) },
    });
}

function rateLimitResponse(rl) {
    return new Response('Too Many Requests', {
        status: 429,
        headers: {
            'Content-Type': 'text/plain',
            'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rl.total),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
            ...getSecurityHeaders(false),
        },
    });
}

function methodNotAllowedResponse() {
    return new Response('Method Not Allowed', {
        status: 405,
        headers: { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain', ...getSecurityHeaders(false) },
    });
}

// ─── MAIN FETCH HANDLER ───────────────────────────────────────────────────────

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const host = url.hostname.toLowerCase();
        const { pathname, port } = url;

        // 1. Reject non-standard ports (scanner probes, e.g. CNVD-2022-86535).
        if (port && !['443', '80', ''].includes(port)) {
            return forbiddenResponse('invalid-port');
        }

        // 2. Force HTTPS.
        // Workers receive requests internally as http:// even over TLS, so reading
        // url.protocol would redirect-loop on every request. Use CF-Visitor (the
        // real client scheme), then X-Forwarded-Proto, then assume https.
        const cfVisitor = request.headers.get('CF-Visitor');
        const xForwardedProto = request.headers.get('X-Forwarded-Proto');
        let clientScheme = 'https';
        if (cfVisitor) {
            try { clientScheme = JSON.parse(cfVisitor).scheme || 'https'; } catch (_) {}
        } else if (xForwardedProto) {
            clientScheme = xForwardedProto.split(',')[0].trim();
        }
        if (clientScheme === 'http') {
            return redirectTo(url.toString().replace(/^http:/, 'https:'), 301);
        }

        // 3. Host redirects — www / workers.dev → apex /pure.
        //    pure.dcalacrity.com stays on the subdomain and serves the app.
        if (!isPureSubdomain(host) && isRedirectHost(host)) {
            let dest = CONFIG.CANONICAL_URL;
            if (host === 'www.dcalacrity.com' && pathname.startsWith('/pure')) {
                dest += pathname.slice('/pure'.length);
            }
            return redirectTo(dest + url.search, 301);
        }

        // 4. Method filter.
        if (!['GET', 'HEAD'].includes(request.method)) return methodNotAllowedResponse();

        // 5. On apex, everything this Worker sees should live under /pure.
        //    On pure.dcalacrity.com, the app lives at /.
        if (host === CONFIG.CANONICAL_HOST &&
            pathname !== '/index.html' &&
            pathname !== CONFIG.CANONICAL_BASE &&
            !pathname.startsWith(CONFIG.CANONICAL_BASE + '/')) {
            return redirectTo(CONFIG.CANONICAL_URL + url.search, 301);
        }

        // 5.5 Canonicalize /pure -> /pure/ so the PWA scope covers the app URL.
        if (host === CONFIG.CANONICAL_HOST && pathname === CONFIG.CANONICAL_BASE) {
            return redirectTo(CONFIG.CANONICAL_URL + '/' + url.search, 301);
        }

        const probePath = toProbePath(pathname, host);

        // 6. Scanner detection & rate limiting.
        const scanner = isScannerRequest(request, url, probePath);
        const rl = checkRateLimit(request, scanner);
        if (rl.limited) {
            console.warn(`[RATE_LIMIT] IP=${getRateLimitKey(request)} PATH=${pathname}`);
            return rateLimitResponse(rl);
        }

        // 7. Block scanners & injection patterns.
        if (scanner) {
            const query = url.search.toLowerCase();
            if (query && BLOCKED_QUERY_PATTERNS.some(p => p.test(safeDecode(query)))) {
                return forbiddenResponse('injection-attempt');
            }
            const rawPath = probePath + url.search;
            if (BLOCKED_PATH_CONTAINS.some(s => rawPath.toLowerCase().includes(s))) {
                return forbiddenResponse('path-traversal');
            }
            if (probePath !== '/') {
                return forbiddenResponse('scanner-ua');
            }
        }

        // 8. Blocked paths (404 to obscure existence).
        if (isBlockedPath(probePath)) {
            console.warn(`[PATH_BLOCK] IP=${getRateLimitKey(request)} PATH=${pathname}`);
            return notFoundResponse();
        }

        // 8.5 Static app files (PWA + single-file download) — exact-name allowlist.
        const staticName = probePath.replace(/^\//, '');
        const staticFile = Object.prototype.hasOwnProperty.call(STATIC_APP_FILES, staticName)
            ? STATIC_APP_FILES[staticName] : null;
        if (staticFile && env.ASSETS) {
            const assetResp = await env.ASSETS.fetch(new URL('/' + staticName, url.origin));
            if (assetResp.ok) {
                const h = { ...getSecurityHeaders(false), 'Content-Type': staticFile.type, ...(staticFile.extra || {}) };
                if (staticFile.cache) h['Cache-Control'] = staticFile.cache;
                return new Response(assetResp.body, { status: 200, headers: h });
            }
            return notFoundResponse();
        }

        // 8.55 [IMG-LIFT] Pictures lifted out of the shell by build-webdeploy.js — the
        // landing page's screenshots and the intro's logo — named by their CONTENT
        // (pa-img-<10 hex>.jpg), so a name never changes meaning and is cached for a
        // year. A pattern, like the chunks below, because the set changes with the
        // build; the shape is checked, so this cannot reach anything else in ./public.
        // Without it the catch-all answers each one with the HTML shell.
        if (/^\/pa-img-[0-9a-f]{10}\.jpg$/.test(probePath) && env.ASSETS) {
            const assetResp = await env.ASSETS.fetch(new URL(probePath, url.origin));
            if (assetResp.ok) {
                const h = { ...getSecurityHeaders(false), 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' };
                return new Response(assetResp.body, { status: 200, headers: h });
            }
            return notFoundResponse();
        }

        // 8.6 Route chunks — the split web build.
        //
        // ⚠ THIS MUST COME BEFORE STEP 9. Step 9 answers every unmatched path
        // with index.html, which is correct for a hash-routed SPA and
        // catastrophic for a script: a request for chunks/BOOK_EDITOR.js would
        // return thirteen megabytes of HTML with a JavaScript content type, the
        // browser would fail to parse it, and every chunked route in the app
        // would break with no clue as to why.
        //
        // A pattern rather than the exact-name allowlist above, because the
        // chunk set changes with the build and a list would go stale silently.
        // Names are generated (upper snake case) and the shape is checked here,
        // so this cannot be used to reach anything else in ./public.
        const chunkMatch = /^\/chunks\/([A-Z0-9_]{1,64})\.js$/.exec(probePath);
        if (chunkMatch && env.ASSETS) {
            const assetResp = await env.ASSETS.fetch(
                new URL('/chunks/' + chunkMatch[1] + '.js', url.origin));
            if (assetResp.ok) {
                return new Response(assetResp.body, {
                    status: 200,
                    headers: {
                        ...getSecurityHeaders(false),
                        'Content-Type': 'text/javascript; charset=utf-8',
                        // every chunk URL carries ?v=<buildId>, so a new release
                        // asks for a different URL and this can be immutable
                        'Cache-Control': 'public, max-age=31536000, immutable',
                    },
                });
            }
            return notFoundResponse();
        }

        // 8.7 A path that names a FILE the deploy does not have is a real 404,
        // not a route: /pure/old-page.html, /favicon.ico, /wp-login.php. Answering
        // those with the 13 MB shell reports "found" for things that do not exist
        // and hands a person a blank app instead of a way back. Paths without an
        // extension stay with the shell below — the app is hash-routed and a
        // bookmark like /pure/ must keep working.
        if (/\.[a-z0-9]{1,8}$/i.test(probePath) && probePath !== '/index.html') {
            return notFoundPage(env, url, request);
        }

        // 9. Serve the app shell.
        // env.ASSETS.fetch() reads directly from ./public and does NOT re-invoke
        // this Worker, so there is no subrequest loop. We always return index.html
        // because the app is a single-page, hash-routed application.
        try {
            if (!env.ASSETS) {
                return new Response('Service misconfigured: ASSETS binding missing', {
                    status: 503,
                    headers: { 'Content-Type': 'text/plain', 'Retry-After': '30', ...getSecurityHeaders(false) },
                });
            }

            const asset = await env.ASSETS.fetch(new URL('/index.html', url.origin));

            return new Response(asset.body, {
                status: asset.status,
                statusText: asset.statusText,
                headers: {
                    ...Object.fromEntries(asset.headers.entries()),
                    ...getSecurityHeaders(true),
                    'Content-Type': 'text/html; charset=utf-8',
                    'X-RateLimit-Limit': String(rl.total),
                    'X-RateLimit-Remaining': String(rl.remaining),
                },
            });
        } catch (err) {
            console.error(`[FETCH_ERROR] ${err.message}`);
            return new Response('Service temporarily unavailable', {
                status: 503,
                headers: { 'Content-Type': 'text/plain', 'Retry-After': '10', ...getSecurityHeaders(false) },
            });
        }
    },
};
