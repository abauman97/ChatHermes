// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import ActivityRow from "./ActivityRow.vue";
import type { Activity } from "../types/hermes";

const tool: Activity = {
  id: "search",
  kind: "tool",
  toolName: "session_search",
  title: "Searching previous sessions",
  content: '{"query":"previous discussion"}',
  output: "Arriving search result",
  complete: false,
  state: "pending",
  duration: 1.2,
};

describe("active tool presentation", () => {
  it("shows only the tool name while pending, running and receiving output", async () => {
    const wrapper = mount(ActivityRow, { props: { activity: tool } });
    for (const state of ["pending", "running"] as const) {
      await wrapper.setProps({ activity: { ...tool, state, output: "More output\n".repeat(100) } });
      expect(wrapper.text()).toBe("Using tool: Session search");
      expect(wrapper.get('[role="status"]').text()).toBe("Using tool: Session search");
      expect(wrapper.find(".working-shimmer, strong, b").exists()).toBe(false);
      expect(wrapper.find("details, summary, pre").exists()).toBe(false);
      expect(wrapper.findAll("p")).toHaveLength(0);
    }
  });

  it.each([
    ["  session__search  ", "Session search"],
    ["web\tsearch", "Web search"],
    ["", "Tool"],
    ["___", "Tool"],
  ])("normalizes tool name %j", (toolName, label) => {
    const wrapper = mount(ActivityRow, { props: { activity: { ...tool, toolName } } });
    expect(wrapper.get('[role="status"]').text()).toBe(`Using tool: ${label}`);
  });

  it.each(["completed", "failed"] as const)(
    "restores collapsed, inspectable details when %s",
    async (state) => {
      const wrapper = mount(ActivityRow, { props: { activity: tool } });
      await wrapper.setProps({
        activity: { ...tool, title: "Searched sessions", complete: true, state },
      });
      const details = wrapper.get("details");
      expect(details.attributes("open")).toBeUndefined();
      expect(wrapper.find(".working-shimmer, .active-tool").exists()).toBe(false);
      expect(wrapper.get("summary").text()).toContain("Searched sessions");
      expect(wrapper.get("summary").text()).toContain("1.2s");
      expect(wrapper.get("summary").text().includes("Failed")).toBe(state === "failed");
      (details.element as HTMLDetailsElement).open = true;
      await details.trigger("toggle");
      expect(details.attributes("open")).toBeDefined();
      expect(wrapper.get("pre").text()).toBe(
        [tool.toolName, tool.content, tool.output].join("\n\n"),
      );
    },
  );

  it("restores a collapsed disclosure when the turn ends before the tool completes", async () => {
    const wrapper = mount(ActivityRow, { props: { activity: tool } });
    await wrapper.setProps({ turnComplete: true });
    expect(wrapper.get("details").attributes("open")).toBeUndefined();
    expect(wrapper.get("pre").text()).toContain(tool.content);
    expect(wrapper.find(".active-tool, .working-shimmer").exists()).toBe(false);
  });

  it("keeps arriving reasoning in its open disclosure", () => {
    const wrapper = mount(ActivityRow, {
      props: { activity: { ...tool, kind: "thinking", title: "Thinking…" } },
    });
    expect(wrapper.get("details").attributes("open")).toBeDefined();
    expect(wrapper.get("summary .working-shimmer").text()).toBe("Thinking…");
    expect(wrapper.get("pre").text()).toContain(tool.content);
  });
});
