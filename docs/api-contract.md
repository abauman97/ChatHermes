# Hermes session API contract

The [Hermes API server source](https://github.com/NousResearch/hermes-agent/blob/main/gateway/platforms/api_server.py) defines these authenticated routes. ChatHermes scopes each route to the selected profile through its local proxy.

| Operation | Hermes route | Request | Expected response |
| --- | --- | --- | --- |
| List | `GET /api/sessions?limit=30&offset=N` | None | `{ "object":"list", "data":[session…], "limit":30, "offset":N, "has_more":boolean }` |
| Create | `POST /api/sessions` | `{}` | `{ "object":"hermes.session", "session":{ "id":… } }` (201) |
| Read | `GET /api/sessions/{id}` | None | `{ "object":"hermes.session", "session":{…} }` |
| Rename | `PATCH /api/sessions/{id}` | `{ "title": "…" }` | `{ "object":"hermes.session", "session":{…} }` |
| History | `GET /api/sessions/{id}/messages?limit=500&offset=N&order=oldest&inline_images=false` | None | `{ "object":"list", "session_id":…, "data":[message…], "pagination":{ "limit":500, "offset":N, "order":"oldest", "returned":count } }` |
| Turn | `POST /api/sessions/{id}/chat/stream` | `{ "input": "…" }` | SSE stream |
| Capabilities | `GET /v1/capabilities` | None | Feature and endpoint flags |
| Run state/stop | `GET /v1/runs/{id}`, `POST /v1/runs/{id}/stop` | None | Run state |

The stream sends `assistant.delta` with `delta` and `tool.started` with `tool_name`. Events also carry `session_id`, `run_id`, `seq`, and `ts`. A successful turn ends with a `run.completed` event containing `session_id`, `message_id`, `messages`, `usage`, and `runtime`; it does not need a `status` field. `run.failed`, `run.cancelled`, and `error` mean the turn did not complete. SSE keepalive comments and `done` are ignored. ChatHermes loads history again after completion and only clears streamed text once that reload succeeds. Message history is requested oldest first in 500 item pages so earlier messages are not hidden by Hermes' default latest 500 page. A malformed page raises an error and leaves the previously displayed messages intact. The gateway advertises this route with `features.session_chat_streaming: true` and `endpoints.session_chat_stream: { method: "POST", path: "/api/sessions/{session_id}/chat/stream" }`; sending stays disabled until both are confirmed. An `approval.request` blocks further sends in that conversation. Refreshing history does not confirm run completion, so the send lock remains until explicit navigation or a page reload with a warning to verify the previous turn. ChatHermes does not surface an approval action or a stop control without a verified run ID flow.

## Verification status

On 2026-09-29, the endpoint implementations in upstream `main` and the installed `/opt/hermes/gateway/platforms/api_server.py` were inspected. Both use the envelopes and stream fields above. Authenticated live calls and private session data were not accessed. Tests use synthetic IDs, mocked profiles, and Hermes-shaped responses; they do not prove live gateway behavior. The client also accepts older synthetic `sessions`/`messages` arrays and bare session objects where useful.
