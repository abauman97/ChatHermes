# Issue #11 streaming verification

Worktree: `feat/issue-11-streaming`, initially clean and at `origin/main`
(`12fc0a696e97df03bfb9bd45d954113a82038299`). No commit, push or PR.
Requirements: <https://github.com/abauman97/ChatHermes/issues/11>.

## Changes

Protocol normalization and turn reduction live in `src/lib/assistant-turn.ts`.
Assistant turns render ordered reasoning, tool and Markdown blocks. Continuous
reasoning and updates to a native tool ID modify the existing block. Completed
phases collapse, remain inspectable and show readable tool labels, elapsed time
when available, and failures. Raw names, arguments and results stay in details;
long output and reasoning have a 240px scroll limit. Readers who scroll up stay
in place as content arrives or disclosures change height.

Received blocks survive viewer reconnection and stay attached to their user turn
through subsequent sends and history refreshes in the same mounted session.
History reconstructs reasoning and tool lifecycles from Hermes's persisted
`reasoning` / `reasoning_content`, `tool_calls` and `tool_call_id` fields. Native
workspace failure flags, IDs, duration and history metadata are preserved by the
existing authenticated adapter. Resume text is explicitly a snapshot instead of
an append delta, preventing duplicate text. Native event IDs / sequence numbers
suppress repeated frames. Unknown events are ignored. The composer remains
editable; sending remains gated while a known run is awaiting recovery.

## Contract inspection and remaining protocol limitations

Read the REST stream, history projection and run replay implementation at the
existing test-source pin `3632f9173d218fd24f3fa595d7affa159b0774cd` through GitHub,
as well as the available local native RPC event/resume implementation.
The source and base-image pins in `tests/docker/Dockerfile`, and `compose.yml`,
were preserved without changes.

At that pin, REST session chat stamps `seq`, `run_id`, `message_id` and `ts` but
its tool callbacks omit stable call IDs. Sequential calls use local IDs and
match the currently running tool name; ambiguous concurrent calls with identical
names cannot be disambiguated without upstream IDs. Native RPC calls do supply
`tool_id`. The REST session chat endpoint does not register its stream with the
separate durable `/v1/runs` replay backlog and interrupts its turn when its SSE
client detaches. A 404 from replay therefore still falls back to history.
Native RPC resume exposes current assistant text, but not a complete activity
journal. Received activities are preserved, and persisted tool output can be
restored; events missed during disconnection that Hermes neither persists nor
replays cannot be recovered. Reasoning is only available at the granularity
Hermes publishes and persists. Full reconstruction after a browser reload
cannot guarantee preservation of transient progress that is absent from Hermes
history. No custom backend event journal or browser conversation store was added.

## Automated checks

`node_modules` was present but initially incomplete (`@playwright/test` could not
be imported). `npm ci` restored dependencies using the existing lockfile, which
was not changed. System Python lacked pytest; the pinned
`tests/requirements.txt` dependencies were installed into ignored `.venv/`.
Run API tests with `PATH="$PWD/.venv/bin:$PATH" npm run test:api`.

Coverage includes plain text, reasoning followed by text, several reasoning
phases, reasoning/tool/commentary interleaving, sequential and concurrent native
calls, failure, long output, duplicate replay, snapshots, completed-history
reload, unknown events, reader-controlled scrolling, and App-level resume during
a tool call and text generation, including persisted tool/reasoning phases missed during detachment. The new dashboard visual spec targets both
configured desktop and mobile projects using deterministic plugin data and SSE;
only the real Hermes dashboard can provide its authentication and SDK mount.

Final gates:

| Command | Result |
| --- | --- |
| `npm test` | Passed: 66 tests in 7 files |
| `PATH="$PWD/.venv/bin:$PATH" npm run test:api` | Passed: 33 tests |
| `npm run build` | Passed: type checking and both plugin builds; shipped `dashboard/dist/` assets rebuilt |
| `git diff --check` | Passed |
| Actual dashboard plugin visual checks | Blocked before plugin mount in desktop and mobile; both existing and new workflows attempted |

## Actual dashboard visual workflow — blocked

Prerequisites were inspected:

- Docker endpoint initialization fails: `invalid bind address format:
  "tcp://docker:2375"`. No local Docker socket was available.
- `docker compose version` fails because the Compose subcommand is absent.
  The required isolated named-volume environment cannot be started here.
- Playwright and its Chromium binary are available after dependency restoration.
- A dashboard responds on `127.0.0.1:9119`, but exposes Nous SSO authentication,
  rather than the isolated fixture's username/password form. Its configuration,
  authentication and state were not altered.

Both commands actually launched desktop (1280×720) and mobile (iPhone 13,
390×664 CSS viewport) Chromium checks against the dashboard:

```sh
npm run test:visual -- --grep 'plugin composer' --timeout 15000
npm run test:visual -- tests/visual/streaming.spec.ts --timeout 15000 --output tests/visual-output/issue-11
```

Each command failed both projects while waiting for the fixture `Username`
field, before reaching the plugin. Desktop and mobile failure screenshots were
inspected: they show the SSO sign-in page, not ChatHermes. Existing-workflow
screenshots and traces are under:

- `tests/visual-output/dashboard-plugin-composer--b3343-odel-and-stream-disclosures-desktop/`
- `tests/visual-output/dashboard-plugin-composer--b3343-odel-and-stream-disclosures-mobile/`

The new workflow's failure screenshots and traces are under
`tests/visual-output/issue-11/`. Artifacts remain ignored and uncommitted.
No successful plugin screenshots exist for this change. Actual visual checks of
focus during generation, scrolling, file/camera attachments, native selects,
and disclosure transitions remain blocked and must be run in the isolated
Compose dashboard before any commit. DOM/unit tests are not a replacement for
that gate. The new browser scenario itself remains unverified past login.
