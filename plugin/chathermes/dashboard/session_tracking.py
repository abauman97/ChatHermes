"""Manual sidebar metadata. Never owns or changes a Hermes runtime/session."""

from datetime import UTC, datetime

from .database import database


def entries(store, profile):
    with database(store) as db:
        return [
            dict(zip(("session_id", "status", "updated_at"), row, strict=True))
            for row in db.execute(
                "SELECT session_id,status,updated_at FROM session_tracking WHERE profile=? "
                "ORDER BY updated_at DESC,session_id DESC",
                (profile,),
            )
        ]


def mark(store, profile, session_id, status, *, new=False):
    if status not in ("open", "settled"):
        raise ValueError("Invalid tracking status")
    now = datetime.now(UTC).isoformat()
    with database(store) as db:
        db.execute(
            "INSERT INTO session_tracking VALUES (?,?,?,?) ON CONFLICT(profile,session_id) "
            + (
                "DO NOTHING"
                if new
                else "DO UPDATE SET status=excluded.status,updated_at=excluded.updated_at "
                "WHERE session_tracking.status<>excluded.status"
            ),
            (profile, session_id, status, now),
        )
        row = db.execute(
            "SELECT session_id,status,updated_at FROM session_tracking WHERE profile=? AND session_id=?",
            (profile, session_id),
        ).fetchone()
    return dict(zip(("session_id", "status", "updated_at"), row, strict=True))


def remove(store, profile, session_id):
    with database(store) as db:
        db.execute(
            "DELETE FROM session_tracking WHERE profile=? AND session_id=?", (profile, session_id)
        )


def deletion_ids(store, profile, session_id):
    """Capture tracked continuation aliases before Hermes removes lineage edges."""
    rows = entries(store, profile)
    if not rows:
        return [session_id]
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    history = _open_session_db_for_profile(profile, read_only=True)
    if history is None:
        return [session_id]
    try:
        targets = set(history.get_session_delete_targets(session_id)) | {session_id}
        return list(
            targets
            | {
                row["session_id"]
                for row in rows
                if history.resolve_resume_session_id(row["session_id"]) in targets
            }
        )
    finally:
        history.close()


def remove_deleted(store, profile, session_ids):
    if isinstance(session_ids, str):
        session_ids = [session_ids]
    with database(store) as db:
        db.executemany(
            "DELETE FROM session_tracking WHERE profile=? AND session_id=?",
            [(profile, session_id) for session_id in session_ids],
        )


def reconcile(store, profile, history):
    """Resolve only tracked IDs, using Hermes's continuation resolver, without transcripts.

    Explicit metadata on a continuation wins by update time. Branches are not
    continuations and do not inherit their parent's tracking.
    """
    rows = entries(store, profile)
    resolved = []
    for row in rows:
        target = history.resolve_resume_session_id(row["session_id"])
        resolved.append((row, target or row["session_id"]))
    with database(store) as db:
        db.execute("BEGIN IMMEDIATE")
        for row, target in resolved:
            if target == row["session_id"]:
                continue
            current = db.execute(
                "SELECT updated_at FROM session_tracking WHERE profile=? AND session_id=?",
                (profile, row["session_id"]),
            ).fetchone()
            if not current or current[0] != row["updated_at"]:
                continue
            db.execute(
                """INSERT INTO session_tracking VALUES (?,?,?,?)
                ON CONFLICT(profile,session_id) DO UPDATE SET
                status=excluded.status, updated_at=excluded.updated_at
                WHERE excluded.updated_at>session_tracking.updated_at""",
                (profile, target, row["status"], row["updated_at"]),
            )
            db.execute(
                "DELETE FROM session_tracking WHERE profile=? AND session_id=? AND updated_at=?",
                (profile, row["session_id"], row["updated_at"]),
            )
    return entries(store, profile)


def listing(store, profile):
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    history = _open_session_db_for_profile(profile, read_only=True)
    if history is None:
        return {"tracking": entries(store, profile), "sessions": []}
    try:
        rows = reconcile(store, profile, history)
        active = []
        aliases = {}
        for row in rows:
            for ancestor in history.get_compression_lineage(row["session_id"]):
                if ancestor != row["session_id"]:
                    aliases[ancestor] = row["session_id"]
            if row["status"] != "open":
                continue
            summary = history.get_session_list_row(row["session_id"])
            if summary and not summary.get("archived") and not summary.get("hidden"):
                # Allowlist metadata only; no messages, paths or runtime state.
                active.append(
                    {
                        "id": row["session_id"],
                        **{
                            key: summary[key]
                            for key in ("title", "source", "started_at")
                            if key in summary
                        },
                    }
                )
        return {"tracking": rows, "sessions": active, "aliases": aliases}
    finally:
        history.close()


def set_status(store, profile, session_id, status):
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    history = _open_session_db_for_profile(profile, read_only=True)
    if history is None:
        return mark(store, profile, session_id, status)
    try:
        reconcile(store, profile, history)
        target = history.resolve_resume_session_id(session_id) or session_id
        return mark(store, profile, target, status)
    finally:
        history.close()
