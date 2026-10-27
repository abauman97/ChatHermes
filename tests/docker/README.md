# Workflow test environment

Compose starts services; preparation scripts make browsers usable; Playwright
verifies user contracts. A failed command leaves everything running for inspection.
No provider credentials or `.env` file are needed for deterministic tests.

## First run and explicit rebuild

From the repository root:

```sh
npm ci
npx playwright install chromium
npm run test:env:build
npm run test:integration
# Filter without bootstrapping another environment:
npm run test:integration -- tests/workflows/messaging.spec.ts --grep streaming
```

`test:env:build` builds ignored plugin assets and uses `docker compose build --pull`
to refresh the latest official Hermes base. Ordinary test runs never rebuild,
replace, or reseed running containers. After a rebuild, explicitly apply it with
`docker compose --project-directory . -f tests/docker/compose.yml up -d --no-build`.
Builds always write to `plugin/chathermes/dashboard/dist/`, and Docker copies
assets from that same production plugin path. Keep generated output uncommitted;
after validation, restore only any tracked generated files to `HEAD` and leave
untracked generated output ignored.

Stop Android first if replacing Hermes while an installed app is in use.

Use standard Compose commands for infrastructure only:

```sh
docker compose --project-directory . -f tests/docker/compose.yml up -d --wait --no-build
docker compose --project-directory . -f tests/docker/compose.yml ps
docker compose --project-directory . -f tests/docker/compose.yml --profile android up -d --wait --no-build
# Explicit cleanup, including Android and the upstream anonymous Hermes volume:
docker compose --project-directory . -f tests/docker/compose.yml --profile android down -v
```

`--project-directory .` is intentional: it makes the default project name follow
the checkout directory rather than the shared `tests/docker` basename. Override
`COMPOSE_PROJECT_NAME` for another isolated environment. Assign different published
ports for concurrent environments. Stop uses Compose ownership, never a global
prune or deletion of old fixture volumes.

## Independently retryable preparation

```sh
npm run test:fixtures                  # stock MockServer REST initialization
npm run test:browser                   # interactive desktop Chrome + real login
npm run test:android:prepare           # existing booted device + Chrome + login
npm run test:android:install           # optional native installation + cold start
```

The inference fixtures live in `fixtures/inference.json`. The loader sends them
from the client to MockServer's REST API; no derived image, checkout mount, or
file transfer is needed. Stable expectation IDs make reruns update expectations
without duplication. It does not reset the server or delete other expectations.
After removing a fixture, remove its old expectation explicitly or recreate only
the MockServer service when no test is running.

Hermes reaches `http://mockserver:1080/v1` on the Compose network. Credentials are
synthetic and server-side. Requests select fixtures through explicit markers and
conversation history; tool continuations match actual tool results, not counters.
Unknown requests fail. The non-streaming auxiliary expectation supports Hermes's
title generation. Streaming expectations contain real OpenAI SSE frames with
paced HTTP chunks; the interrupted fixture emits a malformed frame after partial
text. A scenario-specific error response also covers Hermes's repair/retry request
after that malformed frame. Readiness and assertions use conditions, never fixed setup sleeps.

## Android

The Docker daemon must support `/dev/kvm`. Android health checks require usable
acceleration and `sys.boot_completed=1`; health does not depend on Chrome or app
installation. If boot fails, inspect KVM passthrough/permissions and daemon disk
space. The image initializes KVM ownership itself; the client need not share its
KVM group. A failed browser/installer command never deletes or reboots the device.

```sh
npm run test:integration:android
npm run test:integration:android -- --grep streaming
# Explicit installation scenario only:
CHATHERMES_NATIVE_TESTS=1 npm run test:integration:android -- --grep "@installed|@native"
```

Normal Android workflows run in Chrome without installation or a desktop Chromium
download. Optional installed/native scenarios are excluded by default. Preparation
reuses Chrome when its debugging socket exists. HTTP/WebSockets reach Hermes by
service DNS through an ephemeral in-container proxy and ADB reverse; Android uses
`http://localhost:9119/chathermes` as a secure context. No gateway or ADB port is
published. CDP attaches with `noDefaults: true` to retain real visibility behavior.
Native installation controls use accessibility labels/current bounds.

Open `http://127.0.0.1:6080/?autoconnect=true&resize=scale` for interactive device
inspection. Login: `tester` / `chathermes-local-test` (synthetic test account only).

## Remote Docker and concurrency

Publications default to loopback. For a remote daemon, use SSH forwarding or
explicit private daemon addresses. Never publish browser controls publicly.

| Setting                           | Default / purpose                                                       |
| --------------------------------- | ----------------------------------------------------------------------- |
| `COMPOSE_PROJECT_NAME`            | Checkout basename; isolate simultaneous environments                    |
| `CHATHERMES_BIND_ADDRESS`         | `127.0.0.1`; dashboard and MockServer publication                       |
| `CHATHERMES_ANDROID_BIND_ADDRESS` | `127.0.0.1`; private noVNC/CDP publication                              |
| `CHATHERMES_DASHBOARD_PORT`       | `9119`                                                                  |
| `CHATHERMES_MOCKSERVER_PORT`      | `1080`                                                                  |
| `CHATHERMES_ANDROID_VNC_PORT`     | `6080`                                                                  |
| `CHATHERMES_ANDROID_CDP_PORT`     | `9223`                                                                  |
| `CHATHERMES_DASHBOARD_URL_HOST`   | Client-reachable hostname; otherwise `DOCKER_HOST` hostname or loopback |
| `CHATHERMES_TEST_URL`             | Explicit dashboard origin override                                      |
| `CHATHERMES_MOCKSERVER_URL`       | Explicit MockServer endpoint override                                   |
| `CHATHERMES_ANDROID_CDP_ENDPOINT` | Explicit client-reachable CDP endpoint                                  |
| `CHATHERMES_CHROMIUM`             | Optional installed desktop Chrome executable                            |

Run one suite at a time per project/device. Use `CHATHERMES_NATIVE_TESTS=1`
with `--grep "@installed|@native"` to verify installation and real portrait/landscape
keyboard geometry. The optional native notification scenario also requires real FCM
connectivity and exercises receipt plus a tap in Android’s notification tray; it
never fabricates a push event. Ordinary workflows exclude both tags. Separate projects also need distinct
ports. Fixture loading transfers data through HTTP and proxy preparation uses
`docker exec`, so remote setups never require matching checkout paths on the daemon.

## Authoring and debugging contracts

Add scenarios under `tests/workflows/`, importing `test` and `expect` from its
shared fixture. One Playwright configuration provides desktop, mobile viewport,
and real Android targets. Use accessible labels and observable outcomes; set up
prerequisites through real authenticated APIs where helpful. Exercise real Hermes
sessions, inference dispatch, WebSockets and tools. Do not replace those APIs with
route mocks. Use unique session/prompt markers and retain failed state.

Use the small `tests/workflows/helpers.ts` runtime helper only for native prerequisites
that lack a user-facing creation flow, such as a paused Cron job with saved output
or a disposable project directory. Keep assertions in the actual dashboard.

Test inference faults separately from browser connectivity faults. Check progressive
rendering, event ordering, final content, reload persistence, and recoverability.
Do not count a successful API request as proof of a visible notification or an
installed app. Keep platform-specific actions small and separately tagged.

Screenshots and failure context go to ignored `tests/visual-output/`. Raw workflow
traces are disabled because authentication and gateway tickets can appear in them.
Do not print full request records, process environments, or raw Hermes logs; inspect
allowlisted metadata and redact before sharing. Never commit credentials, Hermes
state, downloaded files, or generated `dashboard/dist/` assets.

See [the migration audit](../test-audit.md) for retained and replacement coverage.
Existing visual suites remain accessible through `npm run test:visual` and
`npm run test:visual:legacy`; their older fixture assumptions are not silently
included in the deterministic workflow suite. CI integration is deferred.

## Optional real-provider testing

Use a separate `COMPOSE_PROJECT_NAME` and root `.env` containing
`TEST_LLM_API_BASE_URL`, `TEST_LLM_API_KEY`, and `TEST_LLM_API_MODEL`, then run
`npm run live:real`. `HERMES_DASHBOARD_PUBLIC_URL` is optional for real push tests.
The deterministic runner refuses to test a retained real-provider container.
`npm run live` starts the deterministic stack and loads expectations;
`npm run live:stop` explicitly removes the current project's resources.
