# Developer setup

Read [AGENTS.md](../../AGENTS.md) before changing the repository. Use the [architecture guide](architecture.md) to find the owning component and the [API contract](api-contract.md) before changing runtime behavior.

## Prepare a checkout

Use Node.js 22 (the asset workflow uses it), npm, Vite+ (`vp`), and Python 3.14+ managed by [uv](https://docs.astral.sh/uv/getting-started/installation/). Docker Compose is needed for the real-Hermes environment; Android additionally requires daemon-side KVM.

From the repository root:

```sh
npm ci
uv sync --locked
# Separate reviewed runtime source, ignored by Git and Ruff:
git clone --no-checkout https://github.com/NousResearch/hermes-agent.git .hermes-source
git -C .hermes-source checkout --detach bf0203a794a07aac3ff764972ab9087baa4e4f4e
```

Install uv using its linked installer before running these commands; `uv sync --locked` creates `.venv` and downloads the Python version in `.python-version` if needed. Do not create or activate a venv manually or install development tools with pip. The root non-packaged development project and committed `uv.lock` own tooling and test dependencies. The plugin's separate `pyproject.toml` remains a metadata-only runtime dependency package; development tools must not enter its runtime dependencies.

Use `uv add --dev <package>` and `uv remove --dev <package>` for development dependencies. Use `uv lock --upgrade-package <package>` for a deliberate update, then `uv sync --locked` and validate. Include both root dependency files in the change. Runtime dependency changes belong in `plugin/chathermes/pyproject.toml`; regenerate the root lock with `uv lock` after editing that metadata.

The Python contracts need the complete reviewed Hermes source at the [native contract pin](api-contract.md#native-chat-contract). The root dev group supplies dependencies used by these contracts, not the full Hermes application. ty resolves runtime imports from `.hermes-source` and the uv environment while checking first-party `plugin/`, `tests/`, and Python scripts. For a checkout elsewhere, pass `uv run ty check --extra-search-path /path/to/hermes-source`. Set `PYTHONPATH=.hermes-source:plugin` for tests (or substitute the absolute runtime checkout). Missing Hermes imports can skip profile/host contracts; inspect skips before claiming full coverage. Do not use personal Hermes state or credentials for deterministic tests.

Follow [testing](testing.md) for checks and dashboard reproduction, then [deployment](deployment.md) to build and install into a development dashboard. Vite alone is not the supported product runtime; verify the React-mounted plugin in Hermes.

## Repository map

| Location                        | Purpose                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/`                          | Vue shell, feature controllers, components, and nearby tests; see the architecture ownership table    |
| `src/plugin-entry.ts`           | Hermes React plugin SDK mount and host lifecycle                                                      |
| `plugin/chathermes/`            | Plugin registration, Cron adapter, dependency declaration, and authenticated Python dashboard backend |
| `public/`                       | Push service worker, Home Screen manifest, and icons copied into the build                            |
| `scripts/`                      | Plugin build and local copy/install tools                                                             |
| `tests/`                        | Python contracts, browser workflows, and Docker infrastructure                                        |
| `docs/user/`, `docs/developer/` | Maintained task guides and technical contracts                                                        |
| `docs/internal/`                | Historical plans, verification evidence, and visual references                                        |

For contribution expectations, see [contributing](contributing.md).
