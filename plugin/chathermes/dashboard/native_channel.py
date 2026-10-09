"""Profile-bound native RPC facade; execution ownership outlives browser viewers."""
from fastapi import HTTPException


class Channel:
    def __init__(self, api, transport, profile):
        self.api, self.transport, self.profile = api, transport, profile
        self.runtime = self.stored = None
        self.current_model = self.current_provider = None
        self.owner = None
        import asyncio
        self.queue = asyncio.Queue(maxsize=512)

    async def handle(self, frame):
        if not isinstance(frame, dict) or frame.get('jsonrpc') != '2.0':
            return self.api._chat_gateway.response(frame)
        rid = frame.get('id')
        if type(rid) not in (str, int) or isinstance(rid, str) and len(rid) > 128:
            return self.api._chat_gateway.response(None)
        method, params = frame.get('method'), frame.get('params', {})
        if method in ('chat.capabilities', 'gateway.ping'):
            return self.api._chat_gateway.response(frame)
        if set(frame) - {'jsonrpc', 'id', 'method', 'params'} or not isinstance(params, dict):
            return {'jsonrpc': '2.0', 'id': rid, 'error': {'code': 422, 'message': 'Invalid params'}}
        # Only prompt dispatch crosses the uncertainty boundary. Attach, image
        # validation and model preparation cannot admit a user turn.
        self.submit_dispatched = False
        try:
            if self.owner and method != 'chat.attach':
                async with self.owner.lock:
                    result = await self.operation(method, params)
            else:
                result = await self.operation(method, params)
            return {'jsonrpc': '2.0', 'id': rid, 'result': result}
        except HTTPException as exc:
            return {'jsonrpc': '2.0', 'id': rid, 'error': {'code': exc.status_code,
                'message': exc.detail, 'data': {'outcome': 'unknown' if method == 'chat.submit' and self.submit_dispatched else 'rejected'},
                'outcome': 'unknown' if method == 'chat.submit' and self.submit_dispatched else 'rejected'}}
        except Exception:
            unknown = method == 'chat.submit' and self.submit_dispatched
            return {'jsonrpc': '2.0', 'id': rid, 'error': {'code': 503,
                'message': 'Native operation outcome unknown. Inspect history before sending again.' if unknown else 'Native operation unavailable. Message not submitted.',
                'data': {'outcome': 'unknown' if unknown else 'rejected'},
                'outcome': 'unknown' if unknown else 'rejected'}}

    async def operation(self, method, params):
        import re
        from tui_gateway import server_requests
        if method == 'chat.attach':
            if set(params) != {'session_id'} or not isinstance(params['session_id'], str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,128}', params['session_id']):
                raise HTTPException(422, 'Invalid stored session')
            if self.stored and self.stored != params['session_id']:
                raise HTTPException(409, 'Open a new viewer for another session')
            from starlette.concurrency import run_in_threadpool
            await run_in_threadpool(register_profile_secrets, self.profile, self.transport)
            await run_in_threadpool(check_profile_session, self.profile, params['session_id'])
            if self.owner is None:
                self.owner = await self.api._native_owners.acquire(self.api, self.transport, self.profile, params['session_id'])
                self.transport = self.owner.transport
                self.owner.subscribers.add(self.queue)
            async with self.owner.lock:
                snapshot = await self.owner.attach()
            self.runtime, self.stored = snapshot['session_id'], params['session_id']
            self.current_model = (snapshot.get('info') or {}).get('model')
            self.current_provider = (snapshot.get('info') or {}).get('provider')
            return snapshot
        if not self.runtime:
            raise HTTPException(409, 'Attach a session first')
        scoped = {'profile': self.profile, 'session_id': self.runtime}
        if method == 'chat.replay':
            if set(params) != {'offset', 'through'}:
                raise HTTPException(422, 'Invalid recovery cursor')
            return self.owner.replay(params['offset'], params['through'])
        if method == 'chat.reconciled':
            if set(params) != {'through'} or type(params['through']) is not int:
                raise HTTPException(422, 'Invalid recovery boundary')
            live = await self.transport.call('session.activate', scoped)
            if live.get('running') or live.get('queued') or self.owner.children or params['through'] != self.owner.start_offset + len(self.owner.offsets):
                return {'settled': False}
            self.owner.retire()
            return {'settled': True}
        if method == 'chat.submit':
            queued = params.get('queued', False)
            if type(queued) is not bool:
                raise HTTPException(422, 'Invalid queue choice')
            admission_id = params.get('admission_id')
            if admission_id is not None and (not isinstance(admission_id, str) or not re.fullmatch(r'[a-f0-9]{32}', admission_id)):
                raise HTTPException(422, 'Invalid admission display identity')
            text, images = self.api._validated_workspace_turn({k: v for k, v in params.items() if k not in ('queued', 'admission_id')})
            live = await self.transport.call('session.activate', scoped)
            initial = live
            if live.get('running') and not queued:
                raise HTTPException(409, 'This session is busy. Use guidance or explicitly queue a message.')
            # Multipart input is a pinned JsonValue prompt shape. The browser
            # uploads originals first and retains authenticated durable refs in
            # text; no session-wide image.attach mutation is used.
            native_input = params['input'] if images else text
            if images:
                from starlette.concurrency import run_in_threadpool
                await run_in_threadpool(verify_image_refs, self.profile, text, images)
            if params.get('model'):
                from starlette.concurrency import run_in_threadpool
                model, provider = await run_in_threadpool(model_selection, self.profile, params['model'], params.get('provider'), self.transport)
                # This read-only pinned query waits for a cold agent build.
                # Switching an explicit provider before that build completes can
                # otherwise be overwritten by the builder's captured defaults.
                await self.transport.call('approval.pending', scoped)
                live = await self.transport.call('session.activate', {**scoped, 'omit_messages': True})
                current = live.get('info') or {}
                self.current_model, self.current_provider = current.get('model'), current.get('provider')
                selection = model + ' --session'
                if provider:
                    selection += ' --provider ' + provider
                switched = {} if model == self.current_model and (not provider or provider == self.current_provider) else await self.transport.call('config.set', {**scoped, 'key': 'model', 'value': selection, 'scope': 'session'})
                if switched.get('confirm_required') or switched.get('deferred'):
                    raise HTTPException(409, 'Selected runtime model unavailable; no prompt submitted')
                confirmed = await self.transport.call('session.activate', {**scoped, 'omit_messages': True})
                info = confirmed.get('info') or {}
                if info.get('model') != model or provider and info.get('provider') != provider:
                    raise HTTPException(409, 'Selected runtime model was not applied; no prompt submitted')
            if self.owner:
                self.owner.begin(initial, text, queued=queued and bool(initial.get('running')), admission_id=admission_id)
            self.submit_dispatched = True
            try:
                submitted = await self.transport.call('prompt.submit', {**scoped, 'text': native_input, **({'queued': True} if queued else {})})
            except Exception:
                # The pin has no durable receipt establishing non-admission.
                # Errors after dispatch cannot authorize safe automatic retry.
                raise HTTPException(503, 'Native submission outcome unknown. Inspect history before sending again.')
            return {**submitted, 'outcome': 'accepted', 'crash_safe_idempotency': False}
        if method in ('chat.stop', 'chat.steer'):
            if method == 'chat.stop' and params or method == 'chat.steer' and (set(params) != {'text'} or not isinstance(params['text'], str) or not params['text'].strip() or len(params['text']) > 65536):
                raise HTTPException(422, 'Invalid action')
            result = await self.transport.call('session.interrupt' if method == 'chat.stop' else 'session.steer', {**scoped, **params})
            if method == 'chat.steer' and result.get('status') != 'rejected' and self.owner:
                frame = self.transport.sanitize({'jsonrpc': '2.0', 'method': 'chat.correction', 'params': {'text': params['text']}})
                self.owner.record(frame)
                self.owner.publish(frame)
            return result
        if method == 'chat.answer':
            if set(params) != {'request_id', 'result'}:
                raise HTTPException(422, 'Invalid answer')
            opened = next((r for r in server_requests.open_requests(self.runtime) if r['id'] == params['request_id']), None)
            if not opened or opened['method'] not in ('approval', 'clarify', 'secret'):
                raise HTTPException(409, 'Request is no longer open in this session')
            from tui_gateway.contracts.server_requests import ApprovalResult, ClarifyResult, ValueResult
            schema = {'approval': ApprovalResult, 'clarify': ClarifyResult, 'secret': ValueResult}[opened['method']]
            try:
                answer = schema.model_validate(params['result']).model_dump(exclude_none=True)
            except Exception:
                raise HTTPException(422, 'Invalid request answer')
            if opened['method'] == 'approval' and answer['choice'] not in opened['params'].get('choices', []):
                raise HTTPException(422, 'Approval choice unavailable')
            if opened['method'] == 'clarify' and set(answer.get('answers', {})) - {q['qid'] for q in opened['params']['questions']}:
                raise HTTPException(422, 'Unknown clarification question')
            if opened['method'] == 'secret' and answer['value']:
                self.transport.secrets.add(answer['value'])
            settled = server_requests.resolve_response({'jsonrpc': '2.0', 'id': opened['id'], 'result': answer})
            if not settled:
                raise HTTPException(409, 'Request already settled')
            return {'settled': True}
        raise HTTPException(404, 'Native chat operation unavailable')


def model_selection(profile, model, provider, transport):
    """Resolve only gateway aliases equivalent to an existing native provider."""
    import re
    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_cli.config import load_config
    from agent.secret_scope import get_secret
    with _config_profile_scope(profile):
        config = load_config() or {}
        providers = config.get('providers') or {}
        default = config.get('model') or {}
        if isinstance(default, str):
            default = {'default': default}
        routes = ((config.get('platforms') or {}).get('api_server') or {}).get('model_routes') or {}
        for entry in [default, *providers.values(), *routes.values()]:
            if isinstance(entry, dict):
                secret = entry.get('api_key') or (get_secret(entry['key_env'], '') if entry.get('key_env') else '')
                if secret:
                    transport.secrets.add(secret)
        route = routes.get(model)
        if isinstance(route, dict):
            provider = route.get('provider') or default.get('provider')
            native = providers.get(provider) or {}
            base = native.get('base_url') or default.get('base_url')
            key_env = native.get('key_env') or default.get('key_env')
            key = native.get('api_key') or (get_secret(key_env, '') if key_env else '')
            if route.get('base_url') and route['base_url'] != base or route.get('api_key') and route['api_key'] != key:
                raise HTTPException(409, 'This gateway model route has no equivalent native provider')
            model = route.get('model')
        if not isinstance(model, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._:/@+~-]{0,255}', model):
            raise HTTPException(422, 'Invalid native model')
        if provider and (not isinstance(provider, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]*', provider)):
            raise HTTPException(422, 'Invalid native provider')
        return model, provider


def verify_image_refs(profile, text, images):
    """Every multipart image must match a durable upload in this exact profile."""
    import base64
    import re
    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_constants import get_hermes_home
    from pathlib import Path
    with _config_profile_scope(profile):
        root = Path(get_hermes_home()).resolve() / 'uploads' / 'chathermes'
        if root.resolve() != root:
            raise HTTPException(422, 'Image upload directory unavailable')
        refs = re.findall(r'Attached image [^\n]+: ([^\n]+)', text)
        if len(refs) != len(images):
            raise HTTPException(422, 'Native images require durable authenticated upload references')
        for ref, encoded in zip(refs, images):
            path = Path(ref)
            if not re.fullmatch(r'[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)', path.name) or path.is_symlink() or path.resolve().parent != root.resolve() or not path.is_file():
                raise HTTPException(422, 'Image reference unavailable in this profile')
            data = base64.b64decode(encoded, validate=True)
            if path.stat().st_size != len(data) or path.read_bytes() != data:
                raise HTTPException(422, 'Image reference does not match uploaded content')


def check_profile_session(profile, stored):
    """Do not allow native cold-resume adoption to cross the plugin's profile boundary."""
    from pathlib import Path
    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_constants import get_hermes_home, get_process_hermes_home
    from tui_gateway import server
    with _config_profile_scope(profile):
        home = Path(get_hermes_home()).resolve()
        with server._profile_db({'profile': profile}) as db:
            if db is not None and db.get_session(stored) is not None:
                return
        with server._sessions_lock:
            for record in server._sessions.values():
                owner = Path(record.get('profile_home') or get_process_hermes_home()).resolve()
                if record.get('session_key') == stored and owner == home:
                    return
    raise HTTPException(404, 'Session unavailable in this profile')


def register_profile_secrets(profile, transport):
    """Redact provider credentials even when merely resuming an active turn."""
    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_cli.config import load_config
    from agent.secret_scope import get_secret
    with _config_profile_scope(profile):
        config = load_config() or {}
        entries = [config.get('model'), *(config.get('providers') or {}).values(),
                   *(((config.get('platforms') or {}).get('api_server') or {}).get('model_routes') or {}).values()]
        for entry in entries:
            if isinstance(entry, dict):
                secret = entry.get('api_key') or (get_secret(entry['key_env'], '') if entry.get('key_env') else '')
                if secret:
                    transport.secrets.add(secret)
