/**
 * dcalacrity.com contact form → support@ through Google Workspace.
 *
 * Deploy this AS support@dcalacrity.com (or the mailbox that owns it):
 *   1. script.google.com → New project → paste this file → Save.
 *   2. Project Settings (gear) → Script properties → Add:
 *        SECRET = a long random string (the same value goes in Cloudflare as APPS_SCRIPT_SECRET)
 *        TO     = support@dcalacrity.com
 *   3. Deploy → New deployment → type "Web app"
 *        Execute as:      Me
 *        Who has access:  Anyone          ← required: the website calls it without a Google sign-in
 *      Authorize when asked (it needs "send email as you"). Copy the Web app URL (…/exec).
 *   4. Cloudflare → Workers & Pages → dcalacrity → Settings → Variables and Secrets:
 *        APPS_SCRIPT_URL    = the /exec URL
 *        APPS_SCRIPT_SECRET = the SECRET above
 *      then redeploy the site.
 *
 * Safe by construction: it only ever mails TO (set here, not by the caller), and
 * refuses anything without the secret. Workspace allows 1,500 such emails a day.
 */
function props_() { return PropertiesService.getScriptProperties(); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clip_(s, n) { return String(s == null ? '' : s).slice(0, n); }

function doPost(e) {
  var SECRET = props_().getProperty('SECRET'), TO = props_().getProperty('TO') || Session.getEffectiveUser().getEmail();
  var b;
  try { b = JSON.parse(e.postData.contents); } catch (_) { return out_({ ok: false, error: 'bad request' }); }
  if (!SECRET || String(b.secret) !== SECRET) return out_({ ok: false, error: 'forbidden' });
  var replyTo = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(b.replyTo || '')) ? String(b.replyTo) : undefined;
  GmailApp.sendEmail(TO, clip_(b.subject, 240) || 'dcalacrity.com enquiry', clip_(b.text, 20000), {
    htmlBody: clip_(b.html, 60000) || undefined,
    replyTo: replyTo,
    name: 'dcalacrity.com'
  });
  return out_({ ok: true, ref: clip_(b.ref, 40) });
}

/* GET ?check=1&secret=… — lets /api/contact?check=1 prove the setup without sending */
function doGet(e) {
  var p = (e && e.parameter) || {}, SECRET = props_().getProperty('SECRET');
  if (!SECRET || p.secret !== SECRET) return out_({ ok: false, error: 'forbidden' });
  return out_({ ok: true, from: Session.getEffectiveUser().getEmail(), to: props_().getProperty('TO') || Session.getEffectiveUser().getEmail(), quotaLeftToday: MailApp.getRemainingDailyQuota() });
}
