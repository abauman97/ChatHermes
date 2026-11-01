# Explicit MEDIA Markdown links

Worktree: `chathermes-media-regression`, starting at `e4da40a2f3`.
No commit, push, deployment, other checkout changes, or personal/provider state.

## Cause and scope

The explicit-delivery rewrite (`990237b0c9`, subsequently hardened by
`ff46ef5372`) replaced broad path/link inference with whole-line MEDIA delivery.
The current negative fixtures even classified `[Chart](MEDIA:/opt/data/chart.png)`
as quoted data. Such links reached the Markdown renderer as browser-unusable
`MEDIA:` URLs; neither the transcript nor backend index recognized the delivery.

Reviewed the three requested commits:

- `358c3336b2` protects code-example lines rather than their entire paragraph.
  It restores standalone MEDIA lines adjacent to prose, but still requires a
  bare directive to occupy a whole line.
- `d862a82c13` adds parsed Markdown **image** destinations, with source ranges
  for removing image syntax. It excludes ordinary link tokens, leaving the
  corresponding explicit link form broken.
- `3c1fd19412` serializes authenticated uploads as filename annotations plus
  standalone MEDIA references and shares the artifact parser with upload history.
  Its serialization, staging and durable image-route mapping are preserved.

The fix extends the existing Markdown image parsing to explicit local MEDIA
link destinations in both TypeScript and Python. Cards retain the existing
profile/session-authenticated preview and download routes; surrounding prose and
ordinary Markdown remain. Source ranges avoid corrupting adjacent text or
double-removing nested references. Files are deduplicated by normalized path.
Code, escaped image syntax, blockquotes, lists, HTML blocks, untrusted wrappers,
ordinary links/paths, remote MEDIA destinations and unsafe schemes remain outside
this channel. Tool bodies still require the existing successful top-level
`media_tag` envelope; links in stdout or arbitrary JSON fields confer no provenance.

## Regression evidence

Added tests before implementation: the focused frontend run failed four tests,
and Python failed three. Failures covered explicit links, inline surrounding
prose and angle-bracket spaced paths. Existing standalone-line and image tests
continued to distinguish those already-supported forms.

Shared fixtures now cover links, spaced/relative destinations, link/line
deduplication, nested explicit image/link references, rejected schemes/control
characters and quotation/tool-body boundaries. Existing frontend and Python
consumers exercise these fixtures in message extraction and persisted indexing.
Transcript component tests cover live and saved messages with both image and
link syntax, authenticated preview parameters, and ordinary HTTPS images.

## Validation

- `uv sync --locked`; reviewed source checked out locally at
  `bf0203a794a07aac3ff764972ab9087baa4e4f4e`.
- `npm test`: 1,100 passed, 37 files.
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: 127 passed.
- `PYTHONPATH=.hermes-source:plugin uv run pytest tests/artifacts.test.py -q`:
  132 passed, including the added fixtures.
- Full Python suite: 426 tests and 19 subtests passed before the final eight
  fixture additions; the focused artifact run above includes those additions.
- `npm run build` and explicit `npm run test:env:build`: passed.
- `vp lint`, `vp fmt`, `vp fmt --check`, `uv run ruff format .`,
  `uv run ruff check --fix .`, `uv run ty check`, and `git diff --check` passed.
  Ruff's unrelated baseline formatting changes were restored after running the
  required formatter. Generated tracked dist changes were likewise restored;
  new generated bundles remain ignored.

Real-Hermes deterministic project: `chathermes-media-regression`, dashboard
19340 and MockServer 19341. Final image: `01c2cad72fd0`.
`tests/workflows/media-links.spec.ts` passes at desktop and iPhone 13 viewport
sizes. It checks native membership/resume and reload, upload deduplication,
surrounding prose, ordinary links, preview contents, exact download contents,
profile/session URL scope, anonymous denial, composer focus/16px input and
horizontal overflow. Existing progressive-streaming and real terminal-tool
workflows also passed at both sizes (six workflow tests total), including
sent-message/activity/response order, completed disclosures and persistence.

The existing `tests/visual/image-preview-live.spec.ts` also passed all eight
desktop/mobile cases: legacy/MEDIA annotations, text/multipart history, initial
resume/reload, authenticated image/file previews and byte/name-correct downloads.
Screenshots of MEDIA cards and upload image/viewer layouts were visually inspected
at both sizes. Local ignored evidence is under `tests/visual-output/`:

- `media-regression-workflow/media-links-*/media-links-{resume,reload}.png`
- `media-regression-workflow/messaging-*/{stream-completed,tool-completed}.png`
- `image-preview-live-persist-17503-ws-and-downloads-in-default-{desktop,mobile}/reload-{inline,viewer}.png`

Workflow screenshots were regenerated into a separate output directory after
the upload suite cleared Playwright's default output directory. The six workflow
tests passed again against the same final image.

## Limits and debugging observations

No real provider, physical camera, Android/OS keyboard or named-profile browser
scenario was exercised. Profile isolation, authentication, native upload
preparation and delivery security are covered by API tests. The MEDIA-link
browser regression seeds real SessionDB history and exercises native resume;
live MEDIA parsing is covered by transcript component tests. The separate
streaming/tool browser workflows use real native execution and repository
MockServer inference fixtures.

One early Python artifact run hit the existing concurrent SQLite WAL-setup lock;
the subsequent full and focused runs passed. Initial browser setup failed before
opening the app because Playwright's expected Chromium was absent. Tests use the
documented `CHATHERMES_CHROMIUM` override with the installed Chromium 1208 binary.
Containers and synthetic state are retained for debugging. No automatic cleanup
or state reset was performed. Existing indexed sessions pick up newly recognized
links through the indexer's existing dirty/reconciliation audit mechanism.
