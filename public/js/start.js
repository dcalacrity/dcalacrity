/* ═══════════════════════════════════════════════════════════════════════════
   /start — the project funnel.
   One catalog drives everything: the service tiles, the questions each
   service asks, the side panel, and the enquiry that lands in the inbox.
   Every service asks its own questions. Services that are not open yet are
   greyed out and collect a waitlist entry instead of a project brief.
   It posts to the same /api/contact endpoint as the contact page, so leads
   are stored before they are emailed. Nothing here needs a backend change.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var root = document.querySelector("[data-funnel]");
  if (!root) return;

  /* ── shared option sets ─────────────────────────────────────────────── */
  var WHEN = ["As soon as possible", "Within a month", "1–3 months", "3–6 months", "Just exploring"];
  var NEXT_BUSINESS = [
    "We reply within two business days.",
    "A 20-minute call, with a live demo on a headset or your phone.",
    "A fixed-scope written estimate. Nothing is booked until you approve it.",
    "We plan it in Pure Alacrity and send you an approval link.",
    "We shoot it, deliver it on Alacrity Player, and your Insights dashboard goes live."
  ];
  var NEXT_PRODUCTION = [
    "We reply within two business days.",
    "A short call or a few emails to pin down the brief.",
    "A clear, written estimate. Nothing is booked until you approve it.",
    "We plan the shoot in Pure Alacrity and share the call sheet with you.",
    "We deliver the files, with the revision rounds in your estimate."
  ];

  /* ── the catalog ────────────────────────────────────────────────────── */
  var CATALOG = [
    /* Business experiences: turnkey production + annual Player & Insights plan */
    {
      id: "spaces", group: "experiences", name: "Alacrity Spaces · Full-Stack", kicker: "Real estate & developers · available now",
      line: "Walk the home. Redesign it. Flip back to the real one.",
      blurb: "One capture day for a listing, a model home or a development: a 2D film, drone footage, a LiDAR-measured twin and a branching VR tour where buyers choose the room. Our crew shoots it and plans it in Pure.",
      gets: ["A 2D listing film and drone footage", "A LiDAR-measured floor plan and twin", "A branching live-action VR tour: buyers choose the room", "Plays on Meta Quest now; web and phone playback in development", "AI restaging (always labeled), photoreal splat twin and buyer lead scores: in development, delivered with our first clients"],
      next: NEXT_BUSINESS, cta: "Request my Full-Stack shoot", topic: "For Business: Alacrity Spaces (Full-Stack)",
      fields: [
        { id: "propertyType", label: "What kind of property?", type: "chips", required: true, options: ["Residential listing", "Luxury home", "Commercial / office", "Event venue", "Hotel or short-term rental", "Campus / admissions", "Something else"] },
        { id: "volume", label: "How many properties?", type: "chips", required: true, options: ["One, to start", "2–5", "6–15 a month", "More than 15 a month"] },
        { id: "rooms", label: "Roughly how many rooms or stops each?", type: "chips", options: ["1–5", "6–10", "11–20", "20+", "Not sure"] },
        { id: "location", label: "Where is it?", type: "text", required: true, placeholder: "City, or the address if you have it" },
        { id: "addons", label: "Add anything you want", type: "multi", options: ["Drone exterior", "LiDAR floor plan / digital twin", "Agent greeting on camera", "Virtual restaging", "A Quest headset for showings"] },
        { id: "viewing", label: "Where will people view it?", type: "multi", options: ["Listing link / MLS", "Open houses", "Social media", "In the office", "Not sure yet"] }
      ],
      budget: ["Under $2,500", "$2,500–$5,000", "$5,000–$15,000", "$15,000+", "Not sure yet"]
    },
    {
      id: "training", group: "pilots", soon: "soon", statusLabel: "In development · pilots", name: "Alacrity Training", waitTitle: "Tell us about the pilot you have in mind.", cta: "Join the pilot list", kicker: "Industrial, maritime & onboarding",
      line: "Practice the risky decision safely.",
      blurb: "Branching, filmed scenarios where trainees make the call at each decision point and see what happens. You get a record of every choice, not just a completion tick.",
      gets: ["A filmed scenario with real decision points and outcomes", "Quest builds now; browser and phone in development", "A decision record for each trainee", "Completion records you can use for compliance", "Content updates every year under the site license"],
      next: NEXT_BUSINESS, cta: "Scope my training scenario", topic: "For Business: Alacrity Training",
      fields: [
        { id: "industry", label: "Your industry", type: "chips", required: true, options: ["Manufacturing / industrial", "Maritime / port", "Construction", "Healthcare", "Hospitality / retail", "Corporate onboarding", "Other"] },
        { id: "scenario", label: "What should trainees practice?", type: "textarea", required: true, placeholder: "e.g. a lockout/tagout procedure, a forklift near-miss, a difficult customer, the first day on a vessel" },
        { id: "decisions", label: "How many decisions in one scenario?", type: "chips", options: ["2–3", "4–6", "7 or more", "Help me decide"] },
        { id: "trainees", label: "Trainees per year", type: "chips", options: ["Under 50", "50–250", "250–1,000", "1,000+"] },
        { id: "sites", label: "Sites", type: "chips", options: ["1", "2–5", "6+"] },
        { id: "devices", label: "Devices", type: "chips", options: ["We have Quest headsets", "Browser and phone only", "We need headsets", "Not sure"] }
      ],
      budget: ["Under $10,000", "$10,000–$25,000", "$25,000–$50,000", "$50,000+", "Not sure yet"]
    },
    {
      id: "destinations", group: "pilots", soon: "soon", statusLabel: "In development · pilots", name: "Vendors, venues & destinations", waitTitle: "Tell us about the pilot you have in mind.", cta: "Join the pilot list", kicker: "Factories, hospitality, tourism",
      line: "Inspect the plant, walk the ballroom, visit before you go.",
      blurb: "A buyer abroad inspects a supplier’s plant with the real line running. A planner walks the ballroom before booking. A visitor steps into a place before the trip. Measured, filmed and provably real.",
      gets: ["Filmed, explorable places and exhibits", "Guided stories with choices, or free exploration", "Kiosk, trade-show, website and phone versions", "Visitor data: where people went and what they replayed", "Seasonal updates under the annual plan"],
      next: NEXT_BUSINESS, cta: "Plan my destination experience", topic: "For Business: Alacrity Destinations",
      fields: [
        { id: "orgType", label: "You are a…", type: "chips", required: true, options: ["Manufacturer / supplier", "Hotel or venue", "Tourism board / CVB", "Museum or attraction", "University / admissions", "Other"] },
        { id: "experience", label: "What kind of experience?", type: "chips", required: true, options: ["Walk through a place", "A guided story with choices", "An exhibit companion", "An event or activation", "Not sure yet"] },
        { id: "stops", label: "How many locations or stops?", type: "chips", options: ["1", "2–5", "6–12", "More than 12"] },
        { id: "where", label: "Where will people experience it?", type: "multi", options: ["Headsets on site", "Our website", "Trade shows", "Phones / social"] },
        { id: "place", label: "Where is the place?", type: "text", placeholder: "City or venue" }
      ],
      budget: ["Under $10,000", "$10,000–$25,000", "$25,000–$60,000", "$60,000+", "Not sure yet"]
    },
    {
      id: "celebrations", group: "experiences", name: "Live events & celebrations", kicker: "VR180 · on request",
      line: "Concerts, games, festivals and the big day, from inside.",
      blurb: "Your wedding or milestone, captured so you can step back into the room years from now. You choose which moment to go to: the vows, the first dance, the speeches.",
      gets: ["VR180/360 capture of the moments you pick", "A menu so you choose which moment to relive", "A private link for phones and browsers (in development)", "Optional headset keepsake for the family", "Spatial audio, so you hear the room as it was"],
      next: ["We reply within two business days.", "A short call about the day and the venue.", "A written estimate. Your date is held once you approve it.", "A walkthrough of the venue and the shot plan.", "Your experience is delivered as a private link."],
      cta: "Hold my date", topic: "For Business: Alacrity Celebrations",
      fields: [
        { id: "eventType", label: "What’s the event?", type: "chips", required: true, options: ["Concert", "Festival", "Game / sports", "Wedding", "Graduation", "Other celebration"] },
        { id: "date", label: "Event date", type: "date", required: true },
        { id: "venue", label: "Venue and city", type: "text", required: true, placeholder: "e.g. Airlie Gardens, Wilmington" },
        { id: "guests", label: "Guests", type: "chips", options: ["Under 50", "50–150", "150+"] },
        { id: "moments", label: "Moments to capture", type: "multi", options: ["Getting ready", "Ceremony / vows", "First dance", "Speeches", "Reception", "The whole day"] },
        { id: "relive", label: "How will you relive it?", type: "chips", options: ["Phone or browser link", "A headset keepsake", "Both"] }
      ],
      budget: ["Under $1,500", "$1,500–$3,000", "$3,000–$6,000", "$6,000+", "Not sure yet"]
    },

    /* Production & creative */
    {
      id: "production", group: "production", name: "Commercial production", kicker: "Shoots, edits, colour & social",
      line: "The same crew, pointed at your brief.",
      blurb: "Brand films, social content, event recaps and destination films from the crew that makes our own titles. Flat video is welcome. It can be interactive or 360 when that helps.",
      gets: ["Half-day, full-day and multi-day shoots", "Editing, colour (DaVinci Resolve) and captions", "Social cutdowns in every aspect ratio", "Destination and shop features for Cape Fear businesses", "Planned in Pure Alacrity, so the call sheet is always current"],
      next: NEXT_PRODUCTION, cta: "Get my estimate", topic: "For Business: Commercial production",
      fields: [
        { id: "need", label: "What do you need?", type: "multi", required: true, options: ["Shoot only", "Shoot + edit", "Edit my footage", "Colour grade", "Social content pack", "Brand film", "Event recap", "Destination / place film"] },
        { id: "deliverables", label: "What should we hand you?", type: "chips", options: ["One hero video", "Hero + cutdowns", "A social series", "Raw footage", "Not sure yet"] },
        { id: "days", label: "Shoot length", type: "chips", options: ["Half day", "Full day", "Multiple days", "No shoot needed"] },
        { id: "location", label: "Location", type: "text", placeholder: "City or venue" },
        { id: "immersive", label: "Interested in an interactive or 360 version?", type: "chips", options: ["No, flat video is perfect", "Curious, tell me more", "Yes"] }
      ],
      budget: ["Under $500", "$500–$2,000", "$2,000–$10,000", "$10,000+", "Not sure yet"]
    },
    {
      id: "coverage", group: "production", name: "Script coverage", kicker: "Limited slots each month",
      line: "Notes from someone who has worked every department.",
      blurb: "Coverage from D.C Agwu, who has produced, directed, written and worked every department on a set. Notes on the story, and on whether it can actually be made.",
      gets: ["A written coverage report", "Story, structure, character and dialogue notes", "A producibility read: locations, cast size, schedule risk", "Branch-design notes for interactive scripts", "Turnaround agreed before you send pages"],
      next: ["We confirm a slot and a turnaround within two business days.", "You send the pages.", "Coverage arrives by the agreed date."],
      cta: "Request a coverage slot", topic: "For Business: Script coverage", scope: false,
      fields: [
        { id: "format", label: "What did you write?", type: "chips", required: true, options: ["Feature", "TV pilot", "Short", "Web series", "Interactive / branching", "Other"] },
        { id: "pages", label: "Page count", type: "text", required: true, placeholder: "e.g. 104" },
        { id: "draft", label: "Which draft?", type: "chips", options: ["First draft", "Rewrite", "Shooting draft"] },
        { id: "notes", label: "What kind of notes?", type: "multi", options: ["Story & structure", "Character", "Dialogue", "Can it be made? (budget, schedule)", "Interactive branch design"] },
        { id: "deadline", label: "When do you need it?", type: "chips", options: ["Within a week", "Within two weeks", "This month", "No rush"] }
      ]
    },

    /* Join the network */
    {
      id: "creators", group: "network", name: "Creator seed program", kicker: "25 creators · now enrolling",
      line: "Long-form needs real production tools.",
      blurb: "For mid-size YouTube channels moving to long-form. Plan your shoots in Pure Alacrity, and make choose-your-path episodes your audience can play on Alacrity Player.",
      gets: ["Pure Alacrity, free like it is for everyone", "A free year of storage and live support once they launch", "Help building your first interactive episode", "Viewer choice data, including sponsor moments", "In exchange: an honest behind-the-scenes mention"],
      next: ["We review every channel personally.", "If it's a fit, a short call about what you're making.", "Onboarding into Pure Alacrity, and your first episode plan."],
      cta: "Apply for the seed program", topic: "Creator seed program", scope: false,
      fields: [
        { id: "channel", label: "Channel link", type: "url", required: true, placeholder: "https://youtube.com/@…" },
        { id: "subs", label: "Subscribers", type: "chips", required: true, options: ["Under 100K", "100K–1M", "Over 1M"] },
        { id: "contentType", label: "What do you make?", type: "chips", options: ["Sketch / comedy", "Narrative series", "Travel", "Challenges", "Education", "Other"] },
        { id: "interactive", label: "Want to try an interactive episode?", type: "chips", options: ["Yes", "Maybe", "Just the planning tools"] }
      ]
    },
    {
      id: "crew", group: "network", name: "Crew network", kicker: "Freelancers · join the bench",
      line: "Get booked on real productions.",
      blurb: "Our in-house crew hires freelancers for every job, through Pure Alacrity. Join the bench now. Your credits become a verified profile when the Marketplace opens.",
      gets: ["Paid days on Spaces, Training and commercial shoots", "Call sheets and approvals in Pure Alacrity", "Credits that build a verified profile", "First access to the Pure Marketplace"],
      next: ["We add you to the bench.", "We call when a job fits your role and location."],
      cta: "Join the bench", topic: "Crew network: join the bench", scope: false,
      fields: [
        { id: "role", label: "Your primary role", type: "chips", required: true, options: ["Camera operator", "Grip & electric", "Sound", "1st / 2nd AC", "PA", "Drone / LiDAR (Part 107)", "360 / VR specialist", "Editor", "Colourist", "VFX / motion", "Talent"] },
        { id: "base", label: "Based in", type: "chips", required: true, options: ["Wilmington", "Raleigh / Triangle", "Charlotte", "Elsewhere in NC", "Outside NC"] },
        { id: "reel", label: "Reel, portfolio or IMDb", type: "url", placeholder: "https://" },
        { id: "gear", label: "Gear you own (optional)", type: "text", placeholder: "e.g. FX6 kit, Ronin, Part 107 drone" }
      ]
    },

    /* Coming soon: greyed out, waitlist only */
    { id: "channels", group: "soon", soon: "soon", statusLabel: "Early access in Pure", name: "Pure channels", kicker: "Pure Alacrity · free", line: "Your production’s chat, wired to the schedule.", blurb: "Every production gets #general, #client and a channel per department, with crew added from the call sheet. Move a scene and Pure tells the people it affects. Free, like the rest of Pure’s core.", topic: "Waitlist: Pure channels beta", waitQ: { id: "size", label: "Your typical crew size", options: ["Under 10", "10–30", "30–100", "100+"] } },
    { id: "certified", group: "soon", soon: "soon", statusLabel: "In development", name: "Alacrity Certified crews", kicker: "Camera operators & Part 107 pilots", line: "Learn the capture spec. Get booked in your city.", blurb: "Local operators learn our capture spec, pass a paid test shoot and get booked for Experience Machine jobs through Pure, with Wilmington producers approving each position live. Raleigh and Charlotte first.", topic: "Waitlist: Alacrity Certified crews", waitQ: { id: "city", label: "Your city", options: ["Wilmington", "Raleigh / Triangle", "Charlotte", "Atlanta", "Los Angeles", "New York", "Somewhere else"] } },
    { id: "artdept", group: "soon", soon: "soon", statusLabel: "In development · prototype", name: "Pure Art Department", kicker: "For studio art departments", line: "Dress the scanned set before anyone builds.", blurb: "Scan a location, dress it at true scale with real catalog pieces and AI concepts, walk it in a headset, and send every approved item straight into the budget and breakdown.", topic: "Waitlist: Pure Art Department", waitQ: { id: "role", label: "Your role", options: ["Production designer", "Art director", "Set decorator", "Location manager", "Producer", "Other"] } },
    { id: "commerce", group: "soon", soon: "soon", statusLabel: "Later", name: "Art, decor & commerce", kicker: "Galleries, furniture, brands", line: "See the real thing, at true scale, in your own room.", blurb: "A collector sees the real painting on their own wall; a shopper places real products in their measured room. Needs phone self-capture, so it will open through one gallery or brand partner.", topic: "Waitlist: Art, decor & commerce", waitQ: { id: "kind", label: "You are a…", options: ["Gallery or artist", "Furniture / decor brand", "Retailer", "Other"] } },
    { id: "storage", group: "soon", soon: "soon", statusLabel: "Coming soon", name: "Pure Storage", kicker: "Pure Alacrity", line: "Footage, dailies and review copies inside the production.", blurb: "Cloud storage linked to the scenes and takes it belongs to, from 1 TB to 20 TB, with archive tiers for wrapped productions. The software itself stays free.", topic: "Waitlist: Pure Storage", waitQ: { id: "size", label: "How much footage per production?", options: ["Under 1 TB", "1–5 TB", "5–20 TB", "20 TB+"] } },
    { id: "swas", group: "soon", soon: "soon", name: "Services through Pure", kicker: "Pure Alacrity", line: "Our team does the work inside your production.", blurb: "Producer and production management, schedule and budget builds, post and deliverables supervision, and interactive story and VR consulting, delivered inside Pure.", topic: "Waitlist: Services through Pure", waitQ: { id: "service", label: "Which service?", options: ["Production management", "Schedule & budget", "Post supervision", "Interactive / VR consulting"] } },
    { id: "support", group: "soon", soon: "soon", name: "Live support", kicker: "Pure Alacrity", line: "Real people on call, including shoot days.", blurb: "Real-time help from people who run sets, with a guaranteed response on shoot days.", topic: "Waitlist: Live support", waitQ: { id: "shootDays", label: "Shoot days a year", options: ["Under 10", "10–30", "30–100", "100+"] } },
    { id: "player", group: "soon", soon: "soon", name: "Player hosting & Insights", kicker: "For any Pure user", line: "Publish your own experience. See what people chose.", blurb: "Stream your interactive experience to headsets, the web and phones, with viewer journeys, completion and choice data. Today it comes with every in-house production.", topic: "Waitlist: Player hosting & Insights", waitQ: { id: "what", label: "What would you publish?", options: ["A film or series", "A business experience", "A training scenario", "Something else"] } },
    { id: "marketplace", group: "soon", soon: "soon", name: "Pure Marketplace", kicker: "Crew, gear, locations, services", line: "Book it where you plan it.", blurb: "Hire crew from verified credits, rent gear, book locations and services, and buy templates without leaving the schedule.", topic: "Waitlist: Pure Marketplace", waitQ: { id: "side", label: "You would mostly…", options: ["Hire crew and book gear", "Offer my services", "Sell templates or assets", "List a location"] } },
    { id: "studio", group: "soon", soon: "soon", name: "Studio & Enterprise", kicker: "Pure Alacrity", line: "Every production, one dashboard.", blurb: "Multi-production dashboards, production benchmarks, SSO, SLA support and security reviews, with storage bundled.", topic: "Waitlist: Studio & Enterprise", waitQ: { id: "productions", label: "Productions a year", options: ["1–5", "6–20", "20+"] } },
    { id: "education", group: "soon", soon: "soon", name: "Education license", kicker: "Film programs", line: "Students use Pure free. Programs get the rest.", blurb: "Bundled storage, live support and instructor dashboards for film programs. Students use Pure Alacrity free regardless.", topic: "Waitlist: Education license", waitQ: { id: "students", label: "Students in the program", options: ["Under 50", "50–200", "200+"] } },
    { id: "publishing", group: "soon", soon: "soon", name: "Alacrity Publishing", kicker: "For creators on Player", line: "Release your story under our label.", blurb: "Build on Pure and Player, and we handle store submission, porting and marketing for a revenue share.", topic: "Waitlist: Alacrity Publishing", waitQ: { id: "stage", label: "Where is your project?", options: ["An idea", "Script written", "Shot", "Ready to release"] } },
    { id: "pass", group: "soon", soon: "soon", name: "Alacrity Pass", kicker: "Quest & phones", line: "Every live-action interactive story, one app.", blurb: "One subscription for our originals and third-party stories built on Player, on Meta Quest and phones.", topic: "Waitlist: Alacrity Pass", waitQ: { id: "device", label: "Where would you watch?", options: ["Meta Quest", "Phone", "Both"] } }
  ];

  var GROUPS = [
    { id: "experiences", title: "Available now", note: "Booking in Wilmington and across North Carolina." },
    { id: "pilots", title: "In development · pilots", note: "Not open yet. Tell us about your project and we’ll talk when pilots open." },
    { id: "production", title: "Production & creative", note: "Available now." },
    { id: "network", title: "Join the network", note: "Open now." },
    { id: "soon", title: "Coming soon", note: "Not open yet. Join the waitlist and we’ll email you once, when it opens." }
  ];

  /* ── the interest list (/interest): upcoming projects, same engine ───── */
  var ROLE = function (opts) { return { id: "role", label: "Which best describes you?", type: "chips", required: true, options: opts }; };
  var NOTE = { id: "note", label: "Anything you’d like us to know? (optional)", type: "textarea", placeholder: "What drew you to it, how you’d like to be involved, links." };
  var FANS = ["Fan / viewer", "Investor", "Partner or sponsor", "Press", "Cast or crew", "Studio or distributor"];
  var INTEREST = [
    { id: "prizepool", group: "originals", soon: "pre-production", statusLabel: "Pre-production", name: "Prize Pool VR", kicker: "Flagship original", line: "A million-dollar campus water-gun game. Two lives to step into.",
      blurb: "A branching live-action VR180 thriller and the launch title for Alacrity Pass. It is the first original made start to finish on our own engine, and the stress test for every new tool.", topic: "Interest list: Prize Pool VR", after: ["Explore Prize Pool VR", "/work/prize-pool"],
      waitFields: [ROLE(FANS), { id: "want", label: "What do you want to hear about?", type: "multi", options: ["Release date", "Trailer and first look", "Casting calls", "Crew calls", "Investment", "Sponsorship"] }, NOTE] },
    { id: "sidequest", group: "originals", soon: "in post", statusLabel: "Season 1 Part 1 · in post", name: "Sidequest", kicker: "Crime dramedy series", line: "Somewhere, a website is hiring.",
      blurb: "The series that started it all. Season 1 Part 1 is in post-production, with a world written to grow into choose-your-path episodes, VR missions and more.", topic: "Interest list: Sidequest", after: ["Play the job board", "/work/sidequest#job"],
      waitFields: [ROLE(FANS), { id: "want", label: "What do you want to hear about?", type: "multi", options: ["Season 1 Part 1 release", "Choose-your-path episodes", "VR squad missions", "Investment", "Distribution"] }, NOTE] },
    { id: "wilmy", group: "originals", soon: "in production", statusLabel: "In production", name: "Welcome to Wilmy", kicker: "Documentary", line: "Surf and beach culture on the Cape Fear coast.",
      blurb: "A portrait of the Wilmington coast and the people who make it what it is, shot under a City of Wilmington permit.", topic: "Interest list: Welcome to Wilmy", after: ["About Welcome to Wilmy", "/work/welcome-to-wilmy"],
      waitFields: [ROLE(["Fan / viewer", "Local business", "Tourism partner", "Sponsor", "Press", "Want to be featured"]), NOTE] },

    { id: "pass", group: "branches", soon: "soon", statusLabel: "In development", name: "Alacrity Pass", kicker: "Meta Quest & phones", line: "Every live-action interactive story, one app.",
      blurb: "One subscription for our originals and partner titles built on Alacrity Player: Prize Pool VR, Right Here Right Now! and what comes next. On Quest and phones.", topic: "Interest list: Alacrity Pass",
      waitFields: [ROLE(["Viewer", "Filmmaker with a title", "Studio or distributor", "Investor", "Press"]), { id: "device", label: "Where would you watch?", type: "chips", options: ["Meta Quest", "Phone", "Both", "Another headset"] }, NOTE] },
    { id: "walkable", group: "branches", soon: "pilot", statusLabel: "In development · pilot on Prize Pool VR", name: "Walkable movie sets", kicker: "For studios and fans", line: "Step into the world of the film between scenes.",
      blurb: "We scan a production’s sets and locations with LiDAR and splats so fans can walk the world of the film. A marketing product for studios, piloting on Prize Pool VR’s sets.", topic: "Interest list: Walkable movie sets",
      waitFields: [ROLE(["Studio or producer", "Marketing / distribution", "Fan", "Investor", "Press"]), NOTE] },
    { id: "venues", group: "branches", soon: "soon", statusLabel: "In development · testing", name: "VR venue stories", kicker: "Arcades & location-based VR", line: "A group votes. The story changes.",
      blurb: "15–20 minute live-action branching stories where a whole group votes on the choices, licensed to VR arcades and venues. Testing with VR venue operators.", topic: "Interest list: VR venue licensing",
      waitFields: [ROLE(["VR venue or arcade operator", "Investor", "Filmmaker", "Press", "Player"]), NOTE] },
    { id: "creatoreps", group: "branches", soon: "soon", statusLabel: "In development", name: "Creator episodes", kicker: "YouTube creators", line: "Choose-your-path episodes your audience plays.",
      blurb: "Interactive episodes hosted on Alacrity Player for creators moving to long-form, with data on which choices viewers made, including sponsor moments.", topic: "Interest list: Creator episodes", after: ["Apply to the creator seed program", "/start?service=creators"],
      waitFields: [ROLE(["Creator", "Brand or sponsor", "Viewer", "Investor"]), { id: "channel", label: "Your channel (optional)", type: "url", placeholder: "https://youtube.com/@…" }, NOTE] },

    { id: "machine", group: "platform", soon: "in development", statusLabel: "In development · first build underway", name: "The Experience Machine app", kicker: "Meta Quest & phones", line: "Step inside. Change it. Know what’s real.",
      blurb: "The flagship: featured real places, create-with-AI tools and the reality switch, on the Meta store and phones. The first end-to-end build is underway now.", topic: "Interest list: The Experience Machine app", after: ["How it works", "/technology#machine"],
      waitFields: [ROLE(["Curious viewer", "Real estate / developer", "Employer or trainer", "Vendor or manufacturer", "Investor", "Press"]), NOTE] },
    { id: "channels", group: "platform", soon: "soon", statusLabel: "Early access in Pure", name: "Pure channels beta", kicker: "Free in Pure Alacrity", line: "Your production’s chat, wired to the schedule.",
      blurb: "Every production gets #general, #client and a channel per department. Move a scene and Pure tells the people it affects. Free, like the rest of Pure’s core.", topic: "Interest list: Pure channels beta", after: ["Open Pure Alacrity", "https://dcalacrity.com/pure"],
      waitFields: [ROLE(["Producer", "Director", "Department head", "Crew", "Student", "Film program"]), { id: "size", label: "Typical crew size", type: "chips", options: ["Under 10", "10–30", "30–100", "100+"] }, NOTE] },
    { id: "certified", group: "platform", soon: "soon", statusLabel: "In development", name: "Alacrity Certified crews", kicker: "Camera operators & Part 107 pilots", line: "Learn the capture spec. Get booked in your city.",
      blurb: "Local operators learn our capture spec, pass a paid test shoot, and get booked for Experience Machine jobs through Pure. Raleigh and Charlotte first, then Atlanta, LA and New York.", topic: "Interest list: Alacrity Certified crews", after: ["Join the bench now", "/start?service=crew"],
      waitFields: [ROLE(["Camera operator", "Drone / LiDAR pilot", "360 / VR specialist", "Editor", "Production company"]), { id: "city", label: "Your city", type: "chips", options: ["Wilmington", "Raleigh / Triangle", "Charlotte", "Atlanta", "Los Angeles", "New York", "Elsewhere"] }, NOTE] },
    { id: "artdept", group: "platform", soon: "soon", statusLabel: "In development · prototype", name: "Pure Art Department", kicker: "For studio art departments", line: "Dress the scanned set before anyone builds.",
      blurb: "Scan a location, dress it at true scale with real catalog pieces and AI concepts, walk it in a headset, and send every approved item straight into the budget.", topic: "Interest list: Pure Art Department",
      waitFields: [ROLE(["Production designer", "Art director", "Set decorator", "Location manager", "Producer", "Studio"]), NOTE] },
    { id: "lab", group: "platform", soon: "planned", statusLabel: "Planned with UNCW", name: "Alacrity Lab", kicker: "Research", line: "Where the next medium gets built.",
      blurb: "Planned research with UNCW faculty on live-action VR synchronized to real props, so you reach for the valve in the footage and your hand finds a real one.", topic: "Interest list: Alacrity Lab",
      waitFields: [ROLE(["Researcher", "Educator", "Student", "Training partner", "Funder"]), NOTE] },

    { id: "investors", group: "company", soon: "monthly", statusLabel: "Monthly investor update", name: "Investor updates", kicker: "Pre-seed · Wilmington, NC", line: "Real numbers, every month.",
      blurb: "A short monthly update: jobs delivered, Pure adoption, the Experience Machine build and the slate. For angels, funds and accelerators.", topic: "Interest list: Investor updates", cta: "Get the updates",
      waitFields: [ROLE(["Angel", "Fund", "Accelerator", "Strategic partner", "Advisor"]), { id: "layer", label: "Most interested in", type: "multi", options: ["The Experience Machine", "Pure Alacrity", "Film & media", "All of it"] }, NOTE] }
  ];
  var INTEREST_GROUPS = [
    { id: "originals", title: "Alacrity Originals", note: "Our own titles: the lab and the showroom." },
    { id: "branches", title: "Entertainment branches", note: "New ways our films reach people." },
    { id: "platform", title: "The platform", note: "What we’re building next." },
    { id: "company", title: "The company", note: "For investors and partners." }
  ];
  var interest = root.getAttribute("data-funnel") === "interest";
  var MODE = interest ? {
    key: "dca-interest-v1", param: "project", path: "/interest", firstStep: "Project", waitStep: "Your interest",
    pickTitle: "What do you want to follow?", pickLine: "Pick a project. We’ll only email you when there’s real news about it: a date, a trailer, a beta, a casting call.",
    tileGo: "Get on the list", waitTitle: "Tell us what you’re after.", composeKey: "INTEREST", composeTag: "INTEREST LIST",
    sideSoon: "Get on the list and we’ll email you when there’s real news. No newsletter you didn’t ask for.", sideLink: ["See what’s live today", "/technology"],
    youLine: function (svc) { return "We’ll email you about " + svc.name + " when there’s real news."; },
    doneHead: "You’re on the list.", doneLine: function (svc) { return svc.name + ": " + svc.statusLabel.toLowerCase() + ". We’ll email you when there’s real news."; }
  } : {
    key: "dca-start-v1", param: "service", path: "/start", firstStep: "Service", waitStep: "Waitlist",
    pickTitle: "What can we make for you?", pickLine: "Choose one. Greyed-out services aren’t open yet. You can still join their waitlist.",
    tileGo: "Join the waitlist", waitTitle: "Join the waitlist.", composeKey: "SERVICE", composeTag: "WAITLIST",
    sideSoon: "Not open yet. Join the waitlist and we’ll email you once, when it opens. Pure Alacrity itself is free today.", sideLink: ["Open Pure Alacrity", "https://dcalacrity.com/pure"],
    youLine: function (svc) { return "One email when " + svc.name + " opens."; },
    doneHead: "We’ll email you when it opens.", doneLine: function (svc) { return svc.name + " is " + soonLabel(svc).toLowerCase() + ". You’ll get one email when it opens."; }
  };
  if (interest) { CATALOG = INTEREST; GROUPS = INTEREST_GROUPS; }
  var byId = {}; CATALOG.forEach(function (s) { byId[s.id] = s; });

  /* ── state ──────────────────────────────────────────────────────────── */
  var KEY = MODE.key;
  var state = { service: null, step: 0, answers: {}, contact: {} };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved && saved.answers) { state.answers = saved.answers; state.contact = saved.contact || {}; } } catch (e) { /* storage blocked: fine */ }
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify({ answers: state.answers, contact: state.contact })); } catch (e) { /* ignore */ } };

  var soonLabel = function (svc) { return svc.statusLabel || ("Coming " + svc.soon); };
  var waitSpecs = function (svc) { return svc.waitFields || (svc.waitQ ? [Object.assign({ type: "chips" }, svc.waitQ)] : (svc.fields || [])); };
  var stepsFor = function (svc) {
    if (!svc) return ["service"];
    if (svc.soon) return ["service", "waitlist", "you"];
    return svc.scope === false ? ["service", "details", "you"] : ["service", "details", "scope", "you"];
  };
  var STEP_LABEL = { service: MODE.firstStep, details: "Details", scope: "Scope & timing", waitlist: MODE.waitStep, you: "About you" };

  /* ── dom helpers ────────────────────────────────────────────────────── */
  var el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  };
  var stage = root.querySelector("[data-funnel-stage]");
  var rail = root.querySelector("[data-funnel-rail]");
  var side = root.querySelector("[data-funnel-side]");
  var uid = 0;

  /* a field from a spec; values live in `bag` (answers[svc] or contact) */
  var field = function (spec, bag) {
    var id = "f-" + spec.id + "-" + (++uid);
    var wrap = el("div", { class: "fx" + (spec.required ? " fx--req" : ""), "data-field": spec.id });
    if (spec.type === "chips" || spec.type === "multi") {
      var multi = spec.type === "multi";
      var fs = el("fieldset", { class: "fx__set" }, [el("legend", { class: "fx__label", text: spec.label + (spec.required ? " *" : "") + (multi ? "  (pick any)" : "") })]);
      var row = el("div", { class: "fx__chips" });
      spec.options.forEach(function (opt) {
        var cur = bag[spec.id];
        var on = multi ? (Array.isArray(cur) && cur.indexOf(opt) > -1) : cur === opt;
        var input = el("input", { type: multi ? "checkbox" : "radio", name: id, value: opt, checked: on });
        input.addEventListener("change", function () {
          if (multi) { var list = Array.isArray(bag[spec.id]) ? bag[spec.id].slice() : []; var at = list.indexOf(opt); if (input.checked && at < 0) list.push(opt); if (!input.checked && at > -1) list.splice(at, 1); bag[spec.id] = list; }
          else bag[spec.id] = opt;
          wrap.classList.remove("is-invalid"); save();
        });
        row.appendChild(el("label", { class: "fx__chip" }, [input, el("span", { text: opt })]));
      });
      fs.appendChild(row); wrap.appendChild(fs);
    } else {
      var label = el("label", { class: "fx__label", for: id, text: spec.label + (spec.required ? " *" : "") });
      var ctl = spec.type === "textarea" ? el("textarea", { id: id, rows: 4, maxlength: 1500, placeholder: spec.placeholder || "" })
        : el("input", { id: id, type: spec.type === "url" ? "url" : spec.type === "date" ? "date" : spec.type === "email" ? "email" : spec.type === "tel" ? "tel" : "text", maxlength: 300, placeholder: spec.placeholder || "", autocomplete: spec.auto || "off" });
      ctl.value = bag[spec.id] || "";
      ctl.addEventListener("input", function () { bag[spec.id] = ctl.value; wrap.classList.remove("is-invalid"); save(); });
      wrap.appendChild(label); wrap.appendChild(ctl);
    }
    if (spec.hint) wrap.appendChild(el("p", { class: "fx__hint", text: spec.hint }));
    wrap.appendChild(el("p", { class: "fx__err", text: spec.err || "This one is needed." }));
    return wrap;
  };

  var bagFor = function (svc) { return (state.answers[svc.id] = state.answers[svc.id] || {}); };
  var CONTACT = [
    { id: "name", label: "Your name", type: "text", required: true, auto: "name" },
    { id: "email", label: "Email", type: "email", required: true, auto: "email", err: "A valid email, so we can reply." },
    { id: "phone", label: "Phone", type: "tel", auto: "tel", placeholder: "Optional" },
    { id: "organization", label: "Company or organization", type: "text", auto: "organization", placeholder: "Optional" },
    { id: "prefer", label: "Best way to reach you", type: "chips", options: ["Email", "Phone call", "Text"] },
    { id: "source", label: "How did you find us?", type: "chips", options: ["Search", "Social", "Referral", "Meta Quest / SideQuest", "An event", "Other"] }
  ];
  var scopeFields = function (svc) {
    return [
      { id: "timeline", label: "When do you want it?", type: "chips", required: true, options: svc.timeline || WHEN },
      { id: "budget", label: "Budget range", type: "chips", options: svc.budget || ["Not sure yet"], hint: "A range helps us scope it. The estimate is always written and fixed before anything is booked." },
      { id: "notes", label: "Anything else we should know?", type: "textarea", placeholder: "Links, dates, a reference you love, what success looks like." }
    ];
  };

  /* ── rendering ──────────────────────────────────────────────────────── */
  var renderRail = function () {
    var svc = byId[state.service], steps = stepsFor(svc);
    if (!svc) steps = interest ? ["service", "waitlist", "you"] : ["service", "details", "scope", "you"];
    rail.innerHTML = "";
    steps.forEach(function (s, i) {
      var cls = "rail__step" + (i === state.step ? " is-on" : "") + (i < state.step ? " is-done" : "");
      rail.appendChild(el("li", { class: cls, "aria-current": i === state.step ? "step" : false }, [el("span", { class: "rail__n", text: String(i + 1) }), el("span", { text: STEP_LABEL[s] })]));
    });
  };

  var renderSide = function () {
    var svc = byId[state.service];
    side.innerHTML = "";
    if (!svc) {
      side.appendChild(el("p", { class: "caption", text: interest ? "The interest list" : "How it works" }));
      side.appendChild(el("h3", { text: interest ? "Follow the projects you care about." : "Pick what you need. We ask only what matters for it." }));
      side.appendChild(el("ol", { class: "side__next" }, (interest ? ["Pick a project.", "Tell us how you’d like to be involved.", "We email you when there’s real news: a date, a trailer, a beta, a casting call."] : NEXT_BUSINESS).map(function (t) { return el("li", { text: t }); })));
      side.appendChild(el("p", { class: "side__fine", html: 'Prefer email? <a href="mailto:support@dcalacrity.com">support@dcalacrity.com</a>' }));
      return;
    }
    side.appendChild(el("p", { class: "caption", text: svc.soon ? soonLabel(svc) : svc.kicker }));
    side.appendChild(el("h3", { text: svc.name }));
    side.appendChild(el("p", { class: "side__line", text: svc.line }));
    side.appendChild(el("p", { class: "side__blurb", text: svc.blurb }));
    if (svc.soon) {
      side.appendChild(el("p", { class: "side__soon", text: MODE.sideSoon }));
      if (MODE.sideLink) side.appendChild(el("a", { class: "link", href: MODE.sideLink[1], text: MODE.sideLink[0] }));
      return;
    }
    side.appendChild(el("p", { class: "caption side__k", text: "What you get" }));
    side.appendChild(el("ul", { class: "side__gets" }, svc.gets.map(function (t) { return el("li", { text: t }); })));
    side.appendChild(el("p", { class: "caption side__k", text: "What happens next" }));
    side.appendChild(el("ol", { class: "side__next" }, svc.next.map(function (t) { return el("li", { text: t }); })));
  };

  var head = function (k, h, p) {
    var box = el("div", { class: "fstep__head" }, [el("p", { class: "fstep__k", text: k }), el("h2", { class: "fstep__h", tabindex: "-1", text: h })]);
    if (p) box.appendChild(el("p", { class: "fstep__p", text: p }));
    return box;
  };

  var nav = function (opts) {
    var row = el("div", { class: "fnav" });
    if (state.step > 0) row.appendChild(el("button", { type: "button", class: "btn btn--quiet fnav__back", text: "Back", onclick: function () { go(state.step - 1); } }));
    row.appendChild(el("button", { type: opts.submit ? "submit" : "button", class: "btn fnav__next", text: opts.label, onclick: opts.submit ? null : opts.onNext }));
    return row;
  };

  var renderService = function () {
    var box = el("div", { class: "fstep" });
    box.appendChild(head("Step 1", MODE.pickTitle, MODE.pickLine));
    GROUPS.forEach(function (g) {
      var items = CATALOG.filter(function (s) { return s.group === g.id; });
      var grp = el("fieldset", { class: "tiles" + (g.id === "soon" ? " tiles--soon" : "") }, [el("legend", { class: "tiles__h" }, [el("span", { text: g.title }), el("small", { text: g.note })])]);
      var grid = el("div", { class: "tiles__grid" });
      items.forEach(function (s) {
        var input = el("input", { type: "radio", name: "svc", value: s.id, checked: state.service === s.id });
        input.addEventListener("change", function () { pick(s.id, true); });
        grid.appendChild(el("label", { class: "tile" + (s.soon && !interest ? " tile--soon" : "") + (interest ? " tile--interest" : "") }, [
          input,
          el("span", { class: "tile__k", text: s.soon ? soonLabel(s) : s.kicker }),
          el("span", { class: "tile__name", text: s.name }),
          el("span", { class: "tile__line", text: s.line }),
          el("span", { class: "tile__go", text: s.soon ? MODE.tileGo : "Start" })
        ]));
      });
      grp.appendChild(grid); box.appendChild(grp);
    });
    return box;
  };

  var renderFields = function (k, h, p, specs, bag, nextLabel) {
    var box = el("div", { class: "fstep" });
    box.appendChild(head(k, h, p));
    var list = el("div", { class: "fx-list" });
    specs.forEach(function (sp) { list.appendChild(field(sp, bag)); });
    box.appendChild(list);
    box.appendChild(nav({ label: nextLabel, onNext: function () { if (check(specs, bag, box)) go(state.step + 1); } }));
    return box;
  };

  var check = function (specs, bag, box) {
    var ok = true, first = null;
    specs.forEach(function (sp) {
      var v = bag[sp.id], bad = false;
      if (sp.required) bad = Array.isArray(v) ? v.length === 0 : !String(v || "").trim();
      if (!bad && sp.type === "email" && v) bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
      var w = box.querySelector('[data-field="' + sp.id + '"]');
      if (w) w.classList.toggle("is-invalid", bad);
      if (bad) { ok = false; if (!first) first = w; }
    });
    if (first) { first.scrollIntoView({ behavior: "smooth", block: "center" }); var f = first.querySelector("input,textarea"); if (f) f.focus({ preventScroll: true }); }
    return ok;
  };

  var renderYou = function (svc) {
    var form = el("form", { class: "fstep", novalidate: true });
    form.appendChild(head("Last step", svc.soon ? "Where should we send the news?" : "Who should we reply to?", svc.soon ? (svc.youLine || MODE.youLine(svc)) : "A person reads every one of these."));
    var list = el("div", { class: "fx-list" });
    var specs = svc.soon ? CONTACT.slice(0, 2).concat([CONTACT[3]]) : CONTACT;
    specs.forEach(function (sp) { list.appendChild(field(sp, state.contact)); });
    list.appendChild(el("label", { class: "hp-field", "aria-hidden": "true" }, ["Company website", el("input", { type: "text", name: "website", tabindex: "-1", autocomplete: "off" })]));
    form.appendChild(list);
    form.appendChild(el("p", { class: "fstep__fine", html: "We use this only to reply to you. Prefer email? <a href=\"mailto:support@dcalacrity.com\">support@dcalacrity.com</a>" }));
    var status = el("div", { class: "form-status", role: "status", "aria-live": "polite", hidden: true });
    form.appendChild(status);
    form.appendChild(nav({ label: svc.soon ? (svc.cta || MODE.tileGo) : svc.cta, submit: true }));
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!check(specs, state.contact, form)) return;
      var hp = form.querySelector('input[name="website"]');
      send(svc, hp ? hp.value : "", status, form);
    });
    return form;
  };

  var render = function (focus) {
    var svc = byId[state.service], steps = stepsFor(svc), s = steps[state.step] || "service";
    stage.innerHTML = "";
    var view;
    if (s === "service") view = renderService();
    else if (s === "details") view = renderFields("Step 2 · " + svc.name, detailsTitle(svc), svc.blurb, svc.fields, bagFor(svc), "Continue");
    else if (s === "scope") view = renderFields("Step 3 · " + svc.name, "Timing and budget.", null, scopeFields(svc), bagFor(svc), "Continue");
    else if (s === "waitlist") view = renderFields(soonLabel(svc) + " · " + svc.name, svc.waitTitle || MODE.waitTitle, svc.blurb, waitSpecs(svc), bagFor(svc), "Continue");
    else if (s === "you") view = renderYou(svc);
    if (svc && s !== "service") view.insertBefore(el("button", { type: "button", class: "fchange", onclick: function () { go(0); } }, [el("span", { text: svc.name }), el("small", { text: "Change" })]), view.firstChild);
    stage.appendChild(view);
    root.classList.toggle("is-soon", !!(svc && svc.soon && !interest));
    renderRail(); renderSide();
    if (focus) { var h = stage.querySelector(".fstep__h"); if (h) h.focus({ preventScroll: true }); var top = root.getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" }); }
  };
  var detailsTitle = function (svc) {
    return { spaces: "Tell us about the property.", training: "Tell us what people need to practice.", destinations: "Tell us about the place.", celebrations: "Tell us about the event.", production: "Tell us about the shoot.", coverage: "Tell us about the script.", creators: "Tell us about your channel.", crew: "Tell us what you do." }[svc.id] || "Tell us about it.";
  };

  var go = function (i) { state.step = Math.max(0, i); render(true); };
  var pick = function (id, advance) {
    if (!byId[id]) return;
    state.service = id;
    try { var u = new URL(window.location.href); u.searchParams.set(MODE.param, id); history.replaceState(null, "", u.pathname + u.search); } catch (e) { /* ignore */ }
    if (advance) go(1); else render(false);
  };

  /* ── sending ────────────────────────────────────────────────────────── */
  var compose = function (svc) {
    var a = bagFor(svc), lines = [];
    var fmt = function (v) { return Array.isArray(v) ? v.join(", ") : String(v || "").trim(); };
    lines.push(MODE.composeKey + ": " + svc.name + (svc.soon ? " (" + MODE.composeTag + ", " + soonLabel(svc) + ")" : " (available now)"));
    lines.push("");
    var specs = svc.soon ? waitSpecs(svc) : svc.fields;
    lines.push(svc.soon ? MODE.composeTag.charAt(0) + MODE.composeTag.slice(1).toLowerCase() : "Details");
    specs.forEach(function (sp) { var v = fmt(a[sp.id]); if (v) lines.push("  " + sp.label.replace(/\?$/, "") + ": " + v); });
    if (!svc.soon && svc.scope !== false) {
      lines.push(""); lines.push("Scope & timing");
      ["timeline", "budget"].forEach(function (k) { if (fmt(a[k])) lines.push("  " + (k === "timeline" ? "Timeline" : "Budget") + ": " + fmt(a[k])); });
      if (fmt(a.notes)) { lines.push(""); lines.push("Notes"); lines.push(fmt(a.notes)); }
    }
    var c = state.contact;
    if (fmt(c.prefer)) { lines.push(""); lines.push("Preferred contact: " + fmt(c.prefer)); }
    lines.push(""); lines.push("Sent from dcalacrity.com" + MODE.path + "?" + MODE.param + "=" + svc.id);
    return lines.join("\n").slice(0, 4900);
  };

  var send = async function (svc, honeypot, status, form) {
    var a = bagFor(svc), c = state.contact;
    var payload = {
      name: String(c.name || "").trim(), email: String(c.email || "").trim(), phone: String(c.phone || "").trim(), organization: String(c.organization || "").trim(),
      topic: svc.topic, projectType: svc.name, budget: svc.soon ? "N/A (" + MODE.composeTag.toLowerCase() + ")" : String(a.budget || ""), timeline: svc.soon ? soonLabel(svc) : String(a.timeline || a.deadline || a.date || ""),
      source: String(c.source || ""), message: compose(svc), website: honeypot || ""
    };
    var btn = form.querySelector(".fnav__next"), label = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    status.hidden = false; status.className = "form-status"; status.textContent = "Sending…";
    try {
      var res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      var out = await res.json().catch(function () { return {}; });
      if (!res.ok || !out.ok) throw new Error(out.error || "Send failed");
      done(svc, out.ref);
    } catch (err) {
      var subject = encodeURIComponent("[dcalacrity.com] " + payload.topic + " — " + payload.name);
      var body = encodeURIComponent(["Name: " + payload.name, "Email: " + payload.email, "Phone: " + (payload.phone || "—"), "Organization: " + (payload.organization || "—"), "Found us via: " + (payload.source || "—"), "", payload.message].join("\n"));
      status.className = "form-status is-error";
      status.textContent = "We couldn’t reach the site just now, so we’re opening an email draft with everything you wrote. You can also write to support@dcalacrity.com directly.";
      window.location.href = "mailto:support@dcalacrity.com?subject=" + subject + "&body=" + body;
      if (btn) { btn.disabled = false; btn.textContent = label; }
    }
  };

  var done = function (svc, ref) {
    try { delete state.answers[svc.id]; save(); } catch (e) { /* ignore */ }
    stage.innerHTML = "";
    var first = String(state.contact.name || "").trim().split(/\s+/)[0];
    var box = el("div", { class: "fstep fdone" }, [
      el("p", { class: "fstep__k", text: svc.soon ? "You’re on the list" + (ref ? " · ref " + ref : "") : "Sent" + (ref ? " · ref " + ref : "") }),
      el("h2", { class: "fstep__h", tabindex: "-1", text: (first ? "Thanks, " + first + ". " : "Thanks. ") + (svc.soon ? MODE.doneHead : "We have it.") }),
      el("p", { class: "fstep__p", text: svc.soon ? (svc.doneLine || MODE.doneLine(svc)) : "A person reads every enquiry. Here’s what happens next:" })
    ]);
    if (!svc.soon) box.appendChild(el("ol", { class: "side__next fdone__next" }, svc.next.map(function (t) { return el("li", { text: t }); })));
    var row = el("div", { class: "btn-row fdone__row" });
    if (svc.after) row.appendChild(el("a", { class: "btn", href: svc.after[1], text: svc.after[0] }));
    else if (svc.group === "experiences") row.appendChild(el("a", { class: "btn", href: "/work/right-here-right-now", text: "See an experience we shipped" }));
    else row.appendChild(el("a", { class: "btn", href: "https://dcalacrity.com/pure", text: "Open Pure Alacrity" }));
    row.appendChild(el("button", { type: "button", class: "link", text: "Start another", onclick: function () { state.service = null; go(0); } }));
    box.appendChild(row);
    stage.appendChild(box);
    rail.querySelectorAll(".rail__step").forEach(function (li) { li.classList.add("is-done"); li.classList.remove("is-on"); });
    var h = box.querySelector(".fstep__h"); if (h) h.focus({ preventScroll: true });
  };

  /* ── boot ───────────────────────────────────────────────────────────── */
  var qs = new URLSearchParams(window.location.search), want = qs.get(MODE.param) || qs.get("service") || qs.get("project");
  if (want && byId[want]) { state.service = want; state.step = 1; }
  render(false);
})();
