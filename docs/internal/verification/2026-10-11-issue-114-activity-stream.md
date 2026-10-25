# Issue 114 activity streaming verification

The assistant view renders the reducer's ordered blocks directly. Only adjacent
ordinary tools share a run; text, reasoning, delegated tasks, and card tools break
runs. Reasoning uses its own disclosure. Active disclosures expand, untouched
completed disclosures collapse, and explicit user choices survive updates and
completion. Failed, interrupted, and missing-result rows stay visible outside a
collapsed run. Delivered artifact cards remain at their tool's position and stay
visible when tool details collapse. The existing live request component has one
host outside tool groups in the current turn; no request controls are duplicated.

The runtime retains call IDs, text phases, history reconciliation, and event
replay ownership. Ending a turn seals unfinished ordinary tools as unknown, or
interrupted for cancelled/interrupted outcomes, without manufacturing a result.
Late results can still settle those calls. Structured and serialized result errors
are detected, including `is_error`, `error`, `success: false`, and nonzero exit codes.
Delegated tasks can keep running after their parent completes. Reasoning snapshots
update sealed content without restarting its activity or timer. Historical event
replay does not fabricate thinking durations from replay processing time. Restored calls
without results do not make a completed historical conversation appear busy.

Desktop references inspected from NousResearch/hermes-agent's default branch:

- [Message parts and ThinkingDisclosure](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/assistant-ui/thread/message-parts.tsx)
- [Generic tool fallback and ToolGroupSlot](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/assistant-ui/tool/fallback.tsx)
- [Tool group tests](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/assistant-ui/tool/tool-group.test.tsx)
- [Tool message parts](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/lib/chat-messages/tool-parts.ts)
- [Response grouping](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/assistant-ui/thread/response-group.tsx)
- [Timeline](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/assistant-ui/thread/timeline.tsx)

ChatHermes keeps its Vue components, authenticated routes, and
pinned gateway contract. It does not import Desktop's React UI, preferences, or
session stores. Completed reasoning collapses by default to follow this
repository's conventions; manually expanded reasoning remains open.

## Validation

- `npm test -- --maxWorkers=2`: 391 passed across 27 files. Covers chronological
  rendering, adjacent runs, card boundaries, independently streamed reasoning,
  incremental tool output, error payloads, unfinished/cancelled tools, late results,
  replay/history reconciliation, manual disclosures, preview scrolling, and
  artifacts outside collapsed tool details. Existing session/reconnection and
  approval/clarification tests pass.
- `npm run test:api`: 100 passed with the existing temporary Python test environment.
- `vp lint`: passed. `vp fmt` and formatting checks passed for changed files.
  A repository-wide formatting check reports pre-existing issues in 99 untouched
  files; those files were left unchanged.
- `npm run build`: passed, including type checking and regenerated dashboard assets.
  During this task, a concurrent repository commit stopped tracking `dist`; the
  final rebuilt bundles remain generated/ignored as intended by that commit.
- Existing real-provider dashboard/composer and artifact browser checks: four
  passed, covering desktop and mobile. Focused chronological activity checks:
  two passed (desktop/mobile) in the final focused runs. The long command exposes an
  active tool, manual row/group toggles survive completion, text stays on either
  side of tool activity, scrolling upward is preserved during disclosure changes,
  and reload reconstructs the same tool count from persisted call identities.
  Inspected desktop/mobile screenshots of live activity, completion, restored
  history, attachments, selects, and the focused short-viewport composer.

The disposable real-provider container uses `tests/docker/Dockerfile` and
`npm run live`, with repository dotenv settings kept private. Chromium must run
outside this environment's sandbox. The cached Chromium executable is supplied
through `CHATHERMES_CHROMIUM` because the installed Playwright version expects a
newer browser download. Mobile verification uses iPhone 13 Chromium emulation,
not a physical iOS device.

An initial extended browser run was interrupted after its new test used an
incorrectly scoped ancestor locator. A later selector also counted reasoning
that mentioned terminal as tool activity. Both selectors were corrected. A
real-provider mobile turn repeated the requested sequence; the final test
compares rendered rows with unique persisted tool-call IDs instead of assuming
exactly two executions. A desktop rerun exposed a test race that filled the next draft before the
new-session composer mounted; the test now waits for the sent user message.
All six browser checks passed across the baseline and focused final runs. Incremental output is tested deterministically in component
and reducer tests; the live command screenshot can precede its first output.
An initial highly parallel unit run intermittently failed an unrelated composer
or project timing assertion; the final full run passed with two workers.
Screenshots and synthetic session state remain uncommitted.

`npm run live:stop` removed the owned disposable container and anonymous volume
after verification. No commit was created by this task.

## Desktop styling follow-up

The user supplied a desktop stream reference and requested denser activity.
Thinking and tool headers now use 13px muted text, normal weight, 2px vertical
padding, 5px inline gaps, and 12px group indentation. Tool previews use 12px
monospace with reduced margins; reasoning previews use the disclosure's prose
font. Long command labels ellipsize within the available width and retain their
full text in the title and expanded arguments. Command rows have a small terminal
glyph. A single-command group names the command; adjacent mixed groups distinguish
command counts from other tools. Failed or missing results do not receive a
successful execution verb. Existing active expansion, manual choices, completed
collapse, and failure visibility remain intact.

Follow-up validation: 395 frontend tests across 28 files, 100 API tests, lint,
changed-file formatting, and the full plugin build passed. The generated bundles
remain ignored under the current repository convention.

All six real-provider browser checks passed in one follow-up run (desktop and
iPhone 13 Chromium emulation). Inspected live, completed, and restored activity
screenshots at both sizes, plus composer, attachment, and select screenshots.
Long mobile command headers truncate without widening the transcript. Manual
row/group choices survive completion; untouched historical disclosures collapse.
The default test port was already occupied, so this run used port 9122 and the
separate `issue114-style` launcher instance. Its container and anonymous volume
were removed afterward; the container using the default port was left alone.
Screenshots remain ignored, and no commit was created.

## Chevron and run grouping follow-up

Inspected Desktop's current `ToolRun`, `ToolGroupSlot`, and
[run-summary.ts](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/src/components/assistant-ui/tool/run-summary.ts).
Thoughts and tools now share the same right-closed/down-open chevron. Ordinary
consecutive calls collapse behind one summary; a lone call has only its own
row, without a duplicate group header. Rows stay mounted when a second call
arrives, preserving manual disclosure choices. Empty continuation and reasoning
placeholders do not split visible consecutive calls. Text, visible reasoning,
file edits (`edit_file`, `patch`, `write_file`), delegated tasks, and interactive
cards remain chronological boundaries.

Summaries follow Desktop's category order, distinguish commands from other
tools, lowercase subsequent clauses, and identify file exploration, searches,
page reads/navigation, browser actions, and image analysis. Multi-URL extracts
count pages. Only the active category uses the present tense. Settled grouped
commands use counts; individual command rows retain command labels. Unknown
results retain neutral counts and failed calls remain visible and inspectable.

Validation: 403 frontend tests across 29 files, 100 API tests, lint, changed-file
formatting, build, and diff checks passed. All six real-provider browser checks
passed at desktop/mobile sizes. Two additional deterministic grouped-history
checks passed inside the authenticated dashboard, using substituted attach and
REST history responses to guarantee consecutive calls independently of model
behavior. Inspected collapsed/expanded group screenshots and real-provider
single-call/history screenshots at both sizes. Mobile uses Chromium emulation.
The fixture's initial version covered attachment but omitted the subsequent
REST refresh; that test-only race was corrected. The disposable `issue114-group`
container on port 9122 and its anonymous volume were removed. No commit created.
