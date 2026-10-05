#!/bin/sh
# Compose-equivalent launcher for daemons without Compose or host bind mounts.
set -eu
cd "$(dirname "$0")/../.."
mode="${1:-fixture}"
case "$mode" in
  fixture|real|stop) ;;
  *) echo 'Usage: sh tests/docker/run.sh [fixture|real|stop]' >&2; exit 2 ;;
esac
# This environment documents the numeric endpoint; its Docker CLI rejects the
# hostname endpoint (sometimes injected with literal surrounding quotes).
case "${DOCKER_HOST:-}" in
  tcp://docker:2375|'"tcp://docker:2375"')
    export DOCKER_HOST=tcp://172.25.0.2:2375
    echo 'Using documented Docker endpoint tcp://172.25.0.2:2375' >&2 ;;
esac
if ! docker info >/dev/null 2>&1; then
  echo 'Docker is unavailable. Check DOCKER_HOST; see tests/docker/README.md.' >&2
  exit 1
fi
image=chathermes-test:ac28abc9
default_instance="$(git rev-parse --short=8 HEAD 2>/dev/null || printf 'local')"
instance="${CHATHERMES_INSTANCE:-${default_instance}-test}"
case "$instance" in
  ''|*[!a-zA-Z0-9_-]*) echo 'CHATHERMES_INSTANCE must contain only letters, numbers, underscores, or hyphens.' >&2; exit 2 ;;
esac
gateway="chathermes-$instance-hermes"
model="chathermes-$instance-model"
volume="chathermes-$instance-hermes-data"
network="chathermes-$instance"
relay="chathermes-$instance-browser"
internal_network="chathermes-$instance-internal"
browser_network="chathermes-$instance-browser"
remove_container() {
  if docker container inspect "$1" >/dev/null 2>&1; then
    docker rm -f "$1" >/dev/null
  fi
}
if [ "$mode" = stop ]; then
  remove_container "$relay"
  remove_container "$gateway"
  remove_container "$model"
  echo 'Stopped isolated services; named data volume preserved.'
  exit 0
fi
# Bind on every interface of the Docker daemon host so remote Docker clients
# can reach the published dashboard. The synthetic credentials are test-only.
bind="${CHATHERMES_BIND_ADDRESS:-0.0.0.0}"
port="${CHATHERMES_DASHBOARD_PORT:-9119}"
case "$port" in
  ''|*[!0-9]*) echo 'CHATHERMES_DASHBOARD_PORT must be an integer from 1 to 65535.' >&2; exit 2 ;;
esac
if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
  echo 'CHATHERMES_DASHBOARD_PORT must be an integer from 1 to 65535.' >&2; exit 2
fi
valid_ipv4() {
  case "$1" in ''|*[!0-9.]*|.*|*..*|*.) return 1 ;; esac
  old_ifs=$IFS; IFS=.; set -- $1; IFS=$old_ifs
  [ "$#" -eq 4 ] || return 1
  for octet do
    case "$octet" in ''|*[!0-9]*) return 1 ;; esac
    [ "$octet" -le 255 ] || return 1
  done
}
if ! valid_ipv4 "$bind"; then
  echo 'CHATHERMES_BIND_ADDRESS must be an IPv4 address (default 0.0.0.0).' >&2; exit 2
fi
# The host-side publish address (0.0.0.0) is distinct from the daemon host's
# routable address used by the readiness probe and printed browser URL.
url_host="${CHATHERMES_DASHBOARD_URL_HOST:-$bind}"
if [ "$url_host" = 0.0.0.0 ]; then
  url_host="${CHATHERMES_DAEMON_ADDRESS:-}"
  if [ -z "$url_host" ]; then
    case "${DOCKER_HOST:-}" in
      tcp://*) url_host="${DOCKER_HOST#tcp://}" ;;
      *) url_host=127.0.0.1 ;;
    esac
  fi
fi
if ! valid_ipv4 "$url_host"; then
  echo 'Set CHATHERMES_DAEMON_ADDRESS to the Docker host IPv4 address (or CHATHERMES_DASHBOARD_URL_HOST).' >&2; exit 2
fi
url="http://$url_host:$port"
case "$mode" in
  fixture)
    export LLM_API_KEY=chathermes-model-fixture
    export LLM_API_BASE_URL=http://model:4000/v1
    export LLM_API_MODEL=fixture-model
    export CHATHERMES_TEST_REAL=0 ;;
  real)
    : "${LLM_API_KEY:?Set LLM_API_KEY in your environment}"
    : "${LLM_API_BASE_URL:?Set LLM_API_BASE_URL reachable from the container}"
    : "${LLM_API_MODEL:?Set LLM_API_MODEL in your environment}"
    export LLM_API_KEY LLM_API_BASE_URL LLM_API_MODEL
    export CHATHERMES_TEST_REAL=1 ;;
esac
# Resolve environment-controlled YAML scalars without modifying tracked files.
config_file="$(pwd)/.hermes/config.yaml"
if [ "$mode" = real ]; then
  config_file="${TMPDIR:-/tmp}/chathermes-$instance-config-$$.yaml"
  if ! LLM_API_MODEL="$LLM_API_MODEL" CONFIG_OUTPUT="$config_file" python3 - <<'PY'
import os
from pathlib import Path
import re
import json
source = Path('.hermes/config.yaml').read_text()
model = os.environ['LLM_API_MODEL']
if not re.fullmatch(r'[A-Za-z0-9._:/-]+', model):
    raise SystemExit('LLM_API_MODEL may contain only letters, digits, dot, underscore, colon, slash or hyphen.')
config = Path(os.environ['CONFIG_OUTPUT'])
config.parent.mkdir(parents=True, exist_ok=True)
config.write_text(source.replace('${LLM_API_MODEL:-fixture-model}', json.dumps(model)))
PY
  then
    exit 2
  fi
fi
if [ "$mode" = fixture ]; then
  config_file="${TMPDIR:-/tmp}/chathermes-$instance-config-$$.yaml"
  python3 - "$config_file" <<'PYCONFIG'
from pathlib import Path
import sys
source = Path('.hermes/config.yaml').read_text().replace('${LLM_API_MODEL:-fixture-model}', 'fixture-model')
source = source.replace('        context_length: 128000', '        context_length: 128000\n      fixture-model-2:\n        context_length: 128000')
Path(sys.argv[1]).write_text(source)
PYCONFIG
fi
startup_complete=0
cleanup() {
  rm -f "$config_file"
  if [ "$startup_complete" -ne 1 ]; then
    remove_container "$relay"
    remove_container "$gateway"
    remove_container "$model"
  fi
}
trap cleanup EXIT HUP INT TERM
# Bake the current checkout into both services; never reuse stale fixture code.
docker build -f tests/docker/Dockerfile -t "$image" .
if ! docker network inspect "$network" >/dev/null 2>&1; then
  docker network create "$network" >/dev/null
fi
if [ "$mode" = fixture ]; then
  if ! docker network inspect "$internal_network" >/dev/null 2>&1; then
    docker network create --internal "$internal_network" >/dev/null
  fi
  if [ "$(docker network inspect --format '{{.Internal}}' "$internal_network")" != true ]; then
    echo 'Fixture network must be internal; refusing a network with provider egress.' >&2
    exit 1
  fi
  if ! docker network inspect "$browser_network" >/dev/null 2>&1; then
    docker network create "$browser_network" >/dev/null
  fi
  network=$internal_network
fi
docker volume create "$volume" >/dev/null
remove_container "$relay"
remove_container "$gateway"
remove_container "$model"
if [ "$mode" = fixture ]; then
  docker run -d --name "$model" --network "$network" --network-alias model \
    --entrypoint /opt/hermes/.venv/bin/python "$image" /test/model_fixture.py >/dev/null
fi
# Only the dashboard is published; the gateway and fixture stay on the network.
set --
if [ "$mode" = real ]; then set -- -p "$bind:$port:9119"; fi
docker run -d --init --name "$gateway" \
  --network "$network" --network-alias hermes "$@" -v "$volume:/opt/data" \
  -e HERMES_UID=1000 -e HERMES_GID=1000 -e HERMES_DASHBOARD=1 \
  -e HERMES_DASHBOARD_TUI=0 -e API_SERVER_ENABLED=true \
  -e HERMES_DASHBOARD_BASIC_AUTH_USERNAME=tester \
  -e HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=chathermes-local-test \
  -e API_SERVER_KEY=chathermes-isolated-test-key-2026 \
  -e LLM_API_KEY -e LLM_API_BASE_URL -e LLM_API_MODEL -e CHATHERMES_TEST_REAL \
  -e CHATHERMES_TEST_CONFIG_B64="$(base64 < "$config_file" | tr -d '\n')" \
  "$image" >/dev/null
rm -f "$config_file"
if [ "$mode" = fixture ]; then
  docker run -d --name "$relay" --network "$browser_network" -p "$bind:$port:9119" \
    --entrypoint /opt/hermes/.venv/bin/python "$image" /test/browser_relay.py >/dev/null
  docker network connect "$internal_network" "$relay"
fi
attempt=0
until curl --noproxy '*' --connect-timeout 2 --max-time 5 -fsS "$url/api/auth/providers" >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 90 ]; then
    echo 'Dashboard did not become ready. Check the container and CHATHERMES_BIND_ADDRESS/CHATHERMES_DASHBOARD_PORT.' >&2
    exit 1
  fi
  sleep 1
done
printf 'Dashboard ready: %s/chathermes\nSign in: tester / chathermes-local-test (isolated test only)\n' "$url"
startup_complete=1
