# Single-pill model picker verification

Validated the rebuilt plugin inside the authenticated Hermes React dashboard at
390 × 844 and 1280 × 900 in Chromium on 2026-10-01. Inspected screenshots of the
provider list, model list, scrolled model list, truncated long pill label,
attachment previews, active thinking, and completed disclosures.

Browser checks covered keyboard opening, focus inside the panel, back navigation,
Escape and outside-click dismissal, focus restoration, the current-provider tag,
a configured default absent from the provider catalog, selection of `Instant`,
scrolling through 31 models, composer focus during sending, file and simulated
camera attachments, profile selection, and completed disclosure re-expansion.
The route turn included `model: "Instant"`, `require_model_lock: true`, no provider,
and the attached image content part. No browser page errors occurred.

The browser check exposed a provider-row click being mistaken for an outside
click after Vue replaced the row. Outside-click handling now uses the original
event path; the mobile and desktop browser checks passed after this correction.

Validation commands passed: `npm test` (36 tests),
`. .venv/bin/activate && npm run test:api` (16 tests), `npm run build`, and
`git diff --check`. Rebuilt dashboard assets are included.

## Limitations

Docker's socket was unavailable, so the compose environment and the full live
`tests/visual/dashboard.spec.ts` suite could not run here. Visual verification used
the existing isolated dashboard at port 9120 with rebuilt plugin assets and
browser fixtures for inventory and turn APIs; its gateway was unreachable. This
verified the actual plugin mount and rendered UI, but did not exercise live
provider calls, progressive gateway streaming, physical camera capture, or an
actual iOS keyboard. Screenshots remain in the ignored
`tests/visual-output/picker-review/` directory.

The existing pinned catalog logic is preserved: backing catalog roots have
`parent: null`, while selectable routes such as `Instant` are their child entries.
App inventory loading, stale-profile guards, and stream request wiring are unchanged.
