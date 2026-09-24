# Backend — the five things only you can do

Everything in this repo is done and tested. These five steps need your
Cloudflare and provider logins, so they are yours to click. The code is written
to fail safe at every one of them: until they are finished the form still
captures the enquiry, and it never tells a visitor a message was sent when it
was not.

Verify at any point with:

```bash
curl -s https://dcalacrity.com/api/contact
```

That is a health check — it reports the destination, which providers are
configured and whether the lead store is bound. It sends nothing.

---

## 1 · Make `support@dcalacrity.com` a real inbox — 2 minutes, required

The form now delivers to **support@dcalacrity.com**. Until that address exists,
mail to it bounces no matter how good the code is.

The domain's MX already points at Cloudflare Email Routing, so:

> Cloudflare dashboard → **dcalacrity.com** → **Email** → **Email Routing** →
> **Routing addresses** → *Create address* → `support` →
> forward to the inbox you actually read → confirm from that inbox.

**Do this one even if you do nothing else.** Without it every other step
delivers into a void.

⚠ While you are there, check `pure@dcalacrity.com` too. It is still the address
the Pure Alacrity **app** publishes, and it is a separate route from `support@`.

---

## 2 · Give the form a real sender — 10 minutes, strongly recommended

Without this it falls back to FormSubmit, which needs step 3 and has no
delivery log.

1. Create a **Resend** account and add `dcalacrity.com` as a domain.
2. Resend gives you DKIM and SPF records. Add them in Cloudflare DNS.
   ⚠ Your current SPF authorises **only** Cloudflare:
   `v=spf1 include:_spf.mx.cloudflare.net ~all`
   Resend's include has to be merged into that ONE record — a second `v=spf1`
   record is invalid and makes things worse, not better.
3. Cloudflare → your Pages project → **Settings → Environment variables**:

   | name | value |
   |---|---|
   | `RESEND_API_KEY` | the key from Resend |
   | `MAIL_FROM` | `D.C Alacrity <hello@dcalacrity.com>` |
   | `MAIL_TO` | `support@dcalacrity.com` *(optional — this is already the default)* |

`MAIL_TO` exists so you can change where the form lands without a deploy.

---

## 3 · If you stay on FormSubmit, confirm the inbox once

Only relevant if you skip step 2. Submit the form once; FormSubmit emails
`support@dcalacrity.com` an activation link. Click it. **Until then FormSubmit
never delivers** — that is what was wrong before, and it fails silently.

---

## 4 · Bind a KV namespace called `LEADS` — 3 minutes, recommended

This is what makes an enquiry impossible to lose.

> Cloudflare → Pages project → **Settings → Functions → KV namespace bindings**
> → create a namespace `LEADS` → bind it under the variable name `LEADS`.

With it bound, the endpoint writes the enquiry **before** it tries to send, and
a mail outage becomes *"Message received (ref XXXX) — no need to resend"*
instead of a lost lead. Without it everything still works and a mail failure is
a real failure again.

---

## 5 · Deploy

```bash
cd dcalacrity-com
npm run deploy
```

That is `wrangler pages deploy ./public --project-name=dcalacrity` and needs
your Cloudflare login. **It has not been run for you.**

---

## What "done" looks like

```bash
curl -s https://dcalacrity.com/api/contact
```

```json
{
  "ok": true,
  "deliversTo": "support@dcalacrity.com",
  "providers": { "resend": true, "formsubmit": true },
  "leadStore": true
}
```

Then send one real submission and confirm it arrives. If `resend` is `false`
you are on FormSubmit and step 3 applies; if `leadStore` is `false`, step 4 is
still open.

---

## Two things that are NOT backend, but will bite

**There are two copies of this site.** `dcalacrity-com/` is the deploy root and
the only one with `functions/` and `wrangler.toml`. `dcalacrity-website/` is a
working copy with neither. They are byte-identical today and both were updated
together — but editing the wrong one is a silent no-op. Edit
`dcalacrity-com/public/`, or delete the other once you are sure nothing points
at it.

**`www.dcalacrity.com` needs DNS.** `_redirects` and `functions/_middleware.js`
both send www → apex, and neither can run until `www` resolves. Add a proxied
CNAME `www → dcalacrity.com` and attach www as a Pages custom domain.

---

## Tests

```bash
cd dcalacrity-com
node tests/contact.test.mjs
```

14 checks over validation, the honeypot, the provider fallback chain, the
persist-first guarantee, CORS, and the "mail down but lead captured" path. They
mock `fetch`, so running them never emails anyone.
