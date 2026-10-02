# Isolated Hermes validation

## Latest container (local Compose)

```sh
npm run build
docker compose config --quiet
docker compose up -d --wait
npx playwright test
```

Open `http://localhost:9119/chathermes` and authenticate with the local test
account documented in the main README. Compose always pulls the mutable
`nousresearch/hermes-agent:latest` tag for Hermes, the model fixture, and the
browser relay. To record the exact release used:

```sh
docker image inspect nousresearch/hermes-agent:latest --format '{{json .RepoDigests}}'
```

Hermes and `model_fixture.py` share an internal network without an internet
route. `browser_relay.py` forwards only incoming TCP connections to the fixed
Hermes dashboard/gateway ports; this accommodates Docker versions that do not
publish ports on internal-only networks. Only the relay joins the external
bridge. Host ports 9119/8642 bind to localhost. Fixture credentials and URL are
literal Compose values, never real provider settings inherited from `.env`.

`start-latest.sh` copies read-only plugin inputs into the dedicated named volume,
seeds both profiles, then execs the image's native PID-1 startup dispatcher.
The existing legacy wrapper is not used. Run `docker compose restart hermes`
after rebuilding assets or changing plugin Python code. No personal Hermes home
is mounted. `docker compose down -v` removes only this Compose project's volumes.

## Latest-image compatibility

The plugin retries native schema rejections of `cwd_explicit` on workspace
creation and the optional `inline_images` flag on resume. Retries preserve
profile/session scope and never replace the session's workspace. Other RPC
errors remain failures. Regression coverage exercises the actual transport
error handling as well as route behavior.

## Verification record — October 2, 2026

Tested published image:
`nousresearch/hermes-agent@sha256:d4da4a40cd7a28aba983775d9fd31d94cbf153eeb0cb9e844d6d0f612b7c24db`.
The digest records this verification only; Compose continues to pull `latest`.

Unit tests (48), API tests (30), the plugin asset build, and all six browser
tests passed. Browser validation covers desktop and mobile ordinary chat, native workspace Projects,
context discovery, tools, refresh, model locking, both profiles, authenticated
file/image attachments, and disclosure transitions. Additional Chromium checks
confirmed composer focus during a request and conversation scrolling at both
sizes. An authenticated run stop returned 200 and streamed `run.cancelled`;
stopping it from the other profile returned 404. Hermes's external TCP probe
returned network-unreachable, while the internal model fixture stayed reachable.

Screenshots/traces are ignored artifacts in `tests/visual-output/verified-latest/`.
Physical iOS keyboards/cameras and the Desktop client were not tested. All model
responses were synthetic; no real-provider integration was run.

## Preserved pinned harness

The separate `Dockerfile` retains the pinned base image digest and Hermes source
revision `3632f9173d218fd24f3fa595d7affa159b0774cd` with checksum verification.
Plugin inputs are baked in for remote daemons without host bind-mount access:

```sh
npm run build
export DOCKER_HOST=tcp://172.25.0.2:2375
docker build -f tests/docker/Dockerfile -t chathermes-test:3632f917 .
sh tests/docker/run.sh fixture
```

`run.sh` publishes ports 9119/8642 and exclusively uses
`chathermes-issue7-test-data` and its dedicated fixture network. It waits for
`/api/auth/providers`. This legacy runner is separate from the latest Compose
environment; its remote dashboard URL is `http://172.25.0.2:9119`.

Startup uses native `hermes_cli.projects_db` to create the three synthetic
Projects expected by `projects.spec.ts`. It creates `.hermes.md` and a lower
priority `AGENTS.md` in the available workspace. It never seeds false chat
membership or sets an active Project. Verify restart identity and context
precedence through Hermes's own prompt builder:

```sh
docker exec chathermes-gateway /opt/hermes/.venv/bin/python /test/verify_seed.py
```

Normal tests use only fixtures and Playwright route mocks:

```sh
npm test
. .venv/bin/activate
npm run test:api
export CHATHERMES_TEST_URL=http://172.25.0.2:9119
export PLAYWRIGHT_BROWSERS_PATH=/opt/data/profiles/developer/home/.cache/ms-playwright
export CHATHERMES_CHROMIUM=$PLAYWRIGHT_BROWSERS_PATH/chromium-1243/chrome-linux64/chrome
npx playwright test
```

Real integration is a separate, explicitly invoked run. Load `LITELLM_API_KEY`
into the shell environment from your secret provider, without echoing it or
writing it to any file. The runner forwards it using Docker's environment
inheritance. `CHATHERMES_TEST_REAL=1` keeps the real key in process memory and
uses the default single-profile gateway; the pinned native multiplexer requires
profile `.env` credentials, which we deliberately do not write for real keys.
Fixture runs test multiplexing with synthetic credentials. Real startup removes
only the seeded `test-profile` home; fixture startup recreates it. This is needed
because `tui_gateway/launch_profile_policy.py::activate_multi_profile_hosting_eagerly`
activates profile hosting whenever a second home exists, even with the config
flag disabled. No real key is written to either profile.

```sh
sh tests/docker/run.sh real
# Wait for the dashboard to become ready, using the URL above.
node tests/integration/projects.mjs
sh tests/docker/run.sh fixture
```

The separate script authenticates through the dashboard form, exercises native
authoritative Project tree/detail and native workspace creation,
streams a provider-inventory `gpt-6-luna` reply through `prompt.submit`, resumes it in the plugin,
and checks refresh and focus at desktop/mobile sizes. Screenshots and a
credential-free result summary go to `tests/integration-output/issue-7/` (ignored
by Git). The full fixture suite writes screenshots to `tests/visual-output/`.
Inspect both sets before committing. No synthetic or real user session data is
committed.

Project tests now exercise native Project creation, prompt streaming, workspace
tool execution, context discovery, membership in the hydrated server tree,
resume/refresh, scope changes, pathless and unavailable Projects, and profiles.
The fixture sees the runtime's system message and only reports context discovery
when the seeded `.hermes.md` marker actually arrived; the terminal fixture runs
`pwd` in the real agent workspace. No Project route or workspace chat is mocked.
Other activity/attachment UI tests retain their deterministic fixtures.

The pinned runner remains available on remote daemons without Compose. Preserve
its source pin and base-image digest. After changing the pinned model fixture,
recreate its fixture container from the rebuilt image. Physical iOS keyboard and
camera hardware remain outside browser automation.
