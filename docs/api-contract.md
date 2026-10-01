# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/main/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes calls same-origin dashboard plugin routes. The Python proxy selects the Hermes profile and adds the gateway bearer key on the server.

| Operation | Hermes route | Request | Expected response |
| --- | --- | --- | --- |
| List | `GET /api/sessions?limit=30&offset=N` | None | `{ "object":"list", "data":[session…], "limit":30, "offset":N, "has_more":boolean }` |
| Create | `POST /api/sessions` | `{}` | `{ "object":"hermes.session", "session":{ "id":… } }` (201) |
| Read | `GET /api/sessions/{id}` | None | `{ "object":"hermes.session", "session":{…} }` |
| Rename | `PATCH /api/sessions/{id}` | `{ "title": "…" }` | `{ "object":"hermes.session", "session":{…} }` |
| History | `GET /api/sessions/{id}/messages?limit=500&offset=N&order=oldest&inline_images=false` | None | `{ "object":"list", "session_id":…, "data":[message…], "pagination":{ "limit":500, "offset":N, "order":"oldest", "returned":count } }` |
| Turn | `POST /api/sessions/{id}/chat/stream` | `{ "input": "…", "model": "…", "provider": "…", "require_model_lock": true }` (selection fields optional) | SSE stream |
| Capabilities | `GET /v1/capabilities` | None | Feature and endpoint flags |
| Run state/stop | `GET /v1/runs/{id}`, `POST /v1/runs/{id}/stop` | None | Run state |

The stream sends `assistant.delta` with `delta` and `tool.started` with `tool_name`. Events also carry `session_id`, `run_id`, `seq`, and `ts`. A successful turn ends with a `run.completed` event containing `session_id`, `message_id`, `messages`, `usage`, and `runtime`; it does not need a `status` field. `run.failed`, `run.cancelled`, and `error` mean the turn did not complete. SSE keepalive comments and `done` are ignored. ChatHermes loads history again after completion and only clears streamed text once that reload succeeds. Message history is requested oldest first in 500 item pages so earlier messages are not hidden by Hermes' default latest 500 page. A malformed page raises an error and leaves the previously displayed messages intact. The gateway advertises this route with `features.session_chat_streaming: true` and `endpoints.session_chat_stream: { method: "POST", path: "/api/sessions/{session_id}/chat/stream" }`; sending stays disabled until both are confirmed; the text input stays editable. An `approval.request` blocks further sends in that conversation. Refreshing history does not confirm run completion, so the send lock remains until explicit navigation or a page reload with a warning to verify the previous turn. ChatHermes does not surface an approval action or a stop control without a verified run ID flow.

## Plugin-specific routes

`GET /profiles` returns Hermes profile names only. `GET /v1/models` proxies the configured gateway catalog and adds the selected profile’s `default_model`. Named-profile requests use that profile’s `API_SERVER_KEY` from its secret scope. `GET /api/model/options` proxies the selected profile's Hermes provider inventory and returns only `provider`, `model`, and provider rows containing `slug`, `name`, `is_current`, and model IDs. Provider transport and authentication metadata are excluded; unconfigured non-current providers are omitted. The UI defaults to the current provider, resets selection on profile changes, and keeps gateway route aliases in a separate **Model routes** choice. A missing inventory falls back to the configured default and route aliases; the virtual gateway alias (`parent: null`) is not a provider model. Explicit model selection adds `model`, `provider` (for inventory models), and `require_model_lock: true` to each streamed turn, so Hermes confirms the requested runtime rather than silently retaining a session model.

`POST /uploads` accepts a filename and base64 data URL (20 MB decoded maximum), validates the profile and body, and stores a generated filename under that profile's `uploads/chathermes/`. It returns the path for agent file tools. Image attachments use `{type: "image_url", image_url: {url: "data:image/..."}}` alongside text in the session input array.

`tool.started` carries `tool_name`, `args`, and `preview`; `tool.progress` carries `delta` (including `_thinking` reasoning). Tool completion/failure and final assistant text close active disclosures. The UI displays available reasoning exactly as Hermes emits it; it cannot create token-level reasoning when the provider only publishes a completed reasoning segment.

## Test environment

The compose environment pins Hermes revision `3632f9173d218fd24f3fa595d7affa159b0774cd` on a digest-pinned runtime image. Runtime state is isolated in a named volume. See README for commands and model endpoint configuration.
