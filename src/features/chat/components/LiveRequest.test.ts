// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import type { PendingRequest } from "../utils/chat-requests";
import LiveRequest from "./LiveRequest.vue";

const state = vi.hoisted(() => ({ answer: vi.fn().mockResolvedValue(undefined) }));
const request = ref<PendingRequest>();
vi.mock("../context", () => ({
  useChat: () => ({
    view: { request, requestDisabled: ref(false), active: ref(false) },
    scope: { profile: ref("default"), session: ref("session") },
    actions: { answerFor: () => state.answer },
  }),
}));

const long = "Long/path_or_identifier_".repeat(30);
describe("live prompt rendering", () => {
  it("renders the complete approval command and submits the selected decision", async () => {
    state.answer.mockClear();
    request.value = {
      id: "approval",
      kind: "approval",
      params: { command: `chmod 777 /tmp/${long}`, choices: ["once", "session", "always", "deny"] },
    };
    const wrapper = mount(LiveRequest);
    expect(wrapper.get("p").text()).toBe(`Approval required: chmod 777 /tmp/${long}`);
    expect(wrapper.findAll("button").map((button) => button.text())).toEqual([
      "Allow once",
      "Allow for session",
      "Always allow",
      "Deny",
    ]);
    await wrapper.get("button:last-child").trigger("click");
    expect(state.answer).toHaveBeenCalledExactlyOnceWith({ choice: "deny" });
    wrapper.unmount();
  });

  it("renders complete clarification questions and choices and accepts a custom response", async () => {
    state.answer.mockClear();
    request.value = {
      id: "clarify",
      kind: "clarify",
      params: { questions: [{ qid: "q", question: long, choices: [long, "Another choice"] }] },
    };
    const wrapper = mount(LiveRequest);
    expect(wrapper.get("legend").text()).toBe(long);
    expect(wrapper.get(".clarification-choices button").text()).toBe(long);
    await wrapper.get("input").setValue(long);
    await wrapper.get("form").trigger("submit");
    expect(state.answer).toHaveBeenCalledExactlyOnceWith({ answers: { q: long } });
    wrapper.unmount();
  });

  it("renders long secret instructions and labels with a password input", () => {
    request.value = { id: "secret", kind: "secret", params: { prompt: long, env_var: long } };
    const wrapper = mount(LiveRequest);
    expect(wrapper.get("p").text()).toBe(long);
    expect(wrapper.get("label").text()).toBe(long);
    expect(wrapper.get("input").attributes("type")).toBe("password");
    expect(wrapper.get("input").attributes("aria-label")).toBe(long);
    wrapper.unmount();
  });
});
