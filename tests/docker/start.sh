#!/bin/sh
set -eu
# The legacy image entrypoint re-execs itself after dropping privileges.
# Install the baked plugin: remote Docker daemons cannot access host bind mounts.
mkdir -p /opt/data/plugins
rm -rf /opt/data/plugins/chathermes
cp -r /opt/plugins-src/chathermes /opt/data/plugins/chathermes
# Seed first as root; the original entrypoint assigns the volume to Hermes.
/opt/hermes/.venv/bin/python /test/init.py
# init.py consumes the inherited config before seeding profiles and auth.
# Do not copy the original config over its real-mode/profile adjustments.
chown hermes:hermes /opt/data/config.yaml
chmod 600 /opt/data/config.yaml
exec /usr/local/bin/chathermes-entrypoint "$@"
