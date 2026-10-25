#!/bin/sh
# Boot, browser preparation, and installation are separate retryable stages.
set -eu
cd "$(dirname "$0")/../.."
case "${1:-start}" in
  start)
    docker compose --project-directory . -f tests/docker/compose.yml --profile android up -d --wait --no-build --no-recreate
    node tests/docker/load-fixtures.mjs
    node tests/docker/prepare-browser.mjs --android
    ;;
  install) node tests/docker/android-install.mjs ;;
  check) node tests/docker/android-check.mjs "${CHATHERMES_ANDROID_CDP_ENDPOINT:-http://127.0.0.1:${CHATHERMES_ANDROID_CDP_PORT:-9223}}" ;;
  stop) docker compose --project-directory . -f tests/docker/compose.yml --profile android rm -s -f -v android ;;
  *) echo 'Usage: sh tests/docker/android.sh [start|install|check|stop]' >&2; exit 2 ;;
esac
