# ChatHermes

## Development tooling

This project uses Vite+ (`vp`) for linting and formatting. Run `vp lint` to check code and `vp fmt` to format it. Generated `plugin/chathermes/dashboard/dist/` assets are excluded from both. Run `npm test`, `npm run test:api`, and `npm run build` for the project test and build workflows; the build generates ignored dashboard assets for validation and packaging; keep them out of commits.

A mobile-friendly chat plugin for the Hermes dashboard. Dashboard authentication protects the UI and its server-side gateway proxy; browser credentials and standalone SPA deployments are not supported.

## Install

```sh
hermes plugins install abauman97/ChatHermes#plugin/chathermes --enable
```

For a named profile that needs ChatHermes as a Cron delivery target, link the
installed plugin into that profile and enable/configure it there as well. For
example, with Hermes data under `/opt/data`:

```sh
mkdir -p /opt/data/profiles/developer/plugins
ln -s /opt/data/plugins/chathermes \
  /opt/data/profiles/developer/plugins/chathermes
hermes -p developer plugins enable chathermes
hermes -p developer config set platforms.chathermes.enabled true
hermes -p developer config set platforms.chathermes.home_channel '<developer-destination>'
```

Replace `developer` and the destination with your profile's name and its own
valid home-channel value. If that profile already has a `plugins/chathermes`
path, inspect it before linking; do not overwrite an existing installation.
The symlink shares plugin code only, not profile settings or subscriptions. Each
profile needs its own destination and enabled push subscription. See **Enable
Cron delivery** below for the destination format and delivery verification steps.

Hermes installs the dependencies declared by the shipped
`plugin/chathermes/pyproject.toml` in its managed runtime; use the dependency
consent prompt during install. Restart the dashboard and open **ChatHermes**.
Enable the Hermes API server with a strong `platforms.api_server.key`; the
plugin uses native gateway RPC for chat, authenticated API history, and `httpx`
in the dashboard runtime. The repo ships built plugin assets for drop-in installation.

### Enable Cron delivery

To make ChatHermes available in Hermes's Cron **Deliver to** menu, the plugin
must be enabled in the profile that owns the Cron job. Plugin files installed
in the default profile can be globally available, but plugin enablement,
platform configuration, and Cron jobs are profile-scoped. Repeat these steps
for each profile that should send ChatHermes notifications. In that profile's
`config.yaml`, keep any existing entries under `plugins.enabled` and add
`chathermes`:

```yaml
plugins:
  enabled:
    - chathermes
platforms:
  chathermes:
    enabled: true
    home_channel:
      platform: chathermes
      chat_id: scheduled
      name: Scheduled results
```

The `plugins.enabled` entry enables ChatHermes and the
`platforms.chathermes` entry enables the platform and configures its Cron
destination in that profile. Alternatively, set
`CHATHERMES_HOME_CHANNEL=scheduled` in that profile's `.env`; the `plugins`
enablement is still required. The `scheduled` destination targets all enabled
ChatHermes push devices in the profile; use a push subscription ID instead to
target one device. Restart the Hermes dashboard after enabling the plugin and
configuring the destination, then choose **ChatHermes** in Cron's **Deliver
to** selector. This saves `deliver=chathermes`; installation alone does not
configure the destination, and existing Cron jobs are not changed
automatically. A push subscription must be enabled in ChatHermes for the
notification to reach a device.

## Develop and test

```sh
npm ci
npm test
python3 -m venv .venv
. .venv/bin/activate
pip install -r tests/requirements.txt
# Install ChatHermes plugin dependencies plus Python test tooling for its cron tests
pip install -e 'plugin/chathermes[dev]'
npm run test:api
npm run build
npm run live
# Optional: rebuild, launch, and run desktop/mobile Playwright checks
npm run live:visual
# Optional: start Hermes and install the plugin PWA in disposable Android 14
npm run test:live:android
# Remove the Android device after testing
npm run live:android:stop
```

The launcher builds from the latest official Hermes image and starts one disposable
container with ChatHermes installed and enabled. Add `TEST_LLM_API_BASE_URL`,
`TEST_LLM_API_KEY`, and `TEST_LLM_API_MODEL` to the repository root `.env` file,
then run `npm run live` (or its alias
`npm run live:real`). The provider URL must be reachable from inside Docker;
`localhost` there refers to the container itself. No bind mounts or personal
Hermes state are used. `npm run live:stop` removes the container and its anonymous
data volume. Each new launch starts with an empty Hermes home.

Open the printed `/chathermes` URL and sign in with `tester` /
`chathermes-local-test`. Use `CHATHERMES_INSTANCE` and
`CHATHERMES_DASHBOARD_PORT` to run multiple containers. See the
[live dashboard workflow](tests/docker/README.md) for direct Docker commands,
remote Docker, and port settings.

For browser tests, run `npx playwright install chromium` once, then
`npm run live:visual`, or set `CHATHERMES_TEST_URL` to the running dashboard and
run `npm run test:visual`. The default desktop/mobile checks send a small real
model request and require tool support. The older fixture-dependent suites are
available through `npm run test:visual:legacy` with a separately supplied seeded
dashboard. Screenshots and traces are saved to `tests/visual-output/`.

Rebuild with `npm run live` after plugin changes; the plugin is baked into the
image. Provider credentials stay in the container environment and gateway
credentials are generated server-side. Do not use the default test login for a
public deployment.

The composer starts a native Hermes session on first send. New Other and Project chats use the authenticated plugin WebSocket with retained active-turn recovery, approvals, clarification, guidance and Stop. Legacy REST run pointers are ignored; saved session history remains available. Unknown submission outcomes are never automatically retried. Images retain authenticated originals and use native multimodal content; other files upload into the selected profile. Provider and model selects affect the session runtime without changing profile defaults. See [API contract](docs/api-contract.md) for recovery bounds, attachment limits and unavailable stronger guarantees.

See [frontend architecture](docs/architecture.md), [agent conventions](AGENTS.md), [deployment](docs/deployment.md), and [API contract](docs/api-contract.md). Reference images live in `docs/reference/chatgpt/`. Visually verify mobile and desktop behavior in the dashboard before committing.

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

## Navigation links

ChatHermes uses canonical hash routes, for example
`/chathermes?profile=default#/chat/session_123?profile=default`.
The outer profile query belongs to the Hermes host; plugin screen selection,
profile/session scope and Settings return destinations live inside the hash.
Older query-based page, session, project and scheduled links are no longer
interpreted. Notifications now generate canonical hash links.
