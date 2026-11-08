"""Compare the minimal activity feed with the pinned legacy registry lifecycle."""

import importlib.util
import json
import sys
import threading
from contextlib import contextmanager
from pathlib import Path
from types import SimpleNamespace

import pytest

ROOT = Path(__file__).resolve().parents[1] / "plugin/chathermes/dashboard"
spec = importlib.util.spec_from_file_location("activity_contract", ROOT / "session_activity.py")
assert spec is not None and spec.loader is not None
activity = importlib.util.module_from_spec(spec)
spec.loader.exec_module(activity)


@pytest.fixture
def registry(monkeypatch, tmp_path):
    import hermes_constants
    from hermes_cli import web_server_profiles
    from tui_gateway import server

    home = tmp_path / "alpha"
    monkeypatch.setattr(web_server_profiles, "_resolve_profile_dir", lambda profile: home)
    monkeypatch.setattr(hermes_constants, "get_process_hermes_home", lambda: tmp_path / "launch")
    monkeypatch.setattr(server, "_sessions", {})
    monkeypatch.setattr(server, "_resolve_model", lambda: "fixture")
    monkeypatch.setattr(server, "_session_live_title", lambda *args: "fixture")
    monkeypatch.setattr(
        server, "_session_pending_kind", lambda sid: "approval" if sid == "wait" else ""
    )
    from hermes_state import SessionDB

    db = SessionDB(db_path=tmp_path / "state.db")

    @contextmanager
    def session_db(record):
        yield db

    monkeypatch.setattr(server, "_session_db", session_db)
    yield server, home
    db.close()


def test_strict_runtime_owner_duplicate_stored_ids_and_minimal_payload(registry, monkeypatch):
    server, home = registry
    for runtime, owner in (("alpha", home), ("beta", home.parent / "beta"), ("launch", None)):
        server._sessions[runtime] = {
            "profile_home": owner,
            "session_key": "same-id",
            "running": True,
            "history": [{"content": "secret prompt"}],
            "pending_title": "secret title",
        }
    server._sessions["final"] = {"profile_home": home, "running": True, "_finalized": True}
    result = activity.snapshot("alpha")
    assert result == {
        "sessions": [
            {
                "id": "alpha",
                "session_key": "same-id",
                "session_keys": ["same-id"],
                "session_keys_complete": True,
                "status": "working",
            }
        ]
    }
    assert "secret" not in str(result)
    # Prove the actual pinned active_list does NOT scope itself by params.
    response = server._methods["session.active_list"]("active", {"profile": "alpha"})
    assert {row["id"] for row in response["result"]["sessions"]} == {"alpha", "beta", "launch"}
    from hermes_cli import web_server_profiles

    monkeypatch.setattr(
        web_server_profiles, "_resolve_profile_dir", lambda profile: home.parent / "launch"
    )
    assert activity.snapshot("default") == {
        "sessions": [
            {
                "id": "launch",
                "session_key": "same-id",
                "session_keys": ["same-id"],
                "session_keys_complete": True,
                "status": "working",
            }
        ]
    }


def test_native_status_lifecycle_waiting_starting_idle_error_rotation_and_reap(registry):
    server, home = registry
    ready = threading.Event()
    record = {"profile_home": home, "session_key": "stored", "running": False}
    server._sessions["runtime"] = record

    def status():
        return activity.snapshot("alpha")["sessions"][0]["status"]

    assert status() == "idle"
    record.update(agent_ready=ready, agent_build_started=True)
    assert status() == "starting"
    ready.set()
    record["running"] = True
    assert status() == "working"
    server._sessions["wait"] = {**record, "session_key": "other"}
    assert activity.snapshot("alpha")["sessions"][1]["status"] == "waiting"
    # Hermes's agent session ID takes precedence after runtime rotation.
    record["agent"] = SimpleNamespace(session_id="rotated")
    assert activity.snapshot("alpha")["sessions"][0]["session_key"] == "rotated"
    record.update(running=False, agent_error="failed")
    assert status() == "idle"
    server._sessions.clear()
    assert activity.snapshot("alpha") == {"sessions": []}


@pytest.mark.parametrize("runtime", ["runtime", "wait"])
def test_real_compression_lineage_excludes_branches_and_fails_closed(
    registry, monkeypatch, runtime
):
    server, home = registry
    record = {"profile_home": home, "session_key": "root", "running": True}
    server._sessions[runtime] = record
    with server._session_db(record) as db:
        db.create_session("root", source="desktop")
        for parent, child in (("root", "middle"), ("middle", "tip")):
            db.publish_compression_child(
                parent_session_id=parent,
                child_session_id=child,
                source="desktop",
                messages=[{"role": "user", "content": "summary"}],
                require_compression_lease=False,
            )
        db.create_session(
            "branch",
            source="desktop",
            parent_session_id="tip",
            model_config={"_branched_from": "tip"},
        )
    record["agent"] = SimpleNamespace(session_id="tip")
    row = activity.snapshot("alpha")["sessions"][0]
    assert row["session_keys"] == ["middle", "root", "tip"]
    native = "waiting" if runtime == "wait" else "working"
    assert row["session_key"] == "tip" and row["status"] == native
    assert row["session_keys_complete"] is True

    def broken(conn, key):
        raise OSError("secret database path")

    monkeypatch.setattr(activity, "_compression_aliases", broken)
    row = activity.snapshot("alpha")["sessions"][0]
    assert row["status"] == native
    assert row["session_keys"] == ["tip"]
    assert row["session_keys_complete"] is False
    record["running"] = False
    monkeypatch.setattr(server, "_session_pending_kind", lambda sid: "")
    row = activity.snapshot("alpha")["sessions"][0]
    assert row["status"] == "unknown"
    assert row["session_keys_complete"] is False
    assert "secret" not in str(row)


def stale_sibling(db):
    db.create_session("root", source="desktop")
    db.create_session("stale", source="desktop", parent_session_id="root")
    db.end_session("stale", "ws_orphan_reap")
    db.publish_compression_child(
        parent_session_id="root",
        child_session_id="tip",
        source="desktop",
        messages=[{"role": "user", "content": "private summary"}],
        require_compression_lease=False,
    )
    # Deterministic ordering, independent of wall-clock precision.
    db._execute_write(
        lambda conn: conn.execute("UPDATE sessions SET started_at=0 WHERE id='stale'")
    )


@pytest.mark.parametrize(
    "runtime, running, status",
    [("run", True, "working"), ("wait", True, "waiting"), ("run", False, "unknown")],
)
def test_verified_lineage_remains_complete_when_later_ledger_check_fails(
    registry, monkeypatch, runtime, running, status
):
    import hermes_state_local

    server, home = registry
    record = {"profile_home": home, "session_key": "tip", "running": running}
    server._sessions[runtime] = record
    with server._session_db(record) as db:
        stale_sibling(db)

    def broken(conn, key):
        raise OSError("private ledger error")

    monkeypatch.setattr(hermes_state_local, "local_lineage_owner", broken)
    assert activity.snapshot("alpha")["sessions"] == [
        {
            "id": runtime,
            "session_key": "tip",
            "session_keys": ["root", "tip"],
            "session_keys_complete": True,
            "status": status,
        }
    ]


def owner_receipt(db, owner, lineage):
    from hermes_state_local import POLICY_PREFIX

    db._execute_write(
        lambda conn: conn.execute(
            "INSERT OR REPLACE INTO state_meta(key,value) VALUES(?,?)",
            (POLICY_PREFIX + owner, json.dumps({"lineage": lineage})),
        )
    )


@pytest.mark.parametrize("key", ["root", "tip"])
@pytest.mark.parametrize("target", ["root", "canonical-owner"])
def test_stale_sibling_preserves_root_pending_work_in_own_profile(registry, key, target):
    from hermes_state_runtime import admit_session_input, begin_runtime_epoch

    server, home = registry
    record = {"profile_home": home, "session_key": key, "running": False}
    server._sessions["runtime"] = record
    server._sessions["foreign"] = {**record, "profile_home": home.parent / "beta"}
    with server._session_db(record) as db:
        stale_sibling(db)
        # Reproduce the actual pin's disagreement, without mocking either walker.
        assert db.get_compression_lineage("tip") == ["tip"]
        assert db.get_compression_lineage("root") == ["root", "stale"]
        assert db.resolve_resume_session_id("root") == "tip"
        if target != "root":
            db.create_session(target, source="desktop")
            db._execute_write(
                lambda conn: conn.execute(
                    "UPDATE sessions SET chat_id=? WHERE id='root'", (target,)
                )
            )
            owner_receipt(db, target, ["root", "tip"])
        epoch = begin_runtime_epoch(db, instance_id="owner")
        admit_session_input(
            db,
            epoch=epoch,
            principal_id="owner",
            session_id=target,
            request_id="pending",
            payload={"text": "private work"},
        )
    assert activity.snapshot("alpha") == {
        "sessions": [
            {
                "id": "runtime",
                "session_key": key,
                "session_keys": ["root", "tip"],
                "session_keys_complete": True,
                "status": "unknown",
            }
        ]
    }


@pytest.mark.parametrize("kind", ["branch", "delegate", "reset", "tool", "stale"])
def test_unrelated_children_cannot_alias_compressed_parent(registry, kind):
    server, home = registry
    record = {"profile_home": home, "session_key": kind, "running": True}
    server._sessions["runtime"] = record
    with server._session_db(record) as db:
        stale_sibling(db)
        if kind != "stale":
            config = {f"_{kind if kind != 'branch' else 'branched'}_from": "root"}
            db.create_session(
                kind,
                source="tool" if kind == "tool" else "desktop",
                parent_session_id="root",
                model_config=config,
            )
    assert activity.snapshot("alpha")["sessions"][0]["session_keys"] == [kind]


@pytest.mark.parametrize("key", ["root", "tip", "stale", "tool"])
@pytest.mark.parametrize("receipt", ["missing", "malformed", "unrelated", "valid"])
def test_inherited_chat_id_requires_receipt_membership(registry, key, receipt):
    from hermes_state_local import POLICY_PREFIX
    from hermes_state_runtime import admit_session_input, begin_runtime_epoch

    server, home = registry
    record = {"profile_home": home, "session_key": key, "running": False}
    server._sessions["runtime"] = record
    with server._session_db(record) as db:
        stale_sibling(db)
        db.create_session("tool", source="tool", parent_session_id="root")
        db.create_session("canonical-owner", source="desktop")
        db._execute_write(
            lambda conn: conn.execute("UPDATE sessions SET chat_id='canonical-owner'")
        )
        if receipt == "malformed":
            db._execute_write(
                lambda conn: conn.execute(
                    "INSERT INTO state_meta(key,value) VALUES(?,?)",
                    (POLICY_PREFIX + "canonical-owner", "private invalid json"),
                )
            )
        elif receipt != "missing":
            owner_receipt(db, "canonical-owner", ["root", "tip"] if receipt == "valid" else [])
        epoch = begin_runtime_epoch(db, instance_id="owner")
        admit_session_input(
            db,
            epoch=epoch,
            principal_id="owner",
            session_id="canonical-owner",
            request_id="pending",
            payload={"text": "private work"},
        )
    row = activity.snapshot("alpha")["sessions"][0]
    assert row["status"] == ("unknown" if receipt == "valid" and key in ("root", "tip") else "idle")
    assert row["session_keys"] == (["root", "tip"] if key in ("root", "tip") else [key])
    assert "private" not in str(row)


@pytest.mark.parametrize("native", ["working", "waiting", "idle", "starting"])
@pytest.mark.parametrize("ledger", ["pending", "open-error", "read-error"])
def test_ledger_uncertainty_preserves_confirmed_native_busy(registry, monkeypatch, native, ledger):
    from hermes_state_runtime import admit_session_input, begin_runtime_epoch

    server, home = registry
    runtime = "wait" if native == "waiting" else "runtime"
    record = {
        "profile_home": home,
        "session_key": "stored",
        "running": native in ("working", "waiting"),
    }
    if native == "starting":
        record.update(agent_ready=threading.Event(), agent_build_started=True)
    server._sessions[runtime] = record
    with server._session_db(record) as db:
        db.create_session("stored", source="desktop")
        epoch = begin_runtime_epoch(db, instance_id="owner")
        admit_session_input(
            db,
            epoch=epoch,
            principal_id="owner",
            session_id="stored",
            request_id="pending",
            payload={"text": "private work"},
        )
        if ledger == "read-error":

            @contextmanager
            def broken_read():
                raise OSError("private database path")
                yield

            monkeypatch.setattr(db, "_read_ctx", broken_read)
    if ledger == "open-error":

        @contextmanager
        def broken_db(record):
            raise OSError("private database path")
            yield

        monkeypatch.setattr(server, "_session_db", broken_db)
    # This is the first snapshot, with no previously observed browser event.
    row = activity.snapshot("alpha")["sessions"][0]
    assert row["status"] == (native if native in ("working", "waiting") else "unknown")
    assert row["session_keys_complete"] is (ledger == "pending")
    assert "private" not in str(row)


def test_duplicate_lineages_keep_profile_ledgers_isolated(registry, monkeypatch, tmp_path):
    from hermes_cli import web_server_profiles
    from hermes_state import SessionDB
    from hermes_state_runtime import admit_session_input, begin_runtime_epoch

    server, home = registry
    beta_home = home.parent / "beta"
    monkeypatch.setattr(
        web_server_profiles,
        "_resolve_profile_dir",
        lambda profile: home if profile == "alpha" else beta_home,
    )
    with server._session_db({}) as alpha_db:
        beta_db = SessionDB(db_path=tmp_path / "beta.db")
        try:
            for db in (alpha_db, beta_db):
                stale_sibling(db)
            epoch = begin_runtime_epoch(beta_db, instance_id="beta-owner")
            admit_session_input(
                beta_db,
                epoch=epoch,
                principal_id="owner",
                session_id="root",
                request_id="beta-only",
                payload={"text": "private beta work"},
            )

            @contextmanager
            def owned_db(record):
                yield alpha_db if record["profile_home"] == home else beta_db

            monkeypatch.setattr(server, "_session_db", owned_db)
            for profile, owner in (("alpha", home), ("beta", beta_home)):
                server._sessions[profile] = {
                    "profile_home": owner,
                    "session_key": "tip",
                    "running": False,
                }
            for profile, status in (("alpha", "idle"), ("beta", "unknown")):
                assert activity.snapshot(profile) == {
                    "sessions": [
                        {
                            "id": profile,
                            "session_key": "tip",
                            "session_keys": ["root", "tip"],
                            "session_keys_complete": True,
                            "status": status,
                        }
                    ]
                }
        finally:
            beta_db.close()


def test_unverified_stored_identity_cannot_join_live_lineage(registry):
    server, home = registry
    record = {
        "profile_home": home,
        "session_key": "stale",
        "running": True,
        "agent": SimpleNamespace(session_id="tip"),
    }
    server._sessions["runtime"] = record
    with server._session_db(record) as db:
        stale_sibling(db)
    assert activity.snapshot("alpha")["sessions"][0]["session_keys"] == ["root", "tip"]


def test_cyclic_lineage_fails_closed_without_partial_aliases_or_open_transaction(registry):
    server, home = registry
    record = {"profile_home": home, "session_key": "tip", "running": False}
    server._sessions["runtime"] = record
    with server._session_db(record) as db:
        stale_sibling(db)
        db._execute_write(
            lambda conn: conn.execute("UPDATE sessions SET parent_session_id='tip' WHERE id='root'")
        )
        db.end_session("tip", "compression")
        assert activity.snapshot("alpha")["sessions"] == [
            {
                "id": "runtime",
                "session_key": "tip",
                "session_keys": ["tip"],
                "session_keys_complete": False,
                "status": "unknown",
            }
        ]
        with db._read_ctx() as conn:
            assert not conn.in_transaction


@pytest.mark.parametrize("target", ["root", "canonical-owner"])
def test_rotation_and_admission_during_read_use_one_database_snapshot(
    registry, monkeypatch, target
):
    from hermes_state import SessionDB
    from hermes_state_runtime import admit_session_input, begin_runtime_epoch

    server, home = registry
    record = {"profile_home": home, "session_key": "tip", "running": False}
    server._sessions["runtime"] = record
    with server._session_db(record) as db:
        stale_sibling(db)
        if target != "root":
            db.create_session(target, source="desktop")
            db._execute_write(lambda conn: conn.execute("UPDATE sessions SET chat_id=?", (target,)))
        epoch = begin_runtime_epoch(db, instance_id="owner")
        writer = SessionDB(db_path=db.db_path)
        read_ctx = db._read_ctx
        rotated = False
        started = threading.Event()
        finished = threading.Event()
        errors = []

        def rotate():
            started.set()
            try:
                writer.publish_compression_child(
                    parent_session_id="tip",
                    child_session_id="next",
                    source="desktop",
                    messages=[{"role": "user", "content": "private summary"}],
                    require_compression_lease=False,
                )
                if target != "root":
                    owner_receipt(writer, target, ["root", "tip", "next"])
                admit_session_input(
                    writer,
                    epoch=epoch,
                    principal_id="owner",
                    session_id=target,
                    request_id="race",
                    payload={"text": "private work"},
                )
            except Exception as error:
                errors.append(error)
            finally:
                finished.set()

        thread = threading.Thread(target=rotate, daemon=True)

        class RacingConnection:
            def __init__(self, conn):
                self.conn = conn

            def execute(self, sql, params=()):
                nonlocal rotated
                result = self.conn.execute(sql, params)
                if not rotated and sql.startswith("SELECT parent_session_id"):
                    rotated = True
                    # WAL permits a commit inside this read; rollback-journal
                    # mode queues the writer until the snapshot is released.
                    thread.start()
                    assert started.wait(10)
                    if db._wal_active:
                        assert finished.wait(10)
                return result

        @contextmanager
        def racing_read(**kwargs):
            with read_ctx(**kwargs) as conn:
                yield RacingConnection(conn)

        monkeypatch.setattr(db, "_read_ctx", racing_read)
        first = activity.snapshot("alpha")["sessions"][0]
        assert rotated
        assert first["session_keys"] == ["root", "tip"]
        assert first["status"] == "idle"
        thread.join(10)
        assert not thread.is_alive()
        assert not errors
        second = activity.snapshot("alpha")["sessions"][0]
        assert second["session_keys"] == ["next", "root", "tip"]
        assert second["status"] == "unknown"
        with read_ctx() as conn:
            assert not conn.in_transaction
        writer.close()


@pytest.mark.parametrize("outcome", ["completed", "failed"])
def test_pinned_submit_and_actual_owner_relay_never_attest_legacy_idle(
    registry, monkeypatch, outcome
):
    # Execute the pin's real admission/AuthorityConnection/relay lifecycle. Only
    # discovery and the socket dial are replaced by its in-process owner client.
    from gateway.session_contract import SessionRef
    from gateway.session_settlement_recovery import commit_and_publish
    from hermes_state_runtime import (
        admit_session_input,
        begin_runtime_epoch,
        claim_session_input,
        settle_session_input,
    )

    server, home = registry
    path = (
        Path(__file__).resolve().parents[1]
        / ".hermes-source/tests/tui_gateway/test_legacy_submit_forwards_to_owner.py"
    )
    waiting_spec = importlib.util.spec_from_file_location(
        "tests.waiting", path.parents[1] / "waiting.py"
    )
    assert waiting_spec and waiting_spec.loader
    waiting = importlib.util.module_from_spec(waiting_spec)
    waiting_spec.loader.exec_module(waiting)
    monkeypatch.setitem(sys.modules, "tests.waiting", waiting)
    spec = importlib.util.spec_from_file_location("pinned_owner_regression", path)
    assert spec and spec.loader
    pinned = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(pinned)
    with server._session_db({}) as db:
        sid, key, turns, emitted = pinned._legacy(monkeypatch, db)
        record = server._sessions[sid]
        record["profile_home"] = home
        db.create_session(key, source="test")
        epoch = begin_runtime_epoch(db, instance_id="gateway")
        bot = admit_session_input(
            db,
            epoch=epoch,
            principal_id="bot",
            session_id=key,
            request_id="bot",
            payload={"text": "private bot prompt"},
        )
        claim = claim_session_input(db, epoch=epoch, session_id=key)
        assert isinstance(claim, dict)
        authority = pinned._owner(monkeypatch, db, key, epoch)
        reply = server.handle_request(
            {
                "id": "p",
                "method": "prompt.submit",
                "params": {"session_id": sid, "text": "private forwarded prompt"},
            }
        )
        assert reply["result"]["forwarded"] and turns == []
        assert activity.snapshot("alpha")["sessions"][0]["status"] == "unknown"
        settle_session_input(
            db,
            epoch=epoch,
            admission_id=bot["admission_id"],
            generation=claim["generation"],
            outcome="completed",
        )
        row = claim_session_input(db, epoch=epoch, session_id=key)
        ref, live = SessionRef("owned", key), authority.sessions[key]
        authority._stamp_claim(ref, live, row)
        pinned.wait_until(lambda: any(e == "message.start" for e, *_ in emitted), timeout=10)
        assert not record.get("running")
        assert server._session_live_status(sid, record) == "idle"
        assert activity.snapshot("alpha")["sessions"][0]["status"] == "unknown"
        with live.event_stream.lock:
            authority.executing.pop(key, None)
        commit_and_publish(authority, live, ref, row, "ANSWER", outcome, None, {})
        pinned.wait_until(lambda: any(e == "message.complete" for e, *_ in emitted), timeout=10)
        assert activity.snapshot("alpha")["sessions"][0]["status"] == "idle"
        assert "private" not in str(activity.snapshot("alpha"))


def test_lost_owner_relay_and_unknown_recovery_do_not_claim_idle(registry):
    import asyncio

    from hermes_state_runtime import (
        admit_session_input,
        begin_runtime_epoch,
        claim_session_input,
        recover_session_inputs,
    )
    from tui_gateway.owner_forward import _Relay

    server, home = registry
    record = {"profile_home": home, "session_key": "stored", "running": False}
    server._sessions["runtime"] = record
    with server._session_db(record) as db:
        db.create_session("stored", source="desktop")
        epoch = begin_runtime_epoch(db, instance_id="owner")
        admit_session_input(
            db,
            epoch=epoch,
            principal_id="owner",
            session_id="stored",
            request_id="lost",
            payload={"text": "private"},
        )
        claimed = claim_session_input(db, epoch=epoch, session_id="stored")
        assert isinstance(claimed, dict)
        emitted = []
        relay = _Relay(
            "runtime", record, "stored", home, None, "private", lambda *args: emitted.append(args)
        )

        async def lose_owner():
            client = SimpleNamespace(events=asyncio.Queue())
            client.events.put_nowait(ConnectionError("secret owner address"))
            await relay._relay(client, claimed["admission_id"])

        asyncio.run(lose_owner())
        assert emitted == [("message.complete", "runtime", {"text": ""})]
        assert activity.snapshot("alpha")["sessions"][0]["status"] == "unknown"
        epoch = begin_runtime_epoch(db, instance_id="restarted-owner")
        recover_session_inputs(db, epoch=epoch)
        assert activity.snapshot("alpha")["sessions"][0]["status"] == "unknown"
