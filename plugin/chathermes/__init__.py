"""Outgoing cron delivery; the dashboard remains the only ChatHermes UI."""


def _home_channel():
    from agent.secret_scope import get_secret

    destination = (get_secret("CHATHERMES_HOME_CHANNEL", "") or "").strip()
    return (
        {"home_channel": {"chat_id": destination, "name": "Scheduled results"}}
        if destination
        else None
    )


def _configured_home(config):
    """Use Hermes's merged home channel without inventing a default destination."""
    return bool(config.home_channel and config.home_channel.chat_id)


def _register_cron_display_name():
    """Preserve branding where Hermes title-cases platform IDs for cron UIs."""
    from functools import wraps

    from cron import scheduler_delivery

    original = scheduler_delivery.cron_delivery_targets
    if getattr(original, "_chathermes_display_name", False):
        return

    @wraps(original)
    def targets_with_display_name() -> list[dict]:
        return [
            dict(target, name="ChatHermes") if target["id"] == "chathermes" else target
            for target in original()
        ]

    targets_with_display_name.__dict__["_chathermes_display_name"] = True
    scheduler_delivery.__dict__["cron_delivery_targets"] = targets_with_display_name


def register(ctx):
    from .cron_delivery import standalone_send

    _register_cron_display_name()

    ctx.register_platform(
        name="chathermes",
        label="ChatHermes",
        # No inbound adapter, agent session, or TUI owner is needed.
        adapter_factory=lambda config: None,
        check_fn=lambda: True,
        cron_deliver_env_var="CHATHERMES_HOME_CHANNEL",
        standalone_sender_fn=standalone_send,
        env_enablement_fn=_home_channel,
        # Cron's UI enumerates enabled/configured gateway platforms. Accept the
        # native YAML home channel as well as the profile-scoped env opt-in.
        is_connected=lambda config: _configured_home(config) or bool(_home_channel()),
    )
