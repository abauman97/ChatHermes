# Notification storage investigation — 2026-10-13

Investigated the initially clean worktree at origin/main
`641026f09b87d19d3269cfe8f355752faedeb043`. No commit, staging, push, or
deployment. The original dirty checkout was not accessed or modified.

## Trace and history

- Settings calls the authenticated plugin configuration, status, subscription,
  deletion, and explicit test routes. Browser subscription state is shared, while
  saved registrations and deletion are scoped to the selected Hermes profile.
- Native `Owner.capture` detects completion and approval/clarification/secret
  requests. `Owner.notify` deduplicates native identities, maps secrets to generic
  attention alerts, and passes the stored session ID to the loaded sender.
  Owners retain the native transport after viewers disconnect; cleanup preserves
  running sessions. Sender scheduling runs delivery in a daemon thread.
- Delivery reads subscriptions and persisted VAPID keys, builds the bounded
  payload, and invokes Web Push. HTTP 404/410 responses remove expired
  subscriptions through `push_store.remove_endpoint`.
- The service worker validates payloads and canonical chat hashes. It obtains
  fresh plugin session replies and suppresses/closes notifications only for the
  visible, connected originating profile/session. Explicit tests always display.
  The mounted client publishes visibility/connection changes and clears its
  attestation on unmount.
- `6e133ad` introduced separate API store loading and the sender's fallback store
  loading. Both execute the same file but create independent module instances.
  The effective sibling loader is the second `_load_sibling` definition in
  `plugin_api.py`; it supplies no package context. The earlier package-aware
  definition is shadowed. Consequently the sender's relative import fails and
  its fallback executes `push_store.py` again.
- `72c8bbb` connected native notifications to the loaded sender. The later
  `432757f` suppression change was corrected by `13e4ba5`; `7924fd4` already fixes
  secret-kind rejection. `194e211` moved frontend notification files without
  changing behavior. `22e8770` migrated worker/navigation URLs to canonical
  hashes. Those existing fixes and routing semantics were preserved.

## Concrete defect and fix

The API and sender access the same `state/chathermes-push.json` file with
**different RLocks**. Their read-modify-write operations are therefore not
serialized. Atomic replacement prevents partial JSON reads but cannot prevent
one writer from overwriting another writer's changes. Both writers also use the
same temporary filename.

The regression test reproduces this specific sequence for both HTTP 404 and 410:

1. Delivery reaches the mocked external transport for an alpha subscription.
2. API registration of beta reads the current state and pauses inside its lock.
3. Transport reports expiry; the sender removes alpha using its separate lock.
4. Beta registration writes its stale snapshot, resurrecting expired alpha.

The opposite write order can discard a new registration; that consequence is
inferred from the same unsynchronized read-modify-write design, not separately
reproduced here. Concurrent initial key generation is likewise unprotected
across those instances.

The narrow fix binds the loaded sender to the API's existing store immediately
after loading. API mutations, delivery configuration/key reads, and expired
endpoint removal now share one lock. No worker, frontend, native runtime,
subscription shape, or authentication behavior changes.

This is a source-level concurrency defect present at the requested SHA, dating
to the initial push integration. The unspecified user report does not establish
that it caused the reported regression or implicate a particular recent commit.

## Coverage and commands

`test_push_sender_expiry_serializes_with_api_registration` uses two real threads,
event-controlled interleaving, real temporary JSON persistence/configuration,
and the real delivery/expiry path. Only the external Web Push transport is mocked.
It checks that cleanup waits, expired alpha remains removed, and beta's scoped
status retains its registration. It uses synthetic subscriptions and no personal
Hermes state.

- `npm ci`: succeeded.
- Before the fix,
  `python3 -m pytest tests/plugin_api.test.py -k push_sender_expiry_serializes --tb=short`:
  **2 failed**, both because expired alpha was resurrected. This was verified
  with only the store-binding line absent, then restored.
- After the fix,
  `python3 -m pytest tests/plugin_api.test.py -k 'push_sender_expiry_serializes or native_request_reaches_push_transport'`:
  **5 passed**.
- `npm test`: **656 passed**, 32 files.
- `npm run test:api`: **115 passed**.
- `python3 -m pytest tests/push_store.test.py`: **79 passed**.
- `npm run build`: passed; rebuilt tracked dashboard assets are byte-identical
  to HEAD (`git diff --exit-code -- plugin/chathermes/dashboard/dist` passed).
  No generated asset changes are included or staged.
- `npx vp lint` and `npx vp fmt --check`: passed.
- `git diff --check`: passed.

## Live limitations

`npm run live` rebuilt successfully but exited before container creation because
`TEST_LLM_API_BASE_URL` was missing. No repository root `.env` was available.
`npm run live:stop` completed afterward. Actual mounted-plugin mobile/desktop
visual verification and external Web Push/device delivery were not performed.
No changes were committed.
