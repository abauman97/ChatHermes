# Issue #141: composer reasoning effort

The composer model picker now includes a native, 16px reasoning select with
Model default, None, Minimal, Low, Medium, High, XHigh, Max and Ultra. Explicit
choices apply after model selection, to the selected native session only. The
browser verifies the session reasoning getter before retaining/submitting a turn.
Preparation rejects unknown values, display commands, nulls and non-string values.

## Source review

Reviewed Hermes 0.22.5 source `bf0203a794a07aac3ff764972ab9087baa4e4f4e`:

- `hermes_constants.VALID_REASONING_EFFORTS` and `parse_reasoning_effort`.
- `tui_gateway.methods_config_set._set_reasoning`: session scope pins the
  runtime without writing profile configuration; display commands are separate.
- `tui_gateway.methods_config._cfg_get_reasoning`: reads the session override
  or live agent before falling back to profile configuration.
- `agent.agent_runtime_helpers.switch_model`: reloads the model's configured
  reasoning setting, so explicit effort must be applied after switching models.
- `agent.reasoning_effort`: Hermes owns provider vocabulary and wire clamping.

The running test image's `methods_config.py`, `methods_config_set.py` and
`agent_runtime_helpers.py` matched the reviewed pin byte-for-byte (SHA-256).

## Validation

- `vp fmt --check`, `vp lint`, and `git diff --check` passed.
- `npm test`: 805 tests passed across 33 files.
- `PYTHONPATH=tmp/hermes-pin:plugin npm run test:api`, in the project virtualenv
  with the plugin development extra and Hermes import dependencies: 105 passed.
- `npm run build` and `npm run test:env:build` passed. Generated distribution
  changes were restored; no distribution assets are part of this change.
- Twelve real-Hermes desktop/mobile workflows passed: progressive streaming and
  reload persistence, real tool disclosure completion/inspection, selected model
  reaching inference, Stop, authenticated file/camera staging and focus, and
  reasoning selection with real runtime reads and isolation between chats.
- The extended reasoning workflow passed again on both sizes, switching the
  real Profile select to beta, applying Low there, and confirming that the
  earlier default-profile chat retained None.

Inspected actual plugin screenshots at desktop and iPhone 13 viewport sizes:
the reasoning picker fits above the rounded composer; its select remains 16px;
tool disclosure content scrolls within the transcript; attachments and the
composer remain usable. Reasoning screenshots are under the ignored
`tests/visual-output/reasoning-*/reasoning-picker.png` paths.

## Environment and limits

Used isolated Compose project `chathermes-issue-141`, dashboard port 34119 and
MockServer port 34080. The remote daemon required its private bind address.
Compose was downloaded into ignored `tmp/bin/` because the client lacked it;
the existing local Chromium executable was selected explicitly because the
inherited Playwright browser path did not exist. Initial test synchronization
failures were corrected by waiting for the new empty chat and blurring the
mobile textarea before opening its normally hidden model pill. Containers and
runtime state remain available for inspection.

The fixture provider does not advertise reasoning support. Tests verify the
real Hermes sessions' High/None/Low settings, rather than claiming that an
unsupported provider receives reasoning parameters. Provider-specific wire
clamping, real-provider inference, real Android keyboards and iOS Safari were
not tested. Picker choices are page-local; Hermes owns runtime persistence.
No commit or push was performed.
