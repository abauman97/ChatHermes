"""Inbound-only TCP relay for Docker's internal-network port publishing limitation."""
import select
import socket
import socketserver
import threading


class Relay(socketserver.BaseRequestHandler):
    def handle(self):
        try:
            self.relay()
        except OSError:
            # Browsers routinely close streams during navigation/cancellation.
            pass

    def relay(self):
        with socket.create_connection(('hermes', self.server.server_address[1]), timeout=10) as upstream:
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


for port in (8642, 9119):
    server = Server(('0.0.0.0', port), Relay)
    threading.Thread(target=server.serve_forever, daemon=True).start()
threading.Event().wait()
