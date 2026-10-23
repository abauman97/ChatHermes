# Disposable Hermes dashboard

The image extends `nousresearch/hermes-agent:latest`, installs the checked-out
ChatHermes plugin and its Python dependencies, enables authenticated dashboard
access, and starts the real Hermes gateway and dashboard under the upstream
supervisor. It uses a real OpenAI-compatible provider, without fixture replies,
bind mounts, or personal Hermes configuration.

The fixture seeds `default`, `alpha`, and `beta` with matching provider settings
and distinct generated gateway credentials in each profile's private `.env`.
Each private profile file also receives the test provider credential, because
native secondary runtimes do not inherit launch-profile secrets. They share the loopback API listener through Hermes profile multiplexing. Named
profile HTTP requests exercise Hermes's secondary plugin hosts; the runtime still
refuses secondary plugin WebSockets. ChatHermes uses the supported dashboard
`/api/ws` native gateway with a host-issued ticket and explicit profile on every
RPC, so that refusal does not prevent secondary native chat. Browser tests check
real conversations and offline recovery in all three profiles, colliding stored
IDs, single-use ticket enforcement, and profile-local authenticated uploads.

## Launch from this checkout

Create a `.env` file in the repository root:

```dotenv
TEST_LLM_API_BASE_URL=https://provider.example/v1
TEST_LLM_API_KEY=your-provider-key
TEST_LLM_API_MODEL=your-model
```

The launcher loads this file automatically. Existing exported environment values
take precedence. The file stays excluded from Git and the Docker build context.
Then run:

```sh
npm ci
npm run live
# Open http://127.0.0.1:9119/chathermes
# Login: tester / chathermes-local-test
npm run live:stop
```

`npm run live:real` is an alias for the same real-provider workflow. A launcher
instance defaults to the checkout's short revision. To run another concurrently:

```sh
CHATHERMES_INSTANCE=second CHATHERMES_DASHBOARD_PORT=9120 npm run live
CHATHERMES_INSTANCE=second npm run live:stop
```

The launcher publishes on loopback by default. For a remote Docker daemon, set
`CHATHERMES_BIND_ADDRESS` to a daemon-side address (or `0.0.0.0`) and
`CHATHERMES_DASHBOARD_URL_HOST` to its reachable hostname/IP. Readiness is checked
inside the container, so it does not depend on client-to-daemon HTTP access.

## Direct Docker usage

Build from the repository root, then pass the provider variables from `.env`:

```sh
docker build --pull -f tests/docker/Dockerfile -t chathermes-test .
docker run --rm --name chathermes-test \
  -p 127.0.0.1:9119:9119 \
  --env-file .env \
  chathermes-test
```

The image includes the committed plugin assets. Run `npm run build` before
building directly if the UI source has changed. `--pull` refreshes the upstream
image; a running container does not update itself.

Docker publishes ports at container creation; environment variables inside an
image cannot create host port mappings. Change the host port using `-p`, or also
change the internal listener with `-e HERMES_DASHBOARD_PORT=9120` and
`-p 127.0.0.1:9120:9120`. `API_SERVER_PORT` controls the internal gateway listener
(default `8642`); it must differ from the dashboard port. Only the dashboard
needs publishing. The provider base URL must be reachable from inside Docker.

Optional `HERMES_DASHBOARD_BASIC_AUTH_USERNAME` and
`HERMES_DASHBOARD_BASIC_AUTH_PASSWORD` override the disposable login for direct
Docker runs. The health check verifies both dashboard and gateway readiness.
Do not pass `--init`; Hermes's supervisor needs to be PID 1.

The upstream image declares `/opt/data` as an anonymous volume. With `--rm`, it
is deleted when this container exits. The launcher also explicitly removes its
owned container and anonymous volume on stop or failed readiness. No named
volumes or networks are created, reused, or deleted. Existing volumes from the
old fixture launcher are left alone.

Removing a container deletes its chats, attachments, and generated state.
Provider keys are never baked into the image or printed by the launcher.

## Browser verification

Install Chromium with `npx playwright install chromium`, then run
`npm run live:visual`. If the dashboard is already running, set
`CHATHERMES_TEST_URL` to its printed base URL and run `npm run test:visual`.
The default suite uses the disposable real-provider dashboard at desktop and
mobile sizes. It checks composer focus and scrolling, the model picker,
file upload and camera preview, a real native terminal call, and completed
activity disclosures. It sends a small real-provider request per viewport and
requires a model with tool support. Screenshots and traces stay in ignored
`tests/visual-output/`; inspect them before committing.

The older browser suites remain available with `npm run test:visual:legacy`.
They require a separately supplied dashboard with their deterministic replies,
secondary profiles, Projects and scheduled fixtures. They are not part of the
default disposable workflow, which starts with an empty Hermes home.

## Disposable Android 14 device

On a Linux Docker daemon with working `/dev/kvm` hardware acceleration and enough
RAM for an Android emulator, run:

```sh
npm run test:live:android  # builds/starts Hermes, then boots and installs on Android
# Or reuse the already-running live Hermes instance:
npm run live:android
# Open http://127.0.0.1:6080/?autoconnect=true&resize=scale
npm run live:android:stop
npm run live:stop
```

`test:live` is an alias for `live`. Android uses
[`budtmo/docker-android:emulator_14.0`](https://github.com/budtmo/docker-android)
with the Samsung Galaxy S10 device profile and noVNC controls. The first image
pull and emulator boot can take several minutes. Install the repository's Node
dependencies first; the installer uses Playwright to sign in to the real Hermes
dashboard with the synthetic test account. No desktop Chromium download is
needed for this path. Rebuild Hermes with `npm run live` after plugin changes;
an older test image may lack the credentialed manifest link required for installation.
Fresh Chrome can close its initial tab during sign-in. The installer reconnects
and reloads the authenticated dashboard for up to three attempts when a tab or
browser connection closes. It reuses successful authentication; dashboard readiness
timeouts still fail the launch and clean up the device.

The launcher forwards Android's `http://localhost:9119/chathermes` through ADB to
the existing Hermes container. Localhost gives Chrome a secure context for the
plugin's existing manifest and service worker without changing authentication,
adding a separate app, disabling certificate checks, or publishing the gateway.
It uses Chrome's native **Install app / Add to Home screen** flow and waits for
Android to persist the icon. It opens that icon and verifies the standalone app
and composer before stopping Chrome, then cold-starts the icon and verifies both
again. This avoids treating a saved shortcut as a completed first launch.
If installation brings Chrome back to the foreground after HOME was requested,
the launcher requests HOME again. It swipes between icon pages only while the
Android launcher is in front, and bounds recovery attempts.
Standalone windows on the login route are recognized and signed in again if
needed. A failure reports the local window paths and their display modes, with
query values omitted. Chrome builds that cannot install the PWA fail and remove the
device; a browser shortcut alone does not count as a successful installation.
Chrome must be able to reach any services required by its installation flow.

The shell launcher is `tests/docker/android.sh`. It runs the emulator with `--rm`,
Docker logging disabled, no volume or bind mounts, and no saved snapshots outside
its container. The launcher rejects images that introduce inherited
mounts. Device state, browser sessions, downloads, and installed apps disappear
when stopped. Startup/install failures and interruption during setup remove the
owned device. A successful launch leaves it running for interactive tests until
`live:android:stop`; stop Android before restarting/stopping Hermes. Hermes data
remains governed by its own disposable launcher. Neither stop command removes
containers owned by another instance.

Use the same `CHATHERMES_INSTANCE` as Hermes. Optional
`CHATHERMES_ANDROID_VNC_PORT` (default `6080`) and
`CHATHERMES_ANDROID_CDP_PORT` (default `9223`) allow concurrent devices. Both ports
bind only to daemon loopback; CDP grants browser control and must stay private.
For a remote Docker daemon, forward both ports to matching local ports over SSH
before launching Android. KVM must exist on the daemon host, not the client.
No ADB port is published. Docker images remain cached normally; application and
device data are not exported to the checkout or host volumes.

Once installed, use noVNC to check keyboard/composer focus, scrolling, file and
camera attachments, profile/model selects, and active/completed disclosures.
This interactive device path does not replace the desktop/mobile Playwright
suite or automatically send a model request.

For a repeatable real-keyboard geometry check after opening the installed app:

```sh
node tests/docker/android-keyboard.mjs chathermes-INSTANCE-android 9223
```

Replace `INSTANCE` with the launcher's instance name. The check uses CDP touch
input and Android's actual software keyboard in portrait and landscape. It
asserts that the browser resizes the content for the keyboard and the focused
composer retains a 4px footer through draft growth, dismissal with focus retained,
and reopening. It restores
the device's rotation and hardware-keyboard settings afterward. Screenshots and
geometry evidence stay in ignored `tests/visual-output/android-keyboard/`.
