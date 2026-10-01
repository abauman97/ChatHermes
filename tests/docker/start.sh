#!/bin/sh
set -eu
# The legacy image entrypoint re-execs itself after dropping privileges.
# Seed first as root; the original entrypoint assigns the volume to Hermes.
/opt/hermes/.venv/bin/python /test/init.py
exec /usr/local/bin/chathermes-entrypoint "$@"
