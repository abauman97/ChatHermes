# Attachment truncation and recovered-reference Markdown review — 2026-11-18

Two independent findings reproduced as six failing tests in
`tmp/attachment-grammar-red.log`: projection and actual `UserMessage` component
tests for each truncation marker and the recovered-reference case.

The first exact source is a backtick, newline,
`![pixel](https://attacker.invalid/x)`, newline, `--- Attached Context ---`,
newline, then `end` and the closing backtick. The same case is tested with
`--- Context Warnings ---`. Truncating before Markdown parsing previously
activated an image. The second exact source is `Ask`, a blank line, the attachment
marker, a blank line, then a `text` fence containing
`@file:![pixel](https://attacker.invalid/x)`. Recovering that reference and
prepending it to Markdown previously activated an image too.

Attachment/warning truncation now requests the original-source Markdown
projection even without recalled memory. Original code tokens retain only their
visible content, with source coordinates accounting for backtick delimiters,
normalized newlines and code-span padding. Recovered refs travel separately and
Vue renders them with `v-text`, outside the Markdown parser. Original messages,
model input, reference recovery text and upload authority remain unchanged.

The component and projection regressions preserve the literal syntax and reject
image/link elements. Additional tests cover LF/CRLF, multiple backticks, Unicode,
padding, legitimate Markdown links/images, recovered tool/URL references and
deduplicated upload cards. Focused final run: **145 passed**
(`tmp/attachment-grammar-focused-reviewed.log`).

Checks completed successfully:

- `vp fmt` and `vp lint` (`tmp/attachment-grammar-lint-reviewed.log`).
- `npm test`: **1,933 passed**, 58 files
  (`tmp/attachment-grammar-test-final.log`). The subsequent nested Markdown CSS
  class adjustment also passed the 145 focused tests and the mounted browser run.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**
  (`tmp/attachment-grammar-api.log`). No Python implementation changed here.
- `npm run test:env:build`, including `npm run build`: passed
  (`tmp/attachment-grammar-build-final.log`).
- `git diff --check`: passed.

The retained deterministic Compose project is
`chathermes-attachment-context-20261118`, ports 24719/24780, using
`tmp/attachment-compose.yml` for its private subnet. The final image is
`sha256:19af5b19d2c3e4d0ecb9cf8fab90e043d8f8e2efb9f45ec84641e2cf8d70b492`.
Local/container plugin entrypoint SHA-256 values match
(`tmp/attachment-grammar-local-hash.txt`,
`tmp/attachment-grammar-container-hash.txt`). The pinned Hermes source remains
clean at `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`.

The initial integration attempt failed before browser launch at MockServer
readiness because it selected the remote Docker host's inaccessible loopback
publication (`tmp/attachment-grammar-browser.log`). The retry explicitly selects
the existing private task relay using `CHATHERMES_DASHBOARD_URL_HOST=127.0.0.1`.
Containers and state were retained; no reset or cleanup occurred.

Final browser evidence is recorded in `tmp/attachment-grammar-browser-final.log`
and `tests/visual-output/attachment-grammar-final/`. The new case seeds exact raw
user messages in real Hermes history and verifies resume and reload in the
authenticated React-mounted plugin. It counts attempted attacker-origin requests
while aborting them as a test safeguard; legitimate retained image/link/tool
references and a session-scoped download with profile isolation are controls.

Final result: **14/14 browser cases passed in 2.1 minutes**, covering both
attachment-context and Markdown-context workflows at desktop/mobile sizes.
Both exact new regressions made **zero attacker-origin requests** across resume
and reload. Legitimate images, links, recovered tool references, upload cards and
download bytes survived, and foreign-profile downloads returned 404. The PDF
cases also passed composer focus during work, scrolling/horizontal bounds,
model/reasoning controls and completed disclosure expand/collapse assertions.
Visually inspected exact-repro reload screenshots at both sizes, PDF resumed
screenshots at both sizes, and desktop active work. The active-work desktop
capture is scrolled and clips the host header; it is not a full-page layout audit.
This is Chromium viewport coverage, not native Android/iOS, Electron,
real-provider testing or the complete workflow suite.

No staging, commits, deployment, pushes, upstream source edits, real-provider
requests or destructive resets occurred. Prior work remains intact. Initially
clean tracked dist files were restored after build/hash verification, and new
generated chunks remain ignored.
