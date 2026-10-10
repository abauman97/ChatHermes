"""Read real-test provider settings as data, without evaluating shell code."""
import os
from pathlib import Path
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


def launch():
    load_env()
    for suffix in ("BASE_URL", "KEY", "MODEL"):
        name = "TEST_LLM_API_" + suffix
        if os.environ.get(name):
            os.environ["LLM_API_" + suffix] = os.environ[name]
    endpoint = urlsplit(os.environ.get("LLM_API_BASE_URL", ""))
    if endpoint.scheme not in ("http", "https") or not endpoint.hostname:
        raise ValueError("Set TEST_LLM_API_BASE_URL to an HTTP(S) provider endpoint")
    if endpoint.username or endpoint.password or endpoint.query or endpoint.fragment:
        raise ValueError("Use TEST_LLM_API_KEY for credentials; the base URL must have no credentials, query, or fragment")
    os.environ["CHATHERMES_ENV_LOADED"] = "1"
    os.execvp("sh", ["sh", "tests/docker/run.sh", *sys.argv[1:]])


if __name__ == "__main__":
    try:
        launch()
    except ValueError as error:
        print("ChatHermes: " + str(error), file=sys.stderr)
        sys.exit(2)
