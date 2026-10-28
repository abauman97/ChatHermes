# Issue 189: persisted transcript history

Worktree: `fix/issue-189`, based on `origin/main` at
`89ddfcae798e392d8b259bed7211813b710c9843`. No commits or pushes were made.
The source checkout was not edited. Generated dashboard assets were used for
validation and restored to HEAD afterward; generated bundles remain ignored.

## Contract audit

Reviewed issue [189](https://github.com/abauman97/ChatHermes/issues/189), repository
instructions, API/architecture/testing guides, and Hermes source
`bf0203a794a07aac3ff764972ab9087baa4e4f4e` extracted under
`/tmp/chathermes-189-runtime`. Desktop `getLatestSessionMessages` /
`getOlderSessionMessages` use 120-row latest pages and an order-echo compatibility
guard. `SessionDB.get_messages(include_compacted=True, include_ancestors=True)`
owns generation deduplication, logical chronological order and rewind exclusions.

The real Docker runtime's `gateway/platforms/api_server.py`,
`hermes_state_messages.py`, `hermes_cli/web_routers/sessions.py` and
`tui_gateway/methods_session.py` were SHA-256 compared against that exact source
pin; all four match. The gateway serializer drops summary flags and display
metadata, so the plugin adds an opt-in response extension instead of changing
Hermes source or the native WebSocket protocol.

## Delivered behavior

- Latest 120 persisted rows initially; no full native display-history download.
- Ancestor and rotation history, chronological generation deduplication and
  rewind removals use the actual pinned store contract.
- Desktop display projections retain real asks, tools and images and hide internal
  handoffs. Inline images use authenticated, bounded row reads.
- Multiple markers derive from durable summary flags and proven compression
  edges. Retained tails remain before the compression boundary.
- Scroll-top and button pagination, retryable backfill failures, revision fences,
  obsolete-request cancellation, stable logical rendering identities and scroll
  anchoring preserve loaded history and live turns.
- A settled omitted snapshot rejoins persisted tools only after its complete
  ordered prose agrees with the latest saved occurrence.
- Orderless older gateways fall back to full oldest-first pagination; legacy
  latest paging revalidates its loaded tail.

## Validation

Final results on the finished dashboard image:

| Check                                                   | Result                     |
| ------------------------------------------------------- | -------------------------- |
| `vp fmt --check`                                        | Passed                     |
| `vp lint`                                               | Passed                     |
| `npm test`                                              | 984 passed across 36 files |
| `npm run test:api`                                      | 123 passed                 |
| Pinned runtime transcript + artifact Python integration | 119 passed                 |
| `npm run test:env:build` (includes `npm run build`)     | Passed                     |
| Desktop/mobile `tests/workflows/transcript.spec.ts`     | All 6 passed               |
| Focused desktop/mobile live-backfill rerun              | Both passed                |
| `git diff --check`                                      | Passed                     |

The transcript store suite includes 2,400 messages with large payloads and proves
that the initial read requests only 121 rows (120 plus the preceding boundary
row). Browser workflows cover two in-place compactions, a rotation, repeated
protected tails, rewind, all earlier-page paths, unchanged viewport position,
real offline/reconnect, completion during backfill, reload recovery and restored
tool output. User and assistant inline images archived by compaction load through
authenticated row addresses without inline bytes in the transcript response.

Final image: `chathermes-issue-189-hermes`, image prefix `f29b9783120c`.
The local command logs are under `/tmp/chathermes-189-*.log`.

The Python environment is this worktree's `.venv`, installed with
`pip install -e 'plugin/chathermes[dev]'`. Local pinned tests additionally use
`PYTHONPATH=/tmp/chathermes-189-runtime:/opt/hermes/.venv/lib/python3.14/site-packages:plugin`
and isolated `HERMES_HOME=/tmp/chathermes-189-test-home`.

Docker environment: `COMPOSE_PROJECT_NAME=chathermes-issue-189`, dashboard port
9189, MockServer port 1189. This runner uses a remote daemon and publishes only
on its private `172.25.0.3` interface. Chromium comes from the existing
`/opt/data/profiles/developer/cache/playwright` cache. Infrastructure and failed
state remain available; no reset or cleanup-on-failure was added.

## Screenshots

Authenticated desktop and iPhone 13 viewport screenshots are preserved under
`tmp/issue-189/screenshots/` (ignored local artifacts). Inspected compaction,
restored tool disclosures and image workflow screenshots at both sizes. The
composer remains present; the tests verify focus, pagination and scrolling.
Restored-tool shots show the native recovery disclosure while the retained viewer
is recovering; they are not a claim of lossless progress replay.

- `desktop-compaction.png`, `mobile-compaction.png`
- `desktop-oldest.png`, `mobile-oldest.png`
- `desktop-live-backfill.png`, `mobile-live-backfill.png`
- `desktop-restored-tools.png`, `mobile-restored-tools.png`
- `desktop-archived-images.png`, `mobile-archived-images.png`

## Limits and broader regression findings

An earlier broad run of messaging, response actions, context usage and transcript
workflows completed with 19 passes and five failures. Two were the new live
history scenario and led to the recovery fix above; its final rerun is recorded
above. Three failures are in unchanged composer behavior: Enter/newline handling
on desktop and mobile, and the desktop focused-meter expectation. There is no
diff to `ChatComposer.vue`; these failures are retained and reported, not hidden
by changing their assertions. A separate baseline browser run was not performed.
The other 17 existing regression scenarios passed, including streaming, tool
completion/disclosures, Stop, clarification, model/reasoning application,
attachment-preserving branching and profile/Project isolation.

Android/device keyboard and camera capture, and real-provider inference, were not
run. Mobile evidence is authenticated Chromium at the iPhone 13 viewport. Historical
provider-only or unrecorded compactions without durable row anchors cannot be
reconstructed; no markers are estimated. The plugin scans content-free row
identities and carrier fingerprints for revision fencing. Hermes's own pinned
multi-ancestor implementation still merges that lineage internally before paging;
the browser receives and renders only requested pages.

## Changed files

- [docs/developer/api-contract.md](../../../docs/developer/api-contract.md)
- [docs/developer/testing.md](../../../docs/developer/testing.md)
- [docs/internal/README.md](../../../docs/internal/README.md)
- [docs/internal/verification/2026-10-28-transcript-history.md](../../../docs/internal/verification/2026-10-28-transcript-history.md)
- [docs/user/features.md](../../../docs/user/features.md)
- [plugin/chathermes/dashboard/plugin_api.py](../../../plugin/chathermes/dashboard/plugin_api.py)
- [plugin/chathermes/dashboard/transcript.py](../../../plugin/chathermes/dashboard/transcript.py)
- [src/components/ChatTranscript.vue](../../../src/components/ChatTranscript.vue)
- [src/features/artifacts/artifacts.ts](../../../src/features/artifacts/artifacts.ts)
- [src/features/chat/components/ChatInterface.vue](../../../src/features/chat/components/ChatInterface.vue)
- [src/features/chat/composables/useChatController.ts](../../../src/features/chat/composables/useChatController.ts)
- [src/features/chat/runtime/assistant-turn.ts](../../../src/features/chat/runtime/assistant-turn.ts)
- [src/features/chat/runtime/gateway-display.ts](../../../src/features/chat/runtime/gateway-display.ts)
- [src/features/chat/runtime/native-gateway.test.ts](../../../src/features/chat/runtime/native-gateway.test.ts)
- [src/features/chat/runtime/native-gateway.ts](../../../src/features/chat/runtime/native-gateway.ts)
- [src/features/chat/runtime/native-reconnect.test.ts](../../../src/features/chat/runtime/native-reconnect.test.ts)
- [src/features/chat/runtime/native-session.test.ts](../../../src/features/chat/runtime/native-session.test.ts)
- [src/features/chat/runtime/native-session.ts](../../../src/features/chat/runtime/native-session.ts)
- [src/features/chat/types/chat-ui.ts](../../../src/features/chat/types/chat-ui.ts)
- [src/features/chat/utils/saved-response-targets.ts](../../../src/features/chat/utils/saved-response-targets.ts)
- [src/features/chat/utils/transcript-entries.test.ts](../../../src/features/chat/utils/transcript-entries.test.ts)
- [src/features/chat/utils/transcript-entries.ts](../../../src/features/chat/utils/transcript-entries.ts)
- [src/features/chat/utils/user-message.ts](../../../src/features/chat/utils/user-message.ts)
- [src/services/hermes-api.test.ts](../../../src/services/hermes-api.test.ts)
- [src/services/hermes-api.ts](../../../src/services/hermes-api.ts)
- [src/types/hermes.ts](../../../src/types/hermes.ts)
- [src/utils/message-image.ts](../../../src/utils/message-image.ts)
- [tests/fixtures/transcript.py](../../../tests/fixtures/transcript.py)
- [tests/plugin_api.test.py](../../../tests/plugin_api.test.py)
- [tests/transcript.test.py](../../../tests/transcript.test.py)
- [tests/workflows/transcript.spec.ts](../../../tests/workflows/transcript.spec.ts)
