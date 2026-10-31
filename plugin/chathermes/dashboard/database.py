"""Shared, private SQLite infrastructure. Call from a worker thread."""

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

BUSY_TIMEOUT_MS = 10000
# Ordered, transactional upgrades. Feature queries belong in feature modules.
MIGRATIONS = (
    (
        "CREATE TABLE completions (profile TEXT, session TEXT, row_id TEXT, kind TEXT, PRIMARY KEY(profile,session,row_id,kind))",
        "CREATE TABLE deliveries (profile TEXT, session TEXT, row_id TEXT, kind TEXT, device TEXT, delivered INTEGER DEFAULT 0, cancelled INTEGER DEFAULT 0, lease REAL DEFAULT 0, PRIMARY KEY(profile,session,row_id,kind,device))",
    ),
    (
        """CREATE TABLE artifact_sessions (
            profile TEXT NOT NULL, session TEXT NOT NULL, modification TEXT,
            indexed_at REAL, status TEXT NOT NULL, error TEXT,
            PRIMARY KEY(profile, session))""",
        """CREATE TABLE artifacts (
            profile TEXT NOT NULL, session TEXT NOT NULL, path TEXT NOT NULL,
            message_id TEXT, filename TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER,
            direction TEXT NOT NULL, created_at TEXT NOT NULL, session_title TEXT,
            project_id TEXT, project_title TEXT,
            PRIMARY KEY(profile, session, path),
            FOREIGN KEY(profile,session) REFERENCES artifact_sessions(profile,session) ON DELETE CASCADE)""",
        "CREATE INDEX artifacts_page ON artifacts(profile, created_at DESC, session DESC, path DESC)",
        "CREATE INDEX artifacts_project_page ON artifacts(profile, project_id, created_at DESC, session DESC, path DESC)",
        # Durable suppression prevents reconciliation resurrecting deleted files
        # whose references intentionally remain in authoritative history.
        """CREATE TABLE artifact_deletions (profile TEXT, session TEXT, path TEXT,
            PRIMARY KEY(profile, session, path))""",
    ),
    (
        """CREATE TABLE session_tracking (
            profile TEXT NOT NULL, session_id TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('open', 'settled')),
            updated_at TEXT NOT NULL, PRIMARY KEY(profile, session_id))""",
    ),
    (
        """CREATE TABLE inbox (
            id INTEGER PRIMARY KEY, profile TEXT NOT NULL, session TEXT NOT NULL,
            event_id TEXT NOT NULL, kind TEXT NOT NULL, occurred REAL NOT NULL,
            title TEXT NOT NULL, preview TEXT NOT NULL, read INTEGER NOT NULL DEFAULT 0,
            deleted INTEGER NOT NULL DEFAULT 0,
            UNIQUE(profile, session, event_id, kind))""",
        "CREATE INDEX inbox_page ON inbox(occurred DESC, id DESC)",
        "CREATE INDEX inbox_unread ON inbox(profile, read, deleted)",
        "CREATE TABLE inbox_profiles (profile TEXT PRIMARY KEY, since REAL NOT NULL)",
        """CREATE TABLE inbox_checkpoints (profile TEXT, session TEXT, row_id INTEGER NOT NULL,
            modification TEXT NOT NULL, PRIMARY KEY(profile, session))""",
    ),
    ("ALTER TABLE inbox_checkpoints ADD COLUMN scanned REAL NOT NULL DEFAULT 0",),
    (
        "CREATE UNIQUE INDEX inbox_completion_origin ON inbox(profile,event_id,kind) WHERE kind='turn.complete'",
    ),
)


def database_path(store=None):
    if store is not None:
        return Path(store._path()).with_name("chathermes.sqlite3")
    from hermes_constants import get_default_hermes_root, get_process_hermes_home

    return (
        Path(get_default_hermes_root(home=get_process_hermes_home()))
        / "state"
        / "chathermes.sqlite3"
    )


@contextmanager
def database(store=None):
    path = database_path(store)
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(path.parent, 0o700)
    fd = os.open(path, os.O_CREAT | os.O_RDWR, 0o600)
    os.close(fd)
    os.chmod(path, 0o600)
    db = sqlite3.connect(path, timeout=BUSY_TIMEOUT_MS / 1000)
    try:
        db.execute(f"PRAGMA busy_timeout={BUSY_TIMEOUT_MS}")
        db.execute("PRAGMA foreign_keys=ON")
        db.execute("PRAGMA journal_mode=WAL")
        # Serialize only initialization, never a feature's network operation.
        version = db.execute("PRAGMA user_version").fetchone()[0]
        if version != len(MIGRATIONS):
            db.execute("BEGIN IMMEDIATE")
            version = db.execute("PRAGMA user_version").fetchone()[0]
            if version > len(MIGRATIONS):
                raise RuntimeError("Unsupported ChatHermes database version")
            for index in range(version, len(MIGRATIONS)):
                for statement in MIGRATIONS[index]:
                    db.execute(statement)
                db.execute(f"PRAGMA user_version={index + 1}")
            db.commit()
        yield db
        db.commit()
    except BaseException:
        db.rollback()
        raise
    finally:
        db.close()
