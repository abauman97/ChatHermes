"""Outbound-only adapter for explicitly routed ChatHermes notifications."""

from __future__ import annotations

from typing import Any, override

from gateway.platforms.base import BasePlatformAdapter, SendResult


def _plugin_platform():
    # The pinned Gateway only constructs plugin enum values after registration.
    from gateway.config import Platform

    return Platform("chathermes")


class ChatHermesAdapter(BasePlatformAdapter):
    """Deliver routed messages through ChatHermes's existing cron pipeline."""

    def __init__(self, config: Any):
        super().__init__(config, _plugin_platform())

    @override
    async def connect(self, *, is_reconnect: bool = False) -> bool:
        self._mark_connected()
        return True

    @override
    async def disconnect(self) -> None:
        self._mark_disconnected()

    @override
    async def get_chat_info(self, chat_id: str) -> dict[str, Any]:
        return {"chat_id": chat_id, "platform": "chathermes"}

    @override
    async def send(
        self,
        chat_id: str,
        content: str,
        reply_to: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> SendResult:
        destination = (chat_id or "").strip()
        if not destination:
            home = getattr(self.config, "home_channel", None)
            destination = (getattr(home, "chat_id", None) or "").strip()
        if not destination:
            return SendResult(success=False, error="ChatHermes destination is not configured")
        if reply_to or metadata and metadata.get("thread_id"):
            return SendResult(success=False, error="ChatHermes does not support threaded delivery")

        from .cron_delivery import standalone_send

        result = await standalone_send(self.config, destination, content)
        if result.get("error"):
            return SendResult(success=False, error=result["error"])
        return SendResult(success=True, message_id=result.get("message_id"))
