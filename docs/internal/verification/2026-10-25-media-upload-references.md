# Uploaded MEDIA references

Work performed in `fix/persisted-chat-image-preview`, starting at `a8fc3f3894`.
The initial diff already contained the multipart image-route fix, its tests,
Playwright selection changes, a rewritten live image test, an image fixture, and
`2026-10-25-persisted-image-preview.md`. Those changes were preserved.

## History and implementation

- `a82605ede1` (issue #35) introduced shared artifact cards and native file
  preview/download, verified profile-local uploads, and native file staging.
- `fc25683829` aligned inferred artifact selection with Desktop. Its heuristics
  were subsequently superseded by explicit delivery in `990237b0c9`.
- `ff46ef5372` hardened explicit delivery against fenced/quoted examples,
  untrusted tool content, and nested/arbitrary tool output fields. These parser
  and tool-envelope rules remain unchanged.

Each newly submitted upload now includes `MEDIA:"<server upload path>"` in both
its immediate staged preview and its submitted native content. The existing
`Attached image/file <name>: <path>` annotation remains as filename metadata and
the validated native preparation contract. The shared parser deduplicates these
references into one card. Legacy annotation-only histories continue to work.
`uploadedArtifacts` delegates to the established artifact parser instead of its
separate regex extraction. User text, transcript cards, and global/project
artifact history now use the same delivery boundaries. Ordinary paths, links,
quoted examples and tool bodies do not acquire artifact provenance.

File picker and camera both call `attach` → `stageFiles`; dropped files call
`stageFiles` directly. That method uploads through the authenticated profile API,
then the controller serializes the references for every attachment. Fallback
uploads in the controller use the same serialization. Profile/session generation
guards, cancellation, image content parts and model submission remain intact.
This checkout has no clipboard-file paste handler; pasted text goes through
normal text parsing, and pasted delivery examples obey the same safety rules.

Native preparation still verifies inline images against durable profile-local
upload bytes and checks non-image paths before native `file.attach` supplies
`@file` runtime context. A standalone MEDIA line does not authorize file staging.
No server routes or validation were changed. The existing image mapping fix
resolves durable uploads for both REST text history and native multipart
snapshots. Image cards/view/download retain authenticated `/images/<id>` URLs
with profile scoping. Other files and generated artifacts retain native
`/files/preview` and `/files/download`, including session and filename parameters.

## Results

- Tests were added before implementation. The focused run failed **8 tests**
  (140 passed): missing submission MEDIA, ignored MEDIA history, and unsafe
  quoted user-annotation extraction. After implementation: **148 passed**.
- `npm test`: **785 passed**, 32 files.
- `npm run test:api`: **100 passed**, with activated `.venv`, development extra
  installed via `pip install -e 'plugin/chathermes[dev]'`, and
  `PYTHONPATH=/opt/hermes:plugin`. This includes native staging contract,
  cross-profile delivery, MIME and symlink rejection, and generic file handlers.
- `npm run build`: passed using the historical alternate output path
  `tests/media-upload-dist`.
  The validated output was used by Docker and then moved to ignored
  `tmp/media-upload/validated-build`. Tracked dist assets were untouched.
- `vp lint`, `vp fmt`, `vp fmt --check`, and `git diff --check`: passed.
- Actual dashboard Playwright: **8 passed**, desktop 1280×720 and mobile iPhone 13,
  legacy/MEDIA × text/multipart histories. Each test checks initial native resume
  and full reload, image source and dimensions, viewer open/close, exact downloaded
  image bytes/name, authenticated MIME/content and anonymous denial, composer
  focus/16px text, and horizontal overflow. MEDIA cases also preview and download
  an uploaded text file through the generic native file routes and assert one
  card with the original filename and no visible MEDIA directive.

The first browser run had 7 passes and one transient null bounding-box read while
native history replaced a DOM node. The layout assertion now polls the replacement
node; the complete rerun passed. This changed only test synchronization.

Screenshots under ignored `tests/visual-output/` were visually inspected for
image cards, the separate text card, and viewer controls at desktop/mobile sizes.
Reload evidence for the MEDIA cases includes:

- `image-preview-live-persist-17503-ws-and-downloads-in-default-desktop/reload-inline.png`
- `image-preview-live-persist-17503-ws-and-downloads-in-default-desktop/reload-viewer.png`
- `image-preview-live-persist-17503-ws-and-downloads-in-default-mobile/reload-inline.png`
- `image-preview-live-persist-17503-ws-and-downloads-in-default-mobile/reload-viewer.png`

## Limits and retained fixture

Used `tests/docker/Dockerfile` and `npm run live` with an unreachable synthetic
provider, then seeded synthetic SessionDB history. No real-provider prompt,
physical camera capture, clipboard image ingestion, real-device keyboard,
network-loss reconnect, or live thinking/tool transition was exercised. Native
snapshots and reload were exercised; reconnect/state-isolation unit tests passed.
Named-profile browser coverage was not run; profile boundaries were checked by
API tests. The existing evidence document records earlier host limitations.

Both task-owned disposable fixtures were stopped after testing. Other running
containers were left alone. No deployment or changes to the separate primary
checkout were performed.
