"""SQLite, explicit delivery, and background indexing contracts for issue 177."""
import asyncio
import importlib.util
import json
import sqlite3
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from types import SimpleNamespace

import httpx
import pytest

ROOT = Path(__file__).resolve().parents[1] / 'plugin/chathermes/dashboard'
spec = importlib.util.spec_from_file_location('artifact_contract', ROOT / 'artifact_indexer.py', submodule_search_locations=[str(ROOT)])
indexer = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = indexer
spec.loader.exec_module(indexer)
store = indexer.storage
extraction = sys.modules['artifact_contract.artifact_extraction']
shared = sys.modules['artifact_contract.database']


@pytest.fixture
def state(tmp_path):
    return SimpleNamespace(_path=lambda: tmp_path / 'state' / 'push.json')


def test_shared_database_transactions_upgrade_cleanup_and_permissions(state):
    path = shared.database_path(state)
    with shared.database(state) as db:
        assert db.execute('PRAGMA journal_mode').fetchone()[0] == 'wal'
        assert db.execute('PRAGMA busy_timeout').fetchone()[0] == 10000
        assert db.execute('PRAGMA foreign_keys').fetchone()[0] == 1
        assert db.execute('PRAGMA user_version').fetchone()[0] == 2
        db.execute("INSERT INTO completions VALUES ('p','s','1','turn.complete')")
    with pytest.raises(sqlite3.ProgrammingError):
        db.execute('SELECT 1')
    with pytest.raises(RuntimeError):
        with shared.database(state) as db:
            db.execute("DELETE FROM completions")
            raise RuntimeError('rollback')
    with shared.database(state) as db:
        assert db.execute('SELECT count(*) FROM completions').fetchone()[0] == 1
    assert path.stat().st_mode & 0o777 == 0o600
    assert path.parent.stat().st_mode & 0o777 == 0o700
    # Simulate the first schema release, then reopen for the incremental upgrade.
    path.unlink()
    with sqlite3.connect(path) as db:
        for sql in shared.MIGRATIONS[0]:
            db.execute(sql)
        db.execute('PRAGMA user_version=1')
    with shared.database(state) as db:
        assert db.execute('SELECT count(*) FROM artifacts').fetchone()[0] == 0
        db.execute('PRAGMA user_version=99')
    with pytest.raises(RuntimeError, match='Unsupported'):
        with shared.database(state):
            pass


def test_concurrent_writers_use_one_persistent_database(state):
    def write(index):
        with shared.database(state) as db:
            db.execute('INSERT INTO completions VALUES (?,?,?,?)', ('p', 's', str(index), 'done'))
    with ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(write, range(30)))
    with shared.database(state) as db:
        assert db.execute('SELECT count(*) FROM completions').fetchone()[0] == 30
    assert [path.name for path in shared.database_path(state).parent.glob('*.sqlite3')] == ['chathermes.sqlite3']


@pytest.mark.parametrize('text', [
    '`MEDIA:/tmp/private.pdf`', '> MEDIA:/tmp/private.pdf', '- MEDIA:/tmp/private.pdf',
    '~~~text\nMEDIA:/tmp/private.pdf\n~~~', '```\nMEDIA:/tmp/private.pdf',
    '    MEDIA:/tmp/private.pdf', '`Example\nMEDIA:/tmp/private.pdf\n`',
    '<pre>\nMEDIA:/tmp/private.pdf\n</pre>', 'MEDIA:/tmp/private.pdf is an example',
    '<untrusted_tool_result>\n\nMEDIA:/tmp/private.pdf\n</untrusted_tool_result>',
    '<UNTRUSTED_TOOL_RESULT>\n\nAttached file private.pdf: /tmp/private.pdf',
    'Example MEDIA:/tmp/private.pdf', '@file:/tmp/private.pdf',
    '[file](file:///tmp/private.pdf)', '/tmp/private.pdf',
])
def test_rejects_quoted_context_and_implicit_references(text):
    assert extraction.text_artifacts(text) == []


@pytest.mark.parametrize('path', ['/tmp/a chart.png', '/tmp/file.unknown', './extensionless', 'https://example.test/file.pdf'])
def test_explicit_delivery_formats(path):
    assert extraction.text_artifacts('MEDIA:"' + path + '"')[0]['path'] == path


def test_parser_upload_tool_multipart_and_no_image_contents():
    session = {'id': 's', 'last_active': 100}
    messages = [
        {'id': 1, 'role': 'user', 'content': 'Attached file original name.txt: /tmp/a.txt\nMEDIA:/tmp/a.txt\n@file:/tmp/a.txt', 'timestamp': 10},
        {'id': 2, 'role': 'assistant', 'content': 'MEDIA:/tmp/a.txt\nMEDIA:/tmp/final.pdf', 'timestamp': 20},
        {'id': 3, 'role': 'tool', 'content': json.dumps({'media_tag': 'MEDIA:/tmp/voice.wav', 'mime': 'audio/wav', 'size': 42})},
        {'id': 4, 'role': 'tool', 'content': json.dumps({'stdout': 'MEDIA:/tmp/not.pdf'})},
        {'id': 5, 'role': 'user', 'content': [{'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,aGVsbG8='}}]},
    ]
    files = extraction.extract(messages, session)
    assert [file['path'] for file in files] == ['/tmp/a.txt', '/tmp/final.pdf', '/tmp/voice.wav', '/api/plugins/chathermes/artifact-images/s/5/0']
    assert files[0]['name'] == 'original name.txt'
    assert files[0]['direction'] == 'uploaded'
    assert files[2]['size'] == 42
    assert 'aGVsbG8=' not in json.dumps(files)
    assert extraction.tool_artifacts({'success': False, 'media_tag': 'MEDIA:/tmp/no.pdf'}) == []
    assert extraction.tool_artifacts({'nested': {'media_tag': 'MEDIA:/tmp/no.pdf'}}) == []
    assert extraction.tool_artifacts({'media_tag': 'MEDIA:/tmp/no.pdf\n> MEDIA:/tmp/no.pdf'}) == []
    assert extraction.text_artifacts('```\n<untrusted_tool_result>\n```\n\nMEDIA:/tmp/yes.pdf')[0]['path'] == '/tmp/yes.pdf'
    assert extraction.text_artifacts('MEDIA:/tmp/a chart.png')[0]['path'] == '/tmp/a chart.png'


def seed(state, profile='alpha', identity='s', count=6, project='project'):
    session = {'id': identity, 'title': 'Files', 'projectId': project}
    files = [{'path': f'/tmp/{i}.txt', 'name': f'{i}.txt', 'type': 'text/plain', 'direction': 'generated', 'createdAt': '2026-10-01T00:00:00+00:00'} for i in range(count)]
    store.replace_session(state, profile, session, 'revision', files)
    return session, files


def test_cursor_order_scope_replacement_deletion_and_failure(state):
    session, files = seed(state)
    seed(state, 'beta')
    seed(state, identity='other', project='other')
    first = store.page(state, 'alpha', 'project', 2)
    assert all('size' not in file for file in first['files'])
    assert [file['path'] for file in first['files']] == ['/tmp/5.txt', '/tmp/4.txt']
    second = store.page(state, 'alpha', 'project', 2, first['nextCursor'])
    third = store.page(state, 'alpha', 'project', 2, second['nextCursor'])
    assert third['nextCursor'] is None
    assert len({f['path'] for page in (first, second, third) for f in page['files']}) == 6
    with pytest.raises(ValueError):
        store.page(state, 'beta', 'project', 2, first['nextCursor'])
    for cursor in ['invalid', 'e30', first['nextCursor']]:
        with pytest.raises(ValueError):
            store.page(state, 'alpha', 'other', 2, cursor)
    store.failed(state, 'alpha', 's')
    assert len(store.page(state, 'alpha', 'project')['files']) == 6
    with pytest.raises(KeyError):
        store.replace_session(state, 'alpha', session, 'bad', [{}])
    assert len(store.page(state, 'alpha', 'project')['files']) == 6
    store.remove_file(state, 'alpha', 's', '/tmp/5.txt')
    store.replace_session(state, 'alpha', session, 'new', files)
    assert len(store.page(state, 'alpha', 'project')['files']) == 5
    assert len(store.page(state, 'beta', 'project')['files']) == 6
    store.remove_session(state, 'alpha', 's')
    assert store.page(state, 'alpha', 'project')['files'] == []


class Source:
    def __init__(self):
        self.rows = [{'id': 's', 'last_active': 1, 'title': 'First'}]
        self.reads = 0
        self.fail = False
        self.deleted = False
        self.project = 'p'
        self.active = self.maximum = 0

    async def profiles(self):
        return ['alpha', 'beta']

    async def sessions(self, profile):
        return [dict(row) for row in self.rows]

    async def projects(self, profile):
        return {row['id']: (self.project, self.project) for row in self.rows}

    async def session(self, profile, identity):
        raise httpx.HTTPStatusError('unavailable', request=httpx.Request('GET', 'http://test'), response=httpx.Response(404 if self.deleted else 503))

    async def messages(self, profile, identity):
        self.reads += 1
        self.active += 1
        self.maximum = max(self.maximum, self.active)
        try:
            await asyncio.sleep(0)  # yield to other workers, no readiness delay
            if self.fail:
                raise RuntimeError('secret never stored')
            return [{'id': 1, 'role': 'assistant', 'content': 'MEDIA:/tmp/final.pdf'}]
        finally:
            self.active -= 1


def test_background_indexing_reconcile_retry_restart_and_isolation(state):
    async def scenario():
        source = Source()
        service = indexer.Service(source, state)
        workers = [asyncio.create_task(service.worker()) for _ in range(3)]
        async def reconcile():
            await service.reconcile()
            await asyncio.wait_for(service.queue.join(), timeout=10)
        try:
            await reconcile()
            assert source.reads == 2
            assert store.page(state, 'alpha')['files'][0]['sessionTitle'] == 'First'
            await reconcile()
            assert source.reads == 2  # routine reconciliation skips unchanged history
            source.rows[0].update(last_active=2, title='Renamed')
            source.project = 'moved'
            source.fail = True
            await reconcile()
            assert store.page(state, 'alpha', 'p')['files']
            source.fail = False
            await reconcile()
            assert store.page(state, 'alpha', 'moved')['files'][0]['sessionTitle'] == 'Renamed'
            service.trigger('alpha', 's')
            await reconcile()
            reads = source.reads
            await indexer.Service(source, state).reconcile()
            assert source.reads == reads  # persisted checkpoints survive restart
            source.rows = []
            await reconcile()
            assert store.page(state, 'alpha')['files']  # 503 cannot prove deletion
            source.deleted = True
            await reconcile()
            assert store.page(state, 'alpha')['files'] == []
            source.rows = [{'id': str(i), 'last_active': 3} for i in range(12)]
            await asyncio.gather(service.reconcile(), service.reconcile())
            await asyncio.wait_for(service.queue.join(), timeout=10)
            assert source.maximum <= 3
            assert len(store.page(state, 'alpha')['files']) == 12
        finally:
            for task in workers:
                task.cancel()
            await asyncio.gather(*workers, return_exceptions=True)
    asyncio.run(scenario())


def test_dirty_work_is_deduplicated_and_interrupted_fetch_keeps_checkpoint(state):
    async def scenario():
        seed(state, identity='s')
        source = Source()
        started, release = asyncio.Event(), asyncio.Event()
        original = source.messages
        async def messages(profile, identity):
            started.set()
            await release.wait()
            return await original(profile, identity)
        source.messages = messages
        service = indexer.Service(source, state)
        worker = asyncio.create_task(service.worker())
        try:
            service.enqueue('alpha', source.rows[0])
            await asyncio.wait_for(started.wait(), timeout=5)
            for _ in range(10):
                service.trigger('alpha', 's')
                service.enqueue('alpha', source.rows[0])
            release.set()
            await asyncio.wait_for(service.queue.join(), timeout=10)
            assert source.reads == 2
            started.clear()
            release.clear()
            service.enqueue('alpha', source.rows[0])
            await asyncio.wait_for(started.wait(), timeout=5)
            worker.cancel()
            await asyncio.gather(worker, return_exceptions=True)
            assert store.page(state, 'alpha')['files']
            assert store.checkpoints(state, 'alpha')['s']['status'] == 'ready'
        finally:
            worker.cancel()
            await asyncio.gather(worker, return_exceptions=True)
    asyncio.run(scenario())


def test_source_uses_pinned_pagination_and_server_profile_credentials():
    async def scenario():
        requests = []
        def handler(request):
            requests.append(request)
            if request.url.path.endswith('/messages'):
                offset = int(request.url.params['offset'])
                return httpx.Response(200, json={'data': [{'id': i} for i in range(offset, min(offset + 500, 501))]})
            offset = int(request.url.params.get('offset', '0'))
            return httpx.Response(200, json={'data': [{'id': 'pin', 'pinned': True}, {'id': str(offset)}], 'has_more': offset == 0})
        api = SimpleNamespace(_gateway_settings=lambda: ('http://gateway.test', 'default-key'),
                              _profile_gateway_key=lambda profile: 'profile-key',
                              _safe_body=lambda body, key: body,
                              _client=lambda: httpx.AsyncClient(transport=httpx.MockTransport(handler)))
        source = indexer.Source(api)
        assert len(await source.sessions('alpha')) == 3
        assert requests[1].url.params['offset'] == '1'  # pin backfill is outside window
        assert len(await source.messages('alpha', 'session')) == 501
        assert all(request.headers['authorization'] == 'Bearer profile-key' for request in requests)
        assert all(request.url.path.startswith('/p/alpha/') for request in requests)
        assert requests[-1].url.params['inline_images'] == 'false'
        assert requests[-1].url.params['offset'] == '500'
    asyncio.run(scenario())


DELIVERY_FIXTURES = json.loads((ROOT.parents[2] / 'tests/fixtures/artifact-deliveries.json').read_text())


@pytest.mark.parametrize('text', DELIVERY_FIXTURES['positiveTextDeliveries'])
def test_conversation_and_index_extract_the_same_explicit_text_artifacts(text):
    frontend_contract = extraction.text_artifacts(text)
    backend_index = extraction.extract([{'id': 1, 'role': 'assistant', 'content': text}], {'id': 's'})
    assert [file['path'] for file in frontend_contract] == [file['path'] for file in backend_index]
    assert backend_index


@pytest.mark.parametrize('output', DELIVERY_FIXTURES['positiveToolDeliveries'])
def test_conversation_and_index_extract_the_same_explicit_tool_artifacts(output):
    frontend_contract = extraction.tool_artifacts(output)
    backend_index = extraction.extract([{'id': 1, 'role': 'tool', 'content': output}], {'id': 's'})
    assert [file['path'] for file in frontend_contract] == [file['path'] for file in backend_index]
    assert backend_index


@pytest.mark.parametrize('text', DELIVERY_FIXTURES['quotedDeliveries'])
def test_conversation_and_index_reject_the_same_quoted_references(text):
    assert extraction.text_artifacts(text) == []
    assert extraction.extract([{'id': 1, 'role': 'user', 'content': text}], {'id': 's'}) == []


@pytest.mark.parametrize('output', DELIVERY_FIXTURES['toolBodyDeliveries'])
def test_conversation_and_index_reject_the_same_tool_body_references(output):
    assert extraction.tool_artifacts(output) == []


def test_source_projects_uses_complete_native_membership_and_closes_transport():
    async def scenario():
        calls = []
        class Transport:
            async def call(self, method, params):
                calls.append((method, params))
                return {'projects': [{'id': 'p', 'label': 'Project', 'sessionIds': ['old', 'new'], 'repos': [], 'previewSessions': []}]}
            def close(self):
                calls.append('closed')
        source = indexer.Source(SimpleNamespace(_new_rpc_transport=lambda request: Transport()))
        assert await source.projects('alpha') == {'old': ('p', 'Project'), 'new': ('p', 'Project')}
        assert calls == [('projects.tree', {'profile': 'alpha', 'preview_limit': 0}), 'closed']
    asyncio.run(scenario())


@pytest.mark.parametrize('text', [
    'MEDIA:/tmp/report.pdf',
    'Here is the export.\nMEDIA:/tmp/report.pdf',
    'MEDIA:/tmp/report.pdf\nHere is the export.',
    'The example is `MEDIA:/tmp/private.pdf`.\nMEDIA:/tmp/report.pdf\nOther path: /tmp/secret.txt',
    'MEDIA:/tmp/report.pdf\nThe example is `MEDIA:/tmp/private.pdf`.',
])
def test_delivery_with_surrounding_text_does_not_promote_examples_or_paths(text):
    files = extraction.extract([{'id': 1, 'role': 'assistant', 'content': text}], {'id': 's'})
    assert [file['path'] for file in files] == ['/tmp/report.pdf']
