"""SQLite fixture construction for the reviewed Hermes storage backend.

Only tests use the backend's raw verbs to seed compaction, malformed receipts and
races. Product reads use repository handles. Forward repository attributes intact
so contracts exercise the same interface as the dashboard, without patching Hermes.
"""

import importlib
from functools import partial
from pathlib import Path
from typing import Any, cast


class FixtureStore:
    def __init__(self, db_path=None, read_only=False, *, store=None):
        from persistence.sqlite import SQLiteBackend
        from persistence_assembly import open_persistence, profile_scope

        self.store: Any
        self._backend = None
        if store is not None:
            self.store = store
        elif db_path is None:
            self.store = open_persistence(profile_scope(), eager=True)
        else:
            path = Path(db_path).resolve()
            scope = profile_scope(home=path.parent)
            self._backend = SQLiteBackend({scope.hermes_home_key: path}, read_only=read_only)
            self.store = self._backend.open(scope)
            self.store.ready()
        # Explicit backend access is restricted to synthetic test data.
        self._holder = (
            self.store.holder() if self._backend else cast(Any, self.store)._bound_store().holder()
        )
        self.db_path = self._holder.db_path

    def __getattr__(self, name):
        if hasattr(self.store, name):
            return getattr(self.store, name)
        if hasattr(self._holder, name):
            return getattr(self._holder, name)
        for family in ("messages", "sessions", "compression", "titles", "portability"):
            module = importlib.import_module("persistence.sqlite.conversation._store." + family)
            if hasattr(module, name):
                function = getattr(module, name)
                return function if name == "_decode_content" else partial(function, self._holder)
        raise AttributeError(name)

    def delete_session(self, session_id):
        return self.store.sessions.delete(session_id, media_root=str(self.db_path.parent))

    def close(self):
        if self._backend:
            self._backend.close()
        else:
            self.store.close()
