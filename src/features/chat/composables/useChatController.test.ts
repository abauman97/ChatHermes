// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { defineComponent, h, ref } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { provideChat } from "../context";
import ChatInterface from "../components/ChatInterface.vue";
import { api } from "../../../services/hermes-api";
import { useChatController } from "./useChatController";
import { useNativeSession } from "../runtime/native-session";
import { NativeGatewayViewer } from "../runtime/native-gateway";
import type { Project } from "../../../types/hermes";
function setup() {
  const native = useNativeSession(() => {});
  native.connection.value = "ready";
  native.settings.value = {
    profile: "alpha",
    session: "one",
    info: {},
    generation: native.generationRef.value,
  };
  const scope = {
    profile: ref("alpha"),
    session: ref("one"),
    messages: ref([]),
    chatLoading: ref(false),
    chatError: ref(""),
    canStream: ref(true),
    composerBlocked: ref(false),
    projectView: ref(false),
    selectedProject: ref<Project>(),
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
  function request(id = "request") {
    native.requests.value = [
      { id, method: "clarify", params: { questions: [{ qid: "q", question: "Choose" }] } },
    ];
  }
  return {
    native,
    scope,
    controller,
    request,
    switchScope: () => {
      generation++;
      scope.profile.value = "beta";
    },
  };
}
describe("live chat controller", () => {
  it("renders raw session RPC results through the active scope and composer click", async () => {
    const usage = {
      model: "qwen3.8:27b",
      context_used: 14584,
      context_max: 131072,
      context_percent: 11,
      calls: 1,
    };
    const breakdown = {
      model: usage.model,
      categories: [
        { id: "system_prompt", label: "System prompt", tokens: 1200, color: "var(--system)" },
      ],
    };
    const sent: { id: string; method: string; params: Record<string, unknown> }[] = [];
    let holdBreakdown = false;
    const delayed: (() => void)[] = [];
    class Socket {
      static OPEN = 1;
      readyState = 1;
      onopen?: () => void;
      onmessage?: (event: { data: string }) => void;
      onclose?: () => void;
      onerror?: () => void;
      constructor() {
        queueMicrotask(() => this.onopen?.());
      }
      send(text: string) {
        const frame = JSON.parse(text);
        sent.push(frame);
        const result =
          frame.method === "session.resume"
            ? {
                session_id: "runtime",
                messages: [],
                info: { model: usage.model },
                recovery: { epoch: "epoch", through: 0, complete: true, base_row_ids: [] },
              }
            : frame.method === "session.usage"
              ? usage
              : frame.method === "session.context_breakdown"
                ? breakdown
                : { settled: false };
        const reply = () =>
          this.onmessage?.({ data: JSON.stringify({ jsonrpc: "2.0", id: frame.id, result }) });
        if (holdBreakdown && frame.method === "session.context_breakdown") delayed.push(reply);
        else queueMicrotask(reply);
      }
      close() {
        this.readyState = 3;
      }
    }
    vi.stubGlobal("WebSocket", Socket);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ticket: "test-ticket" }))),
    );
    const messages = vi.spyOn(api, "messages").mockResolvedValue([]);
    const { native, controller } = setup();
    const wrapper = mount(
      defineComponent({
        setup() {
          provideChat({ ...controller, sessions: ref([]) });
          return () => h(ChatInterface, { showChat: true });
        },
      }),
    );
    try {
      await native.attach("alpha", "one");
      await flushPromises();
      // The real request channel resolves frame.result into the active session refs.
      expect(controller.view.contextUsage.value).toEqual(usage);
      const meter = wrapper.get(".context-meter");
      await meter.trigger("click");
      await flushPromises();
      expect(controller.view.contextBreakdown.value).toEqual(breakdown);
      expect(
        sent
          .filter((frame) => ["session.usage", "session.context_breakdown"].includes(frame.method))
          .map((frame) => frame.params),
      ).toEqual(Array(2).fill({ session_id: "runtime", profile: "alpha" }));
      expect(meter.attributes("aria-label")).toBe("Context 11 percent used");
      const panel = wrapper.get(".context-panel");
      expect(panel.text()).toContain("qwen3.8:27b");
      expect(panel.text()).toContain("14,584 / 131,072 tokens");
      expect(panel.text()).toContain("System prompt");
      expect(panel.text()).toContain("1,200 tokens");
      expect(panel.text()).not.toContain("unavailable");
      // A late result from the previous profile/session cannot refill the new scope.
      holdBreakdown = true;
      native.setContextOpen(true);
      await flushPromises();
      expect(delayed).toHaveLength(1);
      await native.attach("beta", "two");
      delayed[0]!();
      await flushPromises();
      expect(controller.view.contextBreakdown.value).toBeNull();
    } finally {
      wrapper.unmount();
      native.close();
      messages.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it.each(["blocked route", "history loading", "reconnecting"])(
    "does not submit or create while the composer is gated by %s",
    async (state) => {
      const { native, scope, controller } = setup();
      const submit = vi.spyOn(native, "submit");
      if (state === "blocked route") scope.composerBlocked.value = true;
      else if (state === "history loading") native.loading.value = true;
      else native.connection.value = "reconnecting";
      await controller.actions.send("Cannot send here");
      expect(submit).not.toHaveBeenCalled();
      expect(scope.createSession).not.toHaveBeenCalled();
    },
  );
  it("keeps projections reactive and model commands affect native submission", async () => {
    const { native, scope, controller } = setup();
    native.submit = vi.fn(async () => {});
    expect(controller.composer.value.disabled).toBe(false);
    scope.modelsLoading.value = true;
    expect(controller.composer.value.disabled).toBe(true);
    scope.modelsLoading.value = false;
    controller.actions.setProvider("custom");
    controller.actions.setModel("selected");
    await controller.actions.send("Hello");
    expect(native.submit).toHaveBeenCalledWith(
      "Hello",
      expect.any(Function),
      { model: "selected", provider: "custom" },
      [{ type: "text", text: "Hello" }],
    );
    controller.actions.setModel("");
    await controller.actions.send("Default");
    expect(native.submit).toHaveBeenLastCalledWith(
      "Default",
      expect.any(Function),
      { model: "default", provider: "custom" },
      expect.any(Array),
    );
  });
  it("restores resumed runtime choices and submits them instead of profile defaults", async () => {
    const { native, scope, controller } = setup();
    native.submit = vi.fn(async () => {});
    native.settings.value = {
      profile: "alpha",
      session: "one",
      info: { model: "saved-model", provider: "saved-provider", reasoning_effort: "none" },
      generation: native.generationRef.value,
    };
    expect(controller.scope.model.value).toBe("saved-model");
    expect(controller.scope.provider.value).toBe("saved-provider");
    expect(controller.scope.reasoningEffort.value).toBe("none");
    // Inventory may finish after the session snapshot.
    scope.provider.value = "profile-provider";
    scope.defaultModel.value = "profile-model";
    await controller.actions.send("Continue");
    expect(native.submit).toHaveBeenLastCalledWith(
      "Continue",
      expect.any(Function),
      { model: "saved-model", provider: "saved-provider", reasoning_effort: "none" },
      expect.any(Array),
    );
    controller.actions.setModel("pending-model");
    controller.actions.setProvider("pending-provider");
    controller.actions.setReasoningEffort("low");
    native.settings.value = {
      ...native.settings.value,
      info: { model: "saved-model", provider: "saved-provider", reasoning_effort: "high" },
      generation: native.generationRef.value,
    };
    expect(controller.scope.model.value).toBe("pending-model");
    expect(controller.scope.reasoningEffort.value).toBe("low");
    controller.actions.setReasoningEffort("");
    expect(controller.scope.reasoningEffort.value).toBe("");
    scope.session.value = "two";
    expect(controller.scope.model.value).toBe("");
    expect(controller.scope.provider.value).toBe("profile-provider");
    expect(controller.scope.reasoningEffort.value).toBe("");
    scope.session.value = "one";
    scope.profile.value = "beta";
    expect(controller.scope.model.value).toBe("");
    expect(controller.scope.reasoningEffort.value).toBe("");
    scope.profile.value = "alpha";
    expect(controller.scope.model.value).toBe("pending-model");
    expect(controller.scope.provider.value).toBe("pending-provider");
  });
  it("transfers a home model choice to its new chat and leaves the next home at defaults", async () => {
    const { native, scope, controller } = setup();
    native.submit = vi.fn(async () => {});
    scope.session.value = "";
    controller.actions.setModel("draft-model");
    controller.actions.setProvider("draft-provider");
    scope.createSession.mockImplementation(async () => {
      scope.session.value = "created";
      native.settings.value = {
        profile: "alpha",
        session: "created",
        info: { model: "profile-model", reasoning_effort: "medium" },
        generation: native.generationRef.value,
      };
      return "created";
    });
    await controller.actions.send("Create");
    expect(native.submit).toHaveBeenLastCalledWith(
      "Create",
      expect.any(Function),
      { model: "draft-model", provider: "draft-provider" },
      expect.any(Array),
    );
    scope.session.value = "";
    expect(controller.scope.model.value).toBe("");
    expect(controller.scope.provider.value).toBe("");
  });
  it("keeps reasoning choices isolated by profile and session, and captures the send choice", async () => {
    const { native, scope, controller } = setup();
    native.submit = vi.fn(async () => {});
    controller.actions.setReasoningEffort("high");
    scope.session.value = "two";
    expect(controller.scope.reasoningEffort.value).toBe("");
    controller.actions.setReasoningEffort("low");
    scope.profile.value = "beta";
    expect(controller.scope.reasoningEffort.value).toBe("");
    scope.profile.value = "alpha";
    scope.session.value = "one";
    expect(controller.scope.reasoningEffort.value).toBe("high");
    await controller.actions.send("Reason");
    expect(native.submit).toHaveBeenCalledWith(
      "Reason",
      expect.any(Function),
      { model: "default", provider: undefined, reasoning_effort: "high" },
      expect.any(Array),
    );
    controller.actions.setReasoningEffort("");
    expect(controller.scope.reasoningEffort.value).toBe("");
  });
  it("transfers a home reasoning choice only to the created chat", async () => {
    const { native, scope, controller } = setup();
    native.submit = vi.fn(async () => {});
    scope.session.value = "";
    controller.actions.setReasoningEffort("ultra");
    scope.createSession.mockImplementation(async () => {
      scope.session.value = "created";
      return "created";
    });
    await controller.actions.send("New chat");
    expect(controller.scope.reasoningEffort.value).toBe("ultra");
    expect(native.submit).toHaveBeenCalledWith(
      "New chat",
      expect.any(Function),
      expect.objectContaining({ reasoning_effort: "ultra" }),
      expect.any(Array),
    );
    scope.session.value = "";
    expect(controller.scope.reasoningEffort.value).toBe("");
  });
  it("does not transfer reasoning or submit after profile changes during creation", async () => {
    const { native, scope, controller } = setup();
    native.submit = vi.fn(async () => {});
    scope.session.value = "";
    controller.actions.setReasoningEffort("high");
    scope.createSession.mockImplementation(async () => {
      scope.profile.value = "beta";
      scope.session.value = "foreign";
      return "created";
    });
    await controller.actions.send("Old draft");
    expect(controller.scope.reasoningEffort.value).toBe("");
    expect(native.submit).not.toHaveBeenCalled();
  });
  it("rejects callbacks captured in an old scope even when request IDs repeat", async () => {
    const { native, controller, request, switchScope } = setup();
    native.answer = vi.fn(async () => {});
    request();
    const old = controller.actions.answerFor("request");
    switchScope();
    request();
    await old({ answers: { q: "Old" } });
    expect(native.answer).not.toHaveBeenCalled();
    await controller.actions.answerFor("request")({ answers: { q: "New" } });
    expect(native.answer).toHaveBeenCalledExactlyOnceWith("request", { answers: { q: "New" } });
  });
  it("does not apply a failed old answer to a replaced request or scope", async () => {
    const { native, controller, request, switchScope } = setup();
    let reject!: (error: Error) => void;
    native.answer = vi.fn(
      () =>
        new Promise<void>((_resolve, failure) => {
          reject = failure;
        }),
    );
    request();
    const pending = controller.actions.answerFor("request")({ answers: { q: "Old" } });
    request("next");
    reject(new Error("private backend detail"));
    await pending;
    expect(native.error.value).toBe("");
    const second = controller.actions.answerFor("next")({ answers: { q: "Next" } });
    switchScope();
    request("next");
    reject(new Error("private backend detail"));
    await second;
    expect(native.error.value).toBe("");
  });
  it("discards a stale attachment upload without writing errors or restoring an old prompt", async () => {
    const { native, controller, switchScope } = setup();
    let uploaded!: (value: { path: string }) => void;
    const upload = vi.spyOn(api, "upload").mockImplementation(
      () =>
        new Promise((resolve) => {
          uploaded = resolve;
        }),
    );
    native.submit = vi.fn(async (_text, content) => {
      await content();
    });
    const pending = controller.actions.send("Old draft", [
      { name: "file.txt", type: "text/plain", data: "data:text/plain;base64,QQ==", size: 1 },
    ]);
    switchScope();
    uploaded({ path: "/uploads/chathermes/synthetic.txt" });
    await pending;
    expect(native.error.value).toBe("");
    expect(controller.scope.suggestedPrompt.value).toBe("");
    expect(upload).toHaveBeenCalledWith("alpha", expect.objectContaining({ name: "file.txt" }));
    upload.mockRestore();
  });
});

it.each(["stop", "steer"] as const)(
  "isolates a late %s failure from the next profile",
  async (operation) => {
    const { native, controller, switchScope } = setup();
    let fail!: (error: Error) => void;
    native[operation] = vi.fn(
      () =>
        new Promise((_resolve, reject) => {
          fail = reject;
        }),
    );
    const pending =
      operation === "stop" ? controller.actions.stop() : controller.actions.steer("guidance");
    switchScope();
    fail(new Error("private backend detail"));
    await pending;
    expect(native.error.value).toBe("");
  },
);

it.each([true, false])("submits every staged upload through MEDIA (staged=%s)", async (staged) => {
  const { native, controller } = setup();
  const upload = vi
    .spyOn(api, "upload")
    .mockResolvedValue({ path: "/home/alpha/uploads/chathermes/input.txt" });
  const attachments = [
    {
      name: "photo.png",
      type: "image/png",
      data: "data:image/png;base64,AA==",
      size: 1,
      path: "/home/alpha/uploads/chathermes/photo.png",
    },
    {
      name: "input.txt",
      type: "text/plain",
      data: "data:text/plain;base64,QQ==",
      size: 1,
      ...(staged ? { path: "/home/alpha/uploads/chathermes/input.txt" } : {}),
    },
  ];
  native.submit = vi.fn(async (_text, content, _options, preview) => {
    const parts = await content();
    for (const file of attachments) {
      const path = file.path || "/home/alpha/uploads/chathermes/input.txt";
      expect(JSON.stringify(parts)).toContain(JSON.stringify(`MEDIA:"${path}"`).slice(1, -1));
      if (file.path)
        expect(JSON.stringify(preview)).toContain(JSON.stringify(`MEDIA:"${path}"`).slice(1, -1));
    }
    expect(parts).toContainEqual({ type: "image_url", image_url: { url: attachments[0]!.data } });
  });
  try {
    await controller.actions.send("Review", attachments);
    expect(native.error.value).toBe("");
    expect(native.submit).toHaveBeenCalledOnce();
    expect(upload).toHaveBeenCalledTimes(staged ? 0 : 1);
  } finally {
    upload.mockRestore();
  }
});

it("branches in the selected scope and ignores a late result after switching profiles", async () => {
  const { scope, controller, switchScope } = setup();
  const branch = vi.spyOn(api, "branch").mockResolvedValue({ id: "child" });
  await controller.actions.branch("42");
  expect(branch).toHaveBeenCalledWith("alpha", "one", "42");
  expect(scope.openBranch).toHaveBeenCalledWith("child");
  scope.openBranch.mockClear();
  let finish!: (result: { id: string }) => void;
  branch.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = controller.actions.branch("42");
  expect(controller.view.branchDisabled.value).toBe(true);
  switchScope();
  finish({ id: "late-child" });
  await pending;
  expect(scope.openBranch).not.toHaveBeenCalled();
  branch.mockRestore();
});

it("does not open a late branch after navigating to another page", async () => {
  const { scope, controller } = setup();
  let finish!: (result: { id: string }) => void;
  const branch = vi.spyOn(api, "branch").mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = controller.actions.branch("42");
  scope.navigation.mockReturnValue("/changed");
  finish({ id: "child" });
  await pending;
  expect(scope.openBranch).not.toHaveBeenCalled();
  branch.mockRestore();
});

it("projects context only for the selected profile/session and keeps usage reactive", () => {
  const { native, scope, controller } = setup();
  native.settings.value = {
    profile: "alpha",
    session: "one",
    info: { model: "saved" },
    generation: native.generationRef.value,
  };
  native.contextUsage.value = { context_percent: 42 };
  expect(controller.view.contextUsage.value?.context_percent).toBe(42);
  native.contextUsage.value = { context_percent: 10 };
  expect(controller.view.contextUsage.value?.context_percent).toBe(10);
  scope.session.value = "two";
  expect(controller.view.contextUsage.value).toBeNull();
  scope.session.value = "one";
  scope.profile.value = "beta";
  expect(controller.view.contextUsage.value).toBeNull();
});

describe("native slash dispatch", () => {
  const catalog = {
    pairs: [
      ["/status", "Status"],
      ["/work", "Skill"],
    ],
    canon: { "/ctx": "/context", "/compact": "/compress" },
    commands: {
      "/status": {},
      "/context": {},
      "/plan": {},
      "/compress": {},
      "/retry": {},
      "/history": {},
      "/moa": {},
      "/reasoning": {},
    },
    skills: { "/work": {} },
  };
  it("preserves the native MoA route through admission, then uses composer choices on the next turn", async () => {
    const { native, controller } = setup();
    controller.actions.setModel("composer-model");
    controller.actions.setProvider("composer-provider");
    controller.actions.setReasoningEffort("low");
    const command = vi
      .spyOn(native, "command")
      .mockImplementation(async (method) =>
        method === "commands.catalog"
          ? catalog
          : { type: "send", message: "MoA task", notice: "MoA queued" },
      );
    const submit = vi.spyOn(native, "submit").mockResolvedValue();
    expect(await controller.actions.send("/moa MoA task")).toBe(true);
    expect(command).toHaveBeenCalledWith("command.dispatch", { name: "moa", arg: "MoA task" });
    expect(submit.mock.calls[0]![2]).toEqual({});
    expect(await (submit.mock.calls[0]![1] as () => Promise<unknown>)()).toBe("MoA task");
    expect(await controller.actions.send("Next turn")).toBe(true);
    expect(submit.mock.calls[1]![2]).toEqual({
      model: "composer-model",
      provider: "composer-provider",
      reasoning_effort: "low",
    });
  });
  it.each(["high", "none", "low --global", "--session ultra", "disabled"])(
    "changes live reasoning for /reasoning %s",
    async (arg) => {
      const { native, controller } = setup();
      controller.actions.setReasoningEffort("medium");
      const value = arg === "disabled" ? "none" : arg.replace(/--\w+/g, "").trim();
      const command = vi
        .spyOn(native, "command")
        .mockImplementation(async (method) =>
          method === "commands.catalog" ? catalog : method === "config.get" ? { value } : {},
        );
      vi.spyOn(native, "refreshCommand").mockResolvedValue();
      expect(await controller.actions.send(`/reasoning ${arg}`)).toBe(true);
      expect(command).toHaveBeenCalledWith("config.set", {
        key: "reasoning",
        value: arg === "disabled" ? "disabled" : value,
        scope: arg.includes("--global") ? "global" : "session",
      });
      expect(command).not.toHaveBeenCalledWith("slash.exec", expect.anything());
      expect(controller.scope.reasoningEffort.value).toBe(value);
    },
  );
  it.each(["", "show", "hide", "full", "clamp"])(
    "retains a pending effort for /reasoning %s",
    async (arg) => {
      const { native, controller } = setup();
      controller.actions.setReasoningEffort("low");
      const command = vi
        .spyOn(native, "command")
        .mockImplementation(async (method) =>
          method === "commands.catalog"
            ? catalog
            : method === "config.get"
              ? { value: "high", display: "show" }
              : {},
        );
      vi.spyOn(native, "refreshCommand").mockResolvedValue();
      expect(await controller.actions.send(`/reasoning${arg ? ` ${arg}` : ""}`)).toBe(true);
      expect(controller.scope.reasoningEffort.value).toBe("low");
      if (!arg) expect(command).not.toHaveBeenCalledWith("config.set", expect.anything());
      expect(command).not.toHaveBeenCalledWith("slash.exec", expect.anything());
    },
  );
  it.each(["reset", "high extra", "--global"])(
    "refuses unsupported reasoning args before mutation: %s",
    async (arg) => {
      const { native, controller } = setup();
      controller.actions.setReasoningEffort("low");
      const command = vi.spyOn(native, "command").mockResolvedValue(catalog);
      expect(await controller.actions.send(`/reasoning ${arg}`)).toBe(false);
      expect(command).toHaveBeenCalledTimes(1);
      expect(controller.scope.reasoningEffort.value).toBe("low");
    },
  );
  it("retains the effort when the live reasoning write cannot be confirmed", async () => {
    const { native, controller } = setup();
    controller.actions.setReasoningEffort("low");
    vi.spyOn(native, "command").mockImplementation(async (method) =>
      method === "commands.catalog" ? catalog : { value: "medium" },
    );
    expect(await controller.actions.send("/reasoning high")).toBe(false);
    expect(controller.scope.reasoningEffort.value).toBe("low");
  });
  it("executes backend reads without creating fake conversation turns", async () => {
    const { native, controller } = setup();
    const command = vi
      .spyOn(native, "command")
      .mockImplementation(async (method) =>
        method === "commands.catalog" ? catalog : { output: "Native status" },
      );
    const submit = vi.spyOn(native, "submit").mockResolvedValue();
    const refresh = vi.spyOn(native, "refreshCommand").mockResolvedValue();
    expect(await controller.actions.send("/status")).toBe(true);
    expect(command).toHaveBeenCalledWith("slash.exec", { command: "status" });
    expect(submit).not.toHaveBeenCalled();
    expect(native.messages.value).toEqual([]);
    expect(controller.view.commandResults.value).toEqual([
      { command: "/status", output: "Native status" },
    ]);
    expect(refresh).toHaveBeenCalledOnce();
  });
  it("keeps an existing session command and results when Project metadata arrives late", async () => {
    const { native, controller, scope } = setup();
    let finish!: (value: object) => void;
    vi.spyOn(native, "command").mockImplementation(async (method) =>
      method === "commands.catalog"
        ? catalog
        : new Promise((resolve) => {
            finish = resolve;
          }),
    );
    vi.spyOn(native, "refreshCommand").mockResolvedValue();
    const sending = controller.actions.send("/status");
    await flushPromises();
    scope.selectedProject.value = {
      id: "late-metadata",
      label: "Project",
      path: "/synthetic/project",
      sessionCount: 1,
      repos: [],
    };
    finish({ output: "Native status" });
    expect(await sending).toBe(true);
    expect(controller.view.commandResults.value).toEqual([
      { command: "/status", output: "Native status" },
    ]);
    scope.selectedProject.value = undefined;
    expect(controller.view.commandResults.value).toHaveLength(1);
  });
  it("still discards draft discovery when its Project changes", async () => {
    const { controller, scope } = setup();
    scope.session.value = "";
    let finish!: (value: object) => void;
    const discover = vi.spyOn(NativeGatewayViewer, "discover").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    try {
      const sending = controller.actions.send("/help");
      await flushPromises();
      scope.selectedProject.value = {
        id: "another-project",
        label: "Project",
        path: "/synthetic/project",
        sessionCount: 0,
        repos: [],
      };
      finish(catalog);
      await sending;
      expect(controller.view.commandResults.value).toEqual([]);
      expect(scope.createSession).not.toHaveBeenCalled();
    } finally {
      discover.mockRestore();
    }
  });
  it.each(["send", "skill"])(
    "keeps %s directives inside native admission with a safe display",
    async (type) => {
      const { native, controller } = setup();
      vi.spyOn(native, "command").mockImplementation(async (method) =>
        method === "commands.catalog"
          ? catalog
          : { type, message: "private skill instructions", display: "/work task" },
      );
      const submit = vi.spyOn(native, "submit").mockResolvedValue();
      expect(await controller.actions.send("/work task")).toBe(true);
      expect(submit).toHaveBeenCalledWith("/work task", expect.any(Function), expect.any(Object), [
        { type: "text", text: "/work task" },
      ]);
      const prepare = submit.mock.calls[0]![1] as () => Promise<unknown>;
      expect(await prepare()).toBe("private skill instructions");
      expect(controller.view.commandResults.value).toEqual([]);
    },
  );
  it("routes retry to the pinned native dispatcher and compression to session.compress", async () => {
    const { native, controller } = setup();
    const command = vi
      .spyOn(native, "command")
      .mockImplementation(async (method) =>
        method === "commands.catalog"
          ? catalog
          : method === "session.compress"
            ? { compressed: false, summary: { headline: "Nothing to compress" } }
            : { type: "send", message: "Previous native prompt" },
      );
    vi.spyOn(native, "submit").mockResolvedValue();
    vi.spyOn(native, "refreshCommand").mockResolvedValue();
    await controller.actions.send("/retry");
    expect(command).toHaveBeenCalledWith("command.dispatch", { name: "retry", arg: "" });
    await controller.actions.send("/compact focus");
    expect(command).toHaveBeenCalledWith("session.compress", { focus_topic: "focus" });
    expect(controller.view.commandResults.value.at(-1)?.output).toBe("Nothing to compress");
  });
  it("refuses unsupported built-ins and never falls through to an agent prompt", async () => {
    const { native, controller, scope } = setup();
    const command = vi.spyOn(native, "command").mockResolvedValue(catalog);
    const submit = vi.spyOn(native, "submit").mockResolvedValue();
    expect(await controller.actions.send("/history")).toBe(false);
    expect(command).toHaveBeenCalledTimes(1);
    expect(scope.createSession).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    expect(controller.view.commandResults.value[0]?.output).toContain("does not support");
  });
  it("does not retry uncertain execution, rejects duplicates and drops late scope results", async () => {
    const { native, controller, switchScope } = setup();
    let finish!: (value: object) => void;
    const command = vi.spyOn(native, "command").mockImplementation(async (method) =>
      method === "commands.catalog"
        ? catalog
        : new Promise((resolve) => {
            finish = resolve;
          }),
    );
    const submit = vi.spyOn(native, "submit").mockResolvedValue();
    const first = controller.actions.send("/work task");
    await flushPromises();
    expect(await controller.actions.send("/work task")).toBe(false);
    switchScope();
    finish({ type: "send", message: "Must never cross profiles" });
    await first;
    expect(submit).not.toHaveBeenCalled();
    expect(controller.view.commandResults.value).toEqual([]);
    expect(command).toHaveBeenCalledTimes(2);
  });
  it("keeps discovery failure from turning a command into a prompt", async () => {
    const { native, controller } = setup();
    vi.spyOn(native, "command").mockRejectedValue(new Error("Discovery unavailable"));
    const submit = vi.spyOn(native, "submit").mockResolvedValue();
    expect(await controller.actions.send("/work task")).toBe(false);
    expect(submit).not.toHaveBeenCalled();
  });
  it("resolves aliases through Hermes with cycle bounds", async () => {
    const { native, controller } = setup();
    const command = vi
      .spyOn(native, "command")
      .mockImplementation(async (method) =>
        method === "commands.catalog" ? catalog : { type: "alias", target: "cycle" },
      );
    expect(await controller.actions.send("/cycle")).toBe(false);
    expect(command).toHaveBeenCalledTimes(9);
    expect(controller.view.commandResults.value[0]?.output).toContain("outcome");
  });
});

it("reports profile-only Project draft discovery without unsupported fields or touching the previous session", async () => {
  const { native, scope, controller } = setup();
  scope.session.value = "";
  scope.selectedProject.value = {
    id: "project",
    label: "Project",
    path: "/synthetic/project",
    sessionCount: 0,
    repos: [],
  };
  const rpc = vi.spyOn(native, "command");
  const discover = vi
    .spyOn(NativeGatewayViewer, "discover")
    .mockImplementation(async (_profile, method) =>
      method === "commands.catalog"
        ? { pairs: [["/work", "Project skill"]] }
        : { items: [{ text: "/work" }], replace_from: 1 },
    );
  try {
    const result = await controller.actions.completeSlash("/wo");
    expect(rpc).not.toHaveBeenCalled();
    expect(scope.createSession).not.toHaveBeenCalled();
    expect(discover).toHaveBeenCalledWith("alpha", "commands.catalog", {});
    expect(discover).toHaveBeenCalledWith("alpha", "complete.slash", {
      text: "/wo",
    });
    expect(result.notice).toContain("cannot discover project-local skills");
  } finally {
    discover.mockRestore();
  }
});

it("creates the routed draft session before dispatch and retains its model/effort choice", async () => {
  const { native, scope, controller } = setup();
  scope.session.value = "";
  controller.actions.setModel("chosen-model");
  controller.actions.setProvider("chosen-provider");
  controller.actions.setReasoningEffort("low");
  const discover = vi
    .spyOn(NativeGatewayViewer, "discover")
    .mockResolvedValue({ pairs: [["/plan", "Plan"]], commands: { "/plan": {} } });
  scope.createSession.mockImplementation(async () => {
    scope.session.value = "new-scoped";
    native.settings.value = {
      profile: "alpha",
      session: "new-scoped",
      info: {},
      generation: native.generationRef.value,
    };
    return "new-scoped";
  });
  const command = vi
    .spyOn(native, "command")
    .mockImplementation(async (method) =>
      method === "commands.catalog"
        ? { commands: { "/plan": {} } }
        : { type: "send", message: "Native plan" },
    );
  const submit = vi.spyOn(native, "submit").mockResolvedValue();
  try {
    expect(await controller.actions.send("/plan task")).toBe(true);
    expect(scope.createSession).toHaveBeenCalledOnce();
    expect(command).toHaveBeenCalledWith("command.dispatch", { name: "plan", arg: "task" });
    expect(submit.mock.calls[0]![2]).toEqual({
      model: "chosen-model",
      provider: "chosen-provider",
      reasoning_effort: "low",
    });
  } finally {
    discover.mockRestore();
  }
});

it("supplements quick commands from native catalog without changing native ranking", async () => {
  const { native, controller } = setup();
  vi.spyOn(native, "command").mockImplementation(async (method) =>
    method === "commands.catalog"
      ? {
          pairs: [
            ["/status", "Status"],
            ["/quick-test", "Profile quick command"],
          ],
        }
      : { items: [{ text: "status", meta: "Status" }], replace_from: 1 },
  );
  const result = await controller.actions.completeSlash("/");
  expect(result.items?.map((item) => item.text)).toEqual(["status", "/quick-test"]);
});

it("compares route ownership by identity without serializing mounted router records", async () => {
  const { native, controller, scope } = setup();
  const route: { mounted?: unknown } = {};
  route.mounted = route;
  scope.navigation.mockReturnValue(route as never);
  vi.spyOn(native, "command").mockResolvedValue({ pairs: [["/status", "Status"]] });
  expect(await controller.actions.send("/help")).toBe(true);
  expect(controller.view.commandResults.value[0]?.output).toContain("/status");
});

it("refuses a ready viewer whose settings belong to the previously selected session", async () => {
  const { native, scope, controller } = setup();
  scope.session.value = "new-selection";
  const command = vi.spyOn(native, "command");
  const submit = vi.spyOn(native, "submit");
  expect(await controller.actions.send("/status")).toBe(false);
  expect(command).not.toHaveBeenCalled();
  expect(submit).not.toHaveBeenCalled();
});

it("filters unscoped plugin completions against the selected profile catalog", async () => {
  const { native, controller } = setup();
  vi.spyOn(native, "command").mockImplementation(async (method) =>
    method === "commands.catalog"
      ? {
          pairs: [["/own-plugin", "Selected profile description"]],
          commands: { "/own-plugin": {} },
        }
      : {
          items: [
            { text: "foreign-plugin", meta: "Other profile" },
            { text: "own-plugin", meta: "Launch description" },
            { text: "bound-skill", kind: "skill" },
          ],
          replace_from: 1,
        },
  );
  const result = await controller.actions.completeSlash("/");
  expect(result.items?.map((item) => item.text)).toEqual(["own-plugin", "bound-skill"]);
  expect(result.items?.[0]?.meta).toBe("Selected profile description");
});

it.each(["Scoped context description", "", undefined])(
  "uses only scoped canonical metadata for alias collisions (description: %s)",
  async (description) => {
    const { native, controller } = setup();
    vi.spyOn(native, "command").mockImplementation(async (method) =>
      method === "commands.catalog"
        ? {
            pairs: description === undefined ? [] : [["/context", description]],
            canon: { "/ctx": "/context" },
            commands: { "/context": {}, "/ctx": {} },
          }
        : {
            items: [{ text: "ctx", kind: "command", meta: "Foreign plugin description" }],
            replace_from: 1,
          },
    );
    const result = await controller.actions.completeSlash("/ctx");
    expect(result.items).toEqual([{ text: "ctx", kind: "command", meta: description ?? "" }]);
  },
);

it.each(["help", "commands"])(
  "rejects /%s with staged attachments and restores the draft",
  async (name) => {
    const { native, controller, scope } = setup();
    const command = vi.spyOn(native, "command").mockResolvedValue({
      pairs: [["/status", "Status"]],
    });
    const submit = vi.spyOn(native, "submit");
    const wrapper = mount(
      defineComponent({
        setup() {
          provideChat({ ...controller, sessions: ref([]) });
          return () => h(ChatInterface);
        },
      }),
    );
    try {
      const composer = wrapper.findComponent({ name: "ChatComposer" });
      const text = `/${name}`;
      const files = [
        {
          name: "notes.txt",
          type: "text/plain",
          data: "data:text/plain;base64,SGk=",
          path: "/synthetic/notes.txt",
        },
      ];
      composer.vm.$emit("send", text, files);
      await flushPromises();
      expect(wrapper.get("textarea").element.value).toBe(text);
      expect(composer.text()).toContain("notes.txt");
      expect(controller.view.commandResults.value[0]?.output).toContain("Remove them first");
      expect(command).toHaveBeenCalledExactlyOnceWith("commands.catalog", {});
      expect(submit).not.toHaveBeenCalled();
      expect(scope.createSession).not.toHaveBeenCalled();
      expect(await controller.actions.send(text)).toBe(true);
      expect(controller.view.commandResults.value.at(-1)?.output).toContain("/status — Status");
    } finally {
      wrapper.unmount();
    }
  },
);

it("does not request unsafe legacy dynamic argument providers", async () => {
  const { native, controller } = setup();
  const command = vi
    .spyOn(native, "command")
    .mockResolvedValue({ commands: { "/personality": {} } });
  const result = await controller.actions.completeSlash("/personality ");
  expect(command).toHaveBeenCalledTimes(1);
  expect(command).toHaveBeenCalledWith("commands.catalog", {});
  expect(result.notice).toContain("not profile-bound");
  expect(result.items).toEqual([]);
});

it("explains the local steering control without claiming an unknown execution", async () => {
  const { native, controller } = setup();
  const command = vi.spyOn(native, "command").mockResolvedValue({ commands: { "/steer": {} } });
  const submit = vi.spyOn(native, "submit");
  expect(await controller.actions.send("/steer change direction")).toBe(false);
  expect(command).toHaveBeenCalledTimes(1);
  expect(submit).not.toHaveBeenCalled();
  expect(controller.view.commandResults.value[0]?.output).toBe(
    "Use Guide this run in the composer while a response is active.",
  );
});
