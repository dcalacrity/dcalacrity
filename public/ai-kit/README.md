# Use Pure Alacrity with ChatGPT

ChatGPT cannot open Pure Alacrity: the app is one offline file with no server and no API, so there is nothing for a GPT Action or a ChatGPT app (MCP connector) to call. What works is a loop you already understand, and it needs nothing a ChatGPT workspace would block: custom GPTs, Projects, ChatGPT Business and Enterprise, or a plain chat.

**ChatGPT writes → you paste it into Pure Alacrity → the app checks it and imports it.**

Everything below is also inside the app: **Productions → Use with ChatGPT** (top bar, next to Load), or **Transfer Bay → Use with ChatGPT**.

## Set it up once (3 steps)

1. **Give ChatGPT the instructions.** In Pure Alacrity open Use with ChatGPT → *Set up ChatGPT* → **Copy instructions** (or use `INSTRUCTIONS.md` from this folder — the same text, under the 8,000-character limit of a custom GPT).
   - *ChatGPT Project:* new project → Instructions → paste.
   - *Custom GPT (works in a Business / Enterprise workspace):* Create a GPT → Configure → Instructions → paste. Share it with your workspace so everyone writes the same format.
   - *Any chat:* paste the instructions as your first message.
2. **Give it the reference.** Add `KNOWLEDGE.md`, `example-production.json` and `pure-production.schema.json` as project files or GPT knowledge (the app's Set up tab downloads all three). `example-branching.fountain` is worth adding if you write interactive or VR pieces.
3. **Ask for work, then bring it in.** Ask for a screenplay, a production file, a breakdown, a shot list. Copy ChatGPT's answer, then in Pure Alacrity: Use with ChatGPT → *Paste from ChatGPT* → paste → **Check it** → press the button the check offers. The check names anything the app will not use before anything is written.

To let ChatGPT edit something you already have: open the production, Use with ChatGPT → *Send to ChatGPT* → **Copy for ChatGPT** (or download the file and attach it). ChatGPT returns the edited copy; paste it back. It arrives as a new production beside the original, so an edit can never overwrite your work.

## What each kind of answer does

| ChatGPT gives you | Pure Alacrity |
|---|---|
| a screenplay (Fountain) | opens the script import preview; **Use script** replaces the open production's script (the old draft is kept in Script Studio's drafts) |
| a production file (`"_alacrityProduction": true`) | creates a new production: script, stripboard, cast and crew, locations, breakdown, shots, budget lines, risks, milestones |
| a `.pure` file | applies the part you pick (the story map, say) to the open production, with a checkpoint first when it replaces something |

A file ChatGPT gives you (`production.json`, `script.fountain`) can also be loaded with **Productions → Load** or opened from the paste tab.

## ChatGPT agent / ChatGPT Work (a browser that can click)

An agent can use the web app at `https://dcalacrity.com/pure` to check its own work before handing it to you:

1. Open `https://dcalacrity.com/pure` and enter the local workspace (the small **Demo** button on the front door).
2. Productions → **Use with ChatGPT** → *Paste from ChatGPT* → paste the file → **Check it** → fix anything the check flags → **Import**.
3. Export what you need from that production (Transfer Bay, or Use with ChatGPT → *Send to ChatGPT* → Download) and give the file to the person.

Its browser is not yours: what it imports stays in its session, and your productions stay on your device. The agent's job is to hand you a checked file.

## What would need a server

- A **GPT Action** needs an HTTPS API described by an OpenAPI schema.
- A **ChatGPT app / MCP connector** needs a remote MCP server reachable over HTTPS; in Business and Enterprise workspaces an admin also has to enable and publish it.

Pure Alacrity has neither, on purpose: productions never leave your device unless you move them. The set-room rig (`Alacrity-Hub-Desktop/setserver.js`) is a LAN server for phones on set, not a public HTTPS API. Building either would be a new, hosted component with its own sign-in and privacy story.

## Files in this folder

| file | for |
|---|---|
| `INSTRUCTIONS.md` | paste into a custom GPT or Project (under 8,000 characters) |
| `KNOWLEDGE.md` | the long reference: the Fountain dialect, every production field, the `.pure` map, the round trip |
| `pure-production.schema.json` | JSON Schema of what the production reader accepts, derived from the reader code |
| `example-production.json` | a small complete production that imports cleanly (4 scenes, 2 shoot days, 2 cast, 4 crew) |
| `example-branching.fountain` | a small branching screenplay with pathways, choices, node tags and notes |
| `llms.txt` | a short index for an AI browsing the web deploy |
| `addon.template.html`, `build-addon.cjs` | build `_addon_AiKit.html`, the in-app panel, from these files so the two never disagree |

Rebuild the panel after editing any of the kit files:

```bash
node "Pure Alacrity/ai-kit/build-addon.cjs"
node "Pure Alacrity/_splice_addon.js" _addon_AiKit.html AI_KIT
```

⚠ The web deploy does not serve this folder yet. To publish `llms.txt` and the kit at `https://dcalacrity.com/pure/`, `build-webdeploy.js` has to copy them into `public/` and the worker's `STATIC_APP_FILES` has to allow them — otherwise the catch-all answers every path with the app's HTML.
