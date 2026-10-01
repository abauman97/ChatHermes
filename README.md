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

### Projects (browse-only compatibility preview)

ChatHermes lists the native, profile-scoped Hermes `projects_db.Project` records
used by Desktop; selecting one shows its metadata and primary workspace. URLs
such as `/chathermes?profile=default&project=p_…` preserve that selection through
refresh and browser navigation. No separate Project database or global active
Project is used. Chats remain accessible under **Other chats**.

**Issue #7 is blocked by the upstream session contract.** The pinned test source
`3632f9173d218fd24f3fa595d7affa159b0774cd` supports Project metadata, but stores no
explicit chat-to-Project relationship. Desktop groups chats by workspace paths.
The gateway's session-create REST handler ignores `project_id` and `cwd`.
Consequently Project-specific New chat and sending are unavailable, and the
plugin rejects requests with workspace/Project fields before forwarding them.
It cannot safely display Desktop chats as explicitly Project-bound sessions.
A missing Project, missing primary path, or unavailable directory is shown in the
UI; creation never silently falls back to the default workspace.

In Desktop, `primary_path` supplies the initial workspace through native
`session.create` RPC's `cwd`; native resume restores the saved working directory.
Hermes then discovers context files using its existing prompt builder, with
`.hermes.md`/`HERMES.md`, AGENTS directory chain, CLAUDE, then Cursor rules
precedence. ChatHermes does not inject or parse Project instructions. Full mobile
Project chat support requires an upstream create/list/detail/runtime contract
with explicit Project membership and per-session workspace initialization,
adopted by Desktop. No released minimum version supporting that complete
contract was identified; metadata browsing requires `hermes_cli.projects_db`
(the pinned source has it). See the [source audit and plan](docs/plans/2026-10-01-projects.md).

The isolated test image seeds **Hermes Mobile**, **AcumaticaMCP** (no primary
path), and **Unavailable workspace** using native `projects_db.create_project`.
Repeated startup preserves their IDs and does not change the active Project.
See [the test environment instructions](tests/docker/README.md) for fixture
visual tests and separate real LiteLLM integration validation.
