// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { defineComponent, h, ref } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { provideChat } from "../context";
import LiveRequest from "../components/LiveRequest.vue";
import { api } from "../../../services/hermes-api";
import { useChatController } from "./useChatController";
import { useNativeSession } from "../runtime/native-session";
function setup() {
  const native = useNativeSession(() => {});
  native.connection.value = "ready";
  const scope = {
    profile: ref("alpha"),
    session: ref("one"),
    messages: ref([]),
    chatLoading: ref(false),
    chatError: ref(""),
    canStream: ref(true),
    composerBlocked: ref(false),
    projectView: ref(false),
    selectedProject: ref(undefined),
    creating: ref(false),
    offline: ref(false),
    models: ref([]),
    providers: ref([]),
    modelsLoading: ref(false),
    model: ref(""),
    provider: ref(""),
    defaultModel: ref("default"),
    suggestedPrompt: ref(""),
    generationRef: ref(0),
    settings: ref(),
    generation: () => generation,
    navigation: vi.fn(() => "/"),
    connection: ref("stale"),
    createSession: vi.fn(async () => "one"),
    suggest: vi.fn(async () => {}),
    retryHistory: vi.fn(async () => {}),
    openBranch: vi.fn(async (_id: string) => {}),
  };
  let generation = 0;
  const controller = useChatController(native, scope);
  return {
    native,
    scope,
    controller,
    switchScope: () => {
      generation++;
      scope.profile.value = "beta";
      scope.session.value = "two";
    },
  };
}

type Envelope = { id: string; method: string; params: Record<string, unknown> };
const approval = (id: string): Envelope => ({
  id,
  method: "approval",
  params: {
    session_id: "runtime",
    profile: "alpha",
    command: "child-operation",
    choices: ["once", "deny"],
  },
});

async function harness(initial: Envelope[]) {
  const sockets: Socket[] = [];
  const sent: { id: string; method?: string; result?: { choice?: string } }[] = [];
  let running = true;
  let open = initial;
  let holdResume = false;
  let releaseResume: (() => void) | undefined;
  const resumes: { running: boolean; open_requests: Envelope[] }[] = [];
  class Socket {
    static OPEN = 1;
    readyState = 1;
    onopen?: () => void;
    onmessage?: (event: { data: string }) => void;
    onclose?: () => void;
    onerror?: () => void;
    constructor() {
      sockets.push(this);
      queueMicrotask(() => this.onopen?.());
    }
    frame(frame: unknown) {
      this.onmessage?.({ data: JSON.stringify(frame) });
    }
    send(text: string) {
      const f = JSON.parse(text);
      sent.push(f);
      if (!f.method) {
        open = open.filter((r) => r.id !== f.id);
        return;
      }
      const result = ["session.resume", "session.activate"].includes(f.method)
        ? {
            session_id: "runtime",
            messages: [],
            info: {},
            running,
            queued: false,
            open_requests: open.map((r) => ({ jsonrpc: "2.0", ...r })),
          }
        : {};
      const reply = () => this.frame({ jsonrpc: "2.0", id: f.id, result });
      if (f.method === "session.resume") {
        resumes.push({ running, open_requests: open });
        if (holdResume) {
          releaseResume = reply;
          return;
        }
      }
      queueMicrotask(reply);
    }
    close() {
      this.readyState = 3;
    }
  }
  vi.stubGlobal("WebSocket", Socket);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ ticket: "synthetic-ticket" }))),
  );
  vi.spyOn(api, "messages").mockResolvedValue([]);
  vi.spyOn(api, "latestMessages").mockResolvedValue({
    messages: [],
    nextOffset: 0,
    hasMore: false,
  });
  const state = setup();
  const wrapper = mount(
    defineComponent({
      setup() {
        provideChat({ ...state.controller, sessions: ref([]) });
        return () => h(LiveRequest);
      },
    }),
  );
  const event = (type: string, payload: unknown) =>
    sockets.at(-1)!.frame({
      jsonrpc: "2.0",
      method: "event",
      params: { session_id: "runtime", profile: "alpha", type, payload },
    });
  await state.native.attach("alpha", "one");
  await flushPromises();
  return {
    ...state,
    wrapper,
    sent,
    sockets,
    resumes,
    setOpen(requests: Envelope[]) {
      open = requests;
    },
    holdResume() {
      holdResume = true;
    },
    releaseResume() {
      expect(releaseResume).toBeTypeOf("function");
      holdResume = false;
      releaseResume!();
      releaseResume = undefined;
    },
    async complete() {
      running = false;
      event("message.complete", { text: "Parent complete", status: "complete" });
      await flushPromises();
      expect(state.native.busy.value).toBe(false);
    },
    async cancel(id: string, reason: string) {
      open = open.filter((r) => r.id !== id);
      event("request.cancel", { id, reason });
      await flushPromises();
    },
    incoming(r: Envelope) {
      sockets.at(-1)!.frame({ jsonrpc: "2.0", ...r });
    },
    cleanup() {
      wrapper.unmount();
      state.native.close();
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    },
  };
}

describe("independent pending child requests", () => {
  it.each(["once", "deny"] as const)(
    "keeps an approval actionable after completion, hydration and idle reconnect: %s",
    async (choice) => {
      const h = await harness([approval("child-exact-envelope")]);
      try {
        expect(h.wrapper.findAll("button")).toHaveLength(2);
        await h.complete();
        await h.native.hydrate();
        const originalSocket = h.sockets[0]!;
        await h.native.availability(true, false);
        await flushPromises();
        expect(originalSocket.readyState).toBe(3);
        expect(h.native.connection.value).toBe("stale");
        expect(h.wrapper.findAll("button")).toHaveLength(2);
        expect(h.wrapper.findAll("button").every((b) => b.element.matches(":disabled"))).toBe(true);
        h.holdResume();
        const recovery = h.native.availability(true, true);
        expect(h.native.reconnect()).toBe(recovery);
        await flushPromises();
        expect(h.sockets).toHaveLength(2);
        expect(h.sockets[1]).not.toBe(originalSocket);
        expect(h.sent.filter((f) => f.method === "session.resume")).toHaveLength(2);
        expect(h.resumes.at(-1)).toEqual({
          running: false,
          open_requests: [approval("child-exact-envelope")],
        });
        expect(h.native.connection.value).toBe("reconnecting");
        expect(h.wrapper.findAll("button")).toHaveLength(2);
        expect(h.wrapper.findAll("button").every((b) => b.element.matches(":disabled"))).toBe(true);
        await h.controller.actions.answerFor("child-exact-envelope")({ choice });
        expect(h.sent.filter((f) => !f.method)).toEqual([]);
        h.releaseResume();
        await recovery;
        await flushPromises();
        expect(h.native.connection.value).toBe("ready");
        expect(h.native.busy.value).toBe(false);
        expect(h.native.requests.value.map((r) => r.id)).toEqual(["child-exact-envelope"]);
        const buttons = h.wrapper.findAll("button");
        expect(buttons.map((b) => b.text())).toEqual(["Allow once", "Deny"]);
        expect(buttons.every((b) => b.attributes("disabled") === undefined)).toBe(true);
        await buttons[choice === "once" ? 0 : 1]!.trigger("click");
        expect(h.sent.filter((f) => f.id === "child-exact-envelope")).toEqual([
          { jsonrpc: "2.0", id: "child-exact-envelope", result: { choice } },
        ]);
        expect(h.native.requests.value).toEqual([]);
        expect(h.wrapper.text()).toBe("");
      } finally {
        h.cleanup();
      }
    },
  );

  it.each(["timeout", "session_closed", "resolved", "cancelled"])(
    "withdraws only the canceled request (%s), never answers the next envelope with a stale callback",
    async (reason) => {
      const h = await harness([approval("first"), approval("second")]);
      try {
        await h.complete();
        const stale = h.controller.actions.answerFor("first");
        await h.cancel("second", reason);
        expect(h.controller.view.request.value?.id).toBe("first");
        h.incoming(approval("second"));
        await flushPromises();
        await h.cancel("first", reason);
        expect(h.controller.view.request.value?.id).toBe("second");
        await stale({ choice: "once" });
        expect(h.sent.filter((f) => !f.method)).toEqual([]);
        await h.wrapper.get("button:last-child").trigger("click");
        expect(h.sent.filter((f) => !f.method)).toEqual([
          { jsonrpc: "2.0", id: "second", result: { choice: "deny" } },
        ]);
      } finally {
        h.cleanup();
      }
    },
  );

  it.each(["approval", "clarify", "secret"])(
    "preserves safe disabled states and exact replies for idle %s",
    async (kind) => {
      const r =
        kind === "approval"
          ? approval("request")
          : {
              id: "request",
              method: kind,
              params: {
                session_id: "runtime",
                profile: "alpha",
                ...(kind === "clarify"
                  ? { questions: [{ qid: "q", question: "Choose", choices: ["Yes"] }] }
                  : { prompt: "Test-only secret", env_var: "SYNTHETIC_TEST_VALUE" }),
              },
            };
      const h = await harness([r]);
      try {
        await h.complete();
        const answer =
          kind === "approval"
            ? { choice: "once" as const }
            : kind === "clarify"
              ? { answers: { q: "Yes" } }
              : { value: "synthetic-value" };
        for (const disabled of ["offline", "reconnecting", "unavailable"]) {
          h.scope.offline.value = disabled === "offline";
          h.native.connection.value = disabled === "reconnecting" ? "reconnecting" : "ready";
          h.scope.canStream.value = disabled !== "unavailable";
          await flushPromises();
          expect(h.wrapper.findAll("button").every((b) => b.element.matches(":disabled"))).toBe(
            true,
          );
          await h.controller.actions.answerFor("request")(answer);
          expect(h.sent.filter((f) => !f.method)).toEqual([]);
        }
        h.scope.canStream.value = true;
        await flushPromises();
        if (kind === "approval") await h.wrapper.get("button").trigger("click");
        else {
          await h.wrapper.get("input").setValue(kind === "secret" ? "synthetic-value" : "Yes");
          if (kind === "secret") expect(h.wrapper.get("input").attributes("type")).toBe("password");
          await h.wrapper.get("form").trigger("submit");
        }
        expect(h.sent.filter((f) => !f.method)).toEqual([
          { jsonrpc: "2.0", id: "request", result: answer },
        ]);
        expect(h.wrapper.text()).not.toContain("synthetic-value");
        expect(h.wrapper.find("input").exists()).toBe(false);
      } finally {
        h.cleanup();
      }
    },
  );

  it("rejects foreign profile/session requests, old scope callbacks and teardown replies", async () => {
    const h = await harness([approval("same-id")]);
    try {
      await h.complete();
      h.incoming({
        ...approval("foreign-profile"),
        params: { ...approval("").params, profile: "beta" },
      });
      h.incoming({
        ...approval("foreign-session"),
        params: { ...approval("").params, session_id: "elsewhere" },
      });
      await flushPromises();
      expect(h.native.requests.value.map((r) => r.id)).toEqual(["same-id"]);
      const stale = h.controller.actions.answerFor("same-id");
      h.switchScope();
      const replacement = {
        ...approval("same-id"),
        params: { ...approval("").params, profile: "beta" },
      };
      h.setOpen([replacement]);
      await h.native.attach("beta", "two");
      await flushPromises();
      expect(h.native.connection.value).toBe("ready");
      expect(h.native.requests.value).toEqual([replacement]);
      expect(h.controller.view.request.value?.id).toBe("same-id");
      expect(h.wrapper.findAll("button")).toHaveLength(2);
      expect(h.wrapper.findAll("button").every((b) => !b.element.matches(":disabled"))).toBe(true);
      await stale({ choice: "once" });
      expect(h.sent.filter((f) => !f.method)).toEqual([]);
      expect(h.native.requests.value).toEqual([replacement]);
      await h.controller.actions.answerFor("same-id")({ choice: "deny" });
      const replies = [{ jsonrpc: "2.0", id: "same-id", result: { choice: "deny" } }];
      expect(h.sent.filter((f) => !f.method)).toEqual(replies);
      expect(h.native.requests.value).toEqual([]);
      h.incoming({ ...replacement, id: "teardown" });
      await flushPromises();
      expect(h.controller.view.request.value?.id).toBe("teardown");
      const teardown = h.controller.actions.answerFor("teardown");
      h.native.close();
      await teardown({ choice: "once" });
      await flushPromises();
      expect(h.wrapper.text()).toBe("");
      expect(h.sent.filter((f) => !f.method)).toEqual(replies);
    } finally {
      h.cleanup();
    }
  });
});

it.each(["approval", "clarify", "secret"])(
  "blocks duplicate idle %s submissions and isolates late failures from the next request",
  async (kind) => {
    const h = await harness([
      {
        id: "first",
        method: kind,
        params: {
          session_id: "runtime",
          profile: "alpha",
          command: "child-operation",
          choices: ["once", "deny"],
          questions: [{ qid: "q", question: "Choose" }],
          prompt: "Test secret",
          env_var: "SYNTHETIC_VALUE",
        },
      },
    ]);
    try {
      await h.complete();
      let reject!: (error: Error) => void;
      const answer = vi.spyOn(h.native, "answer").mockImplementation(
        () =>
          new Promise<void>((_resolve, fail) => {
            reject = fail;
          }),
      );
      if (kind !== "approval") await h.wrapper.get("input").setValue("synthetic-draft");
      const submit = () =>
        kind === "approval"
          ? h.wrapper.get("button").trigger("click")
          : h.wrapper.get("form").trigger("submit");
      await submit();
      await submit();
      expect(answer).toHaveBeenCalledTimes(1);
      expect(h.wrapper.findAll("button").every((b) => b.element.matches(":disabled"))).toBe(true);
      if (kind === "secret")
        expect((h.wrapper.get("input").element as HTMLInputElement).value).toBe("");
      if (kind === "clarify")
        expect((h.wrapper.get("input").element as HTMLInputElement).value).toBe("synthetic-draft");
      h.incoming(approval("next"));
      await h.cancel("first", "timeout");
      reject(new Error("private backend detail synthetic-draft"));
      await flushPromises();
      expect(h.native.error.value).toBe("");
      expect(h.controller.view.request.value?.id).toBe("next");
      expect(h.wrapper.text()).not.toContain("synthetic-draft");
      expect(h.wrapper.get("button").element.matches(":disabled")).toBe(false);
    } finally {
      h.cleanup();
    }
  },
);
