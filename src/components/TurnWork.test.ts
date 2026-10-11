// @vitest-environment jsdom
import { expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import TurnWork from "./TurnWork.vue";
import type { Activity } from "../types/hermes";
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
  expect(wrapper.get(".work-summary").text()).toContain("Using 2 tools");
  await wrapper.setProps({ activities: [tool, { ...tool, id: "b" }], working: false });
  expect(wrapper.get(".work-summary").text()).toContain("Used 2 tools");
  await wrapper.get(".work-summary").trigger("click");
  expect(wrapper.get(".activity").attributes("open")).toBeDefined();
});
