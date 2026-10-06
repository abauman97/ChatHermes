"""Retained native viewers; raw recovery frames, never a second agent/transcript.

All registry/subscriber/spool operations run on the dashboard event loop. Hermes
threads enter through _RpcTransport.write's thread-safe delivery. Spools are
private anonymous temporary files and never contain credentials or request answers.
"""
import asyncio
import json
import tempfile
import time
from fastapi import HTTPException

OWNERS = {}
TERMINAL_TTL = 24 * 60 * 60
MAX_OWNERS = 64
PAGE_BYTES = 512 * 1024


class Owner:
    def __init__(self, api, transport, profile, stored):
        self.api, self.transport, self.profile, self.stored = api, transport, profile, stored
        self.runtime = None
        self.snapshot = {}
        self.lock = asyncio.Lock()
        self.subscribers = set()
        self.spool = tempfile.TemporaryFile(mode='w+b')
        self.offsets = []
        self.start_offset = 0
        self.base_ids = None
        self.degraded = False
        self.last_seq = 0
        self.epoch = None
        self.finished_at = None
        self.cleanup = None
        self.reconciled = False
        self.children = set()
        self.queued_inputs = []
        self.notified = set()
        self.push_session = stored
        transport.on_frame = self.capture
        from tui_gateway import server, server_requests
        server.register_live_transport(transport)
        server._start_backend_heartbeat_refresher()
        server._schedule_startup_orphan_sweep()
        server_requests.advertise(transport, True)

    def capture(self, frame):
        p = frame.get('params') or {}
        # The transport is profile-bound. During first resume the runtime is not
        # known yet; adopt only after that RPC, then seed native replay below.
        if p.get('session_id') != self.runtime:
            return
        if frame.get('method') == 'event':
            seq = p.get('seq')
            if type(seq) is int:
                if seq <= self.last_seq:
                    return
                self.last_seq = seq
            kind = p.get('type', '')
            payload = p.get('payload') or {}
            child = payload.get('subagent_id') or payload.get('child_session_id') or (str(payload['delegation_id']) + ':' + str(payload.get('task_index')) if payload.get('delegation_id') else None)
            if child and kind in ('subagent.start', 'subagent.spawn_requested'):
                self.children.add(child)
            elif child and kind in ('subagent.complete', 'subagent.failed', 'subagent.cancelled'):
                self.children.discard(child)
            if kind == 'message.start':
                if self.queued_inputs:
                    queued = self.queued_inputs.pop(0)
                    self.record(queued)
                    self.publish(queued)
                self.finished_at = None
            elif kind == 'message.complete':
                self.finished_at = time.time()
                self.schedule_cleanup()
                if payload.get('status', 'complete') == 'complete':
                    self.notify('turn.complete', p.get('seq'))
                elif payload.get('status') in ('error', 'failed', 'stopped', 'interrupted'):
                    self.notify('attention', p.get('seq'))
            if kind in ('approval', 'clarify'):
                request_id = frame.get('id')
                self.notify(kind, request_id if isinstance(request_id, (str, int)) else p.get('seq'))
            self.record(frame)
        elif frame.get('method') not in ('approval', 'clarify') and 'id' in frame:
            from tui_gateway import server_requests
            server_requests.resolve_response({'id': frame['id'], 'error': {
                'code': server_requests.NOT_SHOWN_CODE, 'message': 'Unavailable in ChatHermes'}}, self.transport)
            frame = {'jsonrpc': '2.0', 'method': 'chat.unsupported', 'params': {'method': frame['method']}}
        self.publish(frame)

    def notify(self, kind, identity):
        if identity is None:
            return
        key = (kind, str(identity))
        if key in self.notified:
            return
        self.notified.add(key)
        if len(self.notified) > 2048:
            self.notified.clear()
            self.notified.add(key)
        try:
            sender = self.api._push_sender_module
            if sender:
                sender.notify(self.profile, self.push_session, kind, str(identity))
        except Exception:
            pass

    def record(self, frame):
        if self.degraded:
            return
        try:
            frame['chat_offset'] = self.start_offset + len(self.offsets) + 1
            raw = json.dumps(frame, ensure_ascii=False).encode('utf-8') + b'\n'
            self.spool.seek(0, 2)
            position = self.spool.tell()
            self.spool.write(raw)
            self.offsets.append(position)
        except (OSError, ValueError):
            self.degraded = True
            self.publish({'jsonrpc': '2.0', 'method': 'chat.unsupported', 'params': {
                'method': 'Recovery storage unavailable; live execution continues'}})

    def publish(self, frame):
        for queue in tuple(self.subscribers):
            if queue.full():
                # A slow browser loses its viewer, never the native owner.
                self.subscribers.discard(queue)
                while not queue.empty():
                    queue.get_nowait()
                queue.put_nowait({'method': 'transport.closed', 'params': {}})
            else:
                queue.put_nowait(frame)

    async def attach(self):
        scoped = {'profile': self.profile, 'session_id': self.runtime}
        if self.runtime:
            try:
                result = await self.transport.call('session.activate', scoped)
            except HTTPException as error:
                if error.status_code != 409:
                    raise
                result = await self.transport.call('session.resume', {
                    'profile': self.profile, 'session_id': self.stored, 'source': 'desktop'})
        else:
            result = await self.transport.call('session.resume', {
                'profile': self.profile, 'session_id': self.stored, 'source': 'desktop'})
        runtime = result['session_id']
        if self.runtime and runtime != self.runtime:
            self.reset()
        self.runtime = runtime
        self.push_session = runtime
        self.snapshot = result
        if not self.epoch:
            replay = await self.transport.call('session.events.since', {
                'profile': self.profile, 'session_id': runtime, 'last_seen': 0})
            self.epoch = replay.get('epoch')
            # Existing external turns are explicitly bounded, not falsely
            # advertised as fully observed from their first frame.
            if self.base_ids is None and result.get('running'):
                self.degraded = True
            # External replay has no atomic boundary with inflight text. Do not
            # append its assistant deltas over the snapshot. Retained plugin
            # turns never take this path: they already have their raw spool.
            self.last_seq = max((event.get('seq', 0) for event in replay.get('events', [])), default=0)
        return {**result, 'recovery': {'epoch': self.epoch, 'start': self.start_offset, 'through': self.start_offset + len(self.offsets),
            'base_row_ids': self.base_ids, 'complete': self.base_ids is not None and not self.degraded}}

    def reset(self):
        self.start_offset += len(self.offsets)
        self.spool.close()
        self.spool = tempfile.TemporaryFile(mode='w+b')
        self.offsets.clear()
        self.base_ids = None
        self.degraded = False
        self.last_seq = 0
        self.epoch = None
        self.reconciled = False
        self.children.clear()
        self.queued_inputs.clear()

    def retire(self):
        """Delete reconciled raw data without rewinding the viewer watermark."""
        epoch, seq = self.epoch, self.last_seq
        self.reset()
        self.epoch, self.last_seq = epoch, seq
        self.reconciled = True

    def begin(self, snapshot, text, queued=False, admission_id=None):
        if self.base_ids is None or self.reconciled:
            self.reset()
            self.base_ids = [str(row['row_id']) for row in snapshot.get('messages', []) if row.get('row_id') is not None]
            from tui_gateway import event_replay
            self.epoch = event_replay.replay_epoch()
        self.reconciled = False
        frame = self.transport.sanitize({'jsonrpc': '2.0', 'method': 'chat.input', 'params': {'text': text, 'admission_id': admission_id}})
        if queued:
            self.queued_inputs.append(frame)
        else:
            self.record(frame)
            self.publish(frame)

    def replay(self, offset, through):
        if type(offset) is not int or type(through) is not int or not self.start_offset <= offset <= through <= self.start_offset + len(self.offsets):
            raise HTTPException(422, 'Invalid recovery boundary')
        frames, size = [], 0
        while offset < through and (size < PAGE_BYTES or not frames):
            self.spool.seek(self.offsets[offset - self.start_offset])
            raw = self.spool.readline()
            size += len(raw)
            frames.append(json.loads(raw))
            offset += 1
        return {'frames': frames, 'offset': offset, 'through': through, 'epoch': self.epoch}

    def schedule_cleanup(self):
        if self.cleanup:
            self.cleanup.cancel()
        self.cleanup = asyncio.get_running_loop().call_later(TERMINAL_TTL, self.expire)

    def expire(self):
        # Never expire an executing session merely because the browser left.
        from tui_gateway import server
        with server._sessions_lock:
            session = server._sessions.get(self.runtime) or {}
            active = session.get('running') or session.get('queued_prompt')
        if active or self.children or self.subscribers:
            self.schedule_cleanup()
            return
        self.close()

    def unsubscribe(self, queue):
        self.subscribers.discard(queue)
        if self.reconciled and not self.subscribers and not self.children:
            self.expire()
        elif not self.subscribers:
            self.schedule_cleanup()

    def close(self):
        if self.cleanup:
            self.cleanup.cancel()
        from tui_gateway import server_requests
        server_requests.forget(self.transport)
        self.transport.close()
        self.spool.close()
        OWNERS.pop((self.profile, self.stored), None)


async def acquire(api, transport, profile, stored):
    key = (profile, stored)
    owner = OWNERS.get(key)
    if owner is None or owner.transport.closed or owner.transport.loop.is_closed():
        if owner is not None:
            owner.close()
        if len(OWNERS) >= MAX_OWNERS:
            raise HTTPException(503, 'Too many active chat viewers')
        owner = Owner(api, transport, profile, stored)
        OWNERS[key] = owner
    elif owner.transport is not transport:
        owner.transport.secrets.update(transport.secrets)
        transport.close()
    return owner


async def shutdown():
    for owner in tuple(OWNERS.values()):
        owner.close()
