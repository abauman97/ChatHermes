"""Outbound ChatHermes adapter contract."""

import asyncio
from types import SimpleNamespace


def _adapter(destination="scheduled"):
    from chathermes import register
    from chathermes.adapter import ChatHermesAdapter

    class Context:
        def register_platform(self, **kwargs):
            from gateway.platform_registry import PlatformEntry, platform_registry

            platform_registry.register(PlatformEntry(**kwargs))

    register(Context())
    return ChatHermesAdapter(SimpleNamespace(home_channel=SimpleNamespace(chat_id=destination)))


def test_adapter_send_uses_existing_delivery(monkeypatch):
    from chathermes import cron_delivery

    calls = []
    monkeypatch.setattr(
        cron_delivery,
        "standalone_send",
        lambda *args, **kwargs: (
            calls.append((args, kwargs))
            or asyncio.sleep(0, result={"success": True, "message_id": "m1"})
        ),
    )
    result = asyncio.run(_adapter().send("device-1", "hello"))
    assert result.success is True
    assert result.message_id == "m1"
    args, kwargs = calls[0]
    assert args[1:3] == ("device-1", "hello")


def test_adapter_rejects_missing_destination():
    from chathermes.adapter import ChatHermesAdapter

    result = asyncio.run(ChatHermesAdapter(SimpleNamespace(home_channel=None)).send("", "hello"))
    assert result.success is False
    assert "destination" in (result.error or "")


def test_adapter_propagates_delivery_failure(monkeypatch):
    from chathermes import cron_delivery
    from chathermes.adapter import ChatHermesAdapter

    async def fail(*args, **kwargs):
        return {"error": "ChatHermes push delivery unavailable or failed"}

    monkeypatch.setattr(cron_delivery, "standalone_send", fail)
    result = asyncio.run(
        ChatHermesAdapter(SimpleNamespace(home_channel=SimpleNamespace(chat_id="scheduled"))).send(
            "scheduled", "hello"
        )
    )
    assert result.success is False
    assert "unavailable" in (result.error or "")


def test_platform_factory_returns_outbound_adapter():
    from chathermes import register
    from gateway.platform_registry import platform_registry

    class Context:
        def register_platform(self, **kwargs):
            from gateway.platform_registry import PlatformEntry
            from gateway.platform_registry import platform_registry as registry

            registry.register(PlatformEntry(**kwargs))

    context = Context()
    register(context)
    entry = platform_registry.get("chathermes")
    assert entry is not None
    adapter = entry.adapter_factory(
        SimpleNamespace(home_channel=SimpleNamespace(chat_id="scheduled"))
    )
    from chathermes.adapter import ChatHermesAdapter

    assert isinstance(adapter, ChatHermesAdapter)
