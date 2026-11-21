"""Raw authority transitions on disposable SQLite fixtures only."""

from functools import wraps

from persistence.sqlite.authority import _admission_store, _runtime_ends


def _verb(name):
    module = _runtime_ends if name == "begin_runtime_epoch" else _admission_store
    fn = getattr(module, name)

    @wraps(fn)
    def invoke(db, *args, **kwargs):
        return fn(db._holder, *args, **kwargs)

    return invoke


begin_runtime_epoch = _verb("begin_runtime_epoch")
admit_session_input = _verb("admit_session_input")
claim_session_input = _verb("claim_session_input")
settle_session_input = _verb("settle_session_input")
recover_session_inputs = _verb("recover_session_inputs")
