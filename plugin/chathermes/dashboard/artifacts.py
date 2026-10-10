"""Native attachment staging and a durable, profile-local artifact index.

The index stores references, never file bytes. Retrieval stays with Hermes's
filesystem bridge, including its remote execution backend and read guards.
"""
from contextlib import contextmanager
import base64
import hashlib
import json
import mimetypes
import re
import sqlite3
import time
from pathlib import Path
from fastapi import HTTPException


UPLOAD_REF = re.compile(r'^Attached (?:image|file) [^\r\n]+: ([^\r\n]+)$', re.M)
MEDIA_REF = re.compile(r"(?<![\w])MEDIA:[ \t]*(?:`([^`\r\n]+)`|\"([^\"\r\n]+)\"|'([^'\r\n]+)'|([^\s`\"']+))")


def references(content, uploaded=False):
    """User attachment markers/content parts, or assistant/tool MEDIA transfers.

    Paths, links, @file references and output keys alone are not transfers.
    Composer submission writes Attached image/file markers into native history.
    """
    found = []
    def walk(value):
        if isinstance(value, str):
            pattern = UPLOAD_REF if uploaded else MEDIA_REF
            for match in pattern.finditer(value):
                found.append(next(part for part in match.groups() if part is not None).strip())
            try:
                parsed = json.loads(value)
            except (ValueError, TypeError):
                return
            if isinstance(parsed, (dict, list)):
                walk(parsed)
        elif isinstance(value, list):
            for item in value:
                walk(item)
        elif isinstance(value, dict):
            if uploaded and value.get('type') == 'image_url':
                image = value.get('image_url')
                url = image.get('url') if isinstance(image, dict) else image
                if isinstance(url, str):
                    found.append(url)
            for key, item in value.items():
                if key != 'image_url':
                    walk(item)
    walk(content)
    return list(dict.fromkeys(value for value in found if value and not re.match(r'^(?:https?:|data:|javascript:|file:|#)', value, re.I)))


def identity(session, path):
    return hashlib.sha256((session + '\0' + path).encode()).hexdigest()


class Store:
    def __init__(self, home):
        self.path = Path(home) / 'chathermes-artifacts.sqlite'

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=15)
        db.row_factory = sqlite3.Row
        db.execute('CREATE TABLE IF NOT EXISTS artifacts (id TEXT PRIMARY KEY, session_id TEXT, path TEXT, ref_text TEXT, name TEXT, mime TEXT, size INTEGER, direction TEXT, created_at REAL, message_id TEXT, tool_call_id TEXT, submitted INTEGER DEFAULT 0, deleted INTEGER DEFAULT 0)')
        try:
            with db:
                yield db
        finally:
            db.close()

    def put(self, session, path, **fields):
        row = dict(id=identity(session, path), session_id=session, path=path,
                   ref_text='', name=Path(path).name, mime=mimetypes.guess_type(path)[0] or 'application/octet-stream',
                   size=None, direction='generated', created_at=time.time(), message_id=None, tool_call_id=None, submitted=1, deleted=0)
        row.update(fields)
        with self.connect() as db:
            db.execute('INSERT OR IGNORE INTO artifacts (' + ','.join(row) + ') VALUES (' + ','.join('?' for _ in row) + ')', list(row.values()))
        with self.connect() as db:
            return dict(db.execute('SELECT * FROM artifacts WHERE id=?', (row['id'],)).fetchone())

    def get(self, aid, session=None):
        with self.connect() as db:
            row = db.execute('SELECT * FROM artifacts WHERE id=? AND deleted=0', (aid,)).fetchone()
        if row is None or session is not None and row['session_id'] != session:
            raise HTTPException(404, 'Artifact unavailable in this conversation')
        return dict(row)

    def discover(self, db, session):
        offset = 0
        discovered = set()
        while True:
            rows = db.get_messages(session, limit=100, offset=offset, include_compacted=True, include_ancestors=True)
            for message in rows:
                if message.get('role') not in ('user', 'assistant', 'tool'):
                    continue
                content = message.get('content')
                text = content if isinstance(content, str) else json.dumps(content)
                names = {match[2]: match[1] for match in re.finditer(r'Attached (?:image|file) ([^\n]+): ([^\n]+)', text)}
                for reference in references(content, uploaded=message.get('role') == 'user'):
                    path = reference
                    info = db.get_session(session) or {}
                    cwd = info.get('cwd')
                    if not Path(path).is_absolute() and cwd and Path(cwd).is_absolute():
                        path = str(Path(cwd) / path)
                    row = self.put(session, path, name=names.get(reference, Path(path).name), ref_text=reference if path != reference else '', direction='uploaded' if message.get('role') == 'user' else 'generated',
                                   message_id=str(message.get('id', '')), tool_call_id=message.get('tool_call_id'),
                                   created_at=message.get('timestamp') or time.time())
                    if row['id'] not in discovered:
                        # Provenance must come from the first actual transfer,
                        # not an older heuristic mention of the same path.
                        with self.connect() as index:
                            index.execute('UPDATE artifacts SET submitted=1, direction=?, message_id=?, tool_call_id=?, created_at=? WHERE id=?',
                                          ('uploaded' if message.get('role') == 'user' else 'generated',
                                           str(message.get('id', '')), message.get('tool_call_id'),
                                           message.get('timestamp') or row['created_at'], row['id']))
                    discovered.add(row['id'])
            if len(rows) < 100:
                break
            offset += len(rows)
        # Revalidate old heuristic discoveries against complete message history.
        # Keep staged metadata and deletion tombstones, but hide unproven rows.
        with self.connect() as index:
            existing = index.execute('SELECT id FROM artifacts WHERE session_id=?', (session,)).fetchall()
            index.executemany('UPDATE artifacts SET submitted=? WHERE id=?',
                              [(int(row['id'] in discovered), row['id']) for row in existing])

    def rows(self, session=None):
        with self.connect() as db:
            return [dict(row) for row in db.execute('SELECT * FROM artifacts WHERE deleted=0 AND submitted=1' + (' AND session_id=?' if session else '') + ' ORDER BY created_at DESC', (session,) if session else ())]

    def deleted(self, aid):
        with self.connect() as db:
            db.execute('UPDATE artifacts SET deleted=1 WHERE path=(SELECT path FROM artifacts WHERE id=?)', (aid,))


def validate_upload(body):
    if not isinstance(body, dict) or set(body) - {'name', 'type', 'data', 'size'}:
        raise HTTPException(422, 'Invalid attachment')
    name, data = body.get('name'), body.get('data')
    if not isinstance(name, str) or not name or len(name) > 255 or any(c in name for c in '\r\n/\\\x00') or not isinstance(data, str):
        raise HTTPException(422, 'Invalid attachment')
    try:
        header, encoded = data.split(',', 1)
        if not re.fullmatch(r'data:[\w.+/-]*;base64', header):
            raise ValueError()
        raw = base64.b64decode(encoded, validate=True)
    except (ValueError, TypeError):
        raise HTTPException(422, 'Invalid attachment data')
    if not raw or len(raw) > 20 * 1024 * 1024:
        raise HTTPException(413, 'Attachments must contain 1 byte to 20 MB')
    mime = header[5:-7] or 'application/octet-stream'
    # Active content is a download, never an image embedded in the dashboard.
    image = mime in ('image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp')
    if image:
        valid = (mime == 'image/png' and raw.startswith(b'\x89PNG\r\n\x1a\n') or
                 mime == 'image/jpeg' and raw.startswith(b'\xff\xd8\xff') or
                 mime == 'image/gif' and raw.startswith((b'GIF87a', b'GIF89a')) or
                 mime == 'image/webp' and raw.startswith(b'RIFF') and raw[8:12] == b'WEBP' or
                 mime == 'image/bmp' and raw.startswith(b'BM'))
        if not valid:
            raise HTTPException(422, 'Image type does not match its bytes')
    return name, data, mime, len(raw), image
