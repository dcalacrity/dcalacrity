# Backend — what the contact form needs, and what only you can click

## What was actually wrong (found 2026-10-02)

The form told visitors **"Message sent"** and sent nothing.

- The Pages Function relayed every message through **FormSubmit** from the
  server, with no browser `Origin`/`Referer`. FormSubmit refuses those, every
  time: `"Make sure you open this page through a web server…"`.
- It refuses with **HTTP 200** and `{"success":"false"}`. The function counted
  any 200 as delivered.
- No lead store was bound (`leadStore: false` on the live health check), so
  nothing was kept anywhere. Every enquiry since the switch to FormSubmit is gone.

That is fixed in code:
- FormSubmit now gets the site's Origin, and only its own `success` counts.
- Three real senders are wired in: a Google Apps Script running as support@
  (the Workspace-native one), Gmail API, and Resend.
- An optional chat ping goes out on every lead.
- A private endpoint reads back the stored leads.
- 35 tests cover all of it.

**The code alone cannot make mail arrive.** Do the steps below, in order.

Check progress at any point, without sending anything:

```bash
curl -s "https://dcalacrity.com/api/contact?check=1"
```

---

## The mail setup changed since the last version of this file

`dcalacrity.com`'s MX now points at **Google Workspace** (`1 smtp.google.com`),
not Cloudflare Email Routing. So support@ is a **Google** address now. The old
"Cloudflare → Email Routing" steps no longer apply. Cloudflare Email Routing
cannot be turned on while the MX points at Google.

DNS measured on 2026-10-02:

| record | value | verdict |
|---|---|---|
| MX | `1 smtp.google.com` | ✅ Google Workspace receives the mail |
| SPF (TXT `v=spf1`) | **none** | ❌ add (step 1b) |
| DKIM (`google._domainkey`) | **none** | ❌ add (step 1b) |
| DMARC (`_dmarc`) | **none** | ⚠ add (step 1b) |
| `www` | **none** | ⚠ www.dcalacrity.com does not resolve |

---

## 1 · Make sure support@ can receive outside mail — 5 minutes, required

**1a.** In the Google Admin console (admin.google.com), check that
`support@dcalacrity.com` is one of:

- a **user** (its own mailbox), or
- an **alias** on your user (Users → you → User information → Alternate email), or
- a **Google Group**. ⚠ Groups refuse mail from outside the organisation by
  default, which is the classic "support@ silently drops everything" trap. Fix
  it in Group settings → *Who can post* → **Anyone on the web**, and turn off
  moderation for outside senders.

Then test it from a **personal** Gmail or any account outside dcalacrity.com.
Mail sent from inside the domain proves nothing about outside mail.

**1b. DNS records** (Cloudflare → dcalacrity.com → DNS). Without these, mail
from support@ lands in spam and replies can bounce.

| type | name | content |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `google._domainkey` | the value Google generates: Admin → Apps → Google Workspace → Gmail → **Authenticate email** → Generate new record → then press **Start authentication** |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:support@dcalacrity.com` |

If you add Resend (step 2c), it uses its own `send.dcalacrity.com` records and
does **not** change the root SPF line above. There must only ever be **one**
`v=spf1` record at the root.

---

## 2 · Give the form a real sender — pick ONE

You have Google Workspace, so **2a is the one to do**. It takes 5 minutes and
needs nothing but your Workspace account.

### 2a · Google Apps Script as support@ (recommended for Workspace — 5 minutes)

A 40-line script, run by Google under support@, sends each enquiry through
your Workspace Gmail **from support@ to support@**. You need no Google Cloud
project, no OAuth client and no tokens that expire. The script only ever mails
the address you set inside it, so even a leaked secret cannot be used to spam
anyone. Workspace allows 1,500 of these emails a day.

1. Sign in to Google **as support@dcalacrity.com**. If support@ is an alias or
   a group, sign in as the mailbox that receives it. Then go to
   **script.google.com** → *New project*.
2. Delete what is there and paste `tools/apps-script/Code.gs` from this repo.
   Save it, naming it "dcalacrity contact".
3. ⚙ *Project Settings* → *Script properties* → add two properties:
   - `SECRET`: a long random string, for example from
     `openssl rand -hex 24`, or mash the keyboard for 40 characters.
   - `TO`: `support@dcalacrity.com`
4. *Deploy* → *New deployment* → ⚙ *Web app*:
   - **Execute as: Me**
   - **Who has access: Anyone**. This is required: the website calls the
     script without a Google sign-in. The script itself refuses anything
     without the secret.
5. *Deploy*, then authorize when Google asks. It needs "Send email as you".
   If your Workspace blocks it, an admin can allow it in Admin → Security →
   API controls. Copy the **Web app URL**, which ends in `/exec`.
6. Cloudflare → Workers & Pages → **dcalacrity** → Settings → Variables and
   Secrets → add both as **Secret**, Production:

   | name | value |
   |---|---|
   | `APPS_SCRIPT_URL` | the `/exec` URL |
   | `APPS_SCRIPT_SECRET` | the same `SECRET` as in step 3 |

7. Redeploy the site, then run
   `curl -s "https://dcalacrity.com/api/contact?check=1"`. It should report
   `"appsScript": "script answers, sending as support@dcalacrity.com …"`
   without sending any email.

If you later edit the script, use *Deploy → Manage deployments → Edit → New
version*. The URL stays the same.

### 2b · Gmail API (the same result, more setup — only if Apps Script is blocked in your Workspace)

The form then sends **from support@ to support@** through Google, so it is
never spam-filtered against itself and shows in Sent.

1. console.cloud.google.com → create a project (e.g. `dcalacrity-site`).
2. *APIs & Services → Library* → **Gmail API** → Enable.
3. *OAuth consent screen* → User type **Internal**. Internal means no Google
   review, and the token never expires after 7 days. App name "D.C Alacrity
   website"; no scopes needed here.
4. *Credentials → Create credentials → OAuth client ID* → type **Desktop app**.
   Copy the client ID and secret.
5. On your computer, in this repo:
   ```bash
   node tools/gmail-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>
   ```
   Sign in **as support@dcalacrity.com** and allow "Send email". The script
   prints a refresh token. (If support@ is an alias or group, sign in as the
   mailbox that owns it, and set `GMAIL_SENDER` to that address.)
6. Cloudflare → Workers & Pages → **dcalacrity** → Settings → Variables and
   Secrets → add as **Secret** (encrypted), Production:

   | name | value |
   |---|---|
   | `GMAIL_CLIENT_ID` | from step 4 |
   | `GMAIL_CLIENT_SECRET` | from step 4 |
   | `GMAIL_REFRESH_TOKEN` | from step 5 |
   | `GMAIL_SENDER` | `support@dcalacrity.com` *(the mailbox you signed in as)* |

### 2c · Resend (a transactional provider with a delivery log)

1. resend.com → add domain `dcalacrity.com` → add the DNS records it shows
   (all on `send.` / `resend._domainkey`). Wait for "Verified".
2. Pages project secrets: `RESEND_API_KEY`, and
   `MAIL_FROM = D.C Alacrity <hello@dcalacrity.com>`.

### 2d · None of these: FormSubmit (last resort)

After deploying, send the form once. FormSubmit emails support@ an **Activate
Form** link: click it. Until then it never delivers. It has no delivery log and
may change its rules at any time, so use it only as the fallback it is in the
chain.

The order the function tries is **Apps Script → Resend → Gmail API → FormSubmit**:
the first one configured and working sends it.

---

## 3 · Make a lead impossible to lose — 3 minutes, strongly recommended

1. Cloudflare → Storage & Databases → **KV** → Create namespace `dcalacrity-leads`.
2. Pages project → Settings → Bindings → **KV namespace** → variable name
   **`LEADS`** → that namespace.
3. Add a Secret **`LEADS_TOKEN`**: any long random string (e.g. from
   `openssl rand -hex 24`).

Every enquiry is now written **before** any mail is attempted. Read them any time:

```bash
curl -H "Authorization: Bearer <LEADS_TOKEN>" https://dcalacrity.com/api/leads
curl -H "Authorization: Bearer <LEADS_TOKEN>" "https://dcalacrity.com/api/leads?ref=<REF>"
```

---

## 4 · Get pinged on every lead (optional, 2 minutes)

A Google Chat space → Apps & integrations → **Webhooks** → add → copy the URL.
(Slack and Discord incoming-webhook URLs work too.) Add it as the Secret
**`NOTIFY_WEBHOOK`**. You are then pinged for each enquiry, and the ping says
whether the email went out. A ping on its own counts as the lead being kept.

---

## 5 · Deploy

```bash
npm run deploy        # wrangler pages deploy ./public --project-name=dcalacrity
```

Secrets and bindings take effect on the next deployment. If the site deploys
from GitHub instead, a push to the production branch does the same.

---

## What "done" looks like

```bash
curl -s "https://dcalacrity.com/api/contact?check=1"
```

```json
{
  "ok": true,
  "deliversTo": "support@dcalacrity.com",
  "providers": { "appsScript": true, "resend": false, "gmail": false, "formsubmit": true },
  "leadStore": true,
  "notify": true,
  "checks": { "appsScript": "script answers, sending as support@dcalacrity.com to support@dcalacrity.com" }
}
```

Then send one real enquiry from a phone on mobile data, and confirm it arrives.

---

## Also

- **www.dcalacrity.com does not resolve.** Add a proxied CNAME `www → dcalacrity.com`
  and attach `www.dcalacrity.com` as a Pages custom domain; the middleware
  already 301s it to the apex.
- The Pure Alacrity app shows **pure@dcalacrity.com**. That needs to exist in
  Google Workspace too (an alias of support@ is fine), or switch the app to
  support@.

## Tests

```bash
node tests/contact.test.mjs     # 35 checks; fetch is mocked, nobody is emailed
```
