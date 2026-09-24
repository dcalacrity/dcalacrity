/* The company pages. Copy rules in ../DESIGN.md §6 apply to every line here:
   the company is a technology and media company; Pure Alacrity was built out
   of Sidequest, not for it; every number shipped or was measured. */

import { SITE, band, phero, facts } from './shell.mjs';

const PURE = SITE.app;

/* ─────────────────────────────────────────── home ─────────────────────── */

const home = {
  slug: 'index.html',
  current: null,
  area: 'tech',
  title: 'D.C Alacrity — Technology, Media & the Experience Industry',
  description: 'D.C Alacrity is a technology and media company building original IP, software and interactive experiences, with a mission to expand across industries.',
  ogTitle: 'D.C Alacrity — Technology, Media & the Experience Industry',
  ogDescription: 'A technology and media company building original IP, software and interactive experiences. Founded in North Carolina.',
  body: `    <section class="stage" aria-labelledby="stage-title">
      <div class="sky" aria-hidden="true">
        <div class="stage__high"></div>
        <div class="stage__deck"></div>
        <div class="stage__wash"></div>
        <div class="stage__key"></div>
        <div class="stage__bloom"></div>
        <div class="stage__core"></div>
        <img class="stage__mark" src="assets/brand/mark.png" alt="" width="176" height="320"/>
        <div class="stage__grain"></div>
      </div>
      <p class="sr-only">Behind this page is the story graph of <em>Right Here Right Now!</em> — the branching structure of a released interactive film, drawn from the file the Unity runtime actually plays.</p>
      <div class="wrap stage__content">
        <div class="stage__copy">
          <p class="eyebrow">D.C Alacrity · North Carolina</p>
          <h1 id="stage-title">Building the <em>Experience Industry</em>.</h1>
          <p class="lede">We are a technology and media company developing original IP, software and interactive experiences. Our first products and productions are the foundation for a broader mission: technologies and businesses that change how people create, work, learn and connect.</p>
          <div class="btn-row">
            <a class="btn btn--arc" href="technology.html">See the technology</a>
            <a class="btn btn--ghost" href="work/index.html">See the work</a>
          </div>
        </div>
        <dl class="stage__aside">
          <div><dt>Founded</dt><dd>North Carolina</dd></div>
          <div><dt>Live</dt><dd><a href="${PURE}">Pure Alacrity</a> — free to use</dd></div>
          <div><dt>Shipped</dt><dd><a href="work/right-here-right-now.html">Right Here Right Now!</a> on Meta Horizon</dd></div>
        </dl>
      </div>
      <div class="stage__scroll" aria-hidden="true"><span>The story graph</span><i></i></div>
    </section>

    <section class="sec sec--tight">
      <div class="wrap">
${facts([
    ['Free', 'Pure Alacrity — live, no account needed'],
    ['Shipped', 'North Carolina’s first interactive live-action VR film'],
    ['4', 'original properties we own'],
    ['Local-first', 'your work stays on your device']
  ])}
      </div>
    </section>

    <section class="sec sec--deep sec--glass stagey" id="definition">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">The organising idea</p>
            <h2>What we mean by the <em>Experience Industry</em>.</h2>
          </div>
          <p class="lede">Three things have to be true at once for an experience to exist: someone has to make it, something has to deliver it, and other people have to be able to build the next one. We work on all three, and each already has something finished attached to it.</p>
        </div>

        <div class="def">
          <article data-flat data-area="media">
            <p class="eyebrow eyebrow--plain">01 · The experience</p>
            <h3>What a person actually meets.</h3>
            <p>The thing someone watches, plays or walks into. For us that has meant branching live action on a headset, a crime series, a documentary about a coastline.</p>
            <div class="ex">
              <b>What exists</b>
              <a href="work/right-here-right-now.html">Right Here Right Now!</a> — North Carolina’s first interactive live-action VR film, free on Meta Horizon and SideQuest.
            </div>
            <p style="margin-top:1rem"><strong>The capability it establishes:</strong> we can design a story that branches, shoot it as live action, and finish it as something a person opens on a device they already own.</p>
          </article>

          <article data-flat data-area="tech">
            <p class="eyebrow eyebrow--plain">02 · The delivery</p>
            <h3>The technology that carries it.</h3>
            <p>A runtime that turns an authored story into something playable, and a contract strict enough that the two halves cannot drift apart.</p>
            <div class="ex">
              <b>What exists</b>
              <a href="technology.html">Alacrity Player</a> — a Unity runtime that reads one JSON bundle and plays the graph. Schema 2.0.0, pinned on both sides, round-trip tested.
            </div>
            <p style="margin-top:1rem"><strong>The capability it establishes:</strong> a written branching story compiles into a playable experience. Film is where we applied it first, not the limit of it.</p>
          </article>

          <article data-flat data-area="rnd">
            <p class="eyebrow eyebrow--plain">03 · The system</p>
            <h3>What lets other people do it.</h3>
            <p>Software that takes a way of working and turns it into something a team can operate — schedules, budgets, breakdowns, the day on set, the handoff to post.</p>
            <div class="ex">
              <b>What exists</b>
              <a href="${PURE}">Pure Alacrity</a> — the production suite, free to use, running real productions since March 2026.
            </div>
            <p style="margin-top:1rem"><strong>The capability it establishes:</strong> a process one person invented becomes a system other people run. That is the difference between a practitioner and a company.</p>
          </article>
        </div>

        <div class="def__thread" data-rise>
          <div>
            <p class="eyebrow">The thread</p>
          </div>
          <p>All three are the same underlying job: take work that only exists in one person’s head, give it a structure, and hand other people the controls. We do it for film because that is the industry we came from and the one whose problems we know in detail. <strong>The capability is not specific to film</strong> — any field where complicated work has to be coordinated, then delivered as something a person experiences, is the same shape of problem.</p>
        </div>
      </div>
    </section>

    <section class="sec" id="areas">
      <div class="wrap">
        <div class="sec-head sec-head--stack" data-rise>
          <p class="eyebrow">Areas of activity</p>
          <h2>Four places the work happens.</h2>
        </div>
        <div class="areas">
          <a class="area" data-area="tech" href="technology.html">
            <i aria-hidden="true"></i>
            <h3>Technology</h3>
            <p>Pure Alacrity, Alacrity Player and Alacrity Bridge — a production suite, a runtime, and the seam into professional post.</p>
            <span class="pill pill--live">One live · two in build</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
          <a class="area" data-area="media" href="work/index.html">
            <i aria-hidden="true"></i>
            <h3>Media &amp; experiences</h3>
            <p>Original properties we own: a crime dramedy, an interactive VR film, a social thriller in pre-production, a coastal documentary.</p>
            <span class="pill pill--shipped">4 properties</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
          <a class="area" data-area="rnd" href="research.html">
            <i aria-hidden="true"></i>
            <h3>Research &amp; development</h3>
            <p>What we are investigating, what the current experiments establish, and where the capability could go next — kept separate from what already works.</p>
            <span class="pill pill--dev">In progress</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
          <a class="area" data-area="svc" href="services.html">
            <i aria-hidden="true"></i>
            <h3>Services</h3>
            <p>A commercial unit for North Carolina businesses — shoots, edits, colour and social, at published rates.</p>
            <span class="pill">Booking now</span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>

    <section class="sec sec--deep stagey" id="technology">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">Technology</p>
            <h2>The software is the company’s second product line.</h2>
          </div>
          <p class="lede">Not a tool we built for one film and kept. Pure Alacrity is free, public and running real productions. These are real screens from the current build.</p>
        </div>

        <div class="tech">
          <div>
            <div class="prods">
              <article class="flat prod" data-flat data-area="tech">
                <div>
                  <h3>Pure Alacrity</h3>
                  <p>Script, breakdown, schedule, budget, the day on set, post and delivery — with the same numbers in every one of them. Runs in a browser, on Windows, macOS and Android, and offline.</p>
                </div>
                <span class="pill pill--live">Live · free</span>
                <p class="meta">Built out of Sidequest, not for it · development began January 2026 · running productions since March 2026</p>
              </article>
              <article class="flat prod" data-flat data-area="tech">
                <div>
                  <h3>Alacrity Player</h3>
                  <p>A Unity runtime that reads one exported bundle and plays a branching story on a headset, with a flat 2D path for people without one.</p>
                </div>
                <span class="pill pill--shipped">Shipped in RHRN!</span>
                <p class="meta">Schema 2.0.0 · the same contract on both sides · round-trip tested</p>
              </article>
              <article class="flat prod" data-flat data-area="tech">
                <div>
                  <h3>Alacrity Bridge</h3>
                  <p>The seam into professional post: the shot plan and the day’s record arriving in Premiere Pro and DaVinci Resolve as a real timeline, through OpenTimelineIO.</p>
                </div>
                <span class="pill pill--dev">In development</span>
                <p class="meta">Open format, not a proprietary handoff</p>
              </article>
            </div>
            <p style="margin-top:1.5rem"><a class="btn btn--link" href="technology.html">How the three fit together</a></p>
          </div>

          <div class="fan" data-rise>
            <figure class="fan__shot is-a">
              <img src="assets/screens/storymap.jpg" alt="Pure Alacrity’s Story Map — a branching story drawn as a node graph, with tracks, phases and an inspector" width="1440" height="900" loading="lazy" decoding="async"/>
              <figcaption>Story Map</figcaption>
            </figure>
            <figure class="fan__shot is-b">
              <img src="assets/screens/script-editor.jpg" alt="Pure Alacrity’s Script Studio showing a formatted screenplay page with scene markers and page eighths" width="1440" height="900" loading="lazy" decoding="async"/>
              <figcaption>Script Studio</figcaption>
            </figure>
            <figure class="fan__shot is-c">
              <img src="assets/screens/breakdown.jpg" alt="Pure Alacrity’s Breakdown screen with scene, element, cast and location counts and category chips" width="1440" height="900" loading="lazy" decoding="async"/>
              <figcaption>Breakdown</figcaption>
            </figure>
            <figure class="fan__shot is-d">
              <img src="assets/screens/dashboard.jpg" alt="Pure Alacrity’s command centre showing a production’s story, plan, set, post, delivery and business state" width="1440" height="900" loading="lazy" decoding="async"/>
              <figcaption>Command centre</figcaption>
            </figure>
            <div class="fan__dots" role="tablist" aria-label="Choose a screen">
              <button type="button" aria-label="Story Map"></button>
              <button type="button" aria-label="Script Studio"></button>
              <button type="button" aria-label="Breakdown"></button>
              <button type="button" aria-label="Command centre"></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec rail" id="compiler">
      <div class="rail__pin">
        <div class="wrap">
          <div class="rail__head" data-rise>
            <div>
              <p class="eyebrow">The capability</p>
              <h2>How a story becomes an experience.</h2>
            </div>
            <p class="lede">A branching script is written, broken down and scheduled like any film — then compiled into something a person can play. Game engines have done half of this for years. None of them know what a call sheet is.</p>
          </div>
          <div class="rail__stage">
            <div class="rail__line" aria-hidden="true"></div>
            <div class="rail__pulse" aria-hidden="true"></div>
            <div class="rail__track">
              <div class="node" data-area="tech"><div class="flat"><p class="k"><span>Author</span><span>01</span></p><h3>The story graph</h3><p>Scenes, choices and endings as a graph you can actually read. Written in Pure Alacrity.</p></div></div>
              <div class="node" data-area="tech"><div class="flat"><p class="k"><span>Produce</span><span>02</span></p><h3>Breakdown &amp; schedule</h3><p>Because in live action a branch is not a line of script. It is a shooting day, with a crew and a budget attached.</p></div></div>
              <div class="node" data-area="media"><div class="flat"><p class="k"><span>Compile</span><span>03</span></p><h3>One bundle</h3><p>A single JSON file carrying the graph and the clips. Schema 2.0.0, pinned on both sides and tested by round trip.</p></div></div>
              <div class="node" data-area="tech"><div class="flat"><p class="k"><span>Run</span><span>04</span></p><h3>Alacrity Player</h3><p>A Unity runtime reads the bundle and plays it. No hand-wiring between what was written and what runs.</p></div></div>
              <div class="node" data-area="rnd"><div class="flat"><p class="k"><span>Deliver</span><span>05</span></p><h3>Wherever people are</h3><p>Headset, a flat 2D path, the web. The same graph, different output — which is why the format stalling is not the bet.</p></div></div>
            </div>
          </div>
          <div class="rail__foot" data-rise>
            <span class="pill pill--shipped">This path shipped</span>
            <span>It produced <a href="work/right-here-right-now.html">Right Here Right Now!</a>, and it is the path <a href="work/prize-pool.html">Prize Pool</a> is being built on.</span>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep stagey" id="work">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">Media &amp; experiences</p>
            <h2>Properties we own.</h2>
          </div>
          <p class="lede">Original work, not client work. Each one earns on its own surface and de-risks the next thing — and each is an application of the capabilities above.</p>
        </div>
        <div class="slate">
          <a class="tile tile--wide t-sq" data-flat href="work/sidequest.html">
            <div class="media"><img src="assets/img/squad.jpg" alt="The ABC Squad cast of Sidequest on location" width="1800" height="1012" loading="lazy" decoding="async"/><span class="cap">Series · in post</span></div>
            <div class="body">
              <p class="kind">Flagship series · crime dramedy</p>
              <h3>$IDEQU3ST</h3>
              <p>Adam Dawnbringer, 21 and freshly fired, treats life like a video game. He reunites his crew of small-time crooks to get rich on a lawless dark-web gig economy — never knowing whose game it really is. October 2026 release aim.</p>
              <span class="go">Enter the world</span>
            </div>
          </a>
          <a class="tile tile--tall t-teal" data-flat href="work/right-here-right-now.html">
            <div class="media"><img src="assets/img/dcalacrity.jpg" alt="D.C Alacrity’s brand mark" width="800" height="800" loading="lazy" decoding="async"/><span class="cap">Live on Meta Horizon</span></div>
            <div class="body">
              <p class="kind">Interactive VR film · released</p>
              <h3>Right Here Right Now!</h3>
              <p>North Carolina’s first interactive live-action VR film. Free on Meta Horizon and SideQuest — and the proof that the compile path works end to end.</p>
              <span class="go">Format · pipeline · play</span>
            </div>
          </a>
          <a class="tile tile--half" data-flat data-area="rnd" href="work/prize-pool.html">
            <div class="media"><img src="assets/img/prize-pool-placeholder.jpg" alt="Placeholder key art for Prize Pool" width="1536" height="1024" loading="lazy" decoding="async"/><span class="cap">Placeholder art · in development</span></div>
            <div class="body">
              <p class="kind">Interactive VR · principal Fall 2026</p>
              <h3>Prize Pool</h3>
              <p>The campus assassin pot hits $1,000,000. Alliance, romance and suspicion move as meters, not menus. The next title on the same stack.</p>
              <span class="go">See the design</span>
            </div>
          </a>
          <a class="tile tile--half" data-flat data-area="media" href="work/welcome-to-wilmy.html">
            <div class="media"><img src="assets/img/welcome-to-wilmy.jpg" alt="An interview on the Cape Fear coast for Welcome to Wilmy" width="1024" height="576" loading="lazy" decoding="async"/><span class="cap">Documentary · in production</span></div>
            <div class="body">
              <p class="kind">Documentary · Cape Fear</p>
              <h3>Welcome to Wilmy</h3>
              <p>Surf and beach culture on the Cape Fear coast, under a City of Wilmington permit — and a working relationship with the businesses in frame.</p>
              <span class="go">Film · flywheel · hire</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="sec" id="expansion">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">Expansion</p>
            <h2>Why the first products support a broader future.</h2>
          </div>
          <p class="lede">A narrow starting market and a broad company are not in conflict. These are the five capabilities we are actually building, stated as what they are good for rather than what they were first used on.</p>
        </div>
        <ul class="caps">
          <li data-rise><div><h3>Creating original intellectual property</h3><p>We own what we make. A property earns on its own surface, and it is also the test case that proves the technology under it.</p></div></li>
          <li data-rise><div><h3>Software that coordinates complicated work</h3><p>A film set is a hard coordination problem with a fixed deadline and no second attempt. Software that survives one is not fragile anywhere else.</p></div></li>
          <li data-rise><div><h3>Connecting creative tools to delivery systems</h3><p>Story map into Unity. Shot plan into Premiere Pro and DaVinci Resolve through OpenTimelineIO. The seams between systems are where work is normally lost, and they are the part we build deliberately.</p></div></li>
          <li data-rise><div><h3>Building interactive experiences</h3><p>Branching live action that reaches a store, not a prototype that screens once. Choice, state and consequence, authored by people who are not engineers.</p></div></li>
          <li data-rise><div><h3>Making the work repeatable without us</h3><p>Every process here started inside one person’s head and ended as something a team can operate. That is the move from individual ability to an organisation, and it is the one that decides whether a company can grow.</p></div></li>
        </ul>
      </div>
    </section>

    <section class="sec sec--deep stagey" id="routes">
      <div class="wrap">
        <div class="sec-head sec-head--stack" data-rise>
          <p class="eyebrow">Where to go next</p>
          <h2>Watch, use, hire or partner.</h2>
        </div>
        <div class="doors">
          <a class="flat door" data-flat data-tilt data-area="media" href="work/index.html">
            <p class="k">Watch</p>
            <div><h3>The work</h3><p>Four original properties, and what state each is really in.</p></div>
          </a>
          <a class="flat door" data-flat data-tilt data-area="tech" href="${PURE}">
            <p class="k">Use</p>
            <div><h3>Pure Alacrity</h3><p>Free, no account needed. Open it and put a production in it.</p></div>
          </a>
          <a class="flat door" data-flat data-tilt data-area="svc" href="services.html">
            <p class="k">Hire</p>
            <div><h3>The commercial unit</h3><p>Shoots, edits, colour and social at published rates.</p></div>
          </a>
          <a class="flat door" data-flat data-tilt data-area="rnd" href="contact.html?topic=Investor%20%2F%20partner">
            <p class="k">Partner</p>
            <div><h3>Build with us</h3><p>Production partners, investors, and anyone with a coordination problem this shape.</p></div>
          </a>
        </div>
      </div>
    </section>

${band('Tell us what you’re building.', 'Clients, partners, press, crew, Pure Alacrity questions — one form, routed by topic. It reaches ' + SITE.email + '.', '<a class="btn btn--arc" href="contact.html">Start a conversation</a> <a class="btn btn--ghost" href="press.html">Press kit</a>')}`
};

/* ─────────────────────────────────────── technology ───────────────────── */

const technology = {
  slug: 'technology.html',
  current: 'technology',
  area: 'tech',
  title: 'Technology — Pure Alacrity, Alacrity Player, Alacrity Bridge · D.C Alacrity',
  description: 'The software D.C Alacrity builds: Pure Alacrity, the free production suite; Alacrity Player, the Unity runtime that plays a branching story; and Alacrity Bridge, the seam into professional post.',
  body: `${phero({
    eyebrow: 'Technology',
    title: 'Three products. One contract between them.',
    lede: 'Pure Alacrity is live and free to use. Alacrity Player shipped inside a released VR title. Alacrity Bridge is in development. They share a single JSON contract, which is what makes them a stack rather than three separate tools.',
    actions: `<a class="btn btn--arc" href="${PURE}">Open Pure Alacrity</a> <a class="btn btn--ghost" href="${PURE}/demo.html">Watch the demo</a>`,
    aside: `<div class="frame" data-rise><div class="frame__bar"><i></i><i></i><i></i><span>Pure Alacrity · Story Map</span></div><img src="assets/screens/storymap.jpg" alt="Pure Alacrity’s Story Map with a branching story drawn as a node graph" width="1440" height="900"/></div>`
  })}

    <section class="sec sec--tight">
      <div class="wrap">
${facts([
    ['Free', 'Pure Alacrity’s public tier, live now'],
    ['Offline', 'the browser app runs with no connection'],
    ['2.0.0', 'the schema pinned on both sides of the bundle'],
    ['Local-first', 'your productions stay on your device']
  ])}
      </div>
    </section>

    <section class="sec stagey" id="pure">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">01 · Available</p>
            <h2>Pure Alacrity</h2>
          </div>
          <p class="lede">The production suite. Script, breakdown, schedule, budget, the day on set, post and delivery — with the same numbers in all of them, because they read the same production rather than copies of it.</p>
        </div>

        <div class="split split--top">
          <div class="prose">
            <p><strong>The problem it solves.</strong> An independent production runs on six subscriptions and a folder of spreadsheets that disagree with each other. The script says one thing, the schedule another, the budget a third, and nobody finds out until a shoot day is wrong.</p>
            <p><strong>Who it is for.</strong> Independent producers, student and first-time crews, small commercial units, and anyone running a production without a studio’s back office. It is free, it needs no account, and it works with no internet.</p>
            <p><strong>Where it came from.</strong> It was built out of Sidequest, not for it. Fourteen shoot days, eighty-four people and an internship at an established Wilmington production house made the broken workflow obvious. Development began in January 2026, and it has been running real productions since March 2026.</p>
          </div>
          <div>
            <ul class="caps" style="grid-template-columns:1fr">
              <li><div><h3>Story room</h3><p>Script Studio, coverage, the story map, the world bible, and the export the Alacrity Player reads.</p></div></li>
              <li><div><h3>Pre-production to post</h3><p>Breakdowns, stripboards, call sheets, day logs, media vaults and delivery.</p></div></li>
              <li><div><h3>Live production</h3><p>On set, a desktop machine hosts the production over local Wi-Fi. Crew join with a code on their own phones — no install, no internet.</p></div></li>
              <li><div><h3>The business of it</h3><p>Customers, estimates, invoices and expenses, for client work and your own slate alike.</p></div></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep stagey" id="player">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">02 · Shipped</p>
            <h2>Alacrity Player</h2>
          </div>
          <p class="lede">A Unity runtime that reads one exported bundle and plays a branching story — on a headset, or as a flat 2D path for people who do not own one.</p>
        </div>
        <div class="split split--top">
          <div class="prose">
            <p><strong>The problem it solves.</strong> Authoring a branching story and running one are normally two different worlds joined by hand. When Netflix made <em>Bandersnatch</em>, the tooling ended at a flowchart exported to a spreadsheet that engineers implemented by hand across hundreds of footage segments.</p>
            <p><strong>What it does instead.</strong> The graph written in Pure Alacrity is exported as one JSON bundle. The Player reads that file directly. The schema version is pinned on both sides and a self-test walks a bundle out and back to prove the two halves still agree.</p>
            <p><strong>Where it ran.</strong> It is the runtime inside <a href="work/right-here-right-now.html">Right Here Right Now!</a>, free on Meta Horizon and SideQuest, and it is what <a href="work/prize-pool.html">Prize Pool</a> is being built against.</p>
          </div>
          <div class="flat" data-flat data-tilt style="padding:2rem">
            <p class="eyebrow eyebrow--plain">The contract</p>
            <div class="table-wrap" style="border:0">
              <table class="data">
                <tbody>
                  <tr><td>Schema</td><td>2.0.0, pinned in the suite and the runtime</td></tr>
                  <tr><td>Carries</td><td>the node graph, the choices, the clip for each node</td></tr>
                  <tr><td>Verified by</td><td>a round-trip self-test on both sides</td></tr>
                  <tr><td>Targets</td><td>headset · flat 2D path · web</td></tr>
                </tbody>
              </table>
            </div>
            <p class="small muted" style="margin-top:1rem">Change either side of that contract without the other and the self-test fails before anything ships. That is the whole point of writing it down.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec stagey" id="bridge">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">03 · In development</p>
            <h2>Alacrity Bridge</h2>
          </div>
          <p class="lede">The seam into professional post. The shot plan and the day’s record arriving in an editor as a real timeline, instead of being retyped by an assistant.</p>
        </div>
        <div class="grid-3">
          <article class="flat" data-flat data-tilt><h3>Open format, not a lock-in</h3><p>It speaks OpenTimelineIO, which Premiere Pro reads natively and DaVinci Resolve supports. We are not asking anyone to adopt a proprietary handoff.</p></article>
          <article class="flat" data-flat data-tilt><h3>The day carries through</h3><p>Circled takes, camera rolls, sound files and scene numbers travel from the set record into the assembly, with the reasons attached.</p></article>
          <article class="flat" data-flat data-tilt><h3>Status</h3><p>In development. The export and the data contract exist and are tested; the editor-side panel is the part still being built. <a href="research.html">What that means</a>.</p></article>
        </div>
      </div>
    </section>

    <section class="sec sec--deep" id="together">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">How they connect</p>
            <h2>One production, four places it lands.</h2>
          </div>
          <p class="lede">The connections are the product. Each arrow below is a place where, without them, someone would be retyping something that already exists.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>Author</time><h3>Pure Alacrity</h3><p>The script, the graph, the breakdown, the schedule and the budget, all reading one production.</p></article>
          <article><time>Compile</time><h3>The bundle</h3><p>One JSON file. Everything the runtime needs, and nothing it has to be told separately.</p></article>
          <article><time>Play</time><h3>Alacrity Player</h3><p>Unity reads the bundle and runs the story on a headset, on a flat screen, or on the web.</p></article>
        </div>
        <div class="stat-row" style="margin-top:2rem">
          <div><strong>Into post</strong><span>Alacrity Bridge carries the shot plan and the day’s record into Premiere Pro and DaVinci Resolve through OpenTimelineIO.</span></div>
          <div><strong>Onto the set</strong><span>A desktop machine hosts the production on set Wi-Fi; crew open it on their phones with a code. No install, no signal needed.</span></div>
        </div>
      </div>
    </section>

${band('Open it and put something real in it.', 'Pure Alacrity is free and needs no account. If you want to talk about the runtime, the bundle format or a pipeline of your own, write to us.', `<a class="btn btn--arc" href="${PURE}">Open Pure Alacrity</a> <a class="btn btn--ghost" href="contact.html?topic=Pure%20Alacrity">Ask a question</a>`)}`
};

/* ───────────────────────────────────────── research ───────────────────── */

const research = {
  slug: 'research.html',
  current: 'research',
  area: 'rnd',
  title: 'Research & Development — D.C Alacrity',
  description: 'What D.C Alacrity is investigating, what the current work establishes, and where the capability could go next — with available products, active development and longer-term ambition kept apart.',
  body: `${phero({
    eyebrow: 'Research & development',
    title: 'What we are investigating, and how far along it is.',
    lede: 'Three lanes, deliberately kept apart: what you can use today, what is being built now, and where we think this goes. Nothing in the third lane is a promise, and we would rather say so than let a roadmap read like a product.',
    aside: `<div class="flat" data-rise style="padding:1.75rem"><p class="eyebrow eyebrow--plain">How to read this page</p><p class="small">A claim on this site is only made in the lane it has earned. If something appears under <strong>Ambition</strong>, we have not built it, and no date is attached to it.</p></div>`
  })}

    <section class="sec stagey">
      <div class="wrap">
        <div class="grid-3">
          <article class="flat flat--pad-l" data-flat data-area="tech">
            <span class="pill pill--live">Available</span>
            <h3 style="margin-top:1rem">You can use this today</h3>
            <ul class="caps" style="grid-template-columns:1fr;margin-top:0.5rem">
              <li><div><h3>The production suite</h3><p>Pure Alacrity, free and public, running real productions since March 2026.</p></div></li>
              <li><div><h3>Story graph to runtime</h3><p>A branching script exported as one bundle and played by the Alacrity Player. This shipped in a released title.</p></div></li>
              <li><div><h3>Timeline export</h3><p>OpenTimelineIO out of the shot plan, so an assembly opens in a professional editor.</p></div></li>
              <li><div><h3>The set as its own server</h3><p>A desktop machine hosts the production on local Wi-Fi; crew join from their phones with a code, with no internet.</p></div></li>
            </ul>
          </article>

          <article class="flat flat--pad-l" data-flat data-area="rnd">
            <span class="pill pill--dev">In development</span>
            <h3 style="margin-top:1rem">Being built now</h3>
            <ul class="caps" style="grid-template-columns:1fr;margin-top:0.5rem">
              <li><div><h3>Alacrity Bridge</h3><p>The editor-side panel that puts the day’s record into Premiere Pro and DaVinci Resolve as a working timeline.</p></div></li>
              <li><div><h3>Shared productions</h3><p>More than one person in the same production, with conflicts surfaced rather than silently resolved. Losing someone’s work to a sync is worse than refusing to sync.</p></div></li>
              <li><div><h3>Mobile</h3><p>Companion apps for the parts of a production that belong on a phone, rather than a desktop screen shrunk down.</p></div></li>
              <li><div><h3>Prize Pool</h3><p>The next interactive title, and the test that the pipeline holds at a larger graph.</p></div></li>
            </ul>
          </article>

          <article class="flat flat--pad-l" data-flat data-area="co">
            <span class="pill pill--aim">Ambition</span>
            <h3 style="margin-top:1rem">Where we think this goes</h3>
            <ul class="caps" style="grid-template-columns:1fr;margin-top:0.5rem">
              <li><div><h3>Branching beyond entertainment</h3><p>Training, onboarding and assessment are branching experiences with consequences. They have the same authoring problem and none of the tools.</p></div></li>
              <li><div><h3>Experiences in physical places</h3><p>The same compiled graph, played in a venue rather than on a device someone owns. It is a different distribution problem, not a different engine.</p></div></li>
              <li><div><h3>The coordination layer on its own</h3><p>The scheduling, dependency and cost model underneath a production is not film-specific. Whether it becomes a product of its own is an open question, not a plan.</p></div></li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="sec sec--deep">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">What the current work establishes</p>
            <h2>Each finished thing answers a question that was open.</h2>
          </div>
          <p class="lede">Research here is not a lab. It is a series of productions and releases chosen so that finishing one settles something we could otherwise only argue about.</p>
        </div>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>The question</th><th>What settled it</th><th>What is now possible</th></tr></thead>
            <tbody>
              <tr><td>Can branching live action actually ship?</td><td>Right Here Right Now!, released free on Meta Horizon and SideQuest</td><td>A story graph can leave a writing tool and arrive on a device the audience already owns.</td></tr>
              <tr><td>Can one contract hold authoring and runtime together?</td><td>Schema 2.0.0, pinned on both sides and round-trip tested</td><td>Either half can change without the other silently breaking — the failure shows up before a release.</td></tr>
              <tr><td>Can a production run on software one person wrote?</td><td>Real productions since March 2026</td><td>The process is no longer dependent on the person who invented it.</td></tr>
              <tr><td>Can a crew use it on set with no signal?</td><td>A desktop machine hosting the production over local Wi-Fi</td><td>The day’s record is captured where the work happens, not reconstructed afterwards.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

${band('If this shape of problem is yours too.', 'Coordinating complicated work and then delivering it as something a person experiences is not only a film problem. If it is yours, we would like to hear the details.', '<a class="btn btn--area" href="contact.html?topic=Investor%20%2F%20partner">Start a conversation</a> <a class="btn btn--ghost" href="technology.html">See the technology</a>')}`
};

/* ────────────────────────────────────────── company ───────────────────── */

const about = {
  slug: 'about.html',
  current: 'about',
  area: 'co',
  title: 'Our Company & Vision — D.C Alacrity',
  description: 'D.C Alacrity is a technology and media company building the Experience Industry: original IP, software and interactive experiences, founded in North Carolina.',
  body: `${phero({
    eyebrow: 'Company',
    title: 'Why this company exists.',
    lede: 'D.C Alacrity is a technology and media company. We make original properties, we build the software that makes them possible, and we turn the way we work into systems other people can run. The films are the first application, not the boundary.',
    aside: `<div class="flat" data-rise style="padding:1.75rem"><p class="eyebrow eyebrow--plain">In one sentence</p><p class="lede" style="font-size:1.125rem">${SITE.descriptor}</p><p class="small muted" style="margin-top:0.75rem">Quote this one. The <a href="press.html">press kit</a> has the longer version.</p></div>`
  })}

    <section class="sec">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">The definition</p>
            <h2>The Experience Industry, in practical terms.</h2>
          </div>
          <p class="lede">The phrase is only useful if it says something specific, so here is what it means to us — the relationship between what people experience, the technology that delivers it, and the systems that let others create it.</p>
        </div>
        <div class="prose" data-rise style="max-width:72ch">
          <p>An experience is the thing a person actually meets: a film that responds to them, a game, a room they walk into, a lesson that changes depending on what they do. It reaches them through <strong>technology</strong> — a runtime, a headset, a browser, a venue — and it was made possible by a <strong>system</strong> that let a group of people build it together without losing the thread.</p>
          <p>Most companies pick one. A studio makes the experience and buys the technology. A software company sells the system and never makes anything with it. We think the interesting work is at the joins, because that is where things are lost: between what was written and what runs, between what was planned and what was shot, between the person who invented a process and everyone who has to follow it.</p>
          <p>So the company is organised around the joins. <a href="work/right-here-right-now.html"><em>Right Here Right Now!</em></a> is an experience. <a href="technology.html">Alacrity Player</a> is the technology that delivers it. <a href="${PURE}">Pure Alacrity</a> is the system that let it be made, and it is free so that other people can make their own.</p>
        </div>
      </div>
    </section>

    <section class="sec sec--deep stagey">
      <div class="wrap">
        <div class="sec-head sec-head--stack" data-rise>
          <p class="eyebrow">Principles</p>
          <h2>What guides where we expand.</h2>
        </div>
        <div class="grid-2">
          <article class="flat flat--pad-l" data-flat data-tilt><h3>Own what we make</h3><p>Original IP is the asset. A property earns on its own surface and is simultaneously the honest test of the technology under it — which is why we do not take a work-for-hire posture on our own slate.</p></article>
          <article class="flat flat--pad-l" data-flat data-tilt><h3>Build the tool when the tool does not exist</h3><p>We do not build software for its own sake. We build it when the thing we need to make cannot be made without it, which means every tool starts with a real production behind it.</p></article>
          <article class="flat flat--pad-l" data-flat data-tilt><h3>Ship the proof before the pitch</h3><p>A finished title on a store is a different kind of argument from a deck. Where a claim can be demonstrated, we demonstrate it and then say less about it.</p></article>
          <article class="flat flat--pad-l" data-flat data-tilt><h3>Make it repeatable without us</h3><p>A capability that only works when one particular person is in the room is not a capability. Everything here is pushed until somebody else can operate it.</p></article>
          <article class="flat flat--pad-l" data-flat data-tilt><h3>Underclaim</h3><p>Every number on this site is something that shipped or was measured. Where something is unfinished, the page says so in the same size type as everything else.</p></article>
          <article class="flat flat--pad-l" data-flat data-tilt><h3>Stay where we can afford to be ambitious</h3><p>North Carolina is not a fallback. Building here means a longer runway, a real crew base, and the freedom to finish things properly instead of raising in order to survive.</p></article>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">Founder</p>
            <h2>D.C. Agwu</h2>
          </div>
          <p class="lede">Founder. The company is a set of decisions, and these are the ones that made it this shape.</p>
        </div>
        <div class="split split--top">
          <div class="prose">
            <p><strong>Why build tools at all.</strong> Sidequest was shot over fourteen days with eighty-four cast and crew on roughly $1,400. An internship at an established Wilmington production house showed the same problems at a much larger budget. In both cases the failure was never craft — it was coordination, and the software available either assumed a studio’s back office or assumed a game, never a branching story that has to be scheduled and shot. So the tool got built. Development began in January 2026, and it has run real productions since March 2026. Pure Alacrity came out of Sidequest, not for it.</p>
            <p><strong>Why own the IP.</strong> Service work pays this month and compounds for the client. A property compounds for whoever owns it, and it doubles as the proving ground for the technology. Owning both halves is what makes the evidence real: the software is not a demo, it is what the films actually run on.</p>
            <p><strong>Why the technical and the creative sit together.</strong> The interesting problems are at the seam, and the seam is exactly what gets dropped when the two sides are different companies. Writing and directing a multipath story, then engineering the path from that story graph into Unity and onto a headset, is one job in practice even though the industry treats it as two.</p>
            <p><strong>What the security background is for.</strong> Training at the seam of film and cybersecurity, at UNCW and Wake Tech, is not a credential to display — it is why the product is local-first, why the media custody chain hashes what it moves, and why the architecture assumes the network is hostile and the device is the safe place. Those decisions were made early because of what that training makes visible.</p>
            <p><strong>What comes next.</strong> Formative work in NASA student programs, L’SPACE and NCAS, is where the habit came from: build the system, document it, hand it to someone else, and see whether it survives without you. That is the test every part of this company is being pushed toward.</p>
          </div>
          <div>
            <div class="visual" data-rise style="min-height:320px"><img src="assets/brand/hero-hand.jpg" alt="The D.C Alacrity brand image" width="1600" height="1600" loading="lazy" decoding="async"/></div>
            <div class="stat-row" style="margin-top:1rem;grid-template-columns:1fr">
              <div><strong>On the record</strong><span>Director, producer and systems lead on <em>Right Here Right Now!</em>. Creator of Sidequest. Author of Pure Alacrity.</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">Credits</p>
            <h2>Selected principal credits.</h2>
          </div>
          <p class="lede">Key roles from public, shipped or releasing titles. Season 1 of Sidequest alone credited 84 cast and crew — the full call sheets are longer than this page.</p>
        </div>

        <h3 class="t-teal" style="color:var(--area);margin:2rem 0 0.75rem">Right Here Right Now!</h3>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>Name</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>D.C. Agwu</td><td>Director / Producer / Systems</td></tr>
              <tr><td>Tommy Bowers</td><td>Co-director / Writer</td></tr>
              <tr><td>Luke Hughes</td><td>Lucas</td></tr>
              <tr><td>Jayna Kolbicka</td><td>Janaye</td></tr>
              <tr><td>Jack LeMasters</td><td>Art Director</td></tr>
              <tr><td>Rogers Ferguson</td><td>Grip &amp; Electric</td></tr>
              <tr><td>Dalton Slade</td><td>Grip &amp; Electric</td></tr>
              <tr><td>Martin McGowan Films</td><td>BTS Cinematography</td></tr>
              <tr><td>Kian Miley</td><td>Unity / VR Integration</td></tr>
            </tbody>
          </table>
        </div>

        <h3 class="t-sq" style="color:var(--area);margin:2.5rem 0 0.75rem">Sidequest — ABC Squad (principal cast)</h3>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>Name</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Garrett Sessoms</td><td>Adam Dawnbringer</td></tr>
              <tr><td>Isaac Corrigan</td><td>Brock Turismo</td></tr>
              <tr><td>Collin Davis</td><td>Chester Wiseman</td></tr>
              <tr><td>Noah Piechoski</td><td>Diego Cicatriz-Olvidado</td></tr>
              <tr><td>Andrew Overby III</td><td>Eric McSharry</td></tr>
              <tr><td>Venus Parker</td><td>Felicia Wall</td></tr>
              <tr><td>Emily Kahl</td><td>Gemma Gazelle</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

${band('Work with the company, not just the studio.', 'Partnership, investment, press or a problem that looks like ours — the same form reaches us either way.', '<a class="btn btn--area" href="contact.html">Get in touch</a> <a class="btn btn--ghost" href="research.html">What we are investigating</a>')}`
};

/* ──────────────────────────────────────────── press ───────────────────── */

const press = {
  slug: 'press.html',
  current: null,
  area: 'co',
  title: 'Press Kit — D.C Alacrity',
  description: 'Press kit for D.C Alacrity: company boilerplate, how to refer to the company and its products, brand assets, project one-liners and media contact.',
  body: `${phero({
    eyebrow: 'Press',
    title: 'Kit &amp; boilerplate.',
    lede: 'Everything here is written to be reused directly. If you take one thing, take the boilerplate below — it is the description we are asking to be introduced by.',
    actions: `<a class="btn btn--area" href="contact.html?topic=Press%20%2F%20media">Press inquiry</a> <a class="btn btn--ghost" href="mailto:${SITE.email}">${SITE.email}</a>`
  })}

    <section class="sec">
      <div class="wrap">
        <div class="split split--top">
          <div>
            <p class="eyebrow">Boilerplate</p>
            <div class="flat flat--pad-l" data-flat data-rise>
              <p class="lede" style="color:var(--ink)"><strong>D.C Alacrity</strong> is a technology and media company building the Experience Industry. It develops original intellectual property, software and interactive experiences — including Pure Alacrity, a free production suite; Alacrity Player, the Unity runtime behind North Carolina’s first interactive live-action VR film; and a slate of owned properties across series, interactive and documentary. Founded in North Carolina, the company’s first products and productions are the foundation for a broader mission: technologies and businesses that change how people create, work, learn and connect.</p>
            </div>
            <p class="eyebrow" style="margin-top:2rem">Short version</p>
            <p class="prose">A technology and media company building the Experience Industry, founded in North Carolina.</p>
            <p class="eyebrow" style="margin-top:2rem">Media contact</p>
            <p class="contact-email"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
          </div>
          <div class="visual" data-rise><img src="assets/brand/hero-hand.jpg" alt="The D.C Alacrity brand image — a hand raised to a bright sky, with the electric arrow rising from it" width="1600" height="1600" loading="lazy" decoding="async"/></div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">Naming</p>
            <h2>How to refer to us.</h2>
          </div>
          <p class="lede">Three names do three different jobs, and they are often confused. This table is the whole distinction.</p>
        </div>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>Name</th><th>What it is</th><th>Use it for</th></tr></thead>
            <tbody>
              <tr><td>D.C Alacrity</td><td>The company — a technology and media company</td><td>Anything about the business: products, funding, hiring, strategy, the slate as a whole.</td></tr>
              <tr><td>Pure Alacrity</td><td>The production suite, and the banner the productions present under</td><td>The software itself, and “Powered by Pure Alacrity” on a title card.</td></tr>
              <tr><td>D.C Alacrity Productions</td><td>A production credit</td><td>On-screen credits and call sheets only — not as a description of the company.</td></tr>
            </tbody>
          </table>
        </div>
        <p class="small muted" style="margin-top:1rem">Please avoid “production company”, “studio” or “media studio” as descriptions of D.C Alacrity. They describe one of the things it does.</p>
        <div class="grid-4" style="margin-top:2rem" data-rise>
          <div class="flat" style="padding:1.1rem"><div style="height:44px;border-radius:8px;background:#061018;border:1px solid var(--line-2)"></div><p class="mono" style="margin-top:.6rem">#061018</p><p class="small muted">Ground</p></div>
          <div class="flat" style="padding:1.1rem"><div style="height:44px;border-radius:8px;background:#00c2ff"></div><p class="mono" style="margin-top:.6rem">#00C2FF</p><p class="small muted">Cyan — the bolt</p></div>
          <div class="flat" style="padding:1.1rem"><div style="height:44px;border-radius:8px;background:#8143ff"></div><p class="mono" style="margin-top:.6rem">#8143FF</p><p class="small muted">Violet — the tail</p></div>
          <div class="flat" style="padding:1.1rem"><div style="height:44px;border-radius:8px;background:#e7faff"></div><p class="mono" style="margin-top:.6rem">#E7FAFF</p><p class="small muted">White-hot — the tip</p></div>
        </div>
      </div>
    </section>

    <section class="sec stagey">
      <div class="wrap">
        <div class="sec-head sec-head--stack" data-rise>
          <p class="eyebrow">Assets</p>
          <h2>Download from this site.</h2>
        </div>
        <div class="service-list">
          <a class="service-item" href="assets/brand/lockup.png" download><span class="num">01</span><div><h3>Primary lockup</h3><p>Mark and wordmark, white on transparent — for dark backgrounds.</p></div><span class="meta">PNG · alpha</span></a>
          <a class="service-item" href="assets/brand/mark.png" download><span class="num">02</span><div><h3>The mark</h3><p>The electric arrow on its own, transparent.</p></div><span class="meta">PNG · alpha</span></a>
          <a class="service-item" href="assets/brand/wordmark.png" download><span class="num">03</span><div><h3>Wordmark</h3><p>D.C Alacrity in the brand face, white on transparent.</p></div><span class="meta">PNG · alpha</span></a>
          <a class="service-item" href="assets/brand/hero-hand.jpg" download><span class="num">04</span><div><h3>Brand image</h3><p>The hand and the sky — the company's hero image, 1600px.</p></div><span class="meta">JPG</span></a>
          <a class="service-item" href="assets/brand/apple-touch-icon.png" download><span class="num">05</span><div><h3>Icon</h3><p>The mark in a circle on the brand ground, for avatars.</p></div><span class="meta">PNG</span></a>
          <a class="service-item" href="assets/img/sidequest-logo.png" download><span class="num">06</span><div><h3> wordmark</h3><p>Neon pink Sidequest logo.</p></div><span class="meta">PNG</span></a>
          <a class="service-item" href="assets/img/squad.jpg" download><span class="num">07</span><div><h3>ABC Squad still</h3><p>Production still for Sidequest coverage.</p></div><span class="meta">JPG</span></a>
          <a class="service-item" href="assets/screens/storymap.jpg" download><span class="num">08</span><div><h3>Pure Alacrity — Story Map</h3><p>A real screen from the current build.</p></div><span class="meta">JPG</span></a>
        </div>
      </div>
    </section>

    <section class="sec sec--deep">
      <div class="wrap">
        <div class="sec-head sec-head--stack" data-rise>
          <p class="eyebrow">One-liners</p>
          <h2>Per product and property.</h2>
        </div>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>Subject</th><th>Line</th></tr></thead>
            <tbody>
              <tr><td>Pure Alacrity</td><td>A free production suite — script, breakdown, schedule, set and delivery in one place, local-first and offline-capable.</td></tr>
              <tr><td>Alacrity Player</td><td>A Unity runtime that plays a branching story straight from the file it was authored into.</td></tr>
              <tr><td>Alacrity Bridge</td><td>In development: the shot plan and the day’s record arriving in Premiere Pro and DaVinci Resolve as a real timeline.</td></tr>
              <tr><td>Right Here Right Now!</td><td>North Carolina’s first interactive live-action VR film — free on Meta Horizon and SideQuest.</td></tr>
              <tr><td>Sidequest</td><td>A freshly fired grocery clerk reunites his crew of small-time crooks to get rich on a lawless dark-web gig economy — never knowing whose game it is. Crime dramedy; October 2026 release aim.</td></tr>
              <tr><td>Prize Pool</td><td>The campus assassin pot hits $1,000,000. You are the experiment. Principal photography Fall 2026.</td></tr>
              <tr><td>Welcome to Wilmy</td><td>Cape Fear surf and beach culture — destination storytelling shot under a City of Wilmington permit.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

${band('Ask for anything that is missing.', 'Interviews, additional assets, embargoed material or a fact check — write and we will answer.', `<a class="btn btn--area" href="contact.html?topic=Press%20%2F%20media">Press inquiry</a> <a class="btn btn--ghost" href="about.html">Company &amp; vision</a>`)}`
};

export default [home, technology, research, about, press];
