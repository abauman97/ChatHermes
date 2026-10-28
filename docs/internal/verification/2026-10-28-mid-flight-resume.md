# Issue 189 follow-up: mid-flight resume regression

Work performed in the existing PR [193](https://github.com/abauman97/ChatHermes/pull/193)
worktree, branch `fix/issue-189`, starting at `59ecf8572b` with a clean working tree.
No new worktree, source-checkout edits, commits, pushes or PR edits.

The new scenario in `tests/workflows/transcript.spec.ts` submits the real
`[workflow-resume]` inference fixture through the authenticated dashboard plugin.
It fully loads the seeded compaction/rotation/rewind lineage, sees the first live
chunk, writes an unsent draft, and scrolls to an older message. Browser-context
offline mode disconnects the selected viewer. A separate authenticated native
viewer witnesses the next real `message.delta` while the disconnected UI still
lacks that text; no routes or gateway messages are mocked.

Recovery must use a new socket and the same native runtime, with a running,
`messages_omitted=true` snapshot containing the original prompt and missed text.
The test checks the visible snapshot before completion and requires all later
socket deltas to equal the exact remaining suffix. It then checks one submission,
exact final prose, every pre-existing message in order, exactly one new user and
assistant message, unchanged compaction boundaries, no internal summaries,
preserved composer value/focus and reader anchor, settled send controls, and
exactly-once persisted messages after reload.

The fixture uses stock MockServer's paced HTTP chunks (200 bytes, 1500 ms between
chunks). All test transitions wait on observable state or real wire data, with no
fixed readiness sleeps. The reference scroll is taken after native scroll events
settle across animation frames. A second viewer is necessary to witness progress
without guessing a disconnect duration; this scenario does not establish that
all viewers can disappear while execution continues.

Reviewed the pinned Hermes 0.22.5 source at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`:
`methods_session._resume_reuse_live_locked`, `session_registry._live_session_payload`
and `session_auto_continue._inflight_snapshot`. SHA-256 hashes of all three files
match the running container. Live resume attaches another viewer, returns running
state and accumulated assistant text, and omits native history when requested.
The browser also confirms active recovery through `session.activate`; persisted
transcript history continues through authenticated HTTP.

Validation:

- Focused desktop scenario passed before the negative control (18.2 seconds).
- Red negative control: changed only the loaded MockServer expectation to repeat
  `Still streaming.` after resume. The exact final-text assertion failed with that
  duplicated phrase. This proves assertion sensitivity, not a production defect.
  The repository fixture was unchanged and the integration runner restored the
  normal expectation before the green run.
- Green: `npm run test:integration -- tests/workflows/transcript.spec.ts` passed
  all 8 desktop/mobile scenarios (1.2 minutes), including both mid-flight tests.
- `npm test`: 984 passed across 36 files.
- `npm run test:api`: 123 passed with the existing project virtualenv and pinned
  Hermes/dependency paths. An initial invocation omitted the runtime dependency
  directory and failed three imports; the corrected invocation passed all tests.
- `npm run build`, `vp lint`, `vp fmt --check` and `git diff --check`: passed.

Logs are local `/tmp/chathermes-189-resume-*.log` artifacts. Inspected actual
plugin screenshots `history-mid-flight-resumed.png` and
`history-mid-flight-complete.png` in each desktop/mobile scenario directory under
ignored `tests/visual-output/`. Resume shots show the older reader context and
retained draft; completion shots show one final response and the retained draft.
Existing transcript workflows also passed real tool disclosure/backfill and
archived authenticated-image coverage. No new attachment, select or keyboard
behavior was introduced or separately exercised by the resume scenario.

Production code is unchanged: intermediate failures exposed test assumptions about spectator
rendering, the draft's Guide control, paging-window growth and pending scroll
events, rather than a demonstrated production defect.

Environment: retained Compose project `chathermes-issue-189`, private dashboard
port 9189 and MockServer port 1189, Hermes image `f29b9783120c`. Generated build
assets were restored to HEAD; ignored bundles remain uncommitted. Containers and
failed sessions remain available for inspection. Raw authentication traces are
disabled; only allowlisted snapshot fields and fixture text are inspected.

Limits: mobile verification uses Chromium's iPhone 13 viewport, not an Android
device or iOS Safari. Native installed/background lifecycle and real-provider
inference were not run. The second viewer witnesses the stream without requiring
its UI to render an externally submitted in-flight turn; its wire deltas are the
condition for reconnect. This test does not claim lossless historical tool-event
replay or uninterrupted execution after every viewer disappears.
