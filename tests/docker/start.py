"""Configure an isolated Hermes home without putting provider secrets in YAML."""
import os
from pathlib import Path
import secrets
import shutil
import shlex
import sys
from urllib.parse import urlsplit


def load_env(path=Path(".env")):
    """Load test-provider dotenv values as data; explicit exports take precedence."""
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        name, separator, value = line.strip().removeprefix("export ").partition("=")
        name = name.strip()
        if not separator or name not in (
            "TEST_LLM_API_BASE_URL", "TEST_LLM_API_KEY", "TEST_LLM_API_MODEL"
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
        raise ValueError("Use TEST_LLM_API_KEY for credentials; the base URL must have no credentials, query, or fragment")
    for name in ("HERMES_DASHBOARD_PORT", "API_SERVER_PORT"):
        value = os.environ[name]
        if not value.isascii() or not value.isdigit() or not 1 <= int(value) <= 65535:
            raise ValueError(name + " must be an integer from 1 to 65535")
    if int(os.environ["HERMES_DASHBOARD_PORT"]) == int(os.environ["API_SERVER_PORT"]):
        raise ValueError("Dashboard and API server ports must differ")

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
    env_file = home / ".env"
    if not env_file.exists():
        env_file.touch(mode=0o600)
        env_file.write_text("API_SERVER_KEY=" + secrets.token_hex(32) + "\n")
    env_file.chmod(0o600)
    config_file = home / "config.yaml"
    config_file.touch(mode=0o600)
    config_file.write_text(yaml.safe_dump(config, sort_keys=False))
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
