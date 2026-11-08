# Plugin catalog admission

ChatHermes has **not established catalog eligibility**. Passing the validator is
necessary but does not settle private API use or credential policy. Consult the
[current submission rules](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins/catalog-submission),
[canonical rules](https://github.com/NousResearch/hermes-agent/blob/main/plugin-catalog/README.md)
and [public API reference](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins/public-api).
The [installed plugin README](../../plugin/chathermes/README.md) contains disclosures
for users and a future catalog PR. Exact checks and limitations are recorded in
[issue 238 verification](../internal/verification/2026-11-08-issue-238-catalog-admission.md).

## Implemented improvements

The manifest declares Hermes `>=0.22.5`, matching the reviewed native contract,
and the runtime package requires Python 3.14+, matching existing backend syntax.
The unused unbounded plugin development extra is removed; tooling stays in the
root project. Registration uses `ctx.register_platform`, with its public label
and optional `CHATHERMES_HOME_CHANNEL`, without tools/hooks/middleware.

Registration no longer wraps `cron.scheduler_delivery.cron_delivery_targets`.
Native Cron can display “Chathermes” because it title-cases platform IDs; the
plugin supplies `label="ChatHermes"` through public registration. Delivery stays
available. Outbound and queued Cron payloads use the public
`agent.redact.redact_sensitive_text(..., force=True)` with fail-closed handling;
redaction failures never log exception text. This replaces private scheduler
redaction/display-name helpers without weakening the scheduler's policy.
Native Cron names and result text retain Markdown and bracketed prefixes;
gateway credentials are replaced literally before forced public redaction.

The gateway's environment-key fallback uses `agent.secret_scope.get_secret`
inside the existing host scope, rather than ambient `API_SERVER_KEY`. Config-key
precedence and profile routing remain. Response redaction handles escaped JSON
keys/values, duplicate members, numeric values, UTF encodings and malformed
structured responses. Tests exercise actual Hermes scopes and restoration.
These safeguards do not establish compliance for the remaining credential path.

Push identity updates use unpredictable, exclusive temporary files, private from
the first byte, followed by atomic replacement. Failed publication preserves the
previous identity and removes the temporary key. Persistent identity, encrypted
push transport and per-profile subscriptions remain available. A stable sidecar
file lock covers each read/modify/write transaction across module instances and
profile-host processes, including first-time key generation and subscription
updates. The JSON format and existing signing identity are preserved.

## Current upstream assessment

On 2026-11-08 the public API allowlist, PluginContext, credentialed request helper,
plugin storage and dashboard extension docs were inspected at Hermes main
`e075441241b8d626789b4aae0e376f86eabf824d`. These are separate evidence from the
reviewed local runtime pin and official image used for validation.

| Surface                 | Available public support                                                                                                  | Remaining requirement                                                                                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard mounting/auth | React dashboard SDK, plugin FastAPI router, authenticated plugin routes                                                   | Already used. This is the web dashboard SDK, not the unrelated Desktop SDK.                                                                                                                                                                                                                                         |
| Scoped secrets          | `agent.secret_scope.get_secret`                                                                                           | Used for environment fallback; host/profile selection still uses private dashboard scopes. Need a public authenticated dashboard request context and background profile-scoping API.                                                                                                                                |
| Gateway delegation      | `credentialed_provider_request` for provider sign-ins and declared plugin OAuth clients                                   | No internal gateway provider/client is offered. It validates installed-plugin identity and allowed origins; it is not a general bearer proxy. Need host-managed profile-bound HTTP/RPC/viewer delegation without giving plugin code the key.                                                                        |
| Session history         | Public `SessionDB`, dashboard REST/SDK, and newer authenticated gateway `session.transcript` with `session-transcript-v1` | The newer RPC is a migration candidate, not a missing upstream history capability. It is absent at the reviewed native pin. Need verified cursor/reset/lineage/image parity and a supported host-bound connection/delegated viewer for background and hosted profiles. Raw DB rows are insufficient.                |
| Files/projects          | Authenticated dashboard HTTP endpoints                                                                                    | Backend calls into `web_routers.files` retain managed-path authorization and native project rules. Need supported profile/session-bound file and project services; do not replace them with unrestricted filesystem reads.                                                                                          |
| Cron                    | Public execution identity and platform registration; public forced redactor                                               | Execution/output lookup, exact run matching, queue metadata and scoped stores still use undocumented modules/private helpers. Need supported execution/output/delivery APIs, including script-only jobs and queue drains.                                                                                           |
| Durable data            | `plugin_data_dir` / `plugin_db` follow the active profile                                                                 | They explicitly exclude secrets. Moving the shared Inbox/push state to profile-local stores would change cross-profile functionality and does not provide signing or gateway delegation.                                                                                                                            |
| Web Push signing        | No VAPID/signing API found in the current public surface                                                                  | Generated server identity is not a vendor login, but persists private key material. Ask maintainers whether rule 11 permits plugin-generated signing identities, or request a durable host-managed signer with legacy-key import. This is a policy question, not proof that a missing OAuth route applies to VAPID. |

The newer [gateway local sessions contract](https://hermes-agent.nousresearch.com/docs/developer-guide/gateway-local-sessions) documents authenticated transcript pagination. Do not describe that capability as universally absent. Its existence does not make `tui_gateway.server.dispatch` public or supply a dashboard backend credential-delegation API. This work retains the reviewed runtime contract rather than claiming unverified parity on a new protocol.

**Public API use is still a blocker** under rule 9. Warnings name
`web_server_profiles`, `web_server_sessions`, `web_server_cron`, native RPC/client
and file/transcript/Cron helpers. The dashboard guide's permission to import
internals does not make every import a catalog-supported API. Merely hiding an
import behind a local wrapper would not fix this.

**Gateway credential routing is unresolved** under rule 11. The plugin still
loads `platforms.api_server.key` through Hermes config and holds a server-side
bearer for gateway calls. Declaring the key as a new plugin secret would not
provide delegation or eliminate private profile scopes. Do not borrow browser
credentials for background work, expose keys, loosen authentication, or use an
OAuth declaration to send provider tokens to the gateway.

**VAPID storage requires an upstream policy decision or signer**. Do not silently
rotate/delete existing keys, move private keys to the browser, or disable push to
claim compliance. A host signer must preserve subscriptions across updates and
support unattended Cron delivery. No upstream issue or policy approval has been
created or obtained by this work.

## Dependencies and distribution

Runtime Python requirements remain exact pins. The frontend upgrades Markdown to
15.0.3 and Vite+ (including its Vite alias) to 1.5.0; the lock updates compatible
transitives. Narrow overrides give `js-beautify` patched Glob 14 and `editorconfig`
patched Minimatch 11 while retaining Vue test functionality. Root pytest is
9.0.3, addressing its temporary-directory advisory. Reassess these overrides when
the parent packages adopt patched ranges. The full locked development toolchain
requires Node `^22.22.2 || ^24.15.0 || >=26.0.0`. Locked `jsdom` 30.1.3 and
`@asamuzakjp/css-color` 7.2.0 impose these floors; Vite+ 1.5.0 and Undici 8.12.4
also exclude Node 20. The asset workflow uses current Node 22.
See the verification record for audits and their scope; audits do not certify
Hermes's full installed environment or absence of undisclosed vulnerabilities. The
inspected official image retains OAuthlib 4.0.0 (CVE-2026-49272, patched in 4.0.1)
in its upstream lock; the verification record distinguishes this remaining host
finding from the clear repository audits.

The existing [asset workflow](../../.github/workflows/build-assets.yml)
intentionally builds and publishes generated dashboard assets. Leave it intact.
Contributors and agents must not stage, commit, force-add or push local dist
output. A catalog SHA must include the manifest's required loadable assets,
published by the existing automation. A local source build's success is not
proof that a future pinned SHA has those assets.

No Desktop entrypoint is shipped. The web dashboard loads its own local bundle;
it does not fetch replacement runtime code or self-update. Plugin-owned sibling
module registration in `sys.modules` does not replace Hermes core modules.

## Submission

Use an isolated Hermes runtime because dependency preparation changes its
environment:

```sh
hermes plugins validate /path/to/plugin/chathermes --install-deps
```

Read preparation errors and warnings as well as the exit code. Run the
[repository checks and mounted workflows](testing.md), including profile isolation,
authenticated uploads, native model execution, cancellation and Cron output.

After the unresolved surfaces/policy are settled, an owner or major contributor
can propose `subdir: plugin/chathermes`, an exact reviewed 40-character SHA,
quoted matching version, matching Hermes floor, disclosures and UI screenshots.
Admission and each SHA bump require upstream human review. Do not invent a pin
or treat automated validation as approval.
