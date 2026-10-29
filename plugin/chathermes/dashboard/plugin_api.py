"""Cookie-gated dashboard routes that proxy the Bearer-only Hermes gateway."""

import os
import re
import sys
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, Response, StreamingResponse

try:
    import httpx
except ImportError:  # The dashboard can still start and show an actionable error.
    httpx = None

router = APIRouter()
_PROFILE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
_AUTH_ERROR = "Hermes gateway authentication failed; check platforms.api_server.key"
_push_store_module = None
_push_sender_module = None


def _load_sibling(name):
    import importlib.util

    path = Path(__file__).with_name(name + ".py")
    spec = importlib.util.spec_from_file_location(
        "chathermes_" + name, path, submodule_search_locations=[str(path.parent)]
    )
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _push_store():
    if _push_store_module is None:
        raise HTTPException(503, "Push storage unavailable")
    return _push_store_module


@router.get("/push/config")
async def push_config():
    return _push_store().config()


@router.post("/push/test")
async def push_test(request: Request):
    """Inherits dashboard authentication, just like the subscription routes."""
    import secrets

    from starlette.concurrency import run_in_threadpool

    profile = _rpc_profile(request)
    try:
        if (
            not (await run_in_threadpool(_push_store().config)).get("available")
            or _push_sender_module is None
        ):
            raise HTTPException(503, "Push notifications are unavailable")
        if (
            _push_sender_module.notify(
                profile, "", "test", secrets.token_urlsafe(18), request=request
            )
            is not True
        ):
            raise HTTPException(503, "Could not schedule test notification")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(503, "Could not schedule test notification") from None
    return {"scheduled": True}


@router.get("/assets/dist/{file_path:path}")
async def pwa_asset(file_path: str, request: Request):
    """Serve only shipped PWA assets through the authenticated plugin API."""

    root = Path(__file__).resolve().parent / "dist"
    target = (root / file_path).resolve()
    if not target.is_relative_to(root) or not target.is_file():
        raise HTTPException(404, "Asset not found")

    media_types = {
        ".webmanifest": "application/manifest+json",
        ".png": "image/png",
    }
    media_type = media_types.get(target.suffix.lower())
    if media_type is None:
        raise HTTPException(404, "Asset not found")
    return FileResponse(
        target,
        media_type=media_type,
        headers={
            "Cache-Control": "private, max-age=3600",
            "X-Content-Type-Options": "nosniff",
        },
    )


@router.get("/push-service-worker.js")
async def push_service_worker():
    path = Path(__file__).with_name("dist") / "push-service-worker.js"
    return FileResponse(
        path,
        media_type="application/javascript",
        headers={
            "Service-Worker-Allowed": "/chathermes",
            "Cache-Control": "no-cache",
            "X-Content-Type-Options": "nosniff",
        },
    )


@router.post("/push/subscriptions")
async def push_subscribe(request: Request):
    from starlette.concurrency import run_in_threadpool

    body = bytearray()
    async for chunk in request.stream():
        body.extend(chunk)
        if len(body) > 8192:
            raise HTTPException(413, "Push subscription is too large")
    try:
        import json

        body = json.loads(body)
    except ValueError, UnicodeDecodeError:
        raise HTTPException(422, "Invalid push subscription") from None
    try:
        result = await run_in_threadpool(_push_store().upsert, _rpc_profile(request), body)
    except (ValueError, KeyError, TypeError) as error:
        raise HTTPException(422, str(error)) from None
    return result


@router.post("/push/status")
async def push_status(request: Request):
    from starlette.concurrency import run_in_threadpool

    profile = _rpc_profile(request)
    raw = bytearray()
    async for chunk in request.stream():
        raw.extend(chunk)
        if len(raw) > 8192:
            raise HTTPException(413, "Push status request is too large")
    try:
        import json

        body = json.loads(raw)
        endpoint = body["endpoint"]
        if set(body) != {"endpoint"} or not isinstance(endpoint, str) or len(endpoint) > 2048:
            raise ValueError()
    except ValueError, KeyError, TypeError, UnicodeDecodeError:
        raise HTTPException(422, "Invalid push status request") from None
    return await run_in_threadpool(_push_store().status, profile, endpoint)


@router.delete("/push/subscriptions/{identity}")
async def push_unsubscribe(request: Request, identity: str):
    from starlette.concurrency import run_in_threadpool

    if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", identity):
        raise HTTPException(422, "Invalid subscription identity")
    removed = await run_in_threadpool(_push_store().remove, _rpc_profile(request), identity)
    return {"removed": removed}


def _gateway_settings():
    from hermes_cli.config import load_config
    from hermes_cli.web_server_profiles import _config_profile_scope, _hermes_home_scope
    from hermes_constants import get_process_hermes_home

    # The gateway listener belongs to the dashboard host, even in a profile request.
    with _hermes_home_scope(get_process_hermes_home()), _config_profile_scope(None):
        config = load_config() or {}
    server = (config.get("platforms") or {}).get("api_server") or {}
    host = server.get("host") or os.environ.get("API_SERVER_HOST") or "127.0.0.1"
    port = server.get("port") or os.environ.get("API_SERVER_PORT") or "8642"
    key = server.get("key") or os.environ.get("API_SERVER_KEY")
    return f"http://{host}:{port}", key


def _request_profile(request):
    profile = request.query_params.get("profile", "")
    if profile and not _PROFILE.fullmatch(profile):
        raise HTTPException(422, "Invalid profile name")
    if os.environ.get("HERMES_PLUGIN_HOST_PROCESS") == "1":
        from hermes_cli.web_server_profiles import serving_profile_name

        # Hermes removes ?profile before IPC. The host belongs to exactly one
        # profile; recover its verified identity, never a client header/alias.
        hosted_profile = serving_profile_name()
        if not hosted_profile or not _PROFILE.fullmatch(hosted_profile):
            raise HTTPException(503, "Could not identify the Hermes plugin host profile")
        if profile and profile != hosted_profile:
            raise HTTPException(422, "Profile does not match the Hermes plugin host")
        return hosted_profile
    return profile


def _target(request: Request, route: str):
    profile = _request_profile(request)
    base, key = _gateway_settings()
    if profile and profile != "default":
        key = _profile_gateway_key(profile)
    if not key:
        raise HTTPException(503, _AUTH_ERROR)
    prefix = f"/p/{profile}" if profile else ""
    params = [
        (name, value) for name, value in request.query_params.multi_items() if name != "profile"
    ]
    return base.rstrip("/") + prefix + route, key, params


def _client():
    if httpx is None:
        raise HTTPException(
            503, "httpx is required for ChatHermes; install httpx in the dashboard environment"
        )
    return httpx.AsyncClient(timeout=httpx.Timeout(30.0, read=None))


def _safe_body(body: bytes, key: str) -> bytes:
    # A broken gateway must never reflect credentials to the browser.
    # Cron may have no gateway credential; replacing b'' corrupts every byte.
    return body.replace(key.encode(), b"[redacted]") if key else body


def _error_response(upstream, key: str):
    if upstream.status_code in (401, 403):
        raise HTTPException(503, _AUTH_ERROR)
    media_type = upstream.headers.get("content-type", "application/json")
    if key in media_type:
        media_type = "application/octet-stream"
    return Response(
        _safe_body(upstream.content, key), status_code=upstream.status_code, media_type=media_type
    )


async def _proxy(request: Request, route: str):
    url, key, params = _target(request, route)
    body = await request.body()
    if httpx is None:
        raise HTTPException(503, "Hermes gateway HTTP client unavailable")
    try:
        async with _client() as client:
            upstream = await client.request(
                request.method,
                url,
                params=params,
                content=body if body else None,
                headers={
                    "Authorization": f"Bearer {key}",
                    **(
                        {"Content-Type": request.headers["content-type"]}
                        if "content-type" in request.headers
                        else {}
                    ),
                },
            )
    except HTTPException:
        raise
    except httpx.RequestError:
        raise HTTPException(502, "Hermes gateway is unreachable") from None
    return _error_response(upstream, key)


@router.get("/capabilities")
@router.get("/v1/capabilities", include_in_schema=False)
async def capabilities(request: Request):
    result = await _proxy(request, "/v1/capabilities")
    if result.status_code == 200:
        import json

        body = json.loads(result.body)
        features = body.setdefault("features", {})
        for name in list(features):
            if (
                name == "runs"
                or name.startswith("run_")
                or name.startswith("session_chat")
                or name == "session_model_lock"
            ):
                features.pop(name)
        features["native_chat"] = True
        endpoints = body.setdefault("endpoints", {})
        for name, endpoint in list(endpoints.items()):
            path = endpoint.get("path", "") if isinstance(endpoint, dict) else ""
            # Filter upstream advertisements; these paths are not plugin routes.
            legacy_chat_path = re.fullmatch(
                r"/(?:v1/)?runs(?:/.*)?|/workspace/runs(?:/.*)?|/(?:api/|workspace/)?sessions/[^/]+/chat(?:/stream)?",
                path,
            )
            if (
                name == "runs"
                or name.startswith("run_")
                or name.startswith("session_chat")
                or legacy_chat_path
            ):
                endpoints.pop(name)
        return body
    return result


@router.get("/sessions")
@router.post("/sessions")
@router.get("/api/sessions", include_in_schema=False)
@router.post("/api/sessions", include_in_schema=False)
async def sessions(request: Request):
    if request.method == "POST":
        # REST creation ignores workspace fields on the pin. Use the RPC route.
        try:
            body = await request.json()
        except ValueError:
            raise HTTPException(422, "Invalid session request") from None
        if not isinstance(body, dict):
            raise HTTPException(422, "Invalid session request")
        if any(field in body for field in ("project_id", "project", "cwd")):
            raise HTTPException(422, "Use the Project session route for workspace chats")
    return await _created_session(request, await _proxy(request, "/api/sessions"))


@router.post("/chat/sessions")
async def native_session_create(request: Request):
    if request.query_params.get("prepare") == "1":
        return JSONResponse(
            {"native_create": {"source": "desktop"}}, headers={"Cache-Control": "no-store"}
        )
    # Persist an empty draft through the existing profile gateway. Runtime
    # creation belongs to the dashboard native gateway, including secondary hosts.
    return await _created_session(request, await _proxy(request, "/api/sessions"))


async def _created_session(request, response):
    # Only a confirmed creation through ChatHermes opens tracking. Reads,
    # duplicate-ID conflicts, messages and reconnects never change it.
    if request.method == "POST" and response.status_code == 201:
        import json

        from starlette.concurrency import run_in_threadpool

        body = json.loads(response.body)
        row = body.get("session", body)
        if isinstance(row, dict) and isinstance(row.get("id"), str):
            await run_in_threadpool(
                _session_tracking.mark,
                _push_store_module,
                _rpc_profile(request),
                row["id"],
                "open",
                new=True,
            )
    return response


@router.get("/session-tracking")
async def session_tracking_list(request: Request):
    from starlette.concurrency import run_in_threadpool

    try:
        result = await run_in_threadpool(
            _session_tracking.listing, _push_store_module, _rpc_profile(request)
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(503, "Session tracking unavailable") from None
    return JSONResponse(result, headers={"Cache-Control": "private, no-store"})


@router.put("/session-tracking/{session_id}")
async def session_tracking_mark(request: Request, session_id: str):
    from starlette.concurrency import run_in_threadpool

    profile = _rpc_profile(request)
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", session_id):
        raise HTTPException(422, "Invalid stored session")
    try:
        body = await request.json()
        if (
            not isinstance(body, dict)
            or set(body) != {"status"}
            or body["status"] not in ("open", "settled")
        ):
            raise ValueError()
    except ValueError, TypeError:
        raise HTTPException(422, "Invalid tracking status") from None
    await run_in_threadpool(_native_validation.check_profile_session, profile, session_id)
    try:
        result = await run_in_threadpool(
            _session_tracking.set_status, _push_store_module, profile, session_id, body["status"]
        )
    except Exception:
        raise HTTPException(503, "Could not update session tracking") from None
    return JSONResponse(result, headers={"Cache-Control": "private, no-store"})


@router.get("/sessions/{session_id}")
@router.patch("/sessions/{session_id}")
@router.delete("/sessions/{session_id}")
@router.get("/api/sessions/{session_id}", include_in_schema=False)
@router.patch("/api/sessions/{session_id}", include_in_schema=False)
@router.delete("/api/sessions/{session_id}", include_in_schema=False)
async def session(request: Request, session_id: str):
    import json

    from starlette.concurrency import run_in_threadpool

    targets = []
    if request.method == "DELETE":
        targets = await run_in_threadpool(
            _session_tracking.deletion_ids, _push_store_module, _rpc_profile(request), session_id
        )
    response = await _proxy(request, "/api/sessions/" + quote(session_id, safe=""))
    if (
        request.method == "DELETE"
        and response.status_code == 200
        and json.loads(response.body).get("deleted") is True
    ):
        await run_in_threadpool(
            _session_tracking.remove_deleted, _push_store_module, _rpc_profile(request), targets
        )
    return response


@router.get("/sessions/{session_id}/messages")
@router.get("/api/sessions/{session_id}/messages", include_in_schema=False)
async def messages(request: Request, session_id: str):
    if request.query_params.get("transcript") == "1":
        read_profile_page = _load_sibling("transcript").read_profile_page
        from starlette.concurrency import run_in_threadpool

        try:
            limit = int(request.query_params.get("limit", "120"))
            offset = int(request.query_params.get("offset", "0"))
            if not 1 <= limit <= 120 or offset < 0:
                raise ValueError()
        except ValueError:
            raise HTTPException(422, "Invalid transcript page") from None
        try:
            result = await run_in_threadpool(
                read_profile_page,
                _request_profile(request),
                session_id,
                limit,
                offset,
                request.query_params.get("revision"),
            )
            import json

            # Same credential reflection protection as the gateway proxy.
            _, key, _ = _target(request, "/api/sessions")
            return Response(
                _safe_body(json.dumps(result).encode(), key), media_type="application/json"
            )
        except ImportError, AttributeError, NotImplementedError:
            # Older Hermes stores retain the gateway's compatibility behavior.
            pass
    return await _proxy(request, "/api/sessions/" + quote(session_id, safe="") + "/messages")


@router.post("/api/sessions/{session_id}/project")
async def move_session_to_project(request: Request, session_id: str):
    _rpc_profile(request)
    try:
        body = await request.json()
    except ValueError:
        raise HTTPException(422, "Invalid project selection") from None
    if (
        not isinstance(body, dict)
        or set(body) != {"project_id"}
        or not isinstance(body["project_id"], str)
        or not body["project_id"].strip()
    ):
        raise HTTPException(422, "Invalid project selection")
    node = (await project(request, body["project_id"]))["project"]
    root = node.get("path") or next(
        (repo.get("path") for repo in node.get("repos", []) if repo.get("path")), None
    )
    if node.get("archived") or node.get("isNoProject") or not root:
        raise HTTPException(422, "Project has no active workspace")
    return await _rpc(request, "session.workspace.move", {"session_key": session_id, "cwd": root})


@router.get("/profiles")
async def profiles():
    from hermes_cli.profiles import list_profiles
    from starlette.concurrency import run_in_threadpool

    entries = await run_in_threadpool(list_profiles)
    return {"profiles": [{"name": entry.name} for entry in entries]}


@router.get("/v1/models")
async def models(request: Request):
    import json

    from fastapi.responses import JSONResponse

    response = await _proxy(request, "/v1/models")
    if response.status_code != 200:
        return response
    payload = json.loads(response.body)
    default = _configured_default_model(_request_profile(request))
    if default:
        payload["default_model"] = default
    return JSONResponse(payload)


@router.get("/api/model/options")
async def model_options(request: Request):
    """Expose only picker IDs and labels, never provider transport/auth metadata."""
    import json

    from fastapi.responses import JSONResponse

    response = await _proxy(request, "/api/model/options")
    if response.status_code != 200:
        raise HTTPException(response.status_code, "Could not load model options")
    try:
        payload = json.loads(response.body)
        providers = []
        for row in payload.get("providers", []):
            if not isinstance(row, dict) or not isinstance(row.get("slug"), str):
                continue
            if row.get("authenticated") is False and not row.get("is_current"):
                continue
            providers.append(
                {
                    "slug": row["slug"],
                    "name": row.get("name") if isinstance(row.get("name"), str) else row["slug"],
                    "is_current": row.get("is_current") is True,
                    "models": [mid for mid in row.get("models", []) if isinstance(mid, str)],
                }
            )
            capabilities = row.get("capabilities")
            if isinstance(capabilities, dict):
                safe_capabilities = {}
                for model_id, value in capabilities.items():
                    if (
                        isinstance(model_id, str)
                        and isinstance(value, dict)
                        and isinstance(value.get("reasoning"), bool)
                    ):
                        safe_capabilities[model_id] = {"reasoning": value["reasoning"]}
                if safe_capabilities:
                    providers[-1]["capabilities"] = safe_capabilities
        return JSONResponse(
            {
                "providers": providers,
                "provider": payload.get("provider")
                if isinstance(payload.get("provider"), str)
                else "",
                "model": payload.get("model") if isinstance(payload.get("model"), str) else "",
            }
        )
    except ValueError, TypeError, AttributeError:
        raise HTTPException(502, "Invalid Hermes model options") from None


def _profile_gateway_key(profile: str):
    if not profile or profile == "default":
        return _gateway_settings()[1] or ""
    from agent.secret_scope import get_secret
    from hermes_cli.web_server_profiles import _config_profile_scope

    with _config_profile_scope(profile):
        key = get_secret("API_SERVER_KEY", "")
    if key:
        return key
    # Hermes validates the selected profile's own API_SERVER_KEY, so the host
    # default can only work when profiles intentionally share that key.
    return _gateway_settings()[1] or ""


def _configured_default_model(profile: str):
    from hermes_cli.config import load_config
    from hermes_cli.web_server_profiles import _config_profile_scope

    with _config_profile_scope(profile or None):
        config = load_config() or {}
        model = config.get("model", {})
        value = model.get("default", "") if isinstance(model, dict) else model
        return value if isinstance(value, str) else ""


def _upload_home(request: Request):
    from pathlib import Path

    from hermes_cli.profiles import get_profile_dir
    from hermes_constants import get_hermes_home

    profile = _request_profile(request)
    home = Path(get_profile_dir(profile) if profile else get_hermes_home())
    if not home.is_dir():
        raise HTTPException(404, "Profile not found")
    return home


@router.post("/uploads", status_code=201)
async def upload(request: Request):
    """Store bounded file uploads in the agent's profile, without accepting client paths."""
    import base64
    import binascii
    import json
    import uuid

    from starlette.concurrency import run_in_threadpool

    home = _upload_home(request)
    limit = 20 * 1024 * 1024
    body = bytearray()
    async for chunk in request.stream():
        body.extend(chunk)
        if len(body) > (limit * 4 // 3) + 4096:
            raise HTTPException(413, "File must be 20 MB or smaller")
    try:
        payload = json.loads(body)
        name = payload["name"]
        encoded = payload["data"]
        if not isinstance(name, str) or len(name) > 255 or not isinstance(encoded, str):
            raise ValueError()
        header, separator, data = encoded.partition(",")
        if not separator or not header.startswith("data:") or not header.endswith(";base64"):
            raise ValueError()
        content = base64.b64decode(data, validate=True)
    except ValueError, KeyError, TypeError, binascii.Error:
        raise HTTPException(422, "Invalid file upload") from None
    if len(content) > limit:
        raise HTTPException(413, "File must be 20 MB or smaller")
    if not content:
        raise HTTPException(422, "File is empty")
    # Never use the supplied filename as a path; retain only a short safe extension.
    extension = name.rsplit(".", 1)[-1].lower() if "." in name else ""
    extension = "." + extension if re.fullmatch(r"[a-z0-9]{1,12}", extension) else ""
    path = home / "uploads" / "chathermes" / (uuid.uuid4().hex + extension)

    def store():
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("xb") as handle:
            handle.write(content)
        path.chmod(0o600)

    await run_in_threadpool(store)
    _index_artifacts(_rpc_profile(request))
    return {"path": str(path)}


@router.get("/images/{file_id}")
async def native_image(request: Request, file_id: str):
    # Authenticated profile file references only; no arbitrary paths or HTML.
    if not re.fullmatch(r"[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)", file_id):
        raise HTTPException(404, "Image unavailable")
    home = _upload_home(request).resolve()
    root = home / "uploads" / "chathermes"
    path = root / file_id
    if (
        root.resolve() != root
        or path.is_symlink()
        or not path.is_file()
        or path.resolve().parent != root
    ):
        raise HTTPException(404, "Image unavailable")
    with path.open("rb") as stream:
        head = stream.read(16)
    mime = (
        "image/png"
        if head.startswith(b"\x89PNG\r\n\x1a\n")
        else "image/jpeg"
        if head.startswith(b"\xff\xd8\xff")
        else "image/gif"
        if head.startswith((b"GIF87a", b"GIF89a"))
        else "image/webp"
        if head.startswith(b"RIFF") and head[8:12] == b"WEBP"
        else None
    )
    if mime is None:
        raise HTTPException(404, "Image unavailable")
    return FileResponse(
        path,
        media_type=mime,
        headers={"Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"},
    )


# Projects and workspace chats use the dashboard's own gateway dispatcher. This
# is the same RPC admission/profile/runtime path as /api/ws, without a browser
# connection, credentials, native database writes, or a second session store.
# Hermes imports this file by spec rather than as a package. Resolve siblings
# relative to this trusted plugin directory, never through sys.path/CWD.
_gateway_transport = _load_sibling("gateway_transport")
_RpcTransport = _gateway_transport._RpcTransport

_push_store_module = _load_sibling("push_store")
_push_sender_module = _load_sibling("push_sender")
# Spec-loaded siblings are not a package: the sender's fallback import creates
# another store/lock. Share the API store so delivery cleanup and subscription
# routes serialize read-modify-write operations on the same persisted state.
_push_sender_module.push_store = _push_store_module
_native_validation = _load_sibling("native_validation")

_execution_viewer = _load_sibling("execution_viewer")
_completion_outbox = _load_sibling("completion_outbox")
_artifact_store = _load_sibling("artifact_store")
_session_tracking = _load_sibling("session_tracking")
_artifact_indexer = _load_sibling("artifact_indexer")
_artifact_service = None
_execution_service = None


def _executions():
    global _execution_service
    if _execution_service is None:
        import sys

        _execution_service = _execution_viewer.Service(sys.modules[__name__], _completion_outbox)
    return _execution_service


async def _resume_push_delivery():
    import asyncio

    service = _executions()
    service.worker = asyncio.create_task(service.deliver())


async def _stop_execution_viewers():
    if _execution_service is not None:
        await _execution_service.close()


async def _start_artifact_indexing():
    global _artifact_service
    _artifact_service = _artifact_indexer.Service(
        _artifact_indexer.Source(sys.modules[__name__]), _push_store_module
    )
    _artifact_service.start()


async def _stop_artifact_indexing():
    global _artifact_service
    if _artifact_service is not None:
        await _artifact_service.close()
        _artifact_service = None


def _index_artifacts(profile, session=None):
    if _artifact_service is not None:
        _artifact_service.trigger(profile, session)


router.add_event_handler("startup", _start_artifact_indexing)
router.add_event_handler("shutdown", _stop_artifact_indexing)
router.add_event_handler("startup", _resume_push_delivery)
router.add_event_handler("shutdown", _stop_execution_viewers)


@router.post("/chat/retain")
async def retain_execution(request: Request):
    from starlette.concurrency import run_in_threadpool

    try:
        raw = await request.body()
        if len(raw) > 4096:
            raise ValueError()
        body = __import__("json").loads(raw)
        if not isinstance(body, dict) or set(body) != {"session_id", "ticket"}:
            raise ValueError()
        stored, ticket = body["session_id"], body["ticket"]
        if not isinstance(stored, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", stored):
            raise ValueError()
        if not isinstance(ticket, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,1024}", ticket):
            raise ValueError()
    except ValueError, TypeError, KeyError:
        raise HTTPException(422, "Invalid native retention request") from None
    profile = _rpc_profile(request)
    await run_in_threadpool(_native_validation.check_profile_session, profile, stored)
    try:
        runtime = await _executions().retain(profile, stored, ticket)
    except Exception:
        raise HTTPException(
            503, "Native execution retention unavailable; nothing submitted"
        ) from None
    return JSONResponse({"session_id": runtime}, headers={"Cache-Control": "no-store"})


@router.get("/chat/capabilities")
async def chat_capabilities():
    return JSONResponse(
        {
            "protocol": "hermes.native.bf0203a7",
            "mode": "native-gateway",
            "admission": True,
            "reviewed_source": "bf0203a794a07aac3ff764972ab9087baa4e4f4e",
            "operations": [
                "gateway.ping",
                "session.create",
                "session.resume",
                "session.activate",
                "prompt.submit",
                "session.interrupt",
                "session.steer",
                "file.attach",
                "config.set",
            ],
            "blockers": ["snapshot_replay_boundary"],
            "features": {"reconnect": "native-snapshot", "files": True},
            "guarantees": {
                "crash_safe_idempotency": False,
                "lossless_snapshot_replay": False,
                "offline_turn_lease": True,
            },
            "limits": {},
        },
        headers={"Cache-Control": "no-store"},
    )


@router.get("/chat/sessions/{session_id}/membership")
async def native_session_membership(request: Request, session_id: str):
    from starlette.concurrency import run_in_threadpool

    if not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", session_id):
        raise HTTPException(422, "Invalid stored session")
    # A native Project draft can be live before its first DB write. Check the
    # selected profile's durable store OR its verified live owner; never cold-
    # adopt an arbitrary ID just because native resume permits doing so.
    await run_in_threadpool(
        _native_validation.check_profile_session, _rpc_profile(request), session_id
    )
    return JSONResponse({"member": True}, headers={"Cache-Control": "no-store"})


def _branch_response_count(profile, stored, response_id):
    """Address native branch's prose ordinal using the durable display history.

    Read all rows, including hidden context: the gateway's branch source filters
    user/assistant text, rather than the UI's visible bubbles or tool blocks.
    """
    from hermes_cli.web_server_sessions import _open_session_db_for_profile
    from tui_gateway.session_history import _coerce_message_text

    db = _open_session_db_for_profile(profile, read_only=True)
    try:
        _, history = db.get_resume_conversations(stored)
        count = 0
        for row in history:
            text = _coerce_message_text(row.get("content"))
            if row.get("role") not in ("user", "assistant") or not text.strip():
                continue
            count += 1
            if str(row.get("_row_id")) == response_id and row.get("role") == "assistant":
                return count
        raise HTTPException(409, "Response is no longer available in saved history")
    finally:
        db.close()


@router.post("/api/sessions/{session_id}/branch", status_code=201)
async def branch_response(request: Request, session_id: str):
    from starlette.concurrency import run_in_threadpool

    profile = _rpc_profile(request)
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", session_id):
        raise HTTPException(422, "Invalid stored session")
    try:
        body = await request.json()
    except ValueError:
        raise HTTPException(422, "Invalid branch selection") from None
    if (
        not isinstance(body, dict)
        or set(body) != {"response_id"}
        or not isinstance(body["response_id"], str)
        or not re.fullmatch(r"[0-9]{1,20}", body["response_id"])
    ):
        raise HTTPException(422, "Invalid branch selection")
    # Resume must never adopt an ID belonging to another profile.
    await run_in_threadpool(_native_validation.check_profile_session, profile, session_id)
    transport = _new_rpc_transport(request)
    try:
        parent = await _workspace_resume(transport, profile, session_id)
        if parent.get("running") or parent.get("queued"):
            raise HTTPException(409, "Wait for the response to finish before branching")
        count = await run_in_threadpool(
            _branch_response_count, profile, session_id, body["response_id"]
        )
        # Hermes copies its own authoritative transcript and inherits the parent's
        # workspace, lineage and profile; no client transcript/cwd is accepted.
        made = await transport.call(
            "session.branch",
            {"profile": profile, "session_id": parent["session_id"], "count": count},
        )
        stored = made.get("stored_session_id")
        if not isinstance(stored, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", stored):
            raise HTTPException(502, "Invalid branch receipt")
        await run_in_threadpool(
            _session_tracking.mark, _push_store_module, profile, stored, "open", new=True
        )
        return {"id": stored}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(503, "Could not branch this response") from None
    finally:
        transport.close()


@router.post("/chat/prepare")
async def prepare_native_turn(request: Request):
    """Validate profile-local attachments/model aliases without admitting a turn.

    Buffered secondary plugin HTTP is sufficient here; execution and streaming
    belong to the authenticated dashboard native gateway, never this host.
    """
    import re

    from starlette.concurrency import run_in_threadpool

    try:
        params = await request.json()
    except ValueError, TypeError:
        raise HTTPException(422, "Invalid native preparation") from None
    if not isinstance(params, dict) or set(params) - {
        "input",
        "model",
        "provider",
        "admission_id",
        "reasoning_effort",
    }:
        raise HTTPException(422, "Invalid native preparation")
    effort = params.get("reasoning_effort")
    if "reasoning_effort" in params and (
        not isinstance(effort, str)
        or effort not in ("none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra")
    ):
        raise HTTPException(422, "Invalid reasoning effort")
    profile = _rpc_profile(request)
    text, images = _validated_workspace_turn(
        {k: v for k, v in params.items() if k not in ("admission_id", "reasoning_effort")}
    )
    if images:
        await run_in_threadpool(_native_validation.verify_image_refs, profile, text, images)
    files = [
        {"name": name, "path": path}
        for name, path in re.findall(r"Attached file ([^\n]+?): ([^\n]+)", text)
    ]
    if files:
        await run_in_threadpool(
            _native_validation.verify_file_refs, profile, [file["path"] for file in files]
        )
    # Preserve the pinned native prompt shape: multipart only for images;
    # text/file-only turns use the normalized string for @file expansion.
    result = {"input": params["input"] if images else text, "files": files}
    if effort is not None:
        result["reasoning_effort"] = effort
    if params.get("model"):
        # This collector is never connected to a dispatcher or returned.
        from types import SimpleNamespace

        model, provider = await run_in_threadpool(
            _native_validation.model_selection,
            profile,
            params["model"],
            params.get("provider"),
            SimpleNamespace(secrets=set()),
        )
        result.update(model=model, provider=provider)
    return JSONResponse(result, headers={"Cache-Control": "no-store"})


def _rpc_profile(request):
    return _request_profile(request) or "default"


def _new_rpc_transport(request):
    profile = _rpc_profile(request)
    transport = _RpcTransport()
    # Match the existing proxy's reflected-Bearer protection for RPC responses,
    # including asynchronous tool/model errors. Never expose raw RPC exceptions.
    try:
        transport.secret = (
            _gateway_settings()[1] if profile == "default" else _profile_gateway_key(profile)
        ) or ""
    except Exception:
        transport.close()
        raise HTTPException(503, "Could not access the Hermes profile") from None
    return transport


async def _rpc(request, method, params=None):
    transport = _new_rpc_transport(request)
    try:
        return await transport.call(method, {**(params or {}), "profile": _rpc_profile(request)})
    finally:
        transport.close()


def _project_node(stored, node=None):
    # Keep Hermes's session hierarchy; enrich it with the native management row.
    return {
        **(node or {"sessionCount": 0, "repos": []}),
        "id": stored["id"],
        "label": stored["name"],
        "path": stored.get("primary_path"),
        **{
            key: stored.get(key)
            for key in ("folders", "description", "icon", "color", "board_slug", "archived")
        },
    }


async def _native_file(request, operation, path, session_id=None, name=None):
    """Use Desktop's native file handlers, including remote workspace adapters.

    Host plugin authentication applies before these routes. Never reopen a
    gateway path with dashboard-local filesystem calls or reflect native errors.
    """
    profile = _rpc_profile(request)
    if not isinstance(path, str) or not path or len(path) > 4096 or "\x00" in path:
        raise HTTPException(422, "Invalid file reference")
    if session_id and not re.fullmatch(r"[A-Za-z0-9_-]+", session_id):
        raise HTTPException(422, "Invalid session reference")
    try:
        from hermes_cli.web_routers import files

        if operation == "preview":
            result = await files.fs_read_data_url(
                path, request=request, profile=profile, session_id=session_id
            )
            return Response(
                __import__("json").dumps(result),
                media_type="application/json",
                headers={"Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"},
            )
        if operation == "download":
            result = await files.fs_download(
                path, request=request, profile=profile, session_id=session_id
            )
            if name:
                safe_name = (
                    name.replace("\r", "")
                    .replace("\n", "")
                    .replace("\\", "/")
                    .rsplit("/", 1)[-1][:255]
                )
                result.headers["Content-Disposition"] = "attachment; filename*=UTF-8''" + quote(
                    safe_name, safe=""
                )
            result.headers["Cache-Control"] = "private, no-store"
            result.headers["X-Content-Type-Options"] = "nosniff"
            return result
        # Managed deletion is host-local; SSH reads must never turn into a
        # deletion of a same-named file on the dashboard machine.
        import asyncio

        if await asyncio.to_thread(files._fs_backend, profile) is not None:
            raise HTTPException(501, "Remote workspace deletion is unsupported")
        # Native managed deletion enforces the host's configured write policy.
        # Validate a regular readable file without the preview size cap.
        await files.fs_download(path, request=request, profile=profile, session_id=session_id)
        from hermes_cli.web_models import ManagedFileDelete

        await files.delete_managed_file(ManagedFileDelete(path=path, recursive=False), request)
        return {"ok": True}
    except HTTPException as exc:
        raise HTTPException(exc.status_code, "Hermes could not access this file") from None
    except ImportError, AttributeError:
        raise HTTPException(
            501, "This Hermes version does not support this file operation"
        ) from None
    except Exception:
        raise HTTPException(503, "Hermes file operation is unavailable") from None


@router.get("/files/preview")
async def artifact_preview(request: Request, path: str, session_id: str | None = None):
    return await _native_file(request, "preview", path, session_id)


@router.get("/files/download")
async def artifact_download(
    request: Request, path: str, session_id: str | None = None, name: str | None = None
):
    return await _native_file(request, "download", path, session_id, name)


@router.delete("/files")
async def artifact_delete(request: Request, path: str, session_id: str):
    original_path = path
    image = re.fullmatch(
        r"/api/plugins/chathermes/images/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))", path, re.I
    )
    if image:
        path = str(_upload_home(request) / "uploads" / "chathermes" / image[1])
    result = await _native_file(request, "delete", path, session_id)
    import asyncio

    await asyncio.to_thread(
        _artifact_store.remove_file, _push_store_module, _rpc_profile(request), session_id, path
    )
    if original_path != path:
        await asyncio.to_thread(
            _artifact_store.remove_file,
            _push_store_module,
            _rpc_profile(request),
            session_id,
            original_path,
        )
    _index_artifacts(_rpc_profile(request), session_id)
    return result


@router.get("/artifacts")
async def artifacts(
    request: Request, project_id: str | None = None, limit: int = 50, cursor: str | None = None
):
    import asyncio

    profile = _rpc_profile(request)
    try:
        result = await asyncio.to_thread(
            _artifact_store.page, _push_store_module, profile, project_id, limit, cursor
        )
    except ValueError:
        raise HTTPException(422, "Invalid artifact pagination") from None
    except Exception:
        raise HTTPException(503, "Artifact index unavailable") from None
    return JSONResponse(result, headers={"Cache-Control": "private, no-store"})


@router.get("/artifact-images/{session_id}/{message_id}/{part_index}")
async def artifact_image(
    request: Request, session_id: str, message_id: str, part_index: int, download: bool = False
):
    # Inline legacy images remain in Hermes history; SQLite stores their address.
    import base64

    profile = _rpc_profile(request)
    if not re.fullmatch(r"[A-Za-z0-9_-]+", session_id) or not 0 <= part_index <= 1000:
        raise HTTPException(422, "Invalid image reference")
    try:
        from starlette.concurrency import run_in_threadpool

        try:
            url = await run_in_threadpool(
                _load_sibling("transcript").read_inline_image,
                profile,
                session_id,
                message_id,
                part_index,
            )
        except ImportError, AttributeError:
            messages = await _artifact_indexer.Source(sys.modules[__name__]).messages(
                profile, session_id, inline=True
            )
            row = next(
                row
                for row in messages
                if str(row.get("id")) == message_id and row.get("role") in ("user", "assistant")
            )
            url = row["content"][part_index]["image_url"]["url"]
        if (
            not isinstance(url, str)
            or not re.match(r"^data:image/(?:png|jpeg|gif|webp);base64,", url)
            or len(url) > 28 * 1024 * 1024
        ):
            raise ValueError()
        content = base64.b64decode(url.split(",", 1)[1], validate=True)
    except Exception:
        raise HTTPException(404, "Image unavailable") from None
    headers = {"Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"}
    if download:
        headers["Content-Disposition"] = 'attachment; filename="image"'
    return Response(content, media_type=url[5 : url.index(";")], headers=headers)


@router.get("/projects")
async def projects(request: Request):
    tree = await _rpc(request, "projects.tree", {"preview_limit": 3})
    stored = (await _rpc(request, "projects.list"))["projects"]
    by_id = {node["id"]: node for node in tree["projects"]}
    ids = {row["id"] for row in stored}
    return {
        **tree,
        "projects": [_project_node(row, by_id.get(row["id"])) for row in stored]
        + [node for node in tree["projects"] if node["id"] not in ids],
    }


@router.get("/projects/{project_id}")
@router.get("/projects/detail")
async def project(request: Request, project_id: str):
    result = await _rpc(request, "projects.project_sessions", {"project_id": project_id})
    node = result.get("project")
    if node and (node.get("isAuto") or node.get("isNoProject")):
        return result
    # Archived projects are deliberately absent from the native active tree.
    stored = (await _rpc(request, "projects.list"))["projects"]
    row = next((row for row in stored if row["id"] == project_id), None)
    if row is None:
        raise HTTPException(404, "Project no longer exists")
    return {"project": _project_node(row, node)}


# Directory instruction precedence requested by the project editor. Only these
# fixed filenames in the authoritative workspace are accessible to the browser.
_INSTRUCTION_NAMES = (
    ".hermes.md",
    "HERMES.md",
    "AGENTS.override.md",
    "AGENTS.md",
    "CLAUDE.md",
    ".cursorrules",
)
_INSTRUCTION_LIMIT = 128 * 1024


def _project_instructions_sync(root, body=None):
    import fcntl
    import hashlib
    import stat

    try:
        directory = Path(root).expanduser().resolve(strict=True)
        if not directory.is_dir():
            raise HTTPException(409, "The Project workspace is unavailable")
        # Resolve filenames through an open directory, never a client path. Refuse
        # links (including dangling links), non-regular files, and oversized files.
    except OSError, ValueError:
        raise HTTPException(409, "The Project workspace is unavailable") from None
    try:
        directory_fd = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
    except OSError:
        raise HTTPException(409, "The Project workspace is unavailable") from None
    try:
        filename = next(
            (name for name in _INSTRUCTION_NAMES if os.path.lexists(directory / name)), ".hermes.md"
        )
        exists = os.path.lexists(directory / filename)
        if body is not None and (
            body["filename"] != filename or (body["revision"] is None) != (not exists)
        ):
            raise HTTPException(409, "Instructions changed. Reload before saving.")
        if not exists and body is None:
            return {"filename": filename, "content": "", "revision": None}
        flags = os.O_NOFOLLOW | os.O_NONBLOCK | (os.O_RDONLY if body is None else os.O_RDWR)
        if not exists:
            flags |= os.O_CREAT | os.O_EXCL
        fd = os.open(filename, flags, 0o644, dir_fd=directory_fd)
        with os.fdopen(fd, "rb" if body is None else "r+b") as handle:
            fcntl.flock(handle, fcntl.LOCK_SH if body is None else fcntl.LOCK_EX)
            info = os.fstat(handle.fileno())
            if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1:
                raise HTTPException(409, "Instructions must be a regular workspace file")
            raw = handle.read(_INSTRUCTION_LIMIT + 1)
            if len(raw) > _INSTRUCTION_LIMIT:
                raise HTTPException(413, "Instructions are too large to edit")
            revision = hashlib.sha256(raw).hexdigest() if exists else None
            if body is not None:
                if body["revision"] != revision:
                    raise HTTPException(409, "Instructions changed. Reload before saving.")
                raw = body["content"].encode("utf-8")
                handle.seek(0)
                handle.write(raw)
                handle.truncate()
                handle.flush()
                os.fsync(handle.fileno())
                revision = hashlib.sha256(raw).hexdigest()
            return {"filename": filename, "content": raw.decode("utf-8"), "revision": revision}
    except HTTPException:
        raise
    except OSError, ValueError, UnicodeError:
        # Do not return filesystem paths, file contents, or raw OS diagnostics.
        raise HTTPException(409, "Could not access the workspace instructions") from None
    finally:
        os.close(directory_fd)


async def _project_instructions(request, project_id, body=None):
    from starlette.concurrency import run_in_threadpool

    result = await project(request, project_id)
    node = result["project"]
    root = node.get("path") or next(
        (repo["path"] for repo in node.get("repos", []) if repo.get("path")), None
    )
    if not root or node.get("isNoProject"):
        raise HTTPException(409, "This Project has no workspace")
    return await run_in_threadpool(_project_instructions_sync, root, body)


@router.get("/project-instructions")
async def project_instructions(request: Request, project_id: str):
    return await _project_instructions(request, project_id)


@router.put("/project-instructions")
async def save_project_instructions(request: Request, project_id: str):
    _rpc_profile(request)
    raw = bytearray()
    async for chunk in request.stream():
        raw.extend(chunk)
        if len(raw) > _INSTRUCTION_LIMIT * 6 + 1024:
            raise HTTPException(413, "Instructions are too large to edit")
    try:
        import json

        body = json.loads(raw)
    except ValueError, UnicodeError:
        raise HTTPException(422, "Invalid instructions") from None
    if (
        not isinstance(body, dict)
        or set(body) != {"content", "filename", "revision"}
        or not isinstance(body["content"], str)
        or body["filename"] not in _INSTRUCTION_NAMES
        or (
            body["revision"] is not None
            and (
                not isinstance(body["revision"], str)
                or not re.fullmatch(r"[a-f0-9]{64}", body["revision"])
            )
        )
    ):
        raise HTTPException(422, "Invalid instructions")
    try:
        size = len(body["content"].encode("utf-8"))
    except UnicodeError:
        raise HTTPException(422, "Invalid instructions") from None
    if size > _INSTRUCTION_LIMIT:
        raise HTTPException(413, "Instructions are too large to edit")
    return await _project_instructions(request, project_id, body)


@router.post("/projects/manage")
async def manage_project(request: Request):
    # Fixed native operations and schemas: never dispatch browser-supplied RPC names.
    schemas = {
        "create": {"name": str, "primary_path": str},
        "update": {
            "id": str,
            "name": str,
            "description": str,
            "icon": str,
            "color": str,
            "board_slug": str,
        },
        "add_folder": {"id": str, "path": str, "label": str, "is_primary": bool},
        "remove_folder": {"id": str, "path": str},
        "set_primary": {"id": str, "path": str},
        "archive": {"id": str, "restore": bool},
        "delete": {"id": str},
    }
    _rpc_profile(request)
    try:
        body = await request.json()
    except ValueError:
        raise HTTPException(422, "Invalid project operation") from None
    if (
        not isinstance(body, dict)
        or not isinstance(body.get("action"), str)
        or body.get("action") not in schemas
    ):
        raise HTTPException(422, "Invalid project operation")
    action = body["action"]
    schema = schemas[action]
    params = {key: value for key, value in body.items() if key != "action"}
    if any(key not in schema or type(value) is not schema[key] for key, value in params.items()):
        raise HTTPException(422, "Invalid project fields")
    required = ["name"] if action == "create" else ["id"]
    if action in ("add_folder", "remove_folder", "set_primary"):
        required.append("path")
    if any(not params.get(key, "").strip() for key in required):
        raise HTTPException(422, "Missing project fields")
    if "name" in params and (not params["name"].strip() or len(params["name"]) > 160):
        raise HTTPException(422, "Invalid project name")
    if any(
        isinstance(value, str) and ("\x00" in value or len(value) > 4096)
        for value in params.values()
    ):
        raise HTTPException(422, "Invalid project fields")
    return await _rpc(request, "projects." + action, params)


@router.post("/projects/{project_id}/sessions", status_code=201)
@router.post("/projects/session", status_code=201)
async def project_session(request: Request, project_id: str):
    from starlette.concurrency import run_in_threadpool

    # Read the authoritative node again; no client supplied cwd or membership.
    profile = _rpc_profile(request)
    transport = _new_rpc_transport(request)
    try:
        node = (
            await transport.call(
                "projects.project_sessions", {"profile": profile, "project_id": project_id}
            )
        ).get("project")
        if node is None:
            raise HTTPException(404, "Project no longer exists")
        root = node.get("path") or next(
            (repo["path"] for repo in node.get("repos", []) if repo.get("path")), None
        )
        if not root and not node.get("isNoProject"):
            raise HTTPException(409, "This Project has no workspace")
        params = {"profile": profile, "source": "desktop"}
        if root:
            resolved = await transport.call(
                "config.get", {"key": "project", "cwd": root, "profile": profile}
            )
            cwd = resolved.get("cwd")
            if not isinstance(cwd, str) or not cwd:
                raise HTTPException(409, "Hermes could not resolve this workspace")
            # This pin silently falls back to its launch cwd for missing local
            # directories. Accept canonicalisation and remote paths, never that
            # unrelated fallback as a Project workspace.
            if cwd != root and os.path.normpath(cwd) != os.path.abspath(os.path.expanduser(root)):
                raise HTTPException(409, "The Project workspace is unavailable")
            params.update(cwd=cwd, cwd_explicit=True)
        if request.query_params.get("prepare") == "1":
            return JSONResponse(
                {
                    "native_create": {
                        key: value for key, value in params.items() if key != "profile"
                    }
                },
                headers={"Cache-Control": "no-store"},
            )
        made = await transport.call("session.create", params)
        await run_in_threadpool(
            _session_tracking.mark,
            _push_store_module,
            profile,
            made["stored_session_id"],
            "open",
            new=True,
        )
        return {
            "session": {
                "id": made["stored_session_id"],
                "source": "desktop",
                "cwd": made["info"].get("cwd"),
                "workspace_rpc": True,
            }
        }
    finally:
        transport.close()


@router.get("/project-events")
async def project_events(request: Request):
    import asyncio
    import json

    from tui_gateway import server

    profile = _rpc_profile(request)
    transport = _new_rpc_transport(request)
    server._ensure_skin_watcher()  # ty: ignore[unresolved-attribute]  # Hermes binds split modules dynamically.
    server.register_live_transport(transport)

    async def frames():
        try:
            yield "event: refresh\ndata: {}\n\n"
            while not transport.closed and not await request.is_disconnected():
                try:
                    frame = await asyncio.wait_for(transport.events.get(), 15)
                except TimeoutError:
                    yield ": keepalive\n\n"
                    continue
                event = frame.get("params") or {}
                payload = event.get("payload") or {}
                if event.get("type") in ("sessions.changed", "projects.changed") and payload.get(
                    "profile"
                ) in (None, profile):
                    yield "event: refresh\ndata: " + json.dumps({"type": event["type"]}) + "\n\n"
        finally:
            transport.close()

    return StreamingResponse(frames(), media_type="text/event-stream")


async def _workspace_resume(transport, profile, stored_id):
    # Crucially, no cwd here. Hermes restores the session's own workspace.
    params = {
        "profile": profile,
        "session_id": stored_id,
        "source": "desktop",
        "inline_images": False,
    }
    return await transport.call("session.resume", params)


def _workspace_message(row):
    import json

    role = row.get("role", "assistant")
    # Native tool rows use raw content; renderer prose rows use text. A null
    # text field must not discard tool output when completed history replaces live state.
    content = row.get("content") if role == "tool" else row.get("text") or row.get("content")
    if role == "tool" and content is not None and not isinstance(content, str):
        content = json.dumps(content)
    return {
        "role": role,
        "content": content or "",
        **({"id": str(row["row_id"])} if row.get("row_id") is not None else {}),
        **({"tool_name": row["name"]} if role == "tool" and row.get("name") else {}),
        **{
            key: row[key]
            for key in (
                "tool_call_id",
                "tool_calls",
                "reasoning",
                "reasoning_content",
                "display_kind",
                "display_metadata",
            )
            if row.get(key) is not None
        },
    }


@router.get("/workspace/sessions/{session_id}/messages")
async def workspace_messages(request: Request, session_id: str):
    transport = _new_rpc_transport(request)
    try:
        result = await _workspace_resume(transport, _rpc_profile(request), session_id)
        return {"messages": [_workspace_message(row) for row in result.get("messages", [])]}
    finally:
        transport.close()


def _validated_workspace_turn(body):
    """Validate the entire turn before config/image/submit native mutations."""
    import base64
    import binascii

    if not isinstance(body, dict) or set(body) - {"input", "model", "provider"}:
        raise HTTPException(422, "Invalid workspace turn")
    model, provider = body.get("model"), body.get("provider")
    if model is not None and (
        not isinstance(model, str)
        or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._:/@+~-]{0,255}", model)
    ):
        raise HTTPException(422, "Invalid workspace model")
    if provider is not None and (not model or not _native_validation.valid_provider(provider)):
        raise HTTPException(422, "Invalid workspace provider")
    parts = body.get("input")
    if isinstance(parts, str):
        parts = [{"type": "text", "text": parts}]
    if not isinstance(parts, list) or len(parts) > 32:
        raise HTTPException(422, "Invalid workspace content")
    texts, images, total = [], [], 0
    for part in parts:
        if not isinstance(part, dict):
            raise HTTPException(422, "Invalid workspace content")
        if part.get("type") == "text":
            text = part.get("text")
            if not isinstance(text, str) or len(text.encode("utf-8")) > 1024 * 1024:
                raise HTTPException(422, "Invalid workspace text")
            texts.append(text)
        elif part.get("type") == "image_url":
            image = part.get("image_url")
            data = image.get("url") if isinstance(image, dict) else None
            if not isinstance(data, str) or len(data) > 28 * 1024 * 1024:
                raise HTTPException(422, "Invalid workspace image")
            header, sep, encoded = data.partition(",")
            if not sep or header not in (
                "data:image/png;base64",
                "data:image/jpeg;base64",
                "data:image/gif;base64",
                "data:image/webp;base64",
            ):
                raise HTTPException(422, "Invalid workspace image")
            try:
                decoded = base64.b64decode(encoded, validate=True)
            except ValueError, binascii.Error:
                raise HTTPException(422, "Invalid workspace image") from None
            total += len(decoded)
            if not decoded or total > 20 * 1024 * 1024 or len(images) >= 8:
                raise HTTPException(413, "Workspace images exceed the attachment limit")
            # Native attach_bytes decodes bytes and determines their image type.
            # Reject a mismatched declaration before any queued-image mutation.
            mime = header[5:-7]
            valid = (
                mime == "image/png"
                and decoded.startswith(b"\x89PNG\r\n\x1a\n")
                or mime == "image/jpeg"
                and decoded.startswith(b"\xff\xd8\xff")
                or mime == "image/gif"
                and decoded.startswith((b"GIF87a", b"GIF89a"))
                or mime == "image/webp"
                and decoded.startswith(b"RIFF")
                and decoded[8:12] == b"WEBP"
            )
            if not valid:
                raise HTTPException(422, "Invalid workspace image")
            images.append(encoded)
        else:
            raise HTTPException(422, "Unsupported workspace content")
    text = "\n".join(texts)
    if len(text.encode("utf-8")) > 1024 * 1024 or not text.strip() and not images:
        raise HTTPException(422, "Invalid workspace text")
    return text, images


# Scheduled history uses the pinned dashboard's local cron/SessionDB contracts,
# not the gateway Runs buffer (which expires and is unrelated to cron history).
def _scheduled_context(request):
    from hermes_cli.web_server_cron import _cron_profile_home

    profile = _request_profile(request)
    return _cron_profile_home(profile or None)


def _scheduled_job(profile, job_id):
    from hermes_cli.web_server_cron import _call_cron_for_profile

    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]{0,159}", job_id):
        raise HTTPException(422, "Invalid scheduled job")
    # Exact ID lookup in one profile. Never use the native route's cross-profile
    # ownership fallback, or resolve a user-supplied name as a different job.
    jobs = _call_cron_for_profile(profile, "list_jobs", True)
    job = next((row for row in jobs if row.get("id") == job_id), None)
    if job is None:
        raise HTTPException(404, "Scheduled job not found")
    return job


def _scheduled_jobs_sync(profile, home):
    from hermes_cli.web_server_cron import _call_cron_for_profile

    jobs = _call_cron_for_profile(profile, "list_jobs", True)
    return {
        "jobs": [
            {
                key: row.get(key)
                for key in (
                    "id",
                    "name",
                    "prompt",
                    "schedule_display",
                    "state",
                    "enabled",
                    "last_run_at",
                    "next_run_at",
                )
            }
            for row in jobs
        ]
    }


def _scheduled_docs(home, job_id):
    from hermes_cli.web_routers.cron import _cron_output_run_timestamp

    root = home / "cron" / "output"
    directory = root / job_id
    # Do not read symlinked directories/files or return filesystem paths.
    if (home / "cron").is_symlink() or root.is_symlink() or directory.is_symlink():
        return []
    return [
        {
            "id": "output:" + path.stem,
            "started_at": _cron_output_run_timestamp(path),
            "title": "Saved output",
            "source": "cron_output",
        }
        for path in directory.glob("*.md")
        if not path.is_symlink()
        and path.is_file()
        and re.fullmatch(r"\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}", path.stem)
    ]


def _scheduled_attempts(home, job_id):
    # Native ledger also retains failed script fires that never wrote a document.
    from cron.executions import list_executions
    from hermes_cli.web_routers.cron import _iso_to_epoch
    from hermes_cli.web_server_cron import _cron_store_scope

    attempts = []
    cursor = None
    with _cron_store_scope(home):
        while True:
            page = list_executions(job_id=job_id, limit=500, before_claimed_at=cursor)
            attempts.extend(page)
            if len(page) < 500:
                break
            next_cursor = page[-1]["claimed_at"]
            if next_cursor == cursor:
                break
            cursor = next_cursor
    return [
        {
            "id": "execution:" + row["id"],
            "source": "cron_execution",
            "started_at": _iso_to_epoch(row.get("started_at") or row.get("claimed_at")) or 0,
            "ended_at": _iso_to_epoch(row.get("finished_at")),
            "_claimed_at": _iso_to_epoch(row.get("claimed_at")) or 0,
            "title": row["status"].capitalize(),
            "end_reason": row["status"],
        }
        for row in attempts
        if row["status"] in ("completed", "failed", "unknown")
    ]


def _scheduled_runs_sync(profile, home, job_id, offset, limit):
    from hermes_cli.web_routers.cron import _doc_matches_session, _execution_contains
    from hermes_cli.web_server_cron import _cron_store_scope
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    _scheduled_job(profile, job_id)
    db = _open_session_db_for_profile(profile, read_only=True)
    sessions = []
    try:
        # Native dashboard caps history at 100. Page the actual DB contract so
        # older retained runs remain reachable, including mixed agent/script jobs.
        while True:
            page = db.list_cron_job_runs(job_id, limit=500, offset=len(sessions))
            sessions.extend(page)
            if len(page) < 500:
                break
    finally:
        db.close()
    with _cron_store_scope(home):
        docs = _scheduled_docs(home, job_id)
    sessions = [
        row
        for row in sessions
        if re.fullmatch(r"cron_" + re.escape(job_id) + r"_\d{8}_\d{6}", row["id"])
    ]
    rows = sessions + [
        doc
        for doc in docs
        if doc["started_at"] is not None
        and not any(_doc_matches_session(doc["started_at"], session, 300) for session in sessions)
    ]
    attempts = _scheduled_attempts(home, job_id)
    representations = list(rows)
    for attempt in attempts:
        # Match persisted output against execution windows; never deduplicate
        # two independent ledger records based on nearby timestamps.
        window = {
            "claimed_at": attempt.get("_claimed_at", attempt["started_at"]),
            "finished_at": attempt.get("ended_at"),
        }
        matched = any(
            _execution_contains(window, float(row.get("started_at") or 0), 300)
            for row in representations
        )
        if not matched:
            rows.append(attempt)
    rows.sort(key=lambda row: (float(row.get("started_at") or 0), row["id"]), reverse=True)
    fields = ("id", "title", "started_at", "ended_at", "source", "preview", "end_reason")
    return {
        "runs": [{key: row.get(key) for key in fields} for row in rows[offset : offset + limit]],
        "offset": offset,
        "limit": limit,
        "has_more": offset + limit < len(rows),
    }


def _scheduled_output_sync(profile, home, job_id, run_id):
    from hermes_cli.web_server_sessions import _open_session_db_for_profile

    _scheduled_job(profile, job_id)
    if run_id.startswith("execution:"):
        from cron.executions import get_execution
        from hermes_cli.web_routers.cron import _iso_to_epoch
        from hermes_cli.web_server_cron import _cron_store_scope

        identifier = run_id.removeprefix("execution:")
        if not re.fullmatch(r"[a-f0-9]{32}", identifier):
            raise HTTPException(422, "Invalid scheduled run")
        with _cron_store_scope(home):
            attempt = get_execution(identifier)
        if not attempt or attempt.get("job_id") != job_id:
            raise HTTPException(404, "Scheduled run not found")
        return {
            "messages": [],
            "started_at": _iso_to_epoch(attempt.get("started_at") or attempt.get("claimed_at")),
        }
    if run_id.startswith("output:"):
        stamp = run_id.removeprefix("output:")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}", stamp):
            raise HTTPException(422, "Invalid scheduled run")
        root = home / "cron" / "output"
        directory = root / job_id
        path = directory / (stamp + ".md")
        if (
            (home / "cron").is_symlink()
            or root.is_symlink()
            or directory.is_symlink()
            or path.is_symlink()
            or not path.is_file()
        ):
            raise HTTPException(404, "Saved output is no longer available")
        from hermes_cli.web_routers.cron import _cron_output_run_timestamp
        from hermes_cli.web_server_cron import _cron_store_scope

        with _cron_store_scope(home):
            started_at = _cron_output_run_timestamp(path)
        return {
            "output": path.read_text(encoding="utf-8-sig", errors="replace"),
            "messages": [],
            "started_at": started_at,
        }
    if not re.fullmatch(r"cron_" + re.escape(job_id) + r"_\d{8}_\d{6}", run_id):
        raise HTTPException(404, "Scheduled run not found")
    db = _open_session_db_for_profile(profile, read_only=True)
    try:
        session = db.get_session(run_id)
        if not session or session.get("source") != "cron":
            raise HTTPException(404, "Scheduled run not found")
        # A compressed cron run may continue under a child session ID; resolve
        # the persisted continuation lineage instead of losing its final turns.
        resolve = getattr(db, "resolve_resume_session_id", None)
        transcript_id = resolve(run_id) if resolve else run_id
        transcript_session = db.get_session(transcript_id)
        if not transcript_session or transcript_session.get("source") != "cron":
            transcript_id = run_id
            transcript_session = session
        messages = db.get_messages_as_conversation(
            transcript_id, include_ancestors=True, include_compacted=True
        )
        return {
            "session_id": run_id,
            "started_at": session.get("started_at"),
            "messages": [
                {
                    key: row.get(key)
                    for key in (
                        "role",
                        "content",
                        "tool_name",
                        "tool_call_id",
                        "tool_calls",
                        "reasoning",
                        "reasoning_content",
                        "display_kind",
                        "display_metadata",
                    )
                }
                for row in messages
                if row.get("role") != "system"
            ],
        }
    finally:
        db.close()


async def _scheduled_read(request, worker, *args):
    import json

    from starlette.concurrency import run_in_threadpool

    try:
        profile, home = _scheduled_context(request)
        result = await run_in_threadpool(worker, profile, home, *args)
        key = (
            _gateway_settings()[1]
            if not profile or profile == "default"
            else _profile_gateway_key(profile)
        ) or ""
        return Response(
            _safe_body(json.dumps(result).encode(), key) if key else json.dumps(result).encode(),
            media_type="application/json",
        )
    except HTTPException as error:
        if error.status_code in (404, 422):
            raise HTTPException(
                error.status_code, "Scheduled history is unavailable for this selection"
            ) from None
        raise HTTPException(
            503, "Scheduled history is unavailable in this Hermes version"
        ) from None
    except ImportError, AttributeError:
        raise HTTPException(
            503, "Scheduled history is unavailable in this Hermes version"
        ) from None
    except Exception:
        raise HTTPException(502, "Could not read scheduled history") from None


@router.get("/scheduled")
async def scheduled_jobs(request: Request):
    return await _scheduled_read(request, _scheduled_jobs_sync)


@router.get("/scheduled/runs")
async def scheduled_runs(request: Request, job_id: str, offset: int = 0, limit: int = 30):
    if offset < 0 or not 1 <= limit <= 100:
        raise HTTPException(422, "Invalid history page")
    return await _scheduled_read(request, _scheduled_runs_sync, job_id, offset, limit)


@router.get("/scheduled/output")
async def scheduled_output(request: Request, job_id: str, run_id: str):
    return await _scheduled_read(request, _scheduled_output_sync, job_id, run_id)
