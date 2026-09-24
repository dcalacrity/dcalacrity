/* The company pages. One idea per section; copy as annotation.
   Copy rules (DESIGN.md §5 and the build's checks): the company is a
   technology and media company; Pure Alacrity was built out of Sidequest, not
   for it; no private figures. */

import { SITE, close, phero, facts, plate, fill } from './shell.mjs';

const PURE = SITE.app;

/* ─────────────────────────────────────────── home ─────────────────────── */

/* The questions on the home page. Every answer is a sentence the site already
   stands behind somewhere else — nothing here is written for the FAQ alone. */
const FAQ = [
  ['company', 'What is D.C Alacrity?', 'A technology and media company building the Experience Industry. It makes original properties, builds the software that makes them possible, and turns the way it works into systems other people can run. Founded in North Carolina.'],
  ['software', 'Is Pure Alacrity really free?', `Yes. It is live at <a href="${PURE}">dcalacrity.com/pure</a>, needs no account and works with no internet. It has run real productions since March 2026.`],
  ['software', 'Where did Pure Alacrity come from?', 'Out of Sidequest, not for it. The season and an internship at an established Wilmington production house made the broken workflow obvious, and development began in January 2026. The season itself was not made on it.'],
  ['software', 'Can I use the Alacrity Player in my own project?', 'The Player reads the bundle a story graph compiles to, with the schema pinned on both sides. For the runtime, the bundle format or a pipeline of your own, <a href="contact.html?topic=Technology%20%2F%20licensing">write to us</a>.'],
  ['work', 'Where can I watch Right Here Right Now!?', 'It is free on Meta Horizon and SideQuest — North Carolina’s first interactive live-action VR film, 16 scene nodes across 22 paths.'],
  ['work', 'What is Prize Pool VR?', 'The next interactive title: a branching live-action VR180 social thriller. 41 unbroken takes, nine endings, 5,535 routes and 12½–17½ minutes a viewing. The script, graph, board and budget are done; photography is next. <a href="work/prize-pool.html">Read about it</a>.'],
  ['services', 'Do you take client work?', 'Yes — shoots, edits, colour, social and destination films, at <a href="services.html">published rates</a> for North Carolina businesses. We reply with a simple estimate within two business days.'],
  ['company', 'How do I reach you?', `One form, routed by topic, on the <a href="contact.html">contact page</a> — or write to <a href="mailto:${SITE.email}">${SITE.email}</a> directly.`]
];
const CATS = [['all', 'All'], ['company', 'Company'], ['software', 'Software'], ['work', 'Experiences'], ['services', 'Services']];

/* The five stages of the capability, in order — this is a real sequence, so
   it is numbered. Each carries the dot art of what that stage handles. */
const STAGES = [
  ['author', 'Author', 'The story graph', 'graph', 'Scenes, choices and endings, written as a graph you can read. The interactive format carries pathway and choice lines beside the standard set, so the same file is a screenplay a person reads and a map the engine walks.'],
  ['produce', 'Produce', 'Breakdown &amp; schedule', 'board', 'Every branch costed and scheduled like any film. In live action a choice the audience makes is a scene the crew has to shoot both sides of, so the graph and the stripboard are the same object.'],
  ['compile', 'Compile', 'One bundle', 'bundle', 'A single file. Schema 2.0.0, pinned on both sides and round-trip tested, so either half can change without the other silently breaking.'],
  ['run', 'Run', 'Alacrity Player', 'route', 'Unity reads the bundle and plays it. It is the runtime inside Right Here Right Now!, and what Prize Pool VR is being built against.'],
  ['deliver', 'Deliver', 'Wherever people are', 'rings', 'Headset, a flat path, the web — the same graph. Right Here Right Now! is free on Meta Horizon and SideQuest.']
];

const home = {
  slug: 'index.html',
  current: null,
  title: 'D.C Alacrity — Technology, Media & the Experience Industry',
  description: 'D.C Alacrity is a technology and media company building original IP, software and interactive experiences, with a mission to expand across industries.',
  ogDescription: 'A technology and media company building original IP, software and interactive experiences. Founded in North Carolina.',
  body: `    <section class="hero" aria-labelledby="hero-title">
      <div class="stage">
        ${plate('graph', 'hero')}
        <div class="wrap plate__caps">
          <p class="plate__cap">Technology and media for the Experience Industry</p>
          <a class="plate__status" href="work/prize-pool.html"><span class="dot" aria-hidden="true"></span><span><small>Now in pre-production</small><b>Prize Pool VR</b></span></a>
        </div>
      </div>
      <div class="panel paper">
        <div class="wrap panel__grid">
          <div>
            <p class="eyebrow">D.C Alacrity · North Carolina</p>
            <h1 id="hero-title">Building the Experience Industry.</h1>
          </div>
          <div class="panel__side">
            <p class="lede">A technology and media company developing original IP, software and interactive experiences — the foundation for a broader mission across industries.</p>
            <div class="btn-row">
              <a class="btn" href="technology.html">See the technology</a>
              <a class="link" href="work/index.html">See the work</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="technology">
      <div class="wrap">
        <div class="head head--center" data-rise>
          <p class="eyebrow">Technology</p>
          <h2>Three products. One contract between them.</h2>
          <p class="lede">Software is the company’s second product line. Each one already has something finished attached to it.</p>
        </div>
        <div class="cards">
          <a class="card" data-rise href="${PURE}">
            <div class="card__art" data-art="board"><span class="pill pill--on card__tag">Live · free</span></div>
            <div class="card__body">
              <h3>Pure Alacrity</h3>
              <p>The production suite — script, breakdown, schedule, budget, set, post and delivery, reading one production. Works offline.</p>
              <p class="card__more">Open the suite</p>
            </div>
          </a>
          <a class="card" data-rise href="technology.html#player">
            <div class="card__art" data-art="graph"><span class="pill pill--on card__tag">Shipped</span></div>
            <div class="card__body">
              <h3>Alacrity Player</h3>
              <p>A Unity runtime that plays a branching story straight from the file it was authored into. Shipped in a released title.</p>
              <p class="card__more">How it plays</p>
            </div>
          </a>
          <a class="card" data-rise href="technology.html#bridge">
            <div class="card__art" data-art="timeline"><span class="pill card__tag">In development</span></div>
            <div class="card__body">
              <h3>Alacrity Bridge</h3>
              <p>The seam into professional post — the shot plan and the day’s record arriving as a real timeline, through OpenTimelineIO.</p>
              <p class="card__more">Where it stands</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="sec" id="compiler">
      <div class="wrap">
        <div class="stages" data-stages data-rise>
          <div class="stages__intro">
            <p class="eyebrow">The capability</p>
            <h2>A written story becomes something people can play.</h2>
            <p class="lede">Game engines have done the second half for years. None of them know what a call sheet is — in live action a branch is a shooting day, not a line of script.</p>
            <a class="btn btn--quiet" href="technology.html#together">How the three fit together</a>
            <p class="stages__count"><span>Five stages</span><span data-stage-count>1/5</span></p>
            <div class="stages__list" role="tablist" aria-label="The five stages" aria-orientation="vertical">
${STAGES.map((s, i) => `              <button class="stage-tab" type="button" role="tab" id="st-${s[0]}" aria-controls="sp-${s[0]}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><span class="stage-tab__ico" aria-hidden="true"></span><span class="stage-tab__name">${s[1]}<small>${s[2]}</small></span></button>`).join('\n')}
            </div>
          </div>
          <div class="stage-panels">
${STAGES.map((s, i) => `            <div class="stage-panel${i === 0 ? ' is-on' : ''}" role="tabpanel" id="sp-${s[0]}" aria-labelledby="st-${s[0]}">
              <div class="stage-panel__art" data-art="${s[3]}"></div>
              <div class="stage-panel__body">
                <p class="stage-panel__k">${i + 1} · ${s[1]}</p>
                <h3>${s[2]}</h3>
                <p>${s[4]}</p>
              </div>
            </div>`).join('\n')}
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="work">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Media &amp; experiences</p><h2>Properties we own.</h2></div>
          <p class="lede">Original work, not client work. Each is an application of the capabilities above, on a real deadline with a real crew.</p>
        </div>
        <div class="props">
          <a class="prop" data-rise href="work/sidequest.html">
            <div class="visual"><img src="assets/img/squad.jpg" alt="The ABC Squad cast of Sidequest" width="1800" height="1012" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Sidequest</h3><span>Series · in post</span></div>
            <p>Adam Dawnbringer, 21 and freshly fired, treats life like a video game — and gets his crew back together.</p>
          </a>
          <a class="prop" data-rise href="work/right-here-right-now.html">
            <div class="visual"><img src="assets/img/rhrn-card.jpg" alt="Right Here Right Now! — Lucas surrounded by the film’s branching scenes" width="1600" height="1000" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Right Here Right Now!</h3><span>Interactive VR · released</span></div>
            <p>North Carolina’s first interactive live-action VR film. Free on Meta Horizon and SideQuest.</p>
          </a>
          <a class="prop" data-rise href="work/prize-pool.html">
            <div class="visual"><img src="assets/img/prize-pool-placeholder.jpg" alt="Key art for Prize Pool VR" width="1536" height="1024" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Prize Pool VR</h3><span>Branching VR180 · pre-production</span></div>
            <p>A campus water-gun game gets a million-dollar prize. Nine endings; one of them has to fire.</p>
          </a>
          <a class="prop" data-rise href="work/welcome-to-wilmy.html">
            <div class="visual"><img src="assets/img/welcome-to-wilmy.jpg" alt="An interview on the Cape Fear coast" width="1024" height="576" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Welcome to Wilmy</h3><span>Documentary · in production</span></div>
            <p>Surf and beach culture on the Cape Fear coast, under a City of Wilmington permit.</p>
          </a>
        </div>
      </div>
    </section>

    <section class="sec sec--paper paper" id="definition">
      <div class="wrap" data-rise>
        <p class="eyebrow">The Experience Industry</p>
        <p class="statement" data-fill>${fill([['What a person meets.', true], ['The technology that delivers it. The systems that let others build the next one.']])}</p>
        <p class="lede">We work on all three, and each already has something finished attached to it: a released interactive film, the runtime that plays it, and the production suite it was made with — free for anyone to use.</p>
        <dl class="proof">
          <div><dt>Released</dt><dd><strong>Right Here Right Now!</strong>Free on Meta Horizon and SideQuest.</dd></div>
          <div><dt>Pinned</dt><dd><strong>Schema 2.0.0</strong>One contract between the suite and the runtime, round-trip tested.</dd></div>
          <div><dt>Running</dt><dd><strong>Since March 2026</strong>Real productions on Pure Alacrity.</dd></div>
        </dl>
      </div>
    </section>

    <section class="sec" id="company">
      <div class="wrap">
        <div class="beside beside--flip" data-rise>
          <div class="visual visual--tone" style="aspect-ratio:4/3"><img src="assets/brand/hero-hand.jpg" alt="The D.C Alacrity brand image — a hand reaching into the sky" width="1600" height="1600" loading="lazy" decoding="async"/></div>
          <div>
            <p class="eyebrow">Company</p>
            <h2>Why the first products support a broader future.</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>Every process here started inside one person’s head and ended as something a team can operate. That is the move from individual ability to an organisation — and it is not specific to film. Any field where complicated work has to be coordinated, then delivered as something a person experiences, is the same shape of problem.</p>
            </div>
            <p style="margin-top:1.5rem"><a class="link" href="about.html">The company and its principles</a></p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="questions">
      <div class="wrap">
        <div class="faq" data-faq data-rise>
          <div class="faq__intro">
            <p class="eyebrow">Questions</p>
            <h2>Asked, and answered plainly.</h2>
            <a class="btn btn--quiet" href="contact.html">Ask something else</a>
          </div>
          <div>
            <div class="faq__chips" role="group" aria-label="Filter questions">
${CATS.map((c, i) => `              <button class="chip" type="button" data-cat="${c[0]}" aria-pressed="${i === 0}">${c[1]}</button>`).join('\n')}
            </div>
            <div class="faq__list">
${FAQ.map((q) => `              <details class="qa" data-cat="${q[0]}"><summary>${q[1]}</summary><div class="qa__a"><p>${q[2]}</p></div></details>`).join('\n')}
            </div>
          </div>
        </div>
      </div>
    </section>

${close('Watch, use, hire or partner.', 'Four original properties, a free production suite, a commercial unit at published rates, and a door open to partners. One form, routed by topic.', `<a class="btn" href="contact.html">Start a conversation</a> <a class="link" href="services.html">See the rates</a>`)}`
};

/* ─────────────────────────────────────── technology ───────────────────── */

const technology = {
  slug: 'technology.html',
  current: 'technology',
  title: 'Technology — Pure Alacrity, Alacrity Player, Alacrity Bridge · D.C Alacrity',
  description: 'The software D.C Alacrity builds: Pure Alacrity, the free production suite; Alacrity Player, the Unity runtime that plays a branching story; and Alacrity Bridge, the seam into professional post.',
  body: `${phero({ plate: 'graph', eyebrow: 'Technology', title: 'Three products. One contract between them.', lede: 'Pure Alacrity is live and free. Alacrity Player shipped inside a released VR title. Alacrity Bridge is in development. They share a single JSON contract, which is what makes them a stack rather than three tools.', actions: `<a class="btn" href="${PURE}">Open Pure Alacrity</a> <a class="link" href="${PURE}/demo.html">Watch the demo</a>` })}

    <section class="sec" id="pure">
      <div class="wrap">
        <div class="beside" data-rise>
          <div>
            <p class="eyebrow">01 · Available</p>
            <h2>Pure Alacrity</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>An independent production runs on six subscriptions and a folder of spreadsheets that disagree with each other. Pure Alacrity reads one production instead: the script, the breakdown, the schedule, the budget, the day on set, post and delivery, with the same numbers in all of them.</p>
              <p>It was built out of Sidequest, not for it — the season and an internship at an established Wilmington production house made the broken workflow obvious. Development began in January 2026; it has run real productions since March 2026. Free, no account needed, works with no internet.</p>
            </div>
          </div>
          <div class="screen"><img src="assets/screens/script-editor.jpg" alt="Pure Alacrity’s Script Studio — a formatted screenplay page" width="1440" height="900" loading="lazy" decoding="async"/></div>
        </div>
      </div>
    </section>

    <section class="sec" id="player">
      <div class="wrap">
        <div class="beside beside--flip" data-rise>
          <div class="screen"><img src="assets/screens/storymap.jpg" alt="Pure Alacrity’s Story Map with a branching story as a node graph" width="1440" height="900" loading="lazy" decoding="async"/></div>
          <div>
            <p class="eyebrow">02 · Shipped</p>
            <h2>Alacrity Player</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>Authoring a branching story and running one are normally two worlds joined by hand. When Netflix made <em>Bandersnatch</em>, the tooling ended at a flowchart exported to a spreadsheet that engineers implemented by hand.</p>
              <p>Here the graph written in Pure Alacrity is exported as one bundle and the Player reads that file directly. The schema is pinned on both sides and a self-test walks a bundle out and back. It is the runtime inside <a href="work/right-here-right-now.html">Right Here Right Now!</a> and what <a href="work/prize-pool.html">Prize Pool VR</a> is being built against.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="bridge">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">03 · In development</p><h2>Alacrity Bridge</h2></div>
          <p class="lede">The seam into professional post: the shot plan and the day’s record arriving in Premiere Pro and DaVinci Resolve as a real timeline, through OpenTimelineIO — an open format, not a lock-in. The export and the data contract exist and are tested; the editor-side panel is still being built.</p>
        </div>
      </div>
    </section>

    <section class="sec" id="together">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">How they connect</p><h2>One production, four places it lands.</h2></div>
          <p class="lede">The connections are the product. Each stop below is a place where, without them, someone would be retyping something that already exists.</p>
        </div>
        <div class="path" data-rise>
          <div><p class="k">Author</p><h3>Pure Alacrity</h3><p>Script, graph, breakdown, schedule, budget.</p></div>
          <div><p class="k">Compile</p><h3>The bundle</h3><p>Everything the runtime needs in one file.</p></div>
          <div><p class="k">Play</p><h3>Alacrity Player</h3><p>Headset, flat screen, or the web.</p></div>
          <div><p class="k">Post</p><h3>Alacrity Bridge</h3><p>Into Premiere Pro and Resolve as a timeline.</p></div>
          <div><p class="k">Set</p><h3>Live production</h3><p>A desktop hosts it on set Wi-Fi; crew join by code.</p></div>
        </div>
      </div>
    </section>

${close('Open it and put something real in it.', 'Pure Alacrity is free and needs no account. For the runtime, the bundle format or a pipeline of your own, write to us.', `<a class="btn" href="${PURE}">Open Pure Alacrity</a> <a class="link" href="contact.html?topic=Pure%20Alacrity">Ask a question</a>`)}`
};

/* ───────────────────────────────────────── research ───────────────────── */

const research = {
  slug: 'research.html',
  current: 'research',
  title: 'Research & Development — D.C Alacrity',
  description: 'What D.C Alacrity is investigating, what the current work establishes, and where the capability could go next — with available products, active development and longer-term ambition kept apart.',
  body: `${phero({ plate: 'assets/brand/clouds.jpg', eyebrow: 'Research & development', title: 'What we are investigating, and how far along it is.', lede: 'Three lanes, kept apart: what you can use today, what is being built now, and where we think this goes. Nothing in the third lane is a promise.' })}

    <section class="sec">
      <div class="wrap">
        <div class="grid-3" data-rise>
          <div>
            <span class="pill pill--on">Available</span>
            <div class="lines" style="margin-top:1.5rem">
              <div><h3>The production suite</h3><p>Pure Alacrity, free and public, running real productions since March 2026.</p></div>
              <div><h3>Story graph to runtime</h3><p>A branching script exported as one bundle and played by the Alacrity Player. Shipped in a released title.</p></div>
              <div><h3>Timeline export</h3><p>OpenTimelineIO out of the shot plan, so an assembly opens in a professional editor.</p></div>
              <div><h3>The set as its own server</h3><p>A desktop machine hosts the production on local Wi-Fi; crew join from their phones with a code.</p></div>
            </div>
          </div>
          <div>
            <span class="pill">In development</span>
            <div class="lines" style="margin-top:1.5rem">
              <div><h3>Alacrity Bridge</h3><p>The editor-side panel that puts the day’s record into Premiere Pro and DaVinci Resolve.</p></div>
              <div><h3>Shared productions</h3><p>More than one person in the same production, with conflicts surfaced rather than silently resolved.</p></div>
              <div><h3>Mobile</h3><p>Companion apps for the parts of a production that belong on a phone.</p></div>
              <div><h3>Prize Pool VR</h3><p>The next interactive title, and the test that the pipeline holds at a larger graph: 41 scenes, 19 choice points and eight typed facts the story carries between them.</p></div>
            </div>
          </div>
          <div>
            <span class="pill">Ambition</span>
            <div class="lines" style="margin-top:1.5rem">
              <div><h3>Branching beyond entertainment</h3><p>Training, onboarding and assessment are branching experiences with consequences — the same authoring problem, none of the tools.</p></div>
              <div><h3>Experiences in physical places</h3><p>The same compiled graph, played in a venue rather than on a device someone owns.</p></div>
              <div><h3>The coordination layer on its own</h3><p>The scheduling, dependency and cost model under a production is not film-specific. An open question, not a plan.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">What the current work establishes</p><h2>Each finished thing answers a question that was open.</h2></div>
          <p class="lede">Research here is not a lab. It is a series of productions and releases chosen so that finishing one settles something we could otherwise only argue about.</p>
        </div>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>The question</th><th>What settled it</th><th>What is now possible</th></tr></thead>
            <tbody>
              <tr><td>Can branching live action ship?</td><td>Right Here Right Now!, released free on Meta Horizon and SideQuest</td><td>A story graph can leave a writing tool and arrive on a device the audience owns.</td></tr>
              <tr><td>Can one contract hold both halves?</td><td>Schema 2.0.0, pinned on both sides and round-trip tested</td><td>Either half can change without the other silently breaking.</td></tr>
              <tr><td>Can a production run on the software?</td><td>Real productions since March 2026</td><td>The process no longer depends on the person who invented it.</td></tr>
              <tr><td>Can a crew use it with no signal?</td><td>A desktop machine hosting the production over local Wi-Fi</td><td>The day’s record is captured where the work happens.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

${close('If this shape of problem is yours too.', 'Coordinating complicated work and delivering it as something a person experiences is not only a film problem.', '<a class="btn" href="contact.html?topic=Investor%20%2F%20partner">Start a conversation</a> <a class="link" href="technology.html">See the technology</a>')}`
};

/* ────────────────────────────────────────── company ───────────────────── */

const about = {
  slug: 'about.html',
  current: 'about',
  title: 'Our Company & Vision — D.C Alacrity',
  description: 'D.C Alacrity is a technology and media company building the Experience Industry: original IP, software and interactive experiences, founded in North Carolina.',
  body: `${phero({ plate: 'assets/brand/hero-hand.jpg', eyebrow: 'Company', title: 'Why this company exists.', lede: 'D.C Alacrity is a technology and media company. We make original properties, we build the software that makes them possible, and we turn the way we work into systems other people can run. The films are the first application, not the boundary.' })}

    <section class="sec">
      <div class="wrap" data-rise>
        <p class="eyebrow">The definition</p>
        <p class="statement">An experience is <b>what a person meets</b>. It reaches them through technology. It was made possible by a system that let people build it together.</p>
        <div class="prose" style="margin-top:2rem">
          <p>Most companies pick one. A studio makes the experience and buys the technology. A software company sells the system and never makes anything with it. The interesting work is at the joins — between what was written and what runs, between what was planned and what was shot, between the person who invented a process and everyone who has to follow it. So the company is organised around the joins: <a href="work/right-here-right-now.html">Right Here Right Now!</a> is an experience, <a href="technology.html">Alacrity Player</a> delivers it, and <a href="${PURE}">Pure Alacrity</a> is the system it was made with — free, so that other people can make their own.</p>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="head" data-rise><div><p class="eyebrow">Principles</p><h2>What guides where we expand.</h2></div></div>
        <div class="grid-3" data-rise>
          <div class="lines">
            <div><h3>Own what we make</h3><p>A property earns on its own surface and is the honest test of the technology under it.</p></div>
            <div><h3>Build the tool when it does not exist</h3><p>Every tool here started with a real production behind it.</p></div>
          </div>
          <div class="lines">
            <div><h3>Ship the proof before the pitch</h3><p>A finished title on a store is a different argument from a deck.</p></div>
            <div><h3>Make it repeatable without us</h3><p>A capability that only works with one person in the room is not a capability.</p></div>
          </div>
          <div class="lines">
            <div><h3>Underclaim</h3><p>Every number on this site shipped or was measured. Where something is unfinished, the page says so.</p></div>
            <div><h3>Stay where we can afford to be ambitious</h3><p>North Carolina is not a fallback: a longer runway, a real crew base, and the freedom to finish things properly.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="beside" data-rise>
          <div>
            <p class="eyebrow">Founder</p>
            <h2>D.C. Agwu</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p><strong>Why build tools.</strong> Sidequest was shot with eighty-four cast and crew on a microbudget; an internship at an established Wilmington production house showed the same problems at a much larger one. The failure was never craft — it was coordination, and no software assumed a branching story that has to be scheduled and shot. So the tool got built. Pure Alacrity came out of Sidequest, not for it.</p>
              <p><strong>Why own the IP.</strong> Service work compounds for the client. A property compounds for whoever owns it, and doubles as the proving ground for the technology.</p>
              <p><strong>Why the technical and the creative sit together.</strong> Writing and directing a multipath story, then engineering the path from that story graph into Unity and onto a headset, is one job in practice even though the industry treats it as two. Training at the seam of film and cybersecurity, at UNCW and Wake Tech, is why the product is local-first and why its media custody chain hashes what it moves. NASA student programmes — L’SPACE, NCAS — are where the habit came from: build the system, document it, hand it to someone else, and see whether it survives without you.</p>
            </div>
          </div>
          <div class="visual" style="aspect-ratio:1"><img src="assets/brand/hero-hand.jpg" alt="The D.C Alacrity brand image" width="1600" height="1600" loading="lazy" decoding="async"/></div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="head" data-rise><div><p class="eyebrow">Credits</p><h2>Selected principal credits.</h2></div><p class="lede">Key roles from public, shipped or releasing titles. Season 1 of Sidequest alone credited 84 cast and crew.</p></div>
        <div class="grid-2" data-rise>
          <div>
            <h3 style="margin-bottom:.75rem">Right Here Right Now!</h3>
            <div class="table-wrap"><table class="data"><tbody>
              <tr><td>D.C. Agwu</td><td>Director / Producer / Systems</td></tr>
              <tr><td>Tommy Bowers</td><td>Co-director / Writer</td></tr>
              <tr><td>Luke Hughes</td><td>Lucas</td></tr>
              <tr><td>Jayna Kolbicka</td><td>Janaye</td></tr>
              <tr><td>Jack LeMasters</td><td>Art Director</td></tr>
              <tr><td>Rogers Ferguson</td><td>Grip &amp; Electric</td></tr>
              <tr><td>Dalton Slade</td><td>Grip &amp; Electric</td></tr>
              <tr><td>Martin McGowan Films</td><td>BTS Cinematography</td></tr>
              <tr><td>Kian Miley</td><td>Unity / VR Integration</td></tr>
            </tbody></table></div>
          </div>
          <div>
            <h3 style="margin-bottom:.75rem">Sidequest — ABC Squad</h3>
            <div class="table-wrap"><table class="data"><tbody>
              <tr><td>Garrett Sessoms</td><td>Adam Dawnbringer</td></tr>
              <tr><td>Isaac Corrigan</td><td>Brock Turismo</td></tr>
              <tr><td>Collin Davis</td><td>Chester Wiseman</td></tr>
              <tr><td>Noah Piechoski</td><td>Diego Cicatriz-Olvidado</td></tr>
              <tr><td>Andrew Overby III</td><td>Eric McSharry</td></tr>
              <tr><td>Venus Parker</td><td>Felicia Wall</td></tr>
              <tr><td>Emily Kahl</td><td>Gemma Gazelle</td></tr>
            </tbody></table></div>
          </div>
        </div>
      </div>
    </section>

${close('Work with the company, not just the studio.', 'Partnership, investment, press, or a problem that looks like ours.', '<a class="btn" href="contact.html">Get in touch</a> <a class="link" href="research.html">What we are investigating</a>')}`
};

/* ──────────────────────────────────────────── press ───────────────────── */

const press = {
  slug: 'press.html',
  current: null,
  title: 'Press Kit — D.C Alacrity',
  description: 'Press kit for D.C Alacrity: company boilerplate, how to refer to the company and its products, brand assets, project one-liners and media contact.',
  body: `${phero({ plate: 'assets/brand/sky.jpg', eyebrow: 'Press', title: 'Kit &amp; boilerplate.', lede: 'Written to be reused directly. If you take one thing, take the boilerplate — it is the description we are asking to be introduced by.', actions: `<a class="btn" href="contact.html?topic=Press%20%2F%20media">Press inquiry</a> <a class="link" href="mailto:${SITE.email}">${SITE.email}</a>` })}

    <section class="sec">
      <div class="wrap" data-rise>
        <p class="eyebrow">Boilerplate</p>
        <p class="lede" style="max-width:66ch;color:var(--ink)"><strong>D.C Alacrity</strong> is a technology and media company building the Experience Industry. It develops original intellectual property, software and interactive experiences — including Pure Alacrity, a free production suite; Alacrity Player, the Unity runtime behind North Carolina’s first interactive live-action VR film; and a slate of owned properties across series, interactive and documentary. Founded in North Carolina, the company’s first products and productions are the foundation for a broader mission: technologies and businesses that change how people create, work, learn and connect.</p>
        <p class="eyebrow" style="margin-top:3rem">Short version</p>
        <p class="lede">${SITE.descriptor} Founded in North Carolina.</p>
        <p class="eyebrow" style="margin-top:3rem">Media contact</p>
        <p class="contact-email"><a href="mailto:${SITE.email}">${SITE.email}</a></p>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="head" data-rise><div><p class="eyebrow">Naming</p><h2>How to refer to us.</h2></div><p class="lede">Three names do three different jobs.</p></div>
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
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="head" data-rise><div><p class="eyebrow">Assets</p><h2>Download from this site.</h2></div><p class="lede">Ground #061018 · cyan #00C2FF · violet #8143FF · white-hot #E7FAFF.</p></div>
        <div class="service-list" data-rise>
          <a class="service-item" href="assets/brand/lockup.png" download><span class="num">01</span><div><h3>Primary lockup</h3><p>Mark and wordmark, white on transparent, for dark backgrounds.</p></div><span class="meta">PNG · alpha</span></a>
          <a class="service-item" href="assets/brand/mark.png" download><span class="num">02</span><div><h3>The mark</h3><p>The electric arrow on its own, transparent.</p></div><span class="meta">PNG · alpha</span></a>
          <a class="service-item" href="assets/brand/wordmark.png" download><span class="num">03</span><div><h3>Wordmark</h3><p>D.C Alacrity in the brand face, white on transparent.</p></div><span class="meta">PNG · alpha</span></a>
          <a class="service-item" href="assets/brand/hero-hand.jpg" download><span class="num">04</span><div><h3>Brand image</h3><p>The hand and the sky — the company’s hero image, 1600px.</p></div><span class="meta">JPG</span></a>
          <a class="service-item" href="assets/brand/apple-touch-icon.png" download><span class="num">05</span><div><h3>Icon</h3><p>The mark in a circle on the brand ground, for avatars.</p></div><span class="meta">PNG</span></a>
          <a class="service-item" href="assets/img/sidequest-logo.png" download><span class="num">06</span><div><h3>$IDEQU3ST wordmark</h3><p>Neon pink Sidequest logo.</p></div><span class="meta">PNG</span></a>
          <a class="service-item" href="assets/img/squad.jpg" download><span class="num">07</span><div><h3>ABC Squad still</h3><p>Production still for Sidequest coverage.</p></div><span class="meta">JPG</span></a>
          <a class="service-item" href="assets/screens/storymap.jpg" download><span class="num">08</span><div><h3>Pure Alacrity — Story Map</h3><p>A real screen from the current build.</p></div><span class="meta">JPG</span></a>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="head" data-rise><div><p class="eyebrow">One-liners</p><h2>Per product and property.</h2></div></div>
        <div class="table-wrap" data-rise>
          <table class="data">
            <tbody>
              <tr><td>Pure Alacrity</td><td>A free production suite — script, breakdown, schedule, set and delivery in one place, local-first and offline-capable.</td></tr>
              <tr><td>Alacrity Player</td><td>A Unity runtime that plays a branching story straight from the file it was authored into.</td></tr>
              <tr><td>Alacrity Bridge</td><td>In development: the shot plan and the day’s record arriving in Premiere Pro and DaVinci Resolve as a real timeline.</td></tr>
              <tr><td>Right Here Right Now!</td><td>North Carolina’s first interactive live-action VR film — free on Meta Horizon and SideQuest.</td></tr>
              <tr><td>Sidequest</td><td>A freshly fired grocery clerk reunites his crew of small-time crooks to get rich on a lawless dark-web gig economy — never knowing whose game it is. Crime dramedy; October 2026 release aim.</td></tr>
              <tr><td>Prize Pool VR</td><td>A campus water-gun game gets a million-dollar prize; two strangers end up the last two players at a fountain. Branching live-action VR180 — 41 unbroken takes, 9 endings, 12½–17½ minutes a viewing. In pre-production.</td></tr>
              <tr><td>Welcome to Wilmy</td><td>A Cape Fear surf and beach culture documentary, shot under a City of Wilmington permit. In production.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

${close('Ask for anything that is missing.', 'Interviews, additional assets, embargoed material or a fact check.', `<a class="btn" href="contact.html?topic=Press%20%2F%20media">Press inquiry</a> <a class="link" href="about.html">Company &amp; vision</a>`)}`
};

export default [home, technology, research, about, press];
