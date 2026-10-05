"""Actual pinned native runtime/provider probe in the dedicated fixture volume."""
import asyncio
import importlib.util
import json

async def main():
    spec = importlib.util.spec_from_file_location('probe_transport', '/opt/data/plugins/chathermes/dashboard/gateway_transport.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    transport = module._RpcTransport()
    try:
        made = await transport.call('session.create', {'profile': 'default', 'source': 'desktop'})
        sid = made['session_id']
        # Validated content parts travel as ONE prompt mutation; no image staging.
        import base64
        from pathlib import Path
        import uuid
        image_data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII='
        image_path = Path('/opt/data/uploads/chathermes') / (uuid.uuid4().hex + '.png')
        image_path.parent.mkdir(parents=True, exist_ok=True)
        image_path.write_bytes(base64.b64decode(image_data))
        parts = [
            {'type': 'text', 'text': '[image-probe] [model-probe] inline native probe\nAttached image probe.png: ' + str(image_path)},
            {'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII='}},
        ]
        await transport.call('approval.pending', {'profile': 'default', 'session_id': sid})
        switched = await transport.call('config.set', {'profile': 'default', 'session_id': sid,
            'key': 'model', 'value': 'fixture-model-2 --session --provider litellm', 'scope': 'session'})
        assert not any(switched.get(k) for k in ('warning', 'deferred', 'confirm_required')), str({k: v for k, v in switched.items() if k in ('warning', 'deferred', 'confirm_required', 'model')})
        result = await transport.call('prompt.submit', {'profile': 'default', 'session_id': sid, 'text': parts, 'queued': True})
        assert result['status'] == 'streaming'
        async with asyncio.timeout(60):
            while True:
                frame = await transport.events.get()
                event = frame.get('params') or {}
                if event.get('type') == 'message.complete':
                    payload = event['payload']
                    assert payload['status'] == 'complete', 'native turn failed'
                    import urllib.request
                    observations = json.loads(urllib.request.urlopen('http://model:4000/probe').read())
                    assert any('image_url' in message['parts'] for observed in observations
                               if observed['model'] == 'fixture-model-2' for message in observed['messages']
                               if isinstance(message['parts'], list)), 'native vision input not delivered'
                    assert 'Runtime model: fixture-model-2' in payload['text'], payload['text']
                    break
        resumed = await transport.call('session.resume', {'profile': 'default',
            'session_id': made['stored_session_id'], 'source': 'desktop', 'inline_images': False})
        # Resume's inline_images=false deliberately projects image refs as text;
        # native persistence must still contain the admitted multi-part content.
        from tui_gateway import server
        with server._profile_db({'profile': 'default'}) as db:
            rows = db.get_messages(made['stored_session_id'])
        user = next(row for row in rows if row['role'] == 'user')
        assert str(image_path) in user['content'], 'durable image reference missing'
        assert image_path.read_bytes() == base64.b64decode(image_data), 'original image bytes missing'
        assert any(str(image_path) in str(row) for row in resumed['messages']), 'resume lost image reference'
        print('PASS: one multipart native submit, actual selected runtime model, vision input delivery, durable image reference and original bytes')
    finally:
        transport.close()

asyncio.run(main())
