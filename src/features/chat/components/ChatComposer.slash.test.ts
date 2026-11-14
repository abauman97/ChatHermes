// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import ChatComposer from "./ChatComposer.vue";
import type { SlashComplete, SlashCompletion } from "../commands/useSlashCompletion";
const result: SlashCompletion = {
  catalog: { pairs: [["/plan", "Plan a task"]], commands: { "/plan": { argument_mode: "text" } } },
  items: [
    { text: "/plan", meta: "Plan a task", kind: "command" },
    { text: "/work", meta: "A skill", kind: "skill" },
  ],
  replace_from: 1,
};
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function setup(completeSlash: SlashComplete = vi.fn(async () => result)) {
  vi.useFakeTimers();
  vi.stubGlobal("innerWidth", 1200);
  const wrapper = mount(ChatComposer, {
    attachTo: document.body,
    props: { disabled: false, sending: false, profile: "alpha", completeSlash },
  });
  const area = wrapper.get("textarea");
  area.element.focus();
  return { wrapper, area, completeSlash };
}
async function loaded() {
  await vi.advanceTimersByTimeAsync(110);
  await flushPromises();
}
describe("native slash completion", () => {
  it("shows native descriptions and accepts Enter without sending or duplicating the slash", async () => {
    const { wrapper, area, completeSlash } = setup();
    try {
      await area.setValue("/p");
      await loaded();
      expect(completeSlash).toHaveBeenCalledWith("/p");
      expect(wrapper.get('[role="listbox"]').text()).toContain("Plan a task");
      await area.trigger("keydown", { key: "Enter" });
      await flushPromises();
      expect(area.element.value).toBe("/plan ");
      expect(wrapper.emitted("send")).toBeUndefined();
      expect(document.activeElement).toBe(area.element);
      await area.trigger("keydown", { key: "Escape" });
      await area.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("send")).toEqual([["/plan", []]]);
    } finally {
      wrapper.unmount();
    }
  });
  it("uses native argument replacement columns and touch insertion", async () => {
    const completeSlash = vi.fn(async () => ({
      ...result,
      replace_from: 6,
      items: [{ text: "status", meta: "Read goal" }],
    }));
    const { wrapper, area } = setup(completeSlash);
    try {
      await area.setValue("/goal st");
      await loaded();
      await wrapper.get('[role="option"]').trigger("click");
      await flushPromises();
      expect(area.element.value).toBe("");
      expect(wrapper.emitted("send")).toBeUndefined();
      expect(document.activeElement).toBe(area.element);
    } finally {
      wrapper.unmount();
    }
  });
  it("supports arrow navigation and Tab with accessible selection", async () => {
    const { wrapper, area } = setup();
    try {
      await area.setValue("/");
      await loaded();
      await area.trigger("keydown", { key: "ArrowDown" });
      expect(wrapper.findAll('[role="option"]')[1]!.attributes("aria-selected")).toBe("true");
      await area.trigger("keydown", { key: "Tab" });
      await flushPromises();
      expect(area.element.value).toBe("");
    } finally {
      wrapper.unmount();
    }
  });
  it("discards late results after profile/session/project scope changes", async () => {
    let finish!: (value: SlashCompletion) => void;
    const completeSlash = vi.fn(
      () =>
        new Promise<SlashCompletion>((resolve) => {
          finish = resolve;
        }),
    );
    const { wrapper, area } = setup(completeSlash);
    try {
      await area.setValue("/");
      await loaded();
      await wrapper.setProps({ profile: "beta", sessionId: "other", slashScope: "project-b" });
      finish(result);
      await flushPromises();
      expect(wrapper.findAll('[role="option"]')).toHaveLength(0);
    } finally {
      wrapper.unmount();
    }
  });
  it("keeps ordinary text, paths, multiline editing and IME confirmation intact", async () => {
    const { wrapper, area, completeSlash } = setup();
    try {
      for (const text of [
        "explain /usr/local",
        "/usr/local",
        "```\n/plan\n```",
        "/plan\nline two",
      ]) {
        await area.setValue(text);
        await loaded();
      }
      expect(completeSlash).not.toHaveBeenCalled();
      await area.setValue("/");
      await loaded();
      await area.trigger("compositionstart");
      await area.trigger("keydown", { key: "Enter", isComposing: true });
      expect(area.element.value).toBe("/");
      expect(wrapper.emitted("send")).toBeUndefined();
      await area.trigger("compositionend");
      await area.trigger("keydown", { key: "Escape" });
      expect(area.element.value).toBe("/");
    } finally {
      wrapper.unmount();
    }
  });
  it("shows discovery failure without sending Enter through an open menu", async () => {
    const { wrapper, area } = setup(
      vi.fn(async () => {
        throw new Error("unavailable");
      }),
    );
    try {
      await area.setValue("/");
      await loaded();
      expect(wrapper.text()).toContain("Command discovery unavailable");
      await area.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("send")).toBeUndefined();
    } finally {
      wrapper.unmount();
    }
  });
  it("never forwards slash input through message steering while busy", async () => {
    const { wrapper, area } = setup();
    try {
      await wrapper.setProps({ sending: true, stoppable: true });
      await area.setValue("/goal test");
      await wrapper.get(".send-button").trigger("click");
      expect(wrapper.emitted("steer")).toBeUndefined();
      expect(area.element.value).toBe("/goal test");
    } finally {
      wrapper.unmount();
    }
  });
});

it("preserves the pin's slash-less exact completion and single trailing space", async () => {
  const completeSlash = vi.fn(async () => ({
    ...result,
    items: [{ text: "plan ", display: "/plan", meta: "Plan" }],
  }));
  const { wrapper, area } = setup(completeSlash);
  try {
    await area.setValue("/plan");
    await loaded();
    await area.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(area.element.value).toBe("/plan ");
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    await area.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("send")).toEqual([["/plan", []]]);
  } finally {
    wrapper.unmount();
  }
});

it("restores a refused slash draft without covering its command result with a new menu", async () => {
  const { wrapper, area } = setup();
  try {
    (wrapper.vm as unknown as { restoreDraft: (text: string, files: []) => void }).restoreDraft(
      "/history",
      [],
    );
    await flushPromises();
    await loaded();
    expect(area.element.value).toBe("/history");
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  } finally {
    wrapper.unmount();
  }
});

it("preserves text after the cursor when completing a command argument", async () => {
  const completeSlash = vi.fn(async () => ({
    ...result,
    replace_from: 6,
    items: [{ text: "status", meta: "Read goal" }],
  }));
  const { wrapper, area } = setup(completeSlash);
  try {
    await area.setValue("/goal st keep this suffix");
    area.element.setSelectionRange(8, 8);
    await area.trigger("click");
    await loaded();
    expect(completeSlash).toHaveBeenLastCalledWith("/goal st");
    await area.trigger("keydown", { key: "Tab" });
    await flushPromises();
    expect(area.element.value).toBe("keep this suffix");
    expect(area.element.selectionStart).toBe(0);
    expect(wrapper.emitted("send")).toBeUndefined();
  } finally {
    wrapper.unmount();
  }
});

it("translates Python completion columns to textarea offsets after Unicode", async () => {
  const completeSlash = vi.fn(async () => ({
    ...result,
    replace_from: 8,
    items: [{ text: "status", meta: "Read goal" }],
  }));
  const { wrapper, area } = setup(completeSlash);
  try {
    await area.setValue("/goal 😀 st");
    await loaded();
    await wrapper.get('[role="option"]').trigger("click");
    await flushPromises();
    expect(area.element.value).toBe("");
    expect(area.element.selectionStart).toBe(0);
  } finally {
    wrapper.unmount();
  }
});

it("descends from a command into finite arguments, commits a directive and submits on the next Enter", async () => {
  const completeSlash = vi.fn(async (text: string) => ({
    catalog: { commands: { "/heartbeat": { argument_mode: "options" as const } } },
    replace_from: text.includes(" ") ? 11 : 1,
    items: text.includes(" ")
      ? [{ text: "status", meta: "Read heartbeat" }]
      : [{ text: "/heartbeat", meta: "Heartbeat" }],
  }));
  const { wrapper, area } = setup(completeSlash);
  try {
    await area.setValue("/heart");
    await loaded();
    await area.trigger("keydown", { key: "Tab" });
    await loaded();
    expect(completeSlash).toHaveBeenLastCalledWith("/heartbeat ");
    expect(wrapper.get('[role="option"]').text()).toContain("Read heartbeat");
    expect(wrapper.find('[aria-label^="Edit command"]').exists()).toBe(false);
    await area.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(area.element.value).toBe("");
    expect(wrapper.get('[aria-label="Edit command /heartbeat status"]').text()).toBe(
      "/heartbeat status",
    );
    expect(wrapper.emitted("send")).toBeUndefined();
    await area.trigger("keyup", { key: "Enter" });
    await loaded();
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    await area.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("send")).toEqual([["/heartbeat status", []]]);
  } finally {
    wrapper.unmount();
  }
});

it("lets exact finite arguments submit without an empty popover trapping Enter", async () => {
  const { wrapper, area } = setup(
    vi.fn(async () => ({
      catalog: { commands: { "/heartbeat": { argument_mode: "options" as const } } },
      replace_from: 11,
      items: [],
    })),
  );
  try {
    await area.setValue("/heartbeat status");
    await loaded();
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    await area.trigger("keydown", { key: "Tab" });
    await flushPromises();
    expect(area.element.value).toBe("");
    await wrapper.get('[aria-label="Edit command /heartbeat status"]').trigger("click");
    await flushPromises();
    expect(area.element.value).toBe("/heartbeat status ");
    expect(wrapper.find('[aria-label^="Edit command"]').exists()).toBe(false);
    expect(area.element.selectionStart).toBe(0);
    expect(area.element.selectionEnd).toBe(17);
    await area.setValue("/heartbeat status");
    await loaded();
    await area.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("send")).toEqual([["/heartbeat status", []]]);
  } finally {
    wrapper.unmount();
  }
});

it("preserves mixed prose on Space and Enter while Tab or deliberate arrows select an argument", async () => {
  const { wrapper, area } = setup(
    vi.fn(async () => ({
      catalog: { commands: { "/goal": { argument_mode: "mixed" as const } } },
      replace_from: 6,
      items: [{ text: "status", meta: "Goal status" }],
    })),
  );
  try {
    await area.setValue("/goal ship the redesign");
    await loaded();
    await area.trigger("keydown", { key: " " });
    expect(area.element.value).toBe("/goal ship the redesign");
    await area.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("send")).toEqual([["/goal ship the redesign", []]]);
    await area.setValue("/goal st");
    await loaded();
    await area.trigger("keydown", { key: "ArrowDown" });
    await area.trigger("keyup", { key: "ArrowDown" });
    await area.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(area.element.value).toBe("");
    expect(wrapper.emitted("send")).toHaveLength(1);
  } finally {
    wrapper.unmount();
  }
});

it("prefers an exact typed command over the default fuzzy highlight and accepts Space", async () => {
  const { wrapper, area } = setup(
    vi.fn(async () => ({
      catalog: {},
      replace_from: 1,
      items: [{ text: "/status-long" }, { text: "/status" }],
    })),
  );
  try {
    await area.setValue("/status");
    await loaded();
    await area.trigger("keydown", { key: " " });
    await flushPromises();
    expect(area.element.value).toBe("");
    expect(wrapper.find('[aria-label="Edit command /status"]').exists()).toBe(true);
    expect(wrapper.emitted("send")).toBeUndefined();
  } finally {
    wrapper.unmount();
  }
});

it("does not replace an unrelated typed command with a leftover fuzzy suggestion", async () => {
  const { wrapper, area } = setup(
    vi.fn(async () => ({
      catalog: {},
      replace_from: 1,
      items: [{ text: "/compress" }],
    })),
  );
  try {
    await area.setValue("/review");
    await loaded();
    await area.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("send")).toEqual([["/review", []]]);
  } finally {
    wrapper.unmount();
  }
});

it("offers only skill references inside prose and preserves both sides of the caret", async () => {
  const { wrapper, area, completeSlash } = setup();
  try {
    await area.setValue("Please use /wo for this");
    area.element.setSelectionRange(14, 14);
    await area.trigger("click");
    await loaded();
    expect(completeSlash).toHaveBeenLastCalledWith("/wo");
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1);
    await area.trigger("keydown", { key: "Tab" });
    await flushPromises();
    expect(area.element.value).toBe("Please use /work for this");
    expect(wrapper.emitted("send")).toBeUndefined();
  } finally {
    wrapper.unmount();
  }
});

it("releases Tab after directive acceptance instead of repeatedly consuming it", async () => {
  const { wrapper, area } = setup(
    vi.fn(async () => ({
      catalog: { commands: { "/heartbeat": { argument_mode: "options" as const } } },
      replace_from: 11,
      items: [],
    })),
  );
  try {
    await area.setValue("/heartbeat status");
    await loaded();
    await area.trigger("keydown", { key: "Tab" });
    await flushPromises();
    const tab = new KeyboardEvent("keydown", { key: "Tab", cancelable: true, bubbles: true });
    area.element.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
    expect(area.element.value).toBe("");
  } finally {
    wrapper.unmount();
  }
});

it("offers skills for a bare inline slash even after a leading command", async () => {
  const { wrapper, area, completeSlash } = setup();
  try {
    await area.setValue("/goal use /");
    await loaded();
    expect(completeSlash).toHaveBeenLastCalledWith("/");
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1);
    await area.trigger("keydown", { key: "Tab" });
    await flushPromises();
    expect(area.element.value).toBe("/goal use /work ");
    expect(wrapper.emitted("send")).toBeUndefined();
  } finally {
    wrapper.unmount();
  }
});

async function heartbeatChip() {
  const state = setup(
    vi.fn(async (text: string) => ({
      catalog: { commands: { "/heartbeat": { argument_mode: "options" as const } } },
      replace_from: text === "/wo" ? 1 : 11,
      items: text === "/wo" ? [{ text: "/work", kind: "skill" }] : [],
    })),
  );
  await state.area.setValue("/heartbeat status");
  await loaded();
  await state.area.trigger("keydown", { key: "Tab" });
  await flushPromises();
  return state;
}

it("shows only suffix text, retaining one invocation when suffixes are replaced or cleared", async () => {
  const { wrapper, area } = await heartbeatChip();
  try {
    expect(area.element.value).toBe("");
    expect(wrapper.get(".send-button").attributes("disabled")).toBeUndefined();
    await area.setValue("😀 free text\nsecond line");
    expect(area.element.value).toBe("😀 free text\nsecond line");
    expect(wrapper.get('[aria-label="Edit command /heartbeat status"]').text()).toBe(
      "/heartbeat status",
    );
    await area.setValue("replacement");
    await area.setValue("");
    await wrapper.get(".send-button").trigger("click");
    expect(wrapper.emitted("send")).toEqual([["/heartbeat status", []]]);
    await flushPromises();
    expect(wrapper.find('[aria-label^="Edit command"]').exists()).toBe(false);
  } finally {
    wrapper.unmount();
  }
});

it("maps inline skill completion and the caret through a chip without losing suffix text", async () => {
  const { wrapper, area, completeSlash } = await heartbeatChip();
  try {
    await area.setValue("😀 use /wo keep this");
    area.element.setSelectionRange(10, 10);
    await area.trigger("click");
    await loaded();
    expect(completeSlash).toHaveBeenLastCalledWith("/wo");
    await area.trigger("keydown", { key: "Tab" });
    await flushPromises();
    expect(area.element.value).toBe("😀 use /work keep this");
    expect(area.element.selectionStart).toBe(12);
    await wrapper.get(".send-button").trigger("click");
    expect(wrapper.emitted("send")).toEqual([["/heartbeat status 😀 use /work keep this", []]]);
  } finally {
    wrapper.unmount();
  }
});

it("reveals a chip with Backspace for native selection, replacement and deletion", async () => {
  const { wrapper, area } = await heartbeatChip();
  try {
    await area.setValue("keep this");
    area.element.setSelectionRange(0, 0);
    await area.trigger("keydown", { key: "Backspace" });
    await flushPromises();
    expect(area.element.value).toBe("/heartbeat status keep this");
    expect([area.element.selectionStart, area.element.selectionEnd]).toEqual([0, 17]);
    expect(document.activeElement).toBe(area.element);
    expect(wrapper.find('[aria-label^="Edit command"]').exists()).toBe(false);
    await area.setValue("keep this");
    await wrapper.get(".send-button").trigger("click");
    expect(wrapper.emitted("send")).toEqual([["keep this", []]]);
  } finally {
    wrapper.unmount();
  }
});

it("invalidates chip presentation on session changes and preserves the full unsent draft", async () => {
  const { wrapper, area } = await heartbeatChip();
  try {
    await area.setValue("unsent suffix");
    await wrapper.setProps({ sending: true, stoppable: true });
    await wrapper.get(".send-button").trigger("click");
    expect(wrapper.emitted("steer")).toBeUndefined();
    expect(area.element.value).toBe("unsent suffix");
    await wrapper.setProps({ sessionId: "other" });
    await flushPromises();
    expect(area.element.value).toBe("/heartbeat status unsent suffix");
    expect(wrapper.find('[aria-label^="Edit command"]').exists()).toBe(false);
    area.element.focus();
    expect(document.activeElement).toBe(area.element);
    await wrapper.get(".send-button").trigger("click");
    expect(wrapper.emitted("steer")).toBeUndefined();
    expect(wrapper.emitted("send")).toBeUndefined();
    expect(area.element.value).toBe("/heartbeat status unsent suffix");
  } finally {
    wrapper.unmount();
  }
});

it("keeps a chip-only draft when a refused request returns, then restores the queued draft", async () => {
  const { wrapper, area } = await heartbeatChip();
  try {
    (wrapper.vm as unknown as { restoreDraft: (text: string, files: []) => void }).restoreDraft(
      "/history",
      [],
    );
    await flushPromises();
    expect(area.element.value).toBe("");
    expect(wrapper.find('[aria-label="Edit command /heartbeat status"]').exists()).toBe(true);
    const restore = wrapper.get("details button");
    expect(restore.attributes("disabled")).toBeDefined();
    expect(wrapper.get("details").text()).toContain("/history");
    await wrapper.get(".send-button").trigger("click");
    await flushPromises();
    expect(wrapper.emitted("send")).toEqual([["/heartbeat status", []]]);
    expect(restore.attributes("disabled")).toBeUndefined();
    await restore.trigger("click");
    expect(area.element.value).toBe("/history");
    expect(wrapper.find('[aria-label^="Edit command"]').exists()).toBe(false);
  } finally {
    wrapper.unmount();
  }
});
