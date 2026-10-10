# Disposable Hermes dashboard

The image extends `nousresearch/hermes-agent:latest`, installs the checked-out
ChatHermes plugin and its Python dependencies, enables authenticated dashboard
access, and starts the real Hermes gateway and dashboard under the upstream
supervisor. It uses a real OpenAI-compatible provider, without fixture replies,
bind mounts, or personal Hermes configuration.

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
