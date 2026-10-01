# ChatHermes

A mobile-friendly chat plugin for the Hermes dashboard. Dashboard authentication protects the UI and its server-side gateway proxy; browser credentials and standalone SPA deployments are not supported.

## Install

```sh
hermes plugins install abauman97/ChatHermes#plugin/chathermes --enable
```

Restart the dashboard and open **ChatHermes**. Enable the Hermes API server with a strong `platforms.api_server.key`; the plugin requires its session chat streaming API and `httpx` in the dashboard runtime. The repo ships built plugin assets for drop-in installation.

## Develop and test

```sh
npm ci
npm test
python3 -m venv .venv
. .venv/bin/activate
pip install -r tests/requirements.txt
npm run test:api
npm run build
# Optional: LITELLM_BASE_URL and LITELLM_API_KEY in .env for real model calls
docker compose up --build -d
```

For browser tests, run `npx playwright install chromium` once, then `npm run test:visual` with compose running. Screenshots and traces are saved to `tests/visual-output/`.

Open `http://localhost:9119/chathermes` in the isolated dashboard. The compose environment uses a pinned Hermes source revision because the published base image predates session chat streaming. Configuration is seeded from `.hermes/config.yaml` on every start, runtime data lives in the `hermes-test-data` named volume, and plugin source is mounted read-only. Sign in as `tester` with password `chathermes-local-test` (local test credentials only). The default model is `gpt-6-luna` through a deterministic OpenAI-compatible fixture, while the actual Hermes agent handles sessions, streaming, and tools. For real model calls, set `LITELLM_BASE_URL` (e.g. `http://host.docker.internal:4000/v1`) and `LITELLM_API_KEY` in `.env`. Both `default` and `test-profile` are created inside this isolated volume to exercise profile selection. The `Instant` option uses the same model via Hermes model routes. The test gateway key is deliberately local-only and must not be used for deployment.

Rebuild with `npm run build` after UI changes. Restart the service after Python route changes: `docker compose restart hermes`. `docker compose down` preserves test history; `docker compose down -v` discards the isolated test data.

The composer starts a session on first send. Images and camera photos use Hermes multimodal image parts; large photos are resized to fit the gateway request limit. other files (up to 20 MB each, five per turn) are uploaded into the selected profile's `uploads/chathermes/` directory and attached by path for the agent's file tools. Uploaded files remain in that profile until removed by its owner. Camera capture uses the device's native file picker on supported mobile browsers. The native provider and model selects use Hermes's `/api/model/options` inventory and start with the selected profile's current provider and model. Choose **Model routes** to use configured gateway aliases from `/v1/models`. If the inventory is unavailable, the picker falls back to the profile default and gateway routes. Model selection locks the provider/model for each streamed turn. Chat messages, including streamed responses, render Markdown with raw HTML disabled.

See [agent conventions](AGENTS.md), [deployment](docs/deployment.md), and [API contract](docs/api-contract.md). Reference images live in `docs/reference/chatgpt/`. Visually verify mobile and desktop behavior in the dashboard before committing.
