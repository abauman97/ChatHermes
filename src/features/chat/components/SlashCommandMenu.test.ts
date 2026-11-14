// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import SlashCommandMenu from "./SlashCommandMenu.vue";

const items = [
  { text: "/new", meta: "Start a session", group: "Session", limitation: "" },
  { text: "/history", meta: "Browse history", group: "Session", limitation: "Terminal only" },
  { text: "/tools", meta: "Manage tools", group: "Tools", limitation: "Terminal only" },
  { text: "/work", meta: "A skill", group: "Skills and bundles", limitation: "" },
  { text: "status", meta: "Read status", group: "Arguments", limitation: "" },
];

describe("slash command menu labels", () => {
  it("omits the Session heading and client helper while preserving other groups and descriptions", () => {
    const wrapper = mount(SlashCommandMenu, {
      props: { id: "commands", items, selected: 1, loading: false, error: "" },
    });
    expect(wrapper.findAll("p").map((heading) => heading.text())).toEqual([
      "Tools",
      "Skills and bundles",
      "Arguments",
    ]);
    expect(wrapper.text()).not.toContain("Client/terminal feature · type command for details");
    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(
      items.map((item) => item.text + item.meta),
    );
    wrapper.unmount();
  });

  it("preserves selection and click indices when the Session heading is hidden", async () => {
    const wrapper = mount(SlashCommandMenu, {
      props: { id: "commands", items, selected: 1, loading: false, error: "" },
    });
    const options = wrapper.findAll('[role="option"]');
    expect(options[1]!.attributes("aria-selected")).toBe("true");
    expect(options[1]!.attributes("id")).toBe("commands-1");
    await options[1]!.trigger("click");
    expect(wrapper.emitted("select")).toEqual([[1]]);
    wrapper.unmount();
  });
});
