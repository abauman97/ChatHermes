// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import ChatComposer from "./ChatComposer.vue";

describe("composer keyboard behavior", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends on desktop Enter and leaves Shift+Enter and IME confirmation alone", async () => {
    vi.stubGlobal("innerWidth", 1024);
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    const input = wrapper.get("textarea");
    await input.setValue("hello");

    const enter = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    input.element.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(true);
    expect(wrapper.emitted("send")).toEqual([["hello", []]]);

    const shifted = new KeyboardEvent("keydown", {
      key: "Enter",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    input.element.dispatchEvent(shifted);
    expect(shifted.defaultPrevented).toBe(false);
    expect(wrapper.emitted("send")).toHaveLength(1);

    const composing = new KeyboardEvent("keydown", {
      key: "Enter",
      isComposing: true,
      bubbles: true,
      cancelable: true,
    });
    input.element.dispatchEvent(composing);
    expect(composing.defaultPrevented).toBe(false);
    wrapper.unmount();
  });

  it("keeps Enter as a newline on mobile", async () => {
    vi.stubGlobal("innerWidth", 390);
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    await wrapper.get("textarea").setValue("hello");
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    wrapper.get("textarea").element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(wrapper.emitted("send")).toBeUndefined();
    wrapper.unmount();
  });
});

describe("model picker focus", () => {
  it("does not autofocus the reasoning selector or provider option when opened", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: {
        disabled: false,
        sending: false,
        providers: [
          {
            slug: "provider-a",
            name: "Provider A",
            is_current: true,
            models: ["model-a"],
            capabilities: { "model-a": { reasoning: true } },
          },
        ],
      },
    });
    const activeBeforeOpen = document.activeElement;
    await wrapper.get(".model-pill").trigger("click");
    const selector = wrapper.get('[aria-label="Reasoning effort"]');
    const provider = wrapper.get('[data-provider="provider-a"]');
    expect(document.activeElement).toBe(activeBeforeOpen);
    expect(document.activeElement).not.toBe(selector.element);
    expect(document.activeElement).not.toBe(provider.element);
    wrapper.unmount();
  });
});
