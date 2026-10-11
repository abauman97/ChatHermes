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
  expect(wrapper.find(".work-summary").exists()).toBe(false);
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
  await second.get("summary").trigger("click");
  expect(wrapper.get(".work-summary").text()).toContain("Used 1 tool");
  expect(wrapper.get(".activity").element).toBe(first);
  expect(rowShown(wrapper.get(".activity"))).toBe(false);
  expect(rowShown(second)).toBe(true);
  activities[1]!.output += " arriving output";
  activities.push({ ...tool, id: "c", complete: false, state: "pending" });
  await nextTick();
  expect(wrapper.findAll(".current-activity")).toHaveLength(2);
  expect(second.get("pre").text()).toContain("arriving output");
  expect(second.attributes("open")).toBeDefined();
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
  expect(wrapper.find(".work-summary").exists()).toBe(false);
  expect(wrapper.findAll(".current-activity")).toHaveLength(3);
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
  "retains %s indicators beside a collapsed streaming summary",
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
    expect(wrapper.get(".activity-failed").isVisible()).toBe(true);
    expect(wrapper.get(".activity-failed").attributes("open")).toBeUndefined();
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
    expect(rowShown(live)).toBe(true);
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
    expect(wrapper.get(".activity-failed").isVisible()).toBe(true);
    expect(wrapper.get(".activity-failed summary").text()).toContain(
      state === "failed" ? "Failed" : "Result unavailable",
    );
    expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
    wrapper.unmount();
  },
);
