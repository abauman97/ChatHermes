"""Importable worker for fresh-process push transaction regressions."""

import importlib.util
from pathlib import Path


def competing_store(path, operation, profile, entered, release, attempting, results):
    # Each host imports its own module, just as the dashboard and Cron do.
    module_spec = importlib.util.spec_from_file_location(
        "isolated_push_store",
        Path(__file__).parents[1] / "plugin/chathermes/dashboard/push_store.py",
    )
    assert module_spec is not None and module_spec.loader is not None
    module = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(module)
    vars(module)["_path"] = lambda: path
    read = module._read

    def held_read():
        value = read()
        entered.set()
        assert release.wait(10), "parent did not release the transaction"
        return value

    vars(module)["_read"] = held_read
    attempting.set()
    if operation == "config":
        result = module.config()
    elif operation == "remove":
        result = module.remove(profile, "old-" + profile)
    elif operation == "remove_endpoint":
        result = module.remove_endpoint("old-" + profile)
    else:
        result = module.upsert(
            profile,
            {"endpoint": "https://push.test/" + profile, "keys": {"p256dh": "key", "auth": "auth"}},
        )
    results.put(result)
