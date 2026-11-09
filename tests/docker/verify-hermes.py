"""Verify immutable Hermes image provenance without reading runtime credentials."""

import json
from pathlib import Path

PIN_PATH = Path(__file__).with_name("hermes-pin.json")


def verify(pin_path=PIN_PATH, root=Path("/opt/hermes")):
    pin = json.loads(pin_path.read_text())
    stamp = json.loads((root / "install-stamp.json").read_text())
    if stamp.get("commit") != pin["commit"]:
        raise ValueError(
            "Hermes image revision differs from the reviewed source pin; rebuild explicitly"
        )
    return pin["commit"]


if __name__ == "__main__":
    print("Verified Hermes source revision: " + verify())
