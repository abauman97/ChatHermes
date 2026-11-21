# Kanban completion verification — 2026-11-21

This isolated checkout changes only the completion UI, its regressions and documentation.
Both task details and drag/drop request a user-authored, trimmed, nonblank summary
before sending `PATCH /api/plugins/kanban/tasks/{id}?board={board}` with
`{status: "done", summary: "…"}`. Cancel/Escape sends no write. Changing the board,
task, or viewer availability discards the draft. In-flight writes and dispatch
retain their original board/task identity. Errors remain generic; upstream bodies
are never rendered. Other moves retain their status-only payload.

Read-only contract inspection used `/opt/hermes/plugins/kanban/dashboard/plugin_api.py`
and `/opt/hermes/hermes_cli/kanban_db.py`: the route accepts `result` and `summary`,
and the live completion gate treats stripped nonblank text as substantive evidence.
No Acumatica, user task, provider secret or other worktree file was intentionally changed.
An isolation mistake affected another retained deterministic fixture as detailed below.
No deploy, commit, push or PR was performed.

## Environment and commands

- `npm ci`: exit 0; lock unchanged. npm reported 13 existing audit findings
  (10 moderate, 3 high); no dependency remediation or changes were made.
- `uv sync --locked`: exit 0, Python 3.14.4; lock unchanged.
- `git clone --no-checkout https://github.com/NousResearch/hermes-agent.git .hermes-source`
  followed by `git -C .hermes-source checkout --detach 2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`:
  exit 0. An initial checkout before the clone finished failed with missing tree;
  a redundant fetch was stopped while the original clone completed.
- `PLAYWRIGHT_BROWSERS_PATH="$PWD/tmp/playwright-browsers" npx playwright install chromium`:
  exit 0; browser stays inside this checkout.
- `vp fmt`: exit 0; used throughout editing.
- `vp test run src/features/kanban`: exit 0, **28 passed**, four files.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: exit 0, **182 passed**.
- `npm run build`: exit 0; also invoked by each explicit environment build.
- `vp lint`: exit 0.
- `vp fmt --check`: exit 0.
- `git diff --check`: exit 0.

The first `npm test` run exited 1: 2,059 passed, four failures across three unchanged
files. Artifact extraction exceeded its 4,000 ms budget; independent rendering
exceeded 1,500 ms; memory processing exceeded 250 ms; the pinned memory producer
subprocess exceeded 5,000 ms. The concurrent source clone and other checks were
still active. The second `npm test` also exited 1: 2,060 passed, three failures
(artifact extraction, memory processing and producer timeout). No thresholds or
unrelated implementation were changed. Logs: `/tmp/chathermes-kanban-npm-test.log`
and `/tmp/chathermes-kanban-npm-test-final.log`.

A full-suite run, `npm test -- --maxWorkers=1`, exited 0: **2,064 passed**,
60 files, 70.01 seconds. This includes the stale-snapshot regression, before the final cancellation-focus refinement.
No test budgets or source implementations outside Kanban were changed. Log:
`/tmp/chathermes-kanban-npm-test-serial.log`.

The subsequent complete single-worker run after focus refinement exited 1:
**2,063 passed, one failed** (60 files), 115.81 s. The unchanged artifact-extraction
test exceeded its 4,000 ms budget at 16k and 32k hidden notes. Log:
`/tmp/chathermes-kanban-npm-test-serial-final.log`. A final retry after browser/build
work completed reported 32k extraction at 5,224.3 ms, then terminated with exit 143
before a full-suite summary; the cause of SIGTERM was not established. Log:
`/tmp/chathermes-kanban-npm-test-idle-final.log`. The full-suite result is therefore
intermittent and is **not** claimed green on the final patch. Focused Kanban, API,
build, static quality and final browser workflows pass.

## Isolated dashboard

Compose project: `chathermes-kanban-completion`; final private bind `172.25.0.2`,
dashboard port `31471`, MockServer port `31480`. The first integration attempt exited 1 before browser startup because
Docker's default network pools were exhausted. An ignored override at
`tmp/kanban-compose.yml` assigns the unused subnet `10.247.139.0/24`, following the
repository's documented procedure. Existing networks/containers were not removed.

Commands use this environment:

```sh
export COMPOSE_PROJECT_NAME=chathermes-kanban-completion
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=31471 CHATHERMES_MOCKSERVER_PORT=31480
export CHATHERMES_COMPOSE_OVERRIDE="$PWD/tmp/kanban-compose.yml"
export PLAYWRIGHT_BROWSERS_PATH="$PWD/tmp/playwright-browsers"
export CHATHERMES_CHROMIUM="$PWD/tmp/playwright-browsers/chromium-1243/chrome-linux64/chrome"
npm run test:env:build
docker compose --project-directory . -f tests/docker/compose.yml -f tmp/kanban-compose.yml up -d --wait --no-build
npm run test:integration -- tests/workflows/kanban.spec.ts
```

Earlier attempts used daemon-loopback publications 24719/24780 but accessed the
daemon hostname. Another retained deterministic project,
`chathermes-result-resume`, already published those ports on the daemon's private
address. Thus the browser and fixture-loader HTTP traffic reached that project,
while image/revision checks inspected this project's container. This was an
isolation error. Those screenshots do **not** verify this patch. Debugger script
inspection identified the served baseline asset `app-DEwiDMpW.js`, unlike this
project's built `app-DhnZwjt9.js`; Docker publication metadata confirmed the
collision. Earlier attempts created fresh synthetic `kanban-*` boards/tasks,
comments and attachments and loaded 53 repository inference expectations into
the other fixture's MockServer. No preexisting user task was selected for
mutation. No cleanup/reset or further writes to that project were attempted.
The user was informed immediately after identification. Known synthetic board
slugs from retained screenshots include `kanban-fbb9a3f2`, `kanban-ae3e2ceb` and
`kanban-af411cc3`; earlier attempts also created fresh random slugs. Retained
misdirected screenshots are under ignored `tmp/kanban-misdirected-screenshots/`.
No reads or writes to those board resources were used to enumerate or clean them.

The final private-endpoint preflight returned HTTP 200 and the expected
`app-DhnZwjt9.js` asset. The workflow now compares the served entry with the
inspected fixture asset before making test mutations.

The browser scenario was also corrected to move through Ready, as the pinned
workflow does not offer completion from Triage. Code review added a regression
for differing board/detail refresh timing; movement now prefers the displayed
detail for the same task identity. Failed runs retained containers and state.

## Final visual result

The final `npm run test:env:build` exited 0, including `npm run build` for
final source. Explicit Compose apply exited 0. Verified image:
`sha256:b21531989b553a3beb58e6ba6d329c178fa56537474880237348b96fd99c18eb`.
`npm run test:integration -- tests/workflows/kanban.spec.ts` exited 0:
**two passed**, desktop 12.8 s, mobile 14.5 s, total 28.9 s.
Final served Vue asset: `app-D-wU5SH9.js`.
Log: `/tmp/chathermes-kanban-integration-pass.log`.

The first correctly targeted browser run found cancellation focus relied on the
active element; the task-details move event now supplies task ID and the native
select explicitly, and drops retain the originating card. Focus restoration is
asserted in regression tests. An intermediate build rejected a possibly undefined
detail reference in the inline event closure; the explicit ID event resolved it.
The desktop drag scenario initially attempted a target outside the horizontal
viewport and produced no drag events. It now waits for the card to become
draggable, scrolls Done into view, verifies the source is in the viewport, then
uses native Playwright drag/drop. No coordinate setup or fixed sleep was added.

Screenshots were opened and visually inspected at desktop 1280×720 and Chromium's
mobile iPhone 13 viewport, 390×664 (3× device scale). The summary textarea is
focused, text and controls fit, and the task remains Ready before submission.
The completed view shows Done and the user-authored summary in the expanded result
disclosure. Native desktop drag/drop opens the same form for the dragged task.
The complete workflows also verify heading/composer-independent focus, cancellation,
scrolling, native board/movement selects, comment editing, authenticated attachment
upload/download/removal, Run history/Worker log disclosure expansion, board
switching, event synchronization, archive/delete and Inbox task routing.
Mobile is a Chromium viewport test; real iOS keyboard and Android were not tested.

Inspected artifacts (ignored, relative to repository root):

- [Desktop summary](../../../tests/visual-output/kanban-Kanban-opt-in-board-d4f03-nd-upstream-synchronization-desktop/kanban-completion-summary.png)
- [Desktop drop summary](../../../tests/visual-output/kanban-Kanban-opt-in-board-d4f03-nd-upstream-synchronization-desktop/kanban-drop-summary.png)
- [Desktop saved result](../../../tests/visual-output/kanban-Kanban-opt-in-board-d4f03-nd-upstream-synchronization-desktop/kanban-completed.png)
- [Mobile summary](../../../tests/visual-output/kanban-Kanban-opt-in-board-d4f03-nd-upstream-synchronization-mobile/kanban-completion-summary.png)
- [Mobile saved result](../../../tests/visual-output/kanban-Kanban-opt-in-board-d4f03-nd-upstream-synchronization-mobile/kanban-completed.png)

## Review

Self-review checked both entry points share completion validation, cancellation
cannot dispatch, encoded task IDs and explicit board slugs survive deferred writes,
late callbacks cannot close a new draft, unsafe errors stay hidden, and
non-completion moves keep their existing payload. Regression tests exercise both
entry points, whitespace, Cancel/Escape, scope changes, delayed success/failure,
cross-board drags, stale snapshots, and other transitions.

Generated dist files are restored after validation and are excluded from the patch.

## Independent review follow-up — 2026-11-21

This follow-up addresses only the two independent review findings. The completion
summary textarea is now disabled throughout the pending write/refresh, preventing
post-submit edits from being silently discarded. Failure retains the submitted
evidence and re-enables editing. Successful completion waits for the operation's
refresh, `busy` release and Vue DOM update before restoring focus. Captured origin
and scope guards suppress restoration after board/task changes (including changing
away and back), viewer disablement or unmount/navigation. Drag completion locates
the same task's replacement card after movement recreates its DOM element.

Regressions use deferred PATCH and refresh promises to verify the disabled summary,
retained editable evidence after failure, no premature focus, enabled controls at
restoration, replacement-card focus and stale-scope suppression. The real dashboard
workflow additionally asserts the enabled selector is focused after completion on
both desktop and mobile, and the completed dragged card is focused on desktop.
Pending-state timing is covered by focused component tests; the browser workflow
does not artificially delay or mock the real Hermes API.

Only the documented `chathermes-kanban-completion` project was used for this
follow-up. Before browser/fixture traffic, Docker inspection verified ownership
and exact private publications for Hermes (`172.25.0.2:31471`) and MockServer
(`172.25.0.2:31480`). Explicit URL overrides and
`CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2` prevented daemon-hostname fallback.
The initial preflight matched the retained `app-D-wU5SH9.js`; after explicit
rebuild/apply it returned HTTP 200 and matched `app-CBvZOJKW.js` to the inspected
container. The workflow repeats that asset comparison before board/task writes.
No other fixture, live board or Acumatica was accessed during this follow-up.

Validation on the review fixes:

- `vp fmt`: exit 0.
- `vp test run src/features/kanban`: exit 0, **34 passed**, four files.
  Log: `/tmp/chathermes-kanban-review-focused.log`.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: exit 0, **182 passed**.
  Log: `/tmp/chathermes-kanban-review-api.log`.
- `npm run test:env:build`: exit 0, including `npm run build` (Vue typecheck and
  production plugin assets). Log: `/tmp/chathermes-kanban-review-build.log`.
- Explicit Compose apply with the existing override, `up -d --wait --no-build`:
  exit 0. Log: `/tmp/chathermes-kanban-review-apply.log`.
- Private-endpoint/served-asset preflight: exit 0.
  Log: `/tmp/chathermes-kanban-review-preflight.log`.
- `npm run test:integration -- tests/workflows/kanban.spec.ts`: exit 0,
  **two passed**, desktop 17.3 s, mobile 14.6 s, total 35.9 s.
  Log: `/tmp/chathermes-kanban-review-integration.log`.
- `vp lint`, `vp fmt --check` and `git diff --check`: exit 0.
- `npm test -- --maxWorkers=1`: exit 1, **2,068 passed, two failed**, 60 files,
  126.96 s. Both failures are timing budgets in unchanged
  `src/features/artifacts/artifacts.test.ts`: 8k reference-definition extraction
  took 2,146.3 ms against 2,000 ms; 8k hidden-note extraction took 6,524.7 ms
  against 4,000 ms (16k/32k also exceeded the budget). Build/API/focused checks
  overlapped this run. No unrelated code or test thresholds were changed, and
  the final full suite is **not** claimed green.
  Log: `/tmp/chathermes-kanban-review-all.log`.

Verified review image:
`sha256:53c7a47da29f994004503e846157d3268b1552d1c3d56b663764a73799986bb9`.
The five completion screenshots linked above were regenerated and opened for visual
inspection: desktop summary, drop summary and saved result, and mobile summary and
saved result. The form fits, focused summary text is readable and the result shows
the saved evidence. Full workflows also passed scrolling, native selects, authenticated
attachment upload/download/removal, cancellation and disclosure interactions.
Mobile remains Chromium's iPhone 13 viewport, not real iOS/Android keyboard testing.

Containers/state remain retained. Existing user changes were preserved. Generated
tracked dist assets were restored after validation, leaving no dist diff. No commit,
deploy or push was performed.

## P2 refresh overlap correction — 2026-11-21

The preceding review follow-up did not fully fix drag completion focus. Its
component regressions mocked `useBoard.refresh`, concealing the actual overlap:
when a board read was already in flight, `read()` set `dirty` and returned an
already-resolved promise. The completion mutation therefore released `busy` and
focused the original Ready card before the queued board response recreated that
card under Done, losing focus.

`useBoard` now returns one pending promise for the complete board-read drain.
Overlapping invalidations still queue a fresh read after the current one, so the
mutation's refresh cannot be satisfied by a pre-mutation snapshot. Every caller
awaits the queued reads as well. The queue, controller and disposed guards remain
local to the existing board/availability/archive/visibility lifetime; disposed
responses cannot update snapshots, initiate another queued read or reconnect.
Completion's existing Vue update and scope guards then restore the replacement
Done card only after the refresh and busy release.

Four added page regressions mount the actual `useBoard` implementation, with only
API responses deferred. They hold a pre-mutation board read open, submit drag
completion, release the stale Ready snapshot, then release the separately queued
Done snapshot. They assert no premature focus/busy release, a second board read,
and focus on the recreated Done card. Board change, viewer disablement and
navigation variants verify request abortion and suppress stale focus; the board
change also rejects the obsolete Done response even when transport ignores abort.
Existing composable lifecycle tests continue to cover polling, event reconnects,
hidden viewers, task identity and late responses. Temporarily restoring the
original composable made all four new cases fail on premature origin focus;
the fixed implementation passes. This is a real composable overlap regression,
not a mocked refresh promise.

Validation:

- Red check: `vp test run src/features/kanban/pages/KanbanPage.test.ts -t 'drains real useBoard'`
  against the original composable: exit 1, **four failed** as expected.
  Log: `/tmp/chathermes-kanban-p2-red.log`. The fixed source was restored immediately.
- `vp fmt`: exit 0. `vp test run src/features/kanban`: exit 0,
  **38 passed**, four files. Log: `/tmp/chathermes-kanban-p2-focused.log`.
- `npm test -- --maxWorkers=1`: exit 0, **2,074 passed**, 60 files,
  65.07 s, before the test snapshot metadata correction below.
  Log: `/tmp/chathermes-kanban-p2-all.log`.
- Final `npm test -- --maxWorkers=1` after the snapshot metadata correction:
  exit 0, **2,074 passed**, 60 files, 65.12 s.
  Log: `/tmp/chathermes-kanban-p2-all-final.log`.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: exit 0,
  **182 passed**, 27.86 s. Log: `/tmp/chathermes-kanban-p2-api.log`.
- Initial build/lint typechecking caught missing required `latest_event_id` in
  the new regression's snapshot helper. Adding the field resolved all three
  diagnostics; no production change was needed for this correction.
  Initial build: exit 2, `/tmp/chathermes-kanban-p2-build-initial.log`.
- Final `npm run test:env:build`: exit 0, including `npm run build` and Vue
  typecheck. Log: `/tmp/chathermes-kanban-p2-build.log`.
- Explicit Compose apply, using the unchanged ignored subnet override and
  `up -d --wait --no-build`: exit 0.
  Log: `/tmp/chathermes-kanban-p2-apply.log`.
- Project/private-publication/served-asset preflight: exit 0.
  Log: `/tmp/chathermes-kanban-p2-preflight.log`.
- `npm run test:integration -- tests/workflows/kanban.spec.ts`: exit 0,
  **two passed**, desktop 15.8 s, mobile 12.7 s, total 29.3 s.
  Log: `/tmp/chathermes-kanban-p2-integration.log`.
- Final `vp lint`, `vp fmt --check` and `git diff --check`: exit 0.
  Logs: `/tmp/chathermes-kanban-p2-lint.log`,
  `/tmp/chathermes-kanban-p2-format.log`.

Only `chathermes-kanban-completion` was accessed for this correction. Before any
HTTP preflight or fixture/browser traffic, Docker metadata verified that both
containers belonged to that project and published only the documented private
addresses: Hermes `172.25.0.2:31471`, MockServer `172.25.0.2:31480`. The retained
entry matched `app-CBvZOJKW.js` before rebuilding. After rebuild/apply, publication
ownership was checked again, the dashboard returned HTTP 200 and matched
`app-nBvRqHab.js` from the inspected container, and the private MockServer status
endpoint returned 200. The environment explicitly set both URL overrides and
`CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2`; the browser workflow repeated its entry
asset assertion before creating synthetic boards/tasks.

Verified image:
`sha256:395d92e7bae1c5b135f7f801dc08d7e9ce1c226856800a1a18d3b0430df3844a`.
All five completion screenshots linked above were regenerated and opened:
desktop summary, drop summary and saved result, plus mobile summary and saved
result. Text and controls fit, the summary is visibly focused, and the saved
result displays the authored evidence. Both real dashboard workflows passed
focus, cancellation, scrolling, native selects, authenticated attachments and
disclosure interactions, including desktop focus on the moved Done card.
The deterministic overlap itself is covered by the actual-composable regression;
the browser workflow uses real Hermes without response delays or route mocks.
Mobile remains Chromium's iPhone 13 viewport, not a native keyboard/device test.

No other fixture or production endpoint was accessed, and no commit, push,
deployment or cleanup/reset was performed. Containers and state remain retained.
Existing user changes were preserved; generated tracked dist output was restored
following validation and is excluded from the patch.

## Final review P2: refresh starvation — 2026-11-21

The shared drain promise described in the preceding correction could remain
pending indefinitely when invalidations arrived during every read. Refresh now
owns a completion boundary per board read. Callers arriving during an in-flight
read share one queued promise for the next read; that promise settles after its
read attempt, even when subsequent events have already queued another read.
Reads remain serialized and invalidations remain coalesced. A mutation still
waits for a read started after its invalidation, never a pre-mutation response.
Disposal releases queued callers and prevents their reads from starting; existing
abort, scope, snapshot, detail and socket guards remain in place. Failed reads
retain safe error handling and allow the next queued read to recover.

The mounted composable regression keeps invalidations arriving across twelve
read completions, combining WebSocket events with pairs of overlapping refresh
callers. It checks each earlier batch settles while the next read remains
pending, exact read counts/coalescing, snapshot progression and final settlement.
Additional composable cases cover failure/recovery and disposal with a transport
that ignores abort. The actual-composable page regression now includes a later
pending invalidation during completion: busy clears and focus reaches the new
Done card after the post-mutation read, while the later caller remains pending.
The original pre-mutation caller now correctly settles at its own read boundary.

Restoring the previous shared-drain algorithm temporarily made the sustained
composable regression fail immediately: the initial caller remained unsettled
after its read completed. Exit 1 was expected; the fixed source was restored in a
`finally` block. Log: `/tmp/chathermes-kanban-starvation-red.log`.
An initial new-test run timed out because the test itself awaited the next batch
before releasing its deferred response. The harness was corrected to collect
those promises and await them after releasing the final reads; no timeout was
changed. The corrected focused suite passes all 42 tests in four files.

Final validation was run sequentially, with no overlapping test/build jobs in
this checkout:

- `vp test run src/features/kanban --maxWorkers=1`: exit 0, **42 passed**,
  four files, 6.11 s. Log: `/tmp/chathermes-kanban-starvation-focused.log`.
- `npm test -- --maxWorkers=1`: exit 0, **2,078 passed**, 60 files,
  82.37 s. Log: `/tmp/chathermes-kanban-starvation-all.log`.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: exit 0,
  **182 passed**, 9.17 s. Log: `/tmp/chathermes-kanban-starvation-api.log`.
- `npm run test:env:build`: exit 0, including `npm run build` and Vue
  typechecking. Log: `/tmp/chathermes-kanban-starvation-build.log`.
- Explicit isolated Compose apply with the existing override,
  `up -d --wait --no-build`: exit 0.
  Log: `/tmp/chathermes-kanban-starvation-apply.log`.
- Project/private-publication/served-asset preflight before rebuilding and again
  after apply: exit 0. Logs:
  `/tmp/chathermes-kanban-starvation-preflight-before.log` and
  `/tmp/chathermes-kanban-starvation-preflight.log`.
- `npm run test:integration -- tests/workflows/kanban.spec.ts`: exit 0,
  **two passed**, desktop 16.2 s, mobile 12.8 s, total 29.8 s.
  Log: `/tmp/chathermes-kanban-starvation-integration.log`.
- `vp lint`, `vp fmt`, `vp fmt --check`, `git diff --check`: exit 0.
  Logs: `/tmp/chathermes-kanban-starvation-lint.log`,
  `/tmp/chathermes-kanban-starvation-fmt.log`,
  `/tmp/chathermes-kanban-starvation-format.log`,
  `/tmp/chathermes-kanban-starvation-diff.log`.

The same isolated environment exports documented above were used, including both
explicit URL overrides and the private host. Docker inspection verified project
ownership and exact private publications before any HTTP preflight or browser/
fixture traffic. No other fixture or live board was accessed. The post-apply
entry matched `app-CCLkSqMD.js` in the inspected container. Verified image:
`sha256:2d89e0ee9d0ab198eb9410fad3f2a559248dc1f1decdb8bf7a35c488ed792931`.
The browser scenario repeated its served-asset assertion before creating its
fresh synthetic boards (`kanban-692af580` desktop, `kanban-86022ad2` mobile).

All five completion screenshots linked earlier were regenerated and opened for
visual inspection. Desktop summary, drop summary and saved result, and mobile
summary and saved result show readable controls, focused summary entry, and the
saved authored result. The real dashboard workflows passed focus restoration,
cancellation, scrolling, native selects, authenticated attachments, disclosure
interactions and board isolation. Sustained deferred-read timing is covered by
the real composable tests; browser workflows use real Hermes without route mocks
or artificial response delays. Mobile is Chromium's iPhone 13 viewport
(390×664 at 3× scale); native iOS/Android keyboard behavior was not tested.

Existing user changes remain intact. Tracked generated dist output was restored
after validation; generated assets remain excluded from the patch. No commit,
push, deployment, cleanup/reset or writes to another fixture were performed.
The isolated containers and state remain retained.
