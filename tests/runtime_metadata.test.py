"""The advertised Python minimum must parse every shipped backend module."""

import ast
import tomllib
from pathlib import Path

from packaging.specifiers import SpecifierSet

PLUGIN = Path(__file__).resolve().parents[1] / "plugin" / "chathermes"


def test_runtime_sources_parse_at_declared_python_minimum():
    metadata = tomllib.loads((PLUGIN / "pyproject.toml").read_text())
    supported = SpecifierSet(metadata["project"]["requires-python"])
    minimum = next((3, minor) for minor in range(11, 15) if f"3.{minor}" in supported)
    for path in PLUGIN.rglob("*.py"):
        if "__pycache__" not in path.parts and "build" not in path.parts:
            ast.parse(path.read_text(), filename=str(path), feature_version=minimum)
