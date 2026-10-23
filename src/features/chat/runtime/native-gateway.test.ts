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
            : frame.method === "file.attach"
              ? { attached: true, ref_text: "@file note.txt" }
              : frame.method === "session.mutate"
                ? {
                    session_id: "runtime",
                    revision: 5,
                    operation: frame.params.operation,
                    status: "applied",
                  }
                : frame.method === "prompt.submit" && snapshot.revision !== undefined
                  ? { ref: { session_id: "runtime" }, admission_id: "receipt", status: "accepted" }
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
        await viewer.rpc("chat.submit", { input: "hello" });
        await viewer.rpc("chat.state");
        await viewer.rpc("chat.stop");
        await viewer.rpc("chat.steer", { text: "guidance" });
        await viewer.rpc("chat.history");
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
          vi.mocked(fetch).mock.calls.some(([url]) => String(url).includes("membership")),
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
    const sending = viewer.rpc("chat.submit", { input: "hello" });
    viewer.close();
    finish(new Response(JSON.stringify(prepare)));
    await expect(sending).rejects.toMatchObject({ outcome: "rejected" });
    expect(frames.some((f) => f.method === "prompt.submit")).toBe(false);
  });
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
    const sending = viewer.rpc("chat.submit", { input: "hello" });
    await viewer.rpc("chat.stop");
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
    await expect(viewer.rpc("chat.submit", { input: "hello" })).rejects.toMatchObject({
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
    await viewer.rpc("chat.submit", { input: "hello", model: "Alias" });
    expect(frames.find((f) => f.method === "config.set")?.params.value).toBe(
      "test-model --session --provider test-provider",
    );
    expect(frames.find((f) => f.method === "prompt.submit")?.params.text).toContain(
      "@file note.txt",
    );
    viewer.close();
  });
  it.each(["default", "alpha", "beta"])(
    "uses Desktop canonical revision and generation fences for %s",
    async (profile) => {
      snapshot.revision = 4;
      snapshot.execution_generation = 2;
      prepare = { ...prepare, model: "test-model", provider: "test-provider" };
      const viewer = new NativeGatewayViewer(profile, "stored", hooks());
      try {
        await viewer.ensure();
        await viewer.rpc("chat.submit", { input: "hello", model: "Alias" });
        await viewer.rpc("chat.stop");
        const mutation = frames.find((f) => f.method === "session.mutate");
        expect(mutation.params).toMatchObject({
          profile,
          session_id: "runtime",
          operation: "model",
          expected_revision: 4,
          expected_generation: 2,
        });
        expect(mutation.params.request_id).toEqual(expect.any(String));
        const submitted = frames.find((f) => f.method === "prompt.submit");
        expect(submitted.params).toMatchObject({
          profile,
          session_id: "runtime",
          text: "hello",
          submission_id: expect.any(String),
        });
        expect(frames.find((f) => f.method === "session.interrupt").params).toMatchObject({
          profile,
          execution_generation: 2,
        });
        expect(
          frames.some(
            (f) =>
              f.method === "session.activate" ||
              f.method === "config.set" ||
              f.method === "approval.pending",
          ),
        ).toBe(false);
      } finally {
        viewer.close();
      }
    },
  );
  it("answers a canonical restored approval through its exact profile", async () => {
    Object.assign(snapshot, {
      revision: 4,
      execution_generation: 2,
      prompts: [
        {
          kind: "approval",
          prompt_id: "canonical-approval",
          execution_generation: 2,
          choices: ["once", "deny"],
          command: "echo synthetic",
        },
      ],
    });
    const h = hooks(),
      viewer = new NativeGatewayViewer("beta", "stored", h);
    try {
      await viewer.ensure();
      expect(h.requests).toHaveBeenLastCalledWith([
        expect.objectContaining({ id: "canonical-approval", method: "approval" }),
      ]);
      await viewer.answer("canonical-approval", { choice: "deny" });
      expect(frames.find((f) => f.method === "approval.respond").params).toMatchObject({
        profile: "beta",
        session_id: "runtime",
        prompt_id: "canonical-approval",
        execution_generation: 2,
        choice: "deny",
      });
    } finally {
      viewer.close();
    }
  });
});
