# Context suppression and Markdown authority — 2026-11-18

## Finding and implementation

Fresh P2 review found that `!` + an exact producer memory note +
`[pixel](https://attacker.invalid/track.png)` became an automatic Markdown image
request after note deletion. The original Markdown renders literal `!`, the note,
and a link. The artifact classifier's original-source guard did not protect the
separate Markdown renderer.

Context-bearing messages now carry original Markdown source, hidden source ranges
and original-coordinate card placements separately from their plain-text/copy
projection. Markdown parses the original bytes completely before suppressing
finished tokens. Hidden reference definitions are excluded before inline reference
resolution. Hidden destinations discard their link/image authority rather than
creating a new destination. Generated context code blocks are also suppressed.
No separator or marker is inserted into the Markdown grammar. Legitimate inline
and reference images and accepted attachments remain available. The ordinary
rendering path without hidden context retains its existing behavior.
Atomic image syntax overlapping a hidden range is conservatively discarded;
links with hidden syntax retain surviving label text without a destination.

Assistant live/history blocks, user uploads and the legacy draft fallback all
use this source-preserving path. Runtime blocks, session data, copy projection,
backend artifact eligibility and profile/session authorization remain unchanged.
The original-line delivery check still governs card acceptance; original source
coordinates are used for rendering. A separate positive regression covers an
automatic delivery repeated as explicit delivery beside a hidden note, preserving
the existing single-card behavior when the final delivery mode changes.

## Regression evidence

- `tmp/markdown-authority-red.log`: unit regression demonstrates the manufactured
  `<img>` before the fix.
- `tmp/markdown-authority-mounted-red.log`: corrected mounted `ChatTranscript`
  reproductions fail for both exact producer notes before renderer integration.
- Mounted regressions cover saved history, active blocks, character-by-character
  native deltas, draft fallback, uploaded user text, unchanged source, legitimate
  images, hidden generated code/references and mixed attachment delivery.
- Unit regressions cover the exact image repro, destinations, reference
  definitions, escape/emphasis semantics and legitimate inline/reference images.
- `tmp/markdown-authority-duplicate-red.log` records the additional duplicate
  automatic/explicit delivery regression; the final focused run passes 163 cases
  (`tmp/markdown-authority-focused-final.log`).
- An additional positive placement control confirms visible prose stays after
  a card when hidden context occupies its preceding token
  (`tmp/markdown-authority-placement-control.log`).

## Browser environment and limitations

Reused only the retained deterministic Compose project
`chathermes-attachment-context-20261118`, ports 24719/24780 and
`tmp/attachment-compose.yml`. Builds use `npm run test:env:build`, followed by
explicit Compose application without deleting volumes. Runner access uses the
existing private `tmp/attachment-forward.mjs` relay. The Hermes source remains
pinned at `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`.

The first browser attempt used an SSE fixture whose response string encoding
changed the current producer note's em dash to `?`. Exact-note suppression
correctly declined that edited note, causing the no-note-text assertion to fail.
Both viewports recorded this fixture issue in `tmp/markdown-authority-integration.log`.
The fixture now emits non-ASCII JSON characters as Unicode escapes, preserving
exact producer bytes without broadening the accepted note grammar. That attempt
is intermediate evidence, not final-image verification.

The new workflow uses real authenticated Hermes inference and raw multipart
history. It asserts no attacker-origin requests (including transient image
requests), preserves two ordinary pixel links and one legitimate data image,
and checks composer focus and horizontal bounds through live completion, reload,
raw history resume and history reload. The outbound attacker route is aborted
as a test safeguard; attempted requests are still counted and fail the test.
No Hermes APIs are mocked. Coverage is Chromium desktop/mobile viewports, not
native Android, Electron or real-provider inference.

## Final validation

- `vp fmt` and `vp lint`: passed; generated dist excluded. A fixture-only lint
  warning about a control-character regex was resolved by explicit JSON code-unit
  escaping without changing the fixture payload.
- `npm test`: **1,924 passed**, 58 files, including the final placement control
  (`tmp/markdown-authority-test-final-complete.log`).
- `PYTHONPATH=.hermes-source:plugin npm run test:api`: **182 passed**
  (`tmp/markdown-authority-api.log`). No Python implementation changed in this follow-up.
- `npm run test:env:build`, including `npm run build`: passed
  (`tmp/markdown-authority-env-build-final.log`). Explicit Compose application:
  `tmp/markdown-authority-compose-final.log`.

Final image: `sha256:5deb28932eecb326c640b8031ac76aed3944726f7e94afc1eb495113bc803862`.
Local and container entrypoint/app chunk hashes match
(`tmp/markdown-authority-build-hashes.txt`,
`tmp/markdown-authority-container-hashes.txt`). Tracked dist files were clean at
the start and restored after this comparison; new generated chunks remain ignored.
The staging area and reviewed Hermes checkout remain clean.

The final selected browser run passed **6/6 cases** in 1.7 minutes
(`tmp/markdown-authority-integration-final.log`): the new Markdown authority
workflow, native memory streaming and the previous exact attachment-authority
workflow, each at desktop and mobile sizes. After the fixture-only lint cleanup,
the new workflow passed again on both viewports, **2/2 cases** in 22.7 seconds
(`tmp/markdown-authority-integration-reviewed.log`). Both runs used the final image
above. No attacker-origin requests occurred; legitimate image elements, links,
downloaded attachment bytes and session-scoped Library entries remained intact.

Visually inspected the new live/history/reload captures at desktop and mobile
sizes, the earlier authority case's desktop transcript and Library, and mobile
memory completion. Captures remain under
`tests/visual-output/markdown-authority-final/` and
`tests/visual-output/markdown-authority-reviewed/`. The one-pixel legitimate image
control is intentionally tiny; the DOM assertions establish its retained image
element. The desktop live capture is scrolled and clips the host header; the
history/reload captures show the full layout. The tests check composer focus,
scrolling to the response and horizontal bounds. This is the selected suite,
not the full workflow suite or a new native-device/select/tool-disclosure audit.

No commits, staging, deployment, upstream source changes, destructive cleanup or
real-provider requests were performed. Existing work and synthetic fixture state
are retained. Generated dist files are never staged or included in source changes.
