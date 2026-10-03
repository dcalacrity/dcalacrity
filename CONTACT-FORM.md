# Contact form

**Setup and the steps only you can do live in [BACKEND-SETUP.md](BACKEND-SETUP.md).**
This file is the short version, so the two cannot disagree again.

- Endpoint: `functions/api/contact.js` (Cloudflare Pages Function, `/api/contact`).
- Order of work on every submission:
  1. Store in the `LEADS` KV store, if it is bound.
  2. Try **Resend**, then **Gmail API** (Google Workspace), then **FormSubmit**. The
     first one configured whose own answer says "sent" wins.
  3. Ping `NOTIFY_WEBHOOK`, if it is set.
- What the visitor is told:
  - **"sent"** only when a provider confirmed it.
  - **"received (ref …)"** when it was stored or pinged but not emailed.
  - An honest error naming support@ when none of that happened.
- `GET /api/contact` reports the config; `?check=1` also proves the Resend and Gmail credentials. Neither sends anything.
- `GET /api/leads` with `Authorization: Bearer $LEADS_TOKEN` reads the stored leads.
- Tests: `node tests/contact.test.mjs` (fetch is mocked).

⚠ 2026-10-02: the previous version counted FormSubmit's `200 {"success":"false"}`
refusals as delivered. FormSubmit refuses every server call that has no
Origin/Referer, so every visitor was told "Message sent" while nothing was
sent or kept. Details in BACKEND-SETUP.md.
