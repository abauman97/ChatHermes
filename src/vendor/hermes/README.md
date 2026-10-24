# Hermes native wire sources

Wire types, events and `JsonRpcRequestChannel` come from
NousResearch/hermes-agent, `apps/shared/src`, MIT (see LICENSE).
The reviewed native runtime is release 0.22.5 at
`bf0203a794a07aac3ff764972ab9087baa4e4f4e`.

ChatHermes connects directly to authenticated same-origin `/api/ws` with explicit
profile routing. It accepts one native contract and rejects incompatible
snapshots. No protocol translation or application stores belong here.
Update the shared files together with runtime contract and live tests.
