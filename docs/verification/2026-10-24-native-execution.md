# Native execution and completion delivery verification — 2026-10-24

The browser and server execution viewer use Hermes 0.22.5 at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`, one native `/api/ws` contract.
The plugin registers no WebSocket route and does not translate protocols.
The existing staged deletions and other starting changes were preserved. No
commit, staging or push was performed. Tracked distribution assets have no diff;
final build output was generated under ignored `dist/native-validation`.

The server viewer attaches before browser submission using a separate delegated
single-use ticket. It preserves native execution after browser departure,
advertises native question support, leaves supported questions open for browser
answers, and queues attention without storing request contents. It tracks native
child identities and releases settled work. Native Stop remains authoritative.
Execution retention lasts for the host process, not a host/runtime crash.

Successful native completion is matched to exact newly committed assistant text
after the owning profile/session's pre-submission row watermark and a new user
row. The native optional row-coverage field is not required by this release.
The durable outbox stores row addresses and device identities, with independent
claims, retries, success receipts and cancellation flags. Unsubscribing cancels
pending delivery without recording provider success. Repeated equal finals and
storage delays retain separate committed identities. Provider acceptance followed
by a process crash before recording success can repeat the same notification tag;
this is at-least-once delivery. There is no durable exactly-once prompt admission
or atomic snapshot/progress replay claim.

## Validation

- `npm test`: 751 tests across 32 files passed.
- Focused native transport, lifecycle, reconnect and capability suites: 79 passed.
- `npm run test:api`: 93 passed, six local runtime-dependent skips. The skipped
  cases passed when run inside the pinned runtime below.
- Local execution/outbox and push-store suites: 97 passed.
- Pinned-container API, push, cron, execution, native-contract, global-profile and
  dependency-workspace suites: 242 passed, no skips. One upstream Python
  deprecation warning remained.
- `npm run test:docker`: 19 passed. Android browser/PWA helper unit tests:
  16 passed.
- `vp fmt`, `vp lint`, `vue-tsc` through `npm run build`, and `git diff --check`
  passed. Build output is ignored and tracked distribution files are unchanged.
- Actual authenticated dashboard plugin, desktop and mobile: all eight profile,
  ticket, collision and uncertain-submission checks passed; both unattended tests
  also passed. Initial five-second cold hydration assertions were extended to
  wait for the real profile response before asserting persisted history.
- Final exact implementation: four desktop/mobile attachment/composer and
  unattended checks passed. Each unattended run left during a quiet 35-second
  terminal command, waited 45 seconds away, recovered one persisted answer with
  no resubmission, and checked a durable pending push for the selected device,
  with no delivery entry for another profile's subscribed device.
- Final live protocol and membership checks: four passed.
- Broader live focus, scrolling, model selection, routing and profile/upload
  isolation checks: 13 passed; one desktop landscape case intentionally skipped.
  Desktop/mobile screenshots of active and completed tool disclosures,
  attachments, selects, composer focus and scrolling were inspected.

Artifacts remain ignored under `tests/integration-output/` and
`tests/visual-output/`; no credentials, provider configuration or runtime state
are included in source changes.

## Limitations and cleanup

Android launch was attempted with the repository launcher. The emulator did not
boot within six minutes and ADB reported no device. The launcher's failed-start
cleanup removed its owned Android container.

The two real notification-click worker checks could not run to completion in
this headless Chromium: notification permission remained `denied` after both
origin-specific and global Playwright permission grants. A local loopback proxy
provided a secure browser context and confirmed the same result in the page and
worker. The earlier plain HTTP Docker hostname also lacked service-worker
support. Notification parsing/routing remains covered by unit tests. Real cloud
Web Push acceptance and physical Android/iOS camera capture were not verified;
the live outbox check used a synthetic invalid push subscription to verify
pending/failure and profile-isolation semantics, not successful cloud delivery.

The owned real-provider container and anonymous volume are removed with the
repository launcher after verification. The pre-existing container is left
untouched. The local loopback test proxy is stopped.

The final active source/test/docs audit found no removed route, module import,
translator, callable facade, or dual-mode protocol references. Generated bundles
and ignored test artifacts are excluded from that audit.

## Changed active files

Deleted implementation and transport-only tests are replaced by the native
contract, server viewer, outbox and regressions above. The exact active files
changed in this worktree are listed below; superseded architecture records now
point to the current API contract, with their original evidence in Git history.

- `README.md`
- `docs/api-contract.md`
- `docs/deployment.md`
- `docs/plans/persistent-tui-gateway.md`
- `docs/push-notifications.md`
- `docs/verification/2026-10-04-native-gate.md`
- `docs/verification/2026-10-04-native-send-fix.md`
- `docs/verification/2026-10-04-persistent-tui-integration.md`
- `docs/verification/2026-10-05-native-session-migration.md`
- `docs/verification/2026-10-08-issue-59-reconnect.md`
- `docs/verification/2026-10-12-artifact-parser-bypasses.md`
- `docs/verification/2026-10-17-footer-padding.md`
- `docs/verification/2026-10-18-global-plugin-profiles-session-connection.md`
- `docs/verification/2026-10-19-uncertain-native-session.md`
- `docs/verification/2026-10-23-native-gateway-profiles.md`
- `docs/verification/2026-10-24-native-execution.md`
- `playwright.config.ts`
- `plugin/chathermes/dashboard/completion_outbox.py`
- `plugin/chathermes/dashboard/execution_viewer.py`
- `plugin/chathermes/dashboard/gateway_transport.py`
- `plugin/chathermes/dashboard/native_validation.py`
- `plugin/chathermes/dashboard/plugin_api.py`
- `src/features/chat/runtime/native-chat.ts`
- `src/features/chat/runtime/native-gateway.test.ts`
- `src/features/chat/runtime/native-gateway.ts`
- `src/features/chat/runtime/native-reconnect.test.ts`
- `src/features/chat/runtime/native-session.test.ts`
- `src/features/chat/runtime/native-session.ts`
- `src/services/chat-gateway.test.ts`
- `src/services/chat-gateway.ts`
- `src/vendor/hermes/README.md`
- `src/vendor/hermes/gateway-contract.generated.ts`
- `tests/execution_viewer.test.py`
- `tests/integration/global_plugin_profiles.test.py`
- `tests/integration/native_contract.test.py`
- `tests/plugin_api.test.py`
- `tests/visual/native-chat.spec.ts`
- `tests/visual/native-duplicate-final.spec.ts`
- `tests/visual/native-gate.spec.ts`
- `tests/visual/native-profile-live.spec.ts`
- `tests/visual/native-reconnect.spec.ts`
- `tests/visual/unattended-native-live.spec.ts`
