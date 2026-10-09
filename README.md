# ChatHermes

## Development tooling

This project uses Vite+ (`vp`) for linting and formatting. Run `vp lint` to check code and `vp fmt` to format it. Generated `plugin/chathermes/dashboard/dist/` assets are excluded from both. Run `npm test`, `npm run test:api`, and `npm run build` for the project test and build workflows; the build refreshes the committed dashboard assets.

A mobile-friendly chat plugin for the Hermes dashboard. Dashboard authentication protects the UI and its server-side gateway proxy; browser credentials and standalone SPA deployments are not supported.

## Install

```sh
hermes plugins install abauman97/ChatHermes#plugin/chathermes --enable
```

Hermes installs the dependencies declared by the shipped
`plugin/chathermes/pyproject.toml` in its managed runtime; use the dependency
consent prompt during install. Restart the dashboard and open **ChatHermes**.
Enable the Hermes API server with a strong `platforms.api_server.key`; the
plugin uses native gateway RPC for chat, authenticated API history, and `httpx`
in the dashboard runtime. The repo ships built plugin assets for drop-in installation.

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

For browser tests, run `npx playwright install chromium` once, then `npm run live` followed by `npm run test:visual`. Screenshots and traces are saved to `tests/visual-output/`.

Open the `/chathermes` URL printed by `npm run live` in the isolated dashboard. The Dockerfile pins a Hermes base image and source revision because the published base image predates session chat streaming. Configuration is seeded from `.hermes/config.yaml` on every start, runtime data lives in a revision-scoped named volume, and plugin assets/config/test scripts are baked into the image. Sign in with the local-only credentials printed by the launcher. Both default to a generic `fixture-model`; the deterministic OpenAI-compatible fixture makes dashboard testing repeatable, while the actual Hermes agent handles sessions, streaming, and tools. Set `LLM_API_BASE_URL`, `LLM_API_KEY`, and `LLM_API_MODEL` for any OpenAI-compatible provider, then run `npm run live:real`. Both `default` and `test-profile` are created inside this isolated volume to exercise profile selection. The `Instant` option uses the same model via Hermes model routes. The test gateway key is deliberately local-only and must not be used for deployment.

Rebuild with `npm run build` after UI changes. Restart the service after Python route changes by rerunning `npm run live`. Run `npm run live:stop` to remove the launcher's containers; its named test volume and network are preserved. Remove a disposable test volume only after confirming its exact name with `docker volume ls`.

The composer starts a native Hermes session on first send. New Other and Project chats use the authenticated plugin WebSocket with retained active-turn recovery, approvals, clarification, guidance and Stop. Legacy REST run pointers are ignored; saved session history remains available. Unknown submission outcomes are never automatically retried. Images retain authenticated originals and use native multimodal content; other files upload into the selected profile. Provider and model selects affect the session runtime without changing profile defaults. See [API contract](docs/api-contract.md) for recovery bounds, attachment limits and unavailable stronger guarantees.

See [agent conventions](AGENTS.md), [deployment](docs/deployment.md), and [API contract](docs/api-contract.md). Reference images live in `docs/reference/chatgpt/`. Visually verify mobile and desktop behavior in the dashboard before committing.

### Projects

Projects use Hermes's `projects.tree` gateway RPC, including automatic repository
Projects and Home. Selecting a Project loads its fully hydrated
`projects.project_sessions` hierarchy and displays its recent chats. Project and
session query parameters preserve scope across refresh and browser navigation.
Other chats remain available. Hermes owns all membership and Git/worktree grouping.

**New Project Chat** appears on Project home and in an open chat with a selected
Project. It creates a distinct chat in that selected Project. **New chat** in an
open chat still starts an unscoped chat; on Project home it retains scoped creation.
Scoped creation uses the Project path, then its first repository path, resolves the
workspace with `config.get` under the owning profile, and creates a native
`session.create` draft with `source: 'desktop'` and the resolved workspace `cwd`. No
`project_id` is sent to session creation. A pathless Project cannot start a chat;
Home starts a chat without a Project workspace. Empty native drafts persist on
first prompt, following Desktop. An unavailable workspace fails before creation.

Opening another Project changes UI scope while retaining the current chat and
its workspace. Existing sessions always resume with their own saved cwd. Native
`prompt.submit` turns use one Vue session controller with direct native events,
shared Hermes request correlation/heartbeat, server-retained execution and paged
recovery frames. Reload restores activity before completion without native status
polling. Models apply to the native runtime; uploads stay authenticated and profile
scoped. Legacy REST chat execution and its drainage adapter have been removed.
Hermes discovers context files normally; the plugin injects no Project prompt.

Project/session change events, reconnect, foregrounding, completion and profile
changes refresh the tree and selected hierarchy. No separate Project database,
frontend path classifier, or active Project mutation exists. Project management
and session moves remain in Desktop/CLI for this initial workflow.

The implementation is verified against the reviewed test source pin
`ac28abc96ce83f22f6b831f80d9007e2aba81f21`. Session creation always sends
`cwd_explicit: true` for workspace Projects. If an older Hermes gateway rejects
exactly that field as an extra schema input, ChatHermes retries without it only
when the resolved workspace exists locally; older handlers infer explicit cwd
from an existing directory. Other RPC errors are never retried. See the
[source audit](docs/plans/2026-10-01-projects.md),
[verification report](docs/verification/2026-10-01-projects.md), and
[test environment instructions](tests/docker/README.md).

### Scheduled

The drawer's Scheduled screen groups persisted cron history by job in the
selected Hermes profile. Active, Paused and Completed filters lead to dated
runs (newest first), with older pages available and full output on selection.
Agent transcripts retain thinking/tool disclosures; script-only saved Markdown
is also readable. Reloadable job/run links stay within dashboard authentication.
“Open a chat about this run” creates a separate normal chat and drafts the job,
date and assistant/saved output for review before sending.

The adapter follows the pinned Hermes dashboard contracts:
`web_server_cron._cron_profile_home`, `_call_cron_for_profile` and
`_cron_store_scope`; `SessionDB.list_cron_job_runs` and `get_messages_as_conversation` with resume
lineage and compacted display history; and the
native cron output filename/timezone and session reconciliation helpers. The
profile-scoped execution ledger supplies failed runs without saved output. It
reads retained history rather than the transient gateway Runs buffer, pages
beyond the native dashboard's 100-run cap, checks exact job/run ownership, and
returns a compatibility message when these helpers are unavailable. Deleted
jobs or pruned output cannot be recovered. Scheduling and job mutation remain
in Hermes's native dashboard.
