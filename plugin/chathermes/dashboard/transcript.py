"""Bounded, profile-local display pages using the reviewed SessionDB contract.

The gateway drops summary flags and display metadata. Keep its ordinary proxy
unchanged; the opt-in transcript extension supplies markers without summary text.
"""

import hashlib
import json

from fastapi import HTTPException


def _metadata(db, sid):
    lineage = db._resume_lineage_ids(sid)
    slots = ",".join("?" for _ in lineage)
    # Fixed-width identities only, plus bodies of explicitly flagged carriers.
    # Never materialize the whole conversation's payload to page one segment.
    rows = db._read_all(
        f"""SELECT id, session_id, active, compacted, display_order,
        hex(display_identity) AS identity, message_uid, _compressed_summary, timestamp,
        display_kind, display_metadata,
        CASE WHEN _compressed_summary = 1 THEN content ELSE NULL END AS summary
        FROM messages WHERE session_id IN ({slots}) ORDER BY id""",
        lineage,
    )
    values = [dict(row) for row in rows]
    segments = []
    for segment in lineage:
        session = db.get_session(segment)
        segments.append(
            {
                key: session.get(key)
                for key in ("id", "parent_session_id", "end_reason", "profile_name")
            }
        )
    revision = hashlib.sha256(
        json.dumps([sid, segments, values], sort_keys=True).encode()
    ).hexdigest()
    return values, revision


def read_page(db, session_id, profile, limit=120, offset=0, revision=None):
    from hermes_cli.web_routers.sessions import _history_profile_home, _project_for_display

    owner = profile or "default"
    session = db.get_session(session_id)
    if not session or session.get("profile_name") not in (None, owner):
        raise HTTPException(404, "Session not found")
    sid = db.resolve_resume_session_id(session_id)
    session = db.get_session(sid)
    if not session or session.get("profile_name") not in (None, owner):
        raise HTTPException(404, "Session not found")
    if any(
        db.get_session(segment).get("profile_name") not in (None, owner)
        for segment in db._resume_lineage_ids(sid)
    ):
        raise HTTPException(404, "Session not found")
    metadata, stamp = _metadata(db, sid)
    if revision and revision != stamp:
        raise HTTPException(409, "Transcript changed; refresh before loading earlier messages")
    # One preceding row defines the open interval at a page boundary, even when
    # a protected tail's current representative was inserted after compaction.
    rows = db.get_messages(
        sid,
        limit=limit + 1,
        offset=offset,
        latest=True,
        include_compacted=True,
        include_ancestors=True,
    )
    has_more = len(rows) > limit
    previous = rows.pop(0) if has_more else None
    by_id = {row["id"]: row for row in metadata}
    first, first_uid = {}, {}
    for row in metadata:
        key = row["identity"]
        if row["message_uid"]:
            first_uid.setdefault(row["message_uid"], row["id"])
        if key:
            first.setdefault(key, row["id"])

    def position(row):
        meta = by_id[int(row["id"])]
        original = first.get(meta["identity"], meta["id"])
        carrier = (
            first_uid.get(meta["message_uid"], meta["id"])
            if row.get("_compressed_summary")
            else meta["id"]
        )
        return min(original, carrier, meta["display_order"] or meta["id"])

    # The summary flag is durable authority. Copies of the same carrier are
    # one boundary; changed carriers (including the same uid) are distinct.
    boundaries, retained = {}, set()
    for row in metadata:
        if row["_compressed_summary"]:
            key = (row["message_uid"] or row["timestamp"], row["summary"])
            boundaries.setdefault(key, row["id"])
            if row["active"] or row["compacted"]:
                retained.add(key)
    boundaries = {boundaries[key] for key in retained}
    # A proven compression edge is also durable authority for old rotations
    # whose handoff did not persist a summary flag. Branch/reset edges are not.
    for segment in db._resume_lineage_ids(sid):
        child = db.get_session(segment)
        parent = (
            db.get_session(child["parent_session_id"]) if child.get("parent_session_id") else None
        )
        if parent and parent.get("end_reason") == "compression":
            first_child = next((row for row in metadata if row["session_id"] == segment), None)
            if first_child:
                boundaries.add(first_child["id"])
    boundaries = sorted(boundaries)
    projected = _project_for_display(
        rows, home=_history_profile_home(profile or None), inline_images=True
    )
    safe_keys = (
        "id",
        "session_id",
        "role",
        "content",
        "display_content",
        "display_kind",
        "display_metadata",
        "tool_name",
        "tool_call_id",
        "tool_calls",
        "reasoning",
        "reasoning_content",
        "timestamp",
    )
    result = []
    lower = position(previous) if previous else -1
    # Standalone summaries are physically inserted before the protected tail,
    # whose logical first rows precede the compression. They are scaffolding,
    # never a chronological anchor.
    if previous and previous.get("_compressed_summary"):
        from agent.compaction_display import project_compaction_message_for_display

        if project_compaction_message_for_display(previous) is None:
            lower = min([lower, *(position(row) for row in rows)]) - 1
    emitted = set()
    for raw, display in zip(rows, projected, strict=True):
        upper = position(raw)
        if raw.get("_compressed_summary") and display.get("display_kind") == "hidden":
            continue
        for boundary in boundaries:
            if lower < boundary <= upper and boundary not in emitted:
                emitted.add(boundary)
                result.append(
                    {
                        "id": f"compaction-{boundary}",
                        "role": "system",
                        "content": "",
                        "display_kind": "compaction",
                    }
                )
        clean = {key: display[key] for key in safe_keys if key in display}
        clean["display_id"] = str(upper)
        if "display_content" in clean:
            clean["content"] = clean["display_content"]
        if isinstance(clean.get("content"), list):
            content = []
            for index, part in enumerate(clean["content"]):
                url = (part.get("image_url") or {}).get("url") if isinstance(part, dict) else None
                if isinstance(url, str) and url.startswith("data:image/"):
                    part = {
                        **part,
                        "image_url": {
                            **part["image_url"],
                            "url": f"/api/plugins/chathermes/artifact-images/{session_id}/{raw['id']}/{index}",
                        },
                    }
                content.append(part)
            clean["content"] = content
            if "display_content" in clean:
                clean["display_content"] = content
        if clean.get("display_kind") == "hidden":
            clean = {key: clean[key] for key in ("id", "role", "display_kind") if key in clean}
            clean["content"] = ""
        result.append(clean)
        lower = max(lower, upper)
    if offset == 0:
        for boundary in boundaries:
            if boundary > lower and boundary not in emitted:
                result.append(
                    {
                        "id": f"compaction-{boundary}",
                        "role": "system",
                        "content": "",
                        "display_kind": "compaction",
                    }
                )
    _, after = _metadata(db, sid)
    if after != stamp or db.resolve_resume_session_id(session_id) != sid:
        raise HTTPException(409, "Transcript changed during read; refresh and retry")
    return {
        "session_id": sid,
        "data": result,
        "pagination": {"order": "latest", "limit": limit, "offset": offset, "returned": len(rows)},
        "transcript": {"revision": stamp, "next_offset": offset + len(rows), "has_more": has_more},
    }


def read_profile_page(profile, session_id, limit, offset, revision):
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    db = _open_session_db_for_profile(profile or None, read_only=True)
    try:
        columns = {row["name"] for row in db._read_all("PRAGMA table_info(messages)")}
        if (
            not {
                "display_identity",
                "display_order",
                "message_uid",
                "_compressed_summary",
                "compacted",
            }
            <= columns
        ):
            raise NotImplementedError("Transcript metadata unavailable")
        return read_page(db, session_id, profile, limit, offset, revision)
    finally:
        db.close()


def read_inline_image(profile, session_id, message_id, part_index):
    """Resolve one authenticated address without downloading/scanning a transcript."""
    from gateway.platforms.api_server import _project_client_message
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    db = _open_session_db_for_profile(profile or None, read_only=True)
    try:
        session = db.get_session(session_id)
        if not session or session.get("profile_name") not in (None, profile or "default"):
            raise ValueError("Session not found")
        sid = db.resolve_resume_session_id(session_id)
        lineage = db._resume_lineage_ids(sid)
        if any(
            db.get_session(segment).get("profile_name") not in (None, profile or "default")
            for segment in lineage
        ):
            raise ValueError("Session not found")
        slots = ",".join("?" for _ in lineage)
        raw = db._read_one(
            f"SELECT * FROM messages WHERE id = ? AND session_id IN ({slots}) AND (active = 1 OR compacted = 1)",
            (message_id, *lineage),
        )
        if raw is None:
            raise ValueError("Image not found")
        row = db._row_to_message_dict(raw, warn_context="inline image", summary_flag=True)
        display = _project_client_message(row)
        if (
            display.get("role") not in ("user", "assistant")
            or display.get("display_kind") == "hidden"
        ):
            raise ValueError("Image not visible")
        return display["content"][part_index]["image_url"]["url"]
    finally:
        db.close()
