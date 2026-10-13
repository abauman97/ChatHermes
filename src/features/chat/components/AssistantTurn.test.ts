// @vitest-environment jsdom
import { quotedDeliveries, toolBodyDeliveries } from "../../artifacts/delivery-fixtures";
import { expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { reactive } from "vue";
import { createTurn, historyBlocks, reduceNativeTurn, reduceTurn } from "../runtime/assistant-turn";
import AssistantTurn from "./AssistantTurn.vue";

it("folds the delegation call into its tool run while keeping the child independently live", async () => {
  const turn = reactive(createTurn());
  reduceNativeTurn(turn, "message.delta", { text: "Checking files" });
  reduceNativeTurn(turn, "tool.start", { tool_id: "read", name: "read_file" });
  reduceNativeTurn(turn, "tool.complete", { tool_id: "read", result_text: "File contents" });
  reduceNativeTurn(turn, "tool.start", {
    tool_id: "delegate",
    name: "delegate_task",
    args: { goal: "Check files" },
  });
  reduceNativeTurn(turn, "subagent.start", { subagent_id: "child", status: "running" });
  const entry = () => ({ kind: "turn" as const, key: "turn", working: true, blocks: turn.blocks });
  const wrapper = mount(AssistantTurn, { props: { entry: entry() } });
  const call = wrapper.findAll(".turn-work .activity")[1]!;
  const child = wrapper.get(".assistant-turn > .activity");
  expect((call.element.parentElement as HTMLElement).style.display).not.toBe("none");
  expect(child.classes()).toContain("activity-active");

  reduceNativeTurn(turn, "tool.complete", {
    tool_id: "delegate",
    name: "delegate_task",
    result_text: "Task accepted",
  });
  await wrapper.setProps({ entry: entry() });
  expect(wrapper.findAll(".turn-work")).toHaveLength(1);
  expect(wrapper.get(".work-summary").text()).toContain("Explored 1 file, used 1 tool");
  expect((call.element.parentElement as HTMLElement).style.display).toBe("none");
  expect(wrapper.findAll(".assistant-turn > .activity")).toHaveLength(1);
  expect(child.isVisible()).toBe(true);
  expect(child.element).toBe(wrapper.get(".assistant-turn > .activity").element);
  await wrapper.get(".work-summary").trigger("click");
  expect((call.element.parentElement as HTMLElement).style.display).not.toBe("none");
  await call.get("summary").trigger("click");
  expect(call.get("pre").text()).toContain("Check files");
  expect(call.get("pre").text()).toContain("Task accepted");
  await wrapper.get(".work-summary").trigger("click");

  reduceNativeTurn(turn, "message.complete", { text: "Stopped", status: "interrupted" });
  await wrapper.setProps({ entry: { ...entry(), working: false } });
  expect((call.element.parentElement as HTMLElement).style.display).toBe("none");
  expect(child.classes()).toContain("activity-active");
  reduceNativeTurn(turn, "subagent.complete", {
    subagent_id: "child",
    status: "completed",
    summary: "Child result",
  });
  await wrapper.setProps({ entry: { ...entry(), working: false } });
  expect(child.classes()).not.toContain("activity-active");
  expect(child.attributes("open")).toBeUndefined();
  await child.get("summary").trigger("click");
  expect(child.get("pre").text()).toContain("Child result");
  expect(wrapper.findAll(".assistant-turn > *").map((row) => row.classes()[0])).toEqual([
    "message",
    "turn-work",
    "activity",
    "message",
  ]);
  wrapper.unmount();
});

it.each(["delegate_task", "edit_file", "write_file"])(
  "folds restored %s calls with neighboring history tools",
  async (name) => {
    const blocks = historyBlocks([
      {
        role: "assistant",
        content: "",
        tool_calls: [
          { id: "read", function: { name: "read_file" } },
          {
            id: "delegate",
            function: { name, arguments: '{"path":"notes.txt"}' },
          },
        ],
      },
      { role: "tool", tool_call_id: "read", content: "File contents" },
      { role: "tool", tool_call_id: "delegate", content: "Task accepted" },
    ]);
    const wrapper = mount(AssistantTurn, {
      props: { entry: { kind: "turn", key: "turn", working: false, blocks } },
    });
    expect(wrapper.findAll(".turn-work")).toHaveLength(1);
    expect(wrapper.get(".work-summary").text()).toContain("Explored 1 file, used 1 tool");
    expect(wrapper.find(".assistant-turn > .activity").exists()).toBe(false);
    expect(wrapper.findAll(".activity").every((row) => !row.isVisible())).toBe(true);
    await wrapper.get(".work-summary").trigger("click");
    const call = wrapper.findAll(".turn-work .activity")[1]!;
    await call.get("summary").trigger("click");
    expect(call.get("pre").text()).toContain("notes.txt");
    expect(call.get("pre").text()).toContain("Task accepted");
    wrapper.unmount();
  },
);

it.each(["edit_file", "write_file"])(
  "folds streaming %s on native and normalized event paths without remounting rows",
  async (name) => {
    for (const native of [true, false]) {
      const turn = reactive(createTurn());
      const emit = (
        phase: "start" | "progress" | "complete",
        id: string,
        toolName: string,
        text = "",
      ) => {
        if (native) {
          reduceNativeTurn(turn, `tool.${phase}`, {
            tool_id: id,
            name: toolName,
            args: toolName === "read_file" ? {} : { path: "notes.txt" },
            text,
            result_text: text,
          });
        } else {
          const type = {
            start: "tool.started",
            progress: "tool.updated",
            complete: "tool.completed",
          } as const;
          reduceTurn(turn, {
            type: type[phase],
            data: {
              tool_call_id: id,
              tool_name: toolName,
              args: toolName === "read_file" ? {} : { path: "notes.txt" },
              delta: text,
              output: text,
            },
          });
        }
      };
      emit("start", "read", "read_file");
      emit("complete", "read", "read_file", "File contents");
      emit("start", "change", name);
      reduceNativeTurn(turn, "subagent.start", { subagent_id: "child", status: "running" });
      const entry = () => ({
        kind: "turn" as const,
        key: "turn",
        working: true,
        blocks: turn.blocks,
      });
      const wrapper = mount(AssistantTurn, { props: { entry: entry() } });
      const call = wrapper.findAll(".turn-work .activity")[1]!;
      const child = wrapper.get(".assistant-turn > .activity");
      expect(wrapper.findAll(".turn-work")).toHaveLength(1);
      expect(call.isVisible()).toBe(true);
      await call.get("summary").trigger("click");
      expect(call.attributes("open")).toBe("");
      emit("progress", "change", name, "Arriving file update");
      await wrapper.setProps({ entry: entry() });
      expect(call.get("pre").text()).toContain("Arriving file update");
      expect(call.element).toBe(wrapper.findAll(".turn-work .activity")[1]!.element);
      emit("complete", "change", name, "Saved notes.txt");
      await wrapper.setProps({ entry: entry() });
      expect(wrapper.get(".work-summary").text()).toContain("Explored 1 file, used 1 tool");
      expect((call.element.parentElement as HTMLElement).style.display).toBe("none");
      expect(child.isVisible()).toBe(true);
      expect(child.classes()).toContain("activity-active");
      await wrapper.get(".work-summary").trigger("click");
      expect(call.attributes("open")).toBe("");
      expect(call.get("pre").text()).toContain("notes.txt");
      expect(call.get("pre").text()).toContain("Saved notes.txt");
      wrapper.unmount();
    }
  },
);

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
