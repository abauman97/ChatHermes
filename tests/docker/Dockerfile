# Build the isolated live-test image; no Compose or host bind mounts are needed.
FROM nousresearch/hermes-agent@sha256:cdcda342ff2b3919eaa7b3dbd7c5178b7b7676db62ddac273af2b921e9be4aa3
USER root
RUN cp /opt/hermes/docker/entrypoint.sh /usr/local/bin/chathermes-entrypoint
ADD --checksum=sha256:d8ec25f838431dd1bbe6bd679be3c9023d3c3dc602146605b0b67c8887196ceb https://codeload.github.com/NousResearch/hermes-agent/tar.gz/ac28abc96ce83f22f6b831f80d9007e2aba81f21 /tmp/hermes.tar.gz
RUN tar -xzf /tmp/hermes.tar.gz --strip-components=1 -C /opt/hermes && rm /tmp/hermes.tar.gz
# The digest-pinned runtime predates native tool-search stemming. Match the
# upgraded source dependency without changing the runtime image or Hermes core.
RUN uv pip install --python /opt/hermes/.venv/bin/python snowballstemmer==3.1.1
ENV PYTHONPATH=/opt/hermes
COPY plugin/chathermes /opt/plugins-src/chathermes
# Exercise the distributed dependency declaration, not a test-only package list.
RUN uv pip install --python /opt/hermes/.venv/bin/python /opt/plugins-src/chathermes
COPY tests/docker/ /test/
COPY .hermes/config.yaml /test/config.yaml
ENTRYPOINT ["/bin/sh", "/test/start.sh"]
CMD ["gateway", "run"]
