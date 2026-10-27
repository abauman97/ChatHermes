# Persisted image preview regression (#169)

Started on `fix/persisted-chat-image-preview` at
`a8fc3f3894a6c912ea8920fec79860c6864a875a`, with a clean status/diff. Reproduced
visually before changing application code in a fresh launcher-owned fixture
built from this checkout with `tests/docker/Dockerfile` and `npm run live`.
Existing fixtures on ports 9119 and 9127 were left intact.

## Cause and history

Before artifact/native file integration (`a82605ede1^`), `UserMessage.vue` called
`images()` in `user-message.ts`, which fell back to durable upload annotations
for either string or multipart content. The artifact renderer subsequently used
native `fs_read_data_url` / `fs_download` through the generic file routes.
`5b1ec88510` added dedicated upload-image mapping, and `49709d0292` added direct
binary-image rendering, but the mapping remained in an `else if` after the
multipart branch.

On the starting HEAD, a real uploaded 240×160 PNG referenced by the historical
`/uploads/chathermes/<id>.png` annotation initially loaded from the authenticated
`/images/<id>` route (HTTP 200). After native resume replaced the REST rows with
multipart history, the card switched to `/files/preview` with the historical
filesystem path (HTTP 403). The visible image disappeared into a generic file
card, and download targeted the same invalid filesystem path. Current absolute
upload paths did render through the generic route in this fixture; the failure
is specifically demonstrated with the historical path and multipart resume.

`messageArtifacts()` now resolves durable user uploads independently of content
shape. Inline image data still supplies the immediate thumbnail; the viewer and
download retain the authenticated, profile-scoped image URL. No route,
authentication, gateway, or provider behavior changed.

## Verification

- Two added unit cases failed before the fix and pass afterward: multipart
  history with and without inline image data, including the download URL/profile.
- `npm test`: **760 passed**, 32 files.
- `npm run test:api`: **99 passed**, with the project virtualenv, development
  extra, runtime test dependencies, and `PYTHONPATH=/opt/hermes:plugin`.
- `npm run build`: passed. Final fixture build used the historical alternate output path
  `tests/image-preview-169-dist`; its output was moved
  into ignored `tmp/image-preview-169/validated-build` after Docker built the
  image. Initial validation-generated changes to tracked dist files were
  restored to their starting bytes. No generated assets remain in the diff.
- `vp lint`, `vp fmt --check`, `git diff --check`: passed.
- Authenticated Playwright: **4 passed** (desktop 1280×720 and mobile iPhone 13
  390×664 CSS viewport; text and multipart histories). Each case tests initial
  load and full reload, waits for the actual native snapshot, verifies a 240×160
  image rendered at least 120×80, opens/closes the viewer, downloads through the
  browser and compares exact bytes and filename, verifies authenticated image
  HTTP 200/MIME/bytes and anonymous denial, and checks composer focus/font size
  and no horizontal overflow.
- The old 1×1 base64 fixture is replaced by
  `tests/visual/fixtures/upload-colors.png`, a 240×160 red/blue/yellow/green PNG.
  The test seeds actual SessionDB rows in the explicitly named disposable
  container; history, capabilities, images and gateway responses are not mocked.

Run the image suite against a fresh fixture with:

```sh
CHATHERMES_TEST_CONTAINER=chathermes-image-preview-169-hermes \
CHATHERMES_TEST_URL=http://docker:9139 \
npm run test:visual -- image-preview-live.spec.ts
```

Use the URL printed by the launcher for the local Docker setup. The fixture name
is explicit because these tests seed synthetic history in that container.
`CHATHERMES_IMAGE_TEST_PROFILES=default,alpha` optionally exercises named profiles.

## Screenshot evidence and limits

Separate viewer-closed and viewer-open screenshots were captured and inspected
with vision on both devices after full reload. All four quadrants are visible
inline and in the modal, and the modal's close/download controls fit on mobile.
Local evidence paths recorded by the original author (ignored and unavailable in this documentation checkout; paths are relative to the repository root):

- Before desktop (`tmp/image-preview-169/evidence/before-desktop.png`) and
  before mobile (`tmp/image-preview-169/evidence/before-mobile.png`).
- Desktop inline (`tmp/image-preview-169/evidence/desktop-inline.png`) and
  desktop viewer (`tmp/image-preview-169/evidence/desktop-viewer.png`).
- Mobile inline (`tmp/image-preview-169/evidence/mobile-inline.png`) and
  mobile viewer (`tmp/image-preview-169/evidence/mobile-viewer.png`).

No real-provider send was performed. The fixture used an intentionally
unreachable synthetic provider; persisted rows were seeded instead. Live send,
cancellation, arriving tool/thinking transitions, and real-device keyboard
behavior were not verified in this run.

An additional named-profile attempt was blocked by the latest official image:
the `alpha` secondary plugin host exited with code 1 (`plugin_host_child` channel
closed), causing HTTP 502 for uploads and image requests. This also prevented a
browser-level negative cross-profile image assertion. The required desktop and
mobile default-profile tests passed; existing API profile-boundary tests and
unit URL scoping checks passed. No host workaround was applied.

The task-owned fixture was stopped with `CHATHERMES_INSTANCE=image-preview-169
npm run live:stop`. No deployment, commit, staging, push, PR update, or additional
worktree was performed.
