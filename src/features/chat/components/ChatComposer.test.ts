// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import ChatComposer from "./ChatComposer.vue";
describe("composer", () => {
  it.each([false, true])(
    "submits a focused draft once when blur before click is %s",
    async (blur) => {
      const wrapper = mount(ChatComposer, {
        attachTo: document.body,
        props: { disabled: false, sending: false },
      });
      try {
        const area = wrapper.get("textarea");
        area.element.focus();
        await area.setValue("focused draft");
        expect(document.activeElement).toBe(area.element);
        let submissions = 0;
        wrapper.get("form").element.addEventListener("submit", () => submissions++);
        const send = wrapper.get(".send-button");
        const pointer = new MouseEvent("pointerdown", {
          button: 0,
          bubbles: true,
          cancelable: true,
        });
        send.element.dispatchEvent(pointer);
        expect(pointer.defaultPrevented).toBe(false);
        const mouse = new MouseEvent("mousedown", { button: 0, bubbles: true, cancelable: true });
        send.element.dispatchEvent(mouse);
        expect(mouse.defaultPrevented).toBe(true);
        if (blur) {
          area.element.blur();
          await wrapper.vm.$nextTick();
        }
        await send.trigger("click");
        expect(submissions).toBe(1);
        expect(wrapper.emitted("send")).toEqual([["focused draft", []]]);
        expect(area.element.value).toBe("");
      } finally {
        wrapper.unmount();
      }
    },
  );
  it("hides attachment options while editing and restores them only after focus leaves the composer", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    const outside = document.createElement("button");
    document.body.append(outside);
    try {
      const attachment = wrapper.get('[aria-label="Attachment options"]');
      expect(attachment.isVisible()).toBe(true);
      (wrapper.get("textarea").element as HTMLTextAreaElement).focus();
      await wrapper.vm.$nextTick();
      expect(attachment.isVisible()).toBe(false);
      await wrapper.get("textarea").setValue("draft");
      (wrapper.get(".send-button").element as HTMLButtonElement).focus();
      await wrapper.vm.$nextTick();
      expect(attachment.isVisible()).toBe(false);
      await wrapper.get(".send-button").trigger("click");
      expect(wrapper.emitted("send")).toEqual([["draft", []]]);
      outside.focus();
      await wrapper.vm.$nextTick();
      expect(attachment.isVisible()).toBe(true);
      await attachment.trigger("click");
      expect(attachment.attributes("aria-expanded")).toBe("true");
      expect(wrapper.find('[data-mode="goal"]').exists()).toBe(true);
    } finally {
      wrapper.unmount();
      outside.remove();
    }
  });
  it("restores attachment options when textarea focus leaves without a related target, including during a run", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: true, sending: true, stoppable: true },
    });
    try {
      const area = wrapper.get("textarea").element as HTMLTextAreaElement;
      const attachment = wrapper.get(".attach-button");
      area.focus();
      await wrapper.vm.$nextTick();
      expect(attachment.isVisible()).toBe(false);
      expect(area.disabled).toBe(false);
      area.blur();
      await wrapper.vm.$nextTick();
      expect(attachment.isVisible()).toBe(true);
      expect(attachment.attributes("disabled")).toBeDefined();
      await wrapper.setProps({ disabled: false, sending: false });
      expect(attachment.attributes("disabled")).toBeUndefined();
    } finally {
      wrapper.unmount();
    }
  });
  it("uses exact 30px square buttons with centered icons and a symmetric plus glyph", () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    try {
      for (const selector of [".attach-button", ".send-button"]) {
        expect(wrapper.get(selector).classes()).toEqual(
          expect.arrayContaining(["size-[30px]", "shrink-0", "grid", "place-items-center", "p-0"]),
        );
      }
      const plus = wrapper.get(".attach-button svg");
      expect(plus.attributes("viewBox")).toBe("0 0 24 24");
      expect(plus.classes()).toContain("size-5");
      expect(plus.get("path").attributes("d")).toBe("M12 5v14M5 12h14");
      expect(plus.attributes("aria-hidden")).toBe("true");
    } finally {
      wrapper.unmount();
    }
  });
  it("keeps the model selector 30px high, content-sized and readable beside the buttons", () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false, model: "example-model" },
    });
    try {
      const picker = wrapper.get(".model-pill");
      expect(picker.classes()).toEqual(
        expect.arrayContaining(["h-[30px]", "flex", "items-center", "px-3", "py-0", "text-[16px]"]),
      );
      expect(picker.classes()).not.toContain("size-[30px]");
      expect(picker.classes()).not.toContain("w-[30px]");
      expect(picker.text()).toBe("example-model");
      expect(wrapper.get(".composer-controls").classes()).toContain("items-center");
    } finally {
      wrapper.unmount();
    }
  });
  it("adds goal and plan slash commands to the next message and shows the active mode", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    await wrapper.get('[aria-label="Attachment options"]').trigger("click");
    await wrapper.get('[data-mode="goal"]').trigger("click");
    expect(wrapper.get('[role="status"]').text()).toContain("Goal mode");
    await wrapper.get("textarea").setValue("finish the migration");
    await wrapper.get(".send-button").trigger("click");
    expect(wrapper.emitted("send")?.[0]).toEqual(["/goal\nfinish the migration", []]);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
    await wrapper.get('[aria-label="Attachment options"]').trigger("click");
    await wrapper.get('[data-mode="plan"]').trigger("click");
    await wrapper.get("textarea").setValue("refactor the parser");
    await wrapper.get("textarea").trigger("keydown", { key: "Enter", shiftKey: true });
    expect(wrapper.emitted("send")?.[1]).toEqual(["/plan\nrefactor the parser", []]);
    wrapper.unmount();
  });
  it("leaves plain Enter, other modifiers and IME confirmation to native handling", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    try {
      const area = wrapper.get("textarea");
      await area.setValue("hello\nworld");
      for (const extra of [
        {},
        { shiftKey: true, isComposing: true },
        { shiftKey: true, keyCode: 229 },
        { shiftKey: true, ctrlKey: true },
        { shiftKey: true, altKey: true },
        { shiftKey: true, metaKey: true },
      ]) {
        const event = new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          cancelable: true,
          ...extra,
        });
        area.element.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      }
      await area.trigger("compositionstart");
      await area.trigger("keydown", { key: "Enter", shiftKey: true });
      expect(wrapper.emitted("send")).toBeUndefined();
      expect(area.element.value).toBe("hello\nworld");
      await area.trigger("compositionend");
      await area.trigger("keydown", { key: "Enter", shiftKey: true });
      expect(wrapper.emitted("send")).toEqual([["hello\nworld", []]]);
    } finally {
      wrapper.unmount();
    }
  });
  it("sends once with Shift+Enter, keeps focus, and ignores held keys", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    try {
      const area = wrapper.get("textarea");
      area.element.focus();
      await area.setValue("  hello\nworld  ");
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      area.element.dispatchEvent(event);
      await wrapper.vm.$nextTick();
      expect(event.defaultPrevented).toBe(true);
      expect(wrapper.emitted("send")).toEqual([["hello\nworld", []]]);
      expect(area.element.value).toBe("");
      expect(document.activeElement).toBe(area.element);
      await area.trigger("keydown", { key: "Enter", shiftKey: true });
      expect(wrapper.emitted("send")).toHaveLength(1);
      await area.setValue("next draft");
      await area.trigger("keydown", { key: "Enter", shiftKey: true, repeat: true });
      expect(wrapper.emitted("send")).toHaveLength(1);
      expect(area.element.value).toBe("next draft");
    } finally {
      wrapper.unmount();
    }
  });
  it.each([
    { disabled: true, sending: false, stoppable: false },
    { disabled: false, sending: true, stoppable: false },
  ])("retains drafts when Shift+Enter is gated: %j", async (props) => {
    const wrapper = mount(ChatComposer, { props });
    try {
      const area = wrapper.get("textarea");
      await area.setValue("draft while unavailable");
      await area.trigger("keydown", { key: "Enter", shiftKey: true });
      expect(wrapper.emitted("send")).toBeUndefined();
      expect(wrapper.emitted("steer")).toBeUndefined();
      expect(area.element.value).toBe("draft while unavailable");
      await wrapper.setProps({ disabled: false, sending: false });
      await area.trigger("keydown", { key: "Enter", shiftKey: true });
      expect(wrapper.emitted("send")).toEqual([["draft while unavailable", []]]);
    } finally {
      wrapper.unmount();
    }
  });
  it("uses Shift+Enter for run guidance without stopping an empty run", async () => {
    const wrapper = mount(ChatComposer, {
      props: { disabled: false, sending: true, stoppable: true },
    });
    try {
      const area = wrapper.get("textarea");
      await area.trigger("keydown", { key: "Enter", shiftKey: true });
      expect(wrapper.emitted("stop")).toBeUndefined();
      await area.setValue("  follow this direction  ");
      await area.trigger("keydown", { key: "Enter", shiftKey: true });
      expect(wrapper.emitted("steer")).toEqual([["follow this direction"]]);
      expect(wrapper.emitted("send")).toBeUndefined();
      expect(area.element.value).toBe("");
    } finally {
      wrapper.unmount();
    }
  });
  it("recalculates an empty input on focus and blur and keeps growing with draft content", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    try {
      const area = wrapper.get("textarea").element as HTMLTextAreaElement;
      area.style.lineHeight = "24px";
      area.style.padding = "4px";
      let height = 64;
      Object.defineProperty(area, "scrollHeight", { get: () => height });
      // jsdom has no layout: model the dimensions supplied by the mobile focus CSS.
      height = 32;
      area.focus();
      await wrapper.vm.$nextTick();
      expect(area.value).toBe("");
      expect(area.style.height).toBe("32px");
      expect(wrapper.get(".attach-button").isVisible()).toBe(false);
      await wrapper.get("textarea").setValue("short");
      expect(area.style.height).toBe("32px");
      height = 80;
      await wrapper.get("textarea").setValue("first\nsecond\nthird");
      expect(area.style.height).toBe("80px");
      height = 32;
      await wrapper.get("textarea").setValue("");
      expect(area.style.height).toBe("32px");
      height = 64;
      area.blur();
      await wrapper.vm.$nextTick();
      expect(area.style.height).toBe("64px");
      expect(wrapper.get(".attach-button").isVisible()).toBe(true);
    } finally {
      wrapper.unmount();
    }
  });
  it("resizes for drafts, caps at eight rows and shrinks after sending", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    const area = wrapper.get("textarea").element as HTMLTextAreaElement;
    area.style.lineHeight = "24px";
    area.style.padding = "4px";
    let height = 80;
    Object.defineProperty(area, "scrollHeight", { get: () => height });
    await wrapper.setProps({ suggestedPrompt: "three rows" });
    expect(area.style.height).toBe("80px");
    height = 300;
    await wrapper.get("textarea").setValue("long draft");
    expect(area.style.height).toBe("200px");
    height = 32;
    await wrapper.get(".send-button").trigger("click");
    expect(area.style.height).toBe("32px");
    wrapper.unmount();
  });
});

describe("composer availability", () => {
  it("keeps text editable while sending is gated and blocks keyboard submissions", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: true, sending: false },
    });
    const area = wrapper.get("textarea");
    expect(area.attributes("disabled")).toBeUndefined();
    await area.setValue("draft while loading");
    await area.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("send")).toBeUndefined();
    expect((area.element as HTMLTextAreaElement).value).toBe("draft while loading");
    wrapper.unmount();
  });
  it("steers non-empty input during an active stoppable run and stops with empty input", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: true, stoppable: true },
    });
    const button = wrapper.get(".send-button");
    expect(button.attributes("aria-label")).toBe("Stop response");
    await wrapper.get("textarea").setValue("  follow this direction  ");
    expect(button.attributes("aria-label")).toBe("Guide this run");
    await button.trigger("click");
    expect(wrapper.emitted("steer")).toEqual([["follow this direction"]]);
    expect((wrapper.get("textarea").element as HTMLTextAreaElement).value).toBe("");
    expect(wrapper.emitted("stop")).toBeUndefined();
    await button.trigger("click");
    expect(wrapper.emitted("stop")).toHaveLength(1);
    expect(wrapper.emitted("send")).toBeUndefined();
    expect(button.attributes("type")).toBe("button");
    wrapper.unmount();
  });
  it("reactivates the button when loading and run gates clear, including a draft typed during a run", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: true, sending: false },
    });
    await wrapper.get("textarea").setValue("draft");
    const button = wrapper.get(".send-button");
    expect(button.attributes("disabled")).toBeDefined();
    await wrapper.setProps({ disabled: false, sending: true, stoppable: false });
    expect(button.attributes("disabled")).toBeDefined();
    await wrapper.setProps({ sending: false });
    expect(button.attributes("disabled")).toBeUndefined();
    await button.trigger("click");
    expect(wrapper.emitted("send")).toEqual([["draft", []]]);
    wrapper.unmount();
  });
  it("releases the reading gate after an aborted attachment", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    let reader: { onabort?: () => void } = {};
    const captureReader = (value: typeof reader) => {
      reader = value;
    };
    vi.stubGlobal(
      "FileReader",
      class {
        onabort?: () => void;
        constructor() {
          captureReader(this);
        }
        readAsDataURL() {}
      },
    );
    try {
      await wrapper.get("textarea").setValue("draft");
      const input = wrapper.get('input[aria-label="Upload files"]');
      Object.defineProperty(input.element, "files", { value: [new File(["data"], "test.txt")] });
      await input.trigger("change");
      expect(wrapper.get(".send-button").attributes("disabled")).toBeDefined();
      reader.onabort?.();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(wrapper.get('[role="alert"]').text()).toContain("cancelled");
      expect(wrapper.get(".send-button").attributes("disabled")).toBeUndefined();
      await wrapper.get(".send-button").trigger("click");
      expect(wrapper.emitted("send")).toEqual([["draft", []]]);
    } finally {
      wrapper.unmount();
      vi.unstubAllGlobals();
    }
  });
  it("retains ordinary send behavior outside a run", async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: { disabled: false, sending: false },
    });
    await wrapper.get("textarea").setValue("hello");
    await wrapper.get(".send-button").trigger("click");
    expect(wrapper.emitted("send")?.[0]).toEqual(["hello", []]);
    expect(wrapper.emitted("steer")).toBeUndefined();
    wrapper.unmount();
  });
});

describe("provider and model picker", () => {
  const providers = [
    { slug: "first", name: "First", is_current: true, models: ["one", "two"] },
    { slug: "custom:second", name: "Second", models: ["other"] },
  ];
  const wrappers: ReturnType<typeof mount>[] = [];
  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  });
  function composer(extra = {}) {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      props: {
        disabled: false,
        sending: false,
        provider: "first",
        defaultModel: "saved",
        providers,
        models: [
          { id: "gateway", parent: null },
          { id: "Instant", parent: "gateway" },
        ],
        ...extra,
      },
    });
    wrappers.push(wrapper);
    return wrapper;
  }
  it("shows the model, configured default, empty default and loading labels", async () => {
    const wrapper = composer({ model: "chosen" });
    expect(wrapper.get(".model-pill").text()).toBe("chosen");
    await wrapper.setProps({ model: "" });
    expect(wrapper.get(".model-pill").text()).toBe("saved");
    await wrapper.setProps({ defaultModel: "" });
    expect(wrapper.get(".model-pill").text()).toBe("Default");
    await wrapper.setProps({ modelsLoading: true });
    expect(wrapper.get(".model-pill").text()).toBe("Loading models…");
    expect(wrapper.get(".model-pill").attributes("disabled")).toBeDefined();
  });
  it("navigates providers and models without changing selection until a model is chosen", async () => {
    const wrapper = composer();
    const pill = wrapper.get(".model-pill");
    expect(pill.attributes("aria-haspopup")).toBe("dialog");
    await pill.trigger("click");
    expect(pill.attributes("aria-expanded")).toBe("true");
    expect(wrapper.findAll(".provider-option").map((item) => item.text())).toEqual([
      "FirstCurrent",
      "Second",
      "Model routes",
    ]);
    await wrapper.get('[data-provider="first"]').trigger("click");
    expect(wrapper.get('[role="dialog"]').attributes("aria-label")).toBe("First");
    expect(wrapper.findAll(".model-option").map((item) => item.attributes("data-model"))).toEqual([
      "saved",
      "one",
      "two",
    ]);
    await wrapper.get(".picker-back").trigger("click");
    expect(wrapper.findAll(".provider-option")).toHaveLength(3);
    expect(wrapper.emitted("update:provider")).toBeUndefined();
    await wrapper.get('[data-provider="custom:second"]').trigger("click");
    expect(wrapper.findAll(".model-option").map((item) => item.text())).toEqual(["other"]);
    await wrapper.get('[data-model="other"]').trigger("click");
    expect(wrapper.emitted("update:provider")).toEqual([["custom:second"]]);
    expect(wrapper.emitted("update:model")).toEqual([["other"]]);
    expect(wrapper.find(".model-panel").exists()).toBe(false);
    expect(document.activeElement).toBe(pill.element);
  });
  it("emits an empty model for the current configured default and an explicit model for other choices", async () => {
    const wrapper = composer();
    for (const id of ["saved", "two"]) {
      await wrapper.get(".model-pill").trigger("click");
      await wrapper.get('[data-provider="first"]').trigger("click");
      await wrapper.get(`[data-model="${id}"]`).trigger("click");
    }
    expect(wrapper.emitted("update:provider")).toEqual([["first"], ["first"]]);
    expect(wrapper.emitted("update:model")).toEqual([[""], ["two"]]);
  });
  it("selects routes with an empty provider and keeps the default available without inventory", async () => {
    const wrapper = composer();
    await wrapper.get(".model-pill").trigger("click");
    await wrapper.get('[data-provider=""]').trigger("click");
    expect(wrapper.findAll(".model-option").map((item) => item.text())).toEqual(["Instant"]);
    await wrapper.get('[data-model="Instant"]').trigger("click");
    expect(wrapper.emitted("update:provider")).toEqual([[""]]);
    expect(wrapper.emitted("update:model")).toEqual([["Instant"]]);
    await wrapper.setProps({ providers: [], provider: "" });
    await wrapper.get(".model-pill").trigger("click");
    await wrapper.get('[data-provider=""]').trigger("click");
    expect(wrapper.findAll(".model-option").map((item) => item.attributes("data-model"))).toEqual([
      "saved",
      "Instant",
    ]);
    await wrapper.get('[data-model="saved"]').trigger("click");
    expect(wrapper.emitted("update:model")?.[1]).toEqual(["saved"]);
  });
  it("moves focus, traps Tab and closes on toggle, Escape and outside click", async () => {
    const wrapper = composer();
    const pill = wrapper.get(".model-pill");
    await pill.trigger("click");
    const select = wrapper.get('select[aria-label="Reasoning effort"]');
    const close = wrapper.get('[aria-label="Close model picker"]');
    expect(document.activeElement).toBe(select.element);
    await select.trigger("keydown", { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(select.element);
    await select.trigger("keydown", { key: "Tab" });
    expect(document.activeElement).toBe(select.element);
    await close.trigger("keydown", { key: "Escape" });
    expect(wrapper.find(".model-panel").exists()).toBe(false);
    expect(document.activeElement).toBe(pill.element);
    await pill.trigger("click");
    await pill.trigger("click");
    expect(wrapper.find(".model-panel").exists()).toBe(false);
    await pill.trigger("click");
    document.body.click();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".model-panel").exists()).toBe(false);
    expect(document.activeElement).toBe(pill.element);
  });
  it("selects reasoning without closing the picker or changing model and preserves the draft", async () => {
    const wrapper = composer({ reasoningEffort: "high" });
    await wrapper.get("textarea").setValue("Keep draft");
    await wrapper.get(".model-pill").trigger("click");
    const select = wrapper.get('select[aria-label="Reasoning effort"]');
    expect((select.element as HTMLSelectElement).value).toBe("high");
    expect(select.findAll("option").map((option) => option.attributes("value"))).toEqual([
      "",
      "none",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max",
      "ultra",
    ]);
    await select.setValue("none");
    expect(wrapper.emitted("update:reasoningEffort")).toEqual([["none"]]);
    expect(wrapper.emitted("update:model")).toBeUndefined();
    expect(wrapper.get("textarea").element.value).toBe("Keep draft");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    await select.trigger("keydown", { key: "Escape" });
    expect(document.activeElement).toBe(wrapper.get(".model-pill").element);
  });
  it("hides reasoning only for an explicit false on the active provider and model", async () => {
    const capable = [
      { ...providers[0]!, capabilities: { one: { reasoning: false }, two: { reasoning: true } } },
      { ...providers[1]!, capabilities: { other: { reasoning: false } } },
    ];
    const wrapper = composer({ providers: capable, model: "one" });
    await wrapper.get(".model-pill").trigger("click");
    expect(wrapper.find('select[aria-label="Reasoning effort"]').exists()).toBe(false);
    await wrapper.get('[data-provider="first"]').trigger("click");
    await wrapper.get('[data-model="two"]').trigger("click");
    expect(wrapper.emitted("update:model")).toEqual([["two"]]);
    await wrapper.setProps({ model: "two" });
    await wrapper.get(".model-pill").trigger("click");
    expect(wrapper.find('select[aria-label="Reasoning effort"]').exists()).toBe(true);
    await wrapper.get(".model-pill").trigger("click");
    await wrapper.get(".model-pill").trigger("click");
    await wrapper.get('[data-provider="custom:second"]').trigger("click");
    expect(wrapper.find('select[aria-label="Reasoning effort"]').exists()).toBe(false);
    await wrapper.get('[data-model="other"]').trigger("click");
    await wrapper.setProps({ provider: "custom:second", model: "other" });
    await wrapper.get(".model-pill").trigger("click");
    expect(wrapper.find('select[aria-label="Reasoning effort"]').exists()).toBe(false);
    await wrapper.setProps({
      providers: [{ ...capable[0]!, capabilities: {} }],
      provider: "first",
      model: "unknown",
    });
    await wrapper.get(".model-pill").trigger("click");
    expect(wrapper.find('select[aria-label="Reasoning effort"]').exists()).toBe(true);
  });
  it("focuses the reasoning selector first and includes it in picker tab order", async () => {
    const wrapper = composer();
    await wrapper.get(".model-pill").trigger("click");
    const select = wrapper.get('select[aria-label="Reasoning effort"]');
    expect(document.activeElement).toBe(select.element);

    await select.trigger("keydown", { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(select.element);

    await select.trigger("keydown", { key: "Tab" });
    expect(document.activeElement).toBe(select.element);
  });
  it("gates the picker during sending, closes an open picker, and keeps the composer editable", async () => {
    const wrapper = composer({ disabled: true });
    expect(wrapper.get(".model-pill").attributes("disabled")).toBeUndefined();
    await wrapper.get(".model-pill").trigger("click");
    await wrapper.setProps({ sending: true });
    expect(wrapper.find(".model-panel").exists()).toBe(false);
    expect(wrapper.get(".model-pill").attributes("disabled")).toBeDefined();
    expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
    await wrapper.get(".model-pill").trigger("click");
    expect(wrapper.find(".model-panel").exists()).toBe(false);
  });
});

it("shares file staging, retains the draft and other files on upload failure, and retries without sending", async () => {
  const { api } = await import("../../../services/hermes-api");
  const upload = vi
    .spyOn(api, "upload")
    .mockResolvedValueOnce({ path: "/uploads/one.txt" })
    .mockRejectedValueOnce(new Error("failed"))
    .mockResolvedValueOnce({ path: "/uploads/two.txt" });
  const wrapper = mount(ChatComposer, {
    attachTo: document.body,
    props: { disabled: false, sending: false, profile: "work" },
  });
  await wrapper.get("textarea").setValue("Keep this draft");
  await (wrapper.vm as unknown as { stageFiles(files: File[]): Promise<void> }).stageFiles([
    new File(["one"], "one.txt", { type: "text/plain" }),
    new File(["two"], "two.txt", { type: "text/plain" }),
  ]);
  expect(wrapper.text()).toContain("one.txt");
  expect(wrapper.text()).toContain("two.txt");
  expect(wrapper.emitted("send")).toBeUndefined();
  expect(wrapper.get("textarea").element.value).toBe("Keep this draft");
  expect(wrapper.get(".send-button").attributes("disabled")).toBeDefined();
  await wrapper.get("textarea").trigger("keydown", { key: "Enter", shiftKey: true });
  expect(wrapper.emitted("send")).toBeUndefined();
  expect(wrapper.get("textarea").element.value).toBe("Keep this draft");
  await wrapper.get('button[aria-label="Retry upload two.txt"]').trigger("click");
  const { flushPromises } = await import("@vue/test-utils");
  await flushPromises();
  expect(wrapper.find('button[aria-label="Retry upload two.txt"]').exists()).toBe(false);
  expect(wrapper.get(".send-button").attributes("disabled")).toBeUndefined();
  await wrapper.get("textarea").trigger("keydown", { key: "Enter", shiftKey: true });
  expect(wrapper.emitted("send")?.[0]).toMatchObject([
    "Keep this draft",
    [
      { name: "one.txt", path: "/uploads/one.txt" },
      { name: "two.txt", path: "/uploads/two.txt" },
    ],
  ]);
  expect(upload.mock.calls.every(([profile]) => profile === "work")).toBe(true);
  upload.mockRestore();
  wrapper.unmount();
});
