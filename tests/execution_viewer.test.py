"""Native execution retention, committed completion and durable device delivery."""

import asyncio
import importlib.util
from pathlib import Path
from types import SimpleNamespace

import pytest

ROOT = Path(__file__).resolve().parents[1] / "plugin/chathermes/dashboard"


def load(name):
    spec = importlib.util.spec_from_file_location("execution_test_" + name, ROOT / (name + ".py"))
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def delivery(tmp_path, monkeypatch):
    store, outbox = load("push_store"), load("completion_outbox")
    monkeypatch.setattr(store, "_path", lambda: tmp_path / "push.json")
    for profile in ("alpha", "beta"):
        for device in ("one", "two"):
            store.upsert(
                profile,
                {
                    "endpoint": f"https://push.test/{profile}/{device}",
                    "keys": {"p256dh": "a", "auth": "b"},
                },
            )
    calls = []
    sender = SimpleNamespace(_deliver=lambda *args, **kwargs: calls.append((args, kwargs)) or True)
    return store, outbox, sender, calls


def test_completion_binds_exact_new_rows_in_the_owning_profile(monkeypatch):
    viewer = load("execution_viewer")
    rows = [
        {"id": 1, "role": "user", "content": "Old"},
        {"id": 2, "role": "assistant", "content": "Same final"},
        {"id": 3, "role": "user", "content": "New"},
        {"id": 4, "role": "assistant", "content": "Same final"},
    ]

    def transcript(profile, stored):
        return rows if (profile, stored) == ("alpha", "stored") else []

    monkeypatch.setattr(viewer, "transcript", transcript)
    assert viewer.watermark("alpha", "stored") == 4
    assert viewer.committed_completion("alpha", "stored", 2, "Same final") == 4
    assert viewer.committed_completion("alpha", "stored", 4, "Same final") is None
    assert viewer.committed_completion("alpha", "stored", 2, "Unpersisted rewrite") is None
    assert viewer.committed_completion("beta", "stored", 2, "Same final") is None
    rows.pop(2)  # no new committed user boundary
    assert viewer.committed_completion("alpha", "stored", 2, "Same final") is None


def test_durable_completion_retries_only_failed_devices_and_survives_reload(delivery):
    store, outbox, sender, calls = delivery
    outbox.enqueue(store, "alpha", "same-id", 2)
    attempts = []
    failed = store.subscriptions("alpha")[1]["id"]

    def send(*args, **kwargs):
        attempts.append(kwargs["destination"])
        return kwargs["destination"] != failed

    sender._deliver = send
    outbox.drain(store, sender, lambda *args: "Persisted final", now=100)
    assert len(attempts) == 2
    outbox.enqueue(store, "alpha", "same-id", 2)  # duplicate terminal frame
    # New device gets future completions only.
    store.upsert(
        "alpha", {"endpoint": "https://push.test/new", "keys": {"p256dh": "a", "auth": "b"}}
    )
    reloaded = load("completion_outbox")
    reloaded.drain(store, sender, lambda *args: "Persisted final", now=120)
    assert len(attempts) == 2
    sender._deliver = lambda *args, **kwargs: calls.append((args, kwargs)) or True
    reloaded.drain(store, sender, lambda *args: "Persisted final", now=131)
    assert len(calls) == 1 and calls[0][1]["destination"] == failed
    assert calls[0][0] == ("alpha", "same-id", "turn.complete", "2")
    assert calls[0][1]["message"] == "Persisted final"
    reloaded.drain(
        store, sender, lambda *args: pytest.fail("delivered rows must not retry"), now=200
    )


def test_profiles_and_colliding_rows_have_independent_receipts(delivery):
    store, outbox, sender, calls = delivery
    for profile in ("alpha", "beta"):
        outbox.enqueue(store, profile, "same-id", 2)
    outbox.drain(store, sender, lambda profile, *_: profile + " body", now=100)
    assert len(calls) == 4
    for args, kwargs in calls:
        assert kwargs["destination"] in [r["id"] for r in store.subscriptions(args[0])]
        assert kwargs["message"] == args[0] + " body"


def test_missing_persistence_and_failed_delivery_never_mark_success(delivery):
    store, outbox, sender, calls = delivery
    outbox.enqueue(store, "alpha", "same-id", 2)
    outbox.drain(store, sender, lambda *_: None, now=100)
    assert calls == []
    outbox.drain(store, sender, lambda *_: "Committed", now=131)
    assert len(calls) == 2


def test_unsubscribe_removes_pending_delivery_without_cross_profile_fallback(delivery):
    store, outbox, sender, calls = delivery
    outbox.enqueue(store, "alpha", "same-id", 2)
    for row in store.subscriptions("alpha"):
        store.remove("alpha", row["id"])
    outbox.drain(store, sender, lambda *_: pytest.fail("removed subscription"), now=100)
    assert calls == []
    with outbox.database(store) as db:
        assert db.execute("SELECT delivered,cancelled FROM deliveries").fetchall() == [
            (0, 1),
            (0, 1),
        ]


def test_native_viewer_capture_filters_profile_children_and_uncommitted_completions(
    delivery, monkeypatch
):
    async def run():
        store, outbox, sender, calls = delivery
        module = load("execution_viewer")
        monkeypatch.setattr(
            module,
            "committed_completion",
            lambda profile, stored, after, text: 2 if after < 2 and text == "Final" else None,
        )
        service = SimpleNamespace(api=SimpleNamespace(_push_store_module=store), outbox=outbox)
        peer = module.Viewer(service, "alpha", "stored")
        peer.runtime = "runtime"

        def event(kind, payload=None, profile="alpha", session="runtime"):
            return {
                "type": kind,
                "session_id": session,
                "profile": profile,
                "payload": payload or {},
            }

        receipt = {"status": "complete", "text": "Final"}
        await peer.capture(event("message.start", profile="beta"))
        assert not peer.started
        await peer.capture(event("message.start"))
        await peer.capture(event("message.complete", receipt, session="child"))
        await peer.capture(event("message.complete", receipt, profile="beta"))
        outbox.drain(store, sender, lambda *_: "Durable", now=100)
        assert calls == []
        await peer.capture(event("message.complete", {"status": "interrupted"}))
        outbox.drain(store, sender, lambda *_: "Durable", now=100)
        assert calls == []
        await peer.capture(event("message.start"))
        await peer.capture(event("message.complete", receipt))
        await peer.capture(event("message.complete", receipt))
        outbox.drain(store, sender, lambda *_: "Durable", now=100)
        assert len(calls) == 2

    asyncio.run(run())


def test_read_body_uses_profile_store_and_redacts_credentials(monkeypatch):
    import sys

    module = load("execution_viewer")
    opened, closed = [], []
    db = SimpleNamespace(
        get_session=lambda s: {"id": s} if s == "stored" else None,
        get_messages=lambda s: [
            {"id": 2, "role": "assistant", "content": "Final provider-secret gateway-secret"}
        ],
        close=lambda: closed.append(True),
    )

    def open_db(profile, *, read_only):
        opened.append((profile, read_only))
        return db

    monkeypatch.setitem(
        sys.modules,
        "hermes_cli.web_server_sessions",
        SimpleNamespace(_open_session_db_for_profile=open_db),
    )

    def register(profile, collector):
        assert profile == "alpha"
        collector.secrets.add("provider-secret")

    api = SimpleNamespace(
        _native_validation=SimpleNamespace(register_profile_secrets=register),
        _profile_gateway_key=lambda p: "gateway-secret",
    )
    assert module.read_body(api, "alpha", "stored", 2) == "Final [redacted] [redacted]"
    assert module.read_body(api, "alpha", "foreign", 2) is None
    assert opened == [("alpha", True), ("alpha", True)] and len(closed) == 2


def test_native_retention_uses_one_peer_per_profile_without_browser_lifetime(delivery, monkeypatch):
    import json
    import sys
    from contextlib import asynccontextmanager
    from types import ModuleType

    async def run():
        store, outbox, sender, calls = delivery
        module = load("execution_viewer")
        monkeypatch.setattr(module, "watermark", lambda *_: 0)
        peers = []
        activation_started = asyncio.Event()
        activation_release = asyncio.Event()

        class Socket:
            def __init__(self):
                self.queue = asyncio.Queue()
                self.closed = False
                self.advertised = False
                self.responses = []
                self.queue.put_nowait(
                    json.dumps(
                        {
                            "jsonrpc": "2.0",
                            "method": "event",
                            "params": {"type": "gateway.ready", "payload": {}},
                        }
                    )
                )

            def __aiter__(self):
                return self

            async def __anext__(self):
                return await self.queue.get()

            async def send(self, text):
                frame = json.loads(text)
                if "method" not in frame:
                    self.responses.append(frame)
                    return
                assert frame["method"] in (
                    "client.capabilities",
                    "session.resume",
                    "session.activate",
                )
                if frame["method"] == "client.capabilities":
                    self.advertised = True
                    assert frame["params"] == {"server_requests": True}
                    self.queue.put_nowait(
                        json.dumps(
                            {
                                "jsonrpc": "2.0",
                                "id": frame["id"],
                                "result": {"declines_not_shown": True},
                            }
                        )
                    )
                    return
                profile = frame["params"]["profile"]
                if frame["method"] == "session.activate" and profile == "alpha":
                    activation_started.set()
                    await activation_release.wait()
                result = {"session_id": profile + "-runtime", "messages": [], "running": False}
                self.queue.put_nowait(
                    json.dumps({"jsonrpc": "2.0", "id": frame["id"], "result": result})
                )

        @asynccontextmanager
        async def connect(url, **kwargs):
            assert url == "ws://127.0.0.1:9119/api/ws"
            assert kwargs["subprotocols"][0] == "hermes-gateway-v1"
            assert "ticket" not in url
            socket = Socket()
            peers.append(socket)
            try:
                yield socket
            finally:
                socket.closed = True

        client = ModuleType("websockets.asyncio.client")
        monkeypatch.setattr(client, "connect", connect, raising=False)
        monkeypatch.setitem(sys.modules, "websockets", ModuleType("websockets"))
        monkeypatch.setitem(sys.modules, "websockets.asyncio", ModuleType("websockets.asyncio"))
        monkeypatch.setitem(sys.modules, "websockets.asyncio.client", client)
        monkeypatch.delenv("HERMES_DASHBOARD_PORT", raising=False)
        api = SimpleNamespace(_push_store_module=store, _push_sender_module=sender)
        service = module.Service(api, outbox)
        try:
            assert await service.retain("alpha", "same-id", "grant") == "alpha-runtime"
            assert await service.retain("alpha", "same-id", "unused-grant") == "alpha-runtime"
            assert await service.retain("beta", "same-id", "second-grant") == "beta-runtime"
            assert len(peers) == 2
            assert all(socket.advertised for socket in peers)
            peers[0].queue.put_nowait(
                json.dumps(
                    {
                        "jsonrpc": "2.0",
                        "id": "secret-question",
                        "method": "secret",
                        "params": {"session_id": "alpha-runtime", "prompt": "Private question"},
                    }
                )
            )
            peers[0].queue.put_nowait(
                json.dumps(
                    {
                        "jsonrpc": "2.0",
                        "id": "window-question",
                        "method": "window.fixture",
                        "params": {"session_id": "alpha-runtime"},
                    }
                )
            )
            async with asyncio.timeout(5):
                while not peers[0].responses:
                    await asyncio.sleep(0.01)
            assert peers[0].responses == [
                {
                    "jsonrpc": "2.0",
                    "id": "window-question",
                    "error": {"code": 4404, "message": "No window in this viewer"},
                }
            ]
            outbox.drain(
                store, sender, lambda *_: pytest.fail("secret parameters must not be read"), now=100
            )
            assert len(calls) == 2 and all(args[2] == "attention" for args, _ in calls)
            peer = service.viewers[("alpha", "same-id")]
            # The page can leave without any cleanup call to this service.
            await peer.capture({"type": "message.start", "session_id": peer.runtime})
            assert peer.started and not peers[0].closed
            await peer.capture(
                {
                    "type": "subagent.start",
                    "session_id": peer.runtime,
                    "payload": {"child_session_id": "child"},
                }
            )
            await peer.capture(
                {
                    "type": "message.complete",
                    "session_id": peer.runtime,
                    "payload": {"status": "interrupted"},
                }
            )
            assert peer.children == {"child"} and not peers[0].closed
            await peer.capture(
                {
                    "type": "subagent.complete",
                    "session_id": peer.runtime,
                    "payload": {"child_session_id": "child"},
                }
            )
            assert not peer.children
            # A new send can rearm retention while idle cleanup awaits a native
            # state reply. That old reply must not close the newly armed peer.
            await asyncio.wait_for(activation_started.wait(), 5)
            assert await service.retain("alpha", "same-id", "third-grant") == "alpha-runtime"
            activation_release.set()
            await asyncio.sleep(0.05)
            assert not peers[0].closed
        finally:
            await service.close()
        assert all(peer.closed for peer in peers)
        assert not service.viewers

    asyncio.run(run())


def test_pending_request_notifications_are_durable_without_secret_parameters(delivery):
    store, outbox, sender, calls = delivery
    outbox.enqueue(store, "alpha", "stored", "request-id", kind="attention")
    outbox.drain(
        store, sender, lambda *_: pytest.fail("requests must not read transcript bodies"), now=100
    )
    assert len(calls) == 2
    assert all(
        args == ("alpha", "stored", "attention", "request-id") and kwargs["message"] is None
        for args, kwargs in calls
    )


def test_push_storage_failure_keeps_execution_peer_and_retries_address(delivery, monkeypatch):
    async def run():
        store, outbox, sender, calls = delivery
        module = load("execution_viewer")
        monkeypatch.setattr(module, "committed_completion", lambda profile, stored, after, text: 2)
        peer = module.Viewer(
            SimpleNamespace(api=SimpleNamespace(_push_store_module=store), outbox=outbox),
            "alpha",
            "stored",
        )
        peer.runtime, peer.started = "runtime", True
        enqueue = outbox.enqueue

        def fail(*args, **kwargs):
            raise OSError("private-path")

        monkeypatch.setattr(outbox, "enqueue", fail)
        await peer.capture(
            {
                "type": "message.complete",
                "session_id": "runtime",
                "payload": {"status": "complete", "text": "Final"},
            }
        )
        assert peer.notifications == {(2, "turn.complete")}
        assert peer.started
        monkeypatch.setattr(outbox, "enqueue", enqueue)
        await peer.flush_notifications()
        assert not peer.notifications
        outbox.drain(store, sender, lambda *_: "Saved result", now=100)
        assert len(calls) == 2

    asyncio.run(run())


def test_two_equal_finals_after_storage_lag_keep_distinct_row_receipts(delivery, monkeypatch):
    async def run():
        store, outbox, sender, calls = delivery
        module = load("execution_viewer")
        rows = []
        monkeypatch.setattr(module, "transcript", lambda *_: rows)
        peer = module.Viewer(
            SimpleNamespace(api=SimpleNamespace(_push_store_module=store), outbox=outbox),
            "alpha",
            "stored",
        )
        peer.runtime = "runtime"
        for _ in range(2):
            await peer.capture({"type": "message.start", "session_id": "runtime"})
            await peer.capture(
                {
                    "type": "message.complete",
                    "session_id": "runtime",
                    "payload": {"status": "complete", "text": "Same final"},
                }
            )
        assert peer.completions == ["Same final", "Same final"]
        assert not peer.notifications
        rows.extend(
            [
                {"id": 1, "role": "user", "content": "One"},
                {"id": 2, "role": "assistant", "content": "Same final"},
                {"id": 3, "role": "user", "content": "Two"},
                {"id": 4, "role": "assistant", "content": "Same final"},
            ]
        )
        await asyncio.gather(peer.flush_notifications(), peer.flush_notifications())
        assert not peer.completions and not peer.notifications
        outbox.drain(store, sender, lambda *_: "Same final", now=100)
        assert len(calls) == 4
        assert {args[3] for args, _ in calls} == {"2", "4"}

    asyncio.run(run())
