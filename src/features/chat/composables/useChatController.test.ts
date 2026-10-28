// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { ref } from "vue";
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
    scheduledPage: ref(false),
    projectView: ref(false),
    projectsPage: ref(false),
    projectPage: ref(""),
    settingsPage: ref(false),
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
    navigation: vi.fn(() => 0),
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
  scope.navigation.mockReturnValue(1);
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
