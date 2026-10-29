# Issue 197 verification — 2026-10-29

Implemented persistent profile-scoped Open/Settled metadata in the existing shared
SQLite migration infrastructure. Confirmed ChatHermes creations start Open;
existing sessions remain untracked. Manual transitions do not alter execution,
transcripts, artifacts, or project membership. Archive hides summaries while
preserving tracking. Confirmed deletion removes captured lineage metadata.
Compaction preserves status and activation order, and cached ancestor IDs merge
into their continuation without duplicate sidebar rows.

The sidebar now has Active and Recents, a labeled 44×44 CSS-pixel settlement
button, and status-aware context-menu actions. Older Open summaries load
independently of chronological pagination. Status writes are optimistic with
rollback, pending-read protection, and profile-generation guards.

## Validation

- `npm test`: 991 passed across 36 files.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 126 passed.
- `PYTHONPATH=.hermes-source:plugin uv run pytest`: 397 passed, no skips.
- `npm run build`: passed; generated assets are excluded from the final diff.
- `vp lint`, `vp fmt`, `vp fmt --check`: passed.
- `uv sync --locked`, `uv run ruff format .`, `uv run ruff check --fix .`,
  `uv run ty check`: passed, using uv-managed Python 3.14.4 and the documented
  `.hermes-source` pin.
- `git diff --check`: passed.
- `npm run test:integration -- tests/workflows/session-tracking.spec.ts`:
  **4 passed** together across desktop and mobile (final run: 1.6 minutes).
- Six existing desktop/mobile regression checks passed: progressive streaming and
  reload persistence, authenticated file/camera uploads and composer focus, and
  completed tool disclosures with user/activity/assistant ordering.

The earlier combined 10-case run was 9/10: the mobile tracking scenario hit
native creation/readiness and reload-navigation waits. The final focused run
passes that scenario on both targets after matching the existing native-profile
80-second first-response budget and waiting for persisted messages/model
readiness before reopening navigation after reload. Initial host navigation
selector ambiguity and fractional 44-pixel bounding-box assertions were also
corrected in the tests. No runtime execution behavior was changed to satisfy
these checks. Failure diagnostics retain only whitelisted RPC method names and
reply outcomes, never raw frames, prompts or credentials.

Actual dashboard screenshots were inspected at desktop and mobile sizes,
including Active check-circle controls, Recents, drawer/footer scrolling,
composer focus, model/profile controls, attachments, and completed disclosures.
Current local screenshots are ignored artifacts under:

- `tests/visual-output/session-tracking-manual-se-e4241-reload-and-profile-switches-desktop/tracking-active.png`
- `tests/visual-output/session-tracking-manual-se-e4241-reload-and-profile-switches-mobile/tracking-active.png`
- `tests/visual-output/session-tracking-older-Ope-03e18-no-sidebar-transcript-reads-mobile/tracking-older-settled.png`

The earlier streaming/attachment/disclosure screenshots were inspected during
that run; subsequent Playwright runs replaced its output directory.

Focused tests cover idempotency and activation order, reload persistence,
profile isolation and late writes, old Open sessions beyond page one,
deduplication including cached compaction ancestors, manual rollback,
archive/delete behavior, independent branches/delegates, and touch controls.
The real-Hermes workflow uses authenticated routes and deterministic inference;
it does not replace product APIs with mocks.

## Environment and limitations

The isolated Compose project is `chathermes-issue197`, with dashboard port 19197
and MockServer port 11097. This workspace uses `DOCKER_HOST=tcp://docker:2375`.
An initial loopback-only publication prevented fixture setup; the project's
publications were explicitly rebound to the daemon's private address
`172.25.0.2`, preserving its volumes. Containers and test state are retained.
No real provider credentials were used; real-provider tests were not run.
Node.js here is 26.12.1; the guide's recommended Node.js 22 was not separately
tested. Native profile cold starts in the retained environment can exceed the
default 30-second browser expectation; the focused test uses the existing
native-profile contract's longer condition-based budget.
Android hardware/emulator and iOS Safari
are not covered by desktop Chromium or its mobile viewport/touch emulation.

The reviewed Hermes checkout is now explicitly excluded by Git and Docker;
this matches its documented development-only role and avoids bundling external
source into Docker contexts or Tailwind scanning. The root Ruff gate also sorted
three existing import groups in `tests/cron_delivery.test.py`; behavior is
unchanged. Existing App test fixtures receive empty tracking metadata where they
exercise unrelated contracts.

Tracked generated dist files were restored after successful build validation;
new chunks remain ignored. The final index and dist diff are empty. No commits,
staging, pushes, pull requests, deployments, or Hermes-core changes.

## Exact changed files

- `.dockerignore`
- `.gitignore`
- `docs/developer/api-contract.md`
- `docs/developer/architecture.md`
- `docs/internal/verification/issue-197.md`
- `docs/user/features.md`
- `plugin/chathermes/dashboard/database.py`
- `plugin/chathermes/dashboard/plugin_api.py`
- `plugin/chathermes/dashboard/session_tracking.py`
- `src/App.test.ts`
- `src/App.vue`
- `src/features/chat/runtime/native-reconnect.test.ts`
- `src/features/sessions/components/SessionSidebar.test.ts`
- `src/features/sessions/components/SessionSidebar.vue`
- `src/project-header.test.ts`
- `src/projects.test.ts`
- `src/scheduled.test.ts`
- `src/services/hermes-api.ts`
- `src/types/hermes.ts`
- `tests/artifacts.test.py`
- `tests/cron_delivery.test.py`
- `tests/plugin_api.test.py`
- `tests/session_tracking.test.py`
- `tests/workflows/session-tracking.spec.ts`
