# Compact artifact cards

Artifact browser cards now contain the Uploaded/Generated method, session
navigation, project label when available, and delete action inside their border.
A footer slot keeps these browser controls separate from timeline card content.
The browser uses a wrapping grid with columns capped at 20rem and a wider 1100px
content area. Cards keep their natural height and fit within narrow viewports.

## Validation

- `vp fmt` on changed source/test files and `vp lint`: passed.
- `npm test`: 369 passed across 25 files.
- `npm run test:api`: 100 passed using `/tmp/chathermes-api-venv`.
  The sandboxed run stalled on file serving; the unsandboxed run passed.
- `npm run build`: passed; dashboard distribution rebuilt and included.
- Isolated real-provider dashboard launched with `npm run live` on port 9120.
  Artifact browser tests passed on desktop and mobile, including text/image/PDF
  previews, download, deletion confirmation/cancellation, history reconstruction,
  and project filtering. New assertions verify method/session/delete controls
  inside cards, multiple cards per desktop row, a single mobile column, capped
  card width, and no horizontal overflow.
- Inspected desktop/mobile artifact browser screenshots, the desktop PDF
  preview, and the mobile completed activity/composer screenshot. Desktop showed
  three columns; mobile showed one with truncated session titles.
- The mobile broader smoke test passed composer focus and scrolling,
  attachments, profile/model selects, and disclosure transitions. The desktop
  smoke test failed when a completed terminal disclosure stayed hidden after
  activation. A focused rerun could not reach the dashboard (connection refused),
  so desktop disclosure verification remains incomplete. Artifact tests passed
  before that loss of connectivity. No disclosure code changed in this task.
- Used installed Chromium via `CHATHERMES_CHROMIUM` because Playwright's expected
  browser revision was unavailable. Mobile checks used Chromium device emulation,
  not physical iOS hardware.
- `npm run live:stop` completed after verification. Screenshots and synthetic
  session data are not included in committed source.

Unrelated formatter newline changes were restored only after confirming each
file's Git content hash matched HEAD. No commit was made.
