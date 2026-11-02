# Issue 213: notification navigation

Investigated `c433516780fd2c4300992cd83ba5151285857c13` in the isolated
`codex/issue-213-notification-navigation` worktree.

## Verified failure and scope

The existing real-Hermes notification workflow passed on desktop and mobile
Chromium before edits: worker clicks switched chats/profiles, reopened an
already-loaded chat, and displayed the exact saved scheduled output. An added
Settings-to-chat check also passed on the baseline. The reported in-plugin
route failure was not reproduced in those baseline checks.

A separate probe registered the real worker, navigated the document to the
host's `/sessions` page, then dispatched a notification click. Both desktop and
mobile remained on the host page. Calling the real client's `navigate()` from
the worker confirmed Chromium's error:
`TypeError: This service worker is not the client's active service worker.`
The host page is outside the worker's `/chathermes` scope. The baseline handler
swallowed this failure and returned without attempting `clients.openWindow()`.
It also returned after a null navigation result.

## Change and regression coverage

Only a non-null `WindowClient.navigate()` result now completes that fallback.
Rejected, missing, or null navigation falls through to the existing
`clients.openWindow(target.href)` call. Successful mounted-plugin handshakes
and successful client navigation still return immediately. URL validation and
profile/run destinations are unchanged. The browser may open another window
when it cannot navigate the existing dashboard document.

New worker regressions for rejected and null dashboard navigation both failed
against the baseline and passed with the change. Existing unavailable/rejected
navigation cases now require the final window-opening attempt; successful mocks
return a client result. The real-Hermes workflow additionally checks returning
from Settings to the notification's exact chat, loaded response, and focusable
composer.

## Environment and limits

Build validation uses `tmp/validation/`, a temporary copy inside this worktree,
because the repository tracks generated dashboard assets and the task forbids
altering them. The root distribution and `.env` were left untouched. Python
checks use the locked uv environment and the documented Hermes source pin.

The deterministic Docker project is `chathermes-213`, with ports 9213/11213.
Docker's exhausted default address pools required an isolated `10.213.0.0/24`
network. The remote daemon's loopback publications were unreachable, so this
project's publications were moved to its private `172.25.0.2` interface.
Chromium uses a test-only secure-origin override for `http://docker:9213`.
Failed attempts and runtime state were retained.

Synthetic notification events exercise the real worker and dashboard but lack
trusted OS notification activation. The final `openWindow()` fallback is covered
by focused protocol tests; an actual notification-tray tap, installed-app reuse,
FCM delivery, Android, and Safari/iOS remain unverified. The demonstrated host
page failure does not establish the cause on the reporting user's device. A
post-change real-worker probe confirmed that the served worker matched source
and reached the browser's `openWindow()` call from `/sessions`; Chromium then
rejected the synthetic click with `InvalidAccessError: Not allowed to open a window.`

## Final validation

- `npm test`: 1,244 passed; focused worker suite: 143 passed.
- `PYTHONPATH=.hermes-source:plugin npm run test:api` through the locked uv
  environment: 127 passed.
- `npm run build` and `npm run test:env:build` in the temporary validation copy:
  passed. An earlier final unit run and image rebuild were terminated with
  SIGTERM; both passed on retry.
- `vp lint`, `vp fmt`, `vp fmt --check`, and `git diff --check`: passed.
- The rebuilt real-Hermes desktop/mobile slice covered notification navigation,
  file/camera uploads and composer focus, and completed tool disclosures. Five
  of six tests passed initially. The mobile notification test reached the right
  chat/profile after Settings, but its native viewer remained on Reconnecting /
  Loading conversation until the content assertion timed out. A focused retry
  against the retained environment passed in 7.9 seconds. The cause of that
  transient native reconstruction failure remains unresolved.
- Inspected desktop/mobile screenshots of loaded notification destinations,
  composer attachments, and expanded completed tool output. These viewport
  checks do not establish physical keyboard or OS notification behavior.
- The earlier baseline host-page probe failed at both viewport sizes as
  described above. It is not retained as a deterministic workflow because its
  successful fallback requires trusted OS notification activation.

No commit, push, PR, or deployment was performed. The isolated test containers
and ignored diagnostic artifacts remain available for debugging.

## Android emulator continuation (2026-11-02)

This follow-up supersedes the earlier Android/FCM verification limitation above.
It used only this checkout and the retained `chathermes-213` Compose project.
No containers or networks were removed, replaced, or restarted. The emulator's
Docker start time remained `2026-11-02T14:33:50.774882286Z`; its health was
`healthy`, `adb devices` listed `emulator-5554 device`, and
`adb shell getprop sys.boot_completed` returned `1`.

The actual publications were Hermes `172.25.0.2:9213`, MockServer
`172.25.0.2:11213`, Android VNC `127.0.0.1:6080`, and Android CDP
`127.0.0.1:9223` on the remote Docker host. Desired ports in an unused temporary
Compose file do not change existing publications. The repository runner passes
its own explicit `-f tests/docker/compose.yml` and `--no-recreate`; it safely
reused these existing containers. No fresh Compose project/network was needed.
Hermes and MockServer were reachable through `docker:9213` and `docker:11213`.
The MockServer readiness operation is PUT, not GET.

The remote host's loopback CDP publication was unreachable from this checkout.
An ignored local TCP bridge at `tmp/issue-213-android/cdp-tunnel.mjs` forwards
`127.0.0.1:19213` through `docker exec -i` to the existing emulator container's
Chrome proxy on `127.0.0.1:9222`. It changes no Docker ports or networks.
`npm run test:android:prepare` then reported Android browser ready at
`http://localhost:9119/chathermes`. `/json/version` returned HTTP 200,
`Chrome/113.0.5672.136`, protocol `1.3`; Playwright attached through the repository
CDP harness with `noDefaults: true`.

The authenticated worker response SHA-256 was
`b59676cc514c3cb6cd4e4b8a3738999ddf20ad5d01aeb8b0b8a84e649a257def`,
matching `public/push-service-worker.js`, including the revised non-null
navigation guard. The controlled plugin used
`http://localhost:9119/api/plugins/chathermes/push-service-worker.js`.
Only `.env` presence was checked; no values were read or printed.

Reproduction, with the local CDP bridge running:

```sh
COMPOSE_PROJECT_NAME=chathermes-213 \
CHATHERMES_TEST_URL=http://docker:9213 \
CHATHERMES_MOCKSERVER_URL=http://docker:11213 \
CHATHERMES_ANDROID_CDP_ENDPOINT=http://127.0.0.1:19213 \
CHATHERMES_NATIVE_TESTS=1 \
npm run test:integration:android -- tests/workflows/notifications.spec.ts
```

The runner reused all three healthy containers and REST-loaded the 47 repository
inference fixtures. The narrowly scoped additions in
`tests/workflows/notifications.spec.ts` use `showNotification()` for local
notification display, then open the actual Android shade and tap the unique
notification title through accessibility-derived bounds. They fabricate neither
`PushEvent` nor `NotificationEvent`. Before opening the shade, the existing
Chrome document must be visible. They verify the exact chat, saved user and
assistant content, visibility, composer focus, and (for the mounted plugin)
unchanged Chrome page count. Native before/tray/after screenshots are captured;
tray capture waits for accessibility evidence of the actual notification title.
Chrome's optional native notification introduction is dismissed by label.

Observed behavior:

- A real tray tap with the plugin already open in Settings navigated to the
  exact chat and loaded `Stream complete.`; the composer was focusable and no
  extra Chrome page appeared.
- A real tray tap with Hermes already open at `/sessions` failed to reach the
  target. The sole observed Chrome page stayed at
  `http://localhost:9119/sessions?profile=default`, visible, through the
  30-second assertion window. This repeated after dismissing Chrome's native
  introduction. The runtime was left unchanged: this remains an Android
  verification failure, not evidence that the fallback is fixed on this device.
- The existing native background-completion test passed twice in the initial
  combined runs (27.2s and 27.9s). It enables real push, closes old notifications,
  starts a uniquely marked real Hermes fixture execution, backgrounds Chrome
  with Android HOME, observes a notification carrying the exact new session,
  taps the actual `default` notification, and verifies the visible exact chat
  containing `Background execution finished.` This establishes actual external
  Web Push/FCM receipt and native tray activation on this emulator. FCM was not
  blocked by missing provider credentials. Foreground clicks in the added tests
  use local display, so these results do not separately establish foreground
  external delivery, installation/cold-start behavior, or physical-device/iOS
  behavior.

The first combined run finished with one failed host assertion and one passed
FCM scenario. Its native screenshots also exposed Chrome's first-run modal;
that state was retained. The second combined run again had one failed host
assertion and one passed FCM scenario, with readable actual shade evidence.
These earlier artifacts are retained under ignored
`tmp/issue-213-android/first-run/` and `second-run/`. The final run separates
Settings and host into independently reported tests; artifacts are in ignored
`tests/visual-output/`.

Continuation code-quality checks: `npm test` passed all 1,244 tests;
`PYTHONPATH=.hermes-source:plugin npm run test:api` passed all 127 tests using
uv-managed Python 3.14.9. `vp lint`, `vp fmt`, `vp fmt --check`, and
`git diff --check` passed. `npm run build` passed in the existing ignored
`tmp/validation/` copy, whose worker hash matches this checkout. The root's
pre-existing generated dist modification was preserved, and no generated assets
were staged or committed.

Files changed by this continuation: `tests/workflows/notifications.spec.ts` and
this verification record. Existing modifications to
`public/push-service-worker.js`,
`src/features/notifications/services/push-worker.test.ts`,
`tests/workflows/navigation.spec.ts`, and tracked
`plugin/chathermes/dashboard/dist/push-service-worker.js` were preserved.
No runtime behavior edits, commits, pushes, PR changes, or deployments were made.

Final separated run: **2 passed, 1 failed (2.0m), exit 1**. Settings passed in
31.7s; host failed in 59.1s at the destination visibility assertion, again
reporting only visible `/sessions?profile=default`; external background push
passed in 30.6s. Thus the requested open-plugin tray click is verified, but the
host-page fallback remains reproducibly failing on this emulator. The final
FCM screenshots were copied to `tmp/issue-213-android/final-run/`. The final
Settings/host artifact directories were no longer present after the runner
finished; use the preserved second-run native Settings/shade/failure images
instead. No cause for that artifact disappearance was established. Those
preserved images were visually inspected, including the actual Android shade
and the loaded chat. Containers remain healthy with their original start times;
the local CDP tunnel remains available for debugging.

## Vue Router handoff implementation (latest continuation)

The earlier fallback-only change is superseded by a persistent host registration
bridge in `src/router/notification-navigation.ts`. The scoped worker now offers
its loaded-route handshake to the selected same-origin dashboard client even on
`/sessions`. The bridge enters the host's `/chathermes` route using the existing
history/popstate contract, then hands the original URL and MessagePort to the
mounted Vue application. The application uses `router.push` and its existing
profile/session scope and saved-history/scheduled-output readiness checks. Only
that loaded view can acknowledge; the host transition cannot. Native history
hydration remains required even for a ready connection or repeated session URL.

The outer host profile is constructed from the hash destination, with default
normalization; stale outer notification profiles cannot select another owner.
Invalid/duplicate profile handoffs are rejected before changing the host route.
Pending clicks retain only the latest request and expire at the worker fallback
deadline. Mount cleanup cannot detach a newer handler, and a host transition
cannot accidentally use a Vue handler that is still tearing down. The handler
connects before startup scope loading finishes so a new click can supersede that
work. The existing null/rejected/unavailable browser-navigation fallback remains.

A further test-first regression found that document-entry recovery always
replaced the current hash, including a newer canonical route received while
plugin imports were pending. It now recovers only a missing canonical hash.
The regression failed with `home` instead of the newer `settings` route, and
passes with the change. This is consistent with an initial scheduled-tray setup
attempt landing on Home instead of Settings before any notification was tapped;
that attempt does not establish a failed notification navigation.

Focused coverage includes Settings-to-session profile changes, queued host
session and scheduled-output handoffs, delayed native attachment/history,
scheduled load failure/retry, redirected and superseded routes, unmount,
invalid profiles, pending expiry/replacement, stale mount cleanup, and worker
fallbacks. The delayed worker acknowledgement matrix covers Settings and
`/sessions` for both chat profiles and saved output/execution destinations.

Validation uses only this worktree and the existing `chathermes-213` fixture.
Each frontend build's generated assets are copied under ignored
`tmp/issue-213-router-baseline/`, then the complete local dist directory is
restored from the byte-for-byte initial snapshot, including the user's earlier
worker modification. The existing test container's static plugin fixture assets
were backed up and refreshed from the build artifacts to exercise the new code;
no service/container/network was removed or restarted. No production deployment,
commit, staging, push, primary checkout, issue 212, or `.env` access was involved.

The first Android attempt stopped before tray activation because the existing
screenshot helper passed Playwright's `info.outputPath` without its receiver.
The helper now wraps that call. A rerun passed both actual local Android tray
session paths (Settings and `/sessions`, 57.9 seconds total). Both assert exact
saved messages, visible destination, focusable composer, unchanged page count,
and the original document marker, ruling out a reload or new-window fallback.
Screenshots were retained and inspected under ignored
`tmp/issue-213-router-baseline/android-session-pass/`. These tests use local
`showNotification()` and accessibility-based Android shade taps. They fabricate
neither PushEvent nor notificationclick and do not verify external push delivery.

The first desktop/mobile run could not launch Playwright's missing default
`chromium_headless_shell-1243` executable. Using the already installed
`/opt/hermes/tools/chromium-1208/chrome-linux64/chrome` resolved that setup issue.
All six dashboard route/history, attachment/focus, and tool-disclosure tests
passed (46.2 seconds); screenshots were retained and inspected under ignored
`tmp/issue-213-router-baseline/desktop-mobile-retry/`. No synthetic notification
click workflow was run as live evidence during this continuation.

Final build validation after the import/hash and startup/teardown fixes:

- `npm test`: **1,266 passed in 42 files**, exit 0.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **127 passed**, exit 0;
  uv-managed Python 3.14.9. No Python source changed.
- `vp lint`, `vp fmt`, `vp fmt --check`, `npm run build`, and
  `git diff --check`: passed.
- Final desktop/mobile route-page rerun: **2 passed** (30.0 seconds), including
  nested direct entries, reloads, browser history, scope, composer and focus.
  Artifacts: `tmp/issue-213-router-baseline/routes-final/`.
- Final actual Android local tray matrix: **4 passed** (1.9 minutes).
  Settings and `/sessions` each loaded the exact saved chat and saved scheduled
  output, with original document marker, same page, unchanged page count, visible
  content, and focused composer. Artifacts, including actual Android shade and
  device screenshots: `tmp/issue-213-router-baseline/android-final/`.
  Final scheduled/device and route screenshots were visually inspected.
- `diff -qr tmp/issue-213-router-baseline/dist
  plugin/chathermes/dashboard/dist` reports no differences. The pre-existing
  generated worker diff is still exactly the initial version; no generated
  build changes are retained in the worktree.

The final live tray matrix verifies click navigation from locally displayed
notifications, not external push delivery, FCM, cold start, installation, iOS,
or physical-device behavior. Containers, emulator, fixture state and diagnostic
artifacts remain available. The local CDP bridge was started for this verification;
no unrelated infrastructure cleanup occurred. No commit, push or deployment was
performed.

## Endpoint/connectivity verification continuation (17:38–17:46 UTC)

The existing fixture was reused on `codex/issue-213-notification-navigation`.
`compose.mjs` selects explicit URL overrides first, otherwise configured ports
with `CHATHERMES_DASHBOARD_URL_HOST`, the TCP `DOCKER_HOST` hostname, or loopback.
It does not discover running publications. `integration.mjs` invokes
`loadFixtures()` before Playwright; that loader probes
`PUT /mockserver/status` and then loads `PUT /mockserver/expectation`.
No fixture authentication was required. The endpoints observed in this run were:

| Runner endpoint                                        | Result                                            |
| ------------------------------------------------------ | ------------------------------------------------- |
| Default `http://docker:1080/mockserver/status`         | `ECONNREFUSED`                                    |
| Published `http://docker:11213/mockserver/status`      | HTTP 200                                          |
| Default `http://docker:9119/api/auth/providers`        | `ECONNREFUSED`                                    |
| Published `http://docker:9213/api/auth/providers`      | HTTP 200                                          |
| Default `http://docker:9223/json/version`              | `ECONNREFUSED` (remote loopback publication)      |
| Local CDP bridge `http://127.0.0.1:19213/json/version` | reachable; actual Chrome CDP attachment succeeded |

Hermes and MockServer publish on daemon address `172.25.0.2`, ports 9213 and 11213. Android publishes CDP only on daemon loopback. All three services remain
on their existing `chathermes-213_default` network (`10.213.0.0/24`), with
MockServer `.2`, Hermes `.3`, and Android `.4`. HTTP checks from both Hermes and
Android to `http://mockserver:1080/mockserver/status` returned 200; Android also
reached Hermes's auth-provider endpoint with HTTP 200. The existing
`adb reverse tcp:9119 tcp:9119` mapping connects device localhost to the Android
container's existing proxy, which forwards to `hermes:9119` on that network.
The retained local bridge in `tmp/issue-213-android/cdp-tunnel.mjs` was started
again; it transports CDP through `docker exec` to Android's existing port 9222.
No new Docker network, proxy container, service restart, reset, or reinstall was
needed. Container health proves internal readiness, independently of the
runner's selected host/port. These probes establish the current port mismatch;
they cannot reconstruct every environment override of the earlier failed run.
No additional readiness retries or application changes were needed.

Reproduction with that private local bridge running:

```sh
COMPOSE_DISABLE_ENV_FILE=true \
COMPOSE_PROJECT_NAME=chathermes-213 \
CHATHERMES_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_DASHBOARD_PORT=9213 \
CHATHERMES_MOCKSERVER_PORT=11213 \
CHATHERMES_TEST_URL=http://docker:9213 \
CHATHERMES_MOCKSERVER_URL=http://docker:11213 \
CHATHERMES_ANDROID_CDP_ENDPOINT=http://127.0.0.1:19213 \
CHATHERMES_NATIVE_TESTS=1 \
npm run test:integration:android -- tests/workflows/notifications.spec.ts \
  --grep 'Android tray click from open'
```

The normal integration runner reused all healthy services with its existing
`--no-build --no-recreate` flags and loaded all 47 inference expectations.
**Four Android tests passed in 2.0 minutes**, exit 0: Settings → chat (30.1s),
`/sessions` → chat (42.0s), Settings → saved scheduled output (23.9s), and
`/sessions` → saved scheduled output (22.9s). These use actual Android tray taps
selected by accessibility title after local `showNotification()`. Each checks
the exact destination and saved content, visible document, focused composer,
original document marker, same Playwright page, and unchanged Chrome page count.
No push/click event was fabricated. This run verifies local notification click
navigation, not FCM transport, installation, cold start, iOS, or physical devices.

Preserved evidence is under ignored
`tmp/issue-213-connectivity-verification/android/`: each test has before/tray/
reopened screenshots, including native device captures. The retained
`android-final-state.json` reports the final scheduled URL, visible original
document, focused composer, and two Chrome pages (the other pre-existing tab
remained hidden). `android-final-device.png` shows that scheduled output with
the keyboard open. Settings/host/shade/chat and scheduled screenshots were
visually inspected. Earlier evidence under
`tmp/issue-213-direct-continuation/` was preserved.

Using the same endpoint settings and the installed
`CHATHERMES_CHROMIUM=/opt/hermes/tools/chromium-1208/chrome-linux64/chrome`,
this command passed **four desktop/mobile tests in 26.1s**, exit 0:

```sh
npm run test:integration -- tests/workflows/route-pages.spec.ts \
  tests/workflows/navigation.spec.ts --grep 'every route|file and camera'
```

Route/history and attachment screenshots are retained under
`tmp/issue-213-connectivity-verification/desktop-mobile/`; desktop/mobile restored
chat and mobile attachment screenshots were visually inspected.

Other checks in this continuation:

- `npm test`: **1,266 passed**, 42 files, exit 0.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **127 passed**, exit 0.
- `vp lint`, `vp fmt`, `vp fmt --check`, and `git diff --check`: passed.
- `npm run build`: passed. `build.log`, retained build, and before/after dist
  SHA-256 manifests are under `tmp/issue-213-connectivity-verification/`.
  All eight pre-run dist files were restored byte-for-byte, preserving existing
  generated edits/deletion. All eight newly built files match the existing
  fixture container's corresponding files. The container also retains two older
  hashed app assets; they were left untouched.

The three original service start times remain unchanged: MockServer 13:37:52,
Hermes 13:45:55, Android 14:33:50 UTC. All remain healthy. This continuation only
adds endpoint troubleshooting to `tests/docker/README.md` and this verification
record, in addition to ignored evidence. Existing implementation/test edits were
preserved. No `.env` inspection, primary-checkout/issue-212 access, commit,
staging, push, production deployment, or unrelated Docker changes occurred.
