"""The reviewed wire schema, including its unsupported draft workspace fields."""

import pytest
from pydantic import ValidationError
from tui_gateway.contracts.profiles_vault_complete_foreign_subagents import CompleteSlashParams
from tui_gateway.contracts.tools_commands import CommandsCatalogParams


@pytest.mark.parametrize("model", [CommandsCatalogParams, CompleteSlashParams])
def test_discovery_accepts_explicit_profile_and_session(model):
    value = model.model_validate({"profile": "alpha", "session_id": "runtime"})
    assert value.profile == "alpha"
    assert value.session_id == "runtime"


@pytest.mark.parametrize("model", [CommandsCatalogParams, CompleteSlashParams])
def test_project_draft_workspace_is_not_a_wire_contract(model):
    with pytest.raises(ValidationError):
        model.model_validate(
            {"profile": "alpha", "cwd": "/synthetic/project", "cwd_explicit": True}
        )
