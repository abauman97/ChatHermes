Issue #152 implementation verification

Implementation branch: `feat/issue-152-main-port`, based on `dfac130a5b90492def30361cc406d94d7e368385`.

Completed assistant responses expose Copy and Branch in new chat actions. Copy writes the response to the clipboard and reports success or failure. Branching resolves the selected durable assistant response against saved display history and asks Hermes to create the child from authoritative history; the client cannot supply a transcript, workspace, or project assignment. Profile membership is checked before resume/branch. The branch retains parent profile and project context; parent history remains unchanged. Saved-response IDs are attached only when the ordered displayed prose projection matches the authoritative history.

Validation reported on the latest-main worktree:

- `npm test`: 792 passed.
- `npm run test:api`: 98 passed, 6 skipped.
- `npm run build`, `vp lint`, `vp fmt --check`, and `git diff --check`: passed.

Live visual verification: `tests/visual/response-actions-live.spec.ts` passed all 4 desktop/mobile browser tests on a fresh isolated fixture. The prior login page was an old fixture on port 9119; the fresh task fixture mounted the plugin. Desktop/mobile screenshots were reviewed, showing the authenticated chat and copy/branch controls. Mobile used Chromium viewport emulation rather than a physical device. Earlier recorded real-provider flows exercised clipboard copy, branch requests, attachment context, parent immutability, and project membership. Do not interpret the test suite as physical-device verification.

The three API tests dependent on a secondary-host module were skipped in the prior verification run; they are a coverage limitation. Generated `dist` assets are ignored and excluded from the change. No deployment was performed.
