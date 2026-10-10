# Frontend architecture

ChatHermes mounts Vue through the Hermes React dashboard plugin SDK. `main.ts`
creates an app per mount; `plugin-entry.ts` owns host integration and viewport
restoration. There is no standalone application, client router, or global store.

## Where code belongs

| Location                             | Ownership                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/App.vue`                        | Shell coordinator: profiles, sessions, projects, URL/history, asynchronous scope generations, host/push lifecycle, navigation and page selection |
| `src/features/chat/components/`      | Persistent live interface, composer, interactive request forms, user and assistant rendering                                                     |
| `src/features/chat/composables/`     | Live chat projections, submission/upload orchestration, runtime actions, composer gates                                                          |
| `src/features/chat/runtime/`         | Single native session owner, viewer, admission/recovery, assistant-turn reducer and reconciliation                                               |
| `src/features/chat/types/`, `utils/` | Render entry union, pure transcript grouping, validated request adapter and user attachment display                                              |
| `src/features/sessions/`             | Session navigation presentation; scope transitions remain in App                                                                                 |
| `src/features/projects/`             | Project pages, editors, instructions and project helpers                                                                                         |
| `src/features/scheduled/`            | Saved run output and discussion entry; no live viewer ownership                                                                                  |
| `src/features/notifications/`        | Existing authenticated push subscription and mounted-session publication                                                                         |
| `src/features/settings/`             | Settings presentation                                                                                                                            |
| `src/components/`                    | Explicit-prop transcript and disclosure components, also used for saved output                                                                   |
| `src/services/`                      | Cross-feature authenticated API client and native capability gate                                                                                |
| `src/types/`                         | Shared Hermes domain types                                                                                                                       |
| `src/utils/`                         | Framework-independent Markdown rendering                                                                                                         |
| `src/assets/styles/`                 | Shared stylesheet and existing DOM/CSS contracts                                                                                                 |
| `src/vendor/hermes/`                 | Pinned gateway contract and transport primitives; do not edit generated contracts                                                                |

Do not create empty router, stores, views, artifacts, or shared composables
folders. Attachments currently belong to chat; scheduled output is a real feature.
Keep tests beside the code they exercise. App integration tests stay beside App.

## Dependencies and state

Use direct relative imports. Features may import shared services, types and
utilities. Scheduled output may use the explicit-prop transcript. Pure rendering
never injects live chat state or calls the runtime. Avoid shared modules importing
feature coordinators and avoid barrels that obscure ownership.

App constructs `useNativeSession` exactly once and passes it to
`useChatController` with reactive scope inputs and guarded shell callbacks. App
retains creation, selection, cancellation and generation checks together.
`context.ts` provides one typed live context per app instance, with readonly view
refs and model setter commands. It exposes no viewer or mutable runtime error.
Only `ChatInterface` and `LiveRequest` consume it. Arrays retain their reactive
identity; do not copy streamed data into snapshots or use module-global UI state.

`ChatInterface` renders shell pages through its page slot above the unconditional
composer. The composer key is `[profile, session]`, never busy/loading/page state.
Drafts, attachment reads, editing, sizing and focus remain composer-local; gate
sending independently of editing. Keep standalone composer tests provider-free.

`ChatTranscript` owns scrolling, native toggle capture and image load updates.
`transcriptEntries` preserves history/live fallback rules without modifying or
reconciling runtime blocks. Assistant turn keys scope local block IDs; historical
turns receive their own working state. Work remains before text; `TurnWork` and
`ActivityRow` retain their disclosure state and `v-show` row instances.

Request forms are keyed by `[profile, session, envelope ID]`. The adapter accepts
only known payload shapes and never displays unknown params. Forms own drafts
and pending state; clarification failures retain drafts, blank custom answers
fall back to selected options, and nonblank custom text takes precedence.
Callbacks capture scope generation and envelope identity before dispatch. Late
failures cannot overwrite a replacement request's state. Keep the first-open
request policy and the existing runtime answer transport.

## Guidelines for changes and AI agents

Start with the owning feature and its tests. Preserve public prop contracts and
DOM classes during extraction. Change runtime protocol/recovery separately from
presentation. Keep async guards with the state they protect; do not add another
viewer, Pinia, event bus, or dependency just to forward props. App remains a
substantial shell coordinator; further navigation/project extraction should be
small, behavior-tested changes rather than a state-machine rewrite.

Use `vp lint` and `vp fmt` on owned source; run `npm test`, `npm run test:api`,
and `npm run build`. Include rebuilt committed plugin dist assets. Verify the
actual React-mounted dashboard at desktop/mobile sizes with `npm run live` and
`npm run test:visual`, inspect screenshots, and stop only your fixture with
`npm run live:stop`. Follow [AGENTS.md](../AGENTS.md) for scope and fixture rules.
