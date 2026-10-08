"""Run a metadata-free Web Push signing diagnostic in the live plugin context."""
import argparse
import json
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--subject", required=True)
args = parser.parse_args()

sys.path.insert(0, "/opt/data/lazy-packages")
sys.path.insert(0, "/opt/data/plugins/chathermes/dashboard")
from py_vapid import Vapid
from cryptography.hazmat.primitives import serialization
import push_store

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
