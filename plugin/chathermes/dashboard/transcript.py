"""Bounded, profile-local display pages using the reviewed SessionDB contract.

The gateway drops summary flags and display metadata. Keep its ordinary proxy
unchanged; the opt-in transcript extension supplies markers without summary text.
"""

import hashlib
import json

from fastapi import HTTPException


def _metadata(db, sid):
    from hermes_state_identity import _uid_list

    lineage = db._resume_lineage_ids(sid)
    slots = ",".join("?" for _ in lineage)
    # Keep fixed-width identities and carrier fingerprints, never all payloads.
    # Only unindexed legacy rows need their body to compute an identity.
    values = []
    with db._read_ctx() as conn:
        rows = conn.execute(
            f"""SELECT id, session_id, active, compacted, display_order,
            hex(display_identity) AS identity, message_uid, _compressed_summary, timestamp,
            absorbed_message_uids, display_kind, display_metadata, role,
            CASE WHEN display_identity IS NULL OR _compressed_summary = 1 THEN content END AS content,
            CASE WHEN display_identity IS NULL THEN tool_calls END AS tool_calls,
            tool_call_id, tool_name
            FROM messages WHERE session_id IN ({slots}) ORDER BY id""",
            lineage,
        )
        for raw in rows:
            row = dict(raw)
            if not row["identity"]:
                row["identity"] = db._display_identity(db._display_dedupe_key(raw)).hex().upper()
            row["display_metadata"] = db._decode_display_metadata(row["display_metadata"])
            row["absorbed_message_uids"] = _uid_list(row["absorbed_message_uids"])
            content = row.pop("content")
            row.pop("tool_calls")
            row["summary"] = (
                hashlib.sha256(json.dumps(content).encode()).hexdigest()
                if row["_compressed_summary"]
                else None
            )
            values.append(row)
    segments = []
    for segment in lineage:
        session = db.get_session(segment)
        segments.append(
            {
                key: session.get(key)
                for key in (
                    "id",
                    "parent_session_id",
                    "end_reason",
                    "profile_name",
                    "transcript_revision",
                )
            }
        )
    revision = hashlib.sha256(
        json.dumps([sid, segments, values], sort_keys=True).encode()
    ).hexdigest()
    return values, revision


def _occurrence_aliases(metadata):
    """Recover legacy copy links without collapsing repeated rows in a generation.

    The v31 backfill minted a different UID for every physical row. Only join
    otherwise unlinked occurrences across a summary/lineage boundary, with an
    identical indexed identity and slot. Match ordinally to retain multiplicity.
    Explicit UID copy links take precedence over this legacy fallback. Metadata
    spans only the runtime's verified compression lineage; rotation keeps the
    closed parent's rows active, unlike in-place compaction.
    """
    from collections import Counter, defaultdict

    counts = Counter(row["message_uid"] for row in metadata if row["message_uid"])
    generations = []
    segment = None
    current = defaultdict(list)
    seen = set()
    for row in metadata:
        if row["session_id"] != segment or row["_compressed_summary"]:
            current = defaultdict(list)
            generations.append(current)
            seen = set()
            segment = row["session_id"]
        uid = row["message_uid"]
        if not uid or row["_compressed_summary"] or uid in seen:
            continue
        seen.add(uid)
        current[row["identity"]].append(row)
    aliases, previous = {}, {}
    for generation in generations:
        for identity, peers in generation.items():
            candidates = previous.get(identity, [])
            # A shared UID already identifies the carried occurrences for this
            # identity. Mixing ordinal inference with those explicit links can
            # attach a fresh repeated send to a different, uncarried original.
            if {row["message_uid"] for row in candidates} & {row["message_uid"] for row in peers}:
                continue
            # Compaction carries a suffix. If it carries only the last of N
            # identical occurrences, do not attach it to the first occurrence.
            shift = max(0, len(candidates) - len(peers))
            for ordinal, row in enumerate(peers):
                if ordinal + shift >= len(candidates):
                    break
                origin = candidates[ordinal + shift]
                uid, old_uid = row["message_uid"], origin["message_uid"]
                if (
                    counts[old_uid] == 1
                    and uid != old_uid
                    and row["display_order"] is not None
                    and (
                        row["session_id"] != origin["session_id"]
                        or (
                            not origin["active"] and row["display_order"] == origin["display_order"]
                        )
                    )
                ):
                    aliases[uid] = aliases.get(old_uid, old_uid)
        previous.update(generation)
    return aliases


def _display_plan(metadata):
    """Choose retained representatives before slicing, including retired anchors.

    UID distinguishes genuine occurrences; identity distinguishes rewritten
    payloads (e.g. full tool output vs pruned stub). Legacy identities already
    include timestamps/tool identity; never deduplicate by content alone.
    A removed newest generation suppresses its copies across the lineage.
    """
    # Full output and a shortened handoff share an occurrence UID, but have
    # different payload identities. Rotation leaves the parent's rows active;
    # display_order is comparable only within one session. Metadata already
    # spans the verified, profile-owned compression lineage.
    tool_originals = {}
    for row in metadata:
        if (
            row["role"] == "tool"
            and row["message_uid"]
            and (row["active"] or row["compacted"])
            and row["display_order"] is not None
            and not (row["display_metadata"] or {}).get("model_only")
        ):
            owner = (row["message_uid"], row["timestamp"])
            tool_originals.setdefault(owner, row)
    aliases = _occurrence_aliases(metadata)
    first, first_uid, newest, uid_removed, chosen, positions = {}, {}, {}, {}, {}, {}
    for row in metadata:
        uid = aliases.get(row["message_uid"], row["message_uid"])
        key = (uid, row["identity"] or row["id"])
        if row["_compressed_summary"] and uid:
            key = first_uid.get(uid, key)
        elif uid:
            first_uid.setdefault(uid, key)
        first.setdefault(key, row["id"])
        positions[row["id"]] = first[key]
        removed = not (row["active"] or row["compacted"])
        newest[key] = removed
        for copied_uid in [uid, *row["absorbed_message_uids"]]:
            if copied_uid:
                uid_removed[aliases.get(copied_uid, copied_uid)] = removed
        if removed or (row["display_metadata"] or {}).get("model_only"):
            continue
        if row["role"] == "tool" and row["display_order"] is not None:
            origin = tool_originals.get((row["message_uid"], row["timestamp"]))
            if origin and (
                origin["session_id"] != row["session_id"]
                or origin["display_order"] < row["display_order"]
            ):
                continue
        current = chosen.get(key)
        if current is None or (row["active"], row["id"]) > (current["active"], current["id"]):
            chosen[key] = row
    retained = [
        row
        for key, row in chosen.items()
        if not newest[key]
        and not uid_removed.get(aliases.get(row["message_uid"], row["message_uid"]), False)
    ]
    retained.sort(key=lambda row: positions[row["id"]])
    # In-place pruning keeps the original slot. Choose its live representative
    # once, rather than emitting the archived full copy beside that same slot.
    slots, result = {}, []
    by_id = {row["id"]: row for row in metadata}
    for row in retained:
        origin = by_id[positions[row["id"]]]
        if not origin["message_uid"] or origin["display_order"] is None:
            result.append(row)
            continue
        slot = (
            origin["session_id"],
            origin["message_uid"],
            origin["timestamp"],
            origin["display_order"],
        )
        previous = slots.get(slot)
        if previous is None:
            slots[slot] = row
        else:
            winner = max((previous, row), key=lambda item: (item["active"], item["id"]))
            positions[winner["id"]] = min(positions[previous["id"]], positions[row["id"]])
            slots[slot] = winner
    result.extend(slots.values())
    result.sort(key=lambda row: positions[row["id"]])
    return result, positions


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
    # Page the metadata plan, not Hermes's display_order: retired originals
    # still anchor retained copies. Decode only this page plus one boundary row.
    plan, positions = _display_plan(metadata)
    selected = plan[::-1][offset:][: limit + 1][::-1]
    selected_ids = [row["id"] for row in selected]
    payloads = {}
    for start in range(0, len(selected_ids), 900):
        chunk = selected_ids[start : start + 900]
        slots = ",".join("?" for _ in chunk)
        payloads.update(
            {
                row["id"]: row
                for row in db._read_all(f"SELECT * FROM messages WHERE id IN ({slots})", chunk)
            }
        )
    if len(payloads) != len(selected_ids):
        raise HTTPException(409, "Transcript changed during read; refresh and retry")
    rows = [
        db._row_to_message_dict(payloads[row_id], warn_context="transcript", summary_flag=True)
        for row_id in selected_ids
    ]
    has_more = len(rows) > limit
    previous = rows.pop(0) if has_more else None

    def position(row):
        return positions[int(row["id"])]

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
                "absorbed_message_uids",
                "_compressed_summary",
                "compacted",
            }
            <= columns
        ):
            raise NotImplementedError("Transcript metadata unavailable")
        if "transcript_revision" not in {
            row["name"] for row in db._read_all("PRAGMA table_info(sessions)")
        }:
            raise NotImplementedError("Transcript revision unavailable")
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
