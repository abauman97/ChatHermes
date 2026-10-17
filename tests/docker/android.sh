#!/bin/sh
# Ephemeral Android 14 device for the existing disposable Hermes dashboard.
set -eu
cd "$(dirname "$0")/../.."
mode="${1:-start}"
case "$mode" in
  start|stop) ;;
  *) echo 'Usage: sh tests/docker/android.sh [start|stop]' >&2; exit 2 ;;
esac
instance="${CHATHERMES_INSTANCE:-$(git rev-parse --short=8 HEAD 2>/dev/null || printf local)-test}"
case "$instance" in
  ''|*[!a-zA-Z0-9_-]*) echo 'Invalid CHATHERMES_INSTANCE.' >&2; exit 2 ;;
esac
container="chathermes-$instance-android"
hermes="chathermes-$instance-hermes"
owned() {
  [ "$(docker inspect -f '{{index .Config.Labels "chathermes.android.instance"}}' "$container" 2>/dev/null || true)" = "$instance" ]
}
# Check daemon access separately so an unavailable daemon cannot look like success.
docker info >/dev/null
if docker container inspect "$container" >/dev/null 2>&1; then
  if ! owned; then
    echo 'Android container name belongs to another launcher; choose another instance.' >&2
    exit 1
  fi
fi
if [ "$mode" = stop ]; then
  if owned; then docker rm -f -v "$container" >/dev/null; fi
  echo "Stopped disposable Android container: $container"
  exit 0
fi
vnc="${CHATHERMES_ANDROID_VNC_PORT:-6080}"
cdp="${CHATHERMES_ANDROID_CDP_PORT:-9223}"
for port in "$vnc" "$cdp"; do
  case "$port" in
    ''|*[!0-9]*) echo 'Android ports must be 1 to 65535.' >&2; exit 2 ;;
  esac
  if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
    echo 'Android ports must be 1 to 65535.' >&2; exit 2
  fi
done
if [ "$vnc" -eq "$cdp" ]; then echo 'Android VNC and CDP ports must differ.' >&2; exit 2; fi
if [ "$(docker inspect -f '{{index .Config.Labels "chathermes.live.instance"}}' "$hermes" 2>/dev/null || true)" != "$instance" ]; then
  echo 'Start this instance with npm run live first.' >&2; exit 1
fi
if [ "$(docker inspect -f '{{.State.Health.Status}}' "$hermes" 2>/dev/null || true)" != healthy ]; then
  echo 'Live Hermes container must be healthy before starting Android.' >&2; exit 1
fi
address="$(docker inspect -f '{{(index .NetworkSettings.Networks "bridge").IPAddress}}' "$hermes")"
if [ -z "$address" ]; then
  echo "Live Hermes container must use the launcher's default bridge network." >&2; exit 1
fi
if owned; then docker rm -f -v "$container" >/dev/null; fi
ready=0
launched_id=
cleanup() {
  # A concurrent restart can replace this name with another owned device.
  if [ "$ready" -ne 1 ] && [ -n "$launched_id" ] && owned &&
     [ "$(docker inspect -f '{{.Id}}' "$container" 2>/dev/null || true)" = "$launched_id" ]; then
    docker rm -f -v "$container" >/dev/null
  fi
}
trap cleanup EXIT
trap 'exit 1' HUP INT TERM
printf 'Starting Android image (the first pull can take several minutes)...\n'
if ! launched_id="$(docker run -d --rm --name "$container" \
  --label "chathermes.android.instance=$instance" \
  --device /dev/kvm --shm-size 2g --log-driver none \
  -p "127.0.0.1:$vnc:6080" -p "127.0.0.1:$cdp:9222" \
  -e 'EMULATOR_DEVICE=Samsung Galaxy S10' -e WEB_VNC=true \
  budtmo/docker-android:emulator_14.0)"; then
  # Docker can leave a created container behind even when run fails.
  launched_id="$(docker inspect -f '{{.Id}}' "$container" 2>/dev/null || true)"
  exit 1
fi
# Reject inherited image volumes as well as explicit mounts.
if [ "$(docker inspect -f '{{len .Mounts}}' "$container")" != 0 ]; then
  echo 'Android image created mounts; refusing a persistent emulator.' >&2; exit 1
fi
printf 'Waiting for Android boot (up to 6 minutes)...\n'
attempt=0
while [ "$(docker exec "$container" adb shell getprop sys.boot_completed 2>/dev/null || true)" != 1 ]; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 180 ] || [ "$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null || true)" != true ]; then
    echo 'Android did not boot; check daemon-side /dev/kvm and available memory.' >&2; exit 1
  fi
  sleep 2
done
# Python runs inside Android only. Full-duplex forwarding preserves HTTP/WebSockets.
proxy='import select, socket, socketserver, sys
class Proxy(socketserver.BaseRequestHandler):
    def handle(self):
        with socket.create_connection((sys.argv[2], int(sys.argv[3])), timeout=15) as upstream:
            upstream.settimeout(None)
            peers = [self.request, upstream]
            while True:
                readable, _, _ = select.select(peers, [], [], 60)
                for source in readable:
                    data = source.recv(65536)
                    if not data: return
                    peers[source is self.request].sendall(data)
class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True
Server(("0.0.0.0", int(sys.argv[1])), Proxy).serve_forever()
'
docker exec -d "$container" python3 -c "$proxy" 9119 "$address" 9119
docker exec "$container" adb reverse tcp:9119 tcp:9119
# CDP is published on loopback only; no ADB port is exposed.
docker exec "$container" adb forward tcp:19222 localabstract:chrome_devtools_remote
docker exec -d "$container" python3 -c "$proxy" 9222 127.0.0.1 19222
node tests/docker/android-install.mjs "$container" "$cdp"
ready=1
printf 'Android PWA ready: http://127.0.0.1:%s/?autoconnect=true&resize=scale\nContainer: %s\nRemove device and all its data: npm run live:android:stop\n' "$vnc" "$container"
