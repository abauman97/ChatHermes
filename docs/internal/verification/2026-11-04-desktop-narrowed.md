# Desktop-aligned transcript implementation, 2026-11-04

Worktree base: `0d204b69c766a8cc0392ec8140423b9b16ea7fde` (clean before edits).
Source pin: `bf0203a794a07aac3ff764972ab9087baa4e4f4e`, read through
`.hermes-source`, a symlink to the user-designated read-only checkout. No source
patch, schema change, independent selector/storage, commit or push is part of this work.

## Characterization before replacement

Desktop `apps/desktop/src/api/sessions.ts` calls authenticated
`GET /api/sessions/{id}/messages` with `limit=120`, `order=latest`,
`include_compacted=true`, owner/profile routing, and chronological backfill.
It requires an explicit latest-order echo; short orderless/no-pagination replies
are complete and full orderless replies use complete oldest-first pagination.
The Python Desktop route resolves the resume tip, calls
`get_messages(include_compacted=True, include_ancestors=True)` and
`_project_for_display`. Its serializer includes display metadata/tool labels and
summary flags/projections; the gateway serializer is not equivalent.

Inside the plugin, the Desktop Python helpers and profile-local read-only DB
opener are available. The browser stays on authenticated plugin routes. Adaptation
is limited to profile/lineage ownership, safe response keys, hidden body removal,
`display_content`, authenticated image addresses, a source-row lookahead and a
native `conversation_revision` hash. No timestamps, retired anchors, inferred
occurrence aliases or marker reconstruction affect selection/order.

Desktop `resume-owner.ts::primaryResumeParams` separates REST history from native
state using `omit_messages=true` and deferred cold building. ChatHermes already
omitted history and preserved profile scope, stream barriers, cancellation and
submission uncertainty. `persisted-live-turn.ts` scans backward until a saved
final answer, validates source-addressed tool commentary and ordered corrections,
then subtracts a symmetric raw-text prefix within Unicode code-point correction
intervals. These are heuristics, not authoritative occurrence identities.
ChatHermes adapts these rules to its per-user block representation; receipt-based
completion and settled complete-prose checks remain interface adaptations.

## Red/green evidence and limits

- Before replacement: `PYTHONPATH=.hermes-source:plugin uv run pytest tests/transcript.test.py -k desktop_route -q` failed all four page sizes (1, 7, 119, 120): extra local marker identities differed from actual Desktop REST IDs.
- Before rendering fix: `npx vp test run src/features/chat/utils/transcript-entries.test.ts` failed all three new empty-block cases; prose/tool output disappeared. The image case initially used an unsupported URL and was corrected to an authenticated row address. The assertion now compares turn projections and covers image-only output too.
- After replacing local selection: four actual-handler comparisons passed. Five older tests failed solely because they expected invented compaction markers; expectations now follow actual Desktop.
- Synthetic assistant-only coverage: six user originals are retired and cloned later. Both saved paths return six answers followed by six prompts. This does not fix interleaving or establish why production coverage failed.
- Repeated text with different timestamps retains separate occurrences. Equal role/content/timestamp display identities collapse even after separate append calls. ChatHermes follows Hermes/Desktop rather than manufacturing identity.
- Multi-rotation measurement: a 120-row response caused a retained-ancestor payload read of **1,204 rows / 2,469,498 content characters**. This remains unbounded database work; the single-segment test is not evidence of bounded ancestor work.
- Pinned Desktop interval/prefix/candidate functions execute in frontend comparison tests with plain-text presentation adapters. This is not an Electron UI test or a full renderer comparison.

## Environment events

`uv sync --locked` and `npm ci` succeeded (npm reported 13 dependency vulnerabilities,
10 moderate/3 high; no unrelated dependency updates applied).
`npm run test:env:build` succeeded with official latest digest
`sha256:e6d81ae52ebf6a43efa529701405509f20054ba818f179ddd748bed4f8af584c`.
That image differs from the source pin and cannot certify pinned-runtime parity.
A local retained `chathermes-plugin-only-pinned:1104` image
`sha256:5929bf6ffc5f92f787ba24b2b1cf6406714dc9762b7f8143c7bda2eb64c34308`
has matching SHA-256s for `hermes_state_messages.py`, Desktop `sessions.py` and
native `methods_session.py`; final validation builds use it without source edits.

Initial project `chathermes-desktop-narrowed` used ports 19319/19320, binding
172.25.0.2. Automatic network creation failed: “all predefined address pools have
been fully subnetted”. A local override assigned `10.253.92.0/24` and startup
succeeded. The integration helper dropped that override; Compose unexpectedly
stopped the two new test containers and replaced their network despite
`--no-recreate`, then failed to allocate a new network. No other project was
targeted. Restarting with the override retained state but lost published-port
bindings (`HostConfig.PortBindings` present, `NetworkSettings.Ports={}`); fixture
loading timed out after 60 seconds with connection refused. State remains.

The Node Compose helper now accepts `CHATHERMES_COMPOSE_OVERRIDE`, preventing
build/preparation/test configuration drift. A fresh final project and ports avoid
replacing or stopping retained containers. A local immutable-base probe with
`docker build --pull` failed because Docker attempted to pull the image ID as a
repository; final pinned builds explicitly omit `--pull` and use the retained
image. All local override/probe files are under ignored `.venv/`.

## Final validation

Completed commands, mounted screenshots and remaining limitations are recorded
below. Intermediate failures remain as historical evidence.

Additional evidence during iteration:

- Full runtime audit: **1,680 Python files checked, zero mismatches** between
  `.hermes-source` and `chathermes-desktop-final-hermes-1`, covering root runtime,
  `agent/`, `gateway/`, `tui_gateway/` and `hermes_cli/` tracked Python files.
- First mounted invocation: all 10 cases failed before browser launch because
  Chromium v1243 was absent. `PLAYWRIGHT_BROWSERS_PATH=.venv/playwright npx
  playwright install chromium` succeeded inside this worktree.
- Next mounted transcript invocation: **8 passed / 2 failed**, both clone cases
  differing only by surrounding DOM whitespace. Desktop and plugin HTTP IDs and
  order already matched. The visible-text comparison now trims DOM whitespace.
  Screenshots/errors from that invocation are retained in ignored
  `.venv/first-mounted-evidence/` as well as the run's original output until rerun.
- `npm test`: **43 files / 1,302 tests passed** before the final hydration-race and
  deferred-ack regressions were added.
- `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.hermes-source:plugin npm run test:api`:
  **137 passed**.
- First full pytest: **493 passed / 1 failed**,
  `tests/artifacts.test.py::test_concurrent_writers_use_one_persistent_database`,
  `PRAGMA journal_mode=WAL: sqlite3.OperationalError: database is locked`.
  Focused rerun: **1 passed / 166 deselected**. Full rerun:
  **494 passed in 65.49s**. No unrelated database code was changed.
- A new delayed-hydration test reproduced dropped reasoning and flattened later
  text. Reconciliation now retains arriving block phases while subtracting only
  the initial snapshot prefix. Focused runtime comparisons pass.
- Cold primary resume now sends Desktop's `cols=96`, `defer_history=true`,
  `omit_messages=true`; a deferred `hydrating=true` ack means history was omitted,
  even when this pin does not include the explicit omitted flag.
- The mounted disclosure check established active tools defaulted closed, contrary
  to AGENTS.md's active-disclosure contract. Active tool bodies now open like
  reasoning, show updates, and collapse on untouched completion; manual intent
  remains respected. Existing component/workflow assertions follow that contract.

## Completed validation and reproducible commands

The final mounted image is `chathermes-desktop-final2-hermes:latest`, immutable ID
`sha256:53509419885d63115fa22ca1270cef5e56f2e24763c4079fd0412b9089b96234`.
A repeat audit against that running image checked **1,680 files, zero mismatches**.
Its plugin was built from this worktree; bundle `app-CSMD9ken.js` was used for the
mounted tests. The source checkout's `git diff --stat` is empty.

The final local override is `.venv/final2-compose.yml`. It selects
`.venv/Pinned.Dockerfile` (the repository Dockerfile with only `FROM` changed to the
verified retained `chathermes-plugin-only-pinned:1104` image) and assigns the
project network `10.253.94.0/24`. This local image is required to reproduce the
exact pin on this daemon; the official mutable `latest` does not match it.

Build commands executed successfully:

```sh
npm run test:env:build
npm run build
COMPOSE_PROJECT_NAME=chathermes-desktop-final2 \
CHATHERMES_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=19339 CHATHERMES_MOCKSERVER_PORT=19340 \
docker compose --project-directory . -f tests/docker/compose.yml \
  -f .venv/final2-compose.yml build hermes
```

The first command validated the normal latest-image build; the last command
built the exact pinned environment without pulling or modifying Hermes source.
The final `npm run build` also passed after implementation, before restoring
tracked generated assets. No generated `dashboard/dist/` changes remain in the
diff. Restoring those tracked files does not change the running test image.

Final local gates (all exit 0):

| Command                                                                       | Result                                                                 |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `uv sync --locked`                                                            | 49 packages resolved; locked development environment prepared          |
| `npx vp lint`                                                                 | Pass, no remaining warnings                                            |
| `npx vp fmt --check`                                                          | Pass                                                                   |
| `npm test`                                                                    | 43 files, **1,304 passed**                                             |
| `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.hermes-source:plugin npm run test:api` | **137 passed**                                                         |
| `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.hermes-source:plugin uv run pytest`    | **494 passed** on full rerun                                           |
| `PYTHONDONTWRITEBYTECODE=1 uv run ruff format .`                              | 128 files unchanged on final run                                       |
| `PYTHONDONTWRITEBYTECODE=1 uv run ruff check --fix .`                         | Pass                                                                   |
| `PYTHONDONTWRITEBYTECODE=1 uv run ty check`                                   | Pass                                                                   |
| `npm run build`                                                               | Pass; TypeScript/Vue checks and both plugin bundles built              |
| `git diff --check`                                                            | Pass                                                                   |
| `npx vp test run src/features/chat/utils/transcript-entries.test.ts`          | 12 passed, including empty blocks on both prompt and saved result rows |

After the disclosure-default change, one intermediate full frontend run had
**1,302 passed / 2 failed**: existing AssistantTurn assertions still expected
closed active edit/write tools. Those assertions now verify active expansion,
manual toggles and completion folding; the subsequent full run passed all 1,304.
An additional concurrent frontend run was interrupted (exit 143) when the known
login setup failure's Playwright process was intentionally interrupted; the full
successful frontend run above followed that interruption.

The first expanded mounted run timed out at `messaging.spec.ts:122` after 90s:
the login redirect had dropped `#/`, leaving the composer on Inbox with sending
disabled. It was interrupted with **1 failed / 1 interrupted / 18 not run**,
exit 130; containers were retained. Browser preparation now reopens the caller's
requested route after login. A separate real-login check returned
`/chathermes?profile=default#/` and the home composer. Failure screenshots are
retained under `.venv/login-route-failure-evidence/`.

The successful mounted runs use this exact environment prefix:

```sh
export PLAYWRIGHT_BROWSERS_PATH=.venv/playwright
export COMPOSE_PROJECT_NAME=chathermes-desktop-final2
export CHATHERMES_COMPOSE_OVERRIDE=.venv/final2-compose.yml
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=19339
export CHATHERMES_MOCKSERVER_PORT=19340
export CHATHERMES_DASHBOARD_URL_HOST=docker
```

```sh
npm run test:integration -- tests/workflows/transcript.spec.ts \
  tests/workflows/messaging.spec.ts tests/workflows/navigation.spec.ts \
  --grep 'Desktop-selected|live tool response|mid-flight resume|archived multipart|synthetic uncovered|native steering|file and camera|resumed model|Stop settles|reasoning and tools'
# 20 passed (2.5m), desktop + mobile

npm run test:integration -- tests/workflows/transcript.spec.ts \
  tests/workflows/navigation.spec.ts \
  --grep 'Desktop-selected|synthetic uncovered|session navigation' \
  --output tests/visual-output/parity-records
# 10 passed (1.5m), including default/alpha/beta on both viewports

npm run test:integration -- tests/workflows/transcript.spec.ts \
  --grep 'Desktop-selected|synthetic uncovered' \
  --output tests/visual-output/source-comparisons
```

The last slice writes durable JSON files containing Desktop REST source IDs,
plugin source IDs, offsets and rendered order, alongside screenshots. These are
synthetic fixture data, not user session exports. The earlier `info.attach`-only
version was not retained as files by the list reporter, so explicit JSON files
were added and the comparison slice rerun. Runs overlap; their test counts are
execution totals, not distinct additional scenarios.

## Acceptance audit and visual evidence

| Plan item                      | Current evidence                                                                                                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Characterize before editing | Base/pin checked; actual Desktop REST and native resume/reconciliation traced above; gateway/REST serializers distinguished                                                                                                                                                                 |
| 2. Comparison tests first      | Four red page comparisons before replacement; real pinned DB fixtures cover normal/repeated messages, compaction clones, rotations, rewind, file references and tool output; mounted comparisons use the same isolated DB on both authenticated REST paths                                  |
| 3. Saved history               | Local metadata selector, retired positioning and invented markers removed; actual Desktop handler comparisons at 1/7/119/120; profile/lineage ownership, response redaction and image-address tests pass                                                                                    |
| 4. Pagination                  | 120-row tail, chronological backfill, full oldest fallback, missing/orderless metadata, source counts, revision mutation/rotation, nonadvancing pages and live backfill tested; ancestor payload work measured separately and left unresolved                                               |
| 5. Native resume               | Deferred cold ack and omitted semantics aligned; actual pinned TS interval/prefix/candidate functions compared; delayed REST preserves arriving phases; native reconnect, subsequent deltas, corrections/offsets, no resubmission, model effects, Stop, images and profile isolation tested |
| 6. Empty blocks                | Prose, image-only and tool-only saved projections survive empty arrays on user and result rows; nonempty structured projections remain authoritative                                                                                                                                        |
| 7. Mounted plugin              | 20-case desktop/mobile run plus 10-case profile/parity run pass; real paced inference, real authentication/REST/WebSocket, no route mocks; screenshots inspected                                                                                                                            |
| 8. Documentation/validation    | API contract, architecture, testing and environment guidance updated; required local gates pass; exact failures and limits retained here; generated assets excluded                                                                                                                         |

Representative inspected screenshots (all ignored local artifacts):

- [Desktop active tool](../../../tests/visual-output/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-desktop/tool-streaming-expanded.png), [completed collapsed work](../../../tests/visual-output/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-desktop/activity-collapsed.png), [expanded completed work](../../../tests/visual-output/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-desktop/activity-expanded.png).
- [Mobile active tool](../../../tests/visual-output/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-mobile/tool-streaming-expanded.png), [mobile reconnect completion](../../../tests/visual-output/transcript-mid-flight-resu-6d0b4-d-later-deltas-exactly-once-mobile/history-mid-flight-complete.png).
- [Desktop native correction](../../../tests/visual-output/transcript-native-steering-4bb7c--without-another-submission-desktop/native-correction-resumed.png), [mobile native correction](../../../tests/visual-output/transcript-native-steering-4bb7c--without-another-submission-mobile/native-correction-resumed.png).
- [Desktop model/reasoning selection](../../../tests/visual-output/messaging-resumed-model-an-4b40a--the-real-inference-request-desktop/resumed-model-reasoning.png), [home attachment preview](../../../tests/visual-output/navigation-file-and-camera-c6b53-and-preserve-composer-focus-desktop/attachment.png), [archived mobile images](../../../tests/visual-output/transcript-archived-multip-4c87e-authenticated-row-addresses-mobile/history-archived-images.png).
- [Shared clone limitation, desktop](../../../tests/visual-output/parity-records/transcript-synthetic-uncov-3e0b8--shared-upstream-limitation-desktop/shared-desktop-clone-boundary.png), [mobile](../../../tests/visual-output/parity-records/transcript-synthetic-uncov-3e0b8--shared-upstream-limitation-mobile/shared-desktop-clone-boundary.png).

Inspection confirms readable dark layouts, native profile/reasoning selects,
focusable rounded composers, authenticated image previews, active output visible,
completed work collapsed/inspectable, and the shared answer-before-cloned-prompt
order. Workflow assertions check scroll anchoring, draft/focus, exact restored text,
subsequent deltas and one submission rather than inferring them from screenshots.

## Remaining limits and retained state

The Electron Desktop application itself was **not launched**: the supplied
read-only checkout has no compiled Desktop distribution and no Electron executable
is available. Comparisons execute its actual pinned REST handler and selected TS
functions, plus their real server route in the browser; they do not establish
complete Electron renderer parity. The plain-text comparison adapters do not
prove Desktop MEDIA/Markdown rendering equivalence. No production session was
opened, so the synthetic clone fixture does not diagnose its compaction inputs.

The uncovered clone ordering symptom remains on both saved paths. Exact equal
content/timestamp identities remain ambiguous. Multi-ancestor payload reads remain
unbounded. Native snapshots do not persist/replay every transient event; supported
running resume is tested, not lossless cold-reload reconstruction. Mobile coverage
is Chromium viewport emulation, not physical iOS/Android or native keyboard proof.
Real-provider testing was not run.

No commit, push or production deployment occurred. The initial Compose network
configuration drift did stop only this task's new `chathermes-desktop-narrowed`
containers, despite the requested no-shutdown constraint; this exception is
recorded above and was not repeated. Both successful validation projects (`chathermes-desktop-final` and
`chathermes-desktop-final2`) remain healthy and running. The initial
`chathermes-desktop-narrowed` project remains retained but stopped (observed
`FinishedAt=2026-11-04T21:27:30Z` for Hermes); it was not cleaned up. No explicit
`stop`, `down`, volume removal, prune or destructive reset was invoked.

Final artifact-run result: the plain comparison command printed **4 passed
(18.0s)** but its outer shell returned **143**. No live process handle remained.
A repeat with an isolated process session completed **4 passed (25.8s), exit 0**:

```sh
# Same final2 environment exports as above.
setsid --wait npm run test:integration -- tests/workflows/transcript.spec.ts \
  --grep 'Desktop-selected|synthetic uncovered' \
  --output tests/visual-output/source-comparisons
```

The retained files prove matching source pages at offsets 240/120/0 with
101/120/120 rows, and 338 rendered visible rows, on both viewports. The clone
records contain 13 identical Desktop/plugin source IDs (one hidden summary plus
12 visible rows), and the rendered six-answers-then-six-prompts sequence.

- [Desktop saved-page identities](../../../tests/visual-output/source-comparisons/transcript-Desktop-selecte-674a4-connect-and-excludes-rewind-desktop/desktop-rest-plugin-comparison.json)
- [Mobile saved-page identities](../../../tests/visual-output/source-comparisons/transcript-Desktop-selecte-674a4-connect-and-excludes-rewind-mobile/desktop-rest-plugin-comparison.json)
- [Desktop clone identities/order](../../../tests/visual-output/source-comparisons/transcript-synthetic-uncov-3e0b8--shared-upstream-limitation-desktop/desktop-rest-clone-comparison.json)
- [Mobile clone identities/order](../../../tests/visual-output/source-comparisons/transcript-synthetic-uncov-3e0b8--shared-upstream-limitation-mobile/desktop-rest-clone-comparison.json)

## Files changed

- [.gitignore](../../../.gitignore)
- [docs/developer/api-contract.md](../../../docs/developer/api-contract.md)
- [docs/developer/architecture.md](../../../docs/developer/architecture.md)
- [docs/developer/testing.md](../../../docs/developer/testing.md)
- [docs/internal/verification/2026-11-04-desktop-narrowed.md](../../../docs/internal/verification/2026-11-04-desktop-narrowed.md)
- [plugin/chathermes/dashboard/transcript.py](../../../plugin/chathermes/dashboard/transcript.py)
- [src/components/ActivityRow.test.ts](../../../src/components/ActivityRow.test.ts)
- [src/components/ActivityRow.vue](../../../src/components/ActivityRow.vue)
- [src/components/TurnWork.test.ts](../../../src/components/TurnWork.test.ts)
- [src/features/chat/components/AssistantTurn.test.ts](../../../src/features/chat/components/AssistantTurn.test.ts)
- [src/features/chat/runtime/assistant-turn.ts](../../../src/features/chat/runtime/assistant-turn.ts)
- [src/features/chat/runtime/native-gateway.test.ts](../../../src/features/chat/runtime/native-gateway.test.ts)
- [src/features/chat/runtime/native-gateway.ts](../../../src/features/chat/runtime/native-gateway.ts)
- [src/features/chat/runtime/native-session.test.ts](../../../src/features/chat/runtime/native-session.test.ts)
- [src/features/chat/runtime/native-session.ts](../../../src/features/chat/runtime/native-session.ts)
- [src/features/chat/runtime/persisted-live-turn.test.ts](../../../src/features/chat/runtime/persisted-live-turn.test.ts)
- [src/features/chat/runtime/persisted-live-turn.ts](../../../src/features/chat/runtime/persisted-live-turn.ts)
- [src/features/chat/utils/transcript-entries.test.ts](../../../src/features/chat/utils/transcript-entries.test.ts)
- [src/features/chat/utils/transcript-entries.ts](../../../src/features/chat/utils/transcript-entries.ts)
- [src/services/hermes-api.test.ts](../../../src/services/hermes-api.test.ts)
- [src/services/hermes-api.ts](../../../src/services/hermes-api.ts)
- [tests/docker/README.md](../../../tests/docker/README.md)
- [tests/docker/compose.mjs](../../../tests/docker/compose.mjs)
- [tests/docker/prepare-browser.mjs](../../../tests/docker/prepare-browser.mjs)
- [tests/fixtures/transcript.py](../../../tests/fixtures/transcript.py)
- [tests/plugin_api.test.py](../../../tests/plugin_api.test.py)
- [tests/transcript.test.py](../../../tests/transcript.test.py)
- [tests/workflows/messaging.spec.ts](../../../tests/workflows/messaging.spec.ts)
- [tests/workflows/transcript.spec.ts](../../../tests/workflows/transcript.spec.ts)
