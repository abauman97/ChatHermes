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
    generation: () => generation,
    createSession: vi.fn(async () => "one"),
    suggest: vi.fn(async () => {}),
    retryHistory: vi.fn(async () => {}),
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
