"""Ephemeral HTTP/WebSocket forwarding inside the Android container."""
import select
import socket
import socketserver
import sys


class Proxy(socketserver.BaseRequestHandler):
    def handle(self):
        with socket.create_connection((sys.argv[2], int(sys.argv[3])), timeout=15) as upstream:
            upstream.settimeout(None)
            peers = [self.request, upstream]
            while True:
                readable, _, _ = select.select(peers, [], [], 60)
                for source in readable:
                    data = source.recv(65536)
                    if not data:
                        return
                    peers[source is self.request].sendall(data)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


Server(("0.0.0.0", int(sys.argv[1])), Proxy).serve_forever()
