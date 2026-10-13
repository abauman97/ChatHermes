// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import ActivityRow from "./ActivityRow.vue";
import type { Activity } from "../types/hermes";
const tool: Activity = {
  id: "a",
  kind: "tool",
  toolName: "session_search",
  title: "Searching sessions",
  content: '{"query":"old chat"}',
  output: "First result",
  complete: false,
  state: "running",
};
describe("activity disclosures", () => {
  it.each(["session_search", "terminal", "execute_code", "python"])(
    "keeps %s collapsed by default through pending, streaming, and completion",
    async (toolName) => {
      const activity = { ...tool, toolName, state: "pending" as const };
      const wrapper = mount(ActivityRow, { props: { activity } });
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
      expect(wrapper.get("summary").text()).toContain("Waiting…");
      await wrapper.setProps({
        activity: { ...activity, state: "running", output: "More results" },
      });
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
      expect(wrapper.get("summary").text()).toContain("Running…");
      expect(wrapper.get("pre").text()).toContain("More results");
      await wrapper.setProps({ activity: { ...activity, complete: true, state: "completed" } });
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
    },
  );
  it("streams output when manually expanded and preserves expansion through completion", async () => {
    const wrapper = mount(ActivityRow, { props: { activity: tool } });
    await wrapper.get("summary").trigger("click");
    expect(wrapper.get("details").attributes("open")).toBeDefined();
    await wrapper.setProps({ activity: { ...tool, output: "More results" } });
    expect(wrapper.get("details").attributes("open")).toBeDefined();
    expect(wrapper.get("pre").text()).toContain("More results");
    await wrapper.setProps({ activity: { ...tool, complete: true, state: "completed" } });
    expect(wrapper.get("details").attributes("open")).toBeDefined();
  });
  it("preserves manual collapse through streaming and a failed result", async () => {
    const wrapper = mount(ActivityRow, { props: { activity: tool } });
    await wrapper.get("summary").trigger("click");
    await wrapper.get("summary").trigger("click");
    await wrapper.setProps({ activity: { ...tool, output: "More results" } });
    expect(wrapper.get("details").attributes("open")).toBeUndefined();
    await wrapper.setProps({ activity: { ...tool, complete: true, state: "failed" } });
    expect(wrapper.get("details").attributes("open")).toBeUndefined();
    expect(wrapper.get("summary").text()).toContain("Failed");
    expect(wrapper.get("details").classes()).toContain("activity-failed");
  });
  it.each(["failed", "interrupted", "unknown"] as const)(
    "keeps an untouched streaming tool collapsed when its result becomes %s",
    async (state) => {
      const wrapper = mount(ActivityRow, { props: { activity: tool } });
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
      await wrapper.get("details").trigger("toggle");
      await wrapper.setProps({ activity: { ...tool, complete: true, state } });
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
    },
  );
  it.each(["failed", "interrupted", "unknown"] as const)(
    "keeps restored %s results collapsed with indicators and manual toggling",
    async (state) => {
      const wrapper = mount(ActivityRow, {
        props: { activity: { ...tool, complete: true, state } },
      });
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
      expect(wrapper.get("details").classes()).toContain("activity-failed");
      expect(wrapper.get("summary").text()).toContain(
        state === "unknown" ? "Result unavailable" : state === "failed" ? "Failed" : "Interrupted",
      );
      await wrapper.get("summary").trigger("click");
      expect(wrapper.get("details").attributes("open")).toBeDefined();
      expect(wrapper.get("pre").text()).toContain(tool.output);
      await wrapper.get("summary").trigger("click");
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
    },
  );
  it.each(["failed", "interrupted", "unknown"] as const)(
    "preserves manual collapse when a streaming tool becomes %s",
    async (state) => {
      const wrapper = mount(ActivityRow, { props: { activity: tool } });
      (wrapper.get("details").element as HTMLDetailsElement).open = false;
      await wrapper.get("details").trigger("toggle");
      await wrapper.setProps({ activity: { ...tool, complete: true, state } });
      expect(wrapper.get("details").attributes("open")).toBeUndefined();
      expect(wrapper.get("details").classes()).toContain("activity-failed");
      (wrapper.get("details").element as HTMLDetailsElement).open = true;
      await wrapper.get("details").trigger("toggle");
      expect(wrapper.get("details").attributes("open")).toBeDefined();
    },
  );
  it("does not claim an unfinished historical tool succeeded", () => {
    const wrapper = mount(ActivityRow, { props: { activity: tool, turnComplete: true } });
    expect(wrapper.get("summary").text()).toContain("Result unavailable");
    expect(wrapper.get("details").attributes("open")).toBeUndefined();
    expect(wrapper.find(".working-shimmer").exists()).toBe(false);
  });
  it("streams reasoning independently and collapses untouched completed thoughts", async () => {
    const thinking: Activity = {
      id: "r",
      kind: "thinking",
      title: "Thinking…",
      content: "First",
      complete: false,
    };
    const wrapper = mount(ActivityRow, { props: { activity: thinking } });
    await wrapper.setProps({ activity: { ...thinking, content: "First second" } });
    expect(wrapper.get("details").attributes("open")).toBeDefined();
    expect(wrapper.get("pre").text()).toBe("First second");
    await wrapper.setProps({ activity: { ...thinking, complete: true, duration: 2.5 } });
    expect(wrapper.get("details").attributes("open")).toBeUndefined();
    expect(wrapper.get("summary").text()).toContain("Thought");
    expect(wrapper.get("summary").text()).toContain("2.5s");
  });
  it("honors native keyboard disclosure changes without treating automatic toggle as intent", async () => {
    const wrapper = mount(ActivityRow, { props: { activity: tool } });
    await wrapper.get("details").trigger("toggle");
    await wrapper.setProps({ activity: { ...tool, complete: true, state: "completed" } });
    expect(wrapper.get("details").attributes("open")).toBeUndefined();
    (wrapper.get("details").element as HTMLDetailsElement).open = true;
    await wrapper.get("details").trigger("toggle");
    expect(wrapper.get("details").attributes("open")).toBeDefined();
    await wrapper.setProps({ activity: { ...tool, output: "More results" } });
    expect(wrapper.get("details").attributes("open")).toBeDefined();
    (wrapper.get("details").element as HTMLDetailsElement).open = false;
    await wrapper.get("details").trigger("toggle");
    await wrapper.setProps({ activity: { ...tool, complete: true, state: "failed" } });
    expect(wrapper.get("details").attributes("open")).toBeUndefined();
    expect(wrapper.get("summary").text()).toContain("Failed");
  });
});

it("follows arriving output only while the reader stays at the preview bottom", async () => {
  const wrapper = mount(ActivityRow, { props: { activity: tool } });
  await wrapper.get("summary").trigger("click");
  const element = wrapper.get("pre").element as HTMLElement;
  Object.defineProperties(element, {
    scrollHeight: { value: 500, configurable: true },
    clientHeight: { value: 240 },
  });
  await wrapper.setProps({ activity: { ...tool, output: "New output" } });
  expect(element.scrollTop).toBe(500);
  element.scrollTop = 50;
  await wrapper.get("pre").trigger("scroll");
  Object.defineProperty(element, "scrollHeight", { value: 600 });
  await wrapper.setProps({ activity: { ...tool, output: "More output" } });
  expect(element.scrollTop).toBe(50);
});

it("keeps a delegated task live and collapsed after the parent settles", () => {
  const wrapper = mount(ActivityRow, {
    props: { activity: { ...tool, delegated: true }, turnComplete: true },
  });
  expect(wrapper.get("summary").text()).toContain("Running…");
  expect(wrapper.get("details").attributes("open")).toBeUndefined();
});
