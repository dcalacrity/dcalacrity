/* ═══════════════════════════════════════════════════════════════════════════
   $IDEQU3ST: THE JOB BOARD. A browser mini game set in the world of Sidequest.
   Adam's Episode 1 objective, played for real: turn $8,000 into $50,000 in
   three weeks. One choice a day: a contract, the Mystery Box, a grocery shift
   or laying low. Build a crew, survive the twist in every job, keep Heat under
   100 and keep Mom believing you. Setup-level canon only: no spoilers.
   State is saved per browser so a run can be resumed.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var root = document.querySelector("[data-sq-game]");
  if (!root) return;

  var RATE = 10.15, GOAL = 50000, DAYS = 21, START_CASH = 8000, RENT = 700, SHIFT = 118;
  var RANKS = [
    { n: "New User", xp: 0, slots: 2 }, { n: "Quester", xp: 250, slots: 3 }, { n: "Pro", xp: 700, slots: 3 },
    { n: "Elite", xp: 1400, slots: 4 }, { n: "Legend", xp: 2400, slots: 4 }
  ];
  var SKILLS = { TALK: "Talk", DRIVE: "Drive", PLAN: "Plan", CHAOS: "Chaos", HACK: "Hack", LOCK: "Lock", MUSCLE: "Muscle" };
  var CREW = [
    { id: "adam", name: "Adam", role: "The Networker", skill: "TALK", start: true, lead: true },
    { id: "brock", name: "Brock", role: "The Driver", skill: "DRIVE", start: true },
    { id: "chester", name: "Chester", role: "The Brains", skill: "PLAN", start: true },
    { id: "diego", name: "Diego", role: "The Wild Card", skill: "CHAOS", start: true, note: "Can cover one missing skill. Nobody, including Diego, knows how it’ll go." },
    { id: "felicia", name: "Felicia", role: "The Hacker", skill: "HACK", rank: 1 },
    { id: "gemma", name: "Gemma", role: "The Locksmith", skill: "LOCK", rank: 1 },
    { id: "eric", name: "Eric", role: "The Muscle", skill: "MUSCLE", rank: 2 }
  ];
  var RECRUIT = {
    felicia: { title: "Talk Felicia into it", where: "The coffee shop", text: "She’s on the phone convincing an IT department she’s an intern named Carly. She hangs up and tells you you’re reckless, overconfident and in way over your heads.", done: "Then she joins anyway, because she can’t resist being right. HACK unlocked." },
    gemma: { title: "Find Gemma at a house party", where: "Upstairs, someone else’s closet", text: "You find her sitting on the floor of a stranger’s closet, cheerfully picking the lock on a safe. She hugs every one of you.", done: "“I’m in! Where’s Diego?” LOCK unlocked." },
    eric: { title: "Find Eric at Memory Lake", where: "Memory Lake, sunset", text: "He’s skipping stones and talking to someone who isn’t there. He doesn’t turn around when you say his name.", done: "“Who do I have to hit?” MUSCLE unlocked." }
  };

  /* contracts. base = chance with every needed skill covered */
  var JOBS = [
    { id: "pet", tier: 1, title: "Lost & Found", tag: "Errand", needs: ["TALK"], kum: 65, xp: 90, base: 82, heat: 2, brief: "A family’s dog has been missing for a week. They’ll pay to get him home, and they don’t care how.",
      twist: { q: "You find the dog. He’s living his best life with a new family, a pool and a personal chef.", a: { t: "Return him anyway. A job’s a job.", e: {} }, b: { t: "Leave a note, take half, walk away", e: { pay: 0.5, heat: -2, trust: 3 } } } },
    { id: "valet", tier: 1, title: "Valet Shuffle", tag: "Driving", needs: ["DRIVE"], kum: 95, xp: 105, base: 78, heat: 5, brief: "Move a car across town before its owner gets back from dinner. The keys are under the mat. Don’t ask.",
      twist: { q: "Full tank. Empty highway. Brock’s hands are already on the wheel.", a: { t: "Stay under the limit", e: { ch: 8 } }, b: { t: "Open it up", e: { ch: -8, pay: 1.35, heat: 5 } } } },
    { id: "seminar", tier: 1, title: "Seat Filler", tag: "Legal-ish", needs: ["TALK"], kum: 40, xp: 70, base: 92, heat: 0, brief: "A motivational guru needs a crowd that claps on cue. Wear a lanyard. Look inspired.",
      twist: { q: "The guru points straight at you: “Are you a VIC-tim or a VIC-tor?”", a: { t: "“VIC-TOR!”", e: { pay: 1.3, xp: 1.2 } }, b: { t: "Stare at your shoes", e: {} } } },
    { id: "cuddle", tier: 1, title: "Professional Cuddler", tag: "Legal-ish", needs: ["TALK"], kum: 30, xp: 60, base: 90, heat: 0, brief: "$200 an hour. The listing asks for a PhD in psychology. You have a confident attitude and a font that looks like a PhD.",
      twist: { q: "You were expecting “Jocelyn.” Her husband opens the door in a bathrobe.", a: { t: "“Come on in, Dr. Cuddles.”", e: { ch: 5, pay: 1.2 } }, b: { t: "Back away slowly", e: { pay: 0, xp: 0.5 } } } },
    { id: "parlay", tier: 1, title: "Envelope Run", tag: "Delivery", needs: ["PLAN"], kum: 85, xp: 105, base: 78, heat: 5, brief: "Carry a sealed envelope to a bookie across town. Don’t open it. Don’t be late.",
      twist: { q: "Chester has opened it. He wants to put the whole envelope on a four-way parlay on professional tag.", a: { t: "Absolutely not", e: {} }, b: { t: "Let him cook", e: { gamble: true } } } },
    { id: "stakeout", tier: 1, title: "Eight-Hour Stakeout", tag: "Surveillance", needs: ["DRIVE"], kum: 70, xp: 90, base: 84, heat: 3, brief: "Sit in a parked car and log who comes and goes from one house. Bring snacks. Bring patience.",
      twist: { q: "Hour six. Diego has eaten all the snacks and is now eyeing the dashboard.", a: { t: "Stay put and suffer", e: { ch: 5 } }, b: { t: "Quick snack run", e: { ch: -10, trust: 0, xp: 1.2 } } } },

    { id: "laptop", tier: 2, title: "Rooftop Retrieval", tag: "Recovery", needs: ["LOCK", "TALK"], kum: 225, xp: 225, base: 70, heat: 10, brief: "A scammer took a grandmother’s laptop and her savings with it. Get it back from his apartment while he’s at the gym.",
      twist: { q: "There’s a second laptop in there. And a safe.", a: { t: "Just the laptop. In and out.", e: { ch: 5 } }, b: { t: "Crack the safe too", e: { ch: -14, pay: 1.6, heat: 4 } } } },
    { id: "phish", tier: 2, title: "Phishing the Phishers", tag: "Cyber", needs: ["HACK"], kum: 255, xp: 240, base: 68, heat: 9, brief: "A scam call center has been draining retirees. Drain it back. The broker keeps a fee. So do you.",
      twist: { q: "Felicia says she can finish twice as fast if everybody stops talking and somebody brings her coffee.", a: { t: "Get her a coffee. Shut up.", e: { ifSkill: { s: "HACK", ch: 12, no: -6 } } }, b: { t: "Frame a rival crew for it", e: { ch: -6, heat: -6, xp: 1.2 } } } },
    { id: "getaway", tier: 2, title: "2 A.M. Pickup", tag: "Driving", needs: ["DRIVE", "PLAN"], kum: 240, xp: 225, base: 68, heat: 12, brief: "A client needs a ride from a building he shouldn’t be in. No questions. Engine running.",
      twist: { q: "Sirens, two blocks back and closing.", a: { t: "Kill the lights. Side streets.", e: { ch: 6, heat: -4 } }, b: { t: "Floor it", e: { pay: 1.3, heat: 8, ifSkill: { s: "DRIVE", ch: 4, no: -15 } } } } },
    { id: "heirloom", tier: 2, title: "House Party Heirloom", tag: "Recovery", needs: ["LOCK", "CHAOS"], kum: 210, xp: 225, base: 72, heat: 8, brief: "A family ring ended up in a safe at a house party. Blend in, go upstairs, come back down with it.",
      twist: { q: "Somebody’s blocking the stairs, and he really wants to talk about crypto.", a: { t: "Diego creates a distraction", e: { ifCrew: { c: "diego", ch: 12, no: -8 } } }, b: { t: "Adam out-talks him", e: { ifSkill: { s: "TALK", ch: 8, no: -8 } } } } },
    { id: "collections", tier: 2, title: "Polite Collections", tag: "Persuasion", needs: ["TALK", "MUSCLE"], kum: 250, xp: 240, base: 68, heat: 11, brief: "A landlord is owed three months. He wants it collected politely. He says “politely” twice.",
      twist: { q: "The tenant is a single dad with a sick kid.", a: { t: "Collect anyway", e: { trust: -6 } }, b: { t: "Pay it from your cut and lie to the broker", e: { pay: 0.4, trust: 6, xp: 1.3 } } } },

    { id: "repo", tier: 3, title: "Escrow Dispute", tag: "Repossession", needs: ["DRIVE", "LOCK", "HACK"], kum: 610, xp: 480, base: 62, heat: 16, brief: "A user won a supercar on Sidequest and never paid escrow. Bring it back to the broker by morning.",
      twist: { q: "It’s a Hellcat. Megan’s ex drove a Hellcat.", a: { t: "Deliver it like a professional", e: { ch: 4 } }, b: { t: "One lap past her apartment first", e: { ch: -10, pay: 1.15, heat: 6, xp: 1.4 } } } },
    { id: "slides", tier: 3, title: "Boardroom Leverage", tag: "Espionage", needs: ["HACK", "TALK"], kum: 640, xp: 480, base: 60, heat: 14, brief: "An executive wants a rival’s pitch deck before Friday. He calls it “competitive research.”",
      twist: { q: "The files show your client is the one cooking the books.", a: { t: "Deliver the deck. Not your business.", e: {} }, b: { t: "Deliver it and leak his books to the press", e: { pay: 0.8, heat: -10, trust: 4, xp: 1.3 } } } },
    { id: "donkey", tier: 3, title: "The Donkey Job", tag: "Transport", needs: ["DRIVE", "CHAOS"], kum: 545, xp: 450, base: 62, heat: 18, brief: "Escort one very calm donkey across three counties. Do not ask what’s inside the donkey.",
      twist: { q: "The donkey stops in the middle of a two-lane road and will not move.", a: { t: "Let Diego talk to it", e: { ifCrew: { c: "diego", ch: 16, no: -12 } } }, b: { t: "Wait it out", e: { heat: 6, ch: 2 } } } },
    { id: "warehouse", tier: 3, title: "Warehouse Inventory", tag: "Heist", needs: ["LOCK", "MUSCLE", "PLAN"], kum: 670, xp: 510, base: 58, heat: 17, brief: "A warehouse that exists nowhere is holding something a client wants back. The guard changes at 1:33 AM.",
      twist: { q: "The lights come on with a BOOM. Nobody planned for that.", a: { t: "Freeze. Chester has a backup plan.", e: { ifSkill: { s: "PLAN", ch: 10, no: -10 } } }, b: { t: "Run with what you’ve got", e: { pay: 0.7, ch: 8 } } } },

    { id: "penthouse", tier: 4, title: "The Penthouse", tag: "Heist", needs: ["LOCK", "HACK", "MUSCLE", "PLAN"], kum: 1440, xp: 975, base: 54, heat: 25, brief: "A wealthy retiree wants a rival’s vault emptied while he’s at the opera. He condemns lazy youth criminals at dinner parties.",
      twist: { q: "The vault has a second door. The second door has a camera.", a: { t: "Loop the camera", e: { ifSkill: { s: "HACK", ch: 14, no: -14 } } }, b: { t: "Smash and grab", e: { pay: 1.4, heat: 14, ch: -6 } } } },
    { id: "coop", tier: 4, title: "Co-Op Takedown", tag: "Co-Op", needs: ["MUSCLE", "DRIVE", "PLAN"], kum: 1375, xp: 1050, base: 52, heat: 24, brief: "Three crews, one target, one payout. The broker spun this one from the Mystery Box himself.",
      twist: { q: "One of the other crews is clearly planning to cut you out at the end.", a: { t: "Cut them out first", e: { pay: 1.35, heat: 8, trust: -4 } }, b: { t: "Play it straight", e: { ch: 8 } } } },
    { id: "dream", tier: 4, title: "The Dream Job", tag: "Legendary", needs: ["TALK", "DRIVE", "HACK", "LOCK"], kum: 2160, xp: 1500, base: 44, heat: 32, brief: "The one Adam keeps dreaming about: the whole ABC Squad in one apartment, laughing, planning a $70,000 job.",
      twist: { q: "Mid-job, the HUD glitches. A voice cuts through the static: “Adam, what are you doing?”", a: { t: "Keep going", e: { ch: -4, pay: 1.2 } }, b: { t: "Stop and listen", e: { pay: 0.6, heat: -14, trust: 8, xp: 1.4 } } } }
  ];
  var byJob = {}; JOBS.forEach(function (j) { byJob[j.id] = j; });

  /* ── state ──────────────────────────────────────────────────────────── */
  var KEY = "sq-jobboard-v1", BEST = "sq-jobboard-best";
  var S = null;
  var fresh = function () {
    var unlocked = {}; CREW.forEach(function (c) { if (c.start) unlocked[c.id] = true; });
    return { day: 1, cash: START_CASH, xp: 0, rating: 0, rated: 0, heat: 0, trust: 80, unlocked: unlocked, rest: {}, board: null, log: [], done: 0, fails: 0, screen: "board", pending: null, over: null, shifted: 0 };
  };
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked */ } };
  var load = function () { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
  var best = function () { try { return JSON.parse(localStorage.getItem(BEST) || "null"); } catch (e) { return null; } };

  var rankIx = function () { var r = 0; RANKS.forEach(function (k, i) { if (S.xp >= k.xp) r = i; }); return r; };
  var tierCap = function () { return Math.min(4, rankIx() + 1); };
  var available = function (id) { return S.unlocked[id] && !(S.rest[id] > S.day); };
  var crewOf = function (ids) { return CREW.filter(function (c) { return ids.indexOf(c.id) > -1; }); };
  var money = function (n) { return (n < 0 ? "−$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US"); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var rnd = function (n) { return Math.floor(Math.random() * n); };
  var pick = function (a) { return a[rnd(a.length)]; };

  /* ── odds ───────────────────────────────────────────────────────────── */
  var coverage = function (job, ids) {
    var crew = crewOf(ids), have = crew.map(function (c) { return c.skill; });
    var missing = job.needs.filter(function (n) { return have.indexOf(n) < 0; });
    var diego = ids.indexOf("diego") > -1 && job.needs.indexOf("CHAOS") < 0;
    var covered = missing.length && diego ? missing[0] : null;
    return { missing: missing, improvised: covered, extra: Math.max(0, crew.length - job.needs.length) };
  };
  var chance = function (job, ids, eff) {
    var cv = coverage(job, ids), c = job.base;
    c -= cv.missing.length * 20;
    if (cv.improvised) c += 12;           /* Diego covers one gap, badly */
    c += Math.min(cv.extra, 2) * 3;
    c += rankIx() * 2;
    if (S.rated) c += Math.round((S.rating - 3) * 2);
    if (eff) {
      c += eff.ch || 0;
      if (eff.ifSkill) c += crewOf(ids).some(function (m) { return m.skill === eff.ifSkill.s; }) ? eff.ifSkill.ch : eff.ifSkill.no;
      if (eff.ifCrew) c += ids.indexOf(eff.ifCrew.c) > -1 ? eff.ifCrew.ch : eff.ifCrew.no;
    }
    return clamp(Math.round(c), 5, 95);
  };
  var cutOf = function (ids) { return crewOf(ids).filter(function (c) { return !c.lead; }).length * 0.08; };

  /* ── the daily board ────────────────────────────────────────────────── */
  var makeBoard = function () {
    var cap = tierCap(), pool = JOBS.filter(function (j) { return j.tier <= cap; });
    var weighted = [];
    pool.forEach(function (j) { var w = j.tier === cap ? 3 : (j.tier === cap - 1 ? 2 : 1); for (var i = 0; i < w; i++) weighted.push(j.id); });
    var out = [];
    while (out.length < 3 && out.length < pool.length) { var id = pick(weighted); if (out.indexOf(id) < 0) out.push(id); }
    var rec = null;
    ["felicia", "gemma", "eric"].some(function (id) { var c = CREW.filter(function (x) { return x.id === id; })[0]; if (!S.unlocked[id] && rankIx() >= c.rank) { rec = id; return true; } return false; });
    S.board = { jobs: out, recruit: rec };
  };

  /* ── dom ────────────────────────────────────────────────────────────── */
  var el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null && c !== false) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  };
  var hud = root.querySelector("[data-g-hud]"), body = root.querySelector("[data-g-body]");
  var stars = function (r) { var full = Math.round(r); return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full); };
  var meter = function (label, v, cls, txt) {
    return el("div", { class: "g-meter " + cls }, [el("span", { class: "g-meter__k", text: label }), el("span", { class: "g-meter__bar" }, [el("i", { style: "width:" + clamp(v, 0, 100) + "%" })]), el("b", { text: txt })]);
  };

  var renderHud = function () {
    hud.innerHTML = "";
    if (!S) { hud.hidden = true; return; }
    hud.hidden = false;
    var r = rankIx(), next = RANKS[r + 1];
    var heatTxt = S.heat >= 85 ? "Critical" : S.heat >= 60 ? "Team 4B has a file" : S.heat >= 30 ? "Noticed" : "Cold";
    hud.appendChild(el("div", { class: "g-hud__row" }, [
      el("div", { class: "g-stat" }, [el("span", { text: "Day" }), el("b", { text: Math.min(S.day, DAYS) + " / " + DAYS })]),
      el("div", { class: "g-stat g-stat--cash" }, [el("span", { text: "Cash" }), el("b", { text: money(S.cash) })]),
      el("div", { class: "g-stat" }, [el("span", { text: "Rank" }), el("b", { text: RANKS[r].n })]),
      el("div", { class: "g-stat" }, [el("span", { text: "Rating" }), el("b", { class: "g-stars", text: S.rated ? stars(S.rating) : "Unrated" })])
    ]));
    hud.appendChild(meter("$50K", (S.cash / GOAL) * 100, "g-meter--goal", Math.round((S.cash / GOAL) * 100) + "%"));
    hud.appendChild(meter("XP", next ? ((S.xp - RANKS[r].xp) / (next.xp - RANKS[r].xp)) * 100 : 100, "g-meter--xp", next ? S.xp + " / " + next.xp : S.xp + " · max"));
    hud.appendChild(meter("Heat", S.heat, "g-meter--heat" + (S.heat >= 60 ? " is-hot" : ""), heatTxt));
    hud.appendChild(meter("Mom", S.trust, "g-meter--trust", S.trust >= 70 ? "Believes you" : S.trust >= 40 ? "Suspicious" : "Knows"));
  };

  var screen = function (kids, cls) { body.innerHTML = ""; var box = el("div", { class: "g-screen " + (cls || "") }, kids); body.appendChild(box); var f = box.querySelector("[data-focus]") || box.querySelector("h3"); if (f && started) { f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); var r = root.getBoundingClientRect(); if (r.top < 0) root.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); } return box; };
  var started = false;
  var line = function (t, cls) { return el("p", { class: "g-line " + (cls || ""), text: t }); };
  var btn = function (t, fn, cls) { return el("button", { type: "button", class: "g-btn " + (cls || ""), onclick: fn }, [t]); };

  /* ── screens ────────────────────────────────────────────────────────── */
  var title = function () {
    S = null; renderHud();
    var saved = load(), b = best();
    var rules = el("div", { class: "g-rules", hidden: true }, [
      el("p", { html: "<b>Goal:</b> turn $8,000 into $50,000 before day 21. Rent ($700) is due every seven days." }),
      el("p", { html: "<b>One move a day:</b> take a contract, open the Mystery Box (hidden job, 1.5× pay, no backing out), work a grocery shift ($118, cools Heat, Mom approves) or lay low." }),
      el("p", { html: "<b>Crew:</b> each job needs skills. Bring the right people, but every member except Adam takes 8%. Diego can cover one missing skill. Rank up to recruit Felicia, Gemma and Eric." }),
      el("p", { html: "<b>Every job has a twist.</b> Your choice changes the odds, the pay and the Heat." }),
      el("p", { html: "<b>Heat</b> is FBI Team 4B’s attention. It cools a little each day. At 100, they knock. <b>Mom’s trust</b> changes how your story ends." })
    ]);
    var out = el("p", { class: "g-line g-line--hot", "aria-live": "polite" });
    screen([
      el("p", { class: "g-kicker", text: "sidequest.onion · mainstream-illegal protocol v4.0" }),
      el("h3", { class: "g-title", text: "THE JOB BOARD" }),
      line("Three weeks. $50,000. You have $8,000 saved and a $589 a week grocery paycheck. Your mom wants you to earn honest money. Your roommates want you on Sidequest."),
      line("> How about a Sidequest?", "g-line--term"),
      el("div", { class: "g-row" }, [
        btn("START GAME", function () { started = true; begin(false); }, "g-btn--go"),
        saved && !saved.over ? btn("CONTINUE · DAY " + saved.day, function () { started = true; S = saved; route(); }) : null,
        btn("EXIT", function () { out.textContent = "> EXIT unavailable. There is no exit from the game."; }),
        btn("How to play", function (e) { rules.hidden = !rules.hidden; e.currentTarget.setAttribute("aria-expanded", String(!rules.hidden)); }, "g-btn--ghost")
      ]),
      out, rules,
      b ? el("p", { class: "g-best", text: "Your best: " + (b.win ? "$50K in " + b.days + " days" : money(b.cash) + " by day " + b.days) }) : null
    ], "g-screen--title");
  };

  var begin = function () { S = fresh(); makeBoard(); S.screen = "board"; save(); intro(); };
  var intro = function () {
    renderHud();
    screen([
      el("p", { class: "g-kicker", text: "Day 1 · 8:40 AM" }),
      el("h3", { text: "Welcome, New User." }),
      line("A holographic Quest Broker snaps his fingers. Your HUD boots up. Brock, Chester and Diego are on the couch, pretending they weren’t watching."),
      line("NEW OBJECTIVE · GET $50,000 IN 3 WEEKS", "g-line--obj"),
      el("div", { class: "g-row" }, [btn("Open the board", function () { board(); }, "g-btn--go")])
    ]);
  };

  var route = function () {
    if (S.over) return ending(S.over);
    if (!S.board) makeBoard();
    board();
  };

  var jobCard = function (j, opts) {
    var cap = j.tier;
    return el("button", { type: "button", class: "g-job g-job--t" + cap + (opts && opts.mystery ? " g-job--box" : ""), onclick: opts.onclick }, [
      el("span", { class: "g-job__top" }, [el("span", { class: "g-job__tag", text: opts.mystery ? "Mystery Box" : j.tag }), el("span", { class: "g-job__tier", text: opts.mystery ? "? ? ?" : "Tier " + j.tier })]),
      el("span", { class: "g-job__name", text: opts.mystery ? "Spin the randomizer" : j.title }),
      el("span", { class: "g-job__brief", text: opts.mystery ? "A hidden job from up to one tier above you. 1.5× pay and XP. Once the box opens, you can’t back out." : j.brief }),
      el("span", { class: "g-job__meta" }, opts.mystery ? [el("span", { text: "Pay ×1.5" }), el("span", { text: "XP ×1.5" })] : [
        el("span", { text: j.kum + " K.U.M. ≈ " + money(j.kum * RATE) }),
        el("span", { text: "+" + j.xp + " XP" }),
        el("span", { class: "g-heat", text: "Heat +" + j.heat }),
        el("span", { class: "g-needs" }, j.needs.map(function (n) { return el("i", { text: SKILLS[n] }); }))
      ])
    ]);
  };

  var board = function () {
    S.screen = "board"; save(); renderHud();
    var grid = el("div", { class: "g-board" });
    S.board.jobs.forEach(function (id) { var j = byJob[id]; grid.appendChild(jobCard(j, { onclick: function () { crewPick(j, false); } })); });
    var boxTier = Math.min(4, tierCap() + 1);
    grid.appendChild(jobCard({ tier: boxTier }, { mystery: true, onclick: function () {
      var pool = JOBS.filter(function (j) { return j.tier <= boxTier && j.tier >= Math.max(1, boxTier - 1); });
      var j = pick(pool); crewPick(j, true);
    } }));
    var side = el("div", { class: "g-side" }, [
      S.board.recruit ? el("button", { type: "button", class: "g-act g-act--recruit", onclick: function () { recruit(S.board.recruit); } }, [el("b", { text: "Recruit · " + RECRUIT[S.board.recruit].title }), el("span", { text: "Takes the day. Pays nothing. Adds a skill for good." })]) : null,
      el("button", { type: "button", class: "g-act", onclick: shift }, [el("b", { text: "Grocery shift · +" + money(SHIFT) }), el("span", { text: "Legal. Heat −8. Mom +4." })]),
      el("button", { type: "button", class: "g-act", onclick: layLow }, [el("b", { text: "Lay low" }), el("span", { text: "Earn nothing. Heat −20." })])
    ]);
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "Day " + S.day + " · " + (DAYS - S.day + 1) + " days left · " + money(Math.max(0, GOAL - S.cash)) + " to go" }), el("h3", { text: "1 new job available. Pays well. No questions." })]),
      el("div", { class: "g-boardwrap" }, [grid, side]),
      S.log.length ? el("p", { class: "g-last", text: S.log[S.log.length - 1] }) : null
    ]);
  };

  var crewPick = function (job, mystery) {
    S.screen = "crew"; renderHud();
    var slots = RANKS[rankIx()].slots;
    var sel = ["adam"];
    var odds = el("div", { class: "g-odds" });
    var list = el("div", { class: "g-crew" });
    var go;
    var upd = function () {
      var cv = coverage(job, sel), c = chance(job, sel, null);
      odds.innerHTML = "";
      odds.appendChild(el("div", { class: "g-odds__big" }, [el("b", { text: mystery ? "??%" : c + "%" }), el("span", { text: "base odds before the twist" })]));
      odds.appendChild(el("p", { class: "g-odds__note", text:
        (mystery ? "The box hides what the job needs. Bring a balanced crew. " : "") +
        (!mystery && cv.missing.length ? "Missing: " + cv.missing.map(function (m) { return SKILLS[m]; }).join(", ") + (cv.improvised ? " (Diego will improvise " + SKILLS[cv.improvised] + ")" : "") + ". " : (!mystery ? "Every skill covered. " : "")) +
        "Crew cut: " + Math.round(cutOf(sel) * 100) + "%." }));
      [].forEach.call(list.children, function (b) { var on = sel.indexOf(b.getAttribute("data-id")) > -1; b.setAttribute("aria-pressed", String(on)); });
      if (go) go.textContent = mystery ? "Open the box" : "Take the job";
    };
    CREW.forEach(function (c) {
      var locked = !S.unlocked[c.id], resting = S.rest[c.id] > S.day;
      var need = !mystery && job.needs.indexOf(c.skill) > -1;
      var b = el("button", { type: "button", class: "g-mate" + (need ? " is-needed" : ""), "data-id": c.id, disabled: locked || resting || c.lead, "aria-pressed": "false",
        onclick: function () {
          var at = sel.indexOf(c.id);
          if (at > -1) sel.splice(at, 1); else if (sel.length < slots) sel.push(c.id);
          upd();
        } }, [
        el("b", { text: c.name }),
        el("span", { class: "g-mate__skill", text: SKILLS[c.skill] }),
        el("small", { text: locked ? "Not recruited yet" : resting ? "Laying low · back day " + S.rest[c.id] : c.lead ? "Always in" : c.role })
      ]);
      list.appendChild(b);
    });
    go = btn("Take the job", function () { mission(job, sel.slice(), mystery); }, "g-btn--go");
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: (mystery ? "Mystery Box · tier " + job.tier + "?" : job.tag + " · tier " + job.tier) + " · crew slots " + slots }), el("h3", { text: mystery ? "Who’s coming?" : job.title })]),
      mystery ? line("The broker grins. “You pick the crew first. Then you find out what you signed up for.”") : line(job.brief),
      !mystery ? el("p", { class: "g-needs g-needs--big" }, [el("span", { text: "Needs: " })].concat(job.needs.map(function (n) { return el("i", { text: SKILLS[n] }); }))) : null,
      list, odds,
      el("div", { class: "g-row" }, [go, mystery ? null : btn("Back to the board", board, "g-btn--ghost")])
    ]);
    upd();
  };

  var mission = function (job, ids, mystery) {
    S.screen = "mission"; renderHud();
    var crewNames = crewOf(ids).map(function (c) { return c.name; }).join(", ");
    var opt = function (o, key) {
      var e = o.e, c = chance(job, ids, e);
      var bits = [];
      if (e.pay != null && e.pay !== 1) bits.push("pay ×" + e.pay);
      if (e.gamble) bits.push("50/50: ×2.5 or nothing");
      if (e.heat) bits.push("heat " + (e.heat > 0 ? "+" : "") + e.heat);
      if (e.trust) bits.push("mom " + (e.trust > 0 ? "+" : "") + e.trust);
      return el("button", { type: "button", class: "g-opt", onclick: function () { resolve(job, ids, mystery, e, key); } }, [
        el("span", { class: "g-opt__k", text: "OPTION " + key }),
        el("b", { text: o.t }),
        el("small", { text: c + "% odds" + (bits.length ? " · " + bits.join(" · ") : "") })
      ]);
    };
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: (mystery ? "The box opens: " : "") + job.tag + " · crew: " + crewNames }), el("h3", { text: job.title })]),
      mystery ? line(job.brief) : null,
      line("Time slows. A choice appears.", "g-line--term"),
      el("p", { class: "g-twist", text: job.twist.q }),
      el("div", { class: "g-opts" }, [opt(job.twist.a, "A"), opt(job.twist.b, "B")])
    ], "g-screen--mission");
  };

  var resolve = function (job, ids, mystery, e, key) {
    var c = chance(job, ids, e);
    var roll = rnd(100) + 1;
    if (ids.indexOf("diego") > -1) roll = clamp(roll + (rnd(17) - 8), 1, 100);
    var res = roll <= c ? "win" : roll <= c + 12 ? "messy" : "fail";
    var mult = (e.pay == null ? 1 : e.pay) * (mystery ? 1.5 : 1);
    var gambleTxt = "";
    if (e.gamble && res !== "fail") { if (Math.random() < 0.5) { mult *= 2.5; gambleTxt = "The parlay hits. Chester will not stop talking about it."; } else { mult = 0; gambleTxt = "The parlay misses on the last leg. Chester blames the referee."; } }
    if (res === "messy") mult *= 0.6;
    var gross = res === "fail" ? 0 : job.kum * mult;
    var net = Math.round(gross * RATE * (1 - cutOf(ids)));
    var heat = job.heat + (e.heat || 0);
    if (res === "messy") heat = Math.round(heat * 1.5);
    if (res === "fail") heat = Math.round(heat * 1.6) + 4;
    var xp = Math.round(job.xp * (e.xp || 1) * (mystery ? 1.5 : 1) * (res === "fail" ? 0.25 : res === "messy" ? 0.7 : 1));
    var st = res === "win" ? 5 : res === "messy" ? 3 : 1;
    var rankBefore = rankIx();
    S.cash += net; S.heat = clamp(S.heat + Math.max(heat, -30), 0, 100); S.xp += xp;
    S.rating = (S.rating * S.rated + st) / (S.rated + 1); S.rated++;
    S.trust = clamp(S.trust + (e.trust || 0) - (job.tier >= 2 && res !== "win" ? 2 : 0), 0, 100);
    var benched = null;
    if (res === "fail") { var pool = ids.filter(function (i) { return i !== "adam"; }); if (pool.length) { benched = pick(pool); S.rest[benched] = S.day + 3; } S.fails++; } else S.done++;
    S.log.push("Day " + S.day + ": " + job.title + ". " + (res === "win" ? "Clean." : res === "messy" ? "Messy." : "Failed.") + (net ? " " + money(net) + "." : ""));
    var promoted = rankIx() > rankBefore;
    var lines = {
      win: ["Clean. Nobody saw a thing. The broker releases escrow.", "Smooth. Brock is already narrating it like a movie trailer.", "Done. The client leaves five stars and a heart emoji."],
      messy: ["It worked, mostly. Something got broken, someone got seen, and escrow takes a cut for the trouble.", "You got paid, but there’s a blurry photo of Diego online now."],
      fail: ["It goes sideways. The client cancels and the broker freezes escrow.", "Wrong door, wrong night, wrong everything. You run."]
    };
    var name = benched ? CREW.filter(function (x) { return x.id === benched; })[0].name : "";
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "OPTION " + key + " · rolled " + roll + " vs " + c + "%" }), el("h3", { class: "g-res g-res--" + res, text: res === "win" ? "SUCCESS" : res === "messy" ? "MESSY SUCCESS" : "FAILED" })]),
      line(pick(lines[res])), gambleTxt ? line(gambleTxt) : null,
      benched ? line(name + " has to lay low for a few days.", "g-line--warn") : null,
      el("dl", { class: "g-payout" }, [
        el("div", {}, [el("dt", { text: "Payout" }), el("dd", { text: gross ? Math.round(gross) + " K.U.M." : "0 K.U.M." })]),
        el("div", {}, [el("dt", { text: "Crew cut" }), el("dd", { text: Math.round(cutOf(ids) * 100) + "%" })]),
        el("div", {}, [el("dt", { text: "You keep" }), el("dd", { text: money(net) })]),
        el("div", {}, [el("dt", { text: "XP" }), el("dd", { text: "+" + xp })]),
        el("div", {}, [el("dt", { text: "Heat" }), el("dd", { text: (heat >= 0 ? "+" : "") + heat })]),
        el("div", {}, [el("dt", { text: "Rated" }), el("dd", { class: "g-stars", text: stars(st) })])
      ]),
      promoted ? line("RANK UP · " + RANKS[rankIx()].n.toUpperCase() + (RANKS[rankIx()].slots > RANKS[rankBefore].slots ? " · +1 crew slot" : "") + " · new tier of contracts unlocked", "g-line--obj") : null,
      el("div", { class: "g-row" }, [btn(S.cash >= GOAL ? "Claim the car" : "End the day", endDay, "g-btn--go")])
    ]);
    save(); renderHud();
  };

  var recruit = function (id) {
    var r = RECRUIT[id];
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "Recruit · " + r.where }), el("h3", { text: r.title })]),
      line(r.text), line(r.done, "g-line--obj"),
      el("div", { class: "g-row" }, [btn("End the day", endDay, "g-btn--go")])
    ]);
    S.unlocked[id] = true; S.log.push("Day " + S.day + ": recruited " + id.charAt(0).toUpperCase() + id.slice(1) + "."); save();
  };
  var shift = function () {
    S.cash += SHIFT; S.heat = clamp(S.heat - 8, 0, 100); S.trust = clamp(S.trust + 4, 0, 100); S.shifted++;
    S.log.push("Day " + S.day + ": grocery shift. " + money(SHIFT) + ".");
    renderHud();
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "Legal · 6 AM to 2 PM" }), el("h3", { text: "Grocery shift" })]),
      line(pick(["You stock cereal for eight hours. A customer asks if you’re “the Sidequest guy.” You say no.", "Your manager calls you “a real team player.” Your HUD stays dark all day. It’s weirdly peaceful.", "You bag groceries for a man in a camel coat. He tips $20 and winks. Probably nothing."])),
      line("+" + money(SHIFT) + " · Heat −8 · Mom +4", "g-line--obj"),
      el("div", { class: "g-row" }, [btn("End the day", endDay, "g-btn--go")])
    ]);
    save();
  };
  var layLow = function () {
    S.heat = clamp(S.heat - 20, 0, 100); S.trust = clamp(S.trust + 1, 0, 100);
    S.log.push("Day " + S.day + ": laid low.");
    renderHud();
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "Off the grid" }), el("h3", { text: "Laying low" })]),
      line(pick(["Phone off. Couch on. Diego teaches everyone a card game with no rules.", "You call your mom just to talk. She sounds happy. You feel worse.", "You watch the street through the blinds for an hour. Nothing happens. Probably."])),
      line("Heat −20", "g-line--obj"),
      el("div", { class: "g-row" }, [btn("End the day", endDay, "g-btn--go")])
    ]);
    save();
  };

  /* ── between days ───────────────────────────────────────────────────── */
  var EVENTS = [
    { id: "mom", when: function () { return true; }, k: "Incoming call · Mom", q: "“Are you working an honest job? Tell me the truth.”",
      a: { t: "“Yes, Mom.”", run: function () { if (S.heat > 35) { S.trust -= 10; return "She goes quiet. She can hear it in your voice."; } S.trust += 3; return "“I’m proud of you, baby.” That one lands somewhere."; } },
      b: { t: "“It’s complicated.”", run: function () { S.trust -= 6; S.heat -= 6; return "She doesn’t yell. That’s worse. You decide to slow down a little."; } } },
    { id: "radio", when: function () { return true; }, k: "On the radio", q: "A caller says she called Sidequest instead of the police, and got her stolen car back in an hour. The host doesn’t argue.",
      a: { t: "Turn it up", run: function () { return "Everybody uses it. Nobody admits it."; } }, b: { t: "Turn it off", run: function () { return "Silence. Your HUD pings anyway."; } } },
    { id: "coffee", when: function () { return S.day > 2; }, k: "The coffee shop", q: "A smooth-talking guy in line asks what Brock meant when he yelled “We’re doing Sidequest!” He’s holding his phone a little too close to yours.",
      a: { t: "Play dumb", run: function () { if (S.unlocked.felicia) { S.heat -= 8; return "Felicia smiles at him. His screen flickers. He leaves without his latte."; } S.heat += 6; return "He smiles like he’s writing something down."; } },
      b: { t: "Leave. Now.", run: function () { S.cash -= 6; S.heat -= 2; return "You abandon a $6 coffee. It hurts."; } } },
    { id: "jnp", when: function () { return S.cash > 2000; }, k: "A flyer under the door", q: "JEFFREY NAPOLEON-PALMER, THE LION OF WALL STREET: “Become a VIC-tor in 30 days. $500.”",
      a: { t: "Buy the course", run: function () { S.cash -= 500; S.xp += 10; return "+10 XP. It’s mostly him yelling “BROKE!” at a man named Andre."; } },
      b: { t: "Throw it away", run: function () { return "A shark and a minnow walk into a bar. You are not either. You go to bed."; } } },
    { id: "kendall", when: function () { return S.day > 3; }, k: "Your ex is calling", q: "Kendall will pay you $200 to come over and listen to everything you ever did wrong. For three hours.",
      a: { t: "Take the $200", run: function () { S.cash += 200; S.trust -= 2; return "The coasters. The toilet seat. The crumbs. “Just like your dad.” You take the money and sit on her steps for a while."; } },
      b: { t: "Decline", run: function () { return "You keep your $0 and your dignity. Mostly the $0."; } } },
    { id: "broker", when: function () { return S.rated >= 3 && S.rating >= 4.3; }, k: "A hologram appears", q: "A Quest Broker snaps his fingers. “Five-star streak. The platform rewards consistency.”",
      a: { t: "Accept the bonus", run: function () { S.cash += 500; S.heat += 3; return "+$500. Somewhere, a server you’ll never see takes note."; } },
      b: { t: "Ask who owns the platform", run: function () { S.xp += 40; return "He smiles. “No one knows who’s really in control.” He blinks out. +40 XP for curiosity."; } } },
    { id: "car", when: function () { return S.heat >= 55; }, k: "Outside your building", q: "A nice car with tinted windows has been parked across the street for two days. Nobody gets in or out.",
      a: { t: "Close the blinds and lay low tomorrow", run: function () { S.heat -= 12; S.day += 1; return "You lose a day. The car is gone in the morning. So is some of the Heat."; } },
      b: { t: "Wave at it", run: function () { S.heat += 6; return "The window rolls down an inch, then back up."; } } },
    { id: "diego", when: function () { return S.day > 4; }, k: "Diego has an idea", q: "Diego has found “a guy” who sells “basically new” crew gear out of a van. $300.",
      a: { t: "Buy it", run: function () { S.cash -= 300; if (Math.random() < .55) { S.xp += 80; return "It’s actually great. +80 XP. Nobody knows how."; } return "It’s a box of walkie-talkies and one rollerblade."; } },
      b: { t: "Hard pass", run: function () { return "Diego buys it anyway with his own money. It’s a single rollerblade."; } } }
  ];

  var endDay = function () {
    if (S.cash >= GOAL) return finish("win");
    var dayDone = S.day;
    S.day += 1; S.heat = clamp(S.heat - 4, 0, 100);
    if (S.heat >= 100) return finish("busted");
    var notes = [];
    if (dayDone % 7 === 0) { S.cash -= RENT; notes.push("Rent day: −" + money(RENT) + "."); }
    if (S.cash >= GOAL) return finish("win");
    if (S.day > DAYS) return finish("time");
    makeBoard(); save(); renderHud();
    var pool = EVENTS.filter(function (ev) { return ev.when(); });
    if (Math.random() < 0.45 && pool.length) return event(pick(pool), notes);
    if (notes.length) return interlude(notes);
    board();
  };
  var interlude = function (notes) {
    screen([el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "Day " + S.day }), el("h3", { text: "First of the week" })])].concat(notes.map(function (n) { return line(n, "g-line--warn"); })).concat([el("div", { class: "g-row" }, [btn("Open the board", board, "g-btn--go")])]));
  };
  var event = function (ev, notes) {
    var run = function (o) {
      var out = o.run();
      S.heat = clamp(S.heat, 0, 100); S.trust = clamp(S.trust, 0, 100);
      save(); renderHud();
      if (S.heat >= 100) return finish("busted");
      if (S.day > DAYS) return finish("time");
      screen([el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: ev.k }), el("h3", { text: o.t })]), line(out), el("div", { class: "g-row" }, [btn("Open the board", function () { if (ev.id === "car") makeBoard(); board(); }, "g-btn--go")])]);
    };
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "Day " + S.day + " · " + ev.k }), el("h3", { text: "Something comes up." })])
    ].concat(notes.map(function (n) { return line(n, "g-line--warn"); })).concat([
      el("p", { class: "g-twist", text: ev.q }),
      el("div", { class: "g-opts" }, [
        el("button", { type: "button", class: "g-opt", onclick: function () { run(ev.a); } }, [el("span", { class: "g-opt__k", text: "OPTION A" }), el("b", { text: ev.a.t })]),
        el("button", { type: "button", class: "g-opt", onclick: function () { run(ev.b); } }, [el("span", { class: "g-opt__k", text: "OPTION B" }), el("b", { text: ev.b.t })])
      ])
    ]));
  };

  /* ── endings ────────────────────────────────────────────────────────── */
  var finish = function (kind) {
    S.over = kind; save();
    var b = best(), days = Math.min(S.day, DAYS);
    var mine = { win: kind === "win", days: days, cash: S.cash };
    var better = !b || (mine.win && (!b.win || mine.days < b.days)) || (!mine.win && !b.win && mine.cash > b.cash);
    if (better) { try { localStorage.setItem(BEST, JSON.stringify(mine)); } catch (e) { /* ignore */ } }
    ending(kind, better);
  };
  var ending = function (kind, newBest) {
    renderHud();
    var days = Math.min(S.day, DAYS);
    var head, lines = [];
    if (kind === "win") {
      head = "OBJECTIVE COMPLETE";
      lines.push("Day " + days + ". The supercar is in the driveway. Brock cries a little. Chester is already calculating depreciation.");
      lines.push(S.trust >= 70 ? "Your mom thinks you got a promotion. You let her." : S.trust >= 40 ? "Your mom looks at the car for a long time and doesn’t ask." : "Your mom hasn’t called back in a week.");
      if (S.heat >= 85) lines.push("You hear sirens three streets over as you pull out of the lot. Too close.");
      lines.push("Then the HUD flickers.");
    } else if (kind === "busted") {
      head = "BUSTED";
      lines.push("6:00 AM. Three knocks. FBI Team 4B has a warrant and a very tired agent drinking a Yoo-Hoo.");
      lines.push("You made it to day " + days + " with " + money(S.cash) + ". Escrow freezes. Your rating doesn’t matter anymore.");
    } else {
      head = "TIME’S UP";
      var pct = Math.round((S.cash / GOAL) * 100);
      lines.push("Three weeks are gone. You have " + money(S.cash) + ", " + pct + "% of the way there.");
      lines.push(pct >= 80 ? "So close you can smell the leather. The dealer sells it to someone else." : pct >= 40 ? "Not a supercar. Maybe a really nice used sedan." : "The pickup truck beeps. It’s still the pickup truck.");
    }
    var share = "I played $IDEQU3ST: The Job Board. " + (kind === "win" ? "$50K in " + days + " days" : kind === "busted" ? "Busted on day " + days + " with " + money(S.cash) : money(S.cash) + " in 21 days") + ", rank " + RANKS[rankIx()].n + ". dcalacrity.com/work/sidequest";
    var shareOut = el("p", { class: "g-line", "aria-live": "polite" });
    screen([
      el("div", { class: "g-head" }, [el("p", { class: "g-kicker", text: "Run complete" + (newBest ? " · new personal best" : "") }), el("h3", { class: "g-res g-res--" + (kind === "win" ? "win" : "fail"), text: head })]),
    ].concat(lines.map(function (t) { return line(t); })).concat([
      kind === "win" ? line("NEW OBJECTIVE · FIND CAIN DAWNBRINGER", "g-line--obj") : null,
      el("dl", { class: "g-payout" }, [
        el("div", {}, [el("dt", { text: "Cash" }), el("dd", { text: money(S.cash) })]),
        el("div", {}, [el("dt", { text: "Rank" }), el("dd", { text: RANKS[rankIx()].n })]),
        el("div", {}, [el("dt", { text: "Jobs" }), el("dd", { text: S.done + " done · " + S.fails + " failed" })]),
        el("div", {}, [el("dt", { text: "Rating" }), el("dd", { class: "g-stars", text: S.rated ? stars(S.rating) : "Unrated" })]),
        el("div", {}, [el("dt", { text: "Heat" }), el("dd", { text: String(S.heat) })]),
        el("div", {}, [el("dt", { text: "Mom" }), el("dd", { text: String(S.trust) })])
      ]),
      line("The real story starts where the game ends. Season 1 Part 1 is in post.", "g-line--term"),
      el("div", { class: "g-row" }, [
        btn("Play again", function () { begin(); }, "g-btn--go"),
        btn("Share my run", function () {
          var done = function () { shareOut.textContent = "Copied. Paste it anywhere."; };
          if (navigator.share) { navigator.share({ text: share }).catch(function () {}); return; }
          if (navigator.clipboard) navigator.clipboard.writeText(share).then(done, function () { shareOut.textContent = share; });
          else shareOut.textContent = share;
        }),
        el("a", { class: "g-btn g-btn--ghost", href: "https://www.youtube.com/@dcalacrity" }, ["Follow the series"])
      ]),
      shareOut
    ]), "g-screen--end");
  };

  title();
})();
