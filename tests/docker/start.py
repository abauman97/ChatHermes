"""Configure an isolated Hermes home without putting provider secrets in YAML."""

import copy
import json
import os
import re
import secrets
import shlex
import shutil
import sys
from pathlib import Path
from urllib.parse import urlsplit


def load_env(path=Path(".env")):
    """Load fixture dotenv values as data; explicit exports take precedence."""
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        name, separator, value = line.strip().removeprefix("export ").partition("=")
        name = name.strip()
        if not separator or name not in (
            "TEST_LLM_API_BASE_URL",
            "TEST_LLM_API_KEY",
            "TEST_LLM_API_MODEL",
            "HERMES_DASHBOARD_PUBLIC_URL",
        ):
            continue
        lexer = shlex.shlex(value.strip(), posix=True)
        lexer.whitespace = ""
        try:
            value = "".join(lexer).strip()
        except ValueError:
            raise ValueError("Invalid quoting for " + name + " in .env") from None
        os.environ.setdefault(name, value)


def configure(asset_root=Path("/opt/chathermes")):
    import hermes_yaml as yaml

    required = ("TEST_LLM_API_BASE_URL", "TEST_LLM_API_KEY", "TEST_LLM_API_MODEL")
    missing = [name for name in required if not os.environ.get(name, "").strip()]
    if missing:
        raise ValueError("Set the required environment variables: " + ", ".join(missing))
    endpoint = urlsplit(os.environ["TEST_LLM_API_BASE_URL"])
    if endpoint.scheme not in ("http", "https") or not endpoint.hostname:
        raise ValueError("TEST_LLM_API_BASE_URL must be an HTTP(S) provider endpoint")
    if endpoint.username or endpoint.password or endpoint.query or endpoint.fragment:
        raise ValueError(
            "Use TEST_LLM_API_KEY for credentials; the base URL must have no credentials, query, or fragment"
        )
    for name in ("HERMES_DASHBOARD_PORT", "API_SERVER_PORT"):
        value = os.environ[name]
        if not value.isascii() or not value.isdigit() or not 1 <= int(value) <= 65535:
            raise ValueError(name + " must be an integer from 1 to 65535")
    if int(os.environ["HERMES_DASHBOARD_PORT"]) == int(os.environ["API_SERVER_PORT"]):
        raise ValueError("Dashboard and API server ports must differ")

    # The native loader overlays each profile's own dotenv when creating a
    # plugin host. Persist the explicit public URL in every seeded profile,
    # rather than relying on the launch process environment to survive routing.
    public_url = os.environ.get("HERMES_DASHBOARD_PUBLIC_URL", "").strip()
    if public_url:
        try:
            public = urlsplit(public_url)
            host = public.hostname or ""
            valid = (
                public.scheme == "https"
                and public.username is None
                and public.password is None
                and not public.query
                and not public.fragment
                and public.port is None
                and not public.netloc.endswith(":")
                and not any(c.isspace() or ord(c) < 32 for c in public_url)
                and "\\" not in public_url
                and re.fullmatch(r"[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+", host)
                and not host.lower().rstrip(".").endswith(".localhost")
            )
        except ValueError:
            valid = False
        if not valid:
            raise ValueError(
                "HERMES_DASHBOARD_PUBLIC_URL must be a valid HTTPS dashboard URL without credentials, query, fragment or port"
            )

    home = Path(os.environ.get("HERMES_HOME", "/opt/data"))
    home.mkdir(parents=True, exist_ok=True)
    plugin = home / "plugins" / "chathermes"
    if plugin.exists():
        shutil.rmtree(plugin)
    shutil.copytree(asset_root / "plugin", plugin)

    config = yaml.safe_load((asset_root / "config.yaml").read_text())
    model = os.environ["TEST_LLM_API_MODEL"]
    base_url = os.environ["TEST_LLM_API_BASE_URL"].rstrip("/")
    config["model"].update(default=model, base_url=base_url)
    config["providers"]["chathermes-test"].update(
        base_url=base_url, default_model=model, models={model: {}}
    )
    api = config["platforms"]["api_server"]
    api.update(host=os.environ["API_SERVER_HOST"], port=int(os.environ["API_SERVER_PORT"]))
    # Persist only the generated internal gateway credential so restart works.
    # Hermes loads this file server-side; it never enters plugin/browser assets.
    for name in ("default", "alpha", "beta"):
        profile_home = home if name == "default" else home / "profiles" / name
        profile_home.mkdir(parents=True, exist_ok=True)
        profile_config = copy.deepcopy(config)
        # Exercise Hermes's legacy custom:<name> identity in real contracts;
        # the default/beta profiles retain the modern keyed provider setup.
        if name == "alpha":
            legacy = profile_config["providers"].pop("chathermes-test")
            profile_config["custom_providers"] = [dict(legacy, name="workflow-legacy")]
            profile_config["model"]["provider"] = "custom:workflow-legacy"
        # Named profiles share the listener, but authenticate with their own key.
        if name != "default":
            profile_config.pop("gateway", None)
        env_file = profile_home / ".env"
        if not env_file.exists():
            env_file.touch(mode=0o600)
            env_file.write_text("API_SERVER_KEY=" + secrets.token_hex(32) + "\n")
        env_file.chmod(0o600)
        # Named native runtimes intentionally do not inherit the launch home's
        # provider secrets. Seed their own private credential, never YAML/image.
        lines = [
            line
            for line in env_file.read_text().splitlines()
            if not line.startswith("TEST_LLM_API_KEY=")
            and not (public_url and line.startswith("HERMES_DASHBOARD_PUBLIC_URL="))
        ]
        lines.append("TEST_LLM_API_KEY=" + json.dumps(os.environ["TEST_LLM_API_KEY"]))
        if public_url:
            lines.append("HERMES_DASHBOARD_PUBLIC_URL=" + json.dumps(public_url))
        env_file.write_text("\n".join(lines) + "\n")
        config_file = profile_home / "config.yaml"
        config_file.touch(mode=0o600)
        config_file.write_text(yaml.safe_dump(profile_config, sort_keys=False))
        config_file.chmod(0o600)


if __name__ == "__main__":
    try:
        load_env()
        if sys.argv[1:2] == ["--launch"]:
            os.environ["CHATHERMES_ENV_LOADED"] = "1"
            os.execvp("sh", ["sh", "tests/docker/run.sh", *sys.argv[2:]])
        configure()
    except ValueError as error:
        print("ChatHermes: " + str(error), file=sys.stderr)
        sys.exit(2)
    upstream = "/opt/hermes/docker/entrypoint-dispatch.sh"
    os.execv(upstream, [upstream, *sys.argv[1:]])
