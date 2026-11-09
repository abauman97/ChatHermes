# Hermes native wire sources

Wire types, events and `JsonRpcRequestChannel` come from
NousResearch/hermes-agent, `apps/shared/src`, MIT (see LICENSE).
The reviewed native runtime is release v0.23.0 at
`2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19`.

`gateway-contract.generated.ts` is copied from that release and formatted with
Vite+. The event and request-channel adapters retain ChatHermes's native-only
surface; Desktop canonical authority events and local onboarding are excluded.

ChatHermes connects directly to authenticated same-origin `/api/ws` with explicit
profile routing. It accepts one native contract and rejects incompatible
snapshots. No protocol translation or application stores belong here.
Update the shared files together with runtime contract and live tests.
