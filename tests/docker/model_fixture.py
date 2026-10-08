"""Deterministic OpenAI-compatible fixture; actual Hermes still executes the turn/tools."""
import json
import os
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


LAST = {}
PROBES = []


class Model(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        if self.path == '/probe':
            self.wfile.write(json.dumps(PROBES).encode())
            return
        self.wfile.write(json.dumps({'data': [{'id': 'fixture-model', 'object': 'model'}, {'id': 'fixture-model-2', 'object': 'model'}]}).encode())

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
        messages = body.get('messages', [])
        user = next((item.get('content', '') for item in reversed(messages) if item.get('role') == 'user'), '')
        text = user if isinstance(user, str) else '\n'.join(part.get('text', '') for part in user if isinstance(part, dict))
        LAST.clear()
        LAST.update({'model': body.get('model'), 'messages': [
            {'role': item.get('role'), 'parts': [part.get('type') for part in item['content'] if isinstance(part, dict)] if isinstance(item.get('content'), list) else 'text'}
            for item in messages], 'stream': bool(body.get('stream'))})
        PROBES.append(dict(LAST))
        del PROBES[:-64]
        last_user = max((index for index, item in enumerate(messages) if item.get('role') == 'user'), default=-1)
        used_tool = any(item.get('role') == 'tool' for item in messages[last_user + 1:])
        tools = body.get('tools', [])
        tool_name = next((item['function']['name'] for item in tools if item.get('function', {}).get('name') == 'terminal'), None)
        project_context = any('CHATHERMES_NATIVE_CONTEXT' in str(item.get('content', '')) for item in messages if item.get('role') == 'system')
        clarify_name = next((item['function']['name'] for item in tools if item.get('function', {}).get('name') == 'clarify'), None)
        clarification = clarify_name and '[clarify]' in text and not used_tool
        call = (tool_name and ('[tool]' in text or '[approval]' in text or '[recovery-burst]' in text) or clarification) and not used_tool
        message = {'role': 'assistant', 'content': None if call else 'Isolated Hermes reply. ' + ('Tool completed successfully.' if used_tool else 'Your message was received.')}
        if project_context and '[workspace]' in text and not call:
            message['content'] += ' Project context discovered.'
        if '[model-probe]' in text and not call:
            message['content'] += ' Runtime model: ' + body.get('model', '')
        if '[image-probe]' in text and not call:
            has_image = isinstance(user, list) and any(part.get('type') == 'image_url' for part in user if isinstance(part, dict))
            message['content'] += ' Inline image received: ' + str(has_image)
        if '[long-run]' in text and not call:
            message['content'] += ' ' + 'Still working through the isolated request. ' * 12
        if call:
            message['tool_calls'] = [{'id': 'call_fixture_terminal', 'type': 'function', 'function': {'name': tool_name, 'arguments': json.dumps({'command': "pwd; printf 'hermes-isolated-tool-ok'" if '[workspace]' in text else "printf 'hermes-isolated-tool-ok'"})}}]
        if '[activity-hold]' in text and call:
            message['tool_calls'][0]['function']['arguments'] = json.dumps({'command': "sleep 2; printf 'hermes-isolated-tool-ok'"})
        if '[recovery-burst]' in text and call:
            message['tool_calls'][0]['function']['arguments'] = json.dumps({'command': "sleep 40; printf 'recovered-tool-ok'"})
        if clarification:
            message['tool_calls'] = [{'id': 'call_fixture_clarify', 'type': 'function', 'function': {'name': clarify_name,
                'arguments': json.dumps({'questions': [{'question': 'Choose a fixture colour', 'choices': ['Blue', 'Green']}, {'question': 'Name this fixture'}]})}}]
        if '[approval]' in text and call and not clarification:
            message['tool_calls'][0]['function']['arguments'] = json.dumps({'command': 'rm -rf /tmp/chathermes-native-approval-fixture'})
        # Deterministic in-flight recovery fixture, including the non-streaming
        # completion path used by the pinned Runs runtime. No real provider.
        if '[hold-run]' in text and not body.get('stream'):
            time.sleep(15)
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream' if body.get('stream') else 'application/json')
        self.end_headers()
        if not body.get('stream'):
            self.wfile.write(json.dumps({'id': 'fixture', 'object': 'chat.completion', 'model': body.get('model', 'fixture-model'), 'choices': [{'index': 0, 'message': message, 'finish_reason': 'tool_calls' if call else 'stop'}], 'usage': {'prompt_tokens': 10, 'completion_tokens': 12, 'total_tokens': 22}}).encode())
            return
        def chunk(delta, finish=None, delay=.15):
            payload = {'id': 'fixture', 'object': 'chat.completion.chunk', 'created': int(time.time()), 'model': body.get('model', 'fixture-model'), 'choices': [{'index': 0, 'delta': delta, 'finish_reason': finish}]}
            self.wfile.write(('data: ' + json.dumps(payload) + '\n\n').encode()); self.wfile.flush(); time.sleep(delay)
        try:
            chunk({'role': 'assistant'})
            chunk({'reasoning_content': 'Checking the isolated test request. '})
            chunk({'reasoning_content': 'Preparing the next step.'})
            if '[recovery-burst]' in text and call:
                for index in range(600):
                    chunk({'reasoning_content': f'checkpoint-{index:03d} '}, delay=.002)
            if '[hold-run]' in text:
                time.sleep(15)
            if call:
                tool = message['tool_calls'][0]
                chunk({'tool_calls': [{'index': 0, **tool}]})
            else:
                for word in message['content'].split(' '):
                    chunk({'content': word + ' '})
            chunk({}, 'tool_calls' if call else 'stop')
            self.wfile.write(b'data: [DONE]\n\n')
        except (BrokenPipeError, ConnectionResetError):
            pass


ThreadingHTTPServer(('0.0.0.0', 4000), Model).serve_forever()
