"""Durable notification addresses, independent of push and native request resolution."""

import asyncio
import math
import time
from typing import override

from .artifact_indexer import Source as HistorySource
from .artifact_indexer import modification
from .database import database

LABELS = {
    "turn.complete": "Response completed",
    "approval": "Approval required",
    "clarify": "Clarification required",
    "attention": "Attention required",
}


def insert(db, profile, session, identity, kind, occurred, title, preview):
    db.execute(
        """INSERT OR IGNORE INTO inbox
        (profile,session,event_id,kind,occurred,title,preview) VALUES (?,?,?,?,?,?,?)""",
        (profile, session, str(identity), kind, occurred, title[:200], preview[:400]),
    )


def record(store, profile, session, identity, kind, *, occurred=None, title="", preview=""):
    if kind not in LABELS:
        raise ValueError("Invalid inbox event")
    with database(store) as db:
        insert(
            db,
            profile,
            session,
            identity,
            kind,
            occurred or time.time(),
            title,
            preview or LABELS[kind],
        )


def initialize(store, profile):
    with database(store) as db:
        db.execute("INSERT OR IGNORE INTO inbox_profiles VALUES (?,?)", (profile, time.time()))
        return db.execute(
            "SELECT since FROM inbox_profiles WHERE profile=?", (profile,)
        ).fetchone()[0]


def checkpoints(store, profile):
    with database(store) as db:
        return {
            session: (row, change, scanned)
            for session, row, change, scanned in db.execute(
                "SELECT session,row_id,modification,scanned FROM inbox_checkpoints WHERE profile=?",
                (profile,),
            )
        }


def reconcile_rows(store, profile, session, rows, since, change, redact):
    """Commit the addresses and checkpoint together; replay never resurrects read/deleted rows."""
    with database(store) as db:
        last = 0
        # Only the final persisted row of each user turn is a response. Tool
        # narration and earlier prose in the same turn must not become notices.
        finals = set()
        tail = None
        for row in rows:
            if row.get("role") == "user":
                if tail is not None:
                    finals.add(tail)
                tail = None
            else:
                tail = row["id"] if row.get("role") == "assistant" else None
        if tail is not None:
            finals.add(tail)
        for row in rows:
            last = max(last, row["id"])
            content = row.get("content")
            occurred = row.get("timestamp")
            if (
                row.get("role") != "assistant"
                or row["id"] not in finals
                or row.get("tool_calls")
                or row.get("_compressed_summary")
                or row.get("display_kind")
                or row.get("finish_reason") not in (None, "stop", "end_turn")
                or not isinstance(content, str)
                or not content.strip()
                or not isinstance(occurred, (int, float))
                or occurred < since
            ):
                continue
            insert(
                db,
                profile,
                session["id"],
                row.get("message_uid") or str(row["id"]),
                "turn.complete",
                occurred,
                redact(session.get("title") or "Untitled chat"),
                redact(content)[:400],
            )
        db.execute(
            """INSERT INTO inbox_checkpoints VALUES (?,?,?,?,?) ON CONFLICT(profile,session)
            DO UPDATE SET row_id=MAX(row_id,excluded.row_id), modification=excluded.modification,
            scanned=excluded.scanned""",
            (profile, session["id"], last, change, time.time()),
        )


def page(store, profiles, *, limit=50, cursor=None, unread=False):
    if not 1 <= limit <= 100:
        raise ValueError("Invalid limit")
    placeholders = ",".join("?" for _ in profiles) or "NULL"
    where = f"profile IN ({placeholders}) AND deleted=0"
    args = list(profiles)
    with database(store) as db:
        revision = db.execute(
            f"SELECT COUNT(*),COALESCE(SUM(read),0),COALESCE(SUM(deleted),0) FROM inbox WHERE profile IN ({placeholders})",
            args,
        ).fetchone()
        counts = dict(
            db.execute(
                f"SELECT profile,COUNT(*) FROM inbox WHERE {where} AND read=0 GROUP BY profile",
                args,
            )
        )
        if unread:
            where += " AND read=0"
        if cursor:
            try:
                stamp, identity = cursor.split(":")
                stamp, identity = float(stamp), int(identity)
                if not math.isfinite(stamp) or identity < 1:
                    raise ValueError()
            except ValueError, TypeError:
                raise ValueError("Invalid cursor") from None
            where += " AND (occurred,id)<(?,?)"
            args.extend((stamp, identity))
        rows = db.execute(
            f"SELECT id,profile,session,event_id,kind,occurred,title,preview,read FROM inbox WHERE {where} ORDER BY occurred DESC,id DESC LIMIT ?",
            [*args, limit + 1],
        ).fetchall()
        items = [
            dict(
                zip(
                    (
                        "id",
                        "profile",
                        "session",
                        "event_id",
                        "kind",
                        "occurred",
                        "title",
                        "preview",
                        "read",
                    ),
                    row,
                    strict=True,
                )
            )
            for row in rows[:limit]
        ]
        for item in items:
            item["read"] = bool(item["read"])
        return {
            "items": items,
            "unread": sum(counts.values()),
            "byProfile": counts,
            "revision": ":".join(map(str, revision)),
            "nextCursor": f"{items[-1]['occurred']}:{items[-1]['id']}"
            if len(rows) > limit
            else None,
        }


def mark_read(store, profiles, identity):
    with database(store) as db:
        return (
            db.execute(
                f"UPDATE inbox SET read=1 WHERE id=? AND profile IN ({','.join('?' for _ in profiles) or 'NULL'}) AND deleted=0",
                [identity, *profiles],
            ).rowcount
            > 0
        )


def delete_read(store, profiles):
    with database(store) as db:
        db.execute(
            f"UPDATE inbox SET deleted=1 WHERE read=1 AND profile IN ({','.join('?' for _ in profiles) or 'NULL'})",
            profiles,
        )


def delete_item(store, profiles, identity):
    with database(store) as db:
        return db.execute(
            f"UPDATE inbox SET read=1,deleted=1 WHERE id=? AND profile IN ({','.join('?' for _ in profiles) or 'NULL'}) AND deleted=0",
            [identity, *profiles],
        ).rowcount > 0


class Source(HistorySource):
    @override
    async def sessions(self, profile):
        # The regular picker omits archives. Inbox recovery includes them too.
        def listing():
            from hermes_cli.web_server_sessions import _open_session_db_for_profile

            db = _open_session_db_for_profile(profile, read_only=True)
            try:
                rows, offset = [], 0
                while True:
                    batch = db.list_sessions_rich(
                        limit=200,
                        offset=offset,
                        include_archived=True,
                        include_children=True,
                        order_by_last_active=True,
                        compact_rows=True,
                    )
                    rows.extend(batch)
                    if len(batch) < 200:
                        return rows
                    offset += len(batch)
            finally:
                db.close()

        return await asyncio.to_thread(listing)

    def redact(self, profile):
        from types import SimpleNamespace

        collector = SimpleNamespace(secrets=set())
        self.api._native_validation.register_profile_secrets(profile, collector)
        key = (
            self.api._gateway_settings()[1]
            if profile == "default"
            else self.api._profile_gateway_key(profile)
        )
        secrets = collector.secrets | {key or ""}

        def clean(text):
            for secret in secrets:
                if secret:
                    text = text.replace(secret, "[redacted]")
            return text

        return clean

    def rows(self, profile, session, after, since=0):
        from hermes_cli.web_server_sessions import _open_session_db_for_profile

        db = _open_session_db_for_profile(profile, read_only=True)
        try:
            if not after:
                latest = db.get_messages(session, latest=True, limit=1, include_inactive=True)
                if latest and latest[0].get("timestamp", since) < since:
                    return latest
            rows = []
            while True:
                batch = db.get_messages(session, after_id=after, limit=500, include_inactive=True)
                rows.extend(batch)
                if len(batch) < 500:
                    return rows
                after = batch[-1]["id"]
        finally:
            db.close()

    def attention(self, profile):
        """Inspect open native requests without attaching/activating any sessions."""
        from tui_gateway import server

        sessions, error = server._snapshot_sessions(None)  # ty: ignore[unresolved-attribute]
        if error:
            raise RuntimeError("Native sessions unavailable")
        home = server._profile_home(profile)
        result = []
        for runtime, session in sessions:
            if session.get("_finalized") or not server._live_profile_matches(session, home):  # ty: ignore[unresolved-attribute]
                continue
            stored = server._session_lookup_key(session, fallback=runtime)  # ty: ignore[unresolved-attribute]
            for request in server._open_requests(runtime):
                kind = request.get("method")
                if kind in ("approval", "clarify", "secret", "sudo"):
                    params = request.get("params") or {}
                    # The original request identity also appears in retained viewer frames.
                    identity = params.get("request_id") or request.get("id")
                    if identity is not None:
                        result.append(
                            (
                                stored,
                                str(identity),
                                "attention" if kind in ("secret", "sudo") else kind,
                            )
                        )
            connection = server._pending_connection_request_payload(runtime)
            if connection and connection.get("op_id"):
                result.append((stored, str(connection["op_id"]), "attention"))
        return result

    def busy(self, profile):
        from tui_gateway import server

        sessions, error = server._snapshot_sessions(None)  # ty: ignore[unresolved-attribute]
        if error:
            raise RuntimeError("Native sessions unavailable")
        home = server._profile_home(profile)
        return {
            server._session_lookup_key(session, fallback=runtime)  # ty: ignore[unresolved-attribute]
            for runtime, session in sessions
            if session.get("running") and server._live_profile_matches(session, home)  # ty: ignore[unresolved-attribute]
        }


class Service:
    def __init__(self, source, store, interval=30):
        self.source, self.store, self.interval = source, store, interval
        self.task = None
        self.wake = asyncio.Event()
        self.lock = asyncio.Lock()

    def start(self):
        self.task = asyncio.create_task(self.run())

    def trigger(self):
        self.wake.set()

    async def reconcile(self):
        async with self.lock:
            profiles = await self.source.profiles()
            cutoffs = {p: await asyncio.to_thread(initialize, self.store, p) for p in profiles}
            for profile in profiles:
                try:
                    since = cutoffs[profile]
                    clean = await asyncio.to_thread(self.source.redact, profile)
                    sessions = await self.source.sessions(profile)
                    titles = {s["id"]: s.get("title") or "Untitled chat" for s in sessions}
                    for session, identity, kind in await asyncio.to_thread(
                        self.source.attention, profile
                    ):
                        await asyncio.to_thread(
                            record,
                            self.store,
                            profile,
                            session,
                            identity,
                            kind,
                            title=clean(titles.get(session, "Untitled chat")),
                        )
                    busy = await asyncio.to_thread(self.source.busy, profile)
                    saved = await asyncio.to_thread(checkpoints, self.store, profile)
                    for session in sessions:
                        if session["id"] in busy:
                            continue
                        after, previous, scanned = saved.get(session["id"], (0, None, 0))
                        change = modification(session)
                        if change == previous and time.time() - scanned < 300:
                            continue
                        try:
                            rows = await asyncio.to_thread(
                                self.source.rows, profile, session["id"], after, since
                            )
                            await asyncio.to_thread(
                                reconcile_rows,
                                self.store,
                                profile,
                                session,
                                rows,
                                since,
                                change,
                                clean,
                            )
                        except asyncio.CancelledError:
                            raise
                        except Exception:
                            continue
                except asyncio.CancelledError:
                    raise
                except Exception:
                    # Preserve checkpoints, retry inaccessible profiles; never log native data.
                    continue

    async def run(self):
        while True:
            self.wake.clear()
            try:
                await self.reconcile()
            except asyncio.CancelledError:
                raise
            except Exception:
                pass
            try:
                await asyncio.wait_for(self.wake.wait(), self.interval)
            except TimeoutError:
                pass

    async def close(self):
        if self.task:
            self.task.cancel()
            await asyncio.gather(self.task, return_exceptions=True)
