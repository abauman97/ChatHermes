// @vitest-environment jsdom
import { quotedDeliveries, toolBodyDeliveries } from "../../artifacts/delivery-fixtures";
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
            toolName: "text_to_speech",
            content: "",
            output: '{"media_tag":"MEDIA:/opt/data/report.pdf"}',
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

it("preserves command output and assistant links without inferred artifact cards", async () => {
  const output = "Built /repo/.install-metadata.json and /tmp/report.pdf";
  const wrapper = mount(AssistantTurn, {
    props: {
      entry: {
        kind: "turn",
        key: "turn",
        working: false,
        blocks: [
          {
            id: "command",
            kind: "tool",
            title: "Command",
            toolName: "terminal",
            content: "Build files",
            output,
            complete: true,
            state: "completed",
          },
          { id: "answer", kind: "text", content: "Report: [Download](/tmp/report.pdf)" },
        ],
      },
    },
    global: { stubs: { ArtifactCard: { template: '<div class="artifact-stub">Artifact</div>' } } },
  });
  expect(wrapper.find(".artifact-stub").exists()).toBe(false);
  expect(wrapper.get('a[href="/tmp/report.pdf"]').text()).toBe("Download");
  await wrapper.get(".activity summary").trigger("click");
  expect(wrapper.text()).toContain(output);
});

it.each([...quotedDeliveries, ...toolBodyDeliveries])(
  "keeps bypass data inspectable without rendering cards: %s",
  async (content) => {
    const wrapper = mount(AssistantTurn, {
      props: {
        entry: {
          kind: "turn",
          key: "turn",
          working: false,
          blocks: [
            {
              id: "answer",
              kind: "text",
              content: quotedDeliveries.includes(content) ? content : "",
            },
            {
              id: "t",
              kind: "tool",
              title: "Read file",
              toolName: "read_file",
              content: "",
              output: content,
              complete: true,
              state: "completed",
            },
          ],
        },
      },
      global: {
        stubs: { ArtifactCard: { template: '<div class="artifact-stub">Artifact</div>' } },
      },
    });
    expect(wrapper.find(".artifact-stub").exists()).toBe(false);
    await wrapper.get(".activity summary").trigger("click");
    expect(wrapper.get(".activity pre").text()).toContain(content);
    wrapper.unmount();
  },
);
