"""Server-side viewers of the one pinned native gateway; no browser facade.

A delegated, single-use dashboard ticket attaches a native peer before the
browser dispatches. Browser departure therefore cannot trigger orphan teardown.
The native runtime still owns execution, cancellation, requests and persistence.
"""

import asyncio
import json
import os

PIN = "bf0203a794a07aac3ff764972ab9087baa4e4f4e"


def transcript(profile, stored):
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    db = _open_session_db_for_profile(profile, read_only=True)
    try:
        return db.get_messages(stored) if db.get_session(stored) is not None else []
    finally:
        db.close()


def watermark(profile, stored):
    return max(
        (row["id"] for row in transcript(profile, stored) if type(row.get("id")) is int), default=0
    )


def committed_completion(profile, stored, after, text):
    """Bind this native final to a new committed user/assistant turn.

    The pin may omit its optional persisted_turn field. Use native completion
    status/text plus exact profile-local row identity, never seq or latest output
    alone. Equal text from an earlier turn is below the admission watermark.
    """
    rows = [
        row
        for row in transcript(profile, stored)
        if type(row.get("id")) is int and row["id"] > after
    ]
    users = [row["id"] for row in rows if row.get("role") == "user"]
    if not users:
        return None
    candidates = [
        row
        for row in rows
        if row.get("role") == "assistant" and row["id"] > min(users) and row.get("content") == text
    ]
    return min((row["id"] for row in candidates), default=None)


def read_body(api, profile, stored, row_id):
    # Use the profile's actual read-only store, never the live process's default.
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    db = _open_session_db_for_profile(profile, read_only=True)
    try:
        if db.get_session(stored) is None:
            return None
        row = next(
            (
                row
                for row in db.get_messages(stored)
                if row.get("id") == row_id and row.get("role") == "assistant"
            ),
            None,
        )
        if row is None or not isinstance(row.get("content"), str):
            return None
        # Configured provider secrets and gateway key are collected server-side.
        from types import SimpleNamespace

        collector = SimpleNamespace(secrets=set())
        api._native_validation.register_profile_secrets(profile, collector)
        key = (
            api._gateway_settings()[1]
            if profile == "default"
            else api._profile_gateway_key(profile)
        ) or ""
        body = row["content"]
        for secret in collector.secrets | {key}:
            if secret:
                body = body.replace(secret, "[redacted]")
        return body
    finally:
        db.close()


class Viewer:
    def __init__(self, service, profile, stored):
        self.service, self.profile, self.stored = service, profile, stored
        self.runtime = ""
        self.pending = {}
        self.sequence = 0
        self.children = set()
        self.notifications = set()
        self.inbox_only = set()
        self.notification_lock = asyncio.Lock()
        self.completions = []
        self.watermark = 0
        self.started = False
        self.terminal = False
        self.task = None
        self.ws = None
        self.armed_until = 0
        self.generation = 0
        self.ready = asyncio.get_running_loop().create_future()

    async def call(self, method, params=None):
        assert self.ws is not None
        self.sequence += 1
        rid = str(self.sequence)
        future = asyncio.get_running_loop().create_future()
        self.pending[rid] = future
        try:
            await self.ws.send(
                json.dumps(
                    {
                        "jsonrpc": "2.0",
                        "id": rid,
                        "method": method,
                        "params": (params or {})
                        if method == "client.capabilities"
                        else {**(params or {}), "profile": self.profile},
                    }
                )
            )
            return await asyncio.wait_for(future, 95)
        finally:
            self.pending.pop(rid, None)

    async def receive(self):
        assert self.ws is not None
        async for text in self.ws:
            if not isinstance(text, str):
                raise ValueError("Unsupported native frame")
            for line in text.splitlines():
                frame = json.loads(line)
                if not isinstance(frame, dict) or frame.get("jsonrpc") != "2.0":
                    raise ValueError("Unsupported native frame")
                if "method" not in frame:
                    future = self.pending.get(str(frame.get("id")))
                    if future is not None and not future.done():
                        if "error" in frame:
                            future.set_exception(ValueError("Native operation unavailable"))
                        else:
                            future.set_result(frame.get("result"))
                elif frame.get("method") == "event":
                    event = frame.get("params") or {}
                    if event.get("type") == "gateway.ready":
                        if (event.get("payload") or {}).get("session_authority"):
                            raise ValueError("Unsupported native contract")
                        if not self.ready.done():
                            self.ready.set_result(True)
                    await self.capture(event)
                elif frame.get("method") in ("approval", "clarify", "secret"):
                    params = frame.get("params") or {}
                    if self.runtime and params.get("session_id") == self.runtime:
                        kind = frame["method"] if frame["method"] != "secret" else "attention"
                        await self.record_notice(
                            str(params.get("request_id") or frame.get("id")), kind
                        )

                elif (
                    "id" in frame and (frame.get("params") or {}).get("session_id") == self.runtime
                ):
                    if frame.get("method") == "sudo":
                        self.inbox_only.add((str(frame["id"]), "attention"))
                        await self.flush_notifications()
                    # Abstain from window-owned bridges without settling another
                    # viewer's request. 4404 is the pinned native decline code.
                    await self.ws.send(
                        json.dumps(
                            {
                                "jsonrpc": "2.0",
                                "id": frame["id"],
                                "error": {"code": 4404, "message": "No window in this viewer"},
                            }
                        )
                    )
                # Supported questions remain open for native browser viewers.

    async def capture(self, event):
        if (
            not self.runtime
            or event.get("session_id") != self.runtime
            or event.get("profile", self.profile) != self.profile
        ):
            return
        kind, payload = event.get("type"), event.get("payload") or {}
        if kind == "message.start":
            self.started, self.terminal = True, False
        elif kind in (
            "subagent.start",
            "subagent.complete",
            "subagent.failed",
            "subagent.cancelled",
        ):
            child = payload.get("subagent_id") or payload.get("child_session_id")
            if (
                not child
                and payload.get("delegation_id")
                and type(payload.get("task_index")) is int
            ):
                child = f"{payload['delegation_id']}:{payload['task_index']}"
            if child:
                if kind == "subagent.start":
                    self.children.add(child)
                else:
                    self.children.discard(child)
        elif kind == "message.complete":
            if not self.started or self.terminal:
                return
            self.terminal = True
            text = payload.get("text")
            if payload.get("status") == "complete" and isinstance(text, str) and text:
                self.completions.append(text)
                await self.flush_notifications()
            elif payload.get("status") == "error" and type(event.get("seq")) is int:
                self.inbox_only.add((f"failure:{self.runtime}:{event['seq']}", "attention"))
                await self.flush_notifications()

        if kind in ("approval.request", "clarify.request"):
            self.terminal = False
        if kind == "connection.request" and payload.get("op_id"):
            self.inbox_only.add((str(payload["op_id"]), "attention"))
            await self.flush_notifications()

    async def record_notice(self, identity, kind):
        self.notifications.add((identity, kind))
        await self.flush_notifications()

    async def flush_notifications(self):
        async with self.notification_lock:
            await self._flush_notifications()

    async def _flush_notifications(self):
        record = getattr(self.service.api, "_record_inbox", None)
        for identity, kind in list(self.inbox_only):
            try:
                if record is not None:
                    await asyncio.to_thread(record, self.profile, self.stored, identity, kind)
            except Exception:
                continue
            self.inbox_only.discard((identity, kind))
        for text in list(self.completions):
            try:
                row = await asyncio.to_thread(
                    committed_completion, self.profile, self.stored, self.watermark, text
                )
            except Exception:
                continue
            if row is not None:
                self.notifications.add((row, "turn.complete"))
                index = getattr(self.service.api, "_index_artifacts", None)
                if index is not None:
                    index(self.profile, self.stored)
                self.watermark = row
                self.completions.remove(text)
        for identity, kind in list(self.notifications):
            record = getattr(self.service.api, "_record_inbox", None)
            if record is not None:
                try:
                    await asyncio.to_thread(record, self.profile, self.stored, identity, kind)
                except Exception:
                    # Retry inbox storage independently; push still gets its address.
                    inbox_pending = True
                else:
                    inbox_pending = False
            else:
                inbox_pending = False
            try:
                await asyncio.to_thread(
                    self.service.outbox.enqueue,
                    self.service.api._push_store_module,
                    self.profile,
                    self.stored,
                    identity,
                    kind=kind,
                )
            except Exception:
                # Push storage is optional to execution. Preserve the native peer
                # and retry the address; never tear down an active tool for this.
                continue
            if not inbox_pending:
                self.notifications.discard((identity, kind))

    async def run(self, ticket):
        reader = None
        try:
            from websockets.asyncio.client import connect
            from websockets.typing import Subprotocol

            # Fixed loopback target: never accept a URL/Host from the caller.
            port = int(os.environ.get("HERMES_DASHBOARD_PORT", "9119"))
            async with connect(
                f"ws://127.0.0.1:{port}/api/ws",
                subprotocols=[
                    Subprotocol("hermes-gateway-v1"),
                    Subprotocol("hermes-gateway-ticket." + ticket),
                ],
                max_size=29 * 1024 * 1024,
                open_timeout=10,
            ) as self.ws:
                reader = asyncio.create_task(self.receive())
                await asyncio.wait_for(asyncio.shield(self.ready), 10)
                capabilities = await self.call("client.capabilities", {"server_requests": True})
                if capabilities.get("declines_not_shown") is not True:
                    raise ValueError("Unsupported native request contract")
                snapshot = await self.call(
                    "session.resume",
                    {"session_id": self.stored, "source": "desktop", "inline_images": False},
                )
                if (
                    "revision" in snapshot
                    or "execution_generation" in snapshot
                    or not isinstance(snapshot.get("messages"), list)
                ):
                    raise ValueError("Unsupported native contract")
                if snapshot.get("running") or snapshot.get("queued"):
                    raise ValueError("Session is busy")
                self.runtime = snapshot["session_id"]
                self.watermark = await asyncio.to_thread(watermark, self.profile, self.stored)
                self.started = bool(snapshot.get("running") or snapshot.get("queued"))
                self.service.attached[self].set_result(self.runtime)
                self.armed_until = asyncio.get_running_loop().time() + 120
                while True:
                    done, _ = await asyncio.wait([reader], timeout=2)
                    if done:
                        await reader
                        break
                    await self.flush_notifications()
                    # Only reclaim an unused or settled viewer; active turns,
                    # queued prompts and delegated work retain their native peer.
                    if (
                        self.completions
                        or self.notifications
                        or self.inbox_only
                        or self.children
                        or not self.terminal
                        and (self.started or asyncio.get_running_loop().time() < self.armed_until)
                    ):
                        continue
                    generation = self.generation
                    state = await self.call(
                        "session.activate", {"session_id": self.runtime, "omit_messages": True}
                    )
                    if (
                        generation != self.generation
                        or self.children
                        or self.notifications
                        or self.inbox_only
                        or self.completions
                    ):
                        continue
                    if (
                        not state.get("running")
                        and not state.get("queued")
                        and not state.get("open_requests")
                    ):
                        break
        finally:
            if reader is not None:
                reader.cancel()
                await asyncio.gather(reader, return_exceptions=True)
            for future in self.pending.values():
                if not future.done():
                    future.set_exception(ValueError("Native viewer disconnected"))
            attached = self.service.attached.pop(self, None)
            if attached is not None and not attached.done():
                attached.set_exception(ValueError("Native retention unavailable"))
            key = (self.profile, self.stored)
            if self.service.viewers.get(key) is self:
                del self.service.viewers[key]


class Service:
    def __init__(self, api, outbox):
        self.api, self.outbox = api, outbox
        self.viewers, self.attached = {}, {}
        self.worker = None
        self.lock = asyncio.Lock()

    async def retain(self, profile, stored, ticket):
        async with self.lock:
            key = (profile, stored)
            viewer = self.viewers.get(key)
            if viewer is None:
                if len(self.viewers) >= 128:
                    raise ValueError("Native retention capacity reached")
                viewer = self.viewers[key] = Viewer(self, profile, stored)
                self.attached[viewer] = asyncio.get_running_loop().create_future()
                viewer.task = asyncio.create_task(viewer.run(ticket))
                # Consume background errors without logging credential-bearing URLs.
                viewer.task.add_done_callback(
                    lambda task: None if task.cancelled() else task.exception()
                )
            if viewer.started and not viewer.terminal:
                raise ValueError("Session is busy")
            if self.worker is None or self.worker.done():
                self.worker = asyncio.create_task(self.deliver())
            runtime = await asyncio.shield(self.attached[viewer])
            viewer.generation += 1
            viewer.armed_until = asyncio.get_running_loop().time() + 120
            viewer.started, viewer.terminal = False, False
            return runtime

    async def deliver(self):
        while True:
            try:
                await asyncio.to_thread(
                    self.outbox.drain,
                    self.api._push_store_module,
                    self.api._push_sender_module,
                    lambda *args: read_body(self.api, *args),
                )
            except Exception:
                # A temporary storage/configuration failure must not stop retries.
                pass
            await asyncio.sleep(5)

    async def close(self):
        tasks = [v.task for v in list(self.viewers.values())]
        if self.worker:
            tasks.append(self.worker)
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
