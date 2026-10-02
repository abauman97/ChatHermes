#!/bin/sh
set -eu
# Keep read-only bind mounts outside the writable Hermes home. Seed as root;
# the image's native bootstrap assigns volume ownership and starts supervision.
mkdir -p /opt/data/plugins
rm -rf /opt/data/plugins/chathermes
cp -r /opt/plugins-src/chathermes /opt/data/plugins/chathermes
/opt/hermes/.venv/bin/python /test/init.py
# Native bootstrap skips recursive chown when a reused volume already has the
# correct owner. Assign ownership to newly seeded root-owned files explicitly.
chown -R "${HERMES_UID:-1000}:${HERMES_GID:-1000}" /opt/data /tmp/chathermes-issue7-runtime
exec /opt/hermes/docker/entrypoint-dispatch.sh "$@"
