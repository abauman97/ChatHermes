"""Inbound-only TCP relay for Docker's internal-network port publishing limitation."""
import select
import socket
import socketserver
import threading
import os
from urllib.parse import urlsplit


class Relay(socketserver.BaseRequestHandler):
    def handle(self):
        try:
            self.relay()
        except OSError:
            # Browsers routinely close streams during navigation/cancellation.
            pass

    def relay(self):
        target = urlsplit(os.environ.get('CHATHERMES_RELAY_UPSTREAM', ''))
        host, port = (target.hostname, target.port) if target.hostname else ('hermes', self.server.server_address[1])
        with socket.create_connection((host, port), timeout=10) as upstream:
            upstream.settimeout(None)
            peers = {self.request: upstream, upstream: self.request}
            while peers:
                readable, _, _ = select.select(list(peers), [], [], 60)
                for source in readable:
                    data = source.recv(65536)
                    if not data:
                        peers[source].shutdown(socket.SHUT_WR)
                        del peers[source]
                    else:
                        peers[source].sendall(data)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


ports = (9119,) if os.environ.get('CHATHERMES_RELAY_UPSTREAM') else (8642, 9119)
for port in ports:
    server = Server(('0.0.0.0', port), Relay)
    threading.Thread(target=server.serve_forever, daemon=True).start()
threading.Event().wait()
