# D.C Alacrity — Cloudflare Pages

Official site for **https://dcalacrity.com**

| URL | What |
| --- | --- |
| **https://dcalacrity.com** | This site (canonical) |
| https://www.dcalacrity.com | Cloudflare redirect → apex (you already have this on) |
| https://dcalacrity.com/pure | **Pure Alacrity** — separate Worker (do not put in this repo) |
| `https://<project>.pages.dev` | Pages preview |

Push **this folder** as the GitHub repo root.

---

## Layout

```
dcalacrity-com/          ← GitHub repo root
├── wrangler.toml
├── package.json
├── README.md
├── .gitignore
├── functions/
│   └── _middleware.js   # backup www→apex + security headers
└── public/              ← Build output directory
    ├── index.html
    ├── about.html
    ├── services.html
    ├── product.html
    ├── contact.html
    ├── press.html
    ├── _headers
    ├── robots.txt
    ├── sitemap.xml
    ├── css/ js/ assets/
    └── work/
        ├── index.html
        ├── sidequest.html
        ├── right-here-right-now.html   # marketing page
        ├── rhrn.html                   # full experience microsite (~22MB)
        ├── prize-pool.html
        └── welcome-to-wilmy.html
```

---

## Pages build settings (required)

| Field | Value |
| --- | --- |
| Framework preset | None |
| **Build command** | *(empty)* |
| **Build output directory** | **`public`** |
| Root directory | *(empty)* |

If `*.pages.dev` shows 404, the output directory is wrong.

---

## Custom domains (no redirect loop)

1. Pages → **Custom domains** → primary = **`dcalacrity.com`**
2. Keep your existing **www → dcalacrity.com** redirect
3. **Remove** any old Worker (`dcalacrity-com`) routes on apex/www that send visitors the other way (apex → www). That fight causes `ERR_TOO_MANY_REDIRECTS`.
4. Leave **purealacrity** Worker routes for `/pure` and `/pure/*` alone.

SSL/TLS on the zone should be **Full (strict)**.

---

## Deploy

### Git
Connect the repo in Cloudflare Pages → push → auto deploy.

### CLI
```bash
npm install
npx wrangler login
npx wrangler pages deploy ./public --project-name=dcalacrity
```

### Local
```bash
npm run dev
```

---

## Projects on the site

| Page | Status |
| --- | --- |
| Sidequest | Flagship series — fleshed |
| Right Here Right Now! | Marketing page + full `rhrn.html` experience |
| Prize Pool | VR flagship — Fall 2026 principal |
| Welcome to Wilmy | Cape Fear doc + destination flywheel |

Canonical host everywhere: **dcalacrity.com** (not www).
