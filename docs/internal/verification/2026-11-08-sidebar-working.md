# Sidebar working titles — 2026-11-08

Follow-up to PR 249, implemented only in the sidebar worktree. No upstream Hermes
edits, commits, pushes or deployment. Test containers and synthetic state remain
available for inspection.

## Behavior and ownership

Only the session title shimmers. Its unread weight/dot, selection, menu controls,
manual Active/Recents membership and ordering remain independent. The accessible
button name includes Working without introducing a live region or disabling
navigation. Reduced motion and forced colors retain readable static text.

The existing native viewer publishes profile/generation-guarded running snapshots
and turn events. The activity owner survives navigation, clears synchronously on
profile changes, rejects late responses after switching back, and lets newer
per-session events win over in-flight snapshots. Successful snapshots reap absent
or idle sessions; waiting stays working and starting alone does not. Errors and
unsupported reads retain known state. Visible polls, session-change refreshes,
focus/return and online recovery restore background work without opening viewers.

The authenticated launch route is `/session-activity/{target_profile}`. Two real
Hermes boundaries mattered:

- Legacy `session.active_list` ignores the profile parameter and returns live
  sessions across profiles. The projection checks each record's actual resolved
  owner before returning only runtime ID, stored ID and native status. Matching
  history IDs do not prove runtime ownership. Missing ownership follows Hermes's
  process-home rule, never the selected profile.
- Secondary plugin hosts do not own the browser's launch-dashboard registry.
  The target avoids both the `?profile` selector and a path parameter named
  `profile`, which would bind Hermes's FastAPI profile dependency. Native HTTP
  grants must own the target; secondary hosts and canonical authorities refuse
  the read rather than attesting an empty legacy registry.

The canonical authority has a different actor/event contract and is already
rejected by native chat. This change does not add canonical or remote authority
support. Unavailable snapshots can leave the last known indicator until a later
successful snapshot or terminal event.

## Validation

Reviewed source: `.hermes-source` links to the provided checkout at
`/opt/data/projects/ChatHermes/.hermes-source`, commit
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`; its working tree remained clean.
The contracts execute the pin's real legacy active-list handler and native
status/lookup functions, including duplicate IDs, process-home fallback,
rotation, waiting, starting, idle, errors, finalization and absence. Route tests
also use Hermes's actual profile dependency and native grant ownership check.

Final command results:

- `npm ci` and `uv sync --locked`: passed, dependency files unchanged.
- `npm test`: **1,477 passed**, 48 files.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **181 passed**.
- `PYTHONPATH=.hermes-source:plugin uv run pytest -q`: **592 passed**, plus
  **22 subtests passed**, no skips.
- `vp lint`, `vp fmt --check`, `uv run ruff format .`,
  `uv run ruff check --fix .`, and `uv run ty check`: passed.
- `npm run build` (also through `npm run test:env:build`): passed. Generated
  tracked dist files are restored after validation; generated output is excluded
  from the change.
- Browser workflow results and inspected screenshot links are recorded below.

## Dashboard environment and limits

Compose project `chathermes-sidebar-working`, dashboard port 19671, MockServer
port 19672, private bind `172.25.0.2`. Exhausted default network pools required the
ignored local `compose.override.yml` using subnet `10.249.67.0/24`. Use that same
configuration when inspecting the retained project. Infrastructure was explicitly
built with `npm run test:env:build` and applied with Compose `up --no-build`.

The official `nousresearch/hermes-agent:latest` base resolved to digest
`sha256:adb7890916de63245523492be8f68f9d2095fecbec4e2a6dab7960381f0fc002`;
the final project image is `615dddc4982a`. This is an official-image browser
verification, not an assertion that its entire source matches the reviewed pin.
AST comparisons of `_session_live_status`, `_session_lookup_key`,
`_session_pending_kind` and `_session_live_item` were identical to the pin.

Playwright's default expected browser was absent. The workflows use the existing
Chrome for Testing **145.0.7632.6** through `CHATHERMES_CHROMIUM`, with desktop
and iPhone 13 Chromium viewport projects. These checks do not establish native
Android/iOS keyboard behavior or rendered Electron Desktop parity. No live
provider or Android/device tests were run. Browser traces remain disabled.

Earlier failures were retained and investigated: old frontend shared-response
mocks needed an explicit activity stub; the real host dependency exposed the
`profile` path-parameter collision; and the mobile fixture reused a completion
identity that Inbox correctly deduplicates across sessions. The fixture now uses
a per-session identity. Screenshot calls disable animations to capture settled
drawers; separate CSS assertions verify animation and reduced-motion behavior.

The sidebar error scenario uses its own paced malformed-inference expectation
and explicit repair-failure expectation. The generic interrupted fixture can
finish before the sidebar's list read renders, so it cannot reliably attest a
visible working-to-error transition. This pacing is inference behavior, not a
fixed setup/readiness sleep.

## Final browser slices

Runs used the real authenticated React-mounted plugin and stock MockServer REST
fixtures, without API route interception or fabricated native frames. All runs
were sequential within this Compose project. Common environment:

```sh
export COMPOSE_PROJECT_NAME=chathermes-sidebar-working
export CHATHERMES_COMPOSE_OVERRIDE=compose.override.yml
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=19671
export CHATHERMES_MOCKSERVER_PORT=19672
export CHATHERMES_DASHBOARD_URL_HOST=172.25.0.2
export CHATHERMES_CHROMIUM=/opt/hermes/tools/chromium-1208/chrome-linux64/chrome
```

- Fault slice: `npm run test:integration -- tests/workflows/sidebar-working.spec.ts --grep 'failed native' --output=tests/visual-output/sidebar-errors-final`:
  **2 passed**, desktop and mobile (22.5 seconds). This observes running before
  waiting for error output, which can be delivered with completion. The drawer
  helper checks its actual expanded state, and the fault test awaits the native
  running control before opening it, after first-send navigation has completed.
- Regression slices select `sidebar unread|resumed model and reasoning|reasoning and tools share|file and camera inputs`
  from `sidebar-unread.spec.ts`, `messaging.spec.ts` and `navigation.spec.ts`:
  **5 desktop passed** (57.2 seconds); **4 mobile passed, 1 skipped** (42.3 seconds).
  The skipped case is explicitly desktop-only narrow-desktop coverage, which
  passed in the desktop run. These verify model/reasoning application at real
  inference, disclosure transitions, file/camera uploads, focus, profile selects,
  unread tracking and responsive navigation.

Some longer repeat invocations received SIGTERM (exit 143), without a complete
Playwright result. The cause was not established; the retained Hermes container
reported no restart and no OOM. Final confirmation is split into shorter slices.
Earlier failed-run screenshots/context remain under the ignored visual output
folders rather than being deleted as cleanup.

- State/waiting desktop slice: `npm run test:integration -- tests/workflows/sidebar-working.spec.ts --grep 'survives navigation|waiting for native' --project=desktop --output=tests/visual-output/sidebar-states-desktop-final`:
  **2 passed** (57.6 seconds). It verifies three simultaneous real turns across
  two profiles (including the same stored ID in both), independent cancellation,
  navigation, unread coexistence, reduced motion, offline completion, reconnect,
  successful history/read-state restoration and bounded focused composer
  scrolling. The waiting case verifies the real native clarification status and
  forced-colors fallback through successful completion.
- The equivalent state/waiting mobile slice, with `--project=mobile` and
  `--output=tests/visual-output/sidebar-states-mobile-final`: **2 passed**
  (55.9 seconds).

Final browser total across the sequential completed slices: **15 passed,
1 intentional skipped mobile instance of a desktop-only case**. No selected
scenario remains failing. The earlier interrupted repeats and superseded fixture
failures are not counted as completed passing runs.

## Inspected screenshots

These are local ignored test artifacts, not checked-in visual references:

- [Desktop working and unread together](../../../tests/visual-output/sidebar-visible-final/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-desktop/sidebar-working-unread.png)
- [Mobile working and unread together](../../../tests/visual-output/sidebar-visible-final/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-mobile/sidebar-working-unread.png)
- [Mobile reduced motion](../../../tests/visual-output/sidebar-visible-final/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-mobile/sidebar-working-unread-reduced.png)
- [Mobile completed after reconnect](../../../tests/visual-output/sidebar-visible-final/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-mobile/sidebar-working-reconnected-finished.png)
- [Mobile waiting in forced colors](../../../tests/visual-output/sidebar-states-mobile-final/sidebar-working-waiting-fo-2595d-ing-until-the-turn-finishes-mobile/sidebar-working-waiting-forced-colors.png)
- [Mobile error with focused draft](../../../tests/visual-output/sidebar-errors-final/sidebar-working-a-failed-n-76016--leaves-the-composer-usable-mobile/sidebar-working-error-settled.png)
- [Desktop authenticated attachment](../../../tests/visual-output/sidebar-regressions-desktop-final/navigation-file-and-camera-c6b53-and-preserve-composer-focus-desktop/attachment.png)
- [Mobile completed disclosures](../../../tests/visual-output/sidebar-regressions-mobile-final/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-mobile/activity-expanded.png)

The final working-tree check has no staged files and no dist diff. The provided
Hermes source checkout is unchanged. Infrastructure and synthetic history remain
retained; no cleanup, commit, push or deployment was performed.

Screenshot confirmation rerun:
`npm run test:integration -- tests/workflows/sidebar-working.spec.ts --grep 'survives navigation' --output=tests/visual-output/sidebar-visible-final`
passed **2 additional repeats** (1.7 minutes). Retained fixture history had grown
long enough to put the target below the visible navigation area, so the workflow
now scrolls the target into view before capturing it. The linked coexistence,
reduced-motion and reconnect screenshots use these final captures. This also
exercises the sidebar's real bounded scrolling. Application code did not change.

## Independent review follow-up

The follow-up preserves the existing uncommitted implementation and makes no
commit, push or deployment. Compression changes the native lookup key while the
selected viewer continues publishing its original attached stored ID. The
activity response now includes `session_keys`: the original key and native
compression lineage. The browser shares work and event revision ordering across
these IDs, including an identity learned only when an in-flight snapshot returns.
Native branches/delegates remain separate. Navigation does not retire the work.

Legacy `methods_prompt._submit_to_ledger_owner` can queue through an external
canonical owner despite the dashboard lacking `session_authority`. The real
relay publishes start/completion without changing the legacy `running` bit.
The activity projection now checks the owning profile's durable admissions and
worker ledger across compression identities and canonical chat IDs. Pending,
outcome-unknown and failed/unavailable reads return `unknown`, preserving known
work rather than claiming idle. Idle native viewer snapshots defer to this check.

`tests/session_activity.test.py` executes the reviewed pin's actual submit gate,
`SessionAuthority`, `AuthorityConnection`, FIFO claim/settlement and owner relay.
It reuses the pin's setup helpers; only discovery/socket dialing are replaced by
an in-process connection. It witnesses relayed `message.start` while native
legacy live status is idle, verifies `unknown`, and verifies idle only after
successful or failed settlement. An actual relay connection-loss frame produces
Hermes's synthetic completion while our ledger snapshot remains unknown, including
a subsequent owner restart/outcome-unknown recovery. Other checks cover real
multi-compression lineage, excluded forks, failed DB reads and minimal payloads.

Frontend regressions mount the actual Sidebar with `useSessionActivity` and
`useNativeSession`, replacing only the native transport adapter. They attach the
original ID, rotate the rendered row to a continuation, poll, navigate/reattach,
preserve work across an idle viewer/unknown activity snapshot, and clear all
aliases on success/error completion despite a stale in-flight working snapshot.
Focused activity tests also cover aliases first learned after a terminal event.

Limits: this projection does not query an external owner's current live status.
Unknown rows do not invent work on a fresh mount. Hermes's synthetic completion
on relay loss can clear observed work even if durable execution continues; the
activity snapshot retains an honest unknown status and cannot reconstruct that
live state. Canonical transport support remains outside this legacy contract.

Follow-up checks:

- `uv sync --locked`: passed; dependency files unchanged.
- Final `npm test`: **1,482 passed**, 48 files. This includes retaining learned
  aliases when an unknown snapshot has incomplete lineage after a DB failure.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **181 passed**.
- `PYTHONPATH=.hermes-source:plugin uv run pytest -q`: **595 passed**, plus
  **22 subtests**. The later added failure-outcome parameter was validated in
  the final focused `tests/session_activity.test.py` run: **6 passed**.
- `vp fmt`, `vp fmt --check`, `vp lint`, `uv run ruff format .`,
  `uv run ruff check --fix .`, non-modifying Ruff checks and `uv run ty check`:
  passed.
- `npm run build` and the explicit environment build: passed. One final Docker
  build received exit 143 during an ENTRYPOINT metadata step. Its cause was not
  established; a direct Compose build retry reused the retained layers and
  completed as image `3799c8e32817`. No reset or failure cleanup was used.
- The reviewed Hermes source remains at `bf0203a794a07aac3ff764972ab9087baa4e4f4e`
  with a clean working tree. Browser images use the same official base digest
  recorded above; this does not claim the whole image matches that source pin.

Initial follow-up browser slices, using image `f00cf5c57796` before the final
incomplete-lineage cache addition:

- `sidebar-working.spec.ts --grep 'compressed continuation|failed native|waiting for native'`
  with output `tests/visual-output/sidebar-review`: **6 passed** across desktop
  and mobile (1.3 minutes).
- `messaging.spec.ts navigation.spec.ts --grep 'resumed model and reasoning|reasoning and tools share|file and camera inputs'`
  with output `tests/visual-output/sidebar-review-controls`: **6 passed** across
  desktop and mobile (1.1 minutes). Actual model/reasoning dispatch, active and
  completed disclosures, authenticated file/camera upload, selects and focused
  composer behavior passed. Inspected the desktop expanded work disclosure,
  mobile camera attachment and mobile error/focused-draft screenshots.

The compressed-session workflow seeds native compression prerequisites, opens the
original ancestor route in the actual plugin, sends through real inference,
checks the live continuation and lineage response, navigates to Home/reloads
without a transcript viewer, reattaches the original route and completes native
clarification. Mid-turn identity rotation and in-flight completion races are
covered by the mounted frontend and pinned SQLite regressions; the browser test
uses a pre-compressed prerequisite rather than forcing the compressor mid-turn.

Final-image confirmations (`3799c8e32817`):

- `sidebar-working.spec.ts --grep 'compressed continuation|survives navigation' --project=desktop`
  with output `tests/visual-output/sidebar-review-final-desktop`: **2 passed**
  (1.3 minutes), command exit 0. The profile scenario also checks offline
  completion/reconnect, independent Stop, reduced motion, focused composer
  scrolling and unread coexistence. Inspected the continuation's working and
  completed screenshots with the actual row scrolled into view.
- The equivalent combined mobile invocation printed **2 passed** (59.4 seconds),
  but its parent command returned 143. It is not counted as a clean completed
  command. State and screenshots were retained; the cause remains unestablished.
- Separate mobile continuation confirmation, output
  `tests/visual-output/sidebar-review-mobile-compressed`: **1 passed** (15 seconds),
  command exit 0. The final mobile working-row and focused scrolling screenshots
  were inspected, along with the earlier mobile camera attachment/error captures.
- Separate mobile profile/navigation confirmation, output
  `tests/visual-output/sidebar-review-mobile-profiles`: **1 passed** (48.4 seconds),
  command exit 0.

Follow-up browser total: **16 passed in commands that exited 0**. The combined
mobile run that printed two passes but returned 143 is recorded separately and
excluded from that total. No final selected scenario remains failing. These are
Chromium desktop/mobile viewport tests, not native Android/iOS keyboard tests.
No live provider was used. All project containers and synthetic state remain
available. Nothing was committed, staged, pushed or deployed; generated tracked
dist output was restored to its initial clean state.

Inspected follow-up artifacts (local, ignored):

- [Desktop continuation working](../../../tests/visual-output/sidebar-review-final-desktop/sidebar-working-compressed-dfc8a-g-navigation-and-completion-desktop/compressed-background-working.png)
- [Desktop continuation completed](../../../tests/visual-output/sidebar-review-final-desktop/sidebar-working-compressed-dfc8a-g-navigation-and-completion-desktop/compressed-completed.png)
- [Mobile continuation working](../../../tests/visual-output/sidebar-review-mobile-compressed/sidebar-working-compressed-dfc8a-g-navigation-and-completion-mobile/compressed-background-working.png)
- [Mobile focused composer scrolling](../../../tests/visual-output/sidebar-review-final-mobile/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-mobile/sidebar-working-composer-scroll.png)
- [Mobile authenticated camera attachment](../../../tests/visual-output/sidebar-review-controls/navigation-file-and-camera-c6b53-and-preserve-composer-focus-mobile/attachment.png)
- [Desktop expanded completed work](../../../tests/visual-output/sidebar-review-controls/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-desktop/activity-expanded.png)

## Independent review: preferred compression continuation

Reproduced the review finding against the unchanged reviewed source pin
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. With an older `ws_orphan_reap`
child and a live compression tip, actual `get_compression_lineage('root')`
returns `root, stale`, `get_compression_lineage('tip')` returns only `tip`,
and actual `resolve_resume_session_id('root')` returns `tip`.

The activity projection now verifies each ancestor using the pin's preferred
compression edge (`_CHAIN_STEP_SQL`), then follows that same rule forward from
the runtime key. It excludes stale siblings and branch/reset/delegate/tool
children, and no longer trusts an unrelated original stored ID. All alias,
canonical chat owner and pending-ledger reads share a SQLite savepoint snapshot.
Cycles and bounded-walk failures return unknown without publishing partial aliases.

Regression coverage includes pending admissions at the root and its canonical
chat owner, runtime keys at root or tip, duplicate lineages in separate profile
databases, unrelated children and stored IDs, cycle cleanup, concurrent rotation
and admission, and newer root viewer start/completion events during an unknown
snapshot. The frontend race also checks profile isolation.

Validation for this follow-up:

- `uv sync --locked`, Ruff formatting/fixes, `uv run ty check`, `vp fmt`,
  `vp fmt --check`, `vp lint`, and `git diff --check`: passed.
- Full Python suite: **606 passed** before the final three additional regressions;
  the final focused activity suite: **19 passed**, including those additions.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **181 passed**.
- The frontend activity suite: **10 passed**, including both new event races.
- Initial full `npm test`: **1,482 passed** before the two new frontend races.
  A subsequent default full rerun ended with exit 143 without a result; its cause
  was not established, and it is not counted as a pass. Final
  `npm test -- --maxWorkers=2`: **1,484 passed**, 48 files, exit 0 (45.90 seconds).
- `npm run build` and explicit `npm run test:env:build`: passed. Tracked generated
  dist files were restored to their initially clean HEAD versions after the image
  build; no generated assets were staged.
- The stale-sibling compressed-continuation workflow passed on desktop and mobile:
  **2 passed in 39.0 seconds**, exit 0. It verifies resume from root, aliases
  containing root/tip but excluding stale, waiting activity, navigation, viewer
  reattachment, clarification completion and cleared working state. Both working
  and completed screenshots were inspected at both sizes.

Browser verification used test image `c5add3356f4c` and the official base digest
already recorded above. Its compression/messages source files differ from the
reviewed checkout: browser results are official-image evidence, while Python
regressions are exact-pin evidence. The initial browser invocation failed before
running scenarios because the default browser executable was absent; the passing
rerun explicitly used installed Chromium 1243. An unnecessary browser download
attempt was stopped after locating that installation. Failed-run output remains
under `tests/visual-output/sidebar-lineage-review/`; passing artifacts are under
`tests/visual-output/sidebar-lineage-review-browser/`.

The local uv interpreter links SQLite 3.50.4; Hermes deliberately selects DELETE
journaling for that version. The deterministic writer-race regression therefore
verifies the writer queues behind the read snapshot locally. Its WAL-specific
interleaving branch was not exercised in that run. The official image uses SQLite
3.53.1, but the browser test does not force a simultaneous database publication.
These are Chromium viewport tests, not Android/iOS device tests. Attachments,
selects and all disclosure transitions were not rerun for this backend correction;
earlier verification above remains separate evidence. No real provider was used.
All test infrastructure/state remains available. No commit, push or production
deployment was performed.

## Receipt ownership and native busy review correction

The activity projection now calls the reviewed pin's
`hermes_state_local.local_lineage_owner(conn, session_id)` for each verified
compression alias. That helper requires membership in the canonical owner's
stored receipt lineage before accepting an inherited `chat_id`. Owner validation,
compression traversal and pending-ledger reads all use the existing savepoint on
one connection. Neither a stale sibling nor a tool child inherits the parent's
pending work merely by sharing its chat ID.

Ledger pending state and failures now preserve confirmed native `working` and
`waiting`. Other native statuses become `unknown` when the ledger cannot attest
idle. This restores the indicator from the first activity snapshot without
requiring an earlier browser event, while keeping uncertain external work honest.

New pinned-runtime regressions cover missing, malformed, unrelated and valid
receipts for root, preferred continuation, stale sibling and tool sessions;
pending admissions and database-open/read failures for working, waiting, idle
and starting; and receipt publication during the existing rotation/admission
race. The earlier canonical-owner fixture now includes a validating receipt.
Existing frontend coverage verifies that a first working/waiting snapshot restores
activity and an unknown snapshot alone does not invent it. The pin remains
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`, with a clean source tree.

Checks for this correction:

- `uv sync --locked`: passed; dependency files unchanged.
- `PYTHONPATH=.hermes-source:plugin uv run pytest tests/session_activity.test.py -q`:
  **48 passed**.
- `PYTHONPATH=.hermes-source:plugin uv run pytest -q`: **638 passed**, plus
  **22 subtests**, no skips.
- `npm test -- --maxWorkers=2`: **1,484 passed**, 48 files.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **181 passed**.
- `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`,
  `vp lint`, `vp fmt`, `vp fmt --check`, `npm run build` and `git diff --check`: passed.
  Initially clean tracked dist assets were restored after build validation;
  generated output was not staged.

This correction changes the backend projection and documentation only. No new
browser/device visual run or container rebuild was performed; the prior visual
results above are separate evidence. The SQLite writer race exercised local
DELETE journaling, not the WAL interleaving branch. No commit, push or deployment
was performed; retained test infrastructure and state were left intact.

## Incomplete busy lineage review correction

The activity response now carries `session_keys_complete` independently of native
activity status. A failed compression traversal returns the live lookup key with
`false` while preserving confirmed `working`/`waiting`; successful traversal stays
complete even if the later canonical-owner/ledger read fails. No partial traversal
aliases are published.

The browser retains previously verified runtime aliases on incomplete snapshots
only when the current lookup key belongs to the existing group in the selected
profile. Profile changes, runtime disappearance, unrelated lookup identities and
complete replacement groups discard the old aliases. Missing completeness on an
older unknown response retains the same guarded compatibility behavior.

Regressions cover the exact verified root/tip → incomplete working/waiting → root
completion → incomplete unknown sequence, plus each reset boundary. The Python
contracts verify both failed lineage traversal with confirmed busy status and
successful traversal followed by failed ledger checks. A first regression run
caught an approval fixture that remained waiting after simulated completion; the
fixture now clears its pending approval as well as its running bit.

Validation for this correction:

- `uv sync --locked`: passed; dependency files unchanged.
- Focused activity suites: **16 frontend tests**, **52 Python tests** passed.
- `npm test -- --maxWorkers=2`: **1,490 passed**, 48 files.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **181 passed**.
- `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`,
  `vp fmt`, `vp lint`, `vp fmt --check`, and `npm run build`: passed.
- `PYTHONPATH=.hermes-source:plugin uv run pytest -q`: **642 passed**,
  plus **22 subtests**, no skips.
- `git diff --check`: passed; no staged changes or tracked dist changes remain.

The reviewed Hermes source remains clean at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. No browser/device visual run,
container rebuild, real-provider call, commit, push or deployment was performed
for this correction. Earlier visual results are separate evidence. Generated
tracked dist files were restored after build validation; generated assets were
not staged. Existing test containers and state remain intact.

## Final independent review and publication gate

Reviewed the complete change in this exact worktree, including launch-host
authentication, runtime profile ownership, native lifecycle guards, preferred
compression edges, one-snapshot ledger reads, incomplete-lineage retention and
event/snapshot ordering. No additional material application defect was found.
Corrected the browser workflow's stale exact-field assertion to include
`session_keys_complete`; without this correction the latest activity response
would fail the profile/reconnect workflow.

Fetched `origin` before validation and again before publication. The remote
default branch is `main`; the branch started exactly at its current commit
`b69ecfed6833138ab4252d1935f394a762bbcca5` (zero commits ahead or behind).
No reconciliation with upstream was needed.

Fresh local validation:

- `uv sync --locked`: passed; dependency files unchanged.
- `vp fmt`, `vp fmt --check`, and `vp lint`: passed.
- `npm test -- --maxWorkers=2`: **1,490 passed**, 48 files.
- `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`,
  then non-modifying Ruff format/check and ty checks: passed.
- `PYTHONPATH=.hermes-source:plugin uv run pytest -q`: **642 passed**,
  plus **22 subtests**, no skips.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **181 passed**.
- `npm run test:env:build`, including `npm run build`: passed. Applied the
  resulting image **819c0859ff5d** with explicit Compose
  `up -d --wait --no-build`, using the same project, ports and ignored network
  override documented above. The official base digest is unchanged.
- `git diff --check`: passed. Tracked generated dist files were restored after
  the image build; no generated assets are included in the change.

Fresh browser commands use the common environment recorded above. All four
completed commands exited **0**, with **14 passed** and no skips:

```sh
npm run test:integration -- tests/workflows/sidebar-working.spec.ts --grep 'compressed continuation|failed native|waiting for native' --output=tests/visual-output/sidebar-release-transitions
# 6 passed (50.9 seconds), desktop and mobile
npm run test:integration -- tests/workflows/sidebar-working.spec.ts --grep 'survives navigation' --project=mobile --output=tests/visual-output/sidebar-release-mobile-profiles
# 1 passed (50.4 seconds)
npm run test:integration -- tests/workflows/sidebar-working.spec.ts --grep 'survives navigation' --project=desktop --output=tests/visual-output/sidebar-release-desktop-profiles
# 1 passed (49.1 seconds)
npm run test:integration -- tests/workflows/messaging.spec.ts tests/workflows/navigation.spec.ts --grep 'resumed model and reasoning|reasoning and tools share|file and camera inputs' --output=tests/visual-output/sidebar-release-controls
# 6 passed (43.5 seconds), desktop and mobile
```

The initial full desktop sidebar invocation, output
`tests/visual-output/sidebar-release-desktop`, reported three passing scenarios
but returned **143 (SIGTERM)** before the compression scenario reported a result.
Its cause is unestablished; the retained dashboard container has zero restarts
and reports no OOM. This invocation is excluded from the passing total. The
smaller completed commands above cover every selected scenario. No reset or
failure cleanup was performed.

Inspected fresh screenshots in the actual authenticated React-mounted plugin:

- [Desktop working and unread](../../../tests/visual-output/sidebar-release-desktop/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-desktop/sidebar-working-unread.png)
- [Desktop completed after reconnect](../../../tests/visual-output/sidebar-release-desktop-profiles/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-desktop/sidebar-working-reconnected-finished.png)
- [Desktop focused scrolling composer](../../../tests/visual-output/sidebar-release-desktop/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-desktop/sidebar-working-composer-scroll.png)
- [Desktop compressed continuation working](../../../tests/visual-output/sidebar-release-transitions/sidebar-working-compressed-dfc8a-g-navigation-and-completion-desktop/compressed-background-working.png)
- [Mobile working and unread](../../../tests/visual-output/sidebar-release-mobile-profiles/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-mobile/sidebar-working-unread.png)
- [Mobile focused scrolling composer](../../../tests/visual-output/sidebar-release-mobile-profiles/sidebar-working-sidebar-wo-94331-es-and-coexists-with-unread-mobile/sidebar-working-composer-scroll.png)
- [Mobile compressed continuation working](../../../tests/visual-output/sidebar-release-transitions/sidebar-working-compressed-dfc8a-g-navigation-and-completion-mobile/compressed-background-working.png)
- [Mobile compressed continuation completed](../../../tests/visual-output/sidebar-release-transitions/sidebar-working-compressed-dfc8a-g-navigation-and-completion-mobile/compressed-completed.png)
- [Mobile error and focused draft](../../../tests/visual-output/sidebar-release-transitions/sidebar-working-a-failed-n-76016--leaves-the-composer-usable-mobile/sidebar-working-error-settled.png)
- [Mobile forced-colors waiting](../../../tests/visual-output/sidebar-release-transitions/sidebar-working-waiting-fo-2595d-ing-until-the-turn-finishes-mobile/sidebar-working-waiting-forced-colors.png)
- [Mobile authenticated camera attachment](../../../tests/visual-output/sidebar-release-controls/navigation-file-and-camera-c6b53-and-preserve-composer-focus-mobile/attachment.png)
- [Mobile model and reasoning select](../../../tests/visual-output/sidebar-release-controls/messaging-resumed-model-an-4b40a--the-real-inference-request-mobile/resumed-model-reasoning.png)
- [Desktop completed disclosure expanded](../../../tests/visual-output/sidebar-release-controls/messaging-reasoning-and-to-1a0e6-ith-the-active-stream-below-desktop/activity-expanded.png)

Working titles remain readable beside independent unread dots and navigation
controls. Drawer and composer scrolling stay bounded, focused drafts remain
usable after background completion/errors, and the attachment preview, native
selects and inspectable disclosures fit both layouts. Workflows verify active
and completed disclosure transitions and actual model dispatch. Screenshot
capture disables animation; separate CSS assertions check shimmer, reduced
motion and forced-colors behavior.

Limits remain Chromium desktop and iPhone 13 viewport emulation, using Chrome
for Testing 145.0.7632.6 and stock MockServer inference. No native Android/iOS
keyboard, Electron, live-provider or external canonical-owner visual test was
performed. Browser compression is a real pre-compressed prerequisite; mid-turn
rotation races use the pinned Python and mounted frontend contracts. The
reviewed `.hermes-source` checkout remains clean at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. No other worktree was modified and no
deployment was performed. Test containers and synthetic state remain retained.
These fresh results satisfy the visual gate for the authorized commit and PR.
