/* Media & experiences — the portfolio index and the four property pages.
   A property page explains the property; the company description lives on
   the company page. Two things are private and never appear here: Sidequest's
   on-set spend, and Welcome to Wilmy's distribution (undecided). The build
   refuses both. */

import { SITE, close, phero, facts, fill } from './shell.mjs';

const PURE = SITE.app;

/* ───────────────────────────────────────────── index ──────────────────── */

const index = {
  slug: 'work/index.html',
  current: 'work',
  title: 'Media & Experiences — Properties We Own · D.C Alacrity',
  description: 'The original properties D.C Alacrity owns: Sidequest, Right Here Right Now!, Prize Pool VR and Welcome to Wilmy — and the capability each one establishes.',
  ogImage: 'assets/img/squad.jpg',
  body: `${phero({ plate: 'assets/img/rhrn-bts.jpg', eyebrow: 'Media & experiences', title: 'Properties we own.', lede: 'Four original works across series, interactive VR and documentary. Each is intellectual property in its own right, and each is an application of a capability the company is deliberately building.' })}

    <section class="sec">
      <div class="wrap">
        <div class="props props--2">
          <a class="prop" data-rise href="sidequest.html">
            <div class="visual"><img src="../assets/img/squad.jpg" alt="The ABC Squad cast of Sidequest" width="1800" height="1012" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Sidequest</h3><span>Series · in post</span></div>
            <p>Adam Dawnbringer, 21 and freshly fired, reunites his crew of small-time crooks to get rich on a lawless dark-web gig economy — never knowing whose game it is.</p>
          </a>
          <a class="prop" data-rise href="right-here-right-now.html">
            <div class="visual"><img src="../assets/img/rhrn-card.jpg" alt="Right Here Right Now! — Lucas surrounded by the film’s branching scenes" width="1600" height="1000" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Right Here Right Now!</h3><span>Interactive VR · released</span></div>
            <p>North Carolina’s first interactive live-action VR film. Free on Meta Horizon and SideQuest, and the title that proved a story graph can compile all the way to a released product.</p>
          </a>
          <a class="prop" data-rise href="prize-pool.html">
            <div class="visual"><img src="../assets/img/prize-pool-placeholder.jpg" alt="Key art for Prize Pool VR" width="1536" height="1024" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Prize Pool VR</h3><span>Branching VR180 · 9 endings · in pre-production</span></div>
            <p>A campus water-gun game with a million dollars attached. Alliance, trust and suspicion carried as facts the story remembers — 41 unbroken takes and nine endings.</p>
          </a>
          <a class="prop" data-rise href="welcome-to-wilmy.html">
            <div class="visual"><img src="../assets/img/welcome-to-wilmy.jpg" alt="An interview on the Cape Fear coast" width="1024" height="576" loading="lazy" decoding="async"/></div>
            <div class="meta"><h3>Welcome to Wilmy</h3><span>Documentary · in production</span></div>
            <p>Surf and beach culture on the Cape Fear coast, shot under a City of Wilmington permit.</p>
          </a>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">What each one establishes</p><h2>A property is also a test.</h2></div>
          <p class="lede">Every title was chosen partly because finishing it answers something about the technology. That is what makes the slate evidence rather than a portfolio.</p>
        </div>
        <div class="table-wrap" data-rise>
          <table class="data">
            <thead><tr><th>Property</th><th>Kind</th><th>What it establishes</th></tr></thead>
            <tbody>
              <tr><td>Right Here Right Now!</td><td>Interactive VR film</td><td>A branching live-action story can be authored, compiled and released to a store people already use.</td></tr>
              <tr><td>Sidequest</td><td>Series</td><td>A microbudget production with 84 people can be run and finished — and it is where the production software’s specification came from.</td></tr>
              <tr><td>Prize Pool VR</td><td>Branching VR180</td><td>41 unbroken takes, 9 endings and 5,535 routes, with eight facts the story remembers across them — a graph that carries state rather than a tree that forgets.</td></tr>
              <tr><td>Welcome to Wilmy</td><td>Documentary</td><td>Original work and commercial work can share one crew and one system without either being an afterthought.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

${close('Partner on a title, or use the tools behind them.', 'Production partners and investors are welcome on the slate. Pure Alacrity is free either way.', `<a class="btn" href="../contact.html?topic=Investor%20%2F%20partner">Partner inquiry</a> <a class="link" href="${PURE}">Open Pure Alacrity</a>`)}`
};

/* ───────────────────────────────────────────── sidequest ──────────────── */

const sidequest = {
  slug: 'work/sidequest.html',
  current: 'work',
  title: '$IDEQU3ST — Sidequest, a crime dramedy · D.C Alacrity',
  description: 'Sidequest ($IDEQU3ST): a crime dramedy from D.C Alacrity. A freshly fired grocery clerk reunites his crew of small-time crooks to get rich on a lawless dark-web gig economy — never knowing whose game it is. Season 1 Part 1 shot; October 2026 release aim.',
  ogTitle: '$IDEQU3ST — Sidequest · D.C Alacrity',
  ogDescription: 'No job too illegal. No debt too deep. No exit from the game.',
  ogImage: 'assets/img/squad.jpg',
  head: `  <style>
    .sq-logo { display: block; max-width: min(460px, 92%); height: auto; margin: .5rem 0 0; }
    .pull { font-family: var(--display); font-weight: 300; font-size: clamp(1.25rem, 2vw, 1.6rem); line-height: 1.35; color: var(--ink); max-width: 24ch; }
  </style>`,
  body: `${phero({ plate: 'assets/img/squad.jpg', lead: true, eyebrow: 'Flagship series · crime dramedy', title: '<img class="sq-logo" src="../assets/img/sidequest-logo.png" alt="$IDEQU3ST" width="1200" height="334"/>', lede: 'A broke, freshly fired grocery clerk reunites his ragtag crew of small-time crooks to get rich on Sidequest — a lawless, gamified dark-web gig economy — never knowing it is the storefront of a dead hacker’s digital afterlife, while an FBI cyber-taskforce closes in.', actions: '<a class="btn" href="#cast">Meet ABC Squad</a> <a class="link" href="#status">Production status</a>' })}

    <section class="sec sec--lead">
      <div class="wrap">
        <div class="visual" data-rise style="aspect-ratio:16/9"><img src="../assets/img/squad.jpg" alt="The ABC Squad on location" width="1800" height="1012"/></div>
${facts([['84', 'cast &amp; crew'], ['378', 'clips · 7.5 hours of 4K'], ['14', 'shoot days, dual-camera'], ['Oct 2026', 'free streaming aim']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="beside" data-rise>
          <div>
            <p class="eyebrow">The lead</p>
            <h2>Adam Dawnbringer treats life like a video game.</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>He is twenty-one, a college kid, and he has just been fired from the grocery store. His ex, Kendall, is gone; the supercar he cannot afford is how he plans to win her back; and the hole his missing father left is the thing he is really trying to fill. So he does what he always does with a problem — he treats it like a level.</p>
              <p>He gets the old crew back together: Brock the driver, Chester the brains, Diego the wild card, Felicia the hacker, Gemma the locksmith, Eric the fighter. Small-time crooks, big-time debts. And a marketplace called Sidequest where every job pays in XP and nobody asks questions.</p>
              <p>On the surface it is a heist comedy — <strong>Mr. Robot</strong>’s paranoia, <strong>Barry</strong>’s heart, <strong>Baby Driver</strong>’s needle drops, and the interface of <strong>GTA Online</strong>. Underneath, the game has an owner, and Adam’s father knew him.</p>
            </div>
            <p class="pull" style="margin-top:1.75rem">No job too illegal. No debt too deep. No exit from the game.</p>
          </div>
          <div class="visual" style="aspect-ratio:16/9"><img src="../assets/img/adam.jpg" alt="Adam Dawnbringer, played by Garrett Sessoms" width="1280" height="720" loading="lazy"/></div>
        </div>
      </div>
    </section>

    <section class="sec" id="season">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Season 1 shape</p><h2>Adam’s story, with three more running underneath it.</h2></div>
          <p class="lede">The A-plot is the squad. Three more tracks run under it and surface when Adam’s jobs cross them: the FBI taskforce hunting the marketplace, his family’s buried history, and the myth of who built the game.</p>
        </div>
        <div class="grid-3" data-rise>
          <div class="lines">
            <div><h3>A-plot · Adam and the ABC Squad</h3><p>Jobs that escalate faster than the crew’s morals can keep up — from a first gig that pays too well to a $70,000 delivery nobody should have taken.</p></div>
          </div>
          <div class="lines">
            <div><h3>B-plot · FBI Team 4B</h3><p>Agent Knox’s taskforce chases a marketplace that looks like crime and behaves like something older — and one of them is closer to it than he admits.</p></div>
          </div>
          <div class="lines">
            <div><h3>C / D · Family and myth</h3><p>Cain’s disappearance, Nelson’s recruitment, and the story of the Trojan Stallion — the man who built the game — bleeding into every “simple” gig.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="cast">
      <div class="wrap">
        <div class="head" data-rise>
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
        <p class="muted" data-rise style="margin-top:1.75rem;max-width:66ch">Also in the ABC Squad orbit: <strong>Brock Turismo</strong> (Isaac Corrigan), the wheelman, and <strong>Gemma Gazelle</strong> (Emily Kahl). Call sheets and actor guides run deeper than this grid.</p>
      </div>
    </section>

    <section class="sec" id="world">
      <div class="wrap">
        <div class="beside beside--flip" data-rise>
          <div class="visual" style="aspect-ratio:4/3"><img src="../assets/img/cyberrealm-logo.jpeg" alt="The Cyber Realm insignia" width="2000" height="1748" style="object-fit:contain;padding:2rem;background:#000" loading="lazy"/></div>
          <div>
            <p class="eyebrow">The world underneath</p>
            <h2>The game has an owner.</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>Sidequest is the public storefront of the Cyber Realm — a universe of code built by the Trojan Stallion, the world’s most dangerous hacker, to outlive his body. Its economy is K.U.M and XP; its origin is a Nigerian orphan’s bargain with the Igbo death-deity Ogbunabali. Adam never asks who built the game. That is the point.</p>
              <p>A 136-page world bible and 187 pages of actor guides sit under the show — the floor, not the pitch. Spin-offs seeded: a Cain and Nelson crime drama, an FBI procedural, the Trojan Stallion origin, an ARG marketplace, interactive episodes.</p>
              <p>A franchise bible is also an asset register. It is what the IP workspace in <a href="${PURE}">Pure Alacrity</a> was built to hold — a production problem becoming a software feature.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="status">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Status</p><h2>In post, aimed at October 2026.</h2></div>
          <p class="lede">Shot in summer 2025 with additional photography that November. Season 1 Part 1 principal is complete: 14 shoot days, dual-camera 4K, 378 clips and 7.5 hours in the vault.</p>
        </div>
        <div class="grid-3" data-rise>
          <div class="lines"><div><h3>Oct 2026 · release aim</h3><p>Free streaming, with a branching pilot cut from the show’s own choice interface so discovery does not need a login wall.</p></div></div>
          <div class="lines"><div><h3>Next · Season 2 and spin-offs</h3><p>More episodes as the audience finds the world — this time with the production software running the pipeline end to end, not only post.</p></div></div>
          <div class="lines"><div><h3>A correction worth making</h3><p>Sidequest was not made on Pure Alacrity. The software post-dates the shoot: this season is where its specification came from, and it runs the show’s post today. Built out of Sidequest, not for it.</p></div></div>
        </div>
      </div>
    </section>

${close('Press Start.', 'Sidequest is the flagship. The software is what it forced us to build. Right Here Right Now! is the proof that branching ships.', '<a class="btn" href="right-here-right-now.html">See Right Here Right Now!</a> <a class="link" href="../contact.html?topic=Investor%20%2F%20partner">Partner with us</a>')}`
};

/* ───────────────────────────────────────────── rhrn ───────────────────── */

const rhrn = {
  slug: 'work/right-here-right-now.html',
  current: 'work',
  title: 'Right Here Right Now! — Interactive VR Cinema · D.C Alacrity',
  ogImage: 'assets/img/rhrn-card.jpg',
  description: 'Right Here Right Now!: North Carolina’s first interactive live-action VR film from D.C Alacrity. Free on Meta Horizon and SideQuest — and the title that proved the story-graph-to-runtime pipeline.',
  ogTitle: 'Right Here Right Now! — D.C Alacrity',
  ogDescription: 'Interactive live-action VR cinema. You are Lucas. Every choice echoes.',
  body: `${phero({ plate: 'assets/img/rhrn-card.jpg', eyebrow: 'Interactive VR cinema · released', title: 'Right Here Right Now!', lede: 'North Carolina’s first interactive live-action VR film. A picnic turns violent. You are Lucas. Every choice echoes through the warehouse, the confrontation, and the ending you earn.', actions: '<a class="btn" href="rhrn.html">Enter the experience site</a> <a class="link" href="../technology.html">The technology behind it</a>' })}

    <section class="sec" style="padding-top:clamp(3rem,6vw,5rem)">
      <div class="wrap">
${facts([['16', 'scene nodes (V1)'], ['22', 'playable paths'], ['11K', 'shot · presented in 4K'], ['Free', 'Meta Horizon · SideQuest']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="beside" data-rise>
          <div>
            <p class="eyebrow">Logline</p>
            <h2>You are Lucas.</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>What starts as a picnic collapses into confrontation when Janaye forces a reckoning — then armed strangers pull the night into a warehouse where silence, confession and courage all cost something different.</p>
              <p><em>Right Here Right Now!</em> is proof that interactive live-action cinema can ship: authored as a story graph, captured in 360°, assembled in Unity with the Alacrity Player, and released to headsets people already own. V1 ships 16 scene nodes across 22 paths and three emotional tracks; V2 targets 60+ nodes and a feature-length runtime on the same pipeline.</p>
            </div>
          </div>
          <div class="visual" style="aspect-ratio:1755/2528;max-height:640px;justify-self:center;width:auto"><img src="../assets/img/rhrn-poster.jpg" alt="Right Here Right Now! poster — Lucas surrounded by the film’s branching scenes. Live or die? Your choice." width="1000" height="1440" loading="lazy"/></div>
        </div>
      </div>
    </section>

    <section class="sec" id="set">
      <div class="wrap">
        <figure class="with-caption" data-rise><div class="visual" style="aspect-ratio:16/9"><img src="../assets/img/rhrn-bts.jpg" alt="On set: Janaye in the warehouse scene, the Insta360 Titan rig in the foreground" width="1600" height="1063" loading="lazy"/></div><figcaption class="caption" style="margin-top:.75rem">On set — the warehouse. The Insta360 Titan in the foreground shoots the whole room at once; the actors play to it, not to a lens.</figcaption></figure>
      </div>
    </section>

    <section class="sec" id="pipeline">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Pipeline</p><h2>How interactive cinema actually ships.</h2></div>
          <p class="lede">Every step here is a piece of the company’s technology doing the job it was built for. This film is the graph that established the capability the rest of the company is built on.</p>
        </div>
        <div class="beside" data-rise style="margin-bottom:3rem">
          <div class="visual" style="aspect-ratio:3/2"><img src="../assets/img/rhrn-tools.jpg" alt="The tools: two Insta360 Titan 360° cameras and a Canon R on the bench" width="1600" height="1089" loading="lazy"/></div>
          <div class="lines">
            <div><h3>Two Titans and a Canon</h3><p>Eight lenses each, shooting up to 11K around the actor. The flat camera covers the inserts a 360° rig cannot.</p></div>
            <div><h3>Every branch is a shooting day</h3><p>The story graph was the schedule. A choice the audience makes is a scene the crew had to shoot both sides of.</p></div>
          </div>
        </div>
        <div class="path" data-rise>
          <div><p class="k">Capture</p><h3>Insta360 Titan + Canon R</h3><p>Shot up to 11K, presented in 4K 360°. Live-action plates.</p></div>
          <div><p class="k">Author</p><h3>Story graph</h3><p>The branching structure written in Pure Alacrity.</p></div>
          <div><p class="k">Compile</p><h3>One bundle</h3><p>Colour in DaVinci Resolve; packaged for the Alacrity Player.</p></div>
          <div><p class="k">Run</p><h3>Unity · Quest</h3><p>Meta Quest ready, VRC verified, ambisonic and 7.1 binaural sound.</p></div>
          <div><p class="k">Deliver</p><h3>Meta Horizon · SideQuest</h3><p>Free on both.</p></div>
        </div>
      </div>
    </section>

    <section class="sec" id="why">
      <div class="wrap">
        <div class="beside" data-rise>
          <div>
            <p class="eyebrow">Why it matters</p>
            <h2>Proof before the pitch.</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>When Netflix made <em>Bandersnatch</em>, no tool existed for writing a branching-narrative script. The one they built in-house produced a flowchart that was exported to a spreadsheet and implemented by hand across hundreds of footage segments. If the largest streamer on earth ended at a spreadsheet, the layer under interactive live action genuinely does not exist yet.</p>
              <p><em>Right Here Right Now!</em> is our answer to “show me”: a finished title on store shelves, a documented pipeline, and the <a href="../technology.html">production software</a> other filmmakers can use for free. <a href="prize-pool.html">Prize Pool VR</a> is the next title on the same stack.</p>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data">
              <thead><tr><th>Selected credits</th><th></th></tr></thead>
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
      </div>
    </section>

${close('Play it. Then talk scale.', 'Free on headset. Serious production partners welcome for V2 and beyond.', '<a class="btn" href="rhrn.html">Enter the experience</a> <a class="link" href="../contact.html?topic=Investor%20%2F%20partner">Partner inquiry</a>')}`
};

/* ───────────────────────────────────────────── prize pool ─────────────── */

/* The nine endings, by share of all 5,535 routes — measured by walking every
   route through the seventh draft's graph, not designed. A ranked list first
   and a chart second: with no CSS it still reads as the numbers it is. */
const ENDINGS = [
  ['The Fountain', 23.1, 'Nobody fired and nobody stepped in. No name on the board.'],
  ['Burned', 21.6, 'You kept it, and the board plays the night back to the whole rope.'],
  ['The Split', 17.3, 'You said share, and it was not enough.'],
  ['They Went With You', 9.3, 'You stepped in, it took between you, and they split it on the fountain lip.'],
  ['Taken', 8.9, 'You handed it across, and they list what they found out about you tonight.'],
  ['The Trusting', 7.6, 'She trusted him blind. Ko collects.'],
  ['The Clean Hand', 5.8, 'You won, you shared it, your hands are clean or paid for, and your side is at the rope.'],
  ['The House Stands', 4.8, 'You stepped in with clean hands, and nobody is dead because of you.'],
  ['King of Nothing', 1.5, 'You kept it and nobody ever saw you. A million dollars and nobody to carry it with.']
];

const prizePool = {
  slug: 'work/prize-pool.html',
  current: 'work',
  title: 'Prize Pool VR — D.C Alacrity',
  description: 'Prize Pool VR — a branching live-action VR180 social thriller. A campus water-gun game gets a million-dollar prize; 41 unbroken takes, 9 endings, 5,535 routes, 12½–17½ minutes a viewing. From D.C Alacrity.',
  ogTitle: 'Prize Pool VR — D.C Alacrity',
  ogDescription: 'A campus water-gun game gets a million-dollar prize. Two strangers end up the last two players at a fountain — and one of them has to fire.',
  body: `${phero({ plate: 'assets/img/prize-pool-placeholder.jpg', lead: true, eyebrow: 'Branching live-action VR180 · social thriller · in pre-production', title: 'Prize Pool VR', lede: 'A campus water-gun game gets a million-dollar prize. Two strangers who shouldn’t trust anyone end up the last two players at a fountain — and one of them has to fire.', actions: '<a class="btn" href="../contact.html?topic=Investor%20%2F%20partner">Partner / invest</a> <a class="link" href="right-here-right-now.html">See the proof: Right Here Right Now!</a>' })}

    <section class="sec sec--lead">
      <div class="wrap">
        <figure class="with-caption" data-rise><div class="visual" style="aspect-ratio:3/2"><img src="../assets/img/prize-pool-placeholder.jpg" alt="Key art for Prize Pool VR" width="1536" height="1024"/></div><figcaption class="caption" style="margin-top:.75rem">Key art in progress. The film is written, mapped and scheduled; photography is next.</figcaption></figure>
${facts([['41', 'scenes, each one unbroken take'], ['9', 'endings, from 19 choices'], ['5,535', 'distinct routes through it'], ['12½–17½', 'minutes a viewing']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="beside" data-rise>
          <div>
            <p class="eyebrow">The premise</p>
            <h2>Eleven years of a harmless tradition, and a will nobody expected.</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p>Somebody died and left a campus water-gun game a million dollars. Eleven years of five-grand pots and pizza became a manhunt run on a four-page waiver nobody has read since it was printed.</p>
              <p>Its last two lines had been a joke for a decade. <strong>Rule 14: the pot is paid to one name.</strong> <strong>Rule 15: a player is out when a player is wet</strong> — and nobody cares where the water came from.</p>
              <p>Every gun carries a tracker. Fire it and every remaining player sees exactly where you are for thirty seconds. In a game about five grand that is a laugh; in a game about a million it is the difference between winning and being hunted by everyone at once. So nobody shoots on sight. Everybody talks. That is the whole film.</p>
            </div>
          </div>
          <div class="lines">
            <div><h3>You choose who to be</h3><p>Four hours before the last ring, two strangers walk into each other in the sign-up queue, two feet in front of you. She goes left. He goes right. You turn your head, and from there you are inside one pair of eyes, and everyone who talks to you talks to <em>you</em>.</p></div>
            <div><h3>He has a hold on his account</h3><p><strong>Eli Shaw</strong> reads a room in two seconds and gives it what it wants. On his phone, uncleared since Tuesday: an enrolment hold for $6,140. Every door on his route is a way to be rid of the three friends who will not stop talking.</p></div>
            <div><h3>She has a lease nobody knows about</h3><p><strong>Maya Okonkwo</strong> is the fast one — her house said so. Under the game map on her phone is a studio over a laundromat with one name on it. Every door on her route is a way out of that house.</p></div>
          </div>
        </div>
        <p class="caption" style="margin-top:1.25rem">Character names are working names and may change before release.</p>
      </div>
    </section>

    <section class="sec sec--paper paper" id="mirror">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">The shot the film was built around</p><h2>Two-thirds of the way through every route, you look at who you have become.</h2></div>
          <p class="lede">In the nursery beds behind the greenhouse, the lit glass at the wrong angle stops being a window and becomes a black mirror. The face at eye height, flushed from the run, is yours.</p>
        </div>
        <p class="statement" data-fill data-rise>${fill([['It is also, exactly, the Dark Night of the Soul', true], ['— the beat where the hero faces what they have turned into. The most structurally correct moment in the script is the one that only exists because the camera is your head.']])}</p>
      </div>
    </section>

    <section class="sec" id="endings">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Nine endings</p><h2>How the 5,535 routes actually land.</h2></div>
          <p class="lede">Not a guess. Every route through the graph was walked and counted, so the odds below are measured, not designed. In eight of the nine somebody walks away with a million dollars. In one, nobody does.</p>
        </div>
        <ol class="endings" data-rise aria-label="The nine endings, by share of all 5,535 routes">
${ENDINGS.map((e) => `          <li style="--w:${(e[1] / ENDINGS[0][1] * 100).toFixed(1)}"><span class="endings__name">${e[0]}</span><span class="endings__bar"><i></i></span><span class="endings__pc">${e[1].toFixed(1)}%</span><span class="endings__say">${e[2]}</span></li>`).join('\n')}
        </ol>
        <p class="caption" style="margin-top:1.25rem">About one route in seventeen ends with hands that are clean or paid for, your own side at the rope, and a share promised out loud by name. It is the route where you were decent at every turn that mattered — which is not hard, and is not what most people do.</p>
      </div>
    </section>

    <section class="sec sec--line" id="memory">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">What the story remembers</p><h2>Eight facts, and one reading of three of them.</h2></div>
          <p class="lede">Not meters that drift. Eight yes-or-no questions the film answers about you as you go, and nineteen logic nodes that test them. None of the nineteen is ever shot.</p>
        </div>
        <div class="grid-2" data-rise>
          <div class="lines">
            <div><h3>Clean</h3><p>Have you betrayed nobody, and killed nobody?</p></div>
            <div><h3>Seen</h3><p>Does the campus have you on record?</p></div>
            <div><h3>Close</h3><p>Did it take, between the two of you?</p></div>
            <div><h3>Trusted blind</h3><p>Did Maya trust him without testing him?</p></div>
          </div>
          <div class="lines">
            <div><h3>Team</h3><p>Does your own side still have you?</p></div>
            <div><h3>Paid</h3><p>Did you give up something that was yours, for somebody who could not pay you back?</p></div>
            <div><h3>Cost a life</h3><p>Is somebody dead because of a choice you made?</p></div>
            <div><h3>Won</h3><p>Did you win it?</p></div>
          </div>
        </div>
        <p class="caption" style="margin-top:1.5rem">There is no ninth fact. When the ring closes, if your hands are dirty, you never paid, and it never took between you — the other player left at the fountain is Ko, who runs the three-time champions, dry and unhurried, and who does not mind which. That happens on 22.7% of routes.</p>
      </div>
    </section>

    <section class="sec" id="production">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">The production</p><h2>Shot on location, planned scene by scene.</h2></div>
          <p class="lede">Prize Pool VR is an exterior, on-location production. Every scene, location and call is planned in the same document as the script and the story graph, so the plan and the story cannot drift apart.</p>
        </div>
        <div class="grid-2" data-rise>
          <div class="lines">
            <div><h3>Built for the format</h3><p>The two protagonists cross in the same places, so a mirrored pair of scenes can share one setup. The story was shaped around that from the first draft, which keeps a branching film practical to shoot.</p></div>
          </div>
          <div class="lines">
            <div><h3>A world you can hold in your head</h3><p>Natural light and real places, and a geography a viewer can follow: the quad at the start and the quad at the end, with the same folding table in both.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec--line" id="pipeline">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Built in our own software</p><h2>The script, the graph and the board are one document.</h2></div>
          <p class="lede">Prize Pool VR is written, mapped and scheduled inside Pure Alacrity, and exported to Unity through Alacrity Player — the same pipeline that shipped Right Here Right Now!</p>
        </div>
        <div class="grid-3" data-rise>
          <div class="lines"><div><h3>One script, two readers</h3><p>The interactive format carries real pathway and choice lines beside the standard set, so the same file is a screenplay a human reads and a graph the engine walks.</p></div></div>
          <div class="lines"><div><h3>The logic travels</h3><p>Eight typed facts with starting values, nineteen conditions and the effects on every link export with the map, so the build arrives knowing what the story remembers.</p></div></div>
          <div class="lines"><div><h3>The board is the same object</h3><p>Scenes, locations and the per-scene cast come off the same document the script is in — so the schedule and the graph cannot disagree.</p></div></div>
        </div>
      </div>
    </section>

${close('Follow the Architect.', 'The script is locked, the graph is walked and the board is laid. What is open is photography in North Carolina, and the people to make it with.', '<a class="btn" href="../contact.html?topic=Investor%20%2F%20partner">Investor / partner inquiry</a> <a class="btn btn--quiet" href="../contact.html?topic=Crew%20%2F%20collaborator">Crew &amp; collaborators</a> <a class="link" href="index.html">Back to the work</a>')}`
};

/* ───────────────────────────────────────────── wilmy ──────────────────── */

const wilmy = {
  slug: 'work/welcome-to-wilmy.html',
  current: 'work',
  title: 'Welcome to Wilmy — Cape Fear Documentary · D.C Alacrity',
  description: 'Welcome to Wilmy: a Cape Fear surf and beach culture documentary from D.C Alacrity, in production under a City of Wilmington permit.',
  ogTitle: 'Welcome to Wilmy — D.C Alacrity',
  ogDescription: 'Cape Fear surf and beach culture — a portrait of the coast from Wilmington. In production.',
  ogImage: 'assets/img/welcome-to-wilmy.jpg',
  body: `${phero({ plate: 'assets/img/welcome-to-wilmy.jpg', lead: true, eyebrow: 'Documentary · Wilmington · in production', title: 'Welcome to Wilmy', lede: 'A portrait of Cape Fear surf and beach culture — the surfers, shop owners, board builders and beach-day regulars who make the coast feel like itself — shot under a City of Wilmington permit.', actions: '<a class="btn" href="../contact.html?topic=Client%20%2F%20commercial">Get your shop in frame</a> <a class="link" href="../services.html#destination">Destination packages</a>' })}

    <section class="sec sec--lead">
      <div class="wrap">
        <figure class="with-caption" data-rise><div class="visual" style="aspect-ratio:16/9"><img src="../assets/img/welcome-to-wilmy.jpg" alt="An interview on the Cape Fear coast" width="1024" height="576" style="object-position:center 20%"/></div><figcaption class="caption" style="margin-top:.75rem">Production still — coast interview day.</figcaption></figure>
${facts([['City permit', 'Wilmington production access'], ['Cape Fear', 'the coast as a character'], ['In production', 'interviews and observational days'], ['One crew', 'art and commerce together']])}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="beside" data-rise>
          <div>
            <p class="eyebrow">The film</p>
            <h2>Not a brochure. A portrait.</h2>
            <div class="prose" style="margin-top:1.25rem">
              <p><em>Welcome to Wilmy</em> follows the people who make Cape Fear feel like itself — surfers, shop owners, board builders, beach-day regulars, and the quiet rituals between dawn patrol and last light.</p>
              <p>The tone stays observational and warm: salt, wood, caffeine, and the small economies that keep a beach town honest. Shot under a City of Wilmington permit — production access for public coastal storytelling, not guerrilla B-roll.</p>
            </div>
          </div>
          <div class="lines">
            <div><h3>Surf culture</h3><p>Dawn patrol to last glass. Sessions, board talk, and the people who treat the water like a second schedule.</p></div>
            <div><h3>Local business</h3><p>Board shops, cafes, rentals and beach brands filmed as characters, not product placements.</p></div>
            <div><h3>Place</h3><p>Ferry light, pier weather, off-season quiet — the shoreline held in frame long enough to feel.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="why">
      <div class="wrap">
        <div class="head" data-rise>
          <div><p class="eyebrow">Why a documentary sits on this slate</p><h2>The one project with no branching in it.</h2></div>
          <p class="lede">It keeps a crew working between interactive productions, it builds a real relationship with the local economy the commercial unit serves, and it is a useful check that the tools are good for ordinary filmmaking too. Businesses that appear on screen can commission destination and brand films from the same crew.</p>
        </div>
      </div>
    </section>

${close('Seen on screen? Let’s talk.', 'If your Wilmington or Cape Fear business appeared — or should — destination packages and brand films are open now.', '<a class="btn" href="../contact.html?topic=Client%20%2F%20commercial">Book a consult</a> <a class="link" href="../services.html#destination">Destination packages</a>')}`
};

export default [index, sidequest, rhrn, prizePool, wilmy];
