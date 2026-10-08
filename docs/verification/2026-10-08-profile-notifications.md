# Profile notification controls and assistant previews

Worked only in the scratch `chathermes-push-diagnostics` checkout. Initial git
status contained only untracked `scripts/diagnose_live_push.py`, which was left
untouched. No commit, push or deployment was performed.

Settings now names the selected profile, loads its authenticated device/profile
status, and guards against stale results after profile switches. The empty
profile selection means `default` in `_rpc_profile`; its select label now says
Default profile. Existing endpoint/profile registrations and their IDs remain
compatible. Disabling uses the existing profile-scoped DELETE-by-ID API and
retains the browser subscription for other profiles. Enabling posts only the
accepted endpoint/keys shape, excluding browser `expirationTime`.

Traced the pinned Hermes source `ac28abc96ce83f22f6b831f80d9007e2aba81f21`:
`tui_gateway/prompt_turn.py::_complete_turn_payload` emits authoritative final
assistant text as `message.complete.payload.text`, including transformed
responses. `_RpcTransport.write` redacts known credentials before Owner.capture.
That text now travels to the sender for successful and interrupted/failed
completion events. Missing successful completion text stays empty. Reasoning and
tool data are excluded. Titles remain exactly ChatHermes. Serialized payloads
stay at or below 3000 UTF-8 bytes with Unicode-safe body truncation; the worker
preserves the supplied body. Provider response bodies are excluded from logs to
prevent echoed message content.

Final checks:

- Focused JavaScript: `npm test -- src/lib/push.test.ts src/lib/push-worker.test.ts src/App.test.ts`: 3 files, 89 passed.
- Focused Python: `.venv/bin/python -m pytest tests/push_store.test.py tests/plugin_api.test.py -k push`: 65 passed, 87 deselected.
- `npm test`: 19 files, 213 passed.
- `PATH="$PWD/.venv/bin:$PATH" npm run test:api`: 103 passed.
- `npm run build`: passed; shipped dashboard dist assets rebuilt.
- `git diff --check`: passed.
- Playwright `dashboard.spec.ts`, `push-routing.spec.ts`, and new `push-settings.spec.ts`: 6 passed, desktop and mobile.

System Python initially lacked pytest. Created an ignored `.venv` with
`uv venv .venv` and installed `tests/requirements.txt` there. Browser checks used
`CHATHERMES_TEST_URL=http://172.25.0.2:9127`,
`PLAYWRIGHT_BROWSERS_PATH=/opt/data/profiles/developer/cache/playwright`, and
`CHATHERMES_CHROMIUM=/opt/data/profiles/developer/cache/playwright/chromium-1243/chrome-linux64/chrome`.
The initial headless-shell run passed desktop dashboard checks but failed the
worker check because the secure-origin flag did not enable service workers;
interrupted the disabled notification-control test and reran all six checks
successfully with full Chromium.

Started only the isolated fixture with
`CHATHERMES_INSTANCE=push-notification-changes CHATHERMES_DASHBOARD_PORT=9127 CHATHERMES_BIND_ADDRESS=172.25.0.2 npm run live`.
Inspected mobile/desktop screenshots of profile notification settings, expanded
tool disclosures, attachments and camera previews. Assertions cover composer
focus on home, during activity and offline; scrolling/disclosures; native selects;
file upload; per-profile notification status/actions; and exact-session
suppression and reconnect cleanup.

The profile-settings browser test substitutes only the external PushManager
subscription with a synthetic device; authenticated dashboard status, save and
delete routes use real fixture storage. Routing tests use synthetic browser
notifications and the real plugin/service worker. No external push provider,
physical device, iOS Home Screen, or OS notification-click interaction was tested.
Unit tests verify actual assistant payload generation, exact titles, Unicode/JSON
byte limits, credential redaction, and content-free diagnostics.

Stopped this fixture with `CHATHERMES_INSTANCE=push-notification-changes npm run live:stop`;
its disposable named data volume was preserved.
