#!/bin/sh
# Remote-Docker equivalent of compose.yml, with no host bind mounts.
set -eu
export DOCKER_HOST="${DOCKER_HOST:-tcp://172.25.0.2:2375}"
network=chathermes-issue7-test
if ! docker network inspect "$network" >/dev/null 2>&1; then
  docker network create "$network" >/dev/null
fi
mode="${1:-fixture}"
case "$mode" in
  fixture) export LITELLM_API_KEY=chathermes-model-fixture
    export LITELLM_BASE_URL=http://chathermes-fixture:4000/v1
    export CHATHERMES_TEST_REAL=0 ;;
  real) : "${LITELLM_API_KEY:?Load the integration key into the environment first}"
    export LITELLM_BASE_URL=http://172.25.0.1:4000/v1
    export CHATHERMES_TEST_REAL=1 ;;
  *) echo 'Usage: sh tests/docker/run.sh fixture|real' >&2; exit 2 ;;
esac
if [ "$mode" = fixture ] && ! docker inspect chathermes-fixture >/dev/null 2>&1; then
  docker run -d --name chathermes-fixture --network "$network" -p 14000:4000 --entrypoint /bin/sh chathermes-test:3632f917 -c 'exec /opt/hermes/.venv/bin/python /test/model_fixture.py'
fi
if docker inspect chathermes-fixture >/dev/null 2>&1; then
  if [ "$(docker inspect chathermes-fixture --format '{{with index .NetworkSettings.Networks "chathermes-issue7-test"}}connected{{end}}')" != connected ]; then
    docker network connect "$network" chathermes-fixture
  fi
fi
# Only these dedicated test containers/volumes are touched. Preserve test data.
if docker inspect chathermes-gateway >/dev/null 2>&1; then
  docker rm -f chathermes-gateway >/dev/null
fi
docker run -d --init --name chathermes-gateway \
  --network "$network" \
  -p 9119:9119 -p 8642:8642 -v chathermes-issue7-test-data:/opt/data \
  -e HERMES_UID=1000 -e HERMES_GID=1000 -e HERMES_DASHBOARD=1 \
  -e HERMES_DASHBOARD_TUI=0 -e API_SERVER_ENABLED=true \
  -e HERMES_DASHBOARD_BASIC_AUTH_USERNAME=tester \
  -e HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=chathermes-local-test \
  -e API_SERVER_KEY=chathermes-isolated-test-key-2026 \
  -e LITELLM_API_KEY -e LITELLM_BASE_URL -e CHATHERMES_TEST_REAL \
  chathermes-test:3632f917
# A fresh native home takes a few seconds to initialize bundled state.
attempt=0
until curl -fsS "${CHATHERMES_TEST_URL:-http://172.25.0.2:9119}/api/auth/providers" >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 60 ]; then
    echo 'Dashboard did not become ready within 60 seconds' >&2
    exit 1
  fi
  sleep 1
done
