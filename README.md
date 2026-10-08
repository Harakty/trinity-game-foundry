# Trinity // Game Foundry v0.2

Shared workspace for Gian Paolo, Ottaviano and Gigi. Public reports:
https://harakty.github.io/trinity-game-foundry/

## Shared workflow

Visitors immediately see all three founder profiles, Analysis, Concepts, sourced
Market research and the MVP / Kickstarter Brief. No import is needed. Personal
edit links authenticate one founder; each can change only their own profile,
96 questionnaire answers and concept votes. Ottaviano also maintains shared
production constraints and manual market assessments.

Changes save automatically to Cloudflare D1 through trinity-foundry-api. Other
visible browsers check for updates every ten seconds. Analysis, concept scores,
comparable ordering and the brief recompute from shared answers. Same-field
edits from two devices produce a conflict instead of overwriting. Offline drafts
are retained on that device and retried after reconnection. Status distinguishes
local drafts from confirmed online saves. On conflict, Ricarica dati archives
the draft locally and loads shared data. JSON export is a backup in the original
v0.1 format. Full-snapshot import and demo overwrite paths are retired.

Public reading is intentional. Scoped edit capabilities are secret random tokens:
never commit or publicly post them. Hashes live in the Worker AUTH_KEYS secret.
Edit fragments are removed from the address bar; the device retains access in
localStorage until logout. Rotate AUTH_KEYS to revoke a lost link. No authentication
cookies, third-party analytics or AI service.

## Interpretation and research

model.js is the authoritative questionnaire, validation and original scoring
implementation, shared by browser and Worker. insights.js ranks three curated
proposals and produces interpretations and a brief from current data. It does
not invent a new concept with AI on every edit. Radical preference changes
trigger a new-synthesis warning. Scores measure preference fit, not profit
probability. The original eight concept seeds and voting remain available.

market-research.json contains 20 selected Steam comparables and three historical
funding campaigns, checked on 2026-10-08, with source links and methodology.
Prices and review counts are dated observations; reviews are not sales or revenue.
The comparable order adapts to the current proposal; source facts remain dated.
Changes to answers mark the initial commercial assessment for review. Market
Gate values are manual hypotheses. Imported budget, time and engine defaults
are unconfirmed. A visually convincing demo and external audience tests are
required before deciding on a Kickstarter launch.

## Architecture and local validation

Vanilla HTML/CSS/ES modules on GitHub Pages; a Cloudflare Worker with D1 handles
shared state, field-scoped compare-and-swap patches and idempotent retries.
schema.sql defines state and short-lived acknowledgement tables. Responses use
no-store, strict origin policy and bounded validated JSON. Full datasets and
request bodies are capped at 256 KiB. API URL selection is in shared-config.js.

Use D: for development payloads, local DB, caches, TMP and TEMP. Reserve at least
16 GiB available RAM for a browser lane, run one browser lane, and do not stop
other WSL or container jobs. No container is needed.

```powershell
Set-Location D:\CodexWorkspaces\trinity-game-foundry
if (Test-Path D:\CodexTemp\use-development-storage.ps1) {
  . D:\CodexTemp\use-development-storage.ps1
}
$env:TMP = 'D:\CodexTemp\trinity-shared'
$env:TEMP = $env:TMP
$env:npm_config_cache = 'D:\CodexCaches\npm-cache'
$env:PLAYWRIGHT_BROWSERS_PATH = 'D:\CodexCaches\ms-playwright'
npm ci
npx wrangler types
npm run check
npm test
npx wrangler dev --ip 127.0.0.1 --port 8787 --persist-to D:\CodexBuilds\trinity-shared\state
```

Initialize a new local DB using schema.sql with wrangler d1 execute,
--local and the same --persist-to directory. Seed separately from a validated
founder export; configure AUTH_KEYS hashes in ignored .dev.vars. Serve the
frontend in another shell with the same D: settings:
python -m http.server 8080 --bind 127.0.0.1.
Localhost automatically selects the API on port 8787.

## Deployment

Never overwrite existing shared data with the seed. Initialization uses INSERT
ON CONFLICT DO NOTHING; subsequent changes use the authenticated API. Back up
before maintenance. Binding IDs and public origins are in wrangler.jsonc.
Credentials, seeds and operational evidence stay outside the public repository.
Apply schema to the correct D1 instance, upload hashed AUTH_KEYS, qualify locally,
then deploy one stable Worker candidate. Point shared-config.js at its verified
URL and publish the qualified frontend on the Pages main branch. Verify Worker
reads, Pages source identity and live browser flows before reporting completion.
