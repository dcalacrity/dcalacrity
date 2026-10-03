/**
 * Get the GMAIL_REFRESH_TOKEN the contact form needs — one command, on your own computer.
 *
 *   node tools/gmail-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>
 *
 * It opens Google's consent page; sign in AS support@dcalacrity.com (the inbox
 * the form sends from) and allow "Send email on your behalf". The script
 * catches Google's reply on http://127.0.0.1:53682 and prints the refresh
 * token. Nothing is stored or sent anywhere else.
 *
 * Before running it (Google Cloud console, once — see BACKEND-SETUP.md §2):
 *   · a project with the Gmail API enabled
 *   · OAuth consent screen, User type INTERNAL (Workspace only: no Google
 *     review, and the refresh token does not expire after 7 days)
 *   · an OAuth client of type "Desktop app" → its client id and secret
 */
import http from 'node:http';
import { exec } from 'node:child_process';

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error('usage: node tools/gmail-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>');
  process.exit(1);
}
const PORT = 53682, REDIRECT = `http://127.0.0.1:${PORT}`;
const SCOPE = 'https://www.googleapis.com/auth/gmail.send';
const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: clientId, redirect_uri: REDIRECT, response_type: 'code', scope: SCOPE,
  access_type: 'offline', prompt: 'consent', login_hint: 'support@dcalacrity.com',
});

const server = http.createServer(async (req, res) => {
  const q = new URL(req.url, REDIRECT).searchParams;
  if (!q.get('code')) { res.end(q.get('error') ? 'Google said: ' + q.get('error') : 'waiting…'); return; }
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code: q.get('code'), client_id: clientId, client_secret: clientSecret, redirect_uri: REDIRECT, grant_type: 'authorization_code' }),
    });
    const j = await r.json();
    if (!j.refresh_token) throw new Error(JSON.stringify(j));
    res.end('Done — go back to the terminal. You can close this tab.');
    console.log('\nGMAIL_REFRESH_TOKEN =\n' + j.refresh_token + '\n');
    console.log('Add it, with GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET, as encrypted variables on the Cloudflare Pages project (BACKEND-SETUP.md §2).');
  } catch (e) {
    res.end('Failed: ' + e.message);
    console.error('Failed:', e.message);
  }
  server.close();
});
server.listen(PORT, '127.0.0.1', () => {
  console.log('Opening Google sign-in. If nothing opens, paste this into a browser:\n\n' + url + '\n');
  const open = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
  exec(`${open} "${url}"`, () => {});
});
