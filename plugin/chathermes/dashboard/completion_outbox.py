"""Durable native completion addresses and per-device at-least-once push delivery.

Only row addresses are queued; notification bodies come from Hermes's persisted
profile transcript. A provider success is recorded after the request returns.
A crash between those steps may repeat a push with the same replacement tag.
"""
import time

try:
    from .database import database
except ImportError:  # Hermes and focused tests also load siblings by file spec.
    import importlib.util
    from pathlib import Path
    spec = importlib.util.spec_from_file_location('chathermes_database', Path(__file__).with_name('database.py'))
    shared = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(shared)
    database = shared.database


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
