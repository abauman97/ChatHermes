> Historical verification recovered from commit `7cda324`. These results apply to that source tree, not this integration. Current results are recorded in [persistent TUI integration](2026-10-04-persistent-tui-integration.md).

# Native migration verification — 2026-10-04

## Outcome

The continuation implements maximal safe **native-bounded** mode on the unchanged
pinned Hermes source. All new Other and Project turns use the authenticated plugin
socket and existing native runtime. History stays in Hermes. Existing REST run
pointers drain through Runs; native errors never silently switch transports or
resubmit. No owner/lease feature, core source patch, commit or push was made.
The continuation began on main with the intentional dirty work from the earlier
capability-gate implementation; it was inspected and preserved.

The three stronger capabilities remain explicitly false: crash-safe idempotency,
lossless snapshot/replay, and an offline turn lease. Lost submit acknowledgement
persists an outcome-unknown sending lock, including after reload. The user must
inspect saved history and native activity before explicitly ending verification.

## Pinned investigation and alternatives

* `LiveSessionSnapshot` has no epoch/sequence watermark. Replay reads events and
  `latest_seq` separately. The intervening-writer probe proves that advancing to
  `latest_seq` can skip an unreturned event. The controller instead advances from
  actual event objects, deduplicates/reorders replay/live data and retains its
  cursor across same-document reconnect. New-document snapshot recovery warns
  that partial activity can be missing; persisted history is authoritative.
* `PromptSubmitParams` has no idempotency key/receipt or reject-if-busy flag. The
  public `queued:true` option is a safe alternative to accidental busy steering,
  interrupt or redirect. A focused pinned probe forbids those agent methods and
  verifies FIFO queuing even under Desktop's interrupt policy. It cannot establish
  exactly-once admission after lost response or a process crash.
* Model switching before a cold native build can be overwritten by captured
  defaults. Read-only `approval.pending` waits for that build; session activation,
  session-only config switching and post-switch checks precede prompt admission.
  The provider probe verifies actual qwen model requests. No atomic selection
  guarantee against an independent Desktop model mutation is advertised.
* Native multipart images reach a vision preprocessing request; the normal reply
  can subsequently receive text. Hermes persists a text projection, rather than
  raw image bytes. Uploading originals first and retaining durable references in
  that text makes authenticated image reopen possible. One prompt carries all
  validated parts without session-global image attachment queue mutations. The
  probe checks vision request structure, actual model, durable reference, original
  bytes and resumed history. The browser test checks authenticated byte-identical
  retrieval, anonymous rejection and foreign-profile rejection.
* Native detach uses default 20-second orphan grace. Fresh running activity can
  defer reaping within the default 600-second activity freshness threshold; this
  is not an unconditional 600-second offline guarantee. Additive second viewers
  remain attached. Native crash continuation is distinct work and may repeat
  effects. No plugin owner is installed to bypass reaping.

Stronger guarantees require upstream transactional idempotency linking a receipt
and busy policy to the admitted durable user row, and an atomic snapshot
sequence/epoch plus replay/truncation boundary. These requirements are not faked
with a plugin mutex or a separately written receipt.

## Environment

* Hermes source: `3632f9173d218fd24f3fa595d7affa159b0774cd`.
* Archive SHA-256: `e62be810520c1fe592b82661c0dfacfff29c52efae529840f78c78551c07b384`.
* Base: `nousresearch/hermes-agent@sha256:cdcda342ff2b3919eaa7b3dbd7c5178b7b7676db62ddac273af2b921e9be4aa3`.
* Final image: `chathermes-test:3632f917`,
  `sha256:4d9c9caeb7e0956aa86ca75e5f93fc5215f1d699d0355c537ddfd6d06e7205c6`.
* Only data mount: `volume:chathermes-test-hermes-test-data:/opt/data`.
  No existing personal Hermes home or host data bind mount was used.
* Hermes/model run on `chathermes-test-internal` with no fixture provider egress.
  Only the inbound dashboard relay joins the browser network. Other running
  dashboards were left alone. Dashboard: `http://172.25.0.2:9127/chathermes`.
* Launcher: `CHATHERMES_BIND_ADDRESS=172.25.0.2 CHATHERMES_DASHBOARD_PORT=9127
  DOCKER_HOST=tcp://172.25.0.2:2375 sh tests/docker/run.sh fixture`.
  Compose CLI is absent; compose pins/volume rules have regression coverage,
  but Compose itself was not executed.
* Python API checks use `/tmp/chathermes-issue10-venv/bin` on PATH. Playwright
  uses the installed Chromium via `CHATHERMES_CHROMIUM`, and
  `CHATHERMES_TEST_URL=http://172.25.0.2:9127`. All credentials/data are synthetic.
  No real provider credentials were supplied.

## Verification results

The complete native command passed: 84 pinned Python regressions, the real
provider/runtime image/model probe, and 16 authenticated plugin integration
cases across desktop/mobile. Final full-suite results are appended below. Intermediate failures
are not passing evidence. Early probes exposed native image text projection and
cold-build model overwrite; browser runs exposed an admission/foregrounding race,
an optional Boolean image gate default, attempt IDs requiring secure-context
`randomUUID` (replaced with `getRandomValues`), and a clarification form outside the
scrollable transcript. These were fixed with tests alongside implementation. Repeated per-test sign-ins
also hit the unchanged host 10/minute password limit; the harness now reuses a
real UI-authenticated host cookie in worker memory across isolated test contexts.
No authentication bypass or host rate-limit change was introduced.

`npm run test:native` includes four focused contract probes and selected upstream
replay, WebSocket, orphan-race, auto-continue, profile-resume and session-model
suites inside the pinned image, then the actual runtime/provider probe and real
host-authenticated plugin socket/HTTP tests at both sizes. Browser coverage does
not substitute for the upstream protocol guarantees above.

## Visual scope and limitations

Authenticated desktop and mobile Chromium runs cover home/focus, independent
scrolling, controls at least 16px, host viewport restoration, native model
selection, files/camera-file input, Other/Project history and workspace isolation,
active/completed thinking/tool disclosures, multiple viewers, stop/steer,
reloadable approvals/clarifications, profile-bound socket admission, authenticated
saved originals and lost acknowledgement without repeat submit. Controlled
Markdown/stream-order tests mock plugin data while retaining the actual host mount;
real native cases use no transport mocks except deliberate loss of one submit
acknowledgement after the real runtime admits it. Legacy Runs are explicitly
seeded through authenticated HTTP and exercise pending-pointer drain.

Screenshots are ignored artifacts under `tests/visual-output/`; ticket tests
turn traces off. Final inspection results are recorded below. Physical iOS/Safari
keyboard, hardware camera and suspension, launched Desktop interoperability,
process SIGTERM/SIGKILL recovery, live replay exhaustion, arbitrary proxy prefixes
and multi-worker affinity were not validated. Native pending requests other than
approval/clarify require Desktop and are explicitly declined as not shown.
Pinned startup reports an optional mixture-of-agents import warning and uses
SQLite DELETE journaling due the embedded SQLite version; pins were preserved.

## Final evidence

| Command | Result |
| --- | --- |
| `npm test` | 104 passed in 11 files |
| `npm run test:api` (isolated venv on PATH) | 62 passed |
| `npm run test:docker` | 7 passed |
| `npm run test:native` | Exit 0: 84 pinned Python checks, runtime/provider probe, 16 authenticated desktop/mobile integration cases |
| `npm run build` | Passed; committed-asset location rebuilt as `app-BuM6J0zJ.js`, loader and CSS |
| Combined `npm run test:visual` | All 34 cases reported passing; process returned 143 after the summary, so both size projects were rerun separately for clean-exit verification |
| `npm run test:visual -- --project=desktop --output=tests/visual-output/desktop-final` | Exit 0: 17 passed |
| `npm run test:visual -- --project=mobile --output=tests/visual-output/mobile-final` | Exit 0: 17 passed |
| `git diff --check` | Passed |

Local and running-fixture checksums match for `native_channel.py`
(`cbf16fb17483d6d0019fbdb28d583588165d4a4e1e04f100d538c92571e1b0d1`)
and the final bundle
(`806f7684883d94c7249d8cb1eb8a79d967807101c0178b08105a40216523b3c0`).
This confirms the authenticated browser checks exercised the rebuilt working-tree
implementation, rather than a stale plugin installation.

Inspected screenshots include desktop native recovery/completion, approval,
saved image and outcome unknown; mobile home, model picker, file turn, completed
and reopened tool output, Project completion, clarification, approval, saved
image and outcome unknown. The request form appears after the sent message
inside the scrolling transcript, with the composer still visible/focusable.
Active activity and completed collapsed/reopened disclosures preserve the
reference ordering. The synthetic saved camera image is deliberately 1×1;
byte equality and natural width verify original retrieval, not photographic
quality or hardware capture. Images reach native vision preprocessing even when
the later reply fixture says its own inline image input is false.

Artifacts remain ignored in `tests/visual-output/`; subsequent size-specific
reruns use `desktop-final/` and `mobile-final/`. No real credentials or user
session state was added to the repository. No commit or push was made.
