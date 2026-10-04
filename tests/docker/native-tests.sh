#!/bin/sh
# Only the dedicated, pinned fixture container is an eligible test target.
set -eu
cd "$(dirname "$0")/../.."
case "${DOCKER_HOST:-}" in
  tcp://docker:2375|'"tcp://docker:2375"') export DOCKER_HOST=tcp://172.25.0.2:2375 ;;
esac
default_instance="$(git rev-parse --short=8 HEAD 2>/dev/null || printf 'local')"
instance="${CHATHERMES_INSTANCE:-${default_instance}-test}"
case "$instance" in
  ''|*[!a-zA-Z0-9_-]*) echo 'Invalid CHATHERMES_INSTANCE.' >&2; exit 2 ;;
esac
container="chathermes-$instance-hermes"
if [ "$(docker inspect --format '{{.Config.Image}}' "$container")" != chathermes-test:3632f917 ]; then
  echo 'Start the pinned isolated fixture with npm run live first.' >&2
  exit 1
fi
if [ "$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/opt/data"}}{{.Type}}:{{.Name}}{{end}}{{end}}' "$container")" != "volume:chathermes-$instance-hermes-data" ]; then
  echo 'Native tests require the dedicated named test volume.' >&2
  exit 1
fi
if [ "$(docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$container" | rg '^CHATHERMES_TEST_REAL=')" != CHATHERMES_TEST_REAL=0 ]; then
  echo 'Native probes require fixture mode.' >&2
  exit 1
fi
docker cp tests/integration/native_contract.test.py "$container":/test/test_native_contract.py
docker exec -w /opt/hermes "$container" /opt/hermes/.venv/bin/python -m pytest -q \
  /test/test_native_contract.py \
  tests/tui_gateway/test_tui_gateway_event_replay.py \
  tests/tui_gateway/test_tui_gateway_ws.py \
  tests/tui_gateway/test_ws_orphan_races.py \
  tests/tui_gateway/test_auto_continue.py \
  tests/tui_gateway/test_resume_profile_scope.py \
  tests/tui_gateway/test_config_set_session_profile_scope.py

# Actual native provider/runtime probe, followed by authenticated HTTP/WS browser
# integration at both sizes. The launcher/network/volume guard above still applies.
docker cp tests/integration/native_runtime_probe.py "$container":/test/native_runtime_probe.py
docker exec -u hermes -e HERMES_HOME=/opt/data -w /opt/hermes "$container" /opt/hermes/.venv/bin/python /test/native_runtime_probe.py
npx playwright test native-chat.spec.ts native-gate.spec.ts
