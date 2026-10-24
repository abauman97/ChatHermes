"""Durable native completion addresses and per-device at-least-once push delivery.

Only row addresses are queued; notification bodies come from Hermes's persisted
profile transcript. A provider success is recorded after the request returns.
A crash between those steps may repeat a push with the same replacement tag.
"""
import os
import sqlite3
import time
from contextlib import contextmanager


@contextmanager
def database(store):
    path = store._path().with_name('chathermes-completions.sqlite3')
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    # Create private metadata storage before SQLite opens the connection.
    fd = os.open(path, os.O_CREAT | os.O_RDWR, 0o600)
    os.close(fd)
    os.chmod(path, 0o600)
    db = sqlite3.connect(path, timeout=10)
    try:
        db.execute('CREATE TABLE IF NOT EXISTS completions (profile TEXT, session TEXT, row_id TEXT, kind TEXT, PRIMARY KEY(profile,session,row_id,kind))')
        db.execute('CREATE TABLE IF NOT EXISTS deliveries (profile TEXT, session TEXT, row_id TEXT, kind TEXT, device TEXT, delivered INTEGER DEFAULT 0, cancelled INTEGER DEFAULT 0, lease REAL DEFAULT 0, PRIMARY KEY(profile,session,row_id,kind,device))')
        # Keep terminal cancellation distinct from provider-confirmed delivery.
        if 'cancelled' not in {column[1] for column in db.execute('PRAGMA table_info(deliveries)')}:
            db.execute('ALTER TABLE deliveries ADD COLUMN cancelled INTEGER DEFAULT 0')
        yield db
        db.commit()
    finally:
        db.close()


def enqueue(store, profile, session, row_id, kind="turn.complete"):
    # Freeze recipients at completion: enabling a new device must not deliver
    # every historical completion, and another profile's devices never qualify.
    recipients = store.subscriptions(profile)
    with database(store) as db:
        inserted = db.execute('INSERT OR IGNORE INTO completions VALUES (?,?,?,?)', (profile, session, str(row_id), kind)).rowcount
        if inserted:
            db.executemany('INSERT INTO deliveries(profile,session,row_id,kind,device) VALUES (?,?,?,?,?)',
                           [(profile, session, str(row_id), kind, row['id']) for row in recipients])


def drain(store, sender, read_body, now=None):
    now = time.time() if now is None else now
    with database(store) as db:
        pending = db.execute('SELECT profile,session,row_id,kind,device FROM deliveries WHERE delivered=0 AND cancelled=0 AND lease<?', (now,)).fetchall()
    for profile, session, row_id, kind, device in pending:
        key = (profile, session, row_id, kind, device)
        with database(store) as db:
            claimed = db.execute('UPDATE deliveries SET lease=? WHERE profile=? AND session=? AND row_id=? AND kind=? AND device=? AND delivered=0 AND cancelled=0 AND lease<?', (now + 60, *key, now)).rowcount
        if not claimed:
            continue
        success = cancelled = False
        try:
            # An unsubscribed/expired recipient is terminal, never reassigned.
            if not any(row['id'] == device for row in store.subscriptions(profile)):
                cancelled = True
            else:
                body = read_body(profile, session, int(row_id)) if kind == "turn.complete" else None
                if kind != "turn.complete" or body is not None:
                    success = sender._deliver(profile, session, kind, str(row_id), message=body, destination=device) is True
        except Exception:
            # Native paths, keys and provider exceptions never enter logs.
            pass
        with database(store) as db:
            db.execute('UPDATE deliveries SET delivered=?, cancelled=?, lease=? WHERE profile=? AND session=? AND row_id=? AND kind=? AND device=?',
                       (int(success), int(cancelled), 0 if success or cancelled else now + 30, *key))
