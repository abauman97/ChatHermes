"""Bounded in-process Hermes dispatcher transport shared by plugin adapters.

Loaded by file path: Hermes imports plugin_api as a standalone module, not a package.
No gateway credentials or second transcript store are introduced here.
"""
from fastapi import HTTPException

class _RpcTransport:
    def __init__(self):
        import asyncio
        self.loop = asyncio.get_running_loop()
        self.events = asyncio.Queue(maxsize=256)
        self.pending = {}
        self.closed = False
        self.sequence = 0
        self.timeout = 90
        self.secret = ''
        self.secrets = set()
        self.on_frame = None

    @property
    def _closed(self):
        # Hermes transport liveness and reapers inspect this field.
        return self.closed

    def sanitize(self, value):
        def redact(value):
            if isinstance(value, str):
                for secret in self.secrets | ({self.secret} if self.secret else set()):
                    if secret:
                        value = value.replace(secret, '[redacted]')
                return value
            if isinstance(value, dict):
                return {redact(key): '[redacted]' if str(key).lower() in {
                    'api_key', 'access_token', 'refresh_token', 'authorization', 'password', 'ticket', 'internal', 'secret'
                } else redact(item) for key, item in value.items()}
            if isinstance(value, list):
                return [redact(item) for item in value]
            return value
        return redact(value)

    def write(self, frame):
        if self.closed or self.loop.is_closed():
            return False
        frame = self.sanitize(frame)
        def deliver():
            if self.closed:
                return
            future = self.pending.get(frame.get('id')) if 'method' not in frame else None
            if future is not None:
                if not future.done():
                    future.set_result(frame)
            elif 'method' not in frame:
                # Late/timed-out RPC replies are not events or server requests.
                return
            elif self.on_frame is not None:
                self.on_frame(frame)
            elif self.events.full():
                self.close()
            else:
                self.events.put_nowait(frame)
        self.loop.call_soon_threadsafe(deliver)
        return True

    async def call(self, method, params):
        import asyncio
        from starlette.concurrency import run_in_threadpool
        if self.closed:
            raise HTTPException(503, 'Hermes gateway transport is closed')
        self.sequence += 1
        rid = str(self.sequence)
        future = self.loop.create_future()
        self.pending[rid] = future
        try:
            from tui_gateway import server
            response = await run_in_threadpool(server.dispatch,
                {'jsonrpc': '2.0', 'id': rid, 'method': method, 'params': params}, self)
            if response is not None:
                self.write(response)
            frame = await asyncio.wait_for(future, timeout=self.timeout)
            if 'error' in frame:
                error = frame['error']
                code = error.get('code')
                message = error.get('message', '')
                data = error.get('data')
                if isinstance(message, str) and 'cwd_explicit' in message and isinstance(data, dict):
                    message += ' ' + str(data)
                if isinstance(message, str) and 'cwd_explicit' in message and 'Extra inputs are not permitted' in message:
                    raise _CwdExplicitUnsupported()
                if method == 'session.resume' and isinstance(message, str) and 'inline_images' in message and 'Extra inputs are not permitted' in message:
                    raise _InlineImagesUnsupported()
                raise HTTPException(501 if code == -32601 else 409, 'Hermes RPC could not complete this operation')
            return frame['result']
        except (HTTPException, _CwdExplicitUnsupported, _InlineImagesUnsupported):
            raise
        except Exception:
            raise HTTPException(503, 'Hermes gateway RPC is unavailable')
        finally:
            self.pending.pop(rid, None)

    def close(self):
        if self.closed:
            return
        self.closed = True
        def cancel_waiters():
            for future in self.pending.values():
                if not future.done():
                    future.set_exception(HTTPException(503, 'Hermes gateway transport is closed'))
            # Wake a blocked event consumer on overflow/shutdown.
            if self.events.full():
                self.events.get_nowait()
            self.events.put_nowait({'method': 'transport.closed', 'params': {}})
        if not self.loop.is_closed():
            self.loop.call_soon_threadsafe(cancel_waiters)
        try:
            from tui_gateway import server
            server.unregister_live_transport(self)
            server._close_sessions_for_transport(self, end_reason='ws_disconnect')
        except Exception:
            # Teardown must not mask the original failure or leak exceptions.
            pass


class _CwdExplicitUnsupported(Exception):
    pass


class _InlineImagesUnsupported(Exception):
    pass
