# ChatHermes

A mobile-friendly chat plugin for the Hermes dashboard. Dashboard authentication protects the UI and its server-side gateway proxy; browser credentials and standalone SPA deployments are not supported.

## Install

```sh
hermes plugins install abauman97/ChatHermes#plugin/chathermes --enable
```

Restart the dashboard and open **ChatHermes**. Enable the Hermes API server with a strong `platforms.api_server.key`; the plugin requires its Runs API (and native gateway RPC for workspace chats) and `httpx` in the dashboard runtime. The repo ships built plugin assets for drop-in installation.

## Develop and test

```sh
npm ci
npm test
python3 -m venv .venv
. .venv/bin/activate
pip install -r tests/requirements.txt
npm run test:api
npm run build
npm run live
# Optional: rebuild, launch, and run desktop/mobile Playwright checks
npm run live:visual
```

The launcher builds the pinned image and starts a real Hermes dashboard with ChatHermes
installed and enabled, basic-auth login, and a deterministic model fixture. It needs
Docker and curl, and supports remote daemons without Compose or bind mounts.
`npm run live:stop` stops only its test containers and preserves the named volume.
See [live dashboard workflow](tests/docker/README.md) for remote Docker and real models.
Compose remains available with `docker compose up --build -d`.

For browser tests, run `npx playwright install chromium` once, then `npm run test:visual` with compose running. Screenshots and traces are saved to `tests/visual-output/`.

Open `http://localhost:9119/chathermes` in the isolated dashboard. The compose environment uses a pinned Hermes source revision because the published base image predates session chat streaming. Configuration is seeded from `.hermes/config.yaml` on every start, runtime data lives in the `hermes-test-data` named volume, and plugin assets/config/test scripts are baked into the image. Sign in as `tester` with password `chathermes-local-test` (local test credentials only). Both default to a generic `fixture-model`; the deterministic OpenAI-compatible fixture makes dashboard testing repeatable, while the actual Hermes agent handles sessions, streaming, and tools. Set `LLM_API_BASE_URL`, `LLM_API_KEY`, and `LLM_API_MODEL` for any OpenAI-compatible provider, then run `npm run live:real`. Both `default` and `test-profile` are created inside this isolated volume to exercise profile selection. The `Instant` option uses the same model via Hermes model routes. The test gateway key is deliberately local-only and must not be used for deployment.

Rebuild with `npm run build` after UI changes. Restart the service after Python route changes: `docker compose up --build -d hermes`. `docker compose down` preserves test history; `docker compose down -v` discards the isolated test data.

The composer starts a session on first send. REST turns use `/v1/runs`; active run IDs are remembered per profile/session, and navigation or reload restores status and event replay without resending the prompt. The send button becomes Stop during a run. Pending approvals can be resolved in the chat, and the guidance input steers a running REST agent. Native workspace chats retain their existing context and approval behavior. See [API contract](docs/api-contract.md) for replay retention and runtime details. Images and camera photos use Hermes multimodal image parts; large photos are resized to fit the gateway request limit. other files (up to 20 MB each, five per turn) are uploaded into the selected profile's `uploads/chathermes/` directory and attached by path for the agent's file tools. Uploaded files remain in that profile until removed by its owner. Camera capture uses the device's native file picker on supported mobile browsers. The native provider and model selects use Hermes's `/api/model/options` inventory and start with the selected profile's current provider and model. Choose **Model routes** to use configured gateway aliases from `/v1/models`. If the inventory is unavailable, the picker falls back to the profile default and gateway routes. Model selection passes provider/model overrides to each run; the actual terminal runtime is reported by Hermes. Workspace chats retain the native session model selection path. Chat messages, including streamed responses, render Markdown with raw HTML disabled.

See [agent conventions](AGENTS.md), [deployment](docs/deployment.md), and [API contract](docs/api-contract.md). Reference images live in `docs/reference/chatgpt/`. Visually verify mobile and desktop behavior in the dashboard before committing.

### Projects

Projects use Hermes's `projects.tree` gateway RPC, including automatic repository
Projects and Home. Selecting a Project loads its fully hydrated
`projects.project_sessions` hierarchy and displays its recent chats. Project and
session query parameters preserve scope across refresh and browser navigation.
Other chats remain available. Hermes owns all membership and Git/worktree grouping.

**New chat** uses the Project path, then its first repository path, resolves the
workspace with `config.get` under the owning profile, and creates a native
`session.create` draft with `source: 'desktop'` and the resolved workspace `cwd`. No
`project_id` is sent to session creation. A pathless Project cannot start a chat;
Home starts a chat without a Project workspace. Empty native drafts persist on
first prompt, following Desktop. An unavailable workspace fails before creation.

Opening another Project changes UI scope while retaining the current chat and
its workspace. Existing sessions always resume with their own saved cwd. Native
`prompt.submit` turns, image attachment RPCs, and session-only model selection
are adapted through authenticated plugin routes into the existing composer,
transcript, activity and cancellation interfaces. Workspace chats use provider
inventory models; gateway REST model-route aliases apply to ordinary REST chats.
Hermes discovers context files normally; the plugin injects no Project prompt.

Project/session change events, reconnect, foregrounding, completion and profile
changes refresh the tree and selected hierarchy. No separate Project database,
frontend path classifier, or active Project mutation exists. Project management
and session moves remain in Desktop/CLI for this initial workflow.

The implementation is verified against the unchanged test source pin
`3632f9173d218fd24f3fa595d7affa159b0774cd`. Session creation always sends
`cwd_explicit: true` for workspace Projects. If an older Hermes gateway rejects
exactly that field as an extra schema input, ChatHermes retries without it only
when the resolved workspace exists locally; older handlers infer explicit cwd
from an existing directory. Other RPC errors are never retried. See the
[source audit](docs/plans/2026-10-01-projects.md),
[verification report](docs/verification/2026-10-01-projects.md), and
[test environment instructions](tests/docker/README.md).
