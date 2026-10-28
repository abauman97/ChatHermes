# Contribute to ChatHermes

Start with [developer setup](getting-started.md) and the repository's [agent conventions](../../AGENTS.md). Keep changes focused on the Hermes dashboard plugin and preserve profile/session isolation, cancellation, authentication, and server-side credential handling.

## Make and validate a change

1. Find the owning feature in [architecture](architecture.md). Check [API contracts](api-contract.md) for protocol changes.
2. Implement the smallest coherent change with appropriate observable coverage. Do not add a standalone application or a new dependency just to forward existing state.
3. Use uv for all Python work: `uv sync --locked`, `uv run ruff format .`, `uv run ruff check --fix .`, `uv run ty check`, and relevant `uv run pytest` contracts with the pinned Hermes `PYTHONPATH`. Manage dev dependencies with `uv add --dev` / `uv remove --dev` and include the lockfile. Run the relevant [checks and workflows](testing.md). For UI changes, visually verify the actual dashboard at desktop/mobile sizes before committing. Report test limitations honestly.
4. Update the maintained guide that owns the changed behavior, and validate its relative links. User tasks belong in `docs/user/`; runtime contracts and contributor workflows belong in `docs/developer/`. Update [the index](../README.md) when adding or moving topics. Keep the root README concise and link to the authoritative topic instead of repeating it.
5. Describe the concrete problem, resulting behavior, validation, and any limitations in the pull request. Never include generated dist assets, `.env`, credentials, runtime state, or user sessions.

## Maintain documentation and history

Plans, verification records, and reference material belong under `docs/internal/`. Preserve historical evidence and identify superseded behavior; do not treat an old passing verification as proof for the current tree. Mine still-useful guidance into the maintained topic, link to the historical source when helpful, and update inbound links when moving files. Use relative GitHub Markdown without a documentation framework.

Build, packaging, hosting, and release guidance lives in [deployment](deployment.md).
