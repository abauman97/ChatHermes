// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import ClarificationRequest from "./ClarificationRequest.vue";
import type { PendingRequest } from "../utils/chat-requests";
const request: Extract<PendingRequest, { kind: "clarify" }> = {
  id: "request",
  kind: "clarify",
  params: {
    questions: [{ qid: "q", question: "Choose", choices: ["A", "B"], multi_select: true }],
  },
};
describe("request-local clarification state", () => {
  it("retains selected and custom drafts while an answer settles and blocks duplicate submission", async () => {
    let settle!: () => void;
    const answer = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          settle = resolve;
        }),
    );
    const wrapper = mount(ClarificationRequest, { props: { request, disabled: false, answer } });
    await wrapper.get(".clarification-choices button").trigger("click");
    await wrapper.get("input").setValue("  ");
    await wrapper.get("form").trigger("submit");
    await wrapper.get("form").trigger("submit");
    expect(answer).toHaveBeenCalledExactlyOnceWith({ answers: { q: "A" } });
    expect(wrapper.get("fieldset").attributes("disabled")).toBeDefined();
    settle();
    await flushPromises();
    expect(wrapper.get(".clarification-choices button").attributes("aria-pressed")).toBe("true");
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("  ");
    await wrapper.get("input").setValue("My response");
    await wrapper.get("form").trigger("submit");
    expect(answer).toHaveBeenLastCalledWith({ answers: { q: "My response" } });
    settle();
    await flushPromises();
  });
  it("resets drafts and pending state on scope or request replacement with the same qid", async () => {
    const profile = ref("alpha"),
      session = ref("one"),
      id = ref("request");
    let settle!: () => void;
    const answer = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          settle = resolve;
        }),
    );
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(ClarificationRequest, {
            key: JSON.stringify([profile.value, session.value, id.value]),
            request: { ...request, id: id.value },
            disabled: false,
            answer,
          }),
      }),
    );
    await wrapper.get("input").setValue("Old");
    await wrapper.get("form").trigger("submit");
    profile.value = "beta";
    await flushPromises();
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("");
    expect(wrapper.get("fieldset").attributes("disabled")).toBeUndefined();
    await wrapper.get("input").setValue("New");
    settle();
    await flushPromises();
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("New");
    session.value = "two";
    await flushPromises();
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("");
    await wrapper.get("input").setValue("Another");
    id.value = "next";
    await flushPromises();
    expect((wrapper.get("input").element as HTMLInputElement).value).toBe("");
  });
});
