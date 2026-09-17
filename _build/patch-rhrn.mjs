/* The Right Here Right Now! microsite is a 22 MB single file with the footage
   inlined, so it is edited surgically and never by hand.

   Two things it gets wrong for the company:
   · It is the loudest published page still introducing us only as a production
     company. "D.C Alacrity Productions" is correct as a PRODUCTION CREDIT and
     stays where it is a credit — but the page never says what the company is,
     so this adds one line that connects back.
   · It still calls the software "Alacrity Hub", which has been Pure Alacrity
     since July 2026.

   ⚠ Every replacement passes a FUNCTION, never a string. In a replacement
   string a dollar sign followed by a quote means "everything after the match",
   which has spliced a whole file into itself in this repo before.

   node dcalacrity-com/_build/patch-rhrn.mjs [--check]
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(HERE, '..', 'public', 'work', 'rhrn.html');
const MIRROR = path.join(HERE, '..', '..', 'dcalacrity-website', 'work', 'rhrn.html');
const CHECK = process.argv.includes('--check');

let s = fs.readFileSync(FILE, 'utf8');
const before = s.length;
const done = [];
const swap = (label, find, make) => {
  if (s.indexOf(find) < 0) return;
  const next = s.split(find).join(make());     /* split/join: no $ substitution */
  if (next !== s) { s = next; done.push(label); }
};

/* 1 · the company line, in the crew card where the production company is credited */
swap('crew card',
  '<div class="crew-role">PRODUCTION COMPANY</div><div class="crew-name">D.C ALACRITY PRODUCTIONS</div><div class="crew-note">Wilmington, NC · pure@dcalacrity.com</div>',
  () => '<div class="crew-role">PRODUCTION COMPANY</div><div class="crew-name">D.C ALACRITY PRODUCTIONS</div>' +
        '<div class="crew-note">The production arm of <a href="https://dcalacrity.com" style="color:var(--teal)">D.C Alacrity</a>, a technology and media company building the Experience Industry. Wilmington, NC · pure@dcalacrity.com</div>');

/* 2 · the footer: the company, named as a company, with a way to reach it */
swap('footer',
  '<div class="footer-copy">© 2026 D.C ALACRITY PRODUCTIONS · ALL RIGHTS RESERVED</div>',
  () => '<div class="footer-copy" style="max-width:52ch;line-height:1.7">' +
        '<a href="https://dcalacrity.com" style="color:var(--teal)">D.C ALACRITY</a> IS A TECHNOLOGY AND MEDIA COMPANY BUILDING THE EXPERIENCE INDUSTRY. ' +
        'THIS FILM IS ONE OF ITS PRODUCTIONS; THE RUNTIME THAT PLAYS IT IS ONE OF ITS PRODUCTS.<br>' +
        '© 2026 D.C ALACRITY PRODUCTIONS · ALL RIGHTS RESERVED</div>');

/* 3 · the page title and description name the company, not only the credit */
swap('title',
  '<title>RIGHT HERE RIGHT NOW — VR Interactive Cinema | D.C Alacrity Productions</title>',
  () => '<title>RIGHT HERE RIGHT NOW — Interactive VR Cinema | D.C Alacrity</title>');
swap('description',
  'content="The world\'s next leap in cinema: VR Interactive Film. A proof-of-concept that demands to become a movement. Seeking serious production partners."',
  () => 'content="North Carolina\'s first interactive live-action VR film, from D.C Alacrity — a technology and media company building original IP, software and interactive experiences. Free on Meta Horizon and SideQuest."');

/* 4 · the software has been called Pure Alacrity since July 2026 */
swap('product name', 'Alacrity Hub', () => 'Pure Alacrity');

if (!done.length) { console.log('rhrn.html: nothing to change (already patched)'); process.exit(0); }

/* the file is 22 MB of inlined footage — a size swing means something went wrong */
const delta = s.length - before;
if (Math.abs(delta) > 4000) { console.error(`REFUSED: size moved by ${delta} bytes, expected a few hundred`); process.exit(1); }
if ((s.match(/<\/html>/g) || []).length !== 1) { console.error('REFUSED: the document no longer ends once'); process.exit(1); }

if (CHECK) { console.log('would change: ' + done.join(', ') + ` (${delta > 0 ? '+' : ''}${delta} bytes)`); process.exit(0); }
fs.writeFileSync(FILE, s, 'utf8');
if (fs.existsSync(path.dirname(MIRROR))) fs.copyFileSync(FILE, MIRROR);
console.log(`rhrn.html patched: ${done.join(', ')} (${delta > 0 ? '+' : ''}${delta} bytes), mirrored`);
