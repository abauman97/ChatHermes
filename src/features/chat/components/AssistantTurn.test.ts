// @vitest-environment jsdom
import { expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import AssistantTurn from "./AssistantTurn.vue";

it("keeps delivered artifacts at their tool position and outside collapsed details", async () => {
  const wrapper = mount(AssistantTurn, {
    props: {
      entry: {
        kind: "turn",
        key: "turn",
        working: false,
        blocks: [
          { id: "intro", kind: "text", content: "Intro" },
          {
            id: "a",
            kind: "tool",
            title: "Generated file",
            toolName: "terminal",
            content: "",
            output: "@file:/opt/data/report.pdf",
            complete: true,
            state: "completed",
          },
          { id: "final", kind: "text", content: "Final" },
        ],
      },
    },
    global: { stubs: { ArtifactCard: { template: '<div class="artifact-stub">Artifact</div>' } } },
  });
  expect(wrapper.find(".work-summary").exists()).toBe(false);
  expect(wrapper.get(".activity").attributes("open")).toBeUndefined();
  expect(wrapper.get(".artifact-stub").isVisible()).toBe(true);
  expect(wrapper.findAll(".assistant-turn > *").map((row) => row.classes()[0])).toEqual([
    "message",
    "turn-work",
    "message",
  ]);
  await wrapper.get(".activity summary").trigger("click");
  await wrapper.get(".activity summary").trigger("click");
  expect(wrapper.get(".artifact-stub").isVisible()).toBe(true);
});
