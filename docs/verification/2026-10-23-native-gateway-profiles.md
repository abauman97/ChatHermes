# Native gateway and profile recovery — 2026-10-23

Implemented in the scratch checkout `chathermes-native-profile-desktop`, based on
`5b378b5a806e8b90a36107feefacc0e1f2896b9d`. The read-only Desktop checkout was
verified at `290080e19e8e143d35f67427e89aed662161faf8`. No other checkout was
edited; no commit, staging, push, PR, publication or deployment was performed.

## Result

The browser now uses the dashboard's authenticated same-origin `/api/ws`, with
fresh single-use tickets in the supported subprotocol. The old plugin WebSocket
opened for default but was refused for alpha/beta before the plugin ran. Native
resume succeeded through the supported dashboard route for all three profiles;
no Hermes core source or authentication/routing policy was changed.

Normal and Project drafts are created on that native connection. Authenticated
plugin HTTP prepares the authoritative workspace and validates files/model
aliases; it does not construct an agent inside a secondary plugin host. A
profile-bound draft connection stays attached until its viewer resumes the
receipt. Existing-session membership is checked against the selected profile's
store or verified live registry before native cold resume. Profile selectors
remain explicit on native session operations, staging, model changes and controls.

Native recovery preserves selection/generation guards, restores snapshots and
unanswered requests, and never resubmits a prompt. Healthy sockets stay attached
while hidden. A busy resume uses one native activation confirmation while later
frames are held, addressing a real observed completion-before-resume-reply race.
Settled history replaces already-covered frames. This is a bounded recovery
barrier, not a completion polling loop. Stop during preparation prevents later
prompt admission; stale Stop/guidance errors cannot update another selection.
Empty/default profile aliases share uncertainty markers, including legacy blank
selector markers. The composer remains focusable while sending is gated.

Model changes are confirmed from the runtime before dispatch. Authenticated file
references use native staging; text/file-only parts are normalized to the pinned
string shape, and image parts retain their multipart shape. Active disclosures
expand; untouched completion collapses; explicit reader choices remain usable.

The standalone canonical wire adapter was imported from the exact Desktop pin,
with repository formatting and a cryptographic UUID helper for HTTP dashboards.
No Desktop stores, Electron, React runtime, standalone app, connection UI, browser
API keys or cross-origin gateway connection was added.

## Isolated environment and security evidence

The launcher used `tests/docker/Dockerfile`, `npm run live`, instance
`native-profile-20261023-r1`, container
`chathermes-native-profile-20261023-r1-hermes`, and dashboard port `19387`.
The pre-existing container publishing `9119` was left alone. The Docker daemon
was remote. A temporary loopback TCP forward on `19390` allowed the real browser
secure context needed for worker tests; no insecure-origin, certificate or auth
bypass was used in the final runs. Notification testing's previous insecure-origin
browser flag was removed.

The official base digest was
`nousresearch/hermes-agent@sha256:9c5561579f3ffdf333401797094ac3a743738d6c25d40f4331c7bf77b694238d`.
There were no bind mounts or personal Hermes homes. The fixture now writes the
provider credential into each disposable profile's private `.env`, since native
secondary runtime scopes intentionally do not inherit launch-profile secrets.
All three private files were mode 600, held matching provider settings, and had
three distinct gateway credentials. Gateway keys remain stable across fixture
reconfiguration. Provider credentials are not in YAML or the image.

The actual gateway matrix returned 200 for the three matching profile/key pairs
and 401 for all six cross-profile pairs. Browser tests separately verified 401
when dashboard authentication was omitted, refused missing WebSocket tickets,
and accepted a ticket only once. Secret values were compared in memory, never
printed or stored: response bodies, container logs and textual test artifacts
had zero exact matches against the provider and all three gateway keys.
`tmp/native-profile/security-evidence.json` contains only statuses and booleans.
The root `.env` remains ignored and mode 600.

## Validation

- `npm ci` completed before tests.
- `npm test`: **763 passed**. Coverage includes native profile routing, canonical
  model/control fences, recovered requests, native draft handoff, ambiguous sends,
  preparation cancellation, stale control callbacks, default aliases and the
  terminal recovery race.
- Project virtualenv activated; plugin development extra installed. Local API
  command: `PYTHONPATH=/opt/hermes:plugin:$PYTHONPATH npm run test:api`:
  **149 passed**. The same tests inside the actual official container, with its
  runtime on `PYTHONPATH` and the development extra installed: **149 passed**.
- `npm run test:docker`: **19 passed**, using the project virtualenv with PyYAML.
- `npm run build`, `vp fmt`, `vp fmt --check`, `vp lint` and `git diff --check`
  completed. Lint reported 19 warnings in the imported canonical source and no
  errors. Generated distribution changes were restored after validation and were
  never staged; new generated bundles remain ignored.
- Final native profile browser verification: **8 passed (4.7 minutes)**. Both
  desktop and mobile sent real model requests in default/alpha/beta, recovered
  across actual offline/online transitions without resubmission, reopened the
  selected transcript, rejected missing/reused tickets, resumed one shared
  stored ID into three distinct native runtimes with isolated titles, and kept
  legacy blank/default uncertainty locks effective while the composer focused.
- File/tool browser rerun: **8 passed (1.3 minutes)** across desktop and mobile:
  pointer/focus behavior, Project native creation, authenticated file staging,
  camera/file previews, real terminal output, chronological active/completed
  disclosures, focus while responding, and recovery across navigation. The final
  recovery implementation then re-passed the four real attachment/tool and
  chronological disclosure cases: **4 passed (1.7 minutes)**.
- The first complete broad run was **44 passed, 7 failed, 1 skipped (12.8 min)**.
  A subsequent focused run was **19 passed, 7 failed (7.5 min)**. Those earlier
  failures exposed draft ownership, disclosure defaults, text-only attachment
  shape, a test assumption about optional cold-resume title metadata, and timing
  around recovery/completion. The initial dedicated native-profile run also
  passed both viewports before those broader runs. Later focused results are
  retained rather than presenting earlier runs as uniformly successful. The
  entire expanded broad suite was not repeated after the final corrections.
  An additional alias/recovery regression run had 5 passed and 3 failed; it exposed
  the completion/resume race and an assertion using the wrong button label in
  uncertain mode. The final 8-case run above passed after both were corrected.

Browser commands used the actual authenticated dashboard, Chromium at
`/opt/data/profiles/developer/cache/playwright/chromium-1243/chrome-linux64/chrome`,
`CHATHERMES_TEST_URL=http://127.0.0.1:19390`, and the ignored config under
`tmp/native-profile/`. Traces and automatic failure screenshots were disabled to
avoid retaining tickets. Controlled disclosure fixtures were migrated to the
native wire route; authentication and the actual gateway remained in place.
The real-provider tests were not replaced with canned model responses.

Desktop and mobile screenshots were opened and visually inspected, including
native alpha/beta replies, focused drafts, actual file staging/terminal output,
and an expanded active terminal disclosure. Screenshots remain ignored under
`tests/visual-output/native-final/`; command logs and sanitized evidence are under
`tmp/native-profile/`. The runtime plugin API SHA-256 matched the worktree file. Compiled entry, CSS,
and app asset hashes matched before restoring generated files. A final metadata-
only correction removed the retained facade's socket lifetime/replay advertisement
from native capabilities. That Python file was copied into this owned container's
plugin seed and the container restarted; its API tests re-passed, and an
actual authenticated browser fetched the corrected capabilities and pinged the
native gateway for all three profiles. No frontend assets changed in that step.

## Android and remaining limits

`npm run live:android` was attempted on the same owned instance, with VNC/CDP
ports `19388`/`19389`. Local `/dev/kvm` and `adb` were absent. The remote daemon
exposed a KVM character device and successfully started the Android 14 image,
but ADB never saw an emulator device and Android did not boot within the
launcher's six-minute deadline. The launcher removed the owned Android
container. Installation, cold launch, actual keyboard geometry and real device
camera behavior could not be verified. A booting emulator with a reachable ADB
device is still required; device-node presence alone did not establish working
hardware acceleration.

The official image exercises the legacy native protocol. Canonical authority
behavior has real transport-shaped fixture tests, not a running canonical
Desktop authority integration. Legacy native snapshots do not offer atomic,
lossless progress replay; native disconnect/reaping policy governs unattended
execution. The retained compatibility facade still exists, but new native
viewers do not attach its server-owned per-turn web-push callback. Unattended
native turn-complete ChatHermes push is not implemented by this refactor; Cron
delivery and worker-click navigation remain separate verified paths.

## Cleanup

`CHATHERMES_INSTANCE=native-profile-20261023-r1 npm run live:android:stop` and
`npm run live:stop` completed. Only the launcher's owned Hermes container and its
anonymous volume were removed; Android had already been cleaned after boot
failure. The owned loopback forward was stopped. The pre-existing container on
port 9119 remained running. Images remain cached and contain no provider secrets.
The index is empty, generated dist has no diff from HEAD, the root `.env` is still
ignored/mode 600, and all implementation, test and documentation changes remain
uncommitted in this scratch checkout.
