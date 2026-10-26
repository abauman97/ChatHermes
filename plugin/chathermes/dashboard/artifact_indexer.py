"""Small in-process reconciler; histories are fetched by three bounded workers."""
import asyncio
import json
import os
import time
from urllib.parse import quote
from fastapi import Request
from . import artifact_store as storage
from .artifact_extraction import extract


class Source:
    """The pinned profile REST history and native Project membership contracts."""
    def __init__(self, api):
        self.api = api

    async def profiles(self):
        def names():
            from hermes_cli.web_server_profiles import serving_profile_name
            hosted = serving_profile_name()
            if os.environ.get('HERMES_PLUGIN_HOST_PROCESS') == '1':
                if not hosted:
                    raise RuntimeError('Profile unavailable')
                return [hosted]
            from hermes_cli.profiles import list_profiles
            return list(dict.fromkeys(['default'] + [entry.name for entry in list_profiles()]))
        return await asyncio.to_thread(names)

    async def get(self, profile, path):
        root, default_key = await asyncio.to_thread(self.api._gateway_settings)
        key = default_key if profile == 'default' else await asyncio.to_thread(self.api._profile_gateway_key, profile)
        prefix = '/p/' + profile
        async with self.api._client() as client:
            response = await client.get(root + prefix + path, headers={'Authorization': 'Bearer ' + (key or '')})
            response.raise_for_status()
            return json.loads(self.api._safe_body(response.content, key))

    async def sessions(self, profile):
        rows = {}
        offset = 0
        while True:
            result = await self.get(profile, f'/api/sessions?limit=200&offset={offset}')
            entries = result['data']
            for row in entries:
                rows[row['id']] = row
            if not result['has_more'] or not entries:
                return list(rows.values())
            # Pinned Hermes backfills pins beyond the pagination window.
            offset += sum(not row.get('pinned') for row in entries)

    async def projects(self, profile):
        request = Request({'type': 'http', 'method': 'GET', 'path': '/', 'headers': [], 'query_string': ('profile=' + profile).encode()})
        transport = self.api._new_rpc_transport(request)
        try:
            tree = await transport.call('projects.tree', {'profile': profile, 'preview_limit': 0})
            membership = {}
            for project in tree['projects']:
                # The pin provides full membership IDs even when preview and lane
                # session hydration are disabled. No per-Project history scan.
                for identity in project['sessionIds']:
                    membership[identity] = (project['id'], None if project.get('isNoProject') else project.get('label'))
            return membership
        finally:
            transport.close()

    async def session(self, profile, session):
        return (await self.get(profile, '/api/sessions/' + quote(session, safe='')))['session']

    async def messages(self, profile, session, inline=False):
        rows, offset = [], 0
        while True:
            result = await self.get(profile, '/api/sessions/' + quote(session, safe='') + f'/messages?limit=500&offset={offset}&order=oldest&inline_images={str(inline).lower()}')
            entries = result['data']
            rows.extend(entries)
            if len(entries) < 500:
                return rows
            offset += len(entries)


def modification(session):
    # last_active is the pinned runtime's latest message timestamp. Metadata is
    # included so title/membership changes are reflected without waiting for audit.
    return json.dumps([session.get(key) for key in ('last_active', 'updated_at', 'message_count', 'title', 'projectId', 'projectTitle')], separators=(',', ':'))


class Service:
    def __init__(self, source, store, interval=60, audit_interval=3600):
        self.source, self.store = source, store
        self.interval, self.audit_interval = interval, audit_interval
        self.queue = asyncio.Queue()
        self.pending, self.dirty, self.latest = set(), set(), {}
        self.wake = asyncio.Event()
        self.tasks = []
        self.reconciling = asyncio.Lock()

    def start(self):
        self.tasks = [asyncio.create_task(self.worker()) for _ in range(3)]
        self.tasks.append(asyncio.create_task(self.run()))

    def trigger(self, profile, session=None):
        if session:
            key = (profile, session)
            self.dirty.add(key)
        self.wake.set()

    def enqueue(self, profile, session):
        key = (profile, session['id'])
        previous = self.latest.get(key)
        self.latest[key] = session
        if key in self.pending and previous and modification(previous) != modification(session):
            self.dirty.add(key)
        if key not in self.pending:
            self.pending.add(key)
            self.queue.put_nowait(key)

    async def reconcile(self):
        if self.reconciling.locked():
            return
        async with self.reconciling:
            for profile in await self.source.profiles():
                try:
                    sessions = await self.source.sessions(profile)
                    # A Project lookup failure must not erase known associations.
                    membership = await self.source.projects(profile)
                    checkpoints = await asyncio.to_thread(storage.checkpoints, self.store, profile)
                    seen = set()
                    now = time.time()
                    for session in sessions:
                        identity = session['id']
                        seen.add(identity)
                        session['projectId'], session['projectTitle'] = membership.get(identity, (None, None))
                        checkpoint = checkpoints.get(identity)
                        key = (profile, identity)
                        if (not checkpoint or checkpoint['status'] != 'ready' or key in self.dirty
                                or checkpoint['modification'] != modification(session)
                                or now - (checkpoint['indexed_at'] or 0) >= self.audit_interval):
                            self.enqueue(profile, session)
                    for identity in checkpoints.keys() - seen:
                        # Listing can exclude archived/hidden sessions or race with
                        # pagination. Only an exact authoritative 404 proves deletion.
                        try:
                            await self.source.session(profile, identity)
                        except Exception as error:
                            if getattr(getattr(error, 'response', None), 'status_code', None) == 404:
                                await asyncio.to_thread(storage.remove_session, self.store, profile, identity)
                except asyncio.CancelledError:
                    raise
                except Exception:
                    # Preserve records on profile/gateway failure; next cycle retries.
                    continue

    async def worker(self):
        while True:
            key = await self.queue.get()
            profile, identity = key
            self.dirty.discard(key)
            session = self.latest[key]
            try:
                messages = await self.source.messages(profile, identity)
                files = await asyncio.to_thread(extract, messages, session)
                await asyncio.to_thread(storage.replace_session, self.store, profile, session, modification(session), files)
            except asyncio.CancelledError:
                raise
            except Exception:
                await asyncio.to_thread(storage.failed, self.store, profile, identity)
            finally:
                self.pending.discard(key)
                # A completion arriving during fetch requires another pass.
                if key in self.dirty:
                    self.enqueue(profile, self.latest[key])
                else:
                    self.latest.pop(key, None)
                self.queue.task_done()

    async def run(self):
        while True:
            self.wake.clear()
            try:
                await self.reconcile()
            except asyncio.CancelledError:
                raise
            except Exception:
                pass
            try:
                await asyncio.wait_for(self.wake.wait(), timeout=self.interval)
            except asyncio.TimeoutError:
                pass

    async def close(self):
        for task in self.tasks:
            task.cancel()
        await asyncio.gather(*self.tasks, return_exceptions=True)
        self.tasks = []
