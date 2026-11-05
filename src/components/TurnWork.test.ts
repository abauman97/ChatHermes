// @vitest-environment jsdom
import { expect, it } from "vite-plus/test";
import { reactive, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import TurnWork from "./TurnWork.vue";
import type { Activity } from "../types/hermes";
// Read v-show directly: jsdom can cache computed styles across streamed updates.
const rowShown = (row: { element: Element }) =>
  (row.element.parentElement as HTMLElement).style.display !== "none";
const tool: Activity = {
  id: "a",
  kind: "tool",
  toolName: "custom_tool",
  title: "Used tool",
  content: "{}",
  output: "Done",
  complete: true,
  state: "completed",
};
it("collapses consecutive completed calls to a count with inspectable rows below", async () => {
  const wrapper = mount(TurnWork, {
    props: { activities: [tool, { ...tool, id: "b" }], working: false },
  });
  expect(wrapper.get(".work-summary").text()).toContain("Used 2 tools");
  expect(
    wrapper
      .findAll(".work-timeline > div")
      .every((row) => row.attributes("style")?.includes("display: none")),
  ).toBe(true);
  await wrapper.get(".work-summary").trigger("click");
  expect(
    wrapper
      .findAll(".work-timeline > div")
      .every((row) => !row.attributes("style")?.includes("display: none")),
  ).toBe(true);
  await wrapper.get(".activity summary").trigger("click");
  expect(wrapper.get(".activity pre").isVisible()).toBe(true);
});
it("keeps a lone row mounted and its disclosure choice when a second call arrives", async () => {
  const wrapper = mount(TurnWork, { props: { activities: [tool], working: true } });
  expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
  const row = wrapper.get(".activity").element;
  await wrapper.get("summary").trigger("click");
  await wrapper.setProps({
    activities: [tool, { ...tool, id: "b", complete: false, state: "running" }],
  });
  expect(wrapper.get(".activity").element).toBe(row);
  expect(wrapper.get(".activity").attributes("open")).toBeDefined();
  expect(wrapper.get(".work-summary").text()).toContain("Used 1 tool");
  expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
  expect(rowShown(wrapper.get(".activity"))).toBe(false);
  expect(rowShown(wrapper.get(".current-activity .activity"))).toBe(true);
  await wrapper.setProps({ activities: [tool, { ...tool, id: "b" }], working: false });
  expect(wrapper.get(".work-summary").text()).toContain("Used 2 tools");
  await wrapper.get(".work-summary").trigger("click");
  expect(wrapper.get(".activity").attributes("open")).toBeDefined();
});

it("summarizes settled calls as a reactive stream grows without exposing completed rows", async () => {
  const activities = reactive<Activity[]>([{ ...tool, complete: false, state: "running" }]);
  const wrapper = mount(TurnWork, { props: { activities, working: true } });
  const first = wrapper.get(".activity").element;
  activities[0]!.complete = true;
  activities[0]!.state = "completed";
  activities.push({ ...tool, id: "b", complete: false, state: "running", output: "partial" });
  await nextTick();
  const second = wrapper.findAll(".activity")[1]!;
  const secondElement = second.element;
  expect(wrapper.get(".work-summary").text()).toContain("Used 1 tool");
  expect(wrapper.get(".activity").element).toBe(first);
  expect(rowShown(wrapper.get(".activity"))).toBe(false);
  expect(rowShown(second)).toBe(true);
  expect(second.attributes("open")).toBeUndefined();
  expect(second.get("summary").text()).toContain("Running…");
  activities[1]!.output += " arriving output";
  activities.push({ ...tool, id: "c", complete: false, state: "pending" });
  await nextTick();
  expect(wrapper.findAll(".current-activity")).toHaveLength(2);
  expect(second.attributes("open")).toBeUndefined();
  expect(wrapper.get(".current-activity:last-child summary").text()).toContain("Waiting…");
  expect(second.get("pre").text()).toContain("arriving output");
  activities[1]!.complete = true;
  activities[1]!.state = "completed";
  await nextTick();
  expect(wrapper.get(".work-summary").text()).toContain("Used 2 tools");
  expect(second.element).toBe(secondElement);
  expect(rowShown(second)).toBe(false);
  expect(wrapper.findAll(".current-activity")).toHaveLength(1);
  expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
  await wrapper.get(".work-summary").trigger("click");
  expect(rowShown(second)).toBe(true);
  await second.get("summary").trigger("click");
  expect(second.attributes("open")).toBeDefined();
  await wrapper.get(".work-summary").trigger("click");
  expect(rowShown(wrapper.get(".current-activity .activity"))).toBe(true);
  activities[2]!.complete = true;
  activities[2]!.state = "completed";
  await nextTick();
  expect(wrapper.get(".work-summary").text()).toContain("Used 3 tools");
  expect(wrapper.findAll(".current-activity")).toHaveLength(0);
  expect(wrapper.findAll(".activity").every((row) => !rowShown(row))).toBe(true);
  wrapper.unmount();
});

it("keeps live tool summaries visible while collapsed and streams details on demand", async () => {
  const activities = reactive<Activity[]>([
    tool,
    {
      ...tool,
      id: "live",
      complete: false,
      state: "pending",
      content: '{"query":',
      output: "",
    },
  ]);
  const wrapper = mount(TurnWork, { props: { activities, working: true } });
  const groupSummary = wrapper.get(".work-summary");
  const live = wrapper.get(".current-activity .activity");
  const element = live.element;
  expect(groupSummary.attributes("aria-expanded")).toBe("false");
  expect(rowShown(live)).toBe(true);
  expect(live.attributes("open")).toBeUndefined();
  expect(live.get("summary").isVisible()).toBe(true);
  expect(live.get("summary").text()).toContain("Waiting…");
  activities[1]!.state = "running";
  activities[1]!.content = '{"query":"arriving input"}';
  activities[1]!.output = "First output";
  await nextTick();
  expect(live.attributes("open")).toBeUndefined();
  expect(live.get("summary").text()).toContain("Running…");
  await live.get("summary").trigger("click");
  expect(live.attributes("open")).toBeDefined();
  activities[1]!.content = '{"query":"updated input"}';
  activities[1]!.output += " and streamed output";
  await nextTick();
  expect(live.get("pre").isVisible()).toBe(true);
  expect(live.get("pre").text()).toContain("updated input");
  expect(live.get("pre").text()).toContain("streamed output");
  await groupSummary.trigger("click");
  await groupSummary.trigger("click");
  expect(rowShown(live)).toBe(true);
  expect(live.attributes("open")).toBeDefined();
  activities[1]!.complete = true;
  activities[1]!.state = "completed";
  await nextTick();
  expect(rowShown(live)).toBe(false);
  await groupSummary.trigger("click");
  expect(live.element).toBe(element);
  expect(live.attributes("open")).toBeDefined();
  expect(live.get("pre").isVisible()).toBe(true);
  wrapper.unmount();
});

it("keeps concurrent active calls visible and ordered when results arrive out of order", async () => {
  const activities: Activity[] = ["a", "b", "c"].map((id) => ({
    ...tool,
    id,
    complete: false,
    state: "running",
    output: id,
  }));
  const wrapper = mount(TurnWork, { props: { activities, working: true } });
  const elements = wrapper.findAll(".activity").map((row) => row.element);
  expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
  expect(wrapper.findAll(".current-activity")).toHaveLength(3);
  expect(wrapper.findAll(".activity").every((row) => row.attributes("open") === undefined)).toBe(
    true,
  );
  await wrapper.setProps({
    activities: activities.map((row) =>
      row.id === "b" ? { ...row, complete: true, state: "completed" } : row,
    ),
  });
  expect(wrapper.get(".work-summary").text()).toContain("Used 1 tool");
  expect(wrapper.findAll(".activity").map((row) => row.element)).toEqual(elements);
  expect(wrapper.findAll(".activity").map((row) => rowShown(row))).toEqual([true, false, true]);
  await wrapper.get(".work-summary").trigger("click");
  expect(wrapper.findAll(".activity pre").map((row) => row.text().split("\n").at(-1))).toEqual([
    "a",
    "b",
    "c",
  ]);
  expect(wrapper.findAll(".activity").every(rowShown)).toBe(true);
  await wrapper.get(".work-summary").trigger("click");
  expect(wrapper.findAll(".current-activity").every((row) => row.isVisible())).toBe(true);
  wrapper.unmount();
});

it.each(["interrupted", "unknown"] as const)(
  "summarizes %s results and keeps their details inside the collapsed history",
  (state) => {
    const wrapper = mount(TurnWork, {
      props: {
        working: true,
        activities: [
          tool,
          { ...tool, id: "problem", state },
          { ...tool, id: "live", complete: false, state: "running" },
        ],
      },
      slots: { result: '<div class="result">Delivered artifact</div>' },
    });
    expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
    expect(rowShown(wrapper.get(".activity"))).toBe(false);
    expect(rowShown(wrapper.get(".activity-failed"))).toBe(false);
    expect(wrapper.get(".activity-failed").attributes("open")).toBeUndefined();
    expect(wrapper.get(".work-summary").text()).toContain(
      state === "unknown" ? "results unavailable" : "interrupted",
    );
    expect(wrapper.get(".current-activity").isVisible()).toBe(true);
    expect(wrapper.findAll(".result").every((row) => row.isVisible())).toBe(true);
    wrapper.unmount();
  },
);

it.each(["terminal", "custom_tool"])(
  "folds a failed completed %s into the summary while another call is active",
  async (toolName) => {
    const activities = reactive<Activity[]>([
      { ...tool, toolName, complete: false, state: "running", output: "partial" },
      { ...tool, id: "live", complete: false, state: "running" },
    ]);
    const wrapper = mount(TurnWork, { props: { activities, working: true } });
    const failed = wrapper.findAll(".activity")[0]!;
    const live = wrapper.findAll(".activity")[1]!;
    const element = failed.element;
    expect(rowShown(failed)).toBe(true);
    activities[0]!.complete = true;
    activities[0]!.state = "failed";
    activities[0]!.output = "Command failed: exit code 1";
    await nextTick();
    const summary = wrapper.get(".work-summary");
    expect(summary.text()).toContain(toolName === "terminal" ? "1 command" : "1 tool");
    expect(summary.text()).toContain("1 failed");
    expect(summary.attributes("aria-expanded")).toBe("false");
    expect(rowShown(failed)).toBe(false);
    expect(rowShown(live)).toBe(true);
    expect(wrapper.findAll(".current-activity")).toHaveLength(1);
    await summary.trigger("click");
    expect(rowShown(failed)).toBe(true);
    expect(failed.element).toBe(element);
    expect(wrapper.findAll(".activity").map((row) => row.element)).toEqual([element, live.element]);
    expect(failed.classes()).toContain("activity-failed");
    expect(failed.get("summary").text()).toContain("Failed");
    await failed.get("summary").trigger("click");
    expect(failed.get("pre").isVisible()).toBe(true);
    expect(failed.get("pre").text()).toContain("Command failed: exit code 1");
    await summary.trigger("click");
    expect(rowShown(failed)).toBe(false);
    expect(rowShown(live)).toBe(true);
    await wrapper.setProps({ working: false });
    expect(rowShown(failed)).toBe(false);
    expect(rowShown(live)).toBe(false);
    await summary.trigger("click");
    expect(failed.attributes("open")).toBeDefined();
    wrapper.unmount();
  },
);

it.each(["running", "failed"] as const)(
  "keeps unfinished %s calls inspectable when the turn stops",
  async (state) => {
    const wrapper = mount(TurnWork, {
      props: {
        working: true,
        activities: [tool, { ...tool, id: "b", complete: false, state }],
      },
    });
    expect(rowShown(wrapper.findAll(".activity")[1]!)).toBe(true);
    await wrapper.setProps({ working: false });
    expect(wrapper.findAll(".current-activity")).toHaveLength(0);
    expect(rowShown(wrapper.get(".activity-failed"))).toBe(false);
    expect(wrapper.get(".activity-failed summary").text()).toContain(
      state === "failed" ? "Failed" : "Result unavailable",
    );
    expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
    await wrapper.get(".work-summary").trigger("click");
    expect(rowShown(wrapper.get(".activity-failed"))).toBe(true);
    wrapper.unmount();
  },
);

it("streams mixed activity below one collapsed history and folds delegation only when it settles", async () => {
  const activities = reactive<Activity[]>([
    { id: "thought", kind: "thinking", title: "Thinking", content: "Plan", complete: false },
    {
      ...tool,
      id: "child",
      delegated: true,
      complete: false,
      state: "running",
      output: "Child started",
    },
  ]);
  const wrapper = mount(TurnWork, { props: { activities, working: true } });
  const summary = wrapper.get(".work-summary");
  const rows = wrapper.findAll(".activity");
  const elements = rows.map((row) => row.element);
  expect(summary.attributes("aria-expanded")).toBe("false");
  expect(wrapper.findAll(".current-activity")).toHaveLength(2);
  expect(rows.every(rowShown)).toBe(true);
  expect(rows[0]!.attributes("open")).toBeUndefined();
  expect(rows[1]!.attributes("open")).toBeUndefined();
  expect(rows[1]!.get("summary").text()).toContain("Running…");
  await rows[1]!.get("summary").trigger("click");
  activities[0]!.content += " with arriving reasoning";
  activities[1]!.output += " and progress";
  await nextTick();
  expect(rows[0]!.get("pre").text()).toContain("arriving reasoning");
  expect(rows[1]!.get("pre").text()).toContain("and progress");
  activities[0]!.complete = true;
  await wrapper.setProps({ working: false });
  expect(rowShown(rows[0]!)).toBe(false);
  expect(rowShown(rows[1]!)).toBe(true);
  expect(summary.text()).toContain("Thought");
  await summary.trigger("click");
  expect(rows.every(rowShown)).toBe(true);
  await rows[0]!.get("summary").trigger("click");
  await summary.trigger("click");
  activities[1]!.complete = true;
  activities[1]!.state = "completed";
  activities[1]!.output = "Child result";
  await nextTick();
  expect(rows.every((row) => !rowShown(row))).toBe(true);
  expect(wrapper.findAll(".current-activity")).toHaveLength(0);
  await summary.trigger("click");
  expect(rows[0]!.attributes("open")).toBeDefined();
  expect(rows[1]!.attributes("open")).toBeDefined();
  expect(rows[1]!.get("pre").text()).toContain("Child result");
  expect(wrapper.findAll(".activity").map((row) => row.element)).toEqual(elements);
  wrapper.unmount();
});

it.each(["thinking", "tool"] as const)(
  "collapses a single completed %s with all detail inspectable",
  async (kind) => {
    const wrapper = mount(TurnWork, {
      props: {
        activities: [{ ...tool, kind, content: "Full input", output: "Full output" }],
        working: false,
      },
    });
    expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
    expect(rowShown(wrapper.get(".activity"))).toBe(false);
    await wrapper.get(".work-summary").trigger("click");
    await wrapper.get(".activity summary").trigger("click");
    expect(wrapper.get(".activity pre").text()).toContain("Full input");
    expect(wrapper.get(".activity pre").text()).toContain("Full output");
    wrapper.unmount();
  },
);

it("keeps nested reasoning collapsed by default and preserves independent disclosure choices", async () => {
  const activities = reactive<Activity[]>([
    { id: "thought", kind: "thinking", title: "Thinking", content: "First", complete: false },
    { ...tool, id: "live", complete: false, state: "running" },
  ]);
  const wrapper = mount(TurnWork, { props: { activities, working: true } });
  const summary = wrapper.get(".work-summary");
  const thought = wrapper.get(".activity-thinking");
  const element = thought.element;
  expect(rowShown(thought)).toBe(true);
  expect(thought.attributes("open")).toBeUndefined();
  await summary.trigger("click");
  expect(thought.attributes("open")).toBeUndefined();
  await thought.get("summary").trigger("click");
  activities[0]!.content += " second";
  await nextTick();
  expect(thought.get("pre").text()).toBe("First second");
  await summary.trigger("click");
  expect(thought.attributes("open")).toBeDefined();
  expect(summary.attributes("aria-expanded")).toBe("false");
  activities[0]!.complete = true;
  await nextTick();
  expect(rowShown(thought)).toBe(false);
  await summary.trigger("click");
  expect(thought.element).toBe(element);
  expect(thought.attributes("open")).toBeDefined();
  await thought.get("summary").trigger("click");
  activities[0]!.content += " final";
  activities.push({ ...tool, id: "next", complete: false, state: "pending" });
  await nextTick();
  expect(thought.attributes("open")).toBeUndefined();
  expect(
    wrapper
      .findAll(".activity:not(.activity-thinking)")
      .every((row) => row.attributes("open") === undefined),
  ).toBe(true);
  await summary.trigger("click");
  await wrapper.setProps({ working: false });
  await summary.trigger("click");
  expect(thought.element).toBe(element);
  expect(thought.attributes("open")).toBeUndefined();
  expect(thought.get("pre").text()).toBe("First second final");
  wrapper.unmount();
});
