# Desktop artifact filter verification

ChatHermes now filters inferred local artifact paths using the deliverable
extensions and tool-result rules from the pinned Hermes Desktop source
(`ac28abc96ce83f22f6b831f80d9007e2aba81f21`,
`apps/desktop/src/app/artifacts/artifact-utils.ts`). The same filter runs in the
timeline and in reconstructed global/project artifact lists.

Ordinary source-file paths such as `.py` and `.ts` stay in message text and do
not become cards. Explicit `MEDIA:` delivery and native `@file:` references can
still share source files, unknown formats, or extensionless files. Uploaded
attachments retain their cards. Pip cache/package download noise is suppressed
unless explicitly delivered. Tool inputs and generic read/search outputs are
excluded; producer names, ancestor output fields, terminal results, and browser
screenshots use Desktop's selection rules. This is a heuristic filter, so
eligible `.md`, `.json`, and `.html` modifications may still qualify.

## Validation

- `npm test`: 369 passed across 25 files, including extension conformance,
  explicit-delivery overrides, nested tool outputs, producer-name boundaries,
  package download noise, input/read isolation, Windows/network paths, and
  thumbnail request stability across equivalent props and origin changes.
- `npm run test:api`: 100 passed using the declared dependencies in the temporary
  Python test environment.
- `vp fmt`, `vp lint`, and `npm run build`: passed; dashboard assets rebuilt.
- Real-provider visual checks: desktop baseline/artifacts and mobile baseline
  passed in the final full run. Mobile artifacts passed in a focused rerun after
  correcting preview-button activation (1 passed). Inspected desktop and mobile
  screenshots of artifact lists and previews, including rendered PDF pages.

The real-provider browser test creates a Python file alongside a report and
mentions that Python path in the assistant response without delivering it. It
checks that the path remains in response text while no Python artifact card
appears in the timeline or global browser, including history reconstruction.
Existing image/text/PDF preview, download, deletion, project filtering, composer,
attachment, model selection, and activity checks run at desktop/mobile sizes.

Initial browser runs exposed an empty composer during a send-enabled assertion
and repeated image-thumbnail requests for equivalent reconstructed artifact
props. The test now refills after the response arrives, and the watcher compares individual
path/profile/session values rather than a freshly allocated array. Native preview
assertions allow 30 seconds for server retrieval. Earlier failed traces identified
the repeated thumbnail cancellations; the regression test ensures equivalent
props neither refetch nor abort an existing request.
Another mobile failure issued no text-preview request: the tap target moved as
thumbnail arrival and composer blur changed layout. The text-preview test now
activates its accessible button with Enter and checks that the dialog opens;
image/PDF preview, download, and deletion still use clicks. Testing uses mobile
Chromium emulation, not physical iOS hardware.

The launcher used port 9120 because another process occupied 9119. Only this
task's launcher-owned container is used; the process on 9119 is left untouched.
Screenshots and synthetic session state remain outside committed source.
`npm run live:stop` removed the owned container and its anonymous volume after
verification.
