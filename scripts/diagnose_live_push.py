"""Run a metadata-free Web Push signing diagnostic in the live plugin context."""


def main() -> None:
    import argparse
    import json
    import sys

    parser = argparse.ArgumentParser()
    parser.add_argument("--subject", required=True)
    args = parser.parse_args()

    sys.path.insert(0, "/opt/data/lazy-packages")
    sys.path.insert(0, "/opt/data/plugins/chathermes/dashboard")
    import importlib

    push_store = importlib.import_module("push_store")
    from cryptography.hazmat.primitives import serialization
    from py_vapid import Vapid

    state = push_store._read()
    key = Vapid.from_pem(state["vapid"]["private_key"].encode())
    serialized = key.private_key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    )
    assert Vapid.from_pem(serialized).private_key is not None
    key.sign({"sub": args.subject, "aud": "https://push.example.invalid", "exp": 2000000000})
    print(json.dumps({"key_loaded": True, "key_exported": True, "signing": "ok"}))


if __name__ == "__main__":
    main()
