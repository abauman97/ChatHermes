# Context popup and composer focus

> Historical record copied from the original dirty worktree. Results and artifact paths below describe that earlier session, not verification of this branch. The current port and its checks are recorded in `../../tmp/session-followups/verification.md` (local, ignored). PR #187 already includes the context runtime, reactive bindings, and segmented breakdown. The current port retains only distinct follow-up behavior and adapts tests to the current native gateway. Desktop controls remain visible during editing; mobile controls hide.

This change extends the supplied dirty worktree. No commit, push, or deployment was performed. `/opt/hermes` was inspected read-only.

## Reference limitation

The installed Hermes tree has no `apps/desktop` renderer. Searches of `apps/shared`, `web/src`, `assets`, `native`, and the remaining source found no Desktop popup implementation or theme definitions. The Desktop CDP endpoint at `127.0.0.1:9222` was unavailable. Consequently this is an API-based breakdown presentation, **not a verified exact match to Hermes Desktop**. Exact spacing, colors, and layout still require a Desktop checkout or reference image.

The available primary reference, `/opt/hermes/agent/context_breakdown.py`, declares the eight category IDs in display order and emits `id`, `label`, `tokens`, and a Desktop CSS color variable. It explicitly describes category counts as estimates, separate from overall occupancy. `/opt/hermes/locales/_keys.desktop.json` confirms Desktop's category labels, title, token summary, and percentage fields, but contains no rendered UI.

## Changes

- Added a compact segmented bar and matching category swatches to the existing estimated breakdown. Segment widths describe the proportion of category estimates, not the model window's fullness; the existing meter and totals retain authoritative usage values. Colors are local fallbacks, not sampled Desktop colors. Unknown categories remain visible with a neutral swatch; measured zero-token categories remain in the legend. Invalid token rows are omitted.
- Context, model, and attachment controls hide together while composing. Textarea focus dismisses context and attachment popups. A hidden context control cannot reopen its popup through a pending hover/click, and changing sessions dismisses the old popup.
- Extended composer regression tests for focus/blur while idle and sending, session changes, segment ratios, zero counts, invalid rows, and future categories. Extended the authenticated dashboard fixture with all eight categories and focus/dismiss/reopen checks on desktop and mobile.

## Validation

Logs and screenshots are local ignored artifacts in `tmp/context-popup-validation/`.

- Focused composer/controller tests: 42 passed.
- `npm test`: 32 files, 689 passed.
- `npm run test:api`: 143 passed.
- `npm run build`: passed, using `CHATHERMES_BUILD_OUT_DIR=dist/context-popup-validation` to preserve the existing dirty dashboard bundles. `npm run live` also rebuilt this separate output successfully.
- `vp lint`: passed.
- `vp fmt` applied to the three edited files; their `vp fmt --check` passed. Repository-wide `vp fmt --check` reports only the pre-existing formatting issues in `native-chat.ts` and `native-session.ts`; those files were preserved.
- `git diff --check`: passed.

Visual verification and final preservation results are recorded below after the fixture run.

## Port verification on current main

On `fix/session-context-followups`, the distinct source changes are desktop control
visibility during editing and session-change popup dismissal. The segmented
breakdown, context runtime, RPCs, stale-response guards, and reactive bindings are
already in PR #187 and were not reapplied. Tests were adapted to the current native
gateway and footer-owned shell layout. The historical results above are separate
from these current checks.

Current checks: 146 focused tests, 881 full unit tests, and 122 API tests passed.
`npm run build`, `vp lint`, `vp fmt --check`, and `git diff --check` passed. Tracked
generated dashboard assets were restored. The original worktree's dirty status
and file hashes match the initial snapshot.

Actual mounted-plugin desktop/mobile verification passed: five context/shell
cases (one additional mobile-only case skipped on desktop), four real-Hermes
tool/disclosure and authenticated file/camera cases, and separate profile/model
select checks. Screenshots were inspected. Logs and screenshot artifacts are
local and ignored under `tmp/session-followups/`, as detailed in its
`verification.md`. Mobile emulation and synthetic viewport events do not verify
real Android/iOS software-keyboard behavior. Context replies are controlled;
tool execution uses real Hermes and deterministic MockServer inference.

No commit or push was performed. The isolated Compose project
`chathermes-session-followups` remains running for inspection on ports 9141/1091.
