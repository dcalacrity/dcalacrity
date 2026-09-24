/* Services, contact and the 404. The rate card stays exactly as specific as
   it was — the people who need it need the numbers. */

import { SITE, close, phero, plate } from './shell.mjs';

const pkg = (o) => `          <article class="package${o.featured ? ' featured paper' : ''}" data-rise>
            <p class="tier">${o.tier}</p>
            <h3>${o.name}</h3>
            <p class="price">${o.price} <small>${o.unit}</small></p>
            <ul>
${o.items.map((i) => `              <li>${i}</li>`).join('\n')}
            </ul>
            <a class="btn ${o.featured ? '' : 'btn--quiet '}btn--sm" href="contact.html?topic=Client%20%2F%20commercial">${o.cta}</a>
          </article>`;

const services = {
  slug: 'services.html',
  current: 'services',
  title: 'Services — The Commercial Unit · D.C Alacrity',
  description: 'Shoots, editing, colour and social packages from D.C Alacrity’s commercial unit, at published rates for North Carolina businesses. VR commercial work opening soon.',
  footNote: 'The commercial unit of a technology and media company. Same crews, same tools, client brief.',
  body: `${phero({ plate: 'assets/img/rhrn-tools.jpg', eyebrow: 'Services', title: 'Hire the commercial unit.', lede: 'The same crews and the same software that make our own work, pointed at a client brief. Rates are published because a small business should be able to plan without a discovery call. Client work funds the slate and keeps the bench warm between original productions.', actions: '<a class="btn" href="#packages">See the rates</a> <a class="link" href="contact.html?topic=Client%20%2F%20commercial">Start a project</a>' })}

    <section class="sec" id="packages">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Shoots</p><h2>Get it on camera.</h2></div>
          <p class="lede">Camera and operator packages. Editing is available as an add-on or as a separate post package below.</p>
        </div>
        <div class="package-grid">
${pkg({ tier: 'Half day', name: 'Shoot · 4 hours', price: '$275', unit: 'starting', cta: 'Book half day', items: ['One camera operator with kit', 'Up to 4 hours on location', 'Raw footage handoff on a drive', 'Shot list consultation'] })}
${pkg({ tier: 'Most booked', name: 'Shoot · Full day', price: '$475', unit: 'starting', featured: true, cta: 'Book full day', items: ['Up to 8 hours on location', 'One camera plus audio basics', 'Raw footage handoff', 'Simple lighting where needed'] })}
${pkg({ tier: 'Content day', name: 'Social shoot', price: '$225', unit: 'starting', cta: 'Book social shoot', items: ['About 3 hours, vertical first', 'Phone and camera hybrid welcome', 'Up to 8 raw clips or setups', 'Pair with an edit pack below'] })}
        </div>
      </div>
    </section>

    <section class="sec" id="post">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Post</p><h2>Editing &amp; colour.</h2></div>
          <p class="lede">Bring your own footage or pair it with a shoot. Rates sit in the independent and local-business lane, not on a broadcast retainer.</p>
        </div>
        <div class="package-grid">
${pkg({ tier: 'Edit', name: 'Social cut', price: '$95', unit: 'per cut', cta: 'Request edit', items: ['15–60s Reel, Short or TikTok', 'Captions and a music bed', 'One revision round', '48–72 hour typical turnaround'] })}
${pkg({ tier: 'Edit', name: 'Brand / promo edit', price: '$275', unit: 'starting', featured: true, cta: 'Request brand edit', items: ['30–90s polished cut', 'Basic graphics and lower thirds', 'Two revision rounds', 'Export masters and social crops'] })}
${pkg({ tier: 'Colour', name: 'Colour grade', price: '$85', unit: 'short · from', cta: 'Request grade', items: ['Short-form look pass — $85', 'Promo or brand grade — from $150', 'Longer narrative — custom quote', 'DaVinci Resolve workflow'] })}
        </div>
        <div class="table-wrap" data-rise style="margin-top:3rem">
          <table class="data">
            <thead><tr><th>Add-on</th><th>What you get</th><th>From</th></tr></thead>
            <tbody>
              <tr><td>Rush turnaround</td><td>Same-day or next-day when capacity allows</td><td>+40%</td></tr>
              <tr><td>Extra revision</td><td>Beyond the package rounds</td><td>$35</td></tr>
              <tr><td>Motion / titles pack</td><td>Simple animated open and end card</td><td>$75</td></tr>
              <tr><td>Long-form edit (5–12 min)</td><td>YouTube or event recap style</td><td>$350</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="sec" id="social">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Ongoing</p><h2>Social media management.</h2></div>
          <p class="lede">Monthly retainers for businesses that need steady posting, without an agency floor attached.</p>
        </div>
        <div class="package-grid">
${pkg({ tier: 'Starter', name: 'Social lite', price: '$249', unit: '/ month', cta: 'Start lite', items: ['8 posts a month, static or light video', 'One platform', 'Caption and hashtag drafts', 'A simple monthly report'] })}
${pkg({ tier: 'Growth', name: 'Social + video', price: '$449', unit: '/ month', featured: true, cta: 'Start growth', items: ['12 posts a month', 'Includes 4 short video cuts', 'Up to two platforms', 'Content calendar and light strategy'] })}
${pkg({ tier: 'Bundle', name: 'Shoot + social', price: '$599', unit: '/ month', cta: 'Start bundle', items: ['One half-day shoot per month', 'The social and video package above', 'Batch content for the month', 'Best value if you want fresh footage'] })}
        </div>
      </div>
    </section>

    <section class="sec" id="brand">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Bundled films</p><h2>Shoot and edit together.</h2></div>
          <p class="lede">One booking, one delivery date, and a lower total than buying the halves separately.</p>
        </div>
        <div class="package-grid">
${pkg({ tier: 'Starter', name: 'Spark film', price: '$399', unit: 'starting', cta: 'Request Spark', items: ['Half-day shoot and 2 social cuts', 'Captions included', 'One revision round', 'Good for cafes, shops, campus organisations'] })}
${pkg({ tier: 'Brand', name: 'Brand film', price: '$799', unit: 'starting', featured: true, cta: 'Request brand film', items: ['Full-day shoot', '60–90s hero plus 2 cutdowns', 'Colour pass and captions', 'Two revision rounds'] })}
${pkg({ tier: 'Event', name: 'Event / recap', price: '$550', unit: 'starting', cta: 'Request event', items: ['Coverage day and highlight reel', '2–4 minute recap cut', 'Social teaser included', 'Festivals, showcases, launches'] })}
        </div>
      </div>
    </section>

    <section class="sec" id="destination">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Destination &amp; local</p><h2>Wilmington on camera.</h2></div>
          <p class="lede">Built alongside <a href="work/welcome-to-wilmy.html">Welcome to Wilmy</a> — tourism cutdowns, shop features and place films for Cape Fear businesses.</p>
        </div>
        <div class="package-grid">
${pkg({ tier: 'Destination', name: 'Place film', price: '$449', unit: 'starting', cta: 'Request place film', items: ['Half-day coastal or downtown coverage', '60–90s destination cut', 'Captions and 2 social teases', 'For boards, venues and tourism partners'] })}
${pkg({ tier: 'Local brand', name: 'Shop feature', price: '$599', unit: 'starting', featured: true, cta: 'Request shop feature', items: ['Owner or craft interview with B-roll', '90s hero plus 3 cutdowns', 'Optional stills pack', 'Priority if you appear in Wilmy'] })}
${pkg({ tier: 'Festival', name: 'Event recap', price: '$550', unit: 'starting', cta: 'Request festival recap', items: ['The same event package as above', 'Tuned for local festivals and showcases', 'Highlight plus social teaser', 'Fast turnaround windows'] })}
        </div>
      </div>
    </section>

    <section class="sec" id="vr">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Opening soon</p><h2>VR for property and brands.</h2></div>
          <p class="lede">The same interactive and 360° pipeline behind <a href="work/right-here-right-now.html">Right Here Right Now!</a>, opening to commercial clients.</p>
        </div>
        <div class="service-list" data-rise>
          <div class="service-item"><span class="num">01</span><div><h3>VR property tours</h3><p>Immersive walkthroughs for listings, short-term rentals and developments, with headset and phone-friendly cuts.</p></div><span class="meta">Coming soon</span></div>
          <div class="service-item"><span class="num">02</span><div><h3>VR commercial work</h3><p>Brand experiences, venue showcases, and training or orientation films in 360°.</p></div><span class="meta">Coming soon</span></div>
          <div class="service-item"><span class="num">03</span><div><h3>Interactive branching spots</h3><p>Choose-your-path advertising built on the same compile path as our own titles.</p></div><span class="meta">Coming soon</span></div>
        </div>
        <p style="margin-top:2rem"><a class="btn btn--quiet" href="contact.html?topic=VR%20waitlist">Join the VR waitlist</a></p>
      </div>
    </section>

${close('Tell us what you need.', 'We reply with a simple estimate and no mystery fees. Within two business days on commercial work.', `<a class="btn" href="contact.html?topic=Client%20%2F%20commercial">Start a project</a> <a class="link" href="mailto:${SITE.email}">${SITE.email}</a>`)}`
};

const contact = {
  slug: 'contact.html',
  current: 'contact',
  title: 'Contact — D.C Alacrity',
  description: 'Contact D.C Alacrity about client work, partnerships, press, technology, crew or Pure Alacrity. North Carolina. support@dcalacrity.com',
  body: `${phero({ plate: 'assets/brand/sky-cloud.jpg', eyebrow: 'Contact', title: 'Tell us what you’re building.', lede: 'Client work, partnerships, press, technology, crew or a question about Pure Alacrity — one form, routed by topic. Everything reaches ' + SITE.email + '.' })}

    <section class="sec">
      <div class="wrap">
        <div class="desk" data-rise>
          <div class="desk__form">
            <h2>Send it once. It reaches a person.</h2>
            <form class="form-grid" id="contact-form" novalidate>
              <div class="form-row">
                <label>Name *<input type="text" name="name" required autocomplete="name" placeholder="Your name" maxlength="120"/></label>
                <label>Email *<input type="email" name="email" required autocomplete="email" placeholder="you@example.com" maxlength="160"/></label>
              </div>
              <div class="form-row">
                <label>Phone<input type="tel" name="phone" autocomplete="tel" placeholder="Optional" maxlength="40"/></label>
                <label>Organization<input type="text" name="organization" autocomplete="organization" placeholder="Company, school or outlet" maxlength="160"/></label>
              </div>
              <div class="form-row">
                <label>Topic *
                  <select name="topic" id="topic" required>
                    <option value="Client / commercial">Client / commercial</option>
                    <option value="Investor / partner">Investor / partner</option>
                    <option value="Press / media">Press / media</option>
                    <option value="Technology / licensing">Technology / licensing</option>
                    <option value="Pure Alacrity">Pure Alacrity</option>
                    <option value="Crew / collaborator">Crew / collaborator</option>
                    <option value="VR waitlist">VR waitlist</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>Project type
                  <select name="projectType" id="projectType">
                    <option value="">Select if relevant</option>
                    <option value="Shoot / brand film">Shoot / brand film</option>
                    <option value="Edit / color / social">Edit / colour / social</option>
                    <option value="Series / film partnership">Series / film partnership</option>
                    <option value="VR / interactive">VR / interactive</option>
                    <option value="Software / Pure Alacrity">Software / Pure Alacrity</option>
                    <option value="Pipeline / integration">Pipeline / integration</option>
                    <option value="Press / interview">Press / interview</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </label>
              </div>
              <div class="form-row">
                <label>Budget range
                  <select name="budget">
                    <option value="">Optional</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500–$2,000">$500–$2,000</option>
                    <option value="$2,000–$10,000">$2,000–$10,000</option>
                    <option value="$10,000+">$10,000+</option>
                    <option value="Partnership / equity">Partnership / equity</option>
                    <option value="N/A">N/A</option>
                  </select>
                </label>
                <label>Timeline
                  <select name="timeline">
                    <option value="">Optional</option>
                    <option value="ASAP">ASAP</option>
                    <option value="This month">This month</option>
                    <option value="1–3 months">1–3 months</option>
                    <option value="3–6 months">3–6 months</option>
                    <option value="Exploring">Just exploring</option>
                  </select>
                </label>
              </div>
              <label>How did you find us?
                <select name="source">
                  <option value="">Optional</option>
                  <option value="Search">Search</option>
                  <option value="Social">Social</option>
                  <option value="Referral">Referral</option>
                  <option value="Campus / class">Campus / class</option>
                  <option value="Meta / SideQuest">Meta / SideQuest</option>
                  <option value="Press">Press</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>Message *<textarea name="message" required placeholder="What are you making, booking, partnering on or asking? Include links, dates or locations if you have them." maxlength="5000"></textarea></label>
              <label class="hp-field" aria-hidden="true">Company website<input type="text" name="website" tabindex="-1" autocomplete="off"/></label>
              <div class="form-actions">
                <button class="btn" type="submit" id="contact-submit">Send message</button>
                <p class="form-note">Sends to ${SITE.email}. We aim to reply within two business days on commercial estimates.</p>
              </div>
              <div class="form-status" id="contact-status" role="status" aria-live="polite" hidden></div>
            </form>
          </div>

          <aside class="desk__side">
            ${plate('assets/brand/clouds.jpg', 'fill')}
            <div class="desk__card">
              <p class="caption">Direct</p>
              <p class="contact-email"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
              <p class="small muted">North Carolina · <a href="${SITE.app}">dcalacrity.com/pure</a> is free to use · the <a href="press.html">press kit</a> has the boilerplate.</p>
              <div class="lines">
                <div><h3>Clients</h3><p>Shoots, edits, social, destination packages.</p></div>
                <div><h3>Partners</h3><p>The slate, interactive titles, investment.</p></div>
                <div><h3>Technology</h3><p>The runtime, the bundle format, pipelines of your own.</p></div>
                <div><h3>Press &amp; crew</h3><p>Interviews, assets, embargoes — and credits on real productions.</p></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>`
};

const notFound = {
  slug: '404.html',
  current: null,
  title: 'Page not found — D.C Alacrity',
  description: 'That page does not exist on dcalacrity.com.',
  body: `    <section class="lost">
      ${plate('graph', 'fill')}
      <div class="wrap">
        <p class="eyebrow">404</p>
        <h1>Off the graph.</h1>
        <p class="lede" style="margin:1.5rem auto 2rem">That path does not lead anywhere on this site. Here are the ones that do.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn" href="index.html">Home</a>
          <a class="link" href="technology.html">Technology</a>
          <a class="link" href="work/index.html">The work</a>
          <a class="link" href="contact.html">Contact</a>
        </div>
      </div>
    </section>`
};

export default [services, contact, notFound];
