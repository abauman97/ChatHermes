// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { useNativeSession } from "./native-session";
import { api } from "../../../services/hermes-api";
import type { NativeHooks, NativeSnapshot } from "./native-chat";
import { NativeError } from "./native-chat";
import { nativeOutcome, uncertainNativeOutcome } from "./native-admission";
import { mount, flushPromises } from "@vue/test-utils";
import App from "../../../App.vue";
import ChatComposer from "../components/ChatComposer.vue";
import SessionSidebar from "../../sessions/components/SessionSidebar.vue";

const fake = vi.hoisted(() => ({ viewers: [] as any[] }));
vi.mock("./native-chat", async (original) => ({
  ...(await original<typeof import("./native-chat")>()),
  NativeViewer: class {
    boundary = 0;
    hooks: NativeHooks;
    profile: string;
    stored: string;
    finish!: () => void;
    fail!: (cause: Error) => void;
    pending = new Promise<void>((resolve, reject) => {
      this.finish = resolve;
      this.fail = reject;
    });
    close = vi.fn();
    rpc = vi.fn(async () => ({ settled: false }));
    answer = vi.fn();
    constructor(profile: string, stored: string, hooks: NativeHooks) {
      this.profile = profile;
      this.stored = stored;
      this.hooks = hooks;
      fake.viewers.push(this);
    }
    ensure() {
      return this.pending;
    }
  },
}));
const snapshot = (text: string, running = false): NativeSnapshot =>
  ({
    session_id: "runtime",
    messages: [{ row_id: 1, role: "assistant", text }],
    running,
    recovery: { epoch: "epoch", through: 0, base_row_ids: ["1"], complete: true },
  }) as NativeSnapshot;
function ready(viewer: any, text: string) {
  viewer.hooks.snapshot(snapshot(text));
  viewer.hooks.recovered();
  viewer.finish();
}
const latest = () => fake.viewers.at(-1)!;
beforeEach(() => {
  fake.viewers = [];
  vi.spyOn(api, "messages").mockImplementation(() => new Promise(() => {}));
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState({}, "", "/chathermes");
  localStorage.clear();
});

describe("interrupted attachment draft recovery", () => {
  it.each(["background", "offline", "navigation"])(
    "recovers rejected text only in the original selection after %s",
    async (interruption) => {
      history.replaceState({}, "", "/chathermes?profile=attachment-test");
      vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
      vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
      vi.stubGlobal("fetch", async (input: string) => {
        const value = input.endsWith("/profiles")
          ? { profiles: [{ name: "attachment-test" }] }
          : input.includes("/capabilities")
            ? { features: { native_chat: true } }
            : input.includes("/models")
              ? { data: [{ id: "Instant" }] }
              : input.includes("/projects")
                ? { projects: [] }
                : { sessions: [{ id: "one" }, { id: "two" }], total: 2 };
        return new Response(JSON.stringify(value), {
          headers: { "content-type": "application/json" },
        });
      });
      let finish!: (value: { path: string }) => void;
      const upload = vi.spyOn(api, "upload").mockReturnValue(
        new Promise((resolve) => {
          finish = resolve;
        }),
      );
      const wrapper = mount(App);
      try {
        await flushPromises();
        wrapper.findComponent(SessionSidebar).vm.$emit("select", "one");
        await flushPromises();
        const original = latest();
        ready(original, "Saved");
        await flushPromises();
        await wrapper.get("textarea").setValue("Recover this draft");
        // Model the composer send event and its immediate draft clearing.
        // Recovery must repopulate the mounted composer via suggestedPrompt.
        wrapper
          .findComponent(ChatComposer)
          .vm.$emit("send", "Recover this draft", [
            { name: "note.txt", type: "text/plain", data: "data:text/plain;base64,aGk=", size: 2 },
          ]);
        await wrapper.get("textarea").setValue("");
        await flushPromises();
        expect(upload).toHaveBeenCalledOnce();
        expect(wrapper.get(".message.user").text()).toContain("Recover this draft");
        if (interruption === "navigation") {
          wrapper.findComponent(SessionSidebar).vm.$emit("select", "two");
          await flushPromises();
          ready(latest(), "Selected session");
          await flushPromises();
          await wrapper.get("textarea").setValue("New session draft");
        } else if (interruption === "background") {
          vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
          document.dispatchEvent(new Event("visibilitychange"));
        } else {
          vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
          window.dispatchEvent(new Event("offline"));
        }
        finish({ path: "/uploads/note.txt" });
        await flushPromises();
        expect(wrapper.findAll(".message.user")).toHaveLength(0);
        expect((wrapper.get("textarea").element as HTMLTextAreaElement).value).toBe(
          interruption === "navigation" ? "New session draft" : "Recover this draft",
        );
        expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
        if (interruption !== "navigation") {
          expect(wrapper.text()).toContain("Viewer detached before submission");
          expect(nativeOutcome("attachment-test", "one")).toBe(false);
          vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
          vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
          window.dispatchEvent(new Event("online"));
          await flushPromises();
          ready(latest(), "Saved");
          await flushPromises();
          expect((wrapper.get("textarea").element as HTMLTextAreaElement).value).toBe(
            "Recover this draft",
          );
        } else {
          expect(wrapper.text()).toContain("Selected session");
          expect(wrapper.text()).not.toContain("Viewer detached before submission");
        }
        for (const viewer of fake.viewers)
          expect(viewer.rpc).not.toHaveBeenCalledWith("chat.submit", expect.anything());
      } finally {
        wrapper.unmount();
      }
    },
  );
});

describe("selected native session reconstruction", () => {
  it("validates event text before projecting native status and errors", async () => {
    const session = useNativeSession(vi.fn());
    const opening = session.attach("alpha", "one");
    const viewer = latest();
    ready(viewer, "Saved");
    await opening;
    viewer.hooks.event({ type: "tool.generating", payload: { name: {} } });
    expect(session.status.value).toBe("Preparing tool");
    viewer.hooks.event({ type: "thinking.delta", payload: { text: {} } });
    expect(session.status.value).toBe("Working…");
    viewer.hooks.event({ type: "status.update", payload: { text: "Running" } });
    expect(session.status.value).toBe("Running");
    viewer.hooks.event({ type: "status.update", payload: { text: {} } });
    expect(session.status.value).toBe("");
    viewer.hooks.event({ type: "message.complete", payload: { status: "failed", error: {} } });
    expect(session.error.value).toBe("Response failed");
    viewer.hooks.event({
      type: "message.complete",
      payload: { status: "failed", error: "Tool failed" },
    });
    expect(session.error.value).toBe("Tool failed");
    session.close();
  });
  it.each(["background", "offline"])(
    "rejects preparation interrupted by %s and retires only its optimistic input",
    async (interruption) => {
      const session = useNativeSession(vi.fn());
      const opening = session.attach("alpha", "one");
      const original = latest();
      ready(original, "Saved");
      await opening;
      let finish!: (value: string) => void;
      const preparation = new Promise<string>((resolve) => {
        finish = resolve;
      });
      const sending = session.submit("Draft", () => preparation, {}, [
        { type: "text", text: "Draft" },
      ]);
      const rejected = expect(sending).rejects.toMatchObject({ outcome: "rejected" });
      expect(session.messages.value).toHaveLength(2);
      expect(session.uncertain.value).toBe(true);
      await session.availability(interruption !== "background", interruption !== "offline");
      expect(session.messages.value).toHaveLength(2);
      finish("Prepared attachment");
      await rejected;
      expect(original.rpc).not.toHaveBeenCalled();
      expect(session.messages.value.map((row) => row.content)).toEqual(["Saved"]);
      expect(session.busy.value).toBe(false);
      expect(session.uncertain.value).toBe(false);
      expect(nativeOutcome("alpha", "one")).toBe(false);
      const recovery = session.availability(true, true);
      ready(latest(), "Saved");
      await recovery;
      for (const viewer of fake.viewers) expect(viewer.rpc).not.toHaveBeenCalled();
      session.close();
    },
  );

  it("does not let stale preparation settle a newly selected attempt", async () => {
    const session = useNativeSession(vi.fn());
    const opening = session.attach("alpha", "one");
    const original = latest();
    ready(original, "Saved");
    await opening;
    let finish!: () => void;
    const old = session.submit(
      "Old",
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
      {},
    );
    const rejected = expect(old).rejects.toMatchObject({ outcome: "rejected" });
    session.close();
    // Returning to the same IDs must still count as a new selection.
    const replacement = session.attach("alpha", "one");
    ready(latest(), "New selection");
    await replacement;
    expect(session.uncertain.value).toBe(true);
    finish();
    await rejected;
    expect(original.rpc).not.toHaveBeenCalled();
    expect(session.messages.value.map((row) => row.content)).toEqual(["New selection"]);
    expect(session.uncertain.value).toBe(true);
    session.close();
  });

  it("keeps another attempt locked when pre-dispatch preparation rejects", async () => {
    const session = useNativeSession(vi.fn());
    const opening = session.attach("alpha", "one");
    ready(latest(), "Saved");
    await opening;
    let finish!: () => void;
    const sending = session.submit(
      "Draft",
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
      {},
    );
    const rejected = expect(sending).rejects.toMatchObject({ outcome: "rejected" });
    uncertainNativeOutcome("alpha", "one");
    await session.availability(false, true);
    finish();
    await rejected;
    expect(session.uncertain.value).toBe(true);
    expect(nativeOutcome("alpha", "one")).toBe(true);
    session.close();
  });

  it("preserves the new session's ambiguous submission when old preparation finishes", async () => {
    const session = useNativeSession(vi.fn());
    const opening = session.attach("alpha", "one");
    ready(latest(), "Saved");
    await opening;
    let finish!: () => void;
    const old = session.submit(
      "Old",
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
      {},
    );
    const rejected = expect(old).rejects.toMatchObject({ outcome: "rejected" });
    const replacement = session.attach("beta", "two");
    ready(latest(), "New selection");
    await replacement;
    latest().rpc.mockRejectedValue(new NativeError("Lost acknowledgement"));
    await expect(session.submit("New", "New", {})).rejects.toThrow("Lost acknowledgement");
    finish();
    await rejected;
    expect(session.messages.value.map((row) => row.content)).toEqual(["New selection", "New"]);
    expect(session.uncertain.value).toBe(true);
    expect(session.busy.value).toBe(true);
    expect(nativeOutcome("beta", "two")).toBe(true);
    expect(nativeOutcome("alpha", "one")).toBe(false);
    expect(latest().rpc).toHaveBeenCalledOnce();
    session.close();
  });

  it.each(["accepted", "unknown"])(
    "keeps a dispatched %s turn through backgrounding",
    async (outcome) => {
      const session = useNativeSession(vi.fn());
      const opening = session.attach("alpha", "one");
      ready(latest(), "Saved");
      await opening;
      let finish!: () => void;
      latest().rpc.mockImplementation(
        () =>
          new Promise<void>((resolve, reject) => {
            finish = () =>
              outcome === "accepted" ? resolve() : reject(new NativeError("Lost acknowledgement"));
          }),
      );
      const sending = session.submit("Submitted", "Submitted", {});
      const result =
        outcome === "accepted" ? sending : expect(sending).rejects.toThrow("Lost acknowledgement");
      await session.availability(false, true);
      finish();
      await result;
      expect(latest().rpc).toHaveBeenCalledOnce();
      expect(session.messages.value.map((row) => row.content)).toEqual(["Saved", "Submitted"]);
      expect(session.uncertain.value).toBe(true);
      expect(session.busy.value).toBe(true);
      session.close();
    },
  );
  it("suppresses hidden activation and deduplicates foreground, online, and retry signals", async () => {
    const session = useNativeSession(vi.fn());
    await session.availability(false, true);
    await session.attach("alpha", "one");
    await session.reconnect();
    expect(fake.viewers).toHaveLength(0);
    const opening = session.availability(true, true);
    const repeat = session.reconnect();
    void session.availability(true, true);
    expect(repeat).toBe(opening);
    expect(fake.viewers).toHaveLength(1);
    expect(session.connection.value).toBe("reconnecting");
    ready(latest(), "Saved");
    await opening;
    await session.attach("alpha", "one");
    expect(fake.viewers).toHaveLength(1);
    session.close();
  });

  it("keeps the old transcript and approvals read-only until replay and buffered events commit", async () => {
    const session = useNativeSession(vi.fn());
    const opening = session.attach("alpha", "one");
    const original = latest();
    ready(original, "Saved");
    await opening;
    original.hooks.requests([{ id: "old", method: "approval", params: {} }]);
    await session.availability(false, true);
    expect(original.close).toHaveBeenCalledOnce();
    expect(session.connection.value).toBe("stale");
    await expect(session.submit("No", "No", {})).rejects.toMatchObject({ outcome: "rejected" });
    expect(() => session.stop()).toThrow("read-only");
    expect(() => session.steer("No")).toThrow("read-only");
    expect(() => session.answer("old", {})).toThrow("read-only");
    const flight = session.availability(true, true);
    const replacement = latest();
    replacement.hooks.snapshot(snapshot("Fresh", true));
    replacement.hooks.input("Question", false);
    replacement.hooks.event({ type: "tool.start", payload: { tool_id: "call", name: "terminal" } });
    replacement.hooks.event({
      type: "tool.progress",
      payload: { tool_id: "call", text: "arriving" },
    });
    replacement.hooks.event({ type: "message.delta", payload: { text: "Buffered" } });
    replacement.hooks.requests([{ id: "new", method: "approval", params: {} }]);
    expect(session.messages.value.map((row) => row.content)).toEqual(["Saved"]);
    expect(session.approval.value?.request_id).toBe("old");
    expect(session.loading.value).toBe(false);
    replacement.hooks.recovered();
    replacement.finish();
    await flight;
    expect(session.messages.value.map((row) => row.content)).toEqual(["Fresh", "Question"]);
    expect(session.messages.value[1]!.blocks).toEqual([
      expect.objectContaining({ kind: "tool", id: "call", complete: false, output: "arriving" }),
      expect.objectContaining({ kind: "text", content: "Buffered" }),
    ]);
    expect(session.approval.value?.request_id).toBe("new");
    expect(session.busy.value).toBe(true);
    expect(session.connection.value).toBe("ready");
    for (const viewer of fake.viewers) expect(viewer.rpc).not.toHaveBeenCalled();
    session.close();
  });

  it("discards a failed reconstruction, preserves history, and allows explicit retry", async () => {
    const session = useNativeSession(vi.fn());
    const opening = session.attach("alpha", "one");
    ready(latest(), "Saved");
    await opening;
    await session.availability(true, false);
    const flight = session.availability(true, true);
    latest().hooks.snapshot(snapshot("Incomplete"));
    latest().fail(new Error("Replay unavailable"));
    await flight;
    expect(session.messages.value[0]?.content).toBe("Saved");
    expect(session.connection.value).toBe("stale");
    expect(session.error.value).toContain("Retry");
    await session.availability(true, true);
    expect(fake.viewers).toHaveLength(2);
    const retry = session.reconnect();
    ready(latest(), "Restored");
    await retry;
    expect(session.messages.value[0]?.content).toBe("Restored");
    session.close();
  });

  it("supersedes navigation and backgrounded attempts and ignores their late callbacks", async () => {
    const session = useNativeSession(vi.fn());
    const first = session.attach("alpha", "one");
    const obsolete = latest();
    const second = session.attach("beta", "two");
    const hidden = latest();
    expect(obsolete.close).toHaveBeenCalledOnce();
    await session.availability(false, true);
    ready(obsolete, "Wrong profile");
    ready(hidden, "Hidden attempt");
    await Promise.all([first, second]);
    expect(session.messages.value).toEqual([]);
    expect(session.connection.value).toBe("stale");
    const foreground = session.availability(true, true);
    expect(latest()).toMatchObject({ profile: "beta", stored: "two" });
    ready(latest(), "Selected session");
    await foreground;
    expect(session.messages.value[0]?.content).toBe("Selected session");
    session.close();
  });

  it("reconstructs once after a visible socket failure and stops retrying if that attempt fails", async () => {
    const session = useNativeSession(vi.fn());
    const opening = session.attach("alpha", "one");
    ready(latest(), "Saved");
    await opening;
    latest().hooks.connection("closed");
    await Promise.resolve();
    expect(fake.viewers).toHaveLength(2);
    latest().hooks.connection("closed");
    latest().fail(new Error("Offline"));
    await Promise.resolve();
    await Promise.resolve();
    expect(fake.viewers).toHaveLength(2);
    expect(session.messages.value[0]?.content).toBe("Saved");
    expect(session.connection.value).toBe("stale");
    session.close();
  });
});
