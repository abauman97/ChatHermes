# Issue #27: Scheduled history verification

The drawer now places Scheduled immediately below Projects. Jobs are filtered
by Active, Paused and Completed status. Selecting a job opens retained runs in
newest-first order, with older pages available. Selecting a run reads the actual
persisted transcript, saved Markdown, or execution metadata when no output was
saved. The chat action creates a separate normal chat and drafts the output;
creation errors leave the run open, and sending is a separate action.

## Contracts and scope

Inspected the cron router, profile/store helpers, scheduler session IDs, execution
ledger and SessionDB contracts in the actual isolated Hermes container at source
pin `3632f9173d218fd24f3fa595d7affa159b0774cd`. The implementation uses native
`list_jobs`, `list_cron_job_runs`, `get_messages_as_conversation`, `list_executions` and
`get_execution`, plus the pinned timestamp and execution-window reconciliation
helpers. Compressed run output follows the persisted resume lineage and includes compacted
display history. It does not use the transient gateway Runs buffer for cron history.

Plugin routes inherit dashboard authentication. Job and run lookups remain in
the selected profile, validate identifiers, refuse symlinked output paths and
return only allowed fields. Gateway credentials are redacted and internal error
details are suppressed. Older Hermes versions without the required helpers get
a compatibility error. No cron creation, mutation, deployment or unrelated UI
changes were added to the product. The supplied reference is retained at
`docs/reference/chatgpt/08-scheduled-jobs-dark.jpg`.

## Required gates

- `npm test`: 99 tests passed across 11 files.
- `PATH="$PWD/.venv/bin:$PATH" npm run test:api`: 42 tests passed.
- `npm run build`: passed TypeScript checks and both plugin builds. Updated
  `plugin/chathermes/dashboard/dist/` assets are included in the working tree.
- `git diff --check`: passed.

Tests cover chronological retrieval and paging beyond 500 retained sessions and
executions, mixed session/document history, distinct failed attempts, actual
output retrieval, profile isolation, identifier/path rejection, redaction,
compatibility errors, late response cancellation, deep links, status filters,
composer send gating, discussion creation failure/retry and draft/in-flight
creation isolation across profile changes.

## Actual dashboard visual checks

Used the repository's pinned Dockerfile and Compose-equivalent shell launcher,
with a temporary launcher copy that changes only the resource names and working
directory. The final environment used dedicated `chathermes-issue27-test-*`
containers/network and `chathermes-issue27-test-hermes-test-data` volume on remote
Docker, dashboard port 9147. No personal Hermes home was mounted, and source/base
image pins and `compose.yml` are unchanged. Test jobs, documents, transcripts and
failed executions are synthetic fixtures created with native Hermes helpers.
Built assets and the final adapter were installed only into this test container.
The test containers were stopped after verification; the dedicated volume was
retained.

```sh
CHATHERMES_TEST_URL=http://172.25.0.2:9147 \
CHATHERMES_CHROMIUM=/opt/data/profiles/developer/home/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:visual -- tests/visual/scheduled.spec.ts \
  --output=tests/visual-output/issue27-contract-verified
```

Both desktop Chrome and mobile iPhone 13 viewport tests passed. These use the
actual dashboard plugin and authenticated native storage without route mocks.
Checked drawer order, status/profile selects, 30-row history and older-page
loading, timestamp ordering, full agent and saved output, collapsed/completed
tool disclosures and expansion, top-of-report opening, scrolling without
horizontal overflow, reload links, discussion drafts, focusable composer,
authenticated file upload followed by a native agent reply, camera input/preview,
and failed runs without output. Inspected mobile and desktop screenshots in the
ignored `tests/visual-output/issue27-contract-verified/` directory, including job cards,
history, output, discussion, attachments and failed-run states.

## Limitations

The broader existing visual suite is not green. The attempted full run passed
both desktop Markdown checks and the desktop Scheduled flow, but failed older
checks expecting a `terminal` disclosure label, direct Project buttons in the
drawer, `/sessions` navigation after leaving the plugin, a single activity row,
and the send button after stopping a run. The streaming check also timed out.
That run terminated before completing its mobile checks. These failures were
not changed as part of issue #27; the dedicated final Scheduled workflow passed
at both sizes. An initial focused run also hit a Playwright trace cleanup error;
using a separate output directory resolved it.

Physical iOS keyboard/zoom and actual camera hardware were not tested. Camera
coverage uses a synthetic image through the existing capture input. Retention
limits in Hermes still apply: deleted jobs and pruned output cannot be recovered.
No commit, push, PR or live deployment was performed.
