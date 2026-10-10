# Live isolated Hermes dashboard

Run from this checkout:

```sh
npm ci
npm run live
```

Open the printed dashboard URL and sign in through Hermes's login form as
`tester` / `chathermes-local-test`. These are synthetic local test credentials.
This is the actual Hermes dashboard and agent runtime, with ChatHermes installed
and enabled, not a standalone preview. The default `litellm` model is
`fixture-model`; deterministic fixture mode provides repeatable responses without
a real provider key. The LLM interface is generic: `LLM_API_BASE_URL`,
`LLM_API_KEY`, and `LLM_API_MODEL` configure any OpenAI-compatible provider.
`npm run live:real` loads `TEST_LLM_API_BASE_URL`, `TEST_LLM_API_KEY`, and
`TEST_LLM_API_MODEL` from the repository root `.env` file as data, without
executing shell expressions. Exported test variables override `.env` values;
legacy exported `LLM_API_*` variables remain supported. Test variables take
precedence over legacy variables. The launcher maps these settings to the
pinned Hermes runtime's `LLM_API_*` environment contract, without copying
provider secrets into the image, generated configuration, or logs. Keep `.env`
untracked. The provider base URL must not contain credentials, a query, or a
fragment. Fixture mode and `live:stop` never load `.env`.

`npm run live` builds plugin assets and the Docker image, recreates only its
revision-scoped Hermes, model and browser relay containers, then waits for the dashboard's
`/api/auth/providers` readiness route. Every launch refreshes the baked plugin,
config and fixture. Docker and curl are required. No host bind mounts or personal
Hermes home is used. Data stays in a dedicated named volume. Containers, network,
and volume are scoped to the current commit to keep concurrent checkouts isolated;
set `CHATHERMES_INSTANCE` to override the instance name. The dashboard is
published on `0.0.0.0` by default on the Docker host, so it is reachable from a
remote browser; use host firewall rules to control access. Synthetic login
credentials are printed by the launcher and are test-only. Set
`CHATHERMES_DASHBOARD_PORT` to avoid host port conflicts. For a remote daemon,
set `CHATHERMES_DAEMON_ADDRESS` to the daemon host's reachable IPv4 address; the
runner uses it for readiness checks and the printed URL. `CHATHERMES_BIND_ADDRESS`
may scope the published port to a specific daemon-host interface when desired.
Each shell launcher instance uses isolated, revision-scoped Docker resources.

The source is pinned to `ac28abc96ce83f22f6b831f80d9007e2aba81f21`, with
its download checksum verified, and the base image digest in `Dockerfile` is
unchanged. The fixture adds `snowballstemmer==3.1.1`, required by the upgraded
source but absent from the older base runtime. It also installs the shipped
`plugin/chathermes/pyproject.toml` dependency package, so missing production Web
Push dependencies cannot be masked by a separate test-only package list. Use `npm run live` to build and start the fixture dashboard; Docker Compose is not required.
Both modes expose only the dashboard port by default. The model fixture and
gateway API are accessible only within the isolated Docker network.

Fixture mode fixes the model to `fixture-model` and ignores host provider
settings; it never calls a real provider. Use `npm run live:real` with all three variables for live model calls.

The shell runner derives its readiness probe from the daemon URL address and dashboard port.

## Remote Docker without Compose

The documented daemon in this development environment is accessible at
`tcp://172.25.0.2:2375`. The CLI rejects `tcp://docker:2375` as an invalid bind
address; the runner recognizes that exact environment value (including its
literal quoted variant) and uses the documented numeric endpoint. Other Docker
contexts/endpoints are left unchanged. The runner checks daemon access before
building or changing containers; it does not install or start a daemon.

The default wildcard publish address works with remote Docker as well as local
Docker. Provide the daemon host address separately so the readiness probe uses
a reachable URL:

```sh
export DOCKER_HOST=tcp://172.25.0.2:2375
export CHATHERMES_DAEMON_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=9121
npm run live
```

For local Docker, the runner can derive the URL directly from the bind address.
If you publish on `0.0.0.0`, use `CHATHERMES_DASHBOARD_URL_HOST` to select a
specific address for the readiness probe and browser URL. `CHATHERMES_BIND_ADDRESS`
controls only the published host-side listener; it is not the URL used to reach
the daemon. Fixture UI traffic is relayed over the dedicated browser network to
the Hermes dashboard on the internal network, keeping model/gateway traffic private.
The relay publishes only dashboard port 9119; its upstream is `hermes:9119`.
`CHATHERMES_INTERNAL_DOCKER_NETWORK` may select an existing internal network
when the daemon has exhausted its bridge address pools. The launcher checks its
internal flag and keeps the browser relay on a separate network.

`CHATHERMES_DASHBOARD_PORT` defaults to 9119; choose a free port if other
dashboards are running. No fixture or gateway port needs publishing. The remote
daemon needs no Compose plugin. Plugin assets and scripts are baked
into the image; the generated config is passed through container environment and written into the
disposable volume at startup.

## Optional Playwright verification

```sh
npx playwright install chromium
npm run live:visual
# Or, with the dashboard already running:
npm run test:visual
```

The existing Playwright suite signs in through basic auth's dashboard form and
runs in the actual plugin at desktop and mobile sizes. It exercises real native
sessions, profiles, Projects, fixture-backed streaming and tools; some UI tests
use deterministic route mocks. Screenshots/traces go to ignored
`tests/visual-output/`. Inspect screenshots before committing. Traces may contain
authentication/session data; keep them local. Tests create synthetic chats and
attachments in the dedicated volume. Real integration credentials are never
needed for this suite.

For a preinstalled browser, set `CHATHERMES_CHROMIUM` to its executable path.
In this environment:

```sh
export PLAYWRIGHT_BROWSERS_PATH=/opt/data/profiles/developer/home/.cache/ms-playwright
export CHATHERMES_CHROMIUM=$PLAYWRIGHT_BROWSERS_PATH/chromium-1243/chrome-linux64/chrome
npm run test:visual
```

## Real provider calls (explicit opt-in)

Export generic settings for any OpenAI-compatible provider (the base URL and
model identifier must be supported by that provider; the URL must be reachable
from the container):

```sh
export LLM_API_BASE_URL="https://your-openai-compatible-endpoint/v1"
export LLM_API_KEY="your-provider-key"
export LLM_API_MODEL="your-model-id"
npm run live:real
```

Do not echo the key, write it into tracked files, or share raw container logs.
The runner inherits all three settings through Docker environment names, not
command arguments. It substitutes the model into a short-lived runtime config
file outside the repository; the URL and key stay environment-only. Real mode
keeps credentials out of profile files and removes only the synthetic
`test-profile` home because the pinned native multiplexer
requires profile `.env` credentials. Fixture mode recreates that profile.
A local provider must listen on an address reachable from the container; the
shell runner does not invent a provider address or add host aliases.

`node tests/integration/projects.mjs` verifies provider replies using
`LLM_API_MODEL` through authenticated native Project/workspace routes at desktop/mobile sizes.
Its screenshots and synthetic result summary go to ignored
`tests/integration-output/issue-7/`. Restore fixtures with `npm run live` afterward.
Real provider calls may incur costs and are separate from default verification.

## Stop and validate

```sh
npm run live:stop              # remove only runner containers; preserve data
npm test
. .venv/bin/activate           # pip install -r tests/requirements.txt first
npm run test:api
npm run test:docker
npm run build
```

The shell runner never deletes volumes. Its network and volume are retained
across stops. When running multiple long browser suites in succession,
restart the isolated fixture with `npm run live` between suites: retained native
viewers can otherwise fill the plugin’s bounded viewer capacity. Restarting
clears process-local viewers while preserving the named data volume. Remove test data only by explicitly removing the confirmed
disposable test volume. Never commit generated state or credentials.

Startup uses native `hermes_cli.projects_db` to create the three synthetic
Projects expected by `projects.spec.ts`. It creates `.hermes.md` and a lower
priority `AGENTS.md` in the available workspace. It never seeds false chat
membership or sets an active Project. Verify restart identity and context
precedence through Hermes's own prompt builder:

```sh
# Use the instance name selected for your launch:
docker exec chathermes-ptuigateway-hermes /opt/hermes/.venv/bin/python /test/verify_seed.py
```

Physical iOS keyboard/camera hardware and a launched Desktop client remain
outside browser automation.

## Native session tests

Fixture mode keeps Hermes and the model on an instance-scoped internal network.
Only the inbound browser relay publishes the dashboard port; real mode uses
its normal provider-capable network. Stop removes the selected instance's
Hermes, model and relay containers while preserving its named volume.

After `CHATHERMES_INSTANCE=ptuigateway npm run live`, run native protocol/runtime
and browser probes with the same instance, Docker host and browser URL:

```sh
CHATHERMES_INSTANCE=ptuigateway CHATHERMES_TEST_URL=http://172.25.0.2:9133 \
  CHATHERMES_CHROMIUM=/path/to/chrome npm run test:native
```

The native script rejects a different image, volume or real-provider mode.
Fixture-only `fixture-model-2` tests session model selection without changing
the tracked provider-agnostic configuration. Both launch modes keep the
documented `LLM_API_KEY`, `LLM_API_BASE_URL`, and `LLM_API_MODEL` names.

## Container ownership

New containers carry a `chathermes.live.instance` label. Launch and stop verify
all target containers before removing any; a matching name alone does not grant
ownership. If an older unlabeled test container occupies the name, select a new
`CHATHERMES_INSTANCE` or inspect and stop that disposable container explicitly.
Named data volumes remain preserved, including on failed startup and stop.

The fixture, profile and native test helpers remain available. Both fixture and
real modes use the pinned Dockerfile and source, so runtime behavior matches the
plugin's tested API contract. `npm run live` continues to run the deterministic
fixture; real-provider testing remains opt-in through `npm run live:real`.
