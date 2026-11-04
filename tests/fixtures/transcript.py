"""Deterministic history through real Hermes persistence verbs; no handler mocks."""


def seed_uncovered(db, root, turns=140):
    db.create_session(root, source="desktop", profile_name="default")
    for n in range(turns):
        # Even identical timestamps must not fold distinct occurrence UIDs.
        db.append_message(root, "user", "Genuine repeated prompt", timestamp=1700000000)
        db.append_message(root, "assistant", f"Distinct answer {n:03d}", timestamp=1700000000)
    return {"id": root, "turns": turns}


def compact_uncovered(db, root):
    db.archive_and_compact(
        root,
        [{"role": "user", "content": "INTERNAL GAP SUMMARY", "_compressed_summary": True}],
        covered_ids=[row["id"] for row in db.get_messages(root) if row["role"] == "assistant"],
    )
    return {"id": root}


def seed(db, root):
    def append(sid, start, stop):
        for n in range(start, stop):
            db.append_message(
                sid, "user", f"Persisted prompt {n:03d}", timestamp=1700000000 + n * 2
            )
            db.append_message(
                sid, "assistant", f"Persisted answer {n:03d}", timestamp=1700000001 + n * 2
            )

    def summary(n):
        return {
            "role": "user",
            "content": f"INTERNAL COMPACTION SUMMARY {n}",
            "_compressed_summary": True,
            "timestamp": 1800000000 + n,
        }

    db.create_session(root, source="desktop", profile_name="default")
    append(root, 0, 80)
    tail = db.get_messages(root)[-8:]
    db.archive_and_compact(root, [summary(1), *tail], tail_count=8)
    append(root, 80, 120)
    tail = db.get_messages(root)[-8:]
    db.archive_and_compact(root, [summary(2), *tail], tail_count=8)
    append(root, 120, 140)
    child = root + "-rotation"
    db.publish_compression_child(
        parent_session_id=root,
        child_session_id=child,
        source="desktop",
        profile_name="default",
        messages=[summary(3), *db.get_messages(root)[-8:]],
        require_compression_lease=False,
    )
    append(child, 140, 170)
    target = next(row for row in db.get_messages(child) if row["content"] == "Persisted prompt 168")
    db.rewind_to_message(child, target["id"])
    db.append_message(child, "user", "Replacement after rewind")
    db.append_message(child, "assistant", "Replacement saved answer")
    return {"id": root, "tip": child}


def seed_legacy_pruned(db, root):
    """Legacy UID migration and assistant pruning through real persistence APIs."""
    db.create_session(root, source="desktop", profile_name="default")
    for _ in range(2):
        db.append_message(root, "user", "Repeated legacy ask", timestamp=1700000000)
        db.append_message(root, "assistant", "Repeated legacy answer", timestamp=1700000001)
    held = db.get_messages_as_conversation(root, include_row_ids=True)
    db.archive_and_compact(
        root,
        [
            {"role": "user", "content": "INTERNAL LEGACY SUMMARY", "_compressed_summary": True},
            *held,
        ],
    )

    def legacy(conn):
        conn.execute("UPDATE messages SET message_uid = NULL WHERE session_id = ?", (root,))
        conn.execute(
            "DELETE FROM state_meta WHERE key IN ('message_uid_backfill', 'message_uid_backfill_id')"
        )
        db._advance_message_uid_backfill(conn.cursor())

    db._execute_write(legacy)
    db.append_message(root, "user", "Inspect assistant prune")
    db.append_message(root, "assistant", "Original assistant before prune")
    original = db.get_messages_as_conversation(root, include_row_ids=True)[-1]
    db.rewrite_pruned_rows(root, [(original, {**original, "content": "Pruned assistant response"})])
    return {"id": root}


def seed_legacy_rotated(db, root):
    """Rotate before the real UID migration; keep active originals in the parent."""
    db.create_session(root, source="desktop", profile_name="default")
    for _ in range(2):
        db.append_message(root, "user", "Repeated rotated ask", timestamp=1700000000)
        db.append_message(root, "assistant", "Repeated rotated answer", timestamp=1700000001)
    child = root + "-rotation"
    db.publish_compression_child(
        parent_session_id=root,
        child_session_id=child,
        source="desktop",
        profile_name="default",
        messages=[
            {"role": "user", "content": "INTERNAL LEGACY ROTATION", "_compressed_summary": True},
            *db.get_messages_as_conversation(root, include_row_ids=True),
        ],
        require_compression_lease=False,
    )

    def legacy(conn):
        conn.execute(
            "UPDATE messages SET message_uid = NULL WHERE session_id IN (?, ?)", (root, child)
        )
        conn.execute(
            "DELETE FROM state_meta WHERE key IN ('message_uid_backfill', 'message_uid_backfill_id')"
        )
        db._advance_message_uid_backfill(conn.cursor())

    db._execute_write(legacy)
    return {"id": root, "tip": child}


def rewind_legacy_rotated(db, root):
    child = root + "-rotation"
    users = [row for row in db.get_messages(child) if row["role"] == "user"]
    db.rewind_to_message(child, users[-1]["id"])
    return {"id": root, "tip": child}
