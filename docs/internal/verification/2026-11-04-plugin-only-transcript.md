# ChatHermes-only transcript verification — 2026-11-04

This follow-up supersedes the runtime dependency described in
[shared display history](2026-11-04-shared-display-history.md). Its historical
commands/results remain preserved, but are not current setup instructions.
The [earlier fidelity investigation](2026-11-04-transcript-fidelity.md) also
remains historical evidence; no real user database inspection was repeated.

## Scope and implementation

Work stayed in the existing ChatHermes worktree. The starting Git diff and
`tmp/shared-history/initial.patch` were inspected before edits. The useful local
metadata reader from that patch was restored, retaining the existing frontend
resume, empty-block fallback, fixture and workflow improvements. No separate
Hermes worktree was read or used. `.hermes-source` stayed clean at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`.

There is no `get_display_history_snapshot` dependency, shared-history version
check, HTTP 501 installation requirement, upstream schema addition, runtime
monkeypatch or Hermes source edit. Unsupported old stores use the existing gateway
compatibility path and order-echo safeguards. The new fallback test replaces the
invalid test requiring a patched-runtime API; it does not remove ordering tests.

The read-only plugin selector retains Desktop's lineage and display rules where
possible, with three deliberate differences:

- Retired originals anchor surviving clones. The observed uncovered-user case
  retains enough durable data to restore ask/answer interleaving, even though
  Desktop's retained-row selection has moved the clones after archived answers.
- UID plus display identity distinguishes genuine repeated occurrences. Desktop's
  content/timestamp key can collapse distinct same-timestamp messages. Legacy
  independently backfilled UIDs use full identity, generation, slot/lineage and
  suffix occurrence matching, with the ambiguity limit below.
- Selection pages metadata across ancestors before loading bodies. Desktop's
  multi-segment path reads all retained payloads before paging. The plugin decodes
  at most the requested page plus one preceding boundary row.

This is a local presentation fix, not a change to model context, persistence,
rewinds or Desktop behavior. Pruned copies use original slots; later shortened
compaction tool copies retain the archived full result. Profile ownership is
checked at entry, resume tip and every ancestor. Marker boundaries derive only
from persisted summary carriers and proven compression edges.

## Comparison with actual pinned Desktop

The inspected source paths were:

- `apps/desktop/src/api/sessions.ts`: latest tail size 120, include compacted rows,
  explicit order echo and full oldest-first fallback for orderless backends.
- `hermes_cli/web_routers/sessions.py`: resolved resume tip,
  `get_messages(...include_ancestors=True)` and `_project_for_display`.
- `hermes_state_messages.py`: indexed single-segment REST selection,
  `_dedupe_display_generations` for merged histories/native resume,
  `_reconcile_display_orders`, `_with_removed_identities`, and
  `get_resume_conversations` separating model and display histories.
- `tui_gateway/methods_session.py` and `session_history.py`: cold resume with
  omitted display messages, native history conversion, and snapshot limits.
- Desktop `app/session/hooks/use-session-actions/{utils,persisted-live-turn}.ts`
  and `lib/chat-messages/reconciliation.ts`: saved-row provenance, conservative
  live remainder merging and Python code-point correction offsets.

New real SQLite tests close and reopen a read-only database, comparing ChatHermes
pages to actual pinned REST projection and server-bound native history conversion
for unique turns after in-place compaction and rotation. They check unchanged
stored rows, wrong-owner denial, foreign-ancestor denial, and separate profile
stores containing the same session ID. Native conversion must be accessed through
`server` because Hermes binds helper functions to its globals at startup.

A separate disposable reproduction uses the real `archive_and_compact` coverage
verb with three asks/answers and only assistant IDs covered. Both pinned REST and
native storage return answers 0–2, then asks 0–2. ChatHermes returns ask 0,
answer 0, ask 1, answer 1, ask 2, answer 2. This records the observed storage shape
without asserting why a production compressor omitted coverage. The synthetic
comparison is retained in `tmp/plugin-only/ordering-comparison.json`.

## Local validation

All Python runs use the locked uv environment and
`PYTHONPATH=.hermes-source:plugin`. Initial checks passed 511 Python tests and all
37 existing transcript cases. Added reopen/profile tests exposed fixture setup
mistakes (an empty handoff, an unbound native helper, a nonexistent profile home,
and a synthetic summary without native markers); those setups were corrected to
exercise the actual pinned contracts. No failing assertion was skipped or weakened.

| Command                                                                | Final result                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------ |
| `uv sync --locked`                                                     | Passed                                                 |
| `npm test`                                                             | 42 files, 1,289 tests passed                           |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                       | 515 passed, including 41 transcript tests; no skips    |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                    | 137 passed                                             |
| `npm run build`                                                        | Passed (also passed within explicit environment build) |
| `vp fmt`, `vp lint`, `vp fmt --check`                                  | Passed using `node_modules/.bin/vp`                    |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check` | Passed                                                 |
| `git diff --check`                                                     | Passed                                                 |

Logs remain under `tmp/plugin-only/`. The final generated build was copied to
`tmp/plugin-only/generated-build/`; only generated tracked files, clean at entry,
were returned to their original HEAD bytes afterward. No dist diff remains.

## Isolated actual plugin environment

The standard explicit `npm run test:env:build` passed with project
`chathermes-plugin-only-1104`, dashboard port 9269 and MockServer port 1230.
A fresh test image then copied a `git archive` of the exact unmodified pin over
that base, because a floating release image alone does not establish pin parity.
No files from the abandoned integrated runtime were copied. The only launch
adjustment was executable permission on shell launchers. The source archive,
Dockerfile, Compose overrides and build logs remain in ignored `tmp/plugin-only/`.

The initial launcher `npm run test:integration -- tests/workflows/transcript.spec.ts
 tests/workflows/messaging.spec.ts tests/workflows/execution.spec.ts
 tests/workflows/reasoning.spec.ts` failed before tests: the daemon's default
address pools were exhausted. Its Compose invocation also removed this new
project's explicitly subnetted network. Restarting its retained containers after
network recreation left them healthy without published ports; fixture loading
failed and all 42 direct browser attempts failed at connection setup. Those
containers and their state remain intact. No other project was stopped or reset.

A fresh verified project, `chathermes-plugin-only-verified`, uses the checked-free
subnet `10.253.89.0/24`, dashboard `172.25.0.2:9279` and MockServer
`172.25.0.2:1240`. It starts with an explicit Compose override, then uses
`npm run test:fixtures` and the same repository Playwright workflows directly,
avoiding another network reconfiguration by the launcher. Stock MockServer loads
47 REST expectations. All infrastructure and synthetic session state are retained.

The verified image is `5929bf6ffc5f`. All 2,940 runtime Python files outside
upstream `tests/`, `nix/` and `website/` byte-match the pin. The upstream Docker
ignore excludes those nonruntime trees; their omission is not counted as a
runtime mismatch. `plugin_api.py` and built `dist/index.js` byte-match the tested
worktree. `transcript.py` differs only in two comment lines and has an identical
parsed AST. Fingerprints are in `runtime-verified.json`, `plugin-verified.json`
and `reader-ast-match.json` under `tmp/plugin-only/`.

## Browser commands and results

The first reachable broad direct run omitted `CHATHERMES_MOCKSERVER_PORT`, so the
two model-request verification checks queried the wrong MockServer endpoint and
returned 406 instead of 202. No product code or assertion was changed for this.
That broad process exited with SIGTERM (143) without a completion summary after
38 passing cases and those two failures; its final two mobile cases had not
completed. The cause of the termination was not established. Its log and
screenshots remain in `tmp/plugin-only/browser-verified.log` and `browser-broad/`.

The final focused run supplies the correct dashboard and inference endpoints and
covers every transcript case plus both affected model checks:

```sh
COMPOSE_PROJECT_NAME=chathermes-plugin-only-verified \
CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9279 CHATHERMES_MOCKSERVER_PORT=1240 \
CHATHERMES_TEST_SUITE=workflow CHATHERMES_TEST_URL=http://172.25.0.2:9279 \
CHATHERMES_TEST_CONTAINER=chathermes-plugin-only-verified-hermes-1 \
CHATHERMES_LIVE_CONTAINER=chathermes-plugin-only-verified-hermes-1 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
node node_modules/@playwright/test/cli.js test \
  tests/workflows/transcript.spec.ts tests/workflows/messaging.spec.ts \
  --grep 'resumed model and reasoning|legacy copies|compacted tool result|repeated occurrences|compacted rotated history|live tool response|mid-flight resume|archived multipart' \
  --project=desktop --project=mobile
```

The final result is **16 passed in 2.0 minutes**, eight per viewport: all 14
transcript scenarios and both model-request checks. The log is
`tmp/plugin-only/browser-final.log`; final screenshots remain in
`tests/visual-output/`. Combined with the successful cases from the broad run,
every one of its 42 selected scenarios has a passing run. The broad run itself
is not described as green or complete.

Screenshots were inspected at desktop and mobile sizes for repeated-turn
interleaving, compaction boundaries, focusable drafts while reading and streaming,
scroll position, model/reasoning selects, active/completed disclosures, resumed
text and authenticated archived user/assistant images. These are the actual
React-mounted dashboard plugin, not a standalone Vite page. Transcript tests use
real SQLite/native WebSockets and deterministic inference; the separate model
capability matrix test in the broad suite overrides the inventory response.
The final model-request checks verify real inference dispatch against MockServer.

There is no remaining failing product assertion in the selected scenarios.
The normal integration launcher's default-network exhaustion remains an environment
blocker; its workaround is explicit above. Android, Electron and crash-restart
verification were not performed.

## Limits

Each page scans lineage metadata twice (selection/revision validation). Payload
loading remains bounded, but there is no constant-work database paging claim,
materialized index or cross-request cache. Unindexed legacy rows need body reads
to derive missing identities. These costs are explicit in the current API docs.

A new occurrence and historical copy with identical legacy durable identity,
slot and generation shape can be indistinguishable. Absent immutable upstream
coordinates, the fallback cannot prove universal occurrence fidelity. Snapshot
matching remains conservative when prompts/corrections repeat or offsets are
absent/conflicting; tests of these cases are protocol tests, not proof of durable
event replay. Correction offsets are Python Unicode code-point offsets.

No plugin can recover progress events, intermediate tool states, disclosure timing
or correction boundaries that Hermes never persisted. No exact cold-restart
replay guarantee is made. No Electron, physical mobile device, real provider,
server-crash or real user session verification is claimed. No deployment, commit,
staging, push, separate-worktree edit or user database modification occurred.

## Reviewer follow-up: rotation before UID migration

The reviewer finding was independently reproduced against the unmodified source
pin `bf0203a794a07aac3ff764972ab9087baa4e4f4e`. In
`hermes_state_compression.py`, `publish_compression_child` closes the parent
session but leaves its message rows active. `_resume_lineage_ids` admits only
verified compression continuations and excludes forks/reset boundaries.
ChatHermes incorrectly required an inactive original for both in-place and
cross-session legacy copy matching. Independently backfilled child UIDs therefore
failed to alias to active parent originals; duplicate rows survived and child
rewind tombstones did not suppress the parent's copies.

The existing real SessionDB regression now also rotates **before** invoking the
actual `_advance_message_uid_backfill` migration, then optionally rewinds the
child. Before the fix, all eight added rotation combinations failed while all
eight in-place combinations passed. The matrix carries either one or both of two
identical same-timestamp turns, pages at limits 1 and 120, and checks both intact
and rewound histories. Raw SQL asserts all four parent originals remain active.
Reads preserve database rows and emit distinct logical display IDs.

The fix permits an active original across the already verified compression
lineage. Same-session inference still requires an inactive original and matching
slot. A new real-runtime control caught a second interaction: ordinal matching
could compete with a shared UID and absorb a fresh repeated send. Shared UIDs now
take precedence for that identity at a generation boundary. The control checks
the carried suffix plus a fresh identical send, child rewind, unchanged stored
rows and an isolated explicit branch. Existing foreign-owner, foreign-ancestor
and separate-profile-store tests remain passing. The initial control failure and
first full-suite failure are retained in `tmp/reviewer-rotation/initial-control.log`
and `pytest.log`. An intermediate focused run passed the send/rewind assertions
but its branch assertion included the existing compaction separator; the assertion
now compares visible messages, as the other occurrence assertions do.

Final checks for this follow-up:

| Command                                                                   | Result                                                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `uv sync --locked`                                                        | Passed                                                                         |
| `npm test`                                                                | 42 files, 1,289 tests passed                                                   |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                          | 524 passed, no skips                                                           |
| `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py` | 50 passed after strengthening the raw-row, display-ID and read-only assertions |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                       | 137 passed                                                                     |
| `npm run build`, `npm run test:env:build`                                 | Passed                                                                         |
| `vp fmt`, `vp lint`, `vp fmt --check`                                     | Passed using `node_modules/.bin/vp`                                            |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`    | Passed                                                                         |
| `git diff --check`                                                        | Passed                                                                         |
| Actual plugin browser contracts, desktop and mobile                       | 8 passed in 48.8 seconds                                                       |

Logs are in ignored `tmp/reviewer-rotation/`; the final Python logs are
`pytest-final.log` and `transcript-final.log`. The standard explicit environment
build passed. A separate test image `6f9a1362f232` copies the current plugin over
the previously verified pinned image; it runs in project
`chathermes-reviewer-rotation`, subnet `10.253.90.0/24`, dashboard
`172.25.0.2:9289`, MockServer `172.25.0.2:1250`. All 2,940 runtime Python files
again byte-match the pin (`runtime-verified.json`). The container reader differs
from the final worktree only in Ruff's wrapping of one set-intersection
expression; its parsed AST is identical. No Hermes source was edited. Other test
projects were left untouched; this project's containers and synthetic state are
retained.

Compose was started explicitly using the recorded `compose.yml` override,
followed by `npm run test:fixtures` (47 REST expectations), then the browser
command below. This avoids the previously documented exhausted default Docker
address pools; the standard integration launcher was not rerun in this follow-up.

```sh
COMPOSE_PROJECT_NAME=chathermes-reviewer-rotation \
CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9289 CHATHERMES_MOCKSERVER_PORT=1250 \
CHATHERMES_TEST_SUITE=workflow CHATHERMES_TEST_URL=http://172.25.0.2:9289 \
CHATHERMES_TEST_CONTAINER=chathermes-reviewer-rotation-hermes-1 \
CHATHERMES_LIVE_CONTAINER=chathermes-reviewer-rotation-hermes-1 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
node node_modules/@playwright/test/cli.js test tests/workflows/transcript.spec.ts \
  --grep 'legacy rotation|legacy copies|repeated occurrences|compacted rotated history' \
  --project=desktop --project=mobile
```

The new browser case uses real rotation, migration and child rewind, checking
two repeated ask/answer pairs before rewind and exactly one afterward, including
reload and composer focus. Screenshots under `tests/visual-output/` were inspected
at both viewports before and after rewind. Existing selected workflows also
verify paged ordering, reconnect and scrolling. Attachments, selects, live
disclosure transitions, Android and real providers were not reverified in this
follow-up. The legacy ambiguity limit above still applies when independently
backfilled rows have indistinguishable durable coordinates and no shared UID
witness. This change does not claim to recover missing occurrence provenance.

Existing worktree changes were preserved. Generated tracked dist files, clean at
entry, were restored to their HEAD bytes after validation; generated output stays
ignored and uncommitted. No staging, commit, push, deployment or user data edit
was performed.

## Final review follow-up: shortened tool output across rotation

Reproduced the finding with the unmodified pinned SessionDB
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. Real
`publish_compression_child` closes the parent without retiring or compacting its
message rows. The old selector required an inactive, compacted original and used
a session-local key, leaving both the active parent's full output and the child's
shortened copy visible. Replaying that suppression block in an ignored copy of
the reader against the final regression matrix yields 15 failures and nine
passing controls (`tmp/reviewer-tool-rotation/baseline-final.log`). No Hermes
source or persistence behavior was changed.

The reader now finds the first retained, non-model-only tool representative by
durable occurrence UID and timestamp across the already verified, profile-owned
compression lineage. Within a session, a later slot is suppressed; across sessions,
local display orders are not compared. Same-slot in-place pruning still selects
the live representative. Suppression runs after processing rewind metadata, so
a removed child copy still retires its ancestor occurrence. Matching does not
use tool call IDs, names or output text.

The regression matrix has 24 cases: in-place compaction or real rotation,
with or without a further rotation, page sizes 1, 2 and 120, and intact or rewound
history. Two original calls and a fresh call intentionally share call ID, name,
output and timestamp but have distinct runtime-minted UIDs. All real occurrences
remain visible once; a shortened handoff never appears. Rewind removes the carried
occurrence and the fresh one without resurrecting ancestor copies. Tests assert
active/uncompacted parent rows, unique logical display IDs, unchanged stored rows,
and rejection of foreign profiles through both root and tip IDs. Existing branch,
foreign ancestor and separate-profile-store controls also pass. The browser tool
regression now runs both real rotation and in-place compaction, before and after
reload.

Final checks:

| Command                                                                   | Result                                                |
| ------------------------------------------------------------------------- | ----------------------------------------------------- |
| `uv sync --locked`                                                        | Passed                                                |
| `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`    | Passed                                                |
| `vp fmt`, `vp lint`, `vp fmt --check`                                     | Passed using `node_modules/.bin/vp`                   |
| `npm test`                                                                | 42 files, 1,289 tests passed                          |
| `PYTHONPATH=.hermes-source:plugin uv run pytest`                          | 547 passed, no skips                                  |
| `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py` | 73 passed                                             |
| `PYTHONPATH=.hermes-source:plugin npm run test:api`                       | 137 passed                                            |
| `npm run build`, `npm run test:env:build`                                 | Passed                                                |
| Actual plugin browser contracts, desktop and mobile                       | 20 passed in 1.9 minutes; see process-exit note below |
| `git diff --check`                                                        | Passed                                                |

Logs and reproducible commands are retained in ignored
`tmp/reviewer-tool-rotation/`. The standard environment build passed; browser
verification used a separate pinned image `dbf56218695f`, with only the current
plugin copied over `chathermes-plugin-only-pinned:1104`. Project
`chathermes-reviewer-tool-rotation` uses subnet `10.253.91.0/24`, dashboard
`172.25.0.2:9299` and MockServer `172.25.0.2:1260`. Compose was started explicitly
with `tests/docker/compose.yml` plus the recorded override, then
`npm run test:fixtures` loaded 47 REST expectations. The standard integration
launcher was not rerun; the explicit Compose path avoids the previously observed
exhausted default address pools. All 2,940 shipped Hermes Python files byte-match
the pin; the plugin reader byte-matches the worktree. Upstream test and website
files absent from the production image are not counted as runtime comparisons.

`browser.sh` records the complete Playwright command. The selection covers
rotated/in-place tool output, legacy rotation/rewind, repeated occurrences, paged
scrolling/reconnect, home/in-flight composer focus, authenticated file/camera
uploads, model/reasoning selection reaching inference, and completed thinking/tool
disclosures. Desktop and mobile screenshots of the full tool output, expanded
thinking, and attachments were visually inspected. The full run printed
`20 passed` but the tool reported process exit 143 afterward; this is recorded
rather than represented as a clean runner exit. A focused rerun is recorded below.
Playwright replaces its output directory on a new invocation; only the final
run's screenshots remain under `tests/visual-output/`.

These are Chromium desktop and iPhone-sized viewport checks in the actual Hermes
React-mounted plugin. Physical mobile keyboards, Android, real providers and
server-crash recovery were not verified. Legacy provenance ambiguity remains as
documented above; the fix requires a shared durable occurrence UID and timestamp.
Test containers and synthetic state remain for inspection; other projects were
left untouched. Existing user edits were preserved: besides this appended record,
only the reader, transcript tests, transcript browser workflow and authoritative
API contract changed during this follow-up. Tracked generated dist assets were
clean on entry and restored to their HEAD bytes after validation; generated output
remains ignored. No staging, commit, push, deployment, user data edit or Hermes
modification was performed.

The focused final rerun (`sh tmp/reviewer-tool-rotation/browser-tool.sh`) passed
all four in-place/rotated tool cases across desktop and mobile in 17.3 seconds,
with process exit **0**. Its final full-output screenshots were also inspected.
The full-run process-exit limitation above does not affect this clean targeted
regression result. Final Python checks, frontend formatting and `git diff --check`
pass; no generated assets are staged or left as tracked modifications.
