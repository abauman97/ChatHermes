# Live isolated Hermes dashboard

Run from this checkout:

```sh
npm ci
npm run live
```

Open the printed dashboard URL (default `http://127.0.0.1:9119/chathermes`) and
sign in through Hermes's login form
as `tester` / `chathermes-local-test`. These are synthetic local test credentials.
This is the actual Hermes dashboard and agent runtime, with ChatHermes installed
and enabled, not a standalone preview. The default `litellm` model is
`fixture-model`; deterministic fixture mode provides repeatable responses without
a real provider key. The LLM interface is generic: `LLM_API_BASE_URL`,
`LLM_API_KEY`, and `LLM_API_MODEL` configure any OpenAI-compatible provider.
`npm run live:real` passes these environment settings into Hermes without writing
credentials to repository files or logging them.

`npm run live` builds plugin assets and the Docker image, recreates only its
revision-scoped Hermes and model containers, then waits for the dashboard's
`/api/auth/providers` readiness route. Every launch refreshes the baked plugin,
config and fixture. Docker and curl are required. No host bind mounts or personal
Hermes home are used. Data stays in a dedicated named volume. Containers, network,
and volume are scoped to the current commit to keep concurrent checkouts isolated;
set `CHATHERMES_INSTANCE` to override the instance name. Provide `CHATHERMES_DASHBOARD_PORT` and
`CHATHERMES_BIND_ADDRESS` together when using remote Docker; the port must be
available on that daemon host.
Do not run Compose and the shell launcher simultaneously on the same data volume.

The source remains pinned to `3632f9173d218fd24f3fa595d7affa159b0774cd`, with
its download checksum verified, and the base image digest in `Dockerfile` is
unchanged. `compose.yml` remains the local fixture specification:
`npm run build && docker compose up --build -d` is an alternative fixture launcher.
Both expose only the dashboard on loopback by default. The model fixture and
gateway API are accessible only within the isolated Docker network.

Compose fixture settings can be overridden for an ad hoc model label with
`LLM_API_MODEL`; fixture requests remain deterministic and do not call a real
provider. Use `npm run live:real` with all three variables for live model calls.

The launcher derives its readiness probe from the bind address and dashboard port.

## Remote Docker without Compose

The documented daemon in this development environment is accessible at
`tcp://172.25.0.2:2375`. The CLI rejects `tcp://docker:2375` as an invalid bind
address; the runner recognizes that exact environment value (including its
literal quoted variant) and uses the documented numeric endpoint. Other Docker
contexts/endpoints are left unchanged. The runner checks daemon access before
building or changing containers; it does not install or start a daemon.

Remote loopback belongs to the daemon host. Select a specific reachable daemon
interface and provide its browser URL explicitly:

```sh
export DOCKER_HOST=tcp://172.25.0.2:2375
export CHATHERMES_BIND_ADDRESS=172.25.0.2
export CHATHERMES_DASHBOARD_PORT=9121
npm run live
```

The runner rejects wildcard binds. `CHATHERMES_DASHBOARD_PORT` defaults to 9119;
choose a free port if other dashboards are running. No fixture or gateway port
needs publishing. The remote daemon needs no Compose plugin and cannot access
this checkout via host bind mounts; all inputs are baked into the image.

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

For Compose, `docker compose down` preserves history and `docker compose down -v`
discards its isolated data. The shell runner never deletes volumes. Its network
and volume are retained across stops. Never commit generated state or credentials.

Startup uses native `hermes_cli.projects_db` to create the three synthetic
Projects expected by `projects.spec.ts`. It creates `.hermes.md` and a lower
priority `AGENTS.md` in the available workspace. It never seeds false chat
membership or sets an active Project. Verify restart identity and context
precedence through Hermes's own prompt builder:

```sh
docker exec chathermes-test-hermes /opt/hermes/.venv/bin/python /test/verify_seed.py
```

Physical iOS keyboard/camera hardware and a launched Desktop client remain
outside browser automation.
