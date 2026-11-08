"""Persistent, profile-scoped Web Push subscriptions and VAPID identity."""

import base64
import errno
import json
import logging
import os
import re
import secrets
import stat
import tempfile
import threading
import time
from contextlib import contextmanager
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

_LOCK = threading.RLock()
_LOG = logging.getLogger(__name__)
_PROFILE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]{0,63}\Z")


def _home():
    from hermes_constants import get_default_hermes_root, get_process_hermes_home

    return Path(get_default_hermes_root(home=get_process_hermes_home())).resolve()


def _path():
    return _home() / "state" / "chathermes-push.json"


def _open_lock(path):
    """Open a stable regular sidecar without following links on either OS."""
    if os.name == "nt":
        import ctypes
        import msvcrt
        from ctypes import wintypes

        kernel = ctypes.WinDLL("kernel32", use_last_error=True)
        create = kernel.CreateFileW
        create.argtypes = (
            wintypes.LPCWSTR,
            wintypes.DWORD,
            wintypes.DWORD,
            wintypes.LPVOID,
            wintypes.DWORD,
            wintypes.DWORD,
            wintypes.HANDLE,
        )
        create.restype = wintypes.HANDLE
        close = kernel.CloseHandle
        close.argtypes = (wintypes.HANDLE,)
        close.restype = wintypes.BOOL
        # OPEN_ALWAYS, OPEN_REPARSE_POINT. Share reads/writes, but disallow
        # deletion/replacement while any host holds the stable lock handle.
        handle = create(str(path), 0xC0000000, 3, None, 4, 0x00200000, None)
        if handle == wintypes.HANDLE(-1).value:
            raise ctypes.WinError(ctypes.get_last_error())
        try:
            descriptor = msvcrt.open_osfhandle(handle, os.O_RDWR | os.O_BINARY)
        except BaseException:
            close(handle)
            raise
    else:
        descriptor = os.open(path, os.O_CREAT | os.O_RDWR | os.O_CLOEXEC | os.O_NOFOLLOW, 0o600)
    try:
        info = os.fstat(descriptor)
        if (
            not stat.S_ISREG(info.st_mode)
            or info.st_nlink != 1
            or getattr(info, "st_file_attributes", 0) & 0x400  # Windows reparse point
        ):
            raise OSError("Push lock must be a regular file with one link")
        return descriptor
    except BaseException:
        os.close(descriptor)
        raise


@contextmanager
def _file_lock(descriptor):
    if os.name == "nt":
        import msvcrt

        # Lock byte zero even in an empty file. LK_LOCK gives up after ten
        # retries; explicitly retry contention so slow transactions remain safe.
        while True:
            os.lseek(descriptor, 0, os.SEEK_SET)
            try:
                msvcrt.locking(descriptor, msvcrt.LK_NBLCK, 1)
                break
            except OSError as error:
                if error.errno not in (errno.EACCES, errno.EAGAIN, errno.EDEADLK):
                    raise
                time.sleep(0.05)
        try:
            yield
        finally:
            os.lseek(descriptor, 0, os.SEEK_SET)
            msvcrt.locking(descriptor, msvcrt.LK_UNLCK, 1)
    else:
        import fcntl

        fcntl.flock(descriptor, fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(descriptor, fcntl.LOCK_UN)


@contextmanager
def _transaction():
    """Serialize complete transactions across module copies and profile hosts.

    Lock a stable sidecar: locking the JSON inode would stop protecting the
    state after atomic replacement. Never unlink the lock file on release.
    """
    with _LOCK:
        path = _path()
        path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
        os.chmod(path.parent, 0o700)
        descriptor = _open_lock(Path(str(path) + ".lock"))
        try:
            with _file_lock(descriptor):
                yield
        finally:
            os.close(descriptor)


def _read():
    path = _path()
    try:
        value = json.loads(path.read_text())
        if isinstance(value, dict) and isinstance(value.get("subscriptions"), list):
            return value
    except OSError, ValueError:
        if path.exists():
            _LOG.warning("ChatHermes push state could not be read; push disabled")
        pass
    return {"subscriptions": []}


def _write(value):
    path = _path()
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(path.parent, 0o700)
    # Create private from the first byte, without following a predictable .tmp
    # symlink or sharing a temporary file with another profile's plugin host.
    tmp = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", dir=path.parent, prefix=path.name + ".", delete=False
        ) as stream:
            tmp = Path(stream.name)
            json.dump(value, stream, separators=(",", ":"))
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(tmp, path)
    finally:
        # Close before unlinking, including on serialization/flush failures.
        if tmp is not None:
            tmp.unlink(missing_ok=True)


def config():
    try:
        from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
        from py_vapid import Vapid
        from pywebpush import webpush  # noqa: F401 - availability includes delivery transport.

        with _transaction():
            data = _read()
            vapid = data.get("vapid")
            if (
                not isinstance(vapid, dict)
                or not isinstance(vapid.get("private_key"), str)
                or not isinstance(vapid.get("public_key"), str)
            ):
                key = Vapid()
                key.generate_keys()
                vapid = {
                    "private_key": key.private_pem().decode("ascii"),
                    "public_key": _b64url(
                        key.public_key.public_bytes(
                            encoding=Encoding.X962, format=PublicFormat.UncompressedPoint
                        )
                    ),
                }
                data["vapid"] = vapid
                _write(data)
            else:
                key = Vapid.from_pem(vapid["private_key"].encode())
                if (
                    _b64url(
                        key.public_key.public_bytes(
                            encoding=Encoding.X962, format=PublicFormat.UncompressedPoint
                        )
                    )
                    != vapid["public_key"]
                ):
                    _LOG.warning(
                        "ChatHermes Web Push is unavailable: persisted VAPID keys do not match"
                    )
                    return {"available": False, "vapid_public_key": None}
            return {"available": True, "vapid_public_key": vapid["public_key"]}
    except Exception as error:
        # Third-party exception text can contain private key material. Log only
        # the exception class and actionable, static guidance.
        _LOG.warning(
            "ChatHermes Web Push is unavailable (%s); check Hermes plugin dependencies and push state permissions",
            type(error).__name__,
        )
        return {"available": False, "vapid_public_key": None}


def _b64url(value):
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def vapid_subject(request=None):
    """Require an operator-configured HTTPS origin, including unattended sends."""

    def origin(value):
        try:
            if (
                not isinstance(value, str)
                or not value
                or any(c.isspace() or ord(c) < 32 for c in value)
                or "\\" in value
            ):
                return None
            parsed = urlsplit(value)
            host = parsed.hostname
            if (
                parsed.scheme.lower() != "https"
                or not host
                or parsed.username is not None
                or parsed.password is not None
                or parsed.query
                or parsed.fragment
                or host.lower().rstrip(".") == "localhost"
                or host.lower().rstrip(".").endswith(".localhost")
            ):
                return None
            # Accessing port validates malformed and out-of-range values.
            port = parsed.port
            if port is not None or parsed.netloc.endswith(":"):
                return None
            # py-vapid 1.9.4 accepts HTTPS DNS origins without paths or ports.
            if not re.fullmatch(r"[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+", host):
                return None
            return urlunsplit(("https", parsed.netloc, "", "", ""))
        except ValueError, TypeError:
            return None

    public = origin(os.environ.get("HERMES_DASHBOARD_PUBLIC_URL", "").strip())
    _LOG.info(
        "VAPID subject resolution: configured_env_present=%s configured_https_origin_valid=%s",
        bool(os.environ.get("HERMES_DASHBOARD_PUBLIC_URL", "").strip()),
        bool(public),
    )
    if public:
        return public
    raise RuntimeError("Set HERMES_DASHBOARD_PUBLIC_URL to an HTTPS dashboard URL for Web Push")


def public_dashboard_url(request=None):
    """Return only the explicitly configured, validated dashboard URL."""
    try:
        vapid_subject()
    except RuntimeError:
        return None
    return os.environ["HERMES_DASHBOARD_PUBLIC_URL"].strip().rstrip("/")


def upsert(profile, subscription):
    if not isinstance(profile, str) or not _PROFILE.fullmatch(profile):
        raise ValueError("Invalid profile")
    if (
        not isinstance(subscription, dict)
        or set(subscription) != {"endpoint", "keys"}
        or not isinstance(subscription["keys"], dict)
        or set(subscription["keys"]) != {"p256dh", "auth"}
    ):
        raise ValueError("Invalid subscription")
    endpoint, p256dh, auth = (
        subscription["endpoint"],
        subscription["keys"]["p256dh"],
        subscription["keys"]["auth"],
    )
    from urllib.parse import urlparse

    parsed = urlparse(endpoint) if isinstance(endpoint, str) else None
    if (
        not isinstance(endpoint, str)
        or len(endpoint) > 2048
        or not parsed
        or parsed.scheme != "https"
        or not parsed.hostname
        or parsed.username
        or parsed.password
        or any(c in endpoint for c in "\r\n")
    ):
        raise ValueError("Invalid endpoint")
    if (
        not isinstance(p256dh, str)
        or len(p256dh) > 256
        or not re.fullmatch(r"[A-Za-z0-9_-]+", p256dh)
        or not isinstance(auth, str)
        or len(auth) > 128
        or not re.fullmatch(r"[A-Za-z0-9_-]+", auth)
    ):
        raise ValueError("Invalid subscription keys")
    with _transaction():
        data = _read()
        found = next(
            (
                row
                for row in data["subscriptions"]
                if row["endpoint"] == endpoint and row["profile"] == profile
            ),
            None,
        )
        if found is None:
            found = {"id": secrets.token_urlsafe(18), "created_at": int(time.time())}
            data["subscriptions"].append(found)
        found.update(
            {
                "profile": profile,
                "endpoint": endpoint,
                "p256dh": p256dh,
                "auth": auth,
                "updated_at": int(time.time()),
                "enabled": True,
            }
        )
        _write(data)
        return {
            "id": found["id"],
            "profile": profile,
            "created_at": found["created_at"],
            "enabled": True,
        }


def status(profile, endpoint):
    """Device/profile status only; never return endpoint or subscription keys."""
    with _transaction():
        row = next(
            (
                row
                for row in _read()["subscriptions"]
                if row.get("profile") == profile
                and row.get("endpoint") == endpoint
                and row.get("enabled") is True
            ),
            None,
        )
        return {"profile": profile, "enabled": row is not None, "id": row["id"] if row else None}


def remove(profile, identity):
    with _transaction():
        data = _read()
        old = len(data["subscriptions"])
        data["subscriptions"] = [
            row
            for row in data["subscriptions"]
            if not (row.get("id") == identity and row.get("profile") == profile)
        ]
        if old != len(data["subscriptions"]):
            _write(data)
            return True
        return False


def subscriptions(profile):
    with _transaction():
        return [
            dict(row)
            for row in _read()["subscriptions"]
            if row.get("profile") == profile and row.get("enabled") is True
        ]


def remove_endpoint(identity):
    with _transaction():
        data = _read()
        old = len(data["subscriptions"])
        data["subscriptions"] = [row for row in data["subscriptions"] if row.get("id") != identity]
        if old != len(data["subscriptions"]):
            _write(data)
