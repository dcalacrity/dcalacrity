# dcalacrity.com — start here

This folder is **the whole website**: every page, image, script and the
contact-form backend. Deploy it as it is.

| folder / file | what it is |
|---|---|
| `public/` | the website exactly as it is served. **This is what Cloudflare Pages publishes.** |
| `functions/` | the backend: `/api/contact` (the contact form), `/api/leads`, the www redirect |
| `_build/` | the generator for `public/*.html`. Never hand-edit `public/*.html`; edit `_build/` and run `node _build/build.mjs` |
| `tools/apps-script/Code.gs` | the Google Apps Script that sends contact-form email through your Workspace |
| `tests/` | `node tests/contact.test.mjs`: 38 checks, nobody is emailed |
| `BACKEND-SETUP.md` | every email and lead-store setting, step by step |
| `index.html` (top level) | an old page from before the rebuild. It is **not** published, because only `public/` is. |

---

## What was wrong on 2026-10-03

dcalacrity.com showed **Pure Alacrity** instead of the website.

The server was sending the right website. The problem was in browsers. The
Cloudflare Pages project for dcalacrity.com had Pure Alacrity's files deployed
into it as well (`sw.js`, `manifest.webmanifest`, `pa-logo.jpg`, `chunks/`).
A browser that once opened the app at the root of dcalacrity.com installed
the app's *service worker* for the whole domain. From then on, that browser
answered every dcalacrity.com page from its saved copy of the app, without
asking the server.

Fixed three ways:

1. **`public/sw.js` is now a self-removing worker.** Browsers check that file
   on every visit. On the next visit, the stuck worker is replaced, removes
   itself and reloads the page, and the website shows. It deletes no data:
   Pure Alacrity's productions and its own worker at `/pure/` are untouched.
2. **A clean deploy of this folder removes the app's files from the root.**
   That is only true if the deploy contains this folder and nothing else
   (see below).
3. Pure Alacrity no longer registers a worker outside `/pure/` on
   dcalacrity.com, and a stray copy removes itself.

Tested in Chrome:

1. App at the root with its worker installed.
2. Website deployed without this fix: the browser still shows the app.
3. With this fix: the next visit shows the website, and no worker remains.

---

## Also in this version (2026-10-03)

- **Prize Pool VR:** the production's budget, number of nights, hours and
  location count are gone. The section now describes the approach,
  professionally, without figures. A note says the character names are
  working names and may change.
- **Services:** no prices anywhere. Every package now leads to a written
  estimate. The highlighted card in each row was nearly unreadable (dark
  text on a dark card) and is fixed. The add-ons are a clean panel instead of
  a price table.

## Deploy — pick the one that matches your Cloudflare project

Not sure which you have? In Cloudflare → Workers & Pages → **dcalacrity** →
Settings → **Builds**:

- If it names a GitHub repository, your project is Git-connected. Use **B**.
- If it says "Direct Upload", use **A**.

### A · Direct upload (one command)

```bash
cd dcalacrity.com
npm install                 # once: installs wrangler
npx wrangler login          # once: opens Cloudflare in the browser
npm run deploy              # = wrangler pages deploy ./public --project-name=dcalacrity
```

Answer **production** if it asks for a branch. This uploads `public/` and
`functions/` together. A Pages deployment is a full snapshot, so anything not
in this folder, including Pure Alacrity's stray files, disappears from the
site.

### B · Git-connected (GitHub → Cloudflare builds it)

Make your `dcalacrity/dcalacrity` repository **exactly** this folder. Delete
what is not in it, so the stray app files go too:

```bash
git clone https://github.com/dcalacrity/dcalacrity.git
cd dcalacrity
rsync -a --delete --exclude .git /path/to/puresourcecode/dcalacrity.com/ ./
git add -A
git commit -m "dcalacrity.com: the complete site; remove the stray Pure Alacrity worker"
git push            # to the branch Cloudflare deploys (usually main)
```

Then check Cloudflare → dcalacrity → Settings → **Builds**:

- **Build command:** *(empty)*
- **Build output directory:** `public`
- **Root directory:** *(empty)*, meaning the top of the repository

⚠ If the output directory was set to anything other than `public` (for
example the repository root, or a folder that also holds Pure Alacrity), that
is how the app's files got onto the website. Set it to `public`.

### After either deploy, check these four addresses

| open this | you should see |
|---|---|
| https://dcalacrity.com | the D.C Alacrity website (the hand, the lightning, the arrow) |
| https://dcalacrity.com/sw.js | a comment starting `this website has no service worker` |
| https://dcalacrity.com/manifest.webmanifest | **404**: the app's leftovers are gone |
| https://dcalacrity.com/pure/ | Pure Alacrity, still working (it is a separate Worker) |

If **your** browser still shows the app after the deploy, open dcalacrity.com
once more and reload. That visit installs the fix.

If it still sticks, in Chrome: DevTools → *Application* → *Service workers* →
**Unregister** the one whose scope is `https://dcalacrity.com/`.

⚠ Do **not** use "Clear site data" for dcalacrity.com. Pure Alacrity at
`/pure/` shares that storage, and clearing it deletes any productions saved
in that browser.

---

## The contact form ("Couldn't reach us from the site just now")

That message means the form's backend tried every sender and none worked.
Right now the live site reports `"appsScript": false`: **the two Cloudflare
settings are not reaching the deployed site yet.**

You have already:
- deployed the Apps Script as support@ (Execute as **Me**, Who has access **Anyone**);
- added the script properties `SECRET` and `TO`.

To finish:

1. Cloudflare → Workers & Pages → **dcalacrity** → Settings →
   **Variables and Secrets**. Make sure both of these are under
   **Production** (not only Preview), with the names exactly as written:
   - `APPS_SCRIPT_URL`: the Web app URL from Apps Script → *Deploy* →
     *Manage deployments*. It starts with `https://script.google.com/` and
     ends with **`/exec`**. A Workspace URL that looks like
     `…/a/macros/dcalacrity.com/s/…/exec` is fine.
   - `APPS_SCRIPT_SECRET`: the same text as `SECRET` in the script's
     properties.
2. **Deploy again**, with A or B above. Variables only reach deployments made
   *after* they were saved. On a Direct Upload project there is no "Retry"
   that picks them up, so run `npm run deploy` again.
3. Open **https://dcalacrity.com/api/contact?check=1**. This deploy makes it
   say in words what is wrong, without ever showing your secret:

| it says | do this |
|---|---|
| `"appsScript": true` and `"script answers, sending as support@dcalacrity.com"` | ✅ done. Send yourself a test from the contact page. |
| `not visible to this deployment` | step 1 (Production) and step 2 (deploy again) |
| `must end in /exec` | you copied the test (`/dev`) URL. Copy the Web app URL instead. |
| `the secret does not match` | make `APPS_SCRIPT_SECRET` and the script's `SECRET` identical |
| `asks for a Google sign-in` | Apps Script → Deploy → Manage deployments → ✏️ → Who has access: **Anyone** → Deploy. If "Anyone" is not offered, your Workspace blocks outside sharing: admin.google.com → Apps → Google Workspace → Drive and Docs → Sharing settings → allow sharing outside dcalacrity.com. |

Still to do from `BACKEND-SETUP.md` (none of these block the form):

- **SPF, DKIM and DMARC** records, so mail from support@ is not marked as spam.
- The **`LEADS`** KV store, so no enquiry is ever lost even if mail fails.
- A **`www`** DNS record.
