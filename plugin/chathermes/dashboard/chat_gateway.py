"""Authenticated bounded native viewer facade for the reviewed Hermes pin."""
import asyncio
import json

from fastapi import HTTPException, WebSocket, WebSocketDisconnect

SOURCE_PIN = '3632f9173d218fd24f3fa595d7affa159b0774cd'
MAX_FRAME_BYTES = 29 * 1024 * 1024
SOCKET_LIFETIME = 600


def capabilities():
    return {
        'protocol': 'chathermes.chat.v1',
        'reviewed_source': SOURCE_PIN,
        'admission': True,
        'mode': 'native-bounded',
        'operations': ['chat.capabilities', 'gateway.ping', 'chat.attach', 'chat.submit', 'chat.replay', 'chat.stop', 'chat.steer', 'chat.answer'],
        'limits': {'frame_bytes': MAX_FRAME_BYTES, 'socket_seconds': SOCKET_LIFETIME},
        'blockers': ['atomic_snapshot', 'durable_idempotent_admission'],
        'features': {'busy_send': 'queue', 'server_requests': ['approval', 'clarify'],
                     'images': True, 'reconnect': 'bounded-native-reaper'},
        'guarantees': {'crash_safe_idempotency': False, 'lossless_snapshot_replay': False,
                       'offline_turn_lease': False},
    }


def _enabled():
    # HTTP middleware is not run for WS upgrades. Check runtime enablement,
    # including after accept. Fail closed if the host integration changes.
    from hermes_cli.plugins_cmd import _get_enabled_set, _get_disabled_set
    from hermes_cli.web_server_profiles import _config_profile_scope
    with _config_profile_scope(None):
        return 'chathermes' in _get_enabled_set() and 'chathermes' not in _get_disabled_set()


def _profile(ws):
    import re
    profile = ws.query_params.get('profile') or None
    if profile and not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]*', profile):
        raise HTTPException(422, 'Invalid profile')
    if profile:
        from hermes_cli.web_server_profiles import _resolve_profile_dir
        _resolve_profile_dir(profile)
    return profile


def response(frame):
    """Handle capability/heartbeat calls; all session operations use the typed facade."""
    if not isinstance(frame, dict) or frame.get('jsonrpc') != '2.0':
        return {'jsonrpc': '2.0', 'id': None, 'error': {'code': -32600, 'message': 'Invalid request'}}
    rid = frame.get('id')
    if isinstance(rid, bool) or not isinstance(rid, (str, int)) or isinstance(rid, str) and len(rid) > 128:
        return {'jsonrpc': '2.0', 'id': None, 'error': {'code': -32600, 'message': 'Invalid request'}}
    error = None
    if set(frame) - {'jsonrpc', 'id', 'method', 'params'} or frame.get('params', {}) != {}:
        error = {'code': -32602, 'message': 'Invalid params'}
    elif frame.get('method') == 'chat.capabilities':
        return {'jsonrpc': '2.0', 'id': rid, 'result': capabilities()}
    elif frame.get('method') == 'gateway.ping':
        return {'jsonrpc': '2.0', 'id': rid, 'result': {'ok': True}}
    else:
        error = {'code': -32601, 'message': 'Native chat operation is unavailable'}
    return {'jsonrpc': '2.0', 'id': rid, 'error': error}


async def socket(ws: WebSocket, api):
    # Require the browser's host-issued single-use ticket in a subprotocol.
    # No cookie-only upgrade, query credentials, insecure token, or raw /api/ws.
    try:
        from hermes_cli.web_server_chat import (
            _gateway_ws_ticket_from_subprotocol, _ws_auth_reason, _ws_request_is_allowed)
        from hermes_cli.web_server import app
        if not _enabled():
            await ws.close(code=4404)
            return
        if not _ws_request_is_allowed(ws) or not ws.headers.get('origin', '').startswith(('https://', 'http://')):
            await ws.close(code=4403)
            return
        profile = _profile(ws) or "default"
        ticket, reason = _gateway_ws_ticket_from_subprotocol(ws)
        if not getattr(app.state, 'auth_required', False) or not ticket or reason != 'ok' or any(
                key in ws.query_params for key in ('ticket', 'token', 'internal')):
            await ws.close(code=4401)
            return
        if _ws_auth_reason(ws)[0] is not None or not getattr(ws, '_hermes_auth_identity', None):
            await ws.close(code=4401)
            return
    except Exception:
        await ws.close(code=4403)
        return
    await ws.accept(subprotocol='hermes-gateway-v1')
    transport = api._new_rpc_transport(ws)
    transport.auth_identity = getattr(ws, '_hermes_auth_identity', None)
    channel = api._native_channel.Channel(api, transport, profile)
    from tui_gateway import server, server_requests
    server.register_live_transport(transport)
    server._start_backend_heartbeat_refresher()
    server._schedule_startup_orphan_sweep()
    server_requests.advertise(transport, True)
    async def forward():
        while not transport.closed:
            frame = await transport.events.get()
            if frame.get('method') == 'transport.closed':
                await ws.close(code=1013)
                return
            params = frame.get('params') or {}
            if params.get('session_id') != channel.runtime:
                continue
            if frame.get('method') in ('approval', 'clarify'):
                await ws.send_json({'jsonrpc': '2.0', 'method': 'chat.request', 'params': frame})
            elif 'id' in frame and frame.get('method'):
                server_requests.resolve_response({'id': frame['id'], 'error': {
                    'code': server_requests.NOT_SHOWN_CODE, 'message': 'Unavailable in ChatHermes'}}, transport)
                await ws.send_json({'jsonrpc': '2.0', 'method': 'chat.unsupported',
                                    'params': {'method': frame['method']}})
            elif frame.get('method') == 'event':
                await ws.send_json({'jsonrpc': '2.0', 'method': 'chat.event', 'params': params})
    sender = asyncio.create_task(forward())
    try:
        await ws.send_json({'jsonrpc': '2.0', 'method': 'chat.ready', 'params': capabilities()})
        # Reauthenticate with a fresh host ticket after a bounded viewer lifetime.
        async with asyncio.timeout(SOCKET_LIFETIME):
            while True:
                raw = await ws.receive_text()
                if len(raw.encode('utf-8')) > MAX_FRAME_BYTES:
                    await ws.close(code=1009)
                    return
                if not _enabled():
                    await ws.close(code=4404)
                    return
                try:
                    frame = json.loads(raw)
                except ValueError:
                    frame = None
                await ws.send_json(await channel.handle(frame))
    except WebSocketDisconnect:
        pass
    except TimeoutError:
        await ws.close(code=4401)

    finally:
        sender.cancel()
        import contextlib
        with contextlib.suppress(asyncio.CancelledError, Exception):
            await sender
        server_requests.forget(transport)
        transport.close()
