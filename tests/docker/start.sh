#!/bin/sh
set -eu
# The legacy image entrypoint re-execs itself after dropping privileges.
# Install the baked plugin: remote Docker daemons cannot access host bind mounts.
mkdir -p /opt/data/plugins
rm -rf /opt/data/plugins/chathermes
cp -r /opt/plugins-src/chathermes /opt/data/plugins/chathermes
# Seed first as root; the original entrypoint assigns the volume to Hermes.
/opt/hermes/.venv/bin/python /test/init.py
exec /usr/local/bin/chathermes-entrypoint "$@"
