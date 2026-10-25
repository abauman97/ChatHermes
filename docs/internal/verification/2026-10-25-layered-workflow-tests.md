# Layered workflow environment verification

The new environment uses Compose-owned Hermes, stock MockServer 9.1.0, and an
optional Android 14 emulator. Fixtures are submitted over REST, without a derived
MockServer image or mounts. Failures retain services and device state.

## Runtime evidence

- Built with the latest official Hermes base resolved to
  `sha256:9c5561579f3ffdf333401797094ac3a743738d6c25d40f4331c7bf77b694238d` initially.
  An explicit refresh during expanded verification resolved to
  `sha256:9774f4f39a9bb8c2f68ce728ed5e99ddbad282163be56764afacf88ed952b784`.
- Stock MockServer resolved to
  `sha256:0ed883c9b2d0ccc90eadecea4d4167eb0b0d67d0a5830a378eb58c45074cd2a6`.
- Hermes and Android reached health independently of browser preparation or installation.
- A fresh Android browser preparation failed on CDP readiness and retained the
  same device. Detecting Chrome's debugging socket instead of only its process
  allowed retry on that device without recreation or reboot.
- Started a second Compose project with a separate MockServer port, then removed
  it with `down -v`; the main project's three services remained healthy.
- Repeated fixture loading preserved a deliberately unrelated expectation and
  produced no duplicate expectation IDs. Removed only that probe afterward.
- Verified known non-streaming title requests succeed and unmatched inference
  requests fail. The title matcher requires both non-streaming mode and a title
  system prompt; it does not accept arbitrary non-streaming inference.

## Workflow verification

- Desktop/mobile: **34 passed** in one run, covering progressive streaming,
  history reload, real terminal execution, malformed inference failure and
  recovery, cancellation, actual inference model selection, clarification,
  default/alpha/beta session navigation, browser network recovery and attachments.
  Expanded coverage includes real allow/deny approvals, background execution
  without resubmission, streamed thinking, project instructions/workspace execution,
  generated-artifact previews/downloads/history, and saved native Cron output.
- Android: **17 passed**, running those same contracts with an intentionally
  invalid desktop Chromium path. Android requires no desktop browser download.
- Optional Android installation/cold start and portrait/landscape keyboard:
  **2 passed**. Rerunning installation reused the existing installed app.
- Optional real FCM push receipt, Android notification-tray tap and restoration
  of the exact chat/profile: **1 passed**. Settings readiness is awaited before
  choosing Enable/Disable, and routing assertions compare conversation identity
  rather than equivalent URL spellings. No synthetic push/click event is used.
- Native keyboard checks use Android's actual IME and condition-based layout
  checks through opening, draft growth, dismissal, reopening and rotation.
  Rotation and keyboard settings are restored afterward.
- Inspected actual dashboard screenshots at desktop/mobile sizes, Android file
  preview, installed cold start, and portrait/landscape keyboard geometry.

Screenshot review exposed a real attachment-removal regression: clicking Remove
with the mobile composer focused could blur and move the control before click
completed. Added the existing `preserveInputFocus` handler to attachment removal
and strengthened the workflow to require disappearance and retained input focus.
After explicitly rebuilding/applying Hermes, that regression check passed on
**all three targets (3 passed)**. No synthetic click dispatch, coordinate workaround,
or readiness sleep was added.

The expanded thinking scenario exposed another real regression: Hermes relays an
answer preview through `reasoning.available`, overwriting streamed reasoning.
Ignore that event when its text repeats the current answer preview. Focused
protocol checks preserve authoritative reasoning replacement for other content,
and the real workflow verifies the completed disclosure can reopen its reasoning.

Ignored evidence is retained under `tests/integration-output/expanded-browser/`,
`tests/integration-output/expanded-android/`, `tests/integration-output/browser-final/`,
`tests/integration-output/android-final/`, `tests/integration-output/android-native/`,
`tests/integration-output/expanded-native/`, `tests/integration-output/push-final/`
and `tests/visual-output/`. Workflow traces remain disabled because raw auth and
native gateway tickets must not enter artifacts.

## Other validation and limitations

- `npm test`: **787 passed**, including two answer-preview protocol regressions.
  An earlier run hit three asynchronous component-test failures; an unchanged
  rerun passed the complete suite.
- `npm run test:docker`: **13 passed**, including the retained Node browser/window
  lifecycle subtests and Compose security/isolation checks.
- API suite with repository import mode, the plugin development extra, and the
  real Hermes runtime inside the initial disposable container: **100 passed**.
  After refreshing the official image: **97 passed, 3 skipped**. The skipped
  secondary-host forwarding tests import `hermes_cli.web_server_plugin_profiles`,
  which the refreshed runtime no longer contains; adding runtime `PYTHONPATH`
  does not restore a removed helper. Real profile workflows pass on that image.
- `npm run build`, `vp lint`, workflow TypeScript checking, formatting checks for
  changed files, and `git diff --check`: passed.
- Host `npm run test:api` hung on the existing PWA asset/FileResponse test with
  Python 3.14.4; a bounded diagnostic rerun reproduced it. Container Python
  3.14.9 with matching runtime dependencies passed the complete API suite.
- Repository-wide `vp fmt --check` reported existing formatting differences in
  unrelated files; they were not bulk-reformatted. Changed files pass.
- Remote-daemon live execution, native OS file/camera picker interaction,
  a deployed HTTPS origin and physical hardware were not tested. Real FCM delivery
  was verified on Android’s localhost secure context. CDP
  endpoint rewriting retains its focused tests, and no remote bind mounts are used.
- Broader legacy migration remains incremental, explicitly tracked in
  `tests/test-audit.md`; retained suites are not claimed to pass the new harness.

Containers remain running for inspection, per the requested lifecycle. Cleanup is
explicit through the documented Compose command. No commit, push, generated
asset staging, or provider credential use was performed.
