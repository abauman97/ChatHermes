# Build from the repository root with --pull to refresh the latest Hermes release.
FROM nousresearch/hermes-agent:latest
USER root

COPY plugin/chathermes /opt/chathermes/plugin
# Install the plugin's declared dependencies into the dashboard interpreter.
RUN /opt/hermes/.venv/bin/python -c "import subprocess; from pm import uv_launcher; subprocess.run([str(uv_launcher('uv')), 'pip', 'install', '--python', '/opt/hermes/.venv/bin/python', '/opt/chathermes/plugin'], check=True)"
COPY tests/docker/config.yaml tests/docker/start.py tests/docker/healthcheck.py /opt/chathermes/

ENV HERMES_DASHBOARD=1 \
    HERMES_DASHBOARD_HOST=0.0.0.0 \
    HERMES_DASHBOARD_PORT=9119 \
    HERMES_DASHBOARD_TUI=0 \
    HERMES_DASHBOARD_BASIC_AUTH_USERNAME=tester \
    HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=chathermes-local-test \
    API_SERVER_ENABLED=true \
    API_SERVER_HOST=127.0.0.1 \
    API_SERVER_PORT=8642
EXPOSE 9119
HEALTHCHECK --interval=5s --timeout=5s --start-period=120s --retries=12 \
    CMD ["/opt/hermes/.venv/bin/python", "/opt/chathermes/healthcheck.py"]
# Seed before upstream's privilege drop, then preserve its service supervision.
ENTRYPOINT ["/opt/hermes/.venv/bin/python", "/opt/chathermes/start.py"]
CMD ["gateway", "run"]
