"""Profile-local validation for native sessions, models and attachments."""

import re

from fastapi import HTTPException

# Hermes provider identities include legacy custom:<name> slugs. Keep this
# separate from profile names, and safe as one native /model flag argument.
_PROVIDER = re.compile(r"(?:custom:)?[A-Za-z0-9][A-Za-z0-9._-]{0,127}\Z")


def valid_provider(provider):
    return isinstance(provider, str) and _PROVIDER.fullmatch(provider) is not None


def model_selection(profile, model, provider, transport):
    """Resolve only gateway aliases equivalent to an existing native provider."""
    import re

    from agent.secret_scope import get_secret
    from hermes_cli.config import load_config
    from hermes_cli.web_server_profiles import _config_profile_scope

    with _config_profile_scope(profile):
        config = load_config() or {}
        providers = config.get("providers") or {}
        default = config.get("model") or {}
        if isinstance(default, str):
            default = {"default": default}
        routes = ((config.get("platforms") or {}).get("api_server") or {}).get("model_routes") or {}
        for entry in [default, *providers.values(), *routes.values()]:
            if isinstance(entry, dict):
                secret = entry.get("api_key") or (
                    get_secret(entry["key_env"], "") if entry.get("key_env") else ""
                )
                if secret:
                    transport.secrets.add(secret)
        route = routes.get(model)
        if isinstance(route, dict):
            provider = route.get("provider") or default.get("provider")
            native = providers.get(provider) or {}
            base = native.get("base_url") or default.get("base_url")
            key_env = native.get("key_env") or default.get("key_env")
            key = native.get("api_key") or (get_secret(key_env, "") if key_env else "")
            if (
                route.get("base_url")
                and route["base_url"] != base
                or route.get("api_key")
                and route["api_key"] != key
            ):
                raise HTTPException(
                    409, "This gateway model route has no equivalent native provider"
                )
            model = route.get("model")
        if not isinstance(model, str) or not re.fullmatch(
            r"[A-Za-z0-9][A-Za-z0-9._:/@+~-]{0,255}", model
        ):
            raise HTTPException(422, "Invalid native model")
        if provider and not valid_provider(provider):
            raise HTTPException(422, "Invalid native provider")
        return model, provider


def verify_image_refs(profile, text, images):
    """Every multipart image must match a durable upload in this exact profile."""
    import base64
    import re
    from pathlib import Path

    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_constants import get_hermes_home

    with _config_profile_scope(profile):
        root = Path(get_hermes_home()).resolve() / "uploads" / "chathermes"
        if root.resolve() != root:
            raise HTTPException(422, "Image upload directory unavailable")
        refs = re.findall(r"Attached image [^\n]+: ([^\n]+)", text)
        if len(refs) != len(images):
            raise HTTPException(
                422, "Native images require durable authenticated upload references"
            )
        for ref, encoded in zip(refs, images, strict=True):
            path = Path(ref)
            if (
                not re.fullmatch(r"[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)", path.name)
                or path.is_symlink()
                or path.resolve().parent != root.resolve()
                or not path.is_file()
            ):
                raise HTTPException(422, "Image reference unavailable in this profile")
            data = base64.b64decode(encoded, validate=True)
            if path.stat().st_size != len(data) or path.read_bytes() != data:
                raise HTTPException(422, "Image reference does not match uploaded content")


def verify_file_refs(profile, refs):
    import re
    from pathlib import Path

    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_constants import get_hermes_home

    if len(refs) > 5:
        raise HTTPException(422, "Attach up to five files per message")
    with _config_profile_scope(profile):
        root = Path(get_hermes_home()).resolve() / "uploads" / "chathermes"
        if root.is_symlink() or root.parent.is_symlink():
            raise HTTPException(422, "File upload directory unavailable")
        for ref in refs:
            path = Path(ref)
            if (
                not re.fullmatch(r"[a-f0-9]{32}(?:\.[a-z0-9]{1,12})?", path.name)
                or path.is_symlink()
                or path.resolve().parent != root.resolve()
                or not path.is_file()
            ):
                raise HTTPException(422, "File reference unavailable in this profile")


def check_profile_session(profile, stored):
    """Do not allow native cold-resume adoption to cross the plugin's profile boundary."""
    from pathlib import Path

    from hermes_cli.web_server_profiles import _config_profile_scope
    from hermes_constants import get_hermes_home, get_process_hermes_home
    from tui_gateway import server

    with _config_profile_scope(profile):
        home = Path(get_hermes_home()).resolve()
        with server._profile_db({"profile": profile}) as db:
            if db is not None and db.get_session(stored) is not None:
                return
        with server._sessions_lock:
            for record in server._sessions.values():
                owner = Path(record.get("profile_home") or get_process_hermes_home()).resolve()
                if record.get("session_key") == stored and owner == home:
                    return
    raise HTTPException(404, "Session unavailable in this profile")


def register_profile_secrets(profile, transport):
    """Redact provider credentials even when merely resuming an active turn."""
    from agent.secret_scope import get_secret
    from hermes_cli.config import load_config
    from hermes_cli.web_server_profiles import _config_profile_scope

    with _config_profile_scope(profile):
        config = load_config() or {}
        entries = [
            config.get("model"),
            *(config.get("providers") or {}).values(),
            *(
                ((config.get("platforms") or {}).get("api_server") or {}).get("model_routes") or {}
            ).values(),
        ]
        for entry in entries:
            if isinstance(entry, dict):
                secret = entry.get("api_key") or (
                    get_secret(entry["key_env"], "") if entry.get("key_env") else ""
                )
                if secret:
                    transport.secrets.add(secret)
