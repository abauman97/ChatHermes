"""Bridge the pinned Hermes cron contracts to existing Scheduled history and Web Push.

No result copies, receipts, retries, or session mutations live here. Hermes owns
execution and delivery deduplication; Web Push tags replace duplicate notifications.
"""
from contextlib import closing
import asyncio
import hashlib
import json
import re
import sqlite3

from .dashboard import push_sender

_ID = re.compile(r'[A-Za-z0-9][A-Za-z0-9_-]{0,159}\Z')


def _queued_execution(home, message):
    """The native queue drain does not bind current_cron_execution.

    Read its *delivering* rows without opening the writer or claiming work. The
    standalone hook has no metadata argument. Match the exact scheduler payload,
    never a job ID parsed from model text or the most recent run of a job.
    """
    from cron.scheduler_delivery import _redact_cron_payload
    from gateway.platforms.base import BasePlatformAdapter

    path = home / 'cron' / 'deliveries.db'
    if not path.is_file():
        return None
    matches = []
    with closing(sqlite3.connect(path.as_uri() + '?mode=ro', uri=True)) as db:
        rows = db.execute("SELECT execution_id, job_json, content FROM deliveries WHERE status='delivering'").fetchall()
    for execution_id, job_json, content in rows:
        job = json.loads(job_json)
        wrapped = (f"Cronjob Response: {job.get('name', job['id'])}\n"
                   f"(job_id: {job['id']})\n-------------\n\n{content}\n\n"
                   'To stop or manage this job, send me a new message '
                   f"(e.g. \"stop reminder {job.get('name', job['id'])}\").")
        for candidate in (content, wrapped):
            _, cleaned = BasePlatformAdapter.extract_media(candidate)
            if _redact_cron_payload(cleaned, 'delivery content') == message:
                matches.append((job['id'], execution_id))
                break
    # Equal outputs from concurrent jobs cannot be safely attributed.
    return matches[0] if len(matches) == 1 else None


def _result(home, job_id, execution_id):
    from cron.executions import get_execution
    from hermes_cli.web_routers.cron import _iso_to_epoch, _execution_contains
    from hermes_cli.web_server_cron import _cron_store_scope
    from .dashboard.plugin_api import _scheduled_docs

    if not _ID.fullmatch(job_id) or not re.fullmatch(r'[a-f0-9]{32}', execution_id):
        raise ValueError('Invalid cron identity')
    with _cron_store_scope(home):
        execution = get_execution(execution_id)
        if not execution or execution['job_id'] != job_id:
            raise ValueError('Unknown cron execution')
        window = {'claimed_at': _iso_to_epoch(execution['claimed_at']),
                  'finished_at': _iso_to_epoch(execution.get('finished_at'))}
        docs = [doc for doc in _scheduled_docs(home, job_id)
                if doc['started_at'] is not None and _execution_contains(window, doc['started_at'], 0)]
    if len(docs) > 1:
        raise ValueError('Ambiguous cron output')
    # Crash failures can have a native execution record without saved output.
    return {'job_id': job_id, 'run_id': docs[0]['id'] if docs else 'execution:' + execution_id}


def _send(chat_id, message, thread_id, media_files):
    from cron.execution_identity import current_cron_execution
    from hermes_constants import get_hermes_home
    from hermes_cli.profiles import current_profile_name

    if thread_id or not isinstance(chat_id, str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,128}', chat_id):
        return {'error': 'Invalid ChatHermes destination'}
    home = get_hermes_home().resolve()
    profile = current_profile_name('default')
    current = current_cron_execution()
    identity = (current.job_id, current.execution_id) if current else _queued_execution(home, message)
    if identity is None:
        return {'error': 'ChatHermes delivery requires an unambiguous native cron execution'}
    target = _result(home, *identity)
    # Body stays generic: the authenticated Scheduled reader already redacts output.
    # Media remains in Hermes history; no file is uploaded to the push provider.
    key = hashlib.sha256(f'{profile}:{identity[1]}:{chat_id}'.encode()).hexdigest()
    ok = push_sender._deliver(profile, '', 'scheduled', key, target=target,
                              destination=None if chat_id == 'scheduled' else chat_id)
    if not ok:
        return {'error': 'ChatHermes push delivery unavailable or failed'}
    return {'success': True, 'message_id': key}


async def standalone_send(pconfig, chat_id, message, *, thread_id=None, media_files=None, force_document=False):
    """Await push completion even in a short-lived cron process; never spawn a daemon."""
    try:
        return await asyncio.to_thread(_send, chat_id, message, thread_id, media_files)
    except Exception:
        # Paths, output, endpoints and credentials must not escape through errors.
        return {'error': 'ChatHermes cron delivery unavailable'}
