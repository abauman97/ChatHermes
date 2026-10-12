# Artifact delivery parser boundaries

Artifact cards require an explicit delivery channel. Assistant `MEDIA:` directives
must occupy an entire top-level paragraph line; the path may be quoted, and a
line may contain multiple directives. Surrounding prose, inline examples,
quoted markers, blockquotes, lists, indented code, backtick/tilde fences (including
incomplete fences), HTML blocks, and untrusted-result bodies stay visible as
content. `NOTMEDIA:` is not a directive. Existing standalone attachment
annotations and uploaded file/image cards remain supported.

Tool output is data unless a delivery envelope supplies a top-level `media_tag`
or explicit `_multimodal` `meta.media_tag`. Those fields accept only complete
MEDIA directive lines and the native optional `[[audio_as_voice]]` prefix.
Metadata remains attached to the delivered files. Tool inputs, echoed arguments,
`stdout`/`output`/`content`, nested result bodies, and untrusted wrappers do not
establish delivery. Raw tool text containing only a MEDIA marker also requires
assistant delivery or producer delivery metadata; text alone cannot distinguish
an intentional delivery from a file read or command echo. Failed and incomplete
tools cannot supply cards.

Source inspection used Hermes commit
`ac28abc96ce83f22f6b831f80d9007e2aba81f21`:

- `tools/file_tools.py` puts fetched file text in `content`; that string has no
  delivery provenance.
- `agent/tool_dispatch_helpers.py` wraps external tool results in
  `untrusted_tool_result` and labels their bodies as data. The parser no longer
  removes that boundary to search the body.
- `tools/tts_tool.py` produces an explicit top-level `media_tag`, including the
  optional voice prefix and multiple output paths.

Attachment annotations originate in `useChatController.ts` after authenticated
upload. `native_channel.py` verifies those user upload references before native
submission. Tool bodies can echo the same words but do not thereby become user
upload records. The shared tool parser excludes those bodies from transcript
cards and reconstructed global/project lists.

Regression fixtures cover the observed bypass classes at parser, transcript
rendering, and global history-list seams. The initial regression run against the
old implementation failed 78 tests; the tests assert both absence of cards and
preservation of inspectable content. Positive coverage retains assistant delivery,
quoted paths, unknown/source formats, native image parts, uploads, producer
metadata, deduplication, and failed/incomplete gates.

Validation: 149 targeted artifact/chat tests and the full 622-test suite pass;
103 Python API tests pass. `npx vp fmt --check`, `npx vp lint`, `npm run build`,
and `git diff --check` pass. All six live dashboard tests pass (three scenarios
at desktop and mobile sizes), including attachment delivery and composer, native
artifact preview/download/history reconstruction, and chronological activity.
Playwright screenshot evidence is saved in `tests/visual-output/` for local review; the
visual tests used the isolated fixture dashboard, not production data.

## Source-only PR scope correction

Revalidated PR #124 from cleanup commit
`38fbea2d75736805f0e79f782858eb4cc1c54d5e` against fetched main
`92d654d2420ac038bba6e652ec143bf16f8cb316`, which remains the branch base.
Parser source, tests, and the API contract are preserved. Restored the 12 unrelated
historical verification notes and the historical plugin implementation plan to
main. Dist guidance changes remain limited to AGENTS.md, README.md, architecture,
and the future gateway plan's explicit instructions to commit generated assets.

`npm test` (622 tests), `npm run test:api` (103 tests), `npx vp fmt --check`,
`npx vp lint`, `npm run build`, and `git diff --check origin/main` passed.
After building, restored dashboard dist output to main's exact baseline and
removed only extra ignored build files. The PR diff contains no dist paths;
`.gitignore` is unchanged and its existing dist ignore rule still matches.
Main's historically tracked dist baseline is preserved without staging build
output.

No UI source changed in this correction. Reviewed the existing passing live
visual-test record and actual dashboard screenshots at desktop/mobile sizes for
composer focus/scrolling, attachments, profile/model selects, artifact cards,
and active/completed/history disclosures. The live fixture was not rerun for
this documentation correction. No deployment, merge, amendment, force push,
`.env` inspection, or original-checkout inspection was performed.
