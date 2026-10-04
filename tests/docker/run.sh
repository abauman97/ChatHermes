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
image=chathermes-test:3632f917
default_instance="$(git rev-parse --short=8 HEAD 2>/dev/null || printf 'local')"
instance="${CHATHERMES_INSTANCE:-${default_instance}-test}"
case "$instance" in
  ''|*[!a-zA-Z0-9_-]*) echo 'CHATHERMES_INSTANCE must contain only letters, numbers, underscores, or hyphens.' >&2; exit 2 ;;
esac
gateway="chathermes-$instance-hermes"
model="chathermes-$instance-model"
volume="chathermes-$instance-hermes-data"
network="chathermes-$instance"
remove_container() {
  if docker container inspect "$1" >/dev/null 2>&1; then
    docker rm -f "$1" >/dev/null
  fi
}
if [ "$mode" = stop ]; then
  remove_container "$gateway"
  remove_container "$model"
  echo 'Stopped isolated services; named data volume preserved.'
  exit 0
fi
# Local defaults stay loopback-only. Remote daemons require an explicit,
# reachable interface on the daemon host, never an implicit wildcard bind.
bind="${CHATHERMES_BIND_ADDRESS:-127.0.0.1}"
port="${CHATHERMES_DASHBOARD_PORT:-9119}"
case "$port" in
  ''|*[!0-9]*) echo 'CHATHERMES_DASHBOARD_PORT must be an integer from 1 to 65535.' >&2; exit 2 ;;
esac
if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
  echo 'CHATHERMES_DASHBOARD_PORT must be an integer from 1 to 65535.' >&2; exit 2
fi
case "$bind" in
  ''|0.0.0.0|::|'[::]'|*[!0-9.]*)
    echo 'CHATHERMES_BIND_ADDRESS must be a specific IPv4 interface (default 127.0.0.1).' >&2; exit 2 ;;
esac
case "$bind" in
  *[!0-9.]*|.*|*..*|*.)
    echo 'CHATHERMES_BIND_ADDRESS must be a dotted-quad IPv4 address.' >&2; exit 2 ;;
esac
old_ifs=$IFS; IFS=.; set -- $bind; IFS=$old_ifs
if [ "$#" -ne 4 ]; then
  echo 'CHATHERMES_BIND_ADDRESS must be a dotted-quad IPv4 address.' >&2; exit 2
fi
for octet do
  case "$octet" in ''|*[!0-9]*) echo 'CHATHERMES_BIND_ADDRESS must be a dotted-quad IPv4 address.' >&2; exit 2 ;; esac
  if [ "$octet" -gt 255 ]; then
    echo 'CHATHERMES_BIND_ADDRESS must be a dotted-quad IPv4 address.' >&2; exit 2
  fi
done
url="http://$bind:$port"
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
# Bake the current checkout into both services; never reuse stale fixture code.
docker build -f tests/docker/Dockerfile -t "$image" .
if ! docker network inspect "$network" >/dev/null 2>&1; then
  docker network create "$network" >/dev/null
fi
docker volume create "$volume" >/dev/null
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
  config_file="$(pwd)/.hermes/config.yaml"
fi
remove_container "$gateway"
remove_container "$model"
if [ "$mode" = fixture ]; then
  docker run -d --name "$model" --network "$network" --network-alias model \
    --entrypoint /opt/hermes/.venv/bin/python "$image" /test/model_fixture.py >/dev/null
fi
# Only the dashboard is published; the gateway and fixture stay on the network.
docker run -d --init --name "$gateway" \
  --network "$network" -p "$bind:$port:9119" -v "$volume:/opt/data" \
  -e HERMES_UID=1000 -e HERMES_GID=1000 -e HERMES_DASHBOARD=1 \
  -e HERMES_DASHBOARD_TUI=0 -e API_SERVER_ENABLED=true \
  -e HERMES_DASHBOARD_BASIC_AUTH_USERNAME=tester \
  -e HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=chathermes-local-test \
  -e API_SERVER_KEY=chathermes-isolated-test-key-2026 \
  -e LLM_API_KEY -e LLM_API_BASE_URL -e LLM_API_MODEL -e CHATHERMES_TEST_REAL \
  -e CHATHERMES_TEST_CONFIG_B64="$(base64 < "$config_file" | tr -d '\n')" \
  "$image" >/dev/null
if [ "$mode" = real ]; then
  rm -f "$config_file"
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
