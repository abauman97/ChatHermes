# Issue #59: selected-session reconstruction

Preflight was completed before edits in the clean `codex/issue-59-reconnect`
worktree. HEAD and origin/main both matched
`f0b77d1895737a15a58456b1ecedbe56c41517a4`.

The implementation premises were confirmed against that source:

- `NativeViewer.disconnected()` scheduled backoff retries on the existing viewer.
  `ensure()` reused its socket/channel and reopened after failure.
- App visibility recovery called `native.reconnect()` only on becoming visible.
  The session owner delegated that call to the existing viewer's `ensure()`.
- Online events called visibility recovery; navigation closed the session owner
  and constructed a fresh viewer instead.
- Snapshot callbacks replaced visible messages before retained replay completed;
  replay/live callbacks incrementally mutated that same visible state.
- The authenticated `chat.attach` route acquires the existing profile/session
  owner. `Owner.attach()` activates its runtime, or resumes stored history when
  needed. It does not dispatch a prompt. `chat.replay` returns retained ordered
  frames with an epoch and bounded cursor. Attach returns open requests through
  the upstream request channel. `chat.ready` advertises capabilities; it is not
  a session reconstruction completion marker.
- `/runs` has a separate state/stream owner. No change to its recovery policy was
  needed. The reported frequency and physical mobile/PWA failure could not be
  established from source alone; the overlapping paths and partial publication
  that motivate the issue were present. There was no material contradiction
  requiring an issue comment.

The session owner now coordinates `ready → stale → reconnecting → ready`.
Background/offline transitions dispose the viewer and invalidate callbacks and
pending history work while preserving the visible transcript and requests.
Initial activation, navigation, foreground/network recovery, and live socket
failure use the same fresh-viewer reconstruction. Signals share an in-flight
promise; navigation or backgrounding supersedes it. A visible live failure gets
one reconstruction attempt. A failed attempt stays stale with explicit retry,
without a timer loop. Snapshot, replay, requests, and buffered live delivery are
staged until the viewer reports successful reconstruction, then applied in one
synchronous Vue render batch. Sending, stop, guidance, and request answers are
gated separately from the editable/focusable composer. Recovery never submits
or restarts an agent.

Earlier validation (before the fresh-review fix below; visual results do not
verify the final worktree):

- `npm test`: 334 tests passed across 21 files, including hidden activation,
  deduplication, atomic activity/tool output/request restoration, failed recovery,
  explicit retry, profile/navigation/background supersession, no automatic
  ticket retry, unopened-socket disposal, and invalid replay boundaries.
- `npm run test:api`: 103 passed. System Python lacked pytest; the command was run
  with `/tmp/chathermes-active-session-tests/bin` prepended to PATH. No environment
  or dependency files were changed.
- `npm run build`: passed; shipped dashboard assets regenerated.
- `vp fmt`, `vp lint`, and `vp check`: passed with the existing 23 lint/type
  warnings (no errors). Commands used `node_modules/.bin/vp`.
- `git diff --check`: passed.
- Actual Hermes fixture dashboard launched through `npm run live`, using the
  pinned Dockerfile and named disposable data volume. The launcher corrected the
  injected hostname endpoint to `tcp://172.25.0.2:2375`. Default bridge address
  pools were exhausted; two new dedicated networks were created with unused
  explicit subnets. Instance `f0b77d18-issue59` used port 9159. Existing containers,
  networks, and personal Hermes homes were untouched.
- `native-chat.spec.ts`: all 16 desktop/mobile cases passed, covering home focus,
  retained recovery exceeding 512 events, reload/second viewer, guidance/stop,
  clarification and approval restoration, model selection, file/camera image
  admission and authenticated reopening, uncertain submission, attach failure,
  and explicit recovery before retrying send.
- `native-reconnect.spec.ts`: both desktop/mobile cases passed. Real authenticated
  sockets used controlled visibility signals, delayed attach, and a failed
  attach to check hidden suppression, foreground/online deduplication, visible
  stale progress, reconnect notice, retained draft/focus, retry, and exactly one
  prompt submission. The initial desktop run used an overly strict text selector
  matching a notice with a nested retry button; that selector was corrected and
  both projects rerun successfully.
- Screenshots were inspected for mobile and desktop stale/reconnecting/restored
  states, request selects, images, active expanded thinking, and completed
  collapsed disclosures. Native burst recovery exercised overflowing progress.
  Artifacts are local under `tests/visual-output/` and
  `/tmp/chathermes-issue59-reconnect-visual/`; they are not committed.

Mobile verification used Chromium's iPhone 13 viewport emulation, not physical
Safari/iOS or an installed home-screen app. No real provider was used. Fixture
containers were stopped with `CHATHERMES_INSTANCE=f0b77d18-issue59 npm run live:stop`;
the named test volume was preserved. No commit, push, or deployment was performed.

## Fresh-review fix: interrupted attachment preparation

Rejected submission cleanup now uses the selected profile/session and pending
attempt identity rather than the viewer generation. Background/offline recovery
may replace the viewer while keeping that selection. A known rejection removes
only its optimistic row, releases its local busy projection, and recomputes the
uncertainty lock after settling only its own persisted attempt. The existing App
catch restores the rejected text to the composer for the original selection.
Closing/navigating resets the pending identity, so late preparation completion
cannot change another selected session, including returning to the same IDs.
Dispatched/ambiguous outcomes retain their existing locks; nothing auto-retries.
Attachment files still require explicit reselection after rejection, matching
existing rejected-send behavior; text draft recovery is covered here.

Fresh validation:

- Focused native reconstruction, native viewer, and App tests: 60 passed.
- `npm test`: 344 tests passed across 21 files. New cases cover pending upload
  interrupted by background/offline/navigation, no `chat.submit`, optimistic row
  retirement and text draft restoration through reconnect, same-ID reselection,
  another attempt's uncertainty, a newly selected session's ambiguous submission,
  and preservation of dispatched accepted/unknown projections and locks.
- `npm run test:api`: 103 passed with
  `/tmp/chathermes-active-session-tests/bin` prepended to PATH.
- `npm run build`: passed; committed dashboard asset paths regenerated.
- `vp fmt`, `vp lint`, and `vp check`: passed with the existing 23 warnings and no
  errors, using `node_modules/.bin/vp`.
- `git diff --check`: passed.
- No new actual-dashboard visual coverage is claimed for this fix. The previous
  visual suite rerun stopped at the login wall; the earlier successful visual
  results above are historical, not verification of the final tree. These new
  App regression cases use jsdom and mocked authenticated uploads/viewers.
- No commit, push, or deployment was performed.

## Lint warning cleanup

Linting the initial worktree and an isolated `git archive HEAD` snapshot with the
same installed dependencies and repository configuration produced the same 23
warnings. The reconnect follow-up moved warning locations but introduced no new
warnings. No lint rules, configuration, or suppressions were changed.

Targeted changes:

- `src/lib/hermes-api.ts`: normalize every supported `HeadersInit` form through
  `Headers`, then set the required accept/content-type headers while preserving
  caller headers such as the admission idempotency key.
- `src/lib/assistant-turn.ts` and `src/lib/native-session.ts`: narrow event text,
  run IDs, and delegated child IDs before displaying or composing them. Use one
  native child identity resolver for both reduction and late-event routing;
  delegation fallback requires a string ID and an integer task index.
- `src/App.test.ts`, `src/run-idempotency-recovery.test.ts`, `src/runs.test.ts`,
  and `src/lib/hermes-api.test.ts`: decode request bodies with `Response.json()`
  instead of coercing arbitrary `BodyInit` values. Header assertions inspect
  standard header values, including authentication absence and idempotency.
- `src/lib/assistant-turn.test.ts` and `src/lib/native-reconnect.test.ts`: cover
  valid and malformed event identities/text and native status/error fallbacks.
- `tests/visual/streaming.spec.ts`: extract the URL from string, URL, and Request
  fetch arguments explicitly.
- Rebuilt `plugin/chathermes/dashboard/dist/index.js` and the generated app asset
  `assets/app-J7_yFFIM.js`; the old asset is replaced. Existing issue #59 and
  interrupted attachment preparation changes remain in the worktree.

Final validation:

- `node_modules/.bin/vp fmt`, `vp lint`, and `vp check`: passed, zero warnings,
  lint errors, or type errors. The executable was invoked from `node_modules`
  because `vp` is not available on the interactive shell's PATH.
- Focused affected-source tests: passed (141 tests before adding the final native
  status case; the final native reconstruction file separately passed all 16).
- `npm test`: 347 tests passed across 21 files after all code/test edits.
- `npm run test:api`: 103 passed with
  `/tmp/chathermes-active-session-tests/bin` prepended to PATH.
- `npm run build`: passed; dashboard assets regenerated.
- Actual-dashboard Playwright verification: 8 passed across desktop Chrome and
  Chromium iPhone 13 emulation. Selected tests cover native clarification,
  native model/image admission and durable reopen, foreground reconstruction,
  and ordered legacy streaming. Composer focus, draft retention, scroll position,
  selects, and active/completed disclosure transitions were checked. Desktop and
  mobile screenshots were inspected, including stale/restored progress, request
  selects, expanded/collapsed disclosures, and saved image attachments. Local
  screenshots remain under ignored `tests/visual-output/`.
- `git diff --check`: passed.

The first launcher attempt with a new instance could not allocate networks
because the Docker daemon's default address pools are exhausted. Verification
then used `npm run live` with the existing stopped `f0b77d18-issue59` fixture
networks and disposable named test volume on `172.25.0.2:9121`. After verification,
`CHATHERMES_INSTANCE=f0b77d18-issue59 npm run live:stop` removed its containers and
preserved its named data volume. Unrelated services/networks were left alone.
Docker emitted its legacy-builder deprecation notice, and Playwright emitted an
environment-only NO_COLOR/FORCE_COLOR warning. Project lint/check/build have no
remaining warnings or errors. Mobile coverage uses Chromium emulation, not
physical Safari/iOS; no real provider was used. No commit, push, deployment, or
issue comment was performed.
