"""Minimal legacy live-status projection with strict runtime profile ownership."""


def _compression_aliases(conn, key):
    """Verified preferred ancestors and continuation on the ledger's read snapshot."""
    from hermes_state_compression import _CHAIN_CAP, _CHAIN_STEP_SQL

    keys = {key}
    current = key
    for _ in range(_CHAIN_CAP):
        row = conn.execute(
            "SELECT parent_session_id FROM sessions WHERE id = ?", (current,)
        ).fetchone()
        parent = row["parent_session_id"] if row else None
        if not parent:
            break
        # parent_session_id alone also links branches, resets, tools, delegates
        # and stale siblings. Only resume's preferred compression edge is safe.
        child = conn.execute(_CHAIN_STEP_SQL, (parent,)).fetchone()
        if child is None or child["id"] != current:
            break
        if parent in keys:
            raise RuntimeError("Cyclic compression ancestry")
        keys.add(parent)
        current = parent
    else:
        raise RuntimeError("Compression ancestry exceeds bound")

    current = key
    for _ in range(_CHAIN_CAP):
        child = conn.execute(_CHAIN_STEP_SQL, (current,)).fetchone()
        if child is None:
            return keys
        current = child["id"]
        if current in keys:
            raise RuntimeError("Cyclic compression continuation")
        keys.add(current)
    raise RuntimeError("Compression continuation exceeds bound")


def snapshot(profile):
    from pathlib import Path

    from hermes_cli.web_server_profiles import _resolve_profile_dir
    from hermes_constants import get_process_hermes_home
    from hermes_state_local import local_lineage_owner
    from tui_gateway import server
    from tui_gateway.session_lifecycle import _CANONICAL_PENDING_SQL

    # Resolve an actual named home, never an implicit current/ambient scope.
    home = _resolve_profile_dir(profile).resolve()
    # Legacy session.active_list ignores its profile parameter. Filter the actual
    # registry BEFORE projecting it; DB membership cannot prove runtime ownership
    # (the same stored ID can exist in two profiles). No titles or prompts leave.
    with server._sessions_lock:
        rows = list(server._sessions.items())
    sessions = []
    for runtime, record in rows:
        owner = Path(record.get("profile_home") or get_process_hermes_home()).resolve()
        if owner != home or record.get("_finalized"):
            continue
        key = server._session_lookup_key(record, fallback=runtime)  # ty: ignore[unresolved-attribute]
        keys = {key}
        keys_complete = False
        status = server._session_live_status(runtime, record)  # ty: ignore[unresolved-attribute]
        try:
            # The legacy running bit does not represent forwarded canonical work.
            # Inspect the owning profile's durable ledger, including compression
            # ancestors and the canonical chat owner. Discovery of a gateway alone
            # cannot establish ownership of this particular session.
            with server._session_db(record) as db:  # ty: ignore[unresolved-attribute]
                if db is None:
                    raise RuntimeError("Activity database unavailable")
                with db._read_ctx() as conn:
                    # A savepoint holds one SQLite read snapshot even on pooled
                    # autocommit readers. Never stitch pre/post-rotation edges
                    # or ledger results together; release it before returning.
                    conn.execute("SAVEPOINT chathermes_activity")
                    try:
                        aliases = keys | _compression_aliases(conn, key)
                        keys = aliases
                        keys_complete = True
                        # Compression and tool children inherit chat_id even
                        # when they are outside the owner's receipt lineage.
                        targets = aliases | {local_lineage_owner(conn, t) for t in aliases}
                        if any(
                            conn.execute(_CANONICAL_PENDING_SQL, (t, t)).fetchone() for t in targets
                        ):
                            if status not in ("working", "waiting"):
                                status = "unknown"
                    finally:
                        conn.execute("RELEASE chathermes_activity")
        except Exception:
            # No exception text, prompt, path or owner credential leaves this read.
            # Missing/failed ledger reads cannot attest idle (or reap event state).
            # They also cannot negate confirmed native work on a fresh mount.
            if status not in ("working", "waiting"):
                status = "unknown"
        sessions.append(
            {
                "id": runtime,
                "session_key": key,
                "session_keys": sorted(keys),
                "session_keys_complete": keys_complete,
                "status": status,
            }
        )
    return {"sessions": sessions}
