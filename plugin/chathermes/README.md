# ChatHermes

An authenticated Hermes dashboard plugin with chat, profile/model selection,
Projects, attachments, artifacts, scheduled results and optional Web Push. Vue
mounts through the Hermes React dashboard SDK. `ctx.register_platform` registers
the outbound-only `chathermes` Cron destination. No tools, hooks, middleware or
OAuth clients are registered.

## Compatibility and admission status

The reviewed runtime is Hermes 0.22.5 at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`. The manifest declares that minimum;
native chat also checks its protocol before sending. Python 3.14+ is required.

**Catalog eligibility has not been established.** Dashboard integration uses
undocumented Hermes APIs. Gateway access still needs configuration credentials,
and Web Push persists a generated signing key. These need public upstream APIs or
an explicit maintainer decision; passing static validation alone is insufficient.

Build assets from the repository root with `npm ci` and `npm run build` before
local installation. Contributors and agents must keep generated `dashboard/dist/`
output ignored and must not stage, commit, force-add or push it. The existing
automated asset workflow intentionally builds, commits and publishes these
assets; that publication is permitted. This work leaves the workflow intact and restores tracked assets after validation. A proposed catalog SHA must contain the required loadable assets.

## Installation disclosures

- Network: authenticated same-origin dashboard HTTP/WebSockets, server-side HTTP
  to the configured Hermes gateway and loopback dashboard execution monitoring.
  Hermes sends prompts/attachments to the user's configured providers and runs
  agent tools. Optional Kanban uses Hermes's existing authenticated API.
  Rendered Markdown images can contact their referenced external hosts; opening
  external links also leaves the dashboard.
- Web Push is enabled per device by the user. It contacts the browser's push
  service (for example Google, Mozilla or Apple) with encrypted notification
  content and subscription addressing. A service worker caches plugin assets and
  handles notifications. No telemetry or usage reporting is implemented.
- Outside plugin data: reads profile configuration, session databases/history,
  Projects/instructions, Cron jobs/executions/output and selected artifacts.
  Uploads and user-requested edits/deletion affect selected profile files.
  Agent execution retains Hermes approvals. The plugin runtime launches no shell
  children and does not install packages or update its own code.
- Persistence: the default Hermes root's `state/chathermes.sqlite3` holds shared,
  profile-addressed Inbox, artifact index, session tracking and delivery state.
  `state/chathermes-push.json` holds subscriptions and a generated VAPID private
  signing key with private file permissions from creation and atomic replacement. The key remains server-side.
  Both stores use Hermes's `get_default_hermes_root(home=get_process_hermes_home())`,
  including when the process runs from a named profile. For a custom root's
  `profiles/<name>` process home, they live under that root's `state/`, not the
  named profile's directory.
  Gateway credentials also remain server-side and are redacted from responses.
  The plugin does not read vendor login stores or refresh OAuth tokens.
- Background work: dashboard-host tasks monitor executions, index artifacts,
  reconcile Inbox and retry pending push. They live with the host process, with
  no separately installed daemon. Cron can deliver without an open browser.
  Disabling device push does not erase saved Inbox/history.
- Setup installs the three pinned runtime dependencies in `pyproject.toml` and
  their transitive dependencies under Hermes constraints. Repository build and
  install scripts are explicit developer operations, separate from runtime.
- Dependency maintenance: the repository upgrades vulnerable frontend/tooling
  dependencies and audits its locked npm and Python development sets. Audit
  results and remaining limitations are recorded in the repository verification
  record; Hermes manages its own runtime constraints separately.

- Known upstream finding: the inspected official Hermes 0.23.0 image includes
  OAuthlib 4.0.0, flagged for device-code token validation
  ([CVE-2026-49272](https://github.com/oauthlib/oauthlib/security/advisories/GHSA-3jp2-3mrg-2vxc)),
  fixed in 4.0.1. Hermes owns that dependency lock; host exposure was not established.
  ChatHermes does not implement the affected token server.

See the repository's `docs/` directory for user and developer guides.
