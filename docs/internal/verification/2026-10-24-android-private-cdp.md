# Android private Docker service CDP verification

The existing healthy `chathermes-android-check-hermes` fixture was reused without
rebuilding or restarting it. Docker client endpoint: `tcp://docker:2375`; private
service address: `172.25.0.2`; fixture publication: port `9127`.

The Android launch used:

```sh
CHATHERMES_INSTANCE=android-check \
CHATHERMES_ANDROID_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_ANDROID_CDP_ENDPOINT=http://172.25.0.2:9223 \
npm run live:android
```

Docker inspection confirmed noVNC `172.25.0.2:6080` and CDP `172.25.0.2:9223`,
without wildcard bindings or a published ADB port. noVNC returned HTTP 200. KVM
passed and Android reported `sys.boot_completed=1`. Chrome 113 connected through
CDP, authenticated to the dashboard, and installed ChatHermes through its native
menu. Android persisted `shortLabel=ChatHermes,`. The installer completed both
first-launch and cold-start standalone/composer checks.

The shell launcher printed its ready message, then exited 2 with an unterminated
quote error because its source was edited while that shell was still running.
The final source passes `sh -n` and the launcher tests. The live shell command
therefore did not have a clean exit status. No second device launch was attempted:
the successfully installed emulator was retained as requested.

An independent fresh CDP connection then confirmed `/chathermes`, standalone
display mode, a visible `Message Hermes` composer, a secure context, PushManager
support, and an active service worker. The inspected screenshot is in ignored
`tests/visual-output/android-connectivity/installed-cold-start.png`. Notification
permission was still `default`; no notification success is claimed.

Validation: `npm run test:docker` passed all 23 Python cases, including the 17 Node
browser/PWA subtests. Scoped `vp lint`, `vp fmt --check`, `sh -n`, and
`git diff --check` passed. Application/API/build suites were not run for these test
connectivity changes; existing application and generated asset edits were preserved.

Remaining Android notification checks:

- Enable notifications from ChatHermes Settings, grant Android/Chrome permission,
  and confirm the selected profile has a saved push subscription.
- Use **Send test** and inspect an actual Android tray notification; a successful
  HTTP response alone is insufficient.
- Complete a real request with the installed app backgrounded, then repeat after
  swiping the app away. Inspect tray delivery, profile title, final-response body,
  and absence of duplicate notifications.
- Tap the notification and verify the originating profile/session opens and its
  notification clears after the viewer reconnects. Verify a different visible
  profile/session does not suppress delivery, while the exact connected visible
  session does.

No commits, pushes, PR updates, pruning, or unrelated container removals were made.

## Follow-up: Android push and multiple profiles

This section supersedes the notification checks left open above. Work stayed on
`codex/native-profile-desktop-architecture` in the existing dirty worktree. The
staged deletions, unrelated edits, and untracked files were retained. Both existing
containers were reused and remain running; no restart, stop, removal, prune,
commit, push, or PR operation was performed.

### Findings and narrow fixes

The `noDefaults: true` CDP change is justified by an on-device comparison, rather
than by the earlier HTTP 201 alone. On the installed standalone page, after
foregrounding it and pressing Android HOME:

| CDP connection      | Before HOME: visibility / focus | After HOME: visibility / focus |
| ------------------- | ------------------------------- | ------------------------------ |
| `noDefaults: true`  | visible / true                  | hidden / false                 |
| Playwright defaults | visible / true                  | visible / true                 |

Android's resumed activity after HOME was the native launcher. The installed
Playwright implementation sends `Emulation.setFocusEmulationEnabled(true)` unless
`noDefaults` is set for the default context. Its emulation can therefore falsify
the worker's visibility checks. Retain the existing `noDefaults` change; the
endpoint-rewrite regression now also asserts that flag for every endpoint variant.
A subsequent native connection briefly reported visible / false after HOME;
another foreground/HOME cycle returned hidden / false. Do not treat the CDP option
as proof of lifecycle state: wait for and inspect the actual state in each case.

There is a separate server configuration failure. Repeated sanitized container
logs reported `RuntimeError` at `payload_build` for pending completions. In source,
subject resolution follows payload construction without updating the stage label.
The fixture's Docker execution environment has no configured
`HERMES_DASHBOARD_PUBLIC_URL`; HTTP localhost cannot supply the required HTTPS
request origin, and outbox delivery has no request fallback at all. Two native
plugin-host child processes were present; their environments were unreadable, so
this check does not establish each child's configuration. Some ordinary
completions delivered while others continued failing. Reliable automatic delivery
is therefore **not established** by this run.

`push_sender.py` now reports subject-resolution failures as `vapid_subject`, with a
regression asserting the stage, no transport attempt, subscription retention, and
no secret disclosure. This diagnostic change does not invent a public origin or
silently substitute one. The running fixture was not restarted to deploy it.

The operational correction is to launch the fixture/dashboard with a valid
`HERMES_DASHBOARD_PUBLIC_URL` available to every plugin host that drains the
outbox, then recheck automatic unattended delivery. The existing launcher already
passes this setting from the repository dotenv file. This run did not rewrite the
user's dotenv file or restart either container. A request-scoped diagnostic HTTPS
origin is sufficient for the controlled sender checks below, but is not a repair
of a running child's background configuration.

### Sanitized observations

No subscription endpoint, browser subscription keys, VAPID keys, cookies,
credentials, notification body, or push payload was printed or included in this
record. Android's native UI hierarchy was inspected only for allowlisted profile
titles and Chrome presence. Raw notification screenshots were not exported.

- Android remained booted (`sys.boot_completed=1`); Hermes remained healthy.
  Private CDP publication remained `172.25.0.2:9223` and noVNC `172.25.0.2:6080`.
  Initial CDP metadata requests timed out; foregrounding the existing Chrome
  activity restored access without a browser/emulator/container restart.
- Installed PWA: `http://localhost:9119/chathermes`, standalone display, secure
  context (loopback exception), granted notification permission, activated service
  worker, controlled page, and an existing PushManager subscription. This is a
  loopback Android fixture, not verification of a production HTTPS origin.
- Authenticated `/push/status` returned HTTP 200 and `enabled: true` for `default`,
  `alpha`, and `beta`. Server-side equality checks confirmed all three saved rows
  refer to the current browser device; only equality booleans were emitted.
- Existing native Android tray entries had the titles `default`, `alpha`, and
  `beta`. HTTP acceptance was not used as a substitute for this observation.
- Fresh ordinary plugin turns were submitted for default session
  `20261024_114139_7a6fce` and beta session `20261024_114258_0501a0`. The standalone
  app was backgrounded with HOME and reported hidden. Each completion appeared in
  `registration.getNotifications()` with the exact profile/session route and in
  Android's native Chrome notification tray. Their durable outbox rows subsequently
  read `delivered=1, cancelled=0`.
- Tapping each completion's native tray title routed an existing Chrome client to
  its exact originating profile/session. Multiple existing Chrome windows were
  present; the selected client was an ordinary tab, not necessarily the installed
  standalone window. Each completion notification disappeared after that destination
  became visible and connected. No claim of guaranteed standalone-window selection
  is made.
- Controlled sender checks used the saved device registrations and an explicit
  synthetic HTTPS request origin (`https://dashboard.example.test`) in a separate
  process. The real provider returned HTTP **201** for both `default` and `beta`
  test notifications. This does not show that a request from localhost, or an
  unconfigured requestless sender, can resolve its subject.
- Exact-session suppression was tested separately against real provider delivery:
  with beta session `20261024_114425_a1fc73` visible, its persisted completion was
  passed through the actual sender with the diagnostic HTTPS request origin.
  Provider status was **201**; no completion notification for that beta session
  appeared. Its ordinary outbox delivery was still pending (`delivered=0`) at the
  final query, so its initial lack of a notification was **not** counted as proof
  of suppression.
- With that beta session still visible, the same controlled sender delivered the
  persisted completion for default session `20261024_114139_7a6fce`. Provider status
  was **201**; the default notification appeared with its exact session route and
  the native Android tray contained its profile title. A different visible profile
  therefore did not suppress this actual push. The diagnostic replay did not mark
  the pending beta outbox row delivered.
- A separate attempt to navigate immediately from a newly submitted default turn
  to beta did not produce a committed completion/outbox row for that new session.
  It is excluded from delivery evidence. The persisted default completion above
  was used for the cross-profile check instead.

Observed Android receipt, profile-specific routing, and worker suppression are
verified under the stated conditions. Full reliable unattended automatic delivery
across profiles remains unverified because of the requestless subject-resolution
failures. Swiping the app away, production HTTPS, physical Android hardware, and
long-term retry/restart behavior were not tested. No blanket end-to-end success is
claimed.

### Validation

- `npm test`: **751 passed**.
- `PYTHONPATH=/opt/hermes:plugin npm run test:api` with the project virtualenv:
  **99 passed**, no skips. An earlier run with nonexistent `/tmp/hermes-runtime`
  yielded 93 passed / 6 skipped and was superseded by this run.
- `PYTHONPATH=/opt/hermes:plugin python -m pytest tests/push_store.test.py
  tests/execution_viewer.test.py -q`: **97 passed** after the diagnostic fix.
  The development extra was installed into the project virtualenv first.
- Combined API/store/viewer run against the available Hermes source:
  **196 passed** before the final diagnostic-only assertion; final API and targeted
  reruns above both passed. `/opt/hermes` has runtime source but no Git metadata;
  its exact commit could not independently be checked. Source code declares native
  contract pin `bf0203a794a07aac3ff764972ab9087baa4e4f4e`.
- `npm run test:docker`: **25 passed**; direct Android browser/PWA Node suite:
  **17 passed**.
- `npm run build`: passed. Generated distribution output remains unstaged; existing
  generated changes were not reverted or committed.
- Scoped `vp lint` and `vp fmt --check` for the Android browser helper and tests:
  passed. `git diff --check`: passed.

The four runtime push modules were hash-compared between the worktree and fixture
before the new diagnostic label change; all matched. Evidence scripts and logs
from this follow-up are ignored under `tmp/android-push/`. Neither those artifacts
nor provider acceptance alone should be read as a successful automatic-delivery
result. The emulator and healthy Hermes fixture were left running.

## Follow-up: configured automatic delivery and safe launcher recheck

This follow-up supersedes the earlier conclusion that reliable requestless
configuration was not established. One Codex writer worked in the existing
worktree. Existing staged deletions, edits, and untracked files were retained.
Neither container was restarted, stopped, removed, or replaced. No commit, push,
PR update, or prune operation was performed.

### Runtime configuration and fix

The repository dotenv and the invoking environment already contained an explicit
`HERMES_DASHBOARD_PUBLIC_URL`. Its value was validated without printing it; no
origin was invented or taken from a request. Inspecting Docker's configured
execution environment alone had been misleading. Reading `/proc/*/environ` as
root failed, but reading as the service UID **10000** succeeded:

| Process | Role                                            | Valid configured HTTPS subject                |
| ------- | ----------------------------------------------- | --------------------------------------------- |
| 109612  | Dashboard serving port 9119; default plugin API | yes                                           |
| 109889  | beta plugin host                                | yes                                           |
| 111765  | alpha plugin host                               | yes                                           |
| 153     | Gateway serving native API port 8642            | absent; does not serve the dashboard listener |

Only allowlisted roles, PIDs, home paths, and configuration validity booleans were
emitted. Process environment values, keys, and subscription details were omitted.
The two named hosts' values passed the running push module's subject validator.
The dashboard configuration was inspected separately from Docker exec's environment.

The actual runtime loader was inspected in `hermes_cli/plugin_host.py` and
`tools/environments/local.py`: `PluginHost._env()` calls
`served_profile_child_env(target_home=..., inherit_credentials=True)`, which
strips launch-profile dotenv residue for routed homes and overlays each target's
`build_profile_secret_scope()`. Exporting the value only into the launching
process is therefore insufficient as a durable configuration rule.

The fixture seeder now validates an explicitly supplied public URL before writing
configuration and persists that same setting in **default, alpha, and beta**
profile dotfiles. It leaves an existing profile setting intact when no new value
is supplied. Repeated configuration keeps one setting per profile. Invalid URLs
fail with static guidance that omits their value. Missing configuration remains
an unavailable push configuration; the launcher never fabricates one.

The existing fixture's three dotfiles were updated narrowly with that already
configured value, retaining other entries and mode 0600. Calling the **actual
runtime `PluginHost._env()`** for each home then confirmed equality with the
explicit setting for all three profiles. No complete fixture reseed, credential
rotation, source hot patch, or process/container restart was used.

`push_store.py` now requires the configured valid HTTPS origin for both unattended
and request-backed sends, including **Send test**. Neither `vapid_subject()` nor
`public_dashboard_url()` substitutes request headers or a request base origin.
Regression tests cover valid configured subjects, invalid/missing subjects despite
a valid HTTPS request, no transport attempt on failure, and preservation of
subscriptions. The source-level sender policy change was tested locally; the
running fixture was not restarted to load it. The live checks below used its
already configured real sender and no request-origin fallback or diagnostic replay.

### Fresh automatic Android checks

All CDP connections used `noDefaults: true`. Lifecycle state was inspected rather
than inferred from that option. Notification permission remained granted, and
saved device subscriptions were enabled for default, alpha, and beta.

| Check                                 | Originating session      | Verified result                                                                                          |
| ------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| default, HOME/background              | `20261024_125455_9a8a5e` | hidden page; automatic completion; exact-route notification; native tray title; delivered=1, cancelled=0 |
| beta, HOME/background                 | `20261024_125636_bbcecb` | hidden page; automatic completion; exact-route notification; native tray title; delivered=1, cancelled=0 |
| beta, exact session visible           | `20261024_125758_bd2b90` | visible installed page; completion delivered=1, cancelled=0; no notification for that session            |
| beta, fresh background/routing repeat | `20261024_125923_925adb` | hidden page; automatic completion; exact-route notification; native tray title; delivered=1, cancelled=0 |

An additional retained default turn (`20261024_130104_45593a`) ran a short
synthetic terminal delay. After its tool activity started, the installed page
navigated to beta session `20261024_125923_925adb` and remained visible. The default
completion arrived automatically with its exact route and expected body while
beta was visible; its outbox row was delivered=1, cancelled=0. Android's tray
contained both its profile title and the exact synthetic expected body (only
presence/equality booleans were exported). Tapping it opened that exact default
session and cleared the notification. A different visible profile therefore did
not suppress this fresh automatic delivery.

For suppression, the real submission had a successful retention response and one
observed `prompt.submit`. Its durable delivered row was checked after completion;
absence of a notification while a row was still pending was not counted.

The fresh default notification and the beta routing-repeat notification each had
one worker entry with the exact profile/session URL and a body equal to the
synthetic expected final response (only the equality boolean was printed). The
native tray exposed their profile titles. Tapping each native title opened the
exact originating session in a visible Chrome client, and the matching worker
notification cleared after reconnection. Both selected clients were ordinary
Chrome windows (`standalone=false`); guaranteed standalone-window selection is
still not established. Older synthetic notifications of the same profile were
closed before each tap to make native title selection unambiguous.

Android recents was inspected for an identifiable ChatHermes dismissal control.
None was exposed unambiguously, so no swipe or force-stop was attempted. App
swipe-away delivery remains unverified. The emulator and fixture were retained.

### Launcher exit status

No Android launcher/installer shell was running when `android.sh` was edited.
Its earlier exit 2 was caused by editing a running shell's source; the current
source passes `sh -n`. A new non-destructive `check` mode verifies ownership,
running/booted state, the installed standalone page, composer, secure context,
and service-worker control. It performs no reinstall, browser force-stop,
forwarding change, container launch, or container removal. Its regression also
checks failure paths preserve the existing device.

The following **live** command printed both verification and ready messages and
exited **0**, reusing the current device:

```sh
CHATHERMES_INSTANCE=android-check \
CHATHERMES_ANDROID_BIND_ADDRESS=172.25.0.2 \
CHATHERMES_ANDROID_CDP_ENDPOINT=http://172.25.0.2:9223 \
sh tests/docker/android.sh check
```

The fresh-device launch path also passed the mocked Docker launcher suite through
its complete ready/exit tail. A second live fresh-device launch was deliberately
not run because that path replaces the existing emulator.

### Validation and limits

- Project virtualenv activated; `pip install -e 'plugin/chathermes[dev]'` passed.
- `PYTHONPATH=/opt/hermes:plugin python -m pytest tests/push_store.test.py
  tests/execution_viewer.test.py tests/plugin_api.test.py -q`: **195 passed**.
- `PYTHONPATH=/opt/hermes:plugin npm run test:api`: **99 passed**.
- `npm test`: **751 passed**.
- `npm run test:docker`: **29 passed**, including the Node Android browser/PWA
  subtests and new non-destructive launcher regression.
- `npm run build`, `vp lint`, `vp fmt`, `sh -n tests/docker/android.sh`, and
  `git diff --check`: passed. Distribution output remains unstaged; no generated
  assets were committed or force-added.

The added preservation regression initially compared dotenv file order and failed
when the existing provider-key writer moved its entry. It now compares the actual
configuration values; the final launcher rerun passed.

Evidence is under ignored `tmp/android-push/recheck-*`. No raw notification
screenshots, notification bodies, credentials, VAPID material, endpoints, or
subscription keys were exported into this record. The available `/opt/hermes`
source still lacks Git metadata; its exact checkout cannot independently be
verified beyond the declared native contract pin documented above.

This establishes fresh automatic default/named-profile background receipt,
exact-visible-session suppression, and native click routing in the current
loopback Android fixture. It does not establish production HTTPS deployment,
physical-device behavior, delivery after app swipe-away, guaranteed standalone
routing, or long-term retry/restart behavior. The new seeder's restart behavior
was unit-tested and checked against the real loader, without restarting the live
fixture to exercise a complete cold deployment.
