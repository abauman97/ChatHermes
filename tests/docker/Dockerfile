# The published image predates the session API. Keep its runtime and dashboard
# assets, then overlay a fixed compatible Hermes source revision.
FROM nousresearch/hermes-agent@sha256:cdcda342ff2b3919eaa7b3dbd7c5178b7b7676db62ddac273af2b921e9be4aa3
USER root
RUN cp /opt/hermes/docker/entrypoint.sh /usr/local/bin/chathermes-entrypoint
ADD --checksum=sha256:e62be810520c1fe592b82661c0dfacfff29c52efae529840f78c78551c07b384 https://codeload.github.com/NousResearch/hermes-agent/tar.gz/3632f9173d218fd24f3fa595d7affa159b0774cd /tmp/hermes.tar.gz
RUN tar -xzf /tmp/hermes.tar.gz --strip-components=1 -C /opt/hermes && rm /tmp/hermes.tar.gz
ENV PYTHONPATH=/opt/hermes
COPY plugin/chathermes /opt/plugins-src/chathermes
COPY tests/docker/ /test/
COPY .hermes/config.yaml /test/config.yaml
ENTRYPOINT ["/bin/sh", "/test/start.sh"]
CMD ["gateway", "run"]
