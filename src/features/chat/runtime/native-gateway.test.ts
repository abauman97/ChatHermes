// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { NativeGatewayViewer } from "./native-gateway";
import type { NativeHooks } from "./native-chat";

const hooks = (): NativeHooks => ({
  snapshot: vi.fn(),
  event: vi.fn(),
  input: vi.fn(),
  requests: vi.fn(),
  connection: vi.fn(),
  recovered: vi.fn(),
});
const sockets: Socket[] = [];
const frames: any[] = [];
let snapshot: any;
let prepare: any;
let replay: any;
let replayBefore: any;
let replayReads = 0;
let beforeReply: ((socket: Socket, frame: any) => void) | undefined;
class Socket {
  static OPEN = 1;
  readyState = 1;
  onopen: null | (() => void) = null;
  onmessage: null | ((event: { data: string }) => void) = null;
  onerror: null | (() => void) = null;
  onclose: null | (() => void) = null;
  readonly url: URL;
  readonly protocols: string[];
  constructor(url: URL, protocols: string[]) {
    this.url = url;
    this.protocols = protocols;
    sockets.push(this);
    queueMicrotask(() => this.onopen?.());
  }
  receive(frame: unknown) {
    this.onmessage?.({ data: JSON.stringify(frame) });
  }
  close = vi.fn(() => {
    this.readyState = 3;
  });
  send(text: string) {
    const frame = JSON.parse(text);
    frames.push(frame);
    if (!frame.method) return;
    const result =
      frame.method === "session.create"
        ? { ...snapshot, stored_session_id: "new-draft" }
        : frame.method === "session.resume"
          ? snapshot
          : frame.method === "session.activate"
            ? snapshot.confirmed || { ...snapshot, running: false, queued: null }
            : frame.method === "session.events.since"
              ? ++replayReads === 1
                ? (replayBefore ?? replay)
                : replay
              : frame.method === "config.get"
                ? { value: prepare.confirmedEffort ?? prepare.reasoning_effort }
                : frame.method === "file.attach"
                  ? { attached: true, ref_text: "@file note.txt" }
                  : { status: "streaming" };
    queueMicrotask(() => {
      beforeReply?.(this, frame);
      this.receive({ jsonrpc: "2.0", id: frame.id, result });
    });
  }
}
beforeEach(() => {
  sockets.length = 0;
  frames.length = 0;
  beforeReply = undefined;
  replay = undefined;
  replayBefore = undefined;
  replayReads = 0;
  snapshot = {
    session_id: "runtime",
    messages: [{ row_id: 1, role: "assistant", text: "Saved" }],
    info: { model: "test-model", provider: "test-provider" },
    running: false,
  };
  prepare = { input: "hello", files: [] };
  vi.stubGlobal("location", new URL("https://dashboard.test/chathermes"));
  vi.stubGlobal("WebSocket", Socket);
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async (url: string) =>
        new Response(
          JSON.stringify(
            url.includes("ws-ticket")
              ? { ticket: "ephemeral" }
              : url.includes("retain")
                ? { session_id: "runtime" }
                : url.includes("prepare")
                  ? prepare
                  : { session: { id: "stored" } },
          ),
        ),
    ),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("profile-bound native gateway", () => {
  it.each(["default", "alpha", "beta"])(
    "authenticates %s and routes every operation to its owner",
    async (profile) => {
      const h = hooks(),
        viewer = new NativeGatewayViewer(profile, "stored", h);
      try {
        await Promise.all([viewer.ensure(), viewer.ensure()]);
        expect(frames.find((frame) => frame.method === "session.resume").params).toMatchObject({
          omit_messages: true,
          defer_history: true,
          cols: 96,
          source: "desktop",
          profile,
        });
        expect(sockets).toHaveLength(1);
        expect(sockets[0]!.url.href).toBe("wss://dashboard.test/api/ws");
        expect(sockets[0]!.protocols).toEqual([
          "hermes-gateway-v1",
          "hermes-gateway-ticket.ephemeral",
        ]);
        expect(h.snapshot).toHaveBeenCalledWith(
          expect.objectContaining({ recovery: expect.objectContaining({ complete: false }) }),
        );
        expect(h.recovered).toHaveBeenCalledOnce();
        await viewer.rpc("prompt.submit", { input: "hello" });
        await viewer.rpc("state");
        await viewer.rpc("session.interrupt");
        await viewer.rpc("session.steer", { text: "guidance" });
        await viewer.rpc("history");
        await viewer.usage();
        await viewer.contextBreakdown();
        expect(sockets).toHaveLength(1);
        for (const method of ["session.usage", "session.context_breakdown"])
          expect(frames.find((frame) => frame.method === method).params).toEqual({
            profile,
            session_id: "runtime",
          });
        expect(frames.filter((f) => f.method).every((f) => f.params.profile === profile)).toBe(
          true,
        );
        expect(frames.filter((f) => f.method === "prompt.submit")).toHaveLength(1);
        expect(frames.some((f) => f.method?.startsWith("chat."))).toBe(false);
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining(`prepare?profile=${profile}`),
          expect.objectContaining({ credentials: "same-origin", redirect: "manual" }),
        );
      } finally {
        viewer.close();
      }
    },
  );
  it.each(["default", "alpha", "beta"])(
    "hands off a newly created %s draft before closing its creator",
    async (profile) => {
      const made = await NativeGatewayViewer.create(profile, {
        source: "desktop",
        cwd: "/synthetic/workspace",
      });
      expect(made.id).toBe("new-draft");
      expect(sockets[0]!.close).not.toHaveBeenCalled();
      const viewer = new NativeGatewayViewer(profile, made.id, hooks());
      try {
        await viewer.ensure();
        expect(sockets[0]!.close).toHaveBeenCalledOnce();
        expect(sockets[1]!.close).not.toHaveBeenCalled();
        expect(frames.find((f) => f.method === "session.create").params).toMatchObject({
          profile,
          source: "desktop",
          cwd: "/synthetic/workspace",
        });
        expect(
          vi
            .mocked(fetch)
            .mock.calls.some(([url]) =>
              (typeof url === "string" ? url : url instanceof URL ? url.href : url.url).includes(
                "membership",
              ),
            ),
        ).toBe(false);
      } finally {
        viewer.close();
      }
    },
  );
  it("filters colliding session IDs by profile and accepts native newline batches", async () => {
    const h = hooks(),
      viewer = new NativeGatewayViewer("alpha", "stored", h);
    await viewer.ensure();
    const event = (profile: string, text: string) => ({
      jsonrpc: "2.0",
      method: "event",
      params: { type: "message.delta", session_id: "runtime", profile, payload: { text } },
    });
    sockets[0]!.onmessage!({
      data: [event("beta", "Wrong"), event("alpha", "One"), event("alpha", "Two")]
        .map((frame) => JSON.stringify(frame))
        .join("\n"),
    });
    expect(h.event).toHaveBeenCalledTimes(2);
    expect(viewer.boundary).toBe(2);
    viewer.close();
  });
  it("restores unanswered cards and refuses answers after detach", async () => {
    snapshot.open_requests = [
      {
        id: "approval-1",
        method: "approval",
        params: { session_id: "runtime", command: "echo synthetic" },
      },
    ];
    const h = hooks(),
      viewer = new NativeGatewayViewer("beta", "stored", h);
    await viewer.ensure();
    expect(h.requests).toHaveBeenLastCalledWith(snapshot.open_requests);
    await viewer.answer("approval-1", { choice: "deny" });
    expect(frames.at(-1)).toEqual({ jsonrpc: "2.0", id: "approval-1", result: { choice: "deny" } });
    viewer.close();
    await expect(viewer.answer("approval-1", { choice: "once" })).rejects.toMatchObject({
      outcome: "rejected",
    });
  });
  it("confirms a busy recovery once and replaces a completion missed before resume replied", async () => {
    snapshot.running = true;
    snapshot.inflight = { user: "Question", assistant: "Partial", streaming: true };
    snapshot.confirmed = {
      session_id: "runtime",
      running: false,
      queued: null,
      inflight: null,
      info: snapshot.info,
      messages: [
        { row_id: 1, role: "user", text: "Question" },
        { row_id: 2, role: "assistant", text: "Complete answer" },
      ],
    };
    beforeReply = (socket, frame) => {
      if (frame.method === "session.activate")
        socket.receive({
          jsonrpc: "2.0",
          method: "event",
          params: {
            session_id: "runtime",
            type: "message.delta",
            payload: { text: "Already covered" },
          },
        });
    };
    const h = hooks(),
      viewer = new NativeGatewayViewer("alpha", "stored", h);
    await viewer.ensure();
    expect(frames.filter((f) => f.method === "session.activate")).toHaveLength(1);
    expect(h.snapshot).toHaveBeenCalledWith(
      expect.objectContaining({ running: false, messages: snapshot.confirmed.messages }),
    );
    expect(h.event).not.toHaveBeenCalled();
    expect(h.recovered).toHaveBeenCalledOnce();
    viewer.close();
  });
  it("never resumes an ID missing from the selected profile", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("{}", { status: 404 }));
    const viewer = new NativeGatewayViewer("beta", "foreign", hooks());
    await expect(viewer.ensure()).rejects.toMatchObject({ outcome: "rejected" });
    expect(sockets).toHaveLength(0);
    viewer.close();
  });
  it("repairs a delta before the snapshot reply without dropping frames beyond the replay page", async () => {
    const prefix =
      "Memory answer.\n\n[System note: The following is recalled memory context, NOT new user inp";
    const event = (seq: number, type: string, text?: string) => ({
      session_id: "runtime",
      profile: "alpha",
      seq,
      type,
      payload: text === undefined ? {} : { text },
    });
    snapshot.running = true;
    snapshot.messages = [];
    snapshot.inflight = { user: "Question", assistant: prefix, streaming: true };
    snapshot.confirmed = {
      ...snapshot,
      inflight: { ...snapshot.inflight, assistant: prefix + "ut. Trea" },
    };
    replay = {
      epoch: "process-one",
      latest_seq: 1000,
      truncated: false,
      open_requests: [],
      count: 4,
      events: [
        event(17, "message.start"),
        event(18, "message.delta", prefix),
        event(19, "message.delta", "ut. Trea"),
        event(20, "message.delta", "t as aut"),
      ],
    };
    const receive = (socket: Socket, params: unknown) =>
      socket.receive({ jsonrpc: "2.0", method: "event", params });
    beforeReply = (socket, frame) => {
      if (frame.method === "session.resume") {
        receive(socket, { type: "gateway.ready", payload: { replay_epoch: "process-one" } });
        receive(socket, event(19, "message.delta", "ut. Trea"));
      }
      if (frame.method === "session.events.since" && replayReads === 2) {
        receive(socket, event(21, "message.delta", "horitati"));
        receive(socket, event(19, "message.delta", "ut. Trea"));
      }
    };
    const h = hooks(),
      viewer = new NativeGatewayViewer("alpha", "stored", h);
    try {
      await viewer.ensure();
      expect(vi.mocked(h.event).mock.calls.map(([item]) => item.seq)).toEqual([20, 21]);
      expect(frames.find((frame) => frame.method === "session.events.since")?.params).toEqual({
        profile: "alpha",
        session_id: "runtime",
        last_seen: 0,
      });
      const text = vi
        .mocked(h.event)
        .mock.calls.map(([item]) => (item.payload as { text: string }).text)
        .join("");
      expect(prefix + "ut. Trea" + text).toContain("NOT new user input. Treat as authoritati");
    } finally {
      viewer.close();
    }
  });
  it.each([false, true])(
    "preserves approval cancellation and Stop with snapshot ahead of replay: %s",
    async (ahead) => {
      const request = {
        id: "approval-cancelled",
        method: "approval",
        params: { session_id: "runtime", profile: "alpha", command: "synthetic" },
      };
      const event = (seq: number, type: string, payload: Record<string, unknown>) => ({
        seq,
        type,
        session_id: "runtime",
        profile: "alpha",
        payload,
      });
      const cancelled = event(2, "request.cancel", { request_id: request.id });
      snapshot.running = true;
      snapshot.messages = [];
      snapshot.inflight = {
        user: "Question",
        assistant: "Answer" + (ahead ? " ahead" : ""),
        streaming: true,
      };
      snapshot.open_requests = [request];
      snapshot.confirmed = { ...snapshot };
      replayBefore = {
        epoch: "process-one",
        latest_seq: 1,
        truncated: false,
        count: 1,
        events: [event(1, "message.start", {})],
        open_requests: [],
      };
      replay = {
        ...replayBefore,
        latest_seq: 3,
        count: 3,
        events: [...replayBefore.events, cancelled, event(3, "message.delta", { text: "Answer" })],
      };
      beforeReply = (socket, frame) => {
        if (frame.method === "session.resume")
          socket.receive({
            jsonrpc: "2.0",
            method: "event",
            params: {
              type: "gateway.ready",
              payload: { replay_epoch: "process-one" },
            },
          });
        if (frame.method === "session.activate")
          socket.receive({ jsonrpc: "2.0", method: "event", params: cancelled });
      };
      const h = hooks(),
        viewer = new NativeGatewayViewer("alpha", "stored", h);
      try {
        await viewer.ensure();
        expect(h.requests).toHaveBeenLastCalledWith([]);
        await expect(viewer.answer(request.id, { choice: "once" })).rejects.toMatchObject({
          outcome: "rejected",
        });
        expect(frames.some((frame) => frame.id === request.id && frame.result)).toBe(false);
        expect(h.snapshot).toHaveBeenLastCalledWith(
          expect.objectContaining({
            inflight: expect.objectContaining({ assistant: ahead ? "" : "Answer" }),
          }),
        );
        expect(h.event).toHaveBeenCalledWith(cancelled);
        expect(vi.mocked(h.event).mock.calls.some(([item]) => item.type === "message.delta")).toBe(
          false,
        );
        // A foreign cancellation cannot close a newly arriving owned request.
        const next = { ...request, id: "approval-next" };
        sockets[0]!.receive({ jsonrpc: "2.0", ...next });
        for (const foreign of [{ profile: "beta" }, { session_id: "foreign" }])
          sockets[0]!.receive({
            jsonrpc: "2.0",
            method: "event",
            params: {
              ...cancelled,
              ...foreign,
              payload: { id: next.id },
            },
          });
        expect(h.requests).toHaveBeenLastCalledWith([next]);
        await viewer.answer(next.id, { choice: "deny" });
        expect(h.requests).toHaveBeenLastCalledWith([]);
        await viewer.rpc("session.interrupt");
        expect(frames.at(-1)).toMatchObject({
          method: "session.interrupt",
          params: { session_id: "runtime", profile: "alpha" },
        });
        if (ahead) {
          snapshot.confirmed = { ...snapshot, running: false, inflight: null, open_requests: [] };
          sockets[0]!.receive({
            jsonrpc: "2.0",
            method: "event",
            params: event(4, "message.complete", { text: "Answer ahead" }),
          });
          await vi.waitFor(() =>
            expect(h.event).toHaveBeenLastCalledWith(
              expect.objectContaining({
                type: "message.complete",
                payload: { text: "" },
              }),
            ),
          );
          expect(h.connection).toHaveBeenLastCalledWith("open");
        }
      } finally {
        viewer.close();
      }
    },
  );
  it("cannot dispatch after detach during preparation", async () => {
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    await viewer.ensure();
    let finish!: (response: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const sending = viewer.rpc("prompt.submit", { input: "hello" });
    viewer.close();
    finish(new Response(JSON.stringify(prepare)));
    await expect(sending).rejects.toMatchObject({ outcome: "rejected" });
    expect(frames.some((f) => f.method === "prompt.submit")).toBe(false);
  });
  it.each([
    ["id", true],
    ["request_id", true],
    ["id", false],
    ["request_id", false],
  ] as const)(
    "does not resurrect a cancelled approval from stale open_requests (%s, already seen: %s)",
    async (key, seen) => {
      const request = {
        id: "approval-cancelled",
        method: "approval",
        params: { session_id: "runtime", profile: "alpha", command: "synthetic" },
      };
      snapshot.open_requests = seen ? [request] : [];
      const h = hooks(),
        viewer = new NativeGatewayViewer("alpha", "stored", h);
      try {
        await viewer.ensure();
        expect(h.requests).toHaveBeenLastCalledWith(seen ? [request] : []);
        snapshot.open_requests = [request];
        beforeReply = (socket, frame) => {
          if (frame.method === "session.activate")
            socket.receive({
              jsonrpc: "2.0",
              method: "event",
              params: {
                type: "request.cancel",
                session_id: "runtime",
                profile: "alpha",
                payload: { [key]: request.id },
              },
            });
        };
        await viewer.rpc("state");
        expect(h.requests).toHaveBeenLastCalledWith([]);
        await expect(viewer.answer(request.id, { choice: "once" })).rejects.toMatchObject({
          outcome: "rejected",
        });
        // Both live redelivery and another stale read must remain closed.
        sockets[0]!.receive({ jsonrpc: "2.0", ...request });
        beforeReply = undefined;
        await viewer.rpc("state");
        expect(h.requests).toHaveBeenLastCalledWith([]);
        expect(frames.some((frame) => frame.id === request.id && frame.result)).toBe(false);
        const next = { ...request, id: "approval-next" };
        sockets[0]!.receive({ jsonrpc: "2.0", ...next });
        expect(h.requests).toHaveBeenLastCalledWith([next]);
      } finally {
        viewer.close();
      }
    },
  );
  it.each(["failure", "invalid snapshot", "new turn", "detach"])(
    "settles intercepted completion after failed history recovery: %s",
    async (race) => {
      snapshot.running = true;
      snapshot.messages = [];
      snapshot.inflight = { user: "Question", assistant: "Evicted prefix", streaming: true };
      snapshot.confirmed = { ...snapshot };
      replay = {
        epoch: "process-one",
        latest_seq: 900,
        events: [],
        count: 0,
        truncated: true,
        open_requests: [],
      };
      beforeReply = (socket, frame) => {
        if (frame.method === "session.resume")
          socket.receive({
            jsonrpc: "2.0",
            method: "event",
            params: { type: "gateway.ready", payload: { replay_epoch: "process-one" } },
          });
      };
      const h = hooks();
      let busy = false;
      vi.mocked(h.snapshot).mockImplementation((value) => {
        busy = !!value.running;
      });
      vi.mocked(h.event).mockImplementation((event) => {
        if (event.type === "message.start") busy = true;
        if (event.type === "message.complete") busy = false;
      });
      const viewer = new NativeGatewayViewer("alpha", "stored", h);
      const receive = (type: string, seq: number, payload = {}) =>
        sockets[0]!.receive({
          jsonrpc: "2.0",
          method: "event",
          params: { type, seq, session_id: "runtime", profile: "alpha", payload },
        });
      try {
        await viewer.ensure();
        expect(busy).toBe(true);
        vi.mocked(h.event).mockClear();
        vi.mocked(h.connection).mockClear();
        beforeReply = (socket, frame) => {
          if (frame.method !== "session.activate") return;
          if (race === "new turn") receive("message.start", 902);
          if (race === "detach") viewer.close();
          if (race === "invalid snapshot") {
            socket.receive({ jsonrpc: "2.0", id: frame.id, result: {} });
            return;
          }
          socket.receive({
            jsonrpc: "2.0",
            id: frame.id,
            error: { code: -32603, message: "synthetic activation failure" },
          });
        };
        receive("message.complete", 901, { text: "Unverified terminal prose", status: "complete" });
        await vi.waitFor(() =>
          expect(frames.filter((frame) => frame.method === "session.activate")).toHaveLength(2),
        );
        if (race === "failure" || race === "invalid snapshot") {
          await vi.waitFor(() => expect(busy).toBe(false));
          expect(h.event).toHaveBeenLastCalledWith(
            expect.objectContaining({
              type: "message.complete",
              payload: { text: "", status: "complete" },
            }),
          );
          expect(h.connection).toHaveBeenLastCalledWith(
            "open",
            "Response history is unavailable. Reopen this chat to refresh it.",
          );
          // Failure cannot make previously uncertain prose safe to publish.
          receive("message.delta", 903, { text: "Still unverified" });
          expect(h.event).toHaveBeenCalledTimes(1);
          await viewer.rpc("session.interrupt");
        } else {
          expect(busy).toBe(true);
          expect(vi.mocked(h.event).mock.calls.some(([e]) => e.type === "message.complete")).toBe(
            false,
          );
          if (race === "detach") expect(h.connection).not.toHaveBeenCalled();
        }
      } finally {
        viewer.close();
      }
    },
  );
  it("does not resurrect an answered approval from an older snapshot", async () => {
    const request = {
      id: "approval-old",
      method: "approval",
      params: {
        session_id: "runtime",
        profile: "alpha",
        command: "synthetic",
      },
    };
    snapshot.open_requests = [request];
    const h = hooks(),
      viewer = new NativeGatewayViewer("alpha", "stored", h);
    try {
      await viewer.ensure();
      expect(h.requests).toHaveBeenLastCalledWith([request]);
      beforeReply = (_socket, frame) => {
        if (frame.method === "session.activate") void viewer.answer(request.id, { choice: "deny" });
      };
      // The native snapshot was captured with this request open; its reply
      // arrives after the decision was sent over the same ordered socket.
      await viewer.rpc("state");
      expect(h.requests).toHaveBeenLastCalledWith([]);
      expect(frames.filter((frame) => frame.id === request.id && frame.result)).toHaveLength(1);
      const next = { ...request, id: "approval-new" };
      sockets[0]!.receive({ jsonrpc: "2.0", ...next });
      expect(h.requests).toHaveBeenLastCalledWith([next]);
    } finally {
      viewer.close();
    }
  });
  it.each(["Same", "Different"])(
    "keeps controls connected across an unobserved turn change with %s text",
    async (text) => {
      snapshot.running = true;
      snapshot.messages = [];
      snapshot.inflight = { user: "First question", assistant: "Same", streaming: true };
      snapshot.confirmed = { ...snapshot };
      const event = (seq: number, type: string, text?: string) => ({
        session_id: "runtime",
        profile: "alpha",
        seq,
        type,
        payload: text === undefined ? {} : { text },
      });
      replayBefore = {
        epoch: "process-one",
        events: [event(1, "message.start"), event(2, "message.delta", "Same")],
        latest_seq: 999,
        count: 2,
        truncated: false,
        open_requests: [],
      };
      replay = {
        ...replayBefore,
        events: [
          ...replayBefore.events,
          event(3, "message.complete", "Same"),
          event(4, "message.start"),
          event(5, "message.delta", text),
        ],
        count: 5,
      };
      // No session event reaches this viewer before either snapshot reply.
      // Both native replay pages still contain the intervening turn boundary.
      beforeReply = (socket, frame) => {
        if (frame.method === "session.resume")
          socket.receive({
            jsonrpc: "2.0",
            method: "event",
            params: { type: "gateway.ready", payload: { replay_epoch: "process-one" } },
          });
      };
      const h = hooks(),
        viewer = new NativeGatewayViewer("alpha", "stored", h);
      try {
        await viewer.ensure();
        expect(h.snapshot).toHaveBeenLastCalledWith(
          expect.objectContaining({
            inflight: expect.objectContaining({ assistant: "" }),
          }),
        );
        expect(h.event).not.toHaveBeenCalled();
        expect(h.connection).toHaveBeenLastCalledWith(
          "open",
          "Earlier response progress is unavailable.",
        );
        await viewer.rpc("session.interrupt");
        expect(frames.at(-1)).toMatchObject({ method: "session.interrupt" });
        snapshot.confirmed = {
          ...snapshot,
          running: false,
          inflight: null,
          messages: [{ role: "assistant", text: "Final answer", row_id: 2 }],
        };
        sockets[0]!.receive({
          jsonrpc: "2.0",
          method: "event",
          params: event(6, "message.complete", "Final answer"),
        });
        await vi.waitFor(() =>
          expect(h.event).toHaveBeenLastCalledWith(
            expect.objectContaining({
              type: "message.complete",
              payload: { text: "" },
            }),
          ),
        );
        expect(h.snapshot).toHaveBeenLastCalledWith(
          expect.objectContaining({
            messages: [{ role: "assistant", text: "Final answer", row_id: 2 }],
          }),
        );
      } finally {
        viewer.close();
      }
    },
  );
  it.each(["stop", "deny"])(
    "keeps %s connected when earlier replay text was evicted",
    async (choice) => {
      snapshot.running = true;
      snapshot.messages = [];
      snapshot.inflight = { user: "Question", assistant: "Earlier prefix", streaming: true };
      snapshot.confirmed = { ...snapshot };
      replay = {
        epoch: "process-one",
        latest_seq: 900,
        events: [],
        count: 0,
        truncated: true,
        open_requests: [],
      };
      const receive = (socket: Socket, params: unknown) =>
        socket.receive({ jsonrpc: "2.0", method: "event", params });
      beforeReply = (socket, frame) => {
        if (frame.method === "session.resume")
          receive(socket, { type: "gateway.ready", payload: { replay_epoch: "process-one" } });
        if (frame.method === "session.events.since" && replayReads === 2) {
          receive(socket, {
            session_id: "runtime",
            type: "message.delta",
            seq: 901,
            payload: { text: "Unverifiable suffix" },
          });
          receive(socket, {
            session_id: "runtime",
            type: "tool.progress",
            seq: 902,
            payload: { tool_id: "tool", text: "Working" },
          });
          socket.receive({
            jsonrpc: "2.0",
            id: "approval",
            method: "approval",
            params: { session_id: "runtime", profile: "alpha", command: "synthetic" },
          });
        }
      };
      const h = hooks(),
        viewer = new NativeGatewayViewer("alpha", "stored", h);
      try {
        await viewer.ensure();
        expect(vi.mocked(h.event).mock.calls.map(([item]) => item.type)).toEqual(["tool.progress"]);
        expect(h.connection).toHaveBeenLastCalledWith(
          "open",
          "Earlier response progress is unavailable.",
        );
        expect(h.snapshot).toHaveBeenCalledWith(
          expect.objectContaining({
            inflight: expect.objectContaining({ assistant: "", user: "Question" }),
          }),
        );
        if (choice === "stop") {
          await viewer.rpc("session.interrupt");
          expect(frames.at(-1)).toMatchObject({
            method: "session.interrupt",
            params: { session_id: "runtime", profile: "alpha" },
          });
        } else {
          await viewer.answer("approval", { choice: "deny" });
          expect(frames.at(-1)).toEqual({
            jsonrpc: "2.0",
            id: "approval",
            result: { choice: "deny" },
          });
        }
        snapshot.confirmed = {
          ...snapshot,
          running: false,
          inflight: null,
          messages: [{ role: "assistant", text: "Complete answer", row_id: 2 }],
        };
        receive(sockets[0]!, {
          session_id: "runtime",
          type: "message.complete",
          seq: 903,
          payload: { text: "Complete answer", response_reused: true },
        });
        await vi.waitFor(() =>
          expect(h.event).toHaveBeenLastCalledWith(
            expect.objectContaining({
              type: "message.complete",
              payload: { text: "", response_reused: true },
            }),
          ),
        );
        expect(h.snapshot).toHaveBeenLastCalledWith(
          expect.objectContaining({
            messages: [{ role: "assistant", text: "Complete answer", row_id: 2 }],
          }),
        );
        receive(sockets[0]!, {
          session_id: "runtime",
          type: "message.delta",
          seq: 904,
          payload: { text: "Later answer" },
        });
        expect(h.event).toHaveBeenLastCalledWith(
          expect.objectContaining({ payload: { text: "Later answer" } }),
        );
      } finally {
        viewer.close();
      }
    },
  );
  it("Stop during authenticated preparation cannot admit the pending prompt later", async () => {
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    await viewer.ensure();
    let finish!: (response: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const sending = viewer.rpc("prompt.submit", { input: "hello" });
    await viewer.rpc("session.interrupt");
    finish(new Response(JSON.stringify(prepare)));
    await expect(sending).rejects.toMatchObject({
      outcome: "rejected",
      message: "Message cancelled before submission",
    });
    expect(frames.some((f) => f.method === "prompt.submit")).toBe(false);
    expect(frames.find((f) => f.method === "session.interrupt").params.profile).toBe("alpha");
    viewer.close();
  });
  it("keeps dispatched failures ambiguous and never retries a prompt", async () => {
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    await viewer.ensure();
    const send = sockets[0]!.send.bind(sockets[0]);
    vi.spyOn(sockets[0]!, "send").mockImplementation((text) => {
      const f = JSON.parse(text);
      if (f.method === "prompt.submit") {
        frames.push(f);
        queueMicrotask(() =>
          sockets[0]!.receive({
            jsonrpc: "2.0",
            id: f.id,
            error: { code: 500, message: "sensitive provider detail" },
          }),
        );
      } else send(text);
    });
    await expect(viewer.rpc("prompt.submit", { input: "hello" })).rejects.toMatchObject({
      outcome: "unknown",
      message: "Native submission outcome unknown. Inspect history before sending again.",
    });
    expect(frames.filter((f) => f.method === "prompt.submit")).toHaveLength(1);
    viewer.close();
  });
  it("stages files and verifies the selected runtime model before submitting", async () => {
    prepare = {
      ...prepare,
      model: "test-model",
      provider: "test-provider",
      files: [{ name: "note.txt", path: "/profile/uploads/note.txt" }],
    };
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    await viewer.ensure();
    await viewer.rpc("prompt.submit", { input: "hello", model: "Alias" });
    expect(frames.find((f) => f.method === "config.set")?.params.value).toBe(
      "test-model --session --provider test-provider",
    );
    expect(frames.find((f) => f.method === "prompt.submit")?.params.text).toContain(
      "@file note.txt",
    );
    viewer.close();
  });
  it.each(["default", "alpha", "beta"])(
    "applies reasoning after the model in %s before prompt submission",
    async (profile) => {
      prepare = {
        ...prepare,
        model: "test-model",
        provider: "test-provider",
        reasoning_effort: "high",
      };
      const viewer = new NativeGatewayViewer(profile, "stored", hooks());
      try {
        await viewer.ensure();
        await viewer.rpc("prompt.submit", { input: "hello", reasoning_effort: "high" });
        const changes = frames.filter((f) => f.method === "config.set");
        expect(changes.map((f) => f.params.key)).toEqual(["model", "reasoning"]);
        expect(changes[1].params).toEqual({
          profile,
          session_id: "runtime",
          key: "reasoning",
          value: "high",
          scope: "session",
        });
        const check = frames.findIndex((f) => f.method === "config.get");
        expect(frames[check].params).toEqual({
          profile,
          session_id: "runtime",
          key: "reasoning",
        });
        expect(check).toBeLessThan(frames.findIndex((f) => f.method === "prompt.submit"));
        expect(frames.find((f) => f.method === "prompt.submit").params).toEqual({
          profile,
          session_id: "runtime",
          text: "hello",
        });
      } finally {
        viewer.close();
      }
    },
  );
  it("does not change reasoning without an explicit selection", async () => {
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    try {
      await viewer.ensure();
      await viewer.rpc("prompt.submit", { input: "hello" });
      expect(frames.some((f) => f.params?.key === "reasoning")).toBe(false);
    } finally {
      viewer.close();
    }
  });
  it.each(["mismatch", "error", "cancel"])("blocks submission on reasoning %s", async (failure) => {
    prepare.reasoning_effort = "none";
    if (failure === "mismatch") prepare.confirmedEffort = "high";
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    try {
      await viewer.ensure();
      const socket = sockets[0]!;
      const send = socket.send.bind(socket);
      socket.send = (text) => {
        const f = JSON.parse(text);
        if (f.method === "config.set" && failure === "error") {
          frames.push(f);
          queueMicrotask(() =>
            socket.receive({
              jsonrpc: "2.0",
              id: f.id,
              error: { code: 4002, message: "private detail" },
            }),
          );
        } else {
          send(text);
          if (f.method === "config.set" && failure === "cancel")
            void viewer.rpc("session.interrupt");
        }
      };
      await expect(
        viewer.rpc("prompt.submit", { input: "hello", reasoning_effort: "none" }),
      ).rejects.toMatchObject({ outcome: "rejected" });
      expect(frames.some((f) => f.method === "prompt.submit")).toBe(false);
    } finally {
      viewer.close();
    }
  });
  it("rejects an incompatible snapshot without translated calls", async () => {
    snapshot.revision = 4;
    snapshot.execution_generation = 2;
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    await expect(viewer.ensure()).rejects.toMatchObject({ outcome: "rejected" });
    expect(frames.some((f) => f.method === "session.mutate")).toBe(false);
    viewer.close();
  });
  it.each(["unavailable", "different runtime"])(
    "refuses dispatch when retention is %s",
    async (failure) => {
      const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
      await viewer.ensure();
      const original = vi.mocked(fetch).getMockImplementation()!;
      vi.mocked(fetch).mockImplementation(async (...args) => {
        if (typeof args[0] === "string" && args[0].includes("chat/retain"))
          return new Response(JSON.stringify({ session_id: "foreign-runtime" }), {
            status: failure === "unavailable" ? 503 : 200,
          });
        return original(...args);
      });
      await expect(viewer.rpc("prompt.submit", { input: "hello" })).rejects.toMatchObject({
        outcome: "rejected",
      });
      expect(frames.some((frame) => frame.method === "prompt.submit")).toBe(false);
      viewer.close();
    },
  );
  it("delegates a separate ticket before native dispatch without retaining credentials", async () => {
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    await viewer.ensure();
    await viewer.rpc("prompt.submit", { input: "hello" });
    const requests = vi.mocked(fetch).mock.calls;
    expect(requests.filter(([url]) => url === "/api/auth/ws-ticket")).toHaveLength(2);
    const retained = requests.find(
      ([url]) => typeof url === "string" && url.includes("chat/retain"),
    )!;
    expect(JSON.parse(retained[1]?.body as string)).toEqual({
      session_id: "stored",
      ticket: "ephemeral",
    });
    expect(frames.filter((frame) => frame.method === "prompt.submit")).toHaveLength(1);
    expect(sockets.every((socket) => socket.url.pathname === "/api/ws" && !socket.url.search)).toBe(
      true,
    );
    viewer.close();
  });
  it("does not answer or display a question belonging to another profile", async () => {
    const h = hooks(),
      viewer = new NativeGatewayViewer("alpha", "stored", h);
    await viewer.ensure();
    sockets[0]!.receive({
      jsonrpc: "2.0",
      id: "foreign-question",
      method: "approval",
      params: { session_id: "runtime", profile: "beta", command: "echo other" },
    });
    expect(h.requests).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: "foreign-question" })]),
    );
    expect(
      frames
        .filter((frame) => frame.id === "foreign-question")
        .every((frame) => frame.error?.code === 4404),
    ).toBe(true);
    viewer.close();
  });
});

it("treats a deferred cold ack as omitted history while REST hydrates", async () => {
  snapshot = { ...snapshot, messages: [], hydrating: true, messages_omitted: undefined };
  const h = hooks();
  const viewer = new NativeGatewayViewer("alpha", "stored", h);
  try {
    await viewer.ensure();
    expect(h.snapshot).toHaveBeenCalledWith(
      expect.objectContaining({ messages: [], messages_omitted: true, hydrating: true }),
    );
  } finally {
    viewer.close();
  }
});

it("scopes command RPCs to the resumed runtime and never accepts caller ownership overrides", async () => {
  const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
  try {
    await viewer.ensure();
    await viewer.command("commands.catalog", { session_id: "foreign", profile: "beta" });
    await viewer.command("complete.slash", { text: "/", session_id: "foreign" });
    await viewer.command("command.dispatch", { name: "work", arg: "task" });
    await viewer.command("slash.exec", { command: "status" });
    await viewer.command("session.compress", { focus_topic: "task" });
    await viewer.command("config.get", {
      key: "reasoning",
      session_id: "foreign",
      profile: "beta",
    });
    await viewer.command("config.set", {
      key: "reasoning",
      value: "high",
      scope: "session",
      session_id: "foreign",
      profile: "beta",
    });
    for (const method of [
      "commands.catalog",
      "complete.slash",
      "command.dispatch",
      "slash.exec",
      "session.compress",
      "config.get",
      "config.set",
    ]) {
      expect(frames.find((frame) => frame.method === method)?.params).toMatchObject({
        profile: "alpha",
        session_id: "runtime",
      });
    }
    expect(() => viewer.command("session.delete")).toThrow("Unsupported command operation");
  } finally {
    viewer.close();
  }
});

it("discovers for a new profile draft without creating or resuming a session", async () => {
  await NativeGatewayViewer.discover("beta", "complete.slash", {
    text: "/",
  });
  expect(frames.map((frame) => frame.method)).toEqual(["gateway.ping", "complete.slash"]);
  expect(frames[1].params).toEqual({
    profile: "beta",
    text: "/",
  });
  expect(sockets[0]?.close).toHaveBeenCalledOnce();
});

it.each(["slash.exec", "config.set"])(
  "keeps %s failures outcome-unknown without retrying or exposing gateway error bodies",
  async (method) => {
    const viewer = new NativeGatewayViewer("alpha", "stored", hooks());
    try {
      await viewer.ensure();
      beforeReply = (socket, frame) => {
        if (frame.method === method)
          socket.receive({
            jsonrpc: "2.0",
            id: frame.id,
            error: { code: 5030, message: "private upstream diagnostic" },
          });
      };
      await expect(
        viewer.command(
          method,
          method === "slash.exec"
            ? { command: "status" }
            : { key: "reasoning", value: "high", scope: "session" },
        ),
      ).rejects.toMatchObject({
        outcome: "unknown",
        message: "Hermes could not complete this operation",
      });
      expect(frames.filter((frame) => frame.method === method)).toHaveLength(1);
      expect(frames.filter((frame) => frame.method === "command.dispatch")).toHaveLength(0);
    } finally {
      viewer.close();
    }
  },
);
