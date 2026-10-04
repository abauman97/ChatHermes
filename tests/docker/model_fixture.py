"""Deterministic OpenAI-compatible fixture; actual Hermes still executes the turn/tools."""
import json
import os
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class Model(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'data': [{'id': 'fixture-model', 'object': 'model'}]}).encode())

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
        messages = body.get('messages', [])
        user = next((item.get('content', '') for item in reversed(messages) if item.get('role') == 'user'), '')
        text = user if isinstance(user, str) else '\n'.join(part.get('text', '') for part in user if isinstance(part, dict))
        last_user = max((index for index, item in enumerate(messages) if item.get('role') == 'user'), default=-1)
        used_tool = any(item.get('role') == 'tool' for item in messages[last_user + 1:])
        tools = body.get('tools', [])
        tool_name = next((item['function']['name'] for item in tools if item.get('function', {}).get('name') == 'terminal'), None)
        project_context = any('CHATHERMES_NATIVE_CONTEXT' in str(item.get('content', '')) for item in messages if item.get('role') == 'system')
        call = tool_name and '[tool]' in text and not used_tool
        message = {'role': 'assistant', 'content': None if call else 'Isolated Hermes reply. ' + ('Tool completed successfully.' if used_tool else 'Your message was received.')}
        if project_context and '[workspace]' in text and not call:
            message['content'] += ' Project context discovered.'
        if '[long-run]' in text and not call:
            message['content'] += ' ' + 'Still working through the isolated request. ' * 12
        if call:
            message['tool_calls'] = [{'id': 'call_fixture_terminal', 'type': 'function', 'function': {'name': tool_name, 'arguments': json.dumps({'command': "pwd; printf 'hermes-isolated-tool-ok'" if '[workspace]' in text else "printf 'hermes-isolated-tool-ok'"})}}]
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream' if body.get('stream') else 'application/json')
        self.end_headers()
        if not body.get('stream'):
            self.wfile.write(json.dumps({'id': 'fixture', 'object': 'chat.completion', 'model': body.get('model', 'fixture-model'), 'choices': [{'index': 0, 'message': message, 'finish_reason': 'tool_calls' if call else 'stop'}], 'usage': {'prompt_tokens': 10, 'completion_tokens': 12, 'total_tokens': 22}}).encode())
            return
        def chunk(delta, finish=None):
            payload = {'id': 'fixture', 'object': 'chat.completion.chunk', 'created': int(time.time()), 'model': body.get('model', 'fixture-model'), 'choices': [{'index': 0, 'delta': delta, 'finish_reason': finish}]}
            self.wfile.write(('data: ' + json.dumps(payload) + '\n\n').encode()); self.wfile.flush(); time.sleep(.15)
        try:
            chunk({'role': 'assistant'})
            chunk({'reasoning_content': 'Checking the isolated test request. '})
            chunk({'reasoning_content': 'Preparing the next step.'})
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
