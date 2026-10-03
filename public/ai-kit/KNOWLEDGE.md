# Pure Alacrity: reference for ChatGPT

The long companion to `INSTRUCTIONS.md`. Upload it as a knowledge file (custom GPT) or a project file (ChatGPT Project). Everything here was read from the app's own reader code and checked by importing real files into the app.

## 1. How ChatGPT and Pure Alacrity connect

Pure Alacrity is one offline HTML file. It runs in a browser, in the desktop app and on phones, and it has no server and no API. That decides what works:

| | works today | why |
|---|---|---|
| Custom GPT or Project instructions + these files | yes | ChatGPT writes; the person pastes into the app |
| ChatGPT writes a file (`production.json`, `script.fountain`) | yes | Productions → Load, or Use with ChatGPT → Open a file |
| An agent with a browser (ChatGPT Work) opening the web app | partly | it can open `https://dcalacrity.com/pure`, use Use with ChatGPT to check and import its own file, and download what the app exports. Its browser is its own: nothing it imports reaches the person's device, so it must hand back a file |
| GPT Actions | no | an Action calls an HTTPS API; the app has none |
| A ChatGPT app / MCP connector | no | needs a hosted remote MCP server over HTTPS; the app has none |

So you always produce text or a file, and the person imports it. Never say you changed the app.

The panel is **Use with ChatGPT**, a button on the Productions screen (top bar, next to Load) and in the Transfer Bay header. It has three tabs:

1. **Set up ChatGPT** — the instructions and these files.
2. **Paste from ChatGPT** — the person pastes your answer (code fences and chat around them are fine; the largest fenced block is used), presses **Check it**, reads what the check says, then presses the one button it offers. Nothing is written before that.
3. **Send to ChatGPT** — the open production as one JSON for you to read and edit.

## 2. The three things you can hand back

| you hand back | it is detected by | the app does |
|---|---|---|
| Fountain text | a scene heading (`INT.`/`EXT.`) or a title page | opens the script import preview; after the person presses Use script it replaces the open production's script (the old draft is filed in Script Studio's drafts first) |
| A production file (JSON) | `"_alacrityProduction": true` | creates a NEW production. Nothing else changes |
| A `.pure` file (JSON) | `"_pure": true` | applies the part the person picks to the OPEN production; when that replaces work, a version-history checkpoint is taken first |

An automation JSON (no marker, with sections like `schedule`, `risks`) is also recognised; it MERGES into the open production. Prefer the production file.

## 3. Fountain, as Pure Alacrity reads it

The app's own parser reads the text. What each element becomes:

| you write | it becomes |
|---|---|
| `Title:` `Credit:` `Author:` `Source:` `Draft date:` `Contact:` at the top, then a blank line | the title page |
| `INT. KITCHEN - DAY`, `EXT.`, `INT./EXT.`, `I/E`, `EST.` | a scene heading |
| `.THE VOID` (leading dot) | a forced scene heading |
| a plain paragraph | action |
| `MAYA` alone in capitals, dialogue on the next line | character cue + dialogue |
| `MAYA (V.O.)`, `(O.S.)`, `(CONT'D)` | a cue with its extension |
| `(quietly)` between cue and dialogue | a parenthetical |
| `CUT TO:` or `> SMASH CUT TO:` | a transition |
| `> THE END <` | a centred line |
| `[[ … ]]` before the first scene heading | the script's manual (front matter): printed in roman numerals before page 1, never counted as script pages |
| `[[ … ]]` after a scene heading | that scene's director's note |

Rules that keep the numbers right:

- The app paginates at 54 lines a page and measures eighths from the text. Do not write page numbers, `(MORE)`, `(CONTINUED)` or scene numbers.
- Spell a character identically in every cue. The breakdown, cast list, call sheet and actor sides are all built from the cues.
- Inside the manual (`[[ … ]]` at the top), a short line in capitals is a section heading and an indented line is a list item. A first line in capitals becomes the manual's title. A section headed `FOR THE PRODUCTION` is left out of actor sides.

### A straight screenplay

```fountain
Title: LOW TIDE
Credit: Written by
Author: (the writer's name)

EXT. HARBOUR WALL - DAWN

Grey water, a long stone wall. ADA (30s, oilskin jacket) walks the top of it.

ADA
(to herself)
Still here.

[[Practical dawn only. Shoot the wide first while the sky holds.]]

INT. HARBOURMASTER'S OFFICE - DAWN

JONAH (60s) does not look up from the tide table.

JONAH
You went out on the wall again.
```

### A branching (interactive / VR) screenplay

A branching script is a normal screenplay plus three conventions. The markers only become pathways and choices when a script contains them, so a straight screenplay must contain none.

- `# PATHWAY · NAME` alone on a line: a decision point.
- The options follow at once, one per line, each starting `* ` (also `- ` or `CHOICE: `). Write the option in capitals, then a dash and what it means, then `→` and the tag of the scene it leads to: `* CLIMB THE SIGNAL BOX — and find out who → [B01]` (`->` works too). The target is what draws the branch on the story map.
- Every scene heading ends with its story-map node tag in square brackets: `[N00]` for the opening, `[B01]`, `[B02A]` for branches, `[END_NAME]` for an ending, and an ending scene closes on `> THE END <`. Tags are short, unique, capitals, digits and `_`. The tag is how the story map finds the scene, so never shorten a heading in a way that cuts it.
- Facts the story remembers are written for the reader as action: `[STATE] If CURIOUS: the door at the top is already open.`

```fountain
Title: THE SIGNAL BOX
Credit: Written by
Author: (the writer's name)

[[HOW TO READ THIS
The viewer chooses once, at the level crossing. Each route has its own ending.]]

EXT. LEVEL CROSSING - NIGHT [N00]

A single red lamp swings over the rails. KIT (17) stands at the barrier with a bike.

KIT
Somebody's up there.

# PATHWAY · THE CROSSING

* CLIMB THE SIGNAL BOX — and find out who → [B01]
* RIDE ON — it is not your business → [END_ROAD]

EXT. SIGNAL BOX - STAIRS - NIGHT [B01]

Kit climbs. Every step rings.

[[Handheld, one take up the stairs.]]

INT. SIGNAL BOX - NIGHT [END_LEVER]

Kit finishes the pull.

> THE END <

EXT. COUNTRY ROAD - NIGHT [END_ROAD]

Kit rides away. Behind her, the red lamp goes out.

> THE END <
```

What the app does with it (measured): the `#` line becomes a pathway line, each `*` line a choice line, the script is set to the Interactive format, and the story map is synced from the script as one node per scene. Each choice that names a target is linked to that scene, labelled with its words; a scene with no choice links to the next one; an `[END_…]` scene (or one closing on `> THE END <`) becomes an ending with nothing after it. A choice with no target falls back to script order, so the other routes are unreachable until someone draws them in the Story Map. Conditions and effects on the links (a fact set, a fact checked) are drawn in the Story Map or sent as a `.pure` map (section 6).

## 4. The production file

One JSON object. Valid JSON only: double quotes, no comments, no trailing commas. Leave out any section you have nothing real for.

```json
{
  "_alacrityProduction": true,
  "_intakeVersion": "1",
  "production": { … },
  "script": { "title": "…", "titlePage": { … }, "fountain": "…" },
  "scenes": [ … ], "cast": [ … ], "crew": [ … ], "locations": [ … ],
  "breakdown": [ … ], "shotlist": [ … ], "budgetLines": [ … ],
  "risks": [ … ], "milestones": [ … ], "devNotes": [ … ]
}
```

### The joins

Everything that belongs to a scene points at the scene's NUMBER, `scenes[].n`: `breakdown[].scn`, `shotlist[].scn`, `risks[].s`. Two scenes can share a heading, so a heading is never a key. One `scenes` row per scene heading in the script, same order, same heading text (tag included).

### Sections, fields, and where a person sees them

| section | fields the app reads | shown on |
|---|---|---|
| `production` | `name` `type` `status` `logline` `synopsis` `genre` `format` `director` `writer` `producer` `client` `budget` `currency` `shootStart` `wrapDate` `runtimeMin` `location` `company` | the production card (name, type, status, logline, director, client, budget) and the production record |
| `script` | `fountain` (or `lines`), `title`, `titlePage`, `format`, `scriptType`, `paths`, `manual`, `dirNotes` | Script Studio |
| `scenes` | `n` `heading` `loc` `int` `timeOfDay` `pages` `day` `synopsis` `characters` | Stripboard, Schedule, Call sheet, Shooting schedule |
| `cast` | `name` `scriptChar` `role` `dept` `email` `phone` `agency` `agent` `dayRate` `status` `notes` | Cast & Crew, Contacts, Call sheet |
| `crew` | `name` `role` `dept` `email` `phone` `dayRate` `notes` | Cast & Crew, Contacts, Call sheet |
| `locations` | `name` `type` `address` `notes` `contact` `permit` `fee` `scenes` | Locations |
| `breakdown` | `scn` `cast` `extras` `stunts` `vehicles` `animals` `props` `setDressing` `greenery` `costumes` `makeup` `sfx` `mechfx` `vfx` `equipment` `sound` `music` `security` `labor` `notes` | Breakdown, Shopping |
| `shotlist` | `n` `scn` `size` `move` `lens` `desc` `subjects` `prepMin` `shootMin` `sound` `adr` `equip` `notes` | Shot List, Shooting Schedule |
| `budgetLines` | `cat` `name` `est` `act` `vendor` `notes` | Budget |
| `risks` | `t` `s` `lvl` `mit` | Risk |
| `milestones` | `name` `date` `status` `pct` | Milestones, Timeline |
| `devNotes` | `title` `body` | Dev Notes |
| `dayLog` | `dayNo` `date` `location` `summary` `scenes` | Day Log |
| `music` | `title` `artist` `composer` `type` `usage` `durationSec` | Music |
| `tech` | `item` `spec` `qty` `dept` `source` `status` | Equipment, only while the production has no equipment list of its own |
| `shopping` | `t` or `item`, `vendor` `qty` `cost` | Shopping |
| `coverage` | `title` `writer` `logline` `synopsis` `strengths` `concerns` `suggestions` `characterNotes` `marketability` `comps` `comments` `rec` | Coverage |
| `beats` | `act` `name` `scene` `note` | Beat board |
| `documents` | `title` `category` `body` | Library |
| `ipBible` | `title` `premise` `themes` `world` `characters` | IP & World Bible |

Field values:

- `scenes[].n` "1", "2", "3A". `int` true for INT. and INT./EXT. `timeOfDay` DAY, NIGHT, DAWN, DUSK, CONTINUOUS. `pages` eighths as text ("1 2/8", "3/8") — an estimate; the app re-measures. `day` "D01", "D02" groups scenes into shoot days.
- `cast[].scriptChar` is the character exactly as the cue spells it; it is the link between a performer and the script. `name` is the performer, `""` when nobody is cast (the call sheet leaves nameless rows off). `dept` is `CAST`.
- `crew[].dept` in capitals: DIRECTING, PRODUCTION, CAMERA, SOUND, GRIP, ELECTRIC, ART, WARDROBE, MAKEUP, LOCATIONS, POST.
- `shotlist[].size` ECU XCU CU MCU MS MWS WS EWS OTS POV INSERT OTHER; `move` STATIC PAN TILT DOLLY TRUCK CRANE JIB HANDHELD STEADI GIMBAL ZOOM RACK; `sound` SYNC or MOS; `adr` "No ADR", "ADR planned", "ADR required"; `prepMin`/`shootMin` numbers (they drive the time-linked Shooting Schedule).
- `budgetLines[].est` and `act` are numbers. `production.budget` is text with the currency sign ("$25,000", "$1.5M").
- `risks[].lvl` HIGH, MEDIUM or LOW; `s` is the scene number or "—".
- `milestones[].status` QUEUED, IN PROGRESS or DONE. Dates are YYYY-MM-DD.

### What the check fixes for you, and says it did

The importer adds the field a screen reads when you used a common alternative, keeps your original field, and lists each mapping in the check:

- risks: `title`/`risk`/`hazard` → `t`, `scene` → `s`, `severity`/`level`/`impact` → `lvl`, `mitigation` → `mit`
- budget lines: `category` → `cat`, `line`/`item`/`description` → `name`, `amount`/`estimate`/`cost` → `est`
- dev notes: `note`/`text` → `body` (and a title from its first sentence)
- `production.budget` as a bare number → money text
- `script` as a plain string, or a top-level `fountain` string → read as Fountain

Use the primary names anyway; the mapping exists so a slip does not empty a screen.

### What the check will tell the person

- Any section the app does not read: kept in the production record, shown nowhere.
- Any field on a row that its screen does not show.
- Shots or breakdown rows pointing at a scene number that is not in `scenes`.
- Two scenes with the same number, or scenes with no number.
- A script whose heading count differs from the `scenes` count.
- Cast whose `scriptChar` never speaks in the script (fine for non-speaking roles; otherwise a spelling slip).
- `storymap` in a production file (not reliable — see below).

### Measured limits of the production file

- **Story map:** a `storymap` section is dropped whenever the app has already built a map from the script, which it does on import. Put branches in the script; send story logic as a `.pure` map.
- **Stills and media** are data URIs and belong to the person's device. Never write them.

## 5. Editing a production the person sends you

**Send to ChatGPT** gives you one JSON with `"_exportedBy": "Pure Alacrity · Use with ChatGPT"`:

- the production block and the tables (scenes, cast, crew, locations, breakdown, shots, budget lines, risks, milestones, dev notes, day log, music, shopping, beats, coverage, IP bible) exactly as the app holds them, with internal fields removed;
- `script.fountain`, the whole screenplay as Fountain, with each director's note written back as `[[ … ]]` under its heading; `script.titlePage`, `script.manual` and `script.paths` as JSON.

Edit what you are asked to, keep everything else, and return the WHOLE object. Keep `_exportedBy`. Keep scene numbers stable; if you add a scene, give it a new number ("4A") and add its `scenes` row where it falls in the script. It comes back as a new production beside the original, so a mistake never overwrites the person's work.

Not in the export: stills, media, library PDFs, version history, the budget workbook, on-set logs, and the story map's logic (facts, conditions, effects). The person is told when their production has story logic that will not travel.

## 6. The `.pure` file (only when asked)

`.pure` is the app's own whole-production file. A person can paste a `.pure` you write, and the app applies the part they choose to the production they have open. It is most useful for story logic, which the production file cannot carry.

A story map with a remembered fact, one effect and one condition:

```json
{
  "_pure": true,
  "_schema": "pure/1.1.0",
  "kind": "map",
  "map": {
    "nodes": [
      { "id": "m1", "label": "N00 · CROSSING", "sceneSlug": "EXT. LEVEL CROSSING - NIGHT [N00]" },
      { "id": "m2", "label": "B01 · STAIRS",   "sceneSlug": "EXT. SIGNAL BOX - STAIRS - NIGHT [B01]" },
      { "id": "m3", "label": "THE LEVER", "sceneSlug": "INT. SIGNAL BOX - NIGHT [END_LEVER]", "nodeType": "end" },
      { "id": "m4", "label": "THE ROAD",  "sceneSlug": "EXT. COUNTRY ROAD - NIGHT [END_ROAD]", "nodeType": "end" }
    ],
    "links": [
      { "id": "l1", "source": "m1", "target": "m2", "label": "CLIMB THE SIGNAL BOX", "fx": "CURIOUS=true" },
      { "id": "l2", "source": "m1", "target": "m4", "label": "RIDE ON" },
      { "id": "l3", "source": "m2", "target": "m3", "cond": "CURIOUS" }
    ],
    "startNodeId": "m1",
    "flags": { "CURIOUS": false }
  }
}
```

- Links are `source` / `target`, never `from` / `to`.
- `sceneSlug` is the scene heading exactly as in the script, tag included. It is how the map finds its scene; without it the app adds a second, script-made node for every scene (measured: 4 nodes became 8).
- `nodeType: "end"` marks an ending. `startNodeId` is where the story begins.
- `flags` declares every fact with its starting value. `fx` sets facts when a link is taken ("A=true, B=false"); `cond` names a fact a link needs.
- Applying a map REPLACES the open production's story map; when a map was already there, a version-history checkpoint is taken first, so it is one undo away.

Other `.pure` sections the app can apply: `script` (`lines` in the app's line model, `titlePage`, `paths`), `schedule` (`strips`), `cast` / `crew`, `locations`, `breakdown`, `budget` (`lines`, `financials`). For a whole production, prefer the production file.

## 7. Never invent

- Contact details (emails, phone numbers, addresses), agencies, rates, permit numbers, dates or money the person did not give you. Leave the field out or `""`.
- Performers for roles nobody has cast.
- Scene counts, page counts or schedules presented as measured. Estimate openly; the app re-measures pages and eighths.
- Anything you did inside the app. You did not open it.

The only contact address for Pure Alacrity itself is pure@dcalacrity.com.

## 8. When the check refuses

| the check says | ask ChatGPT for |
|---|---|
| looks like JSON but does not parse | the same JSON, valid: double quotes, no comments, no trailing commas |
| a section "should be a list" | that section as `[ … ]` |
| no scene heading and not JSON | Fountain with `INT.`/`EXT.` headings, or the production JSON |
| shots point at a scene number that is not in scenes | matching numbers |
| the script has N headings but scenes lists M | one scenes row per heading |
