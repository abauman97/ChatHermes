#!/bin/sh
# One disposable container; Docker's anonymous data volume is removed with it.
set -eu
cd "$(dirname "$0")/../.."
mode="${1:-real}"
case "$mode" in
  real|stop) ;;
  *) echo 'Usage: sh tests/docker/run.sh [real|stop]' >&2; exit 2 ;;
esac
# start.py loads the repository dotenv file before passing settings to Docker.
if [ "$mode" != stop ] && [ "${CHATHERMES_ENV_LOADED:-}" != 1 ]; then
  exec python3 tests/docker/start.py --launch "$@"
fi
instance="${CHATHERMES_INSTANCE:-$(git rev-parse --short=8 HEAD 2>/dev/null || printf local)-test}"
case "$instance" in
  ''|*[!a-zA-Z0-9_-]*) echo 'Invalid CHATHERMES_INSTANCE.' >&2; exit 2 ;;
esac
container="chathermes-$instance-hermes"
# Never remove a container that was not created by this launcher.
owned() {
  [ "$(docker inspect -f '{{index .Config.Labels "chathermes.live.instance"}}' "$container" 2>/dev/null || true)" = "$instance" ]
}
if [ "$mode" = stop ]; then
  if owned; then docker rm -f -v "$container" >/dev/null; fi
  echo "Stopped disposable container: $container"
  exit 0
fi
: "${TEST_LLM_API_BASE_URL:?Set TEST_LLM_API_BASE_URL reachable from inside Docker}"
: "${TEST_LLM_API_KEY:?Set TEST_LLM_API_KEY}"
: "${TEST_LLM_API_MODEL:?Set TEST_LLM_API_MODEL}"
export TEST_LLM_API_BASE_URL TEST_LLM_API_KEY TEST_LLM_API_MODEL
port="${CHATHERMES_DASHBOARD_PORT:-9119}"
case "$port" in
  ''|*[!0-9]*) echo 'CHATHERMES_DASHBOARD_PORT must be 1 to 65535.' >&2; exit 2 ;;
esac
if [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
  echo 'CHATHERMES_DASHBOARD_PORT must be 1 to 65535.' >&2; exit 2
fi
bind="${CHATHERMES_BIND_ADDRESS:-127.0.0.1}"
url_host="${CHATHERMES_DASHBOARD_URL_HOST:-$bind}"
if [ "$url_host" = 0.0.0.0 ]; then
  case "${DOCKER_HOST:-}" in
    tcp://*) url_host="${DOCKER_HOST#tcp://}"; url_host="${url_host%%:*}" ;;
    *) url_host=127.0.0.1 ;;
  esac
fi
if docker container inspect "$container" >/dev/null 2>&1; then
  if ! owned; then echo 'Container name is already in use; choose another CHATHERMES_INSTANCE.' >&2; exit 1; fi
  docker rm -f -v "$container" >/dev/null
fi
image="chathermes-test:$instance"
docker build --pull -f tests/docker/Dockerfile -t "$image" .
# Do not use --init: the upstream s6 supervisor must own PID 1.
docker run -d --rm --name "$container" \
  --label "chathermes.live.instance=$instance" \
  -p "$bind:$port:9119" \
  -e TEST_LLM_API_BASE_URL -e TEST_LLM_API_KEY -e TEST_LLM_API_MODEL \
  "$image" >/dev/null
ready=0
cleanup() {
  if [ "$ready" -ne 1 ] && owned; then docker rm -f -v "$container" >/dev/null; fi
}
trap cleanup EXIT
trap 'exit 1' HUP INT TERM
attempt=0
while [ "$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null || true)" != healthy ]; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 180 ] || [ "$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null || true)" != true ]; then
    echo 'Hermes did not become healthy. Check provider settings and Docker connectivity.' >&2
    exit 1
  fi
  sleep 2
done
ready=1
printf 'Dashboard ready: http://%s:%s/chathermes\nSign in: tester / chathermes-local-test (disposable test only)\nContainer: %s\n' "$url_host" "$port" "$container"
