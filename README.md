# D.C Alacrity — www.dcalacrity.com

Cloudflare Worker + static assets for the **official D.C Alacrity website**.

| URL | What |
| --- | --- |
| **https://www.dcalacrity.com** | This site (canonical) |
| https://dcalacrity.com/… | 301 → www (except `/pure`) |
| https://dcalacrity.com/pure | **Pure Alacrity** (separate Worker / repo) |

This folder is meant to be its **own GitHub repository**. Push it, connect Cloudflare Workers Builds, deploy.

---

## Layout

```
dcalacrity-com/
├── worker.js          # Edge gateway: HTTPS, www canonical, security headers
├── wrangler.toml      # Routes + assets binding
├── package.json
├── README.md
├── .gitignore
└── public/            # Everything web-served
    ├── index.html
    ├── about.html
    ├── services.html
    ├── … 
    ├── css/ js/ assets/
    └── work/          # Includes full RHRN site (rhrn.html)
```

---

## One-time Cloudflare setup

1. Create a GitHub repo (e.g. `dcalacrity-com`) and push **this folder as the repo root**.
2. Cloudflare Dashboard → **Workers & Pages** → Create → **Workers** → Connect to Git.
3. Build settings:
   - **Build command:** *(empty)*
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
4. Ensure the zone `dcalacrity.com` is on Cloudflare.
5. Confirm the **purealacrity** Worker still owns:
   - `dcalacrity.com/pure`
   - `dcalacrity.com/pure/*`
   - `www.dcalacrity.com/pure` (+ `/*`)
   - `pure.dcalacrity.com`
6. Deploy this Worker. It claims `www.dcalacrity.com` and apex paths; `/pure` stays more-specific on Pure’s Worker.

### Route conflict tip

If deploy fails with *“route already assigned”*, remove that pattern from the other Worker first. Never attach `dcalacrity.com/pure` to this project.

---

## Manual deploy

```bash
npm install
npx wrangler login
npx wrangler deploy
```

Local preview:

```bash
npx wrangler dev
```

---

## Updating the site

Replace files under `public/` (from the `dcalacrity-website` working copy), then:

```bash
git add -A
git commit -m "Update marketing site"
git push
```

Workers Builds redeploys on push.

---

## Canonical behaviour

| Request | Result |
| --- | --- |
| `http://www.dcalacrity.com/…` | 301 → `https://www.dcalacrity.com/…` |
| `https://dcalacrity.com/about.html` | 301 → `https://www.dcalacrity.com/about.html` |
| `https://dcalacrity.com/pure` | Pure Alacrity Worker (not this one) |
| `*.workers.dev` | 301 → www |

Pure Alacrity launch buttons on the site still point at **https://dcalacrity.com/pure** (Pure’s canonical).
