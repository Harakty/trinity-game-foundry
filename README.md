# Trinity // Game Foundry

Prototype decision system for three game-studio founders. Trinity Studios v0.1.

## Prototype architecture

**WANT × BUILD × MARKET**

A lightweight static HTML/CSS/JavaScript application. No framework, build step,
backend, authentication, analytics, or third-party scripts are required.

## Current capabilities

- Three founder profiles
- Detailed Founder DNA questionnaire: 96 questions across 12 sections
- Consensus / compromise / conflict analysis and shared DNA dashboard
- Concept Forge with rule-based concept seeds
- Founder voting
- Feasibility analysis and Kickstarter fit
- Manual Market Gate with comparable-title research and kill criteria
- MVP / Kickstarter Brief
- Local browser persistence
- JSON export/import

## Live prototype

https://harakty.github.io/trinity-game-foundry/

GitHub Pages publishes the root of the `main` branch. `.nojekyll` keeps serving
static. All application assets use paths relative to the project directory.

## Run locally

Serve this folder with any static web server, for example:

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8765/` in a modern browser.
Using a web server gives browser persistence a consistent origin.

## Important prototype limitation

Each browser currently has independent `localStorage`, under the key
`trinityFoundry`. Data stays in that browser on that device; clearing site data
removes it. GitHub Pages does **not** provide a shared database.

This is intentional for v0.1. Users can exchange exported JSON files during
this prototype phase. Real multi-user synchronization and cloud persistence
belong to a later version and are out of scope for this deployment.

### Exchange data between founders

1. Click **Export JSON** to save `trinity-game-foundry-data.json`.
2. Send the file to another founder.
3. In their browser, click **Import JSON** and select the file.
4. The app validates the structure before requesting confirmation.
5. Confirm to **replace all existing local state**, including all three profiles,
   answers, votes, concepts, and market research. Export a backup first.

Import is a full snapshot replacement, **not a merge**. Coordinate one current
snapshot between founders to avoid overwriting someone else's answers.
The original v0.1 export format is preserved; compatible exports from the
original prototype can be imported. Only `.json` files up to 5 MB are accepted.
Malformed/incompatible files and cancelled imports leave existing data intact.
Imported text is displayed as text; it is never executed as HTML or JavaScript.

## Later versions

Live Steam / Kickstarter / Reddit / YouTube research, AI concept synthesis,
external market APIs, authentication, databases, and multi-device collaboration
are deliberately deferred. Market Gate currently records manual research;
concept generation uses rules rather than an AI service.
