# Notification service investigation — 2026-10-11

Investigated detached origin/main `f2cd213` in a clean worktree. No commit, push,
or deployment. The report supplied no symptom or reproduction steps, so this
identifies a reproducible notification defect; it cannot establish that this
specific defect explains the user's unspecified report.

## Root cause and history

Commit `88853bf` added native `secret` requests to `Owner.capture`'s notification
path and forwarded the raw method as the notification kind. The sender's
`BODIES`/delivery allowlist and the browser worker accept `turn.complete`,
`approval`, `clarify`, `attention`, and `test`, but not `secret`. Scheduling returns
success while `_deliver` records `deliver.invalid` and exits before Web Push.
The owner then deduplicates the request, so repeated frames do not retry it.
Approval and clarification use valid kinds and continue to deliver.

The narrow fix maps a secret request to the existing generic `attention` alert
at the native request boundary. It forwards no request prompt or value and uses
the stored session ID as before. No sender, browser worker, handshake,
suppression, reconnect, subscription, or frontend behavior was changed.

Also checked the suspected recent commits:

- `432757f` removed the connected-viewer requirement and suppressed alerts for
  visible disconnected sessions. `13e4ba5`, already present in this checkout,
  restored it. Existing worker tests cover reconnect retention and cleanup,
  invalid/missing replies, visibility changes, and multiple-client races.
- `194e211` moved the notification service and tests unchanged into the feature
  directory and updated App imports. The notification state computation was
  preserved. The later `7f10d59` activity refactor did not change the notification
  service or worker.

## Reproduction and validation

Added `test_native_request_reaches_push_transport` to `tests/plugin_api.test.py`.
It drives native owner capture through the real sender, scheduling, store,
VAPID loading, payload builder, and delivery path. Thread execution is made
synchronous and the external `pywebpush.webpush` call is mocked. Storage uses a
temporary directory and synthetic subscriptions, with no personal Hermes state.

Before the fix:

`python3 -m pytest tests/plugin_api.test.py -k native_request_reaches_push_transport`

produced **2 passed, 1 failed**: approval and clarification reached the transport;
secret made zero transport calls and logged `deliver.invalid`, followed by
`sender.scheduled` with `success: true`.

After the fix, all three cases pass. Assertions also verify duplicate suppression,
foreign-session isolation, stored-session routing, continued viewer delivery,
and absence of request content from push payloads and logs.

Validation:

- `npm test`: **422 passed**, 29 files.
- `npm run test:api`: **103 passed**.
- `python3 -m pytest tests/push_store.test.py`: **79 passed**.
- `npx vp lint`: passed.
- `npx vp fmt --check`: reports existing formatting issues in
  `public/push-service-worker.js` and
  `src/features/notifications/services/push-worker.test.ts`. Neither was edited;
  unrelated formatting is preserved. Changed documentation passes formatting.
- `npm run build`: passed. Committed dashboard dist assets were rebuilt and are
  byte-identical to HEAD, so there is no generated asset diff to include.
- `git diff --check`: passed.

## Visual and transport limitations

Attempted `npm run live` using the repository launcher. Build succeeded, but the
launcher exited before creating a container because `TEST_LLM_API_BASE_URL` was
missing; no root `.env` provider configuration was available. Ran
`npm run live:stop` afterward. Actual mounted-plugin mobile/desktop visual
verification could not be performed. No external Web Push delivery, physical
device, iOS Home Screen behavior, or OS notification interaction was tested.
No changes were committed.
