# Contact form — how it works, and the 3 things only you can finish

## What was wrong

The form was not broken in the way it looked. `/api/contact` was **live and
responding** the whole time (a GET returns `405 {"ok":false,...}` in JSON, which
is the function answering). The failure was one layer further out:

* Mail went through **FormSubmit**, which refuses to deliver to an address until
  that inbox has clicked a one-time confirmation link. The old code even said so
  in a comment. Unconfirmed inbox → every send fails → the page fell back to
  "Couldn't send… opening an email draft".
* It was addressed to **dcalacrity@gmail.com**, against the standing rule that
  `pure@dcalacrity.com` is the contact everywhere. 37 references across the site
  said gmail; zero said pure@.
* Worst part: a failed send **lost the lead**. The visitor got a `mailto:` draft
  they had to finish themselves. If they closed it, the inquiry was gone and you
  never knew it happened.

## What it does now

Submissions are **captured before any email is attempted**, so a mail outage can
no longer cost you a lead:

1. **Persist** → written to the `LEADS` KV store with a reference code.
2. **Resend** → used when `RESEND_API_KEY` is bound (a real provider with a
   delivery log).
3. **FormSubmit** → no-key fallback.

The reply is honest about what happened: it only says "sent" when mail actually
went out. If mail failed but the lead was stored, the visitor sees
*"Message received (ref XXXX) — no need to resend"* and stays on the page.
The `mailto:` fallback now only fires on a genuine hard failure (offline /
endpoint unreachable), and points at **pure@dcalacrity.com**.

`GET /api/contact` is a health check — it reports the destination address, which
providers are configured, and whether the lead store is bound. Use it to verify
the form without sending yourself a fake inquiry.

## The 3 things only you can do

These need your Cloudflare/provider logins, so they are yours to click:

1. **Make `pure@dcalacrity.com` real.** The domain's MX already points at
   Cloudflare Email Routing, so this is a two-minute job:
   Cloudflare dashboard → *dcalacrity.com* → **Email** → Routing → add address
   `pure@` and forward it to whichever inbox you actually read.
   *Without this, mail to pure@ bounces no matter how good the code is.*

2. **Give it a real sender (recommended).** Create a Resend account, add
   `RESEND_API_KEY` to the Pages project (Settings → Environment variables), and
   verify dcalacrity.com there. Then also add
   `MAIL_FROM = "D.C Alacrity <hello@dcalacrity.com>"`.
   Note: the current SPF record only authorises Cloudflare
   (`v=spf1 include:_spf.mx.cloudflare.net ~all`), so add Resend's SPF/DKIM
   records or mail from your domain may land in spam.
   *Skip this and it falls back to FormSubmit — which needs step 3.*

3. **If you stay on FormSubmit, confirm the inbox once.** Submit the form a
   single time; FormSubmit emails `pure@dcalacrity.com` an activation link.
   Click it. Until then FormSubmit will never deliver.

**Also recommended:** create a KV namespace called `LEADS` and bind it to the
Pages project (Settings → Functions → KV bindings). That is what makes a lead
un-losable. Without the binding everything still works, but a mail failure
becomes a real failure again.

## Deploy

```bash
npm run deploy
```

(That is `wrangler pages deploy ./public --project-name=dcalacrity` and needs
your Cloudflare login — it was not run for you.)

## Verify after deploying

```bash
curl -s https://dcalacrity.com/api/contact
```

Expect `deliversTo: "pure@dcalacrity.com"`, and `resend` / `leadStore` to read
`true` once you have done steps 1–3. Then send one real submission and confirm
it arrives.

## Tests

```bash
node tests/contact.test.mjs
```

14 checks covering validation, the honeypot, the provider fallback chain, the
persist-first guarantee, CORS, and the "mail down but lead captured" path. They
mock `fetch`, so running them never emails anyone.

## Heads-up: duplicate site copy

`dcalacrity-website/` is a byte-identical copy of this site with **no**
`functions/` or `wrangler.toml` — it is not what deploys. Its email addresses
were updated too so the two cannot disagree, but it is a trap: edit
`dcalacrity-com/` (this folder), and consider deleting the other once you are
sure nothing references it.
