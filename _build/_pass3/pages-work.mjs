/* Media & experiences — the portfolio index and the four property pages.
   A property page explains the property. The company description lives on
   the company page; here it appears only as the line that connects the two. */

import { SITE, band, phero, facts } from './shell.mjs';

const PURE = SITE.app;

const index = {
  slug: 'work/index.html',
  current: 'work',
  area: 'media',
  title: 'Media & Experiences — Properties We Own · D.C Alacrity',
  description: 'The original properties D.C Alacrity owns: Sidequest, Right Here Right Now!, Prize Pool and Welcome to Wilmy — and the capabilities each one establishes.',
  ogImage: 'assets/img/squad.jpg',
  body: `${phero({
    eyebrow: 'Media & experiences',
    title: 'Properties we own.',
    lede: 'Four original works across series, interactive VR and documentary. Each is a piece of intellectual property in its own right, and each is an application of a capability the company is deliberately building.',
    aside: `<div class="flat" data-rise style="padding:1.75rem"><p class="eyebrow eyebrow--plain">How this connects</p><p class="small">These are not the company’s only output — the <a href="../technology.html">software</a> is a product line of its own. What these do is prove the technology under them, on real deadlines with real crews.</p></div>`
  })}

    <section class="sec sec--tight">
      <div class="wrap">
${facts([
    ['Released', 'Right Here Right Now! — free on headset'],
    ['In post', 'Sidequest — October 2026 release aim'],
    ['Fall 2026', 'Prize Pool principal photography'],
    ['In production', 'Welcome to Wilmy, under City permit']
  ])}
      </div>
    </section>

    <section class="sec stagey">
      <div class="wrap">
        <div class="slate">
          <a class="tile tile--wide t-sq" data-flat href="sidequest.html">
            <div class="media"><img src="../assets/img/squad.jpg" alt="The ABC Squad cast of Sidequest" width="1800" height="1012" loading="lazy" decoding="async"/><span class="cap">Series · in post</span></div>
            <div class="body">
              <p class="kind">Series · crime dramedy</p>
              <h3>$IDEQU3ST</h3>
              <p>Adam Dawnbringer, 21 and freshly fired, reunites his crew of small-time crooks to get rich on a lawless, gamified dark-web gig economy — never knowing whose game it is. Season 1 Part 1 shot with 84 cast and crew; 378 clips in the vault.</p>
              <span class="go">World · cast · status</span>
            </div>
          </a>
          <a class="tile tile--tall t-teal" data-flat href="right-here-right-now.html">
            <div class="media"><img src="../assets/img/dcalacrity.jpg" alt="D.C Alacrity brand image" width="800" height="800" loading="lazy" decoding="async"/><span class="cap">Live on Meta Horizon</span></div>
            <div class="body">
              <p class="kind">Interactive VR film · released</p>
              <h3>Right Here Right Now!</h3>
              <p>North Carolina’s first interactive live-action VR film. Free on headset — and the title that proved a story graph can compile all the way to a released product.</p>
              <span class="go">Format · pipeline · play</span>
            </div>
          </a>
          <a class="tile tile--half" data-flat data-area="rnd" href="prize-pool.html">
            <div class="media"><img src="../assets/img/prize-pool-placeholder.jpg" alt="Placeholder key art for Prize Pool" width="1536" height="1024" loading="lazy" decoding="async"/><span class="cap">Placeholder art · in development</span></div>
            <div class="body">
              <p class="kind">Interactive VR · principal Fall 2026</p>
              <h3>Prize Pool</h3>
              <p>A campus assassin tradition with a million dollars attached. Alliance, romance and suspicion as state, roughly 35 nodes and six to eight endings.</p>
              <span class="go">Design · dates · partner</span>
            </div>
          </a>
          <a class="tile tile--half" data-flat data-area="media" href="welcome-to-wilmy.html">
            <div class="media"><img src="../assets/img/welcome-to-wilmy.jpg" alt="An interview on the Cape Fear coast" width="1024" height="576" loading="lazy" decoding="async"/><span class="cap">Documentary · in production</span></div>
            <div class="body">
              <p class="kind">Documentary · Cape Fear</p>
              <h3>Welcome to Wilmy</h3>
              <p>Surf and beach culture on the Cape Fear coast, under a City of Wilmington permit, with a festival cut aimed at Cucalorus.</p>
              <span class="go">Film · flywheel · hire</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="sec sec--deep">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">What each one establishes</p>
            <h2>A property is also a test.</h2>
          </div>
          <p class="lede">Every title here was chosen partly because finishing it answers something about the technology. That is what makes the slate evidence rather than a portfolio.</p>
        </div>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>Property</th><th>Kind</th><th>What it establishes</th></tr></thead>
            <tbody>
              <tr><td>Right Here Right Now!</td><td>Interactive VR film</td><td>A branching live-action story can be authored, compiled and released to a store people already use.</td></tr>
              <tr><td>Sidequest</td><td>Series</td><td>A microbudget production with 84 people can be run and finished — and it is where the production software’s specification came from.</td></tr>
              <tr><td>Prize Pool</td><td>Interactive VR</td><td>The pipeline holds at a larger graph, with state that persists across choices rather than a branching tree.</td></tr>
              <tr><td>Welcome to Wilmy</td><td>Documentary</td><td>Original work and commercial work can share one crew and one system without either being an afterthought.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div>
            <p class="eyebrow">How projects move</p>
            <h2>Authored, produced, delivered.</h2>
          </div>
          <p class="lede">The same three steps every time, on the company’s own software, with North Carolina crews.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>Author</time><h3>In Pure Alacrity</h3><p>Script, coverage, the branching graph and the world bible live in one production rather than six files.</p></article>
          <article><time>Produce</time><h3>North Carolina crews</h3><p>Call sheets, day logs and budgets stay in the same place, and the day’s record is captured on set rather than reconstructed.</p></article>
          <article><time>Deliver</time><h3>Easiest surface first</h3><p>Free streaming and flat cuts for discovery, headset when the audience is ready. The same graph, different output.</p></article>
        </div>
      </div>
    </section>

${band('Partner on a title, or use the tools behind them.', 'Production partners and investors are welcome on the slate. Pure Alacrity is free either way.', `<a class="btn btn--area" href="../contact.html?topic=Investor%20%2F%20partner">Partner inquiry</a> <a class="btn btn--ghost" href="${PURE}">Open Pure Alacrity</a>`)}`
};

const sidequest = {
  slug: 'work/sidequest.html',
  current: 'work',
  area: 'sq',
  title: '$IDEQU3ST — Sidequest, a crime dramedy · D.C Alacrity',
  description: 'Sidequest ($IDEQU3ST): a crime dramedy from D.C Alacrity. A freshly fired grocery clerk reunites his crew of small-time crooks to get rich on a lawless dark-web gig economy — never knowing whose game it is. Season 1 Part 1 shot; October 2026 release aim.',
  ogTitle: '$IDEQU3ST — Sidequest · D.C Alacrity',
  ogDescription: 'No job too illegal. No debt too deep. No exit from the game.',
  ogImage: 'assets/img/squad.jpg',
  head: `  <style>
    .sq-logo { max-width: min(520px, 92%); margin: 1.25rem 0 0.5rem; filter: drop-shadow(0 0 28px rgba(255,45,160,.38)); }
  </style>`,
  body: `    <header class="phero">
      <div class="wrap">
        <div class="phero__grid">
          <div>
            <p class="eyebrow">Flagship series · crime dramedy / cyberpunk</p>
            <h1><img class="sq-logo" src="../assets/img/sidequest-logo.png" alt="$IDEQU3ST" width="1200" height="334"/></h1>
            <p class="lede" style="margin-top:1rem">A broke, freshly fired grocery clerk reunites his ragtag crew of small-time crooks to get rich on Sidequest — a lawless, gamified dark-web gig economy — never knowing it is the storefront of a dead hacker’s digital afterlife, while an FBI cyber-taskforce closes in.</p>
            <p class="pull" style="margin-top:1rem">No job too illegal. No debt too deep. No exit from the game.</p>
            <p class="mono muted" style="margin-top:1rem">Powered by Pure Alacrity · Edit locked Aug 7 · Release aim Oct 7, 2026</p>
            <div class="btn-row">
              <a class="btn btn--area" href="#cast">Meet ABC Squad</a>
              <a class="btn btn--ghost" href="#status">Production status</a>
            </div>
          </div>
          <div>
            <div class="visual" data-rise><img src="../assets/img/squad.jpg" alt="The ABC Squad on location" width="1800" height="1012"/></div>
          </div>
        </div>
      </div>
    </header>

    <section class="sec sec--tight">
      <div class="wrap">
${facts([['~$1,400', 'Season 1 on-set spend'], ['84', 'cast &amp; crew'], ['378', 'clips · 7.5 hours of 4K'], ['Oct 2026', 'free streaming aim']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="split">
          <div class="visual" data-rise><img src="../assets/img/adam.jpg" alt="Adam Dawnbringer, played by Garrett Sessoms" width="1280" height="720" loading="lazy"/></div>
          <div data-rise>
            <p class="eyebrow">The lead</p>
            <h2>Adam Dawnbringer treats life like a video game.</h2>
            <div class="prose">
              <p>He is twenty-one, a college kid, and he has just been fired from the grocery store. His ex, Kendall, is gone; the supercar he cannot afford is how he plans to win her back; and the hole his missing father left is the thing he is really trying to fill. So he does what he always does with a problem — he treats it like a level.</p>
              <p>He gets the old crew back together: Brock the driver, Chester the brains, Diego the wild card, Felicia the hacker, Gemma the locksmith, Eric the fighter. Small-time crooks, big-time debts. And a marketplace called Sidequest where every job pays in XP and nobody asks questions.</p>
              <p>On the surface it is a heist comedy — <strong>Mr. Robot</strong>’s paranoia, <strong>Barry</strong>’s heart, <strong>Baby Driver</strong>’s needle drops, and the interface of <strong>GTA Online</strong>. Underneath, the game has an owner, and Adam’s father knew him.</p>
            </div>
            <p class="pull">You can’t kill a system you’re already inside.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep" id="episodes">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Season 1 shape</p><h2>Adam’s story, with three more running underneath it.</h2></div>
          <p class="lede">The A-plot is the squad. Three more tracks run under it and surface when Adam’s jobs cross them: the FBI taskforce hunting the marketplace, his family’s buried history, and the myth of who built the game. Episode titles so far: the refusal-of-the-call opener, <em>Sharks and Minnows</em>, and <em>On Thin Ice</em>.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>A-plot</time><h3>Adam and the ABC Squad</h3><p>Jobs that escalate faster than the crew’s morals can keep up — from a first gig that pays too well to a $70,000 delivery nobody should have taken.</p></article>
          <article><time>B-plot</time><h3>FBI Team 4B</h3><p>Agent Knox’s taskforce chases a marketplace that looks like crime and behaves like something older — and one of them is closer to it than he admits.</p></article>
          <article><time>C / D</time><h3>Family &amp; myth</h3><p>Cain’s disappearance, Nelson’s recruitment, and the story of the Trojan Stallion — the man who built the game — bleeding into every “simple” gig.</p></article>
        </div>
      </div>
    </section>

    <section class="sec" id="cast">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">ABC Squad</p><h2>The crew.</h2></div>
          <p class="lede">Principal cast of the flagship. Full Season 1 credits list 84 people.</p>
        </div>
        <div class="cast-grid" data-rise>
          <figure><img src="../assets/img/adam.jpg" alt="Adam Dawnbringer" loading="lazy"/><figcaption>Adam Dawnbringer<span>Garrett Sessoms</span></figcaption></figure>
          <figure><img src="../assets/img/chester.jpg" alt="Chester Wiseman" loading="lazy"/><figcaption>Chester Wiseman<span>Collin Davis</span></figcaption></figure>
          <figure><img src="../assets/img/diego.jpg" alt="Diego Cicatriz-Olvidado" loading="lazy"/><figcaption>Diego Cicatriz-Olvidado<span>Noah Piechoski</span></figcaption></figure>
          <figure><img src="../assets/img/felicia-fox.jpg" alt="Felicia Wall" loading="lazy"/><figcaption>Felicia Wall<span>Venus Parker</span></figcaption></figure>
          <figure><img src="../assets/img/eric.jpg" alt="Eric McSharry" loading="lazy"/><figcaption>Eric McSharry<span>Andrew Overby III</span></figcaption></figure>
          <figure><img src="../assets/img/nelson.jpg" alt="Nelson" loading="lazy"/><figcaption>Nelson<span>The recruiter</span></figcaption></figure>
          <figure><img src="../assets/img/cain.jpg" alt="Cain Dawnbringer" loading="lazy"/><figcaption>Cain Dawnbringer<span>The missing father</span></figcaption></figure>
          <figure><img src="../assets/img/alexa.jpg" alt="Agent Alexa" loading="lazy"/><figcaption>Agent Alexa<span>FBI Cyber Realm</span></figcaption></figure>
        </div>
        <p class="prose" data-rise style="margin-top:1.75rem">Also in the ABC Squad orbit: <strong>Brock Turismo</strong> (Isaac Corrigan), the wheelman, and <strong>Gemma Gazelle</strong> (Emily Kahl). Call sheets and actor guides run deeper than this grid.</p>
      </div>
    </section>

    <section class="sec sec--deep" id="world">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">The world underneath</p><h2>The game has an owner.</h2></div>
          <p class="lede">Sidequest is the public storefront of the Cyber Realm — a universe of code built by the Trojan Stallion, the world’s most dangerous hacker, to outlive his body. Its economy is K.U.M and XP; its origin is a Nigerian orphan’s bargain with the Igbo death-deity Ogbunabali. Adam never asks who built the game. That is the point.</p>
        </div>
        <div class="split split--top">
          <div class="prose" data-rise>
            <p>A <strong>136-page</strong> world bible and <strong>187 pages</strong> of actor guides sit under the show — the floor, not the pitch. Heist comedy on the surface, cyber-horror mythology underneath, a father and son at the core.</p>
            <p><strong>Spin-offs seeded:</strong> a Cain and Nelson crime drama, an FBI procedural, the Trojan Stallion origin, an ARG marketplace, interactive episodes, and merchandise.</p>
          </div>
          <div style="display:grid;gap:1rem">
            <div class="visual" data-rise style="min-height:0"><img src="../assets/img/cyberrealm-logo.jpeg" alt="The Cyber Realm insignia" width="2000" height="1748" style="object-fit:contain;padding:1.5rem;background:#000" loading="lazy"/></div>
            <div class="flat flat--pad-l" data-flat data-rise>
            <h3>Why the world bible matters to the company</h3>
            <p>A franchise bible is not a creative indulgence — it is the asset register. It is also what the IP workspace in <a href="${PURE}">Pure Alacrity</a> was built to hold, which is a good example of a production problem becoming a software feature.</p>
          </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="status">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Status</p><h2>Distribution-ready.</h2></div>
          <p class="lede">Shot in summer 2025 with additional photography that November. In post since.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>Done</time><h3>Season 1 Part 1 principal</h3><p>14 shoot days, dual-camera 4K, roughly $1,400 of on-set spend, 378 clips and 7.5 hours in the vault.</p></article>
          <article><time>Oct 2026</time><h3>Release aim</h3><p>Free streaming, with a branching pilot cut from the show’s own choice interface so discovery does not require a login wall.</p></article>
          <article><time>Next</time><h3>Season 2 &amp; spin-offs</h3><p>More episodes as the audience finds the world — this time with the production software running the pipeline end to end, not only post.</p></article>
        </div>
        <div class="flat flat--pad-l" data-flat data-rise style="margin-top:2rem">
          <p class="eyebrow eyebrow--plain">A correction worth making</p>
          <p>Sidequest was not made on Pure Alacrity. The software post-dates the shoot: this season is where its specification came from, and it runs the show’s post today. Built out of Sidequest, not for it.</p>
        </div>
      </div>
    </section>

${band('Press Start.', 'Sidequest is the flagship. The software is what it forced us to build. Right Here Right Now! is the proof that branching ships.', '<a class="btn btn--area" href="right-here-right-now.html">See RHRN!</a> <a class="btn btn--ghost" href="../contact.html?topic=Investor%20%2F%20partner">Partner with us</a>')}`
};

const rhrn = {
  slug: 'work/right-here-right-now.html',
  current: 'work',
  area: 'teal',
  title: 'Right Here Right Now! — Interactive VR Cinema · D.C Alacrity',
  description: 'Right Here Right Now!: North Carolina’s first interactive live-action VR film from D.C Alacrity. Free on Meta Horizon and SideQuest — and the title that proved the story-graph-to-runtime pipeline.',
  ogTitle: 'Right Here Right Now! — D.C Alacrity',
  ogDescription: 'Interactive live-action VR cinema. You are Lucas. Every choice echoes.',
  body: `${phero({
    eyebrow: 'Interactive VR cinema · live',
    title: 'Right Here Right Now!',
    lede: 'North Carolina’s first interactive live-action VR film. A picnic turns violent. You are Lucas. Every choice echoes through the warehouse, the confrontation, and the ending you earn.',
    actions: '<a class="btn btn--area" href="rhrn.html">Enter the experience site</a> <a class="btn btn--ghost" href="../technology.html">The technology behind it</a>',
    aside: `<div class="flat" data-rise style="padding:1.75rem"><p class="eyebrow eyebrow--plain">Why it matters to the company</p><p class="small">This is the title that established the capability the rest of the company is built on: a written branching story compiling into something a person plays. The graph drawn on our <a href="../index.html">home page</a> is this film’s.</p></div>`
  })}

    <section class="sec sec--tight">
      <div class="wrap">
${facts([['16', 'scene nodes (V1)'], ['22', 'playable paths'], ['11K', 'shot · presented in 4K'], ['Free', 'Meta Horizon · SideQuest']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="split">
          <div data-rise>
            <p class="eyebrow">Logline</p>
            <h2>You are Lucas.</h2>
            <div class="prose">
              <p>What starts as a picnic collapses into confrontation when Janaye forces a reckoning — then armed strangers pull the night into a warehouse where silence, confession and courage all cost something different.</p>
              <p><em>Right Here Right Now!</em> is proof that interactive live-action cinema can ship: authored as a story graph, captured in 360°, assembled in Unity with the Alacrity Player, and released to headsets people already own.</p>
            </div>
            <p class="pull">Every choice echoes.</p>
          </div>
          <div class="visual" data-rise><img src="../assets/img/dcalacrity.jpg" alt="D.C Alacrity brand image" width="800" height="800" style="object-fit:contain;padding:2rem;background:#041820" loading="lazy"/></div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep" id="choices">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">The format</p><h2>Not a menu. A night that branches.</h2></div>
          <p class="lede">V1 ships 16 scene nodes across 22 paths and three emotional tracks. V2 targets 60+ nodes and a feature-length runtime — the same pipeline, a bigger graph.</p>
        </div>
        <div class="choice-strip" data-rise><div>Confess</div><div>Protect</div><div>Run</div></div>
        <p class="prose" data-rise>Playback is Meta Quest ready and VRC verified, with ambisonic and 7.1 binaural sound designed for headset presence rather than as a flat-screen afterthought.</p>
      </div>
    </section>

    <section class="sec" id="pipeline">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Pipeline</p><h2>How interactive cinema actually ships.</h2></div>
          <p class="lede">Every step here is a piece of the company’s technology, doing the job it was built for.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>Capture</time><h3>Insta360 Titan + Canon R</h3><p>Shot up to 11K and presented in 4K 360° — live-action plates, not generated filler.</p></article>
          <article><time>Author</time><h3>Story graph → JSON bundle</h3><p>The branching structure authored in Pure Alacrity, colour in DaVinci Resolve, packaged for the Alacrity Player.</p></article>
          <article><time>Deliver</time><h3>Unity · Quest · SideQuest</h3><p>Headset build live, free on SideQuest, and distributed through Meta Horizon.</p></article>
        </div>
      </div>
    </section>

    <section class="sec sec--deep" id="credits">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Selected credits</p><h2>The people who made the night real.</h2></div>
          <p class="lede">Advisors and collaborators across the broader effort include voices from the UNC Wilmington creative technology community.</p>
        </div>
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
      </div>
    </section>

    <section class="sec" id="why">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Why it matters</p><h2>Proof before the pitch.</h2></div>
          <p class="lede">Interactive live-action still has no incumbent, and the production layer underneath it barely exists.</p>
        </div>
        <div class="prose" data-rise>
          <p>When Netflix made <em>Bandersnatch</em>, no tool existed for writing a branching-narrative script. The one they built in-house produced a flowchart that was exported to a spreadsheet and implemented by hand across hundreds of footage segments. If the largest streamer on earth ended at a spreadsheet, the layer under interactive live action genuinely does not exist yet.</p>
          <p><em>Right Here Right Now!</em> is our answer to “show me”: a finished title on store shelves, a documented pipeline, and the <a href="../technology.html">production software</a> other filmmakers can use for free. <a href="prize-pool.html">Prize Pool</a> is the next title on the same stack.</p>
        </div>
        <div class="btn-row" data-rise style="margin-top:1.5rem">
          <a class="btn btn--area" href="rhrn.html">Open the full experience site</a>
          <a class="btn btn--ghost" href="prize-pool.html">See Prize Pool</a>
        </div>
      </div>
    </section>

${band('Play it. Then talk scale.', 'Free on headset. Serious production partners welcome for V2 and beyond.', '<a class="btn btn--area" href="rhrn.html">Enter the experience</a> <a class="btn btn--ghost" href="../contact.html?topic=Investor%20%2F%20partner">Partner inquiry</a>')}`
};

const prizePool = {
  slug: 'work/prize-pool.html',
  current: 'work',
  area: 'rnd',
  title: 'Prize Pool — Interactive VR · Fall 2026 · D.C Alacrity',
  description: 'Prize Pool: a campus assassin tradition hits $1,000,000 overnight. An interactive VR social thriller from D.C Alacrity, with principal photography in Fall 2026.',
  ogTitle: 'Prize Pool — D.C Alacrity',
  ogDescription: 'The player is the experiment. Interactive VR. Principal photography Fall 2026.',
  body: `${phero({
    eyebrow: 'Interactive VR · social thriller · Fall 2026',
    title: 'Prize Pool',
    lede: 'Every year the campus plays Assassin. This year the pot hits <strong>$1,000,000</strong> overnight, and a silly tradition becomes a live social experiment. You are not watching the game. You are inside it.',
    actions: '<a class="btn btn--area" href="../contact.html?topic=Investor%20%2F%20partner">Partner / invest</a> <a class="btn btn--ghost" href="right-here-right-now.html">See the proof: RHRN!</a>',
    aside: `<figure class="with-caption" data-rise><div class="visual"><img src="../assets/img/prize-pool-placeholder.jpg" alt="Placeholder key art for Prize Pool" width="1536" height="1024"/></div><figcaption class="img-caption">Placeholder key art — the final look lands in pre-production.</figcaption></figure>`
  })}

    <section class="sec sec--tight">
      <div class="wrap">
${facts([['~35', 'story nodes'], ['6–8', 'endings'], ['~35 min', 'runtime · PG-13'], ['Sep–Nov', 'principal photography 2026']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="split split--top">
          <div data-rise>
            <p class="eyebrow">Logline</p>
            <h2>Everyone you trust is now a strategy.</h2>
            <div class="prose">
              <p>Prize Pool follows a point-of-view player dropped into a campus-wide elimination game the moment the prize becomes impossible to ignore. Friendships turn into alliances. Flirting becomes cover. Every confession can be a weapon.</p>
              <p>State meters track <strong>alliance</strong>, <strong>romance</strong> and <strong>suspicion</strong> — not a naive exploding dialogue tree. Your path through the graph is a character study of how people behave when a million dollars appears in a game that was never supposed to matter.</p>
            </div>
            <p class="pull">The player is the experiment.</p>
          </div>
          <div class="flat flat--pad-l" data-flat data-rise>
            <h3>Why this one is technically interesting</h3>
            <p>Right Here Right Now! proved a branching graph can ship. Prize Pool asks a harder question: can the same pipeline carry <strong>state</strong> — meters that persist and change how later scenes play — without the graph exploding into unfilmable combinations? That is a production problem and a software problem at the same time, which is the kind we look for.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep" id="factions">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Factions</p><h2>Four ways to play the same board.</h2></div>
          <p class="lede">Every ending answers a different slice of one question: who is the Architect, and why fund a million-dollar campus game?</p>
        </div>
        <div class="stat-row" data-rise>
          <div><strong>Champion’s Alliance</strong><span>Protect the favourite. Share intel. Survive as a bloc — until someone decides the pot is worth the betrayal.</span></div>
          <div><strong>Independents</strong><span>No banner, no loyalty. Soft power, side deals, and the quietest path to the last name standing.</span></div>
          <div><strong>The Commission</strong><span>Rules-keepers and rumour brokers. They claim the game stays fair. They never claim to be neutral.</span></div>
          <div><strong>The Architect</strong><span>Anonymous sponsor. Invisible hand. The ending you “win” may still be the ending they designed.</span></div>
        </div>
      </div>
    </section>

    <section class="sec" id="production">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Production</p><h2>Dated, not dreamed.</h2></div>
          <p class="lede">Pre-production lives in the company’s own software, which means the schedule, the coverage matrix and the story graph are one document rather than four.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>Now</time><h3>Pre-production</h3><p>Story map, coverage matrix, location list and shoot-day planning already in Pure Alacrity — not a scattered drive of drafts.</p></article>
          <article><time>Sep 21 – Nov 6, 2026</time><h3>Principal photography</h3><p>North Carolina campus and near-campus locations, local crew, and day logs that feed the post package directly.</p></article>
          <article><time>After principal</time><h3>Release ladder</h3><p>Alacrity Player on headset, then a flat 2D director’s path, then a free streaming cutdown for discovery.</p></article>
        </div>
        <p class="prose muted" data-rise style="margin-top:2rem">Prize Pool is the next production on the pipeline proven by <a href="right-here-right-now.html">Right Here Right Now!</a> — a bigger new title, not a sequel.</p>
      </div>
    </section>

${band('Follow the Architect.', 'Pre-production is open. Principal is on the calendar. The graph is waiting for the campus.', '<a class="btn btn--area" href="../contact.html?topic=Investor%20%2F%20partner">Investor / partner inquiry</a> <a class="btn btn--ghost" href="index.html">Back to the work</a>')}`
};

const wilmy = {
  slug: 'work/welcome-to-wilmy.html',
  current: 'work',
  area: 'media',
  title: 'Welcome to Wilmy — Cape Fear Documentary · D.C Alacrity',
  description: 'Welcome to Wilmy: a Cape Fear surf and beach culture documentary from D.C Alacrity, shot under a City of Wilmington permit with a Cucalorus festival aim.',
  ogTitle: 'Welcome to Wilmy — D.C Alacrity',
  ogDescription: 'Cape Fear surf and beach culture — destination storytelling from Wilmington.',
  ogImage: 'assets/img/welcome-to-wilmy.jpg',
  body: `${phero({
    eyebrow: 'Documentary · Wilmington · City permit',
    title: 'Welcome to Wilmy',
    lede: 'A feature-leaning look at Cape Fear surf and beach culture — made as destination storytelling for visitors, and as a working relationship with the businesses that define the coast.',
    actions: '<a class="btn btn--area" href="../services.html#destination">Destination packages</a> <a class="btn btn--ghost" href="../contact.html?topic=Client%20%2F%20commercial">Get your shop in frame</a>',
    aside: `<figure class="with-caption" data-rise><div class="visual"><img src="../assets/img/welcome-to-wilmy.jpg" alt="An interview on the Cape Fear coast" width="1024" height="576" style="object-position:center 20%"/></div><figcaption class="img-caption">Production still — coast interview day.</figcaption></figure>`
  })}

    <section class="sec sec--tight">
      <div class="wrap">
${facts([['City permit', 'Wilmington production access'], ['Cucalorus', 'festival cut aim'], ['Cape Fear', 'the coast as a character'], ['Dual', 'art and commerce on one crew']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="split split--top">
          <div data-rise>
            <p class="eyebrow">The film</p>
            <h2>Not a brochure. A portrait.</h2>
            <div class="prose">
              <p><em>Welcome to Wilmy</em> follows the people who make Cape Fear feel like itself — surfers, shop owners, board builders, beach-day regulars, and the quiet rituals between dawn patrol and last light.</p>
              <p>It is shot under a <strong>City of Wilmington</strong> permit, with a festival cut aimed at <strong>Cucalorus</strong>. The tone stays observational and warm: salt, wood, caffeine, and the small economies that keep a beach town honest.</p>
              <p>Runtime target sits in the feature-leaning documentary band, roughly 45 to 70 minutes for the festival cut, with short destination cutdowns for tourism partners and social.</p>
            </div>
          </div>
          <div class="flat flat--pad-l" data-flat data-rise>
            <h3>Why a documentary sits on this slate</h3>
            <p>It keeps a crew working between interactive productions, it builds a real relationship with the local economy the commercial unit serves, and it is the one project on the slate with no branching in it at all — which makes it a useful check that the tools are good for ordinary filmmaking too.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep" id="subjects">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">What you’ll see</p><h2>Threads on the strand.</h2></div>
          <p class="lede">Three threads, shot as people rather than as postcard footage.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>Surf culture</time><h3>Dawn patrol to last glass</h3><p>Sessions, board talk, and the people who treat the water like a second schedule.</p></article>
          <article><time>Local business</time><h3>Shops that define the block</h3><p>Board shops, cafes, rentals and beach brands filmed as characters, not product placements.</p></article>
          <article><time>Place</time><h3>Cape Fear as a character</h3><p>Ferry light, pier weather, off-season quiet — the shoreline identity held in frame long enough to feel.</p></article>
        </div>
      </div>
    </section>

    <section class="sec" id="flywheel">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">For Wilmington</p><h2>The commercial flywheel.</h2></div>
          <p class="lede">The documentary builds goodwill and footage; destination packages and brand films turn that into paid work inside the same local economy.</p>
        </div>
        <div class="stat-row" data-rise>
          <div><strong>Festival cut</strong><span>A Cucalorus-ready narrative documentary.</span></div>
          <div><strong>Tourism cutdowns</strong><span>30–90 second place films for boards and venues.</span></div>
          <div><strong>Brand films</strong><span>Spark and Brand packages for shops that appear on screen.</span></div>
          <div><strong>Social packs</strong><span>Captions-ready clips for local accounts.</span></div>
        </div>
      </div>
    </section>

    <section class="sec sec--deep" id="status">
      <div class="wrap">
        <div class="sec-head" data-rise>
          <div><p class="eyebrow">Status</p><h2>In motion on the coast.</h2></div>
          <p class="lede">Interviews and observational days rolling as schedules and weather allow. Additional shops can still request inclusion.</p>
        </div>
        <div class="timeline" data-rise>
          <article><time>Cleared</time><h3>City of Wilmington permit</h3><p>Production access for public coastal storytelling under local permit — not guerrilla tourism B-roll.</p></article>
          <article><time>Active</time><h3>Interviews &amp; observational days</h3><p>Subject outreach and coast coverage continuing through the season.</p></article>
          <article><time>Next</time><h3>Festival assembly</h3><p>Picture lock toward Cucalorus submission windows, then tourism and brand derivatives for participating businesses.</p></article>
        </div>
      </div>
    </section>

${band('Seen on screen? Let’s talk.', 'If your Wilmington or Cape Fear business appeared — or should — destination packages and brand films are open now.', '<a class="btn btn--area" href="../services.html#destination">Destination packages</a> <a class="btn btn--ghost" href="../contact.html?topic=Client%20%2F%20commercial">Book a consult</a>')}`
};

export default [index, sidequest, rhrn, prizePool, wilmy];
