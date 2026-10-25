#!/bin/sh
# Compose owns lifecycle; failures deliberately retain the environment.
set -eu
cd "$(dirname "$0")/../.."
case "${1:-start}" in
  start)
    docker compose --project-directory . -f tests/docker/compose.yml up -d --wait --no-build --no-recreate
    node tests/docker/load-fixtures.mjs
    ;;
  real)
    docker compose --project-directory . -f tests/docker/compose.yml -f tests/docker/compose.real.yml up -d --wait --no-build --no-recreate
    ;;
  stop) docker compose --project-directory . -f tests/docker/compose.yml --profile android down -v ;;
  *) echo 'Usage: sh tests/docker/run.sh [start|real|stop]' >&2; exit 2 ;;
esac
