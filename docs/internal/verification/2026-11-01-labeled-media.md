# Labeled direct MEDIA regression

Worktree: `chathermes-media-labeled`, based on main `89fe14252e`.
No commits, staging, pushes, deployments, live-service changes, other-worktree
writes, or user-data writes. Only the isolated deterministic test project was
created/rebuilt; its containers and synthetic state are retained.

## Read-only investigation

Queried only the reported session's assistant MEDIA messages using SQLite
`mode=ro` against the developer profile's existing `state.db`.
Session `20261101_144003_02a35d`, message `99253`, contains the six exact
`Desktop board: MEDIA:…` / task / settings and corresponding Mobile paragraphs.
Message `99140` instead contains Desktop/Mobile sections with bulleted labels.
The shared fixtures retain the six exact delivery paragraphs as positives and
the earlier bulleted message as a negative. No whole-session export, tool output,
credentials, or other conversation content was saved.

The actual dashboard process listens on 9119; its Hermes install stamp identifies
0.22.5, commit `bf0203a794a07aac3ff764972ab9087baa4e4f4e`. Installed plugin
files were inspected in both the root and developer profile. The installed
Python extraction module has SHA-256
`d6036289d02239e6d994ba0557f0658717c4421f13e9aafa952ea6b6e9cfb8e7`,
identical to this worktree's initial main version. Installed entrypoint and
`assets/app-BKtmC3Mp.js` Git blob hashes are respectively
`4d187107e92bac718b4e500b2de402212b1683bc` and
`4f4c0dc22ad810228acf0356eca0938b1a355a39`, identical to main.
Unauthenticated live asset HTTP access returns 401. Live credentials were not
available in the dashboard process environment; no authenticated live browser
session or served-bundle hash was obtained. Disk installation is current;
this is a reproducible parser defect on current main, independent of any
unverified browser cache or in-memory deployment state. Nothing was installed or
restarted in the live service.

## Cause and fix

PR 206 recognizes explicit Markdown link/image destinations. The reported
message uses neither Markdown syntax nor whole-line bare directives. Both
parsers therefore excluded it. Before implementation, the focused frontend
regressions failed four assertions; Python failed four delivery assertions plus
an existing intermittent SQLite WAL-setup lock test. Subsequent runs passed.

Both parsers now accept a plain paragraph label followed entirely by local MEDIA
directives. They preserve the label and surrounding prose, validate the entire
directive sequence before adding files, and deduplicate paths. Python checks
local-only constraints before path normalization, preventing `file:` destinations
from bypassing the same frontend rule. The authoritative API contract documents
the bounded label grammar. Ordinary prose containing a marker, trailing example
text, code, quotes, lists, HTML and untrusted wrappers retain their boundaries.
Top-level successful tool delivery envelopes keep their existing strict grammar;
no arbitrary stdout or nested output acquires provenance.

File access continues through the existing authenticated native preview/download
handlers with explicit profile and session. Native session ownership is checked
within the selected profile; the runtime does not require the path to have been
delivered in that particular session. No new filesystem route or browser
credential handling was introduced.

## Validation

- `uv sync --locked`; local `.hermes-source` checked out at the reviewed pin.
- `vp fmt`, `vp lint`, `uv run ruff format .`, `uv run ruff check --fix .`,
  `uv run ty check`; unrelated baseline Ruff formatting restored afterward.
- `npm test`: 1,224 passed, 37 files.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 127 passed.
- `PYTHONPATH=.hermes-source:plugin uv run pytest`: 464 passed.
- `npm run build`: passed.
- Existing upload image suite: eight desktop/mobile cases passed.
- Existing MEDIA-link, progressive streaming and real terminal-tool workflows:
  all six desktop/mobile cases passed in a clean final comparison run (35.3s).
- New labeled browser suite: all four desktop/mobile × default/alpha cases
  passed in the final serial run (1.8m).
- Focused parser/component suite after local-only hardening: 427 passed;
  focused Python artifact suite: 166 passed, before the final bulleted fixture.
- Explicit `npm run test:env:build` passed. Final isolated image
  `82f3d771a243`, project `chathermes-media-labeled`, dashboard 19440,
  MockServer 19441. Remote Docker binds use private daemon address 172.25.0.2.

Browser regression uses the exact six paragraphs and exact paths but creates
synthetic PNG bytes exclusively inside the isolated container. It checks all
six loaded thumbnails, multiple markers in a paragraph, preserved labels,
quoted/untrusted/list negatives, native saved-session resume and reload, image
viewer, byte-exact downloads, anonymous denial, missing-session and cross-profile
denial, backend library parity, focus, 16px composer and bounded horizontal layout.
Both default and named alpha profiles run at desktop and iPhone 13 viewport sizes.
Component tests additionally exercise labeled deliveries in live and saved turns.

Initial browser setup was attempted before the first image build completed, then
hit the remote daemon's loopback-only publication. Applying the explicitly built
image with private publication corrected setup without resetting state. A missing
JSON import attribute and an ambiguous two-button preview locator were corrected
in the new browser test. One concurrent alpha desktop reload stalled at native
reconnect; serial runs rendered/reloaded correctly but initially hit the 30s
library assertion deadline. Read-only inspection of the synthetic index showed
alpha checkpoints appearing on its 60s reconciliation interval. The library poll
now allows 90s and the case 150s, with no sleeps or runtime changes. Failure artifacts and containers remain available.

Visual inspection covered desktop/mobile labeled cards and labels, uploaded image
cards and viewer, and completed/expanded terminal disclosures in the actual React
hosted plugin. Tests check composer focus, scrolling and overflow; desktop captures
also show profile/model selects and mobile captures show focus-driven composer
controls. Local ignored evidence is under `tests/visual-output/`:

- `labeled-verified/` (final labeled browser run)
- `labeled-final/` and `labeled-serial/` (earlier run/debug evidence)
- `labeled-uploads/` (upload inline/viewer screenshots)
- `labeled-comparison/` and `messaging-*/` (link, stream and tool screenshots)

Final browser commands (from this worktree, with the environment below):

```sh
export COMPOSE_PROJECT_NAME=chathermes-media-labeled
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=19440
export CHATHERMES_MOCKSERVER_PORT=19441
export CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
npm run test:integration -- tests/workflows/media-labeled.spec.ts --output=tests/visual-output/labeled-verified
npm run test:integration -- tests/workflows/media-links.spec.ts tests/workflows/messaging.spec.ts --grep 'MEDIA links|streaming renders|real tool activity' --output=tests/visual-output/labeled-comparison
CHATHERMES_TEST_CONTAINER=chathermes-media-labeled-hermes-1 CHATHERMES_TEST_URL=http://docker:19440 node_modules/.bin/playwright test tests/visual/image-preview-live.spec.ts --project=desktop --project=mobile --output=tests/visual-output/labeled-uploads
```

The final labeled run passed with no retries. Earlier native reconnect and index
reconciliation deadline failures remain documented above; the final alpha cases
completed in 37.7s (desktop) and 54.6s (mobile). No parser or service changes were
made to bypass those runtime waits.

## Limits

No real-provider run, Android device, physical camera or OS keyboard test.
Screenshots use synthetic files, not copies of the user's screenshots. The live
service was investigated read-only; the fix has not been deployed. Bulleted
MEDIA remains deliberately quoted under the existing contract. Generated dist
assets are excluded from the final source diff and must never be committed.
