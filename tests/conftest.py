"""Isolation for contracts that activate native Hermes profile routing."""

import pytest


@pytest.fixture
def hermes_startup(monkeypatch):
    import hermes_constants
    from agent import secret_scope
    from tui_gateway import launch_profile_policy

    # Routing activation is process-wide and intentionally survives a request.
    # Each contract models a fresh process; restore its caller's state afterward.
    monkeypatch.setattr(secret_scope, "_MULTIPLEX_ACTIVE", False)
    monkeypatch.setattr(secret_scope, "_AUTO_PINNED_HOME", None)
    monkeypatch.setattr(launch_profile_policy, "_snapshot", None)
    monkeypatch.setattr(hermes_constants, "_PINNED_PROCESS_HERMES_HOME", None)
    home_token = hermes_constants.set_hermes_home_override(None)
    secret_token = secret_scope.set_secret_scope(None)
    multiplex_token = secret_scope.set_multiplex_context(False)
    try:
        yield
    finally:
        secret_scope.reset_multiplex_context(multiplex_token)
        secret_scope.reset_secret_scope(secret_token)
        hermes_constants.reset_hermes_home_override(home_token)
