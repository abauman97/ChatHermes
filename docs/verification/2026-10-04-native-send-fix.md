# Native first-send contract fix

Worktree: `feat/persistent-tui-gateway`, HEAD `370abbe`, PR #33. No commit,
push, PR update, or production deployment. The initial worktree was clean.
us1 inspection was read-only; all reproductions and code installation used the
disposable `ptuifix` fixture on `http://172.25.0.2:9134/chathermes`.

## Cause and captured evidence

Native attach called `session.resume` with both `omit_messages: true` and
`inline_images: false`. Read-only inspection of us1's
`/opt/hermes/tui_gateway/contracts/sessions.py` showed that its
`SessionResumeParams` does not declare `inline_images`. The pinned fixture's
schema does declare it, explaining why the original positive fixture tests pass.
Read-only `SessionResumeParams.model_validate` in a separate Python process on
us1 rejected the original synthetic payload with `inline_images: extra_forbidden`
and accepted the corrected payload with `omit_messages: true`; no dispatcher or
live session was invoked by that check.
The installed native channel, plugin API and frontend bundle on us1 matched this
checkout by SHA-256. Its WebSocket authentication helper also matched the pin.

To reproduce the contract difference without touching live data, removed only
`inline_images: bool = True` from the isolated fixture's resume schema and
restarted that fixture. No authentication or session/profile checks were removed.
Captured Chromium traffic before the fix:

1. `POST /api/auth/ws-ticket`: HTTP 200, ticket present (value never recorded).
2. `/api/plugins/chathermes/chat/ws`: HTTP 101, successful authenticated upgrade.
3. `chat.attach` for a synthetic newly created session: JSON-RPC error 503,
   `Native operation unavailable. Message not submitted.`, outcome `rejected`.
4. No `chat.submit`; UI displayed the exact reported error:
   `Message not submitted. Native viewer unavailable; reconnect and try again.`

A direct dispatcher probe against that same isolated schema captured the
underlying rejection: code 4000,
`invalid params for session.resume: inline_images: Extra inputs are not permitted`.
The transport converts that specific validation error to
`_InlineImagesUnsupported`; the native channel's generic exception handler
converted it to error 503, and the frontend replaced the attach failure with the
reported viewer message. The existing HTTP workspace resume adapter handles this
older schema; native attach did not.

Live audit logs recorded ticket minting during the reported failure window and
no ticket-rejection entries there. Successful ticket consumption is not audited,
so those logs alone do not establish the live socket's outcome. No authenticated
live prompt was sent. The exact error was reproduced in Docker against the
confirmed schema difference, rather than claiming a live browser replay.

## Change and regressions

Native attach now omits the redundant `inline_images` option: with
`omit_messages: true`, no transcript is requested. Attach still validates stored
session ownership and registers profile secrets before resuming the existing
native runtime. No retry, alternate transport or authentication bypass was added.

The API regression uses the real plugin transport with a strict older resume
schema and verifies attach followed by exactly one profile-bound queued native
submit. It failed with the original implementation and passed with the fix.
The new browser regression sends from Home, checks native attach errors, exactly
one submit and zero Runs admissions, active/completed disclosures, composer
focus, and durable user/reply history after reload.

With the older schema still installed in Docker, the original implementation
failed the new browser test. After installing only the fixed backend, both the
new first-send case and the existing failed-attach/recovery case passed at
desktop and mobile sizes: 4 passed. Captured post-fix traffic showed successful
attach/replay and `chat.submit` returning `status: streaming`, `outcome: accepted`.
Screenshots were inspected at both sizes.

The fixture was then rebuilt/relaunched from the unchanged pinned source
`3632f9173d218fd24f3fa595d7affa159b0774cd`, restoring its original resume schema.
The final Docker image is `9b7039d5aa7b`. Local and installed fixture hashes match:
native channel `4968b52aae737997dd60a7ed0be8e4cbd027f3486c578490b23e19b9e7e19483`;
frontend bundle `c8298a292f73bd8891966324b0ea33c95d8ff4ac2728f2715bd97af2b0679cfa`.
`npm run build` regenerated committed `dashboard/dist/` assets; they are
byte-identical because the implementation change is in Python.

## Final verification

| Check                                                           | Result                                                                                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm test`                                                      | 111 passed, 13 files, exit 0                                                                                             |
| `npm run test:api`                                              | 73 passed, exit 0; used the existing repository venv at `/opt/data/projects/ChatHermes-reconnect/.venv-test/bin` on PATH |
| `npm run build`                                                 | Passed; regenerated dist matches tracked assets byte-for-byte                                                            |
| `npm run test:docker`                                           | 18 passed, exit 0                                                                                                        |
| Older-schema first-send + failed-attach/recovery browser checks | 4 passed, desktop/mobile, exit 0                                                                                         |
| `npm run test:native` / `sh tests/docker/native-tests.sh`       | 84 pinned Python checks, native model/image runtime probe, 20 desktop/mobile browser cases passed, exit 0                |
| Full desktop visual suite                                       | 19 passed, 1 failed on the provider dialog before any send, exit 1                                                       |
| Isolated desktop `dashboard.spec.ts` recheck                    | 1 passed, exit 0, including profiles, file upload, focus and disclosure transitions                                      |
| Full mobile visual suite                                        | 20 passed, exit 0                                                                                                        |
| `git diff --check`                                              | Passed                                                                                                                   |

The initial targeted browser launch preceded fixture readiness and returned
`ERR_EMPTY_RESPONSE`; it was rerun after readiness. An initial unchanged-fixture
native run with headless-shell Chromium passed 84 Python checks and the runtime
probe, then 17/18 browser cases: the mobile Stop/reload test's second-submit
5-second poll timed out. That test passed when rechecked with the installed full
Chromium, which was used for all final verification. No change was made to those
unrelated behaviors or tests. Intentional pre-fix older-schema API/browser
failures are described above and are not passing evidence.

Screenshots inspected include desktop/mobile first-send completion and saved
history, failed attach and recovery, desktop native streaming, and authenticated
saved image/model selection. The broader suite verifies scrolling, selects,
uploads, camera-file input, Projects, Scheduled and viewport restoration.

Artifacts are outside tracked state: `/tmp/chathermes-ptuifix-legacy-before/`,
`/tmp/chathermes-ptuifix-legacy-after/`,
`/tmp/chathermes-ptuifix-legacy-after-wire.log`, and
`/tmp/chathermes-ptuifix-final-{build,native}.log`.
Full desktop/mobile artifacts and logs are
`/tmp/chathermes-ptuifix-final-{desktop,mobile}/` and corresponding `.log` files;
the isolated dashboard rerun uses `/tmp/chathermes-ptuifix-dashboard-recheck/`
and `.log`.
No ticket values, real provider credentials or user transcripts are included.

Limits: the compatibility reproduction changes only the resume field, not the
whole live Hermes source. No live deployment or authenticated live send was
performed. Browser tests use Chromium with emulated mobile dimensions, synthetic
provider replies and camera-file input; they do not validate physical iOS,
hardware cameras or real-provider behavior. The pinned native durability/replay
limits remain unchanged.

Cleanup: `DOCKER_HOST=tcp://172.25.0.2:2375 CHATHERMES_INSTANCE=ptuifix npm run live:stop`
passed. No `chathermes-ptuifix` containers remain; Docker inspection confirms
`chathermes-ptuifix-hermes-data` remains. No test volume was deleted.
HEAD remains `370abbe`; only the backend fix, API/browser regressions and this
verification record are changed.
