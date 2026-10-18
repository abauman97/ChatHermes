# Global plugin / developer session connection

Investigated checkout `a372190c5263597582922f7aaa0c95fd2edc70c9` on
`fix/global-plugin-profiles-session-connection`. No commit, push, deployment
change, other-checkout edit, or `plugin.yaml` addition.

## Verified cause

Read-only us1 inspection found the installed files at
`/opt/data/plugins/chathermes/dashboard/`. Their SHA-256 values match HEAD:

| File                | SHA-256                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `chat_gateway.py`   | `d9f5c286d3e5dd34e49b5e70c3f5840a7be2d980725759979ea897b9f6f4cd94` |
| `native_channel.py` | `87ddfaeef51f6d67909b89841a88891129d9285739a3efd338e8849463f79aae` |
| `plugin_api.py`     | `d894a0d7d7110606364e56724830516d0916daea98cae2514b351d6616be7dbd` |

Only the top-level `plugins` selection stanzas were parsed from the root and
developer YAML files. Root: ChatHermes enabled, not disabled. Developer:
ChatHermes neither enabled nor disabled. No production `.env`, credentials,
session contents, or logs were inspected. No live request or session was created.

Hermes mounts the plugin router with the async `_plugin_route_secret_scope`
dependency. It enters `_config_profile_scope(profile)` for both HTTP and WS.
Within a developer request, `get_hermes_home()` therefore resolves to the
developer directory. A nested `_config_profile_scope(None)` binds launch-profile
secrets but **does not reset the inherited home override**. Consequently:

- `chat_gateway._enabled()` reads the developer plugin selection, returns false,
  and `socket()` closes with code 4404 before accepting the authenticated viewer.
  Thus no `chat.attach` or native session resolution can happen on that socket.
- `_gateway_settings()` can read the developer listener host/port instead of the
  dashboard listener. A synthetic configuration reproduces this second defect;
  production gateway settings were not inspected, so its production impact is
  unconfirmed.

Both sites now enter `_hermes_home_scope(get_process_hermes_home())` before
`_config_profile_scope(None)`. These are dashboard-host reads. The selected
profile's key, route prefix, native RPC profile, and session ownership checks
remain profile-specific. The process home is resolved through Hermes; it is not
assumed to be `default`, the global install directory, or a fixed filesystem path.

## Request and session trace

1. `src/services/hermes-api.ts` sends cookie-authenticated metadata calls to
   `/api/plugins/chathermes/...?...&profile=developer`. Capabilities and session
   history pass through `_proxy` / `_target`. The host listener receives
   `/p/developer/...`, authenticated with the developer-scoped key. Hermes's API
   server profile-prefix middleware selects the served profile; its session DB
   cache is keyed by that profile home.
2. `src/services/chat-gateway.ts` probes native support using
   `POST /api/auth/ws-ticket`, then the plugin `/chat/ws?profile=developer` with
   the ticket in a subprotocol. The native viewer in
   `src/features/chat/runtime/native-chat.ts` uses the same ticket/socket path.
   The host dependency scopes the request before ChatHermes's enablement check.
3. On an accepted viewer, `native_channel.Channel` handles `chat.attach` with a
   durable stored session ID. It registers profile-scoped redaction values and
   calls `check_profile_session`. That checks the selected native
   `server._profile_db({'profile': 'developer'})`, then same-home live drafts.
   Foreign drafts are rejected before native resume.
4. The retained owner calls `_workspace_resume`, which sends `session.resume`
   through `_RpcTransport.call` to `tui_gateway.server.dispatch`, with
   `profile=developer`, stored `session_id`, `source=desktop`, and
   `inline_images=false`. Only the known extra-field validation rejection retries
   without `inline_images`. Native `_profile_home` / `_profile_scoped` resolve the
   developer home, store and runtime; the plugin does not supply another cwd.
   Draft creation similarly sends `session.create` with the selected profile and
   exposes `stored_session_id`, rather than the runtime ID, to the browser.

## Regression and validation evidence

The reviewed contract was downloaded from the official Hermes source archive at
`ac28abc96ce83f22f6b831f80d9007e2aba81f21`. Archive SHA-256:
`d8ec25f838431dd1bbe6bd679be3c9023d3c3dc602146605b0b67c8887196ceb`.
It was extracted into a clean `/tmp/hermes-reviewed` in a new disposable,
network-disabled container based on the locally available test image. The
interpreter/dependencies came from that image; the imported Hermes Python source
came from the clean reviewed archive. No host state was mounted.

`tests/integration/global_plugin_profiles.test.py` exercises the real Hermes
scope helpers and FastAPI mount dependency with temporary synthetic configs.
It tests a custom root launch and a named-profile launch. Authentication is
stubbed for the WebSocket contract test; storage handles are stubbed for the
native session ownership test. No prompt/provider request is made.

Before the fix, the initial 10-case selection produced **6 failures, 4 passes**:
both launch variants failed enablement, REST listener selection, and WS upgrade.
The REST failure selected `http://wrong-profile.invalid:9999/p/developer/api/sessions`
instead of `http://127.0.0.1:8642/p/developer/api/sessions`.

After the fix, the expanded **16 cases pass**: enablement, listener selection,
developer-key selection, WS ready/ping, global disable precedence even when the
developer enables the plugin, developer store resolution, own persisted/draft
sessions and foreign-draft rejection. The outer developer home is restored after
the host reads.

Focused command inside the disposable container:

```sh
cd /tmp/hermes-reviewed
PYTHONPATH=/tmp/hermes-reviewed /opt/hermes/.venv/bin/python -m pytest \
  --import-mode=importlib -q /tmp/global_plugin_profiles.test.py
```

The test file was copied from this checkout; the plugin was copied to
`/opt/plugins-src/chathermes`. Other completed checks:

- `npm test`: **671 passed**, 32 files.
- `env -u PYTHONPATH PATH="$PWD/.venv/bin:$PATH" npm run test:api`:
  **115 passed**. Clearing the inherited Python 3.14 package path was needed for
  the repository's Python 3.13 virtual environment.
- `npm run build`: passed; generated dist assets remain ignored and unstaged.
- `vp lint`: passed.
- `vp fmt --check`: reports only the pre-existing untracked
  `tests/visual/fixed-shell.spec.ts`, which was not changed.
- `vp fmt --check . '!tests/visual/fixed-shell.spec.ts'`: passed.

No browser/mobile visual or real-provider test was run. This verifies the
server-side connection defect against the reviewed source and synthetic state;
it does not claim a successful production session reconnect or exclude further
production-specific failures after the fixed gate. The current Dockerfile uses
the latest official image, despite older contract documentation describing a
pinned fixture. No Docker/runtime pin or deployment configuration was changed.
