"""Outgoing cron delivery; the dashboard remains the only ChatHermes UI."""


def _home_channel():
    from agent.secret_scope import get_secret
    destination = (get_secret('CHATHERMES_HOME_CHANNEL', '') or '').strip()
    return {'home_channel': {'chat_id': destination, 'name': 'Scheduled results'}} if destination else None


def register(ctx):
    from .cron_delivery import standalone_send

    ctx.register_platform(
        name='chathermes', label='ChatHermes',
        # No inbound adapter, agent session, or TUI owner is needed.
        adapter_factory=lambda config: None, check_fn=lambda: True,
        cron_deliver_env_var='CHATHERMES_HOME_CHANNEL',
        standalone_sender_fn=standalone_send,
        env_enablement_fn=_home_channel,
        is_connected=lambda config: bool(_home_channel()),
        config_connected_fn=lambda config: True,
    )
