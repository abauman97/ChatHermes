# Isolated Hermes validation

`compose.yml` uses a dedicated named data volume, the pinned base image digest,
and Hermes source revision `3632f9173d218fd24f3fa595d7affa159b0774cd` (download
checksum verified). The plugin, config and scripts are baked into the image;
no personal Hermes home or host bind mount is needed. Build after changing
plugin code or test scripts:

```sh
npm run build
export DOCKER_HOST=tcp://172.25.0.2:2375
docker build -f tests/docker/Dockerfile -t chathermes-test:3632f917 .
sh tests/docker/run.sh fixture
```

For local Docker with Compose, use `docker compose up --build -d`; the model
service uses the same self-contained image. The remote daemon has no Compose
plugin. `run.sh` is its equivalent, publishes ports 9119/8642, and exclusively
uses `chathermes-issue7-test-data` and a dedicated Docker network for fixture
container-name resolution. The runner waits for `/api/auth/providers` to respond.
The remote daemon's dashboard URL is `http://172.25.0.2:9119`.

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

Compose is the environment specification. On a remote daemon without the Compose
plugin, the existing `run.sh` runs its equivalent isolated network/services and
named data volume. Preserve the source pin and base-image digest. After changing
the model fixture, recreate the dedicated fixture container so it uses the rebuilt
image as well. Physical iOS keyboard/camera hardware and a launched Desktop client
remain outside browser automation.
