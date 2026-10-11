# Issue 35 artifact verification

Implemented inline uploaded/generated artifact cards, authenticated native file
preview/download/deletion adapters, shared global/project artifact views, and
picker/drop staging through the existing composer and native runtime. Vivid file
icons are vendored with their MIT license. The plugin dashboard distribution was
rebuilt. No commit or publication was performed.

## Automated validation

- `npm test`: 361 tests passed across 24 files.
- `npm run test:api`: 100 tests passed with the declared Python dependencies in
  `/tmp/chathermes-issue35-venv`.
- `vp lint`, targeted `vp fmt`, and `npm run build`: passed.
- `npm run test:visual`: 4 passed. Real-provider desktop and mobile checks cover
  composer focus/scrolling, model selection, camera/file staging, drop on the
  header, activity transitions, artifact preview/download, history restoration,
  global/project filtering, and cancel/confirm deletion with a subsequent 404.

## Live visual verification

Used `tests/docker/Dockerfile` and `npm run live` against the official Hermes
image, in one launcher-owned disposable container with synthetic dashboard
credentials. The root `.env` supplied provider configuration server-side.
`npm run live:stop` removed the owned container and its anonymous volume after
verification.
Chromium required execution outside the filesystem sandbox; the user approved
the final browser checks. Screenshots are in ignored `tests/visual-output/`.
Inspected desktop and mobile screenshots of the composer, timeline, text/image/
PDF previews, artifact list, and project filter. PDF screenshots include the
rendered page. A supplemental overlapping rerun was interrupted after it removed
the previous run's trace files; the final suite ran serially and passed all four
cases.

The real agent created a text artifact using its terminal tool. Valid synthetic
PNG and PDF fixtures were uploaded through authenticated routes and then copied
by the real agent to generated output paths. This verifies server file delivery,
not a separate image-generation provider. Screenshot inspection caught Chromium
blocking PDF content in a sandboxed iframe; the fix checks the PDF signature and
forces the blob MIME to `application/pdf` before opening the native browser
viewer. HTML and SVG continue to render as escaped source text.

## Limits

Native hosted-file guards, filesystem policy, and preview size limits still
apply. SSH-backed preview/download use Hermes's native adapter; SSH deletion is
explicitly unavailable because Hermes's managed deletion handler is host-local.
Browser PDF/audio/video support varies by browser. Deleted files retain their
historical references and show an unavailable response when accessed again.
