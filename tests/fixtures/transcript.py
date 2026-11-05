"""Deterministic history through real Hermes persistence verbs; no handler mocks."""


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


def seed_uncovered_clones(db, root):
    """Synthetic assistant-only coverage; not a production coverage diagnosis."""
    db.create_session(root, source="desktop", profile_name="default")
    for n in range(6):
        db.append_message(root, "user", f"Clone prompt {n}", timestamp=1700000100 + n * 2)
        db.append_message(root, "assistant", f"Clone answer {n}", timestamp=1700000101 + n * 2)
    before = db.get_messages(root)
    db.archive_and_compact(
        root,
        [{"role": "user", "content": "INTERNAL CLONE SUMMARY", "_compressed_summary": True}],
        covered_ids=[row["id"] for row in before if row["role"] == "assistant"],
    )
    return {
        "id": root,
        "before": [
            {"id": row["id"], "role": row["role"], "content": row["content"]} for row in before
        ],
    }
