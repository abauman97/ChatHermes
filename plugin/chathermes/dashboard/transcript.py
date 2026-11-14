"""Authenticated Desktop display history with scoped, mutation-fenced pages.

Use the pinned Desktop REST route's selection and projection. Multi-ancestor
reads still materialize all upstream payloads before paging; HTTP size alone
is not a bound on database work.
"""

import hashlib
import json

from fastapi import HTTPException


def _revision(db, sid):
    # Hermes owns mutation detection as well as history selection. This stamp
    # fences offsets; it never participates in row selection or ordering.
    return hashlib.sha256(
        json.dumps(db.conversation_revision(sid, include_ancestors=True)).encode()
    ).hexdigest()


def _skill_display(content):
    # Desktop's REST projection omits the skill projection that native history
    # applies. Use Hermes's own display parser; never return model scaffolding
    # as a user bubble, including after reload or command-triggered hydration.
    from agent.skill_commands import describe_skill_invocation

    if isinstance(content, str):
        return describe_skill_invocation(content, separator=" ") or content
    if isinstance(content, list):
        return [
            {**part, "text": _skill_display(part["text"])}
            if isinstance(part, dict) and part.get("type") == "text" and "text" in part
            else part
            for part in content
        ]
    return content


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
    stamp = _revision(db, sid)
    if revision and revision != stamp:
        raise HTTPException(409, "Transcript changed; refresh before loading earlier messages")
    rows = db.get_messages(
        sid,
        limit=limit + 1,
        offset=offset,
        latest=True,
        include_compacted=True,
        include_ancestors=True,
    )
    has_more = len(rows) > limit
    if has_more:
        rows.pop(0)
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
        "tool_call_labels",
        "reasoning",
        "reasoning_content",
        "timestamp",
    )
    result = []
    for raw, display in zip(rows, projected, strict=True):
        clean = {key: display[key] for key in safe_keys if key in display}
        if "display_content" in clean:
            clean["content"] = clean["display_content"]
        if clean.get("role") == "user" and not clean.get("display_kind"):
            content = _skill_display(clean.get("content"))
            if content != clean.get("content"):
                clean.update(
                    content=content, display_content=content, display_kind="skill_invocation"
                )
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
    after = _revision(db, sid)
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
        return read_page(db, session_id, profile, limit, offset, revision)
    finally:
        db.close()


def read_inline_image(profile, session_id, message_id, part_index):
    """Resolve one authenticated address without downloading/scanning a transcript."""
    from hermes_cli.web_routers.sessions import _history_profile_home, _project_for_display
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
        display = _project_for_display(
            [row], home=_history_profile_home(profile or None), inline_images=True
        )[0]
        if "display_content" in display:
            display["content"] = display["display_content"]
        if (
            display.get("role") not in ("user", "assistant")
            or display.get("display_kind") == "hidden"
        ):
            raise ValueError("Image not visible")
        return display["content"][part_index]["image_url"]["url"]
    finally:
        db.close()
