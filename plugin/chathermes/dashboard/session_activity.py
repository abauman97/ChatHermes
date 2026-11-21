"""Minimal legacy live-status projection with strict runtime profile ownership."""


def _compression_aliases(store, key):
    """Verified preferred ancestors and continuation on the ledger's read snapshot."""

    # Collect genuine compression ancestry first, then let Hermes choose each
    # preferred path once. Asking chain(parent) at every hop repeatedly scans
    # the same suffix of a long straight lineage.
    ancestors = [key]
    seen = {key}
    current = key
    for _ in range(4096):
        row = store.sessions.get(current)
        if row is None or not store.lineage.is_compression_child(row):
            break
        parent = row.parent_session_id
        if parent in seen:
            raise RuntimeError("Cyclic compression ancestry")
        seen.add(parent)
        ancestors.append(parent)
        current = parent
    else:
        raise RuntimeError("Compression ancestry exceeds bound")

    path = list(reversed(ancestors))
    offset = 0
    while offset < len(path):
        chain = store.lineage.chain(path[offset])
        if (
            not chain
            or chain[0] != path[offset]
            or len(chain) != len(set(chain))
            or len(chain) > 4096
        ):
            raise RuntimeError("Invalid compression continuation")
        shared = 0
        while (
            offset + shared < len(path)
            and shared < len(chain)
            and path[offset + shared] == chain[shared]
        ):
            shared += 1
        if offset + shared == len(path):
            return set(chain)
        # A preferred edge diverged from this runtime's ancestry. Neither that
        # parent nor its ancestors can alias the off-path child; restart there.
        offset += shared
    raise RuntimeError("Compression continuation unavailable")


def snapshot(profile):
    from pathlib import Path

    from hermes_cli.web_server_profiles import _resolve_profile_dir
    from hermes_constants import get_process_hermes_home
    from tui_gateway import server

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
                with db.messages.read_snapshot() as consistent:
                    aliases = keys | _compression_aliases(db, key)
                    if not consistent():
                        raise RuntimeError("Activity snapshot changed")
                    keys = aliases
                    keys_complete = True
                    targets = aliases | {db.bindings.lineage_owner(t) for t in aliases}
                    pending = any(db.runtime.pending_ledger_status(t) for t in targets)
                    if not consistent():
                        keys = {key}
                        keys_complete = False
                        raise RuntimeError("Activity snapshot changed")
                    if pending and status not in ("working", "waiting"):
                        status = "unknown"
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
