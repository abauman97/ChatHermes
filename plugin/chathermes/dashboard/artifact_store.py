"""Artifact metadata, atomic session replacement, and SQL keyset pagination."""

import base64
import json
import time

from .database import database


def checkpoints(store, profile):
    with database(store) as db:
        return {
            row[0]: {"modification": row[1], "indexed_at": row[2], "status": row[3]}
            for row in db.execute(
                "SELECT session,modification,indexed_at,status FROM artifact_sessions WHERE profile=?",
                (profile,),
            )
        }


def replace_session(store, profile, session, modification, files):
    with database(store) as db:
        db.execute(
            "INSERT INTO artifact_sessions VALUES (?,?,?,?,?,NULL) ON CONFLICT(profile,session) DO UPDATE SET modification=excluded.modification,indexed_at=excluded.indexed_at,status=excluded.status,error=NULL",
            (profile, session["id"], modification, time.time(), "ready"),
        )
        db.execute("DELETE FROM artifacts WHERE profile=? AND session=?", (profile, session["id"]))
        for file in files:
            db.execute(
                """INSERT OR IGNORE INTO artifacts
                SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS
                (SELECT 1 FROM artifact_deletions WHERE profile=? AND session=? AND path=?)""",
                (
                    profile,
                    session["id"],
                    file["path"],
                    file.get("messageId"),
                    file["name"],
                    file["type"],
                    file.get("size"),
                    file["direction"],
                    file.get("createdAt") or "",
                    session.get("title") or "Untitled session",
                    session.get("projectId"),
                    session.get("projectTitle"),
                    profile,
                    session["id"],
                    file["path"],
                ),
            )


def failed(store, profile, session):
    with database(store) as db:
        # Fixed error only: gateway failures can contain credentials and paths.
        db.execute(
            "INSERT INTO artifact_sessions(profile,session,status,error) VALUES (?,?,'failed','History unavailable') ON CONFLICT(profile,session) DO UPDATE SET status='failed',error='History unavailable'",
            (profile, session),
        )


def remove_session(store, profile, session):
    with database(store) as db:
        db.execute(
            "DELETE FROM artifact_sessions WHERE profile=? AND session=?", (profile, session)
        )
        db.execute(
            "DELETE FROM artifact_deletions WHERE profile=? AND session=?", (profile, session)
        )


def remove_file(store, profile, session, path):
    with database(store) as db:
        # A path can be referenced by several sessions in the same profile.
        db.execute(
            "INSERT OR IGNORE INTO artifact_deletions SELECT profile,session,path FROM artifacts WHERE profile=? AND path=?",
            (profile, path),
        )
        db.execute(
            "INSERT OR IGNORE INTO artifact_deletions VALUES (?,?,?)", (profile, session, path)
        )
        db.execute("DELETE FROM artifacts WHERE profile=? AND path=?", (profile, path))


def page(store, profile, project=None, limit=50, cursor=None):
    if not 1 <= limit <= 100:
        raise ValueError("Invalid page size")
    where, args = ["profile=?"], [profile]
    if project is not None:
        where.append("project_id=?")
        args.append(project)
    if cursor:
        try:
            if len(cursor) > 12000:
                raise ValueError()
            value = json.loads(base64.urlsafe_b64decode(cursor + "=" * (-len(cursor) % 4)))
            if (
                not isinstance(value, list)
                or len(value) != 5
                or value[:2] != [profile, project]
                or not all(isinstance(part, str) for part in value[2:])
            ):
                raise ValueError()
        except Exception:
            raise ValueError("Invalid artifact cursor") from None
        where.append("(created_at,session,path)<(?,?,?)")
        args.extend(value[2:])
    with database(store) as db:
        rows = db.execute(
            "SELECT session,path,message_id,filename,mime,size,direction,created_at,session_title,project_id,project_title FROM artifacts WHERE "
            + " AND ".join(where)
            + " ORDER BY created_at DESC,session DESC,path DESC LIMIT ?",
            (*args, limit + 1),
        ).fetchall()
    files = [
        dict(
            zip(
                (
                    "sessionId",
                    "path",
                    "messageId",
                    "name",
                    "type",
                    "size",
                    "direction",
                    "createdAt",
                    "sessionTitle",
                    "projectId",
                    "projectTitle",
                ),
                row,
                strict=True,
            )
        )
        for row in rows[:limit]
    ]
    files = [{key: value for key, value in file.items() if value is not None} for file in files]
    next_cursor = None
    if len(rows) > limit:
        last = rows[limit - 1]
        next_cursor = (
            base64.urlsafe_b64encode(
                json.dumps(
                    [profile, project, last[7], last[0], last[1]], separators=(",", ":")
                ).encode()
            )
            .decode()
            .rstrip("=")
        )
    return {"files": files, "nextCursor": next_cursor}
