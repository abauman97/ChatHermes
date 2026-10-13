// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { reactive, nextTick } from "vue";
import { createTurn, reduceNativeTurn } from "../features/chat/runtime/assistant-turn";
import { mount, flushPromises } from "@vue/test-utils";
import ChatTranscript from "./ChatTranscript.vue";

describe("chat markdown", () => {
  it("renders history content parts and arriving markdown with readable structure", async () => {
    const wrapper = mount(ChatTranscript, {
      props: {
        loading: false,
        progress: [],
        draft: "**Arriving**",
        messages: [
          { role: "user", content: "Use `code`" },
          {
            role: "assistant",
            content: [
              {
                type: "text",
                text: '# Heading\n\n**Bold** and *italic*\n\n- First\n- Second\n\n> Quote\n\n```js\nconst value = "<safe>"\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n[Docs](https://example.com)',
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.get(".user code").text()).toBe("code");
    expect(wrapper.get("h1").text()).toBe("Heading");
    expect(wrapper.get("em").text()).toBe("italic");
    expect(wrapper.findAll("li")).toHaveLength(2);
    expect(wrapper.get("blockquote").text()).toBe("Quote");
    expect(wrapper.get("pre code").text()).toContain("<safe>");
    expect(wrapper.get("table td").text()).toBe("1");
    expect(wrapper.get("a").attributes()).toMatchObject({
      href: "https://example.com",
      target: "_blank",
      rel: "noopener noreferrer",
    });
    expect(wrapper.findAll(".assistant").at(-1)?.get("strong").text()).toBe("Arriving");
    await wrapper.setProps({ draft: "**Arriving**\n\n```\npartial" });
    expect(wrapper.findAll(".assistant").at(-1)?.get("pre code").text()).toContain("partial");
  });

  it("escapes raw HTML and rejects executable links and images in history and drafts", () => {
    const unsafe =
      "<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert(1)) ![bad](data:text/html;base64,PHNjcmlwdD4=)";
    const wrapper = mount(ChatTranscript, {
      props: {
        loading: false,
        progress: [],
        draft: unsafe,
        messages: [{ role: "assistant", content: unsafe }],
      },
    });
    expect(wrapper.find("script").exists()).toBe(false);
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.text()).toContain("<script>alert(1)</script>");
  });
});

describe("ordered activity presentation", () => {
  it("keeps only the activity animation in Working and renders runtime status outside the transcript", () => {
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [{ role: "user", content: "Question" }],
        working: true,
        progress: [],
        draft: "",
        loading: false,
        statusLabel: "Thinking…",
      },
    });
    expect(wrapper.findAll(".working-shimmer")).toHaveLength(1);
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });

  it("renders text, reasoning and separate tool runs in chronological order", async () => {
    const blocks = [
      { id: "intro", kind: "text" as const, content: "Intro" },
      { id: "r", kind: "thinking" as const, title: "Thinking…", content: "Plan", complete: false },
      {
        id: "a",
        kind: "tool" as const,
        toolName: "terminal",
        title: "Running command",
        content: "pwd",
        output: "partial",
        complete: false,
      },
      { id: "b", kind: "tool" as const, title: "Reading file", content: "file", complete: false },
      { id: "middle", kind: "text" as const, content: "Middle" },
      { id: "c", kind: "tool" as const, title: "Searching", content: "query", complete: false },
      { id: "final", kind: "text" as const, content: "Answer" },
    ];
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [{ role: "user", content: "Question" }],
        blocks,
        working: true,
        progress: [],
        draft: "",
        loading: false,
      },
    });
    expect(wrapper.findAll(".assistant-turn > *").map((row) => row.classes()[0])).toEqual([
      "message",
      "activity",
      "turn-work",
      "message",
      "turn-work",
      "message",
    ]);
    expect(wrapper.findAll(".turn-work")).toHaveLength(2);
    expect(wrapper.findAll(".current-activity")).toHaveLength(3);
    expect(wrapper.get(".activity pre").text()).toBe("Plan");
    const firstRun = wrapper.findAll(".turn-work")[0]!;
    expect(firstRun.find(".work-summary").exists()).toBe(false);
    expect(firstRun.get(".activity").isVisible()).toBe(true);
    await wrapper.setProps({
      blocks: blocks.map((block) =>
        block.id === "a" ? { ...block, complete: true, state: "completed" } : block,
      ),
    });
    expect(firstRun.get(".work-summary").attributes("aria-expanded")).toBe("false");
    expect(firstRun.get(".work-timeline > div").attributes("style")).toContain("display: none");
    expect(firstRun.get(".current-activity").isVisible()).toBe(true);
    await firstRun.get(".work-summary").trigger("click"); // explicit expansion
    const row = firstRun.get("details").element;
    await wrapper.setProps({
      blocks: blocks.map((block) =>
        block.kind === "text" ? block : { ...block, complete: true, state: "completed" },
      ),
      working: false,
    });
    expect(firstRun.get(".work-summary").attributes("aria-expanded")).toBe("true");
    expect(firstRun.get("details").element).toBe(row);
    expect(wrapper.findAll(".turn-work")[1]!.find(".work-summary").exists()).toBe(false);
    expect(wrapper.findAll(".turn-work")[1]!.get("details").attributes("open")).toBeUndefined();
  });
  it("keeps failed tools and interactive requests visible when a run is collapsed", async () => {
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [{ role: "user", content: "Question" }],
        blocks: [
          {
            id: "a",
            kind: "tool",
            title: "Ran command",
            content: "false",
            output: "Action needed",
            complete: true,
            state: "failed",
          },
        ],
        working: true,
        approvalPending: true,
        progress: [],
        draft: "",
        loading: false,
      },
      slots: { request: "<button class='approve'>Approve</button>" },
    });
    expect(wrapper.get(".activity").isVisible()).toBe(true);
    expect(wrapper.get(".activity").attributes("open")).toBeUndefined();
    expect(wrapper.get(".approve").isVisible()).toBe(true);
    expect(wrapper.findAll(".approve")).toHaveLength(1);
    expect(wrapper.text()).toContain("Waiting for approval");
    await wrapper.get(".activity summary").trigger("click");
    expect(wrapper.get(".activity").attributes("open")).toBeDefined();
    await wrapper.get(".activity summary").trigger("click");
    expect(wrapper.get(".activity").isVisible()).toBe(true);
    expect(wrapper.get(".activity").attributes("open")).toBeUndefined();
    expect(wrapper.get(".approve").isVisible()).toBe(true);
  });
  it("shows Working on admission before any activity arrives", () => {
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [{ role: "user", content: "Question" }],
        working: true,
        progress: [],
        draft: "",
        loading: false,
      },
    });
    expect(wrapper.get(".work-summary").text()).toContain("Working…");
  });
  it("restores reasoning and tool details from completed history and retains assistant images", () => {
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [
          { role: "user", content: "Question" },
          {
            role: "assistant",
            content: "",
            reasoning_content: "Plan",
            tool_calls: [{ id: "call", function: { name: "terminal" } }],
          },
          { role: "tool", tool_call_id: "call", content: "result" },
          {
            role: "assistant",
            content: [
              { type: "text", text: "Answer" },
              { type: "image_url", image_url: { url: "data:image/png;base64,aGVsbG8=" } },
            ],
          },
        ],
        progress: [],
        draft: "",
        loading: false,
      },
    });
    expect(wrapper.findAll("details")).toHaveLength(2);
    expect(wrapper.findAll("details[open]")).toHaveLength(0);
    expect(wrapper.get(".assistant img").attributes("src")).toContain("data:image/png");
    expect(wrapper.get(".assistant .message-content").text()).toBe("Answer");
    expect(wrapper.find('a[aria-label="Download Attached image.png"]').exists()).toBe(true);
  });
  it("does not force scroll when the reader has scrolled up to inspect history", async () => {
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [{ role: "user", content: "Question" }],
        progress: [],
        draft: "First",
        loading: false,
      },
    });
    const element = wrapper.get(".transcript").element as HTMLElement;
    Object.defineProperties(element, {
      scrollHeight: { value: 1800, configurable: true },
      clientHeight: { value: 600, configurable: true },
    });
    element.scrollTop = 100;
    await wrapper.get(".transcript").trigger("scroll");
    await wrapper.setProps({ draft: "Arriving text" });
    await flushPromises();
    expect(element.scrollTop).toBe(100);
    element.scrollTop = 1200;
    await wrapper.get(".transcript").trigger("scroll");
    Object.defineProperty(element, "scrollHeight", { value: 1900 });
    await wrapper.setProps({ draft: "More text" });
    await flushPromises();
    expect(element.scrollTop).toBe(1900);
  });

  it("starts a resumed conversation at its latest message after history loads", async () => {
    const wrapper = mount(ChatTranscript, {
      props: { messages: [], progress: [], draft: "", loading: true },
    });
    const element = wrapper.get(".transcript").element as HTMLElement;
    Object.defineProperties(element, {
      scrollHeight: { value: 2400, configurable: true },
      clientHeight: { value: 600, configurable: true },
    });
    await wrapper.setProps({
      messages: [
        { role: "user", content: "Earlier" },
        { role: "assistant", content: "Latest" },
      ],
      loading: false,
    });
    await flushPromises();
    expect(element.scrollTop).toBe(2400);
  });

  it("shows a scroll-to-latest control only when reading above the bottom and restores following on click", async () => {
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [{ role: "user", content: "Earlier" }],
        progress: [],
        draft: "",
        loading: false,
      },
    });
    const element = wrapper.get(".transcript").element as HTMLElement;
    Object.defineProperties(element, {
      scrollHeight: { value: 1800, configurable: true },
      clientHeight: { value: 600, configurable: true },
    });
    element.scrollTop = 100;
    await wrapper.get(".transcript").trigger("scroll");
    const button = wrapper.get('button[aria-label="Scroll to latest message"]');
    element.scrollTop = 1200;
    await button.trigger("click");
    expect(element.scrollTop).toBe(1800);
    expect(wrapper.find('button[aria-label="Scroll to latest message"]').exists()).toBe(false);
  });
});

describe("conversation scroll lifecycle", () => {
  const latest = 'button[aria-label="Scroll to latest message"]';
  const history = [
    { role: "user", content: "Earlier" },
    { role: "assistant", content: "Latest" },
  ];
  function dimensions(wrapper: ReturnType<typeof mount>, height = 2400) {
    const element = wrapper.get(".transcript").element as HTMLElement;
    Object.defineProperties(element, {
      scrollHeight: { value: height, configurable: true },
      clientHeight: { value: 600, configurable: true },
    });
    return element;
  }

  it("scrolls history already present on mount after the DOM is ready", async () => {
    const height = vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(2400);
    const viewport = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(600);
    try {
      const wrapper = mount(ChatTranscript, {
        props: { messages: history, progress: [], draft: "", loading: false },
      });
      await flushPromises();
      expect((wrapper.get(".transcript").element as HTMLElement).scrollTop).toBe(2400);
      expect(wrapper.find(latest).exists()).toBe(false);
      wrapper.unmount();
    } finally {
      height.mockRestore();
      viewport.mockRestore();
    }
  });

  it("waits for history when loading ends before messages arrive and resets for another conversation", async () => {
    const wrapper = mount(ChatTranscript, {
      props: { messages: [], progress: [], draft: "", loading: true },
    });
    const element = dimensions(wrapper);
    await wrapper.get(".transcript").trigger("scroll");
    await wrapper.setProps({ loading: false });
    await wrapper.setProps({ messages: history });
    expect(element.scrollTop).toBe(2400);
    element.scrollTop = 100;
    await wrapper.get(".transcript").trigger("scroll");
    await wrapper.setProps({ messages: [], loading: true });
    await wrapper.setProps({
      messages: history.map((message) => ({ ...message, content: "Other session" })),
      loading: false,
    });
    expect(element.scrollTop).toBe(2400);
    expect(wrapper.find(latest).exists()).toBe(false);
    wrapper.unmount();
  });

  it("preserves scroll-up on background reloads and equal-length history replacements", async () => {
    const wrapper = mount(ChatTranscript, {
      props: { messages: history, progress: [], draft: "", loading: false },
    });
    const element = dimensions(wrapper);
    element.scrollTop = 100;
    await wrapper.get(".transcript").trigger("scroll");
    await wrapper.setProps({ loading: true });
    element.scrollTop = 150;
    await wrapper.get(".transcript").trigger("scroll");
    expect(wrapper.find(latest).exists()).toBe(false);
    await wrapper.setProps({
      messages: history.map((message) => ({ ...message, content: "Refreshed content" })),
      loading: false,
    });
    expect(element.scrollTop).toBe(150);
    expect(wrapper.find(latest).exists()).toBe(true);
    await wrapper.setProps({
      working: true,
      draft: "Streaming",
      progress: [
        { id: "thinking", kind: "thinking", title: "Thinking", content: "Plan", complete: false },
      ],
    });
    expect(element.scrollTop).toBe(150);
    element.scrollTop = 1800;
    await wrapper.get(".transcript").trigger("scroll");
    expect(wrapper.find(latest).exists()).toBe(false);
    wrapper.unmount();
  });

  it("shows the arrow just above the bottom, tolerates rounding, and hides it at home", async () => {
    const wrapper = mount(ChatTranscript, {
      props: { messages: history, progress: [], draft: "", loading: false },
    });
    const element = dimensions(wrapper);
    element.scrollTop = 1780;
    await wrapper.get(".transcript").trigger("scroll");
    expect(wrapper.find(latest).exists()).toBe(true);
    await wrapper.setProps({ home: true });
    expect(wrapper.find(latest).exists()).toBe(false);
    await wrapper.setProps({ home: false });
    element.scrollTop = 1799.5;
    await wrapper.get(".transcript").trigger("scroll");
    expect(wrapper.find(latest).exists()).toBe(false);
    wrapper.unmount();
  });

  it("follows delayed layout changes only while at the bottom and disconnects observation", async () => {
    let resize: () => void = () => {};
    const observe = vi.fn(),
      disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    try {
      const wrapper = mount(ChatTranscript, {
        props: { messages: history, progress: [], draft: "", loading: false },
      });
      const element = dimensions(wrapper);
      resize();
      expect(element.scrollTop).toBe(2400);
      expect(observe).toHaveBeenCalledTimes(2);
      element.scrollTop = 100;
      await wrapper.get(".transcript").trigger("scroll");
      Object.defineProperty(element, "scrollHeight", { value: 2800, configurable: true });
      resize();
      await flushPromises();
      expect(element.scrollTop).toBe(100);
      expect(wrapper.find(latest).exists()).toBe(true);
      await wrapper.get(latest).trigger("click");
      Object.defineProperty(element, "scrollHeight", { value: 3000, configurable: true });
      resize();
      expect(element.scrollTop).toBe(3000);
      wrapper.unmount();
      expect(disconnect).toHaveBeenCalledOnce();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

it("restores saved reasoning and tool calls as inspectable completed disclosures", async () => {
  const wrapper = mount(ChatTranscript, {
    props: {
      loading: false,
      progress: [],
      draft: "",
      messages: [
        { role: "user", content: "Question" },
        {
          role: "assistant",
          content: "",
          reasoning_content: "Saved reasoning",
          tool_calls: [
            { id: "t1", function: { name: "terminal", arguments: '{"command":"pwd"}' } },
          ],
        },
        { role: "tool", tool_name: "terminal", content: "Full saved result" },
        { role: "assistant", content: "Answer" },
      ],
    },
  });
  expect(wrapper.findAll(".activity")).toHaveLength(2);
  expect(wrapper.findAll(".activity[open]")).toHaveLength(0);
  expect(wrapper.findAll(".assistant")).toHaveLength(1);
  expect(wrapper.text()).toContain("Saved reasoning");
  expect(wrapper.text()).toContain("pwd");
  expect(wrapper.text()).toContain("Full saved result");
});

it("keeps disclosure instances independent when two turns reuse a local block ID", async () => {
  const wrapper = mount(ChatTranscript, {
    props: {
      loading: false,
      progress: [],
      draft: "",
      working: true,
      messages: [
        {
          id: "first",
          role: "user",
          content: "First",
          blocks: [
            {
              id: "block-1",
              kind: "thinking",
              title: "Thought",
              content: "Earlier reasoning",
              complete: true,
            },
          ],
        },
        {
          id: "second",
          role: "user",
          content: "Second",
          blocks: [
            {
              id: "block-1",
              kind: "thinking",
              title: "Thinking…",
              content: "Arriving reasoning",
              complete: false,
            },
          ],
        },
      ],
    },
  });
  const turns = wrapper.findAll(".assistant-turn");
  const earlier = turns[0]!.get("details").element;
  const arriving = turns[1]!.get("details").element;
  expect(earlier.open).toBe(false);
  expect(arriving.open).toBe(true);
  earlier.open = true;
  await turns[0]!.get("details").trigger("toggle");
  await wrapper.setProps({
    messages: [
      {
        id: "first",
        role: "user",
        content: "First",
        blocks: [
          {
            id: "block-1",
            kind: "thinking",
            title: "Thought",
            content: "Late earlier result",
            complete: true,
          },
        ],
      },
      {
        id: "second",
        role: "user",
        content: "Second",
        blocks: [
          {
            id: "block-1",
            kind: "thinking",
            title: "Thought",
            content: "Final reasoning",
            complete: true,
          },
        ],
      },
    ],
    working: false,
  });
  expect(wrapper.findAll(".assistant-turn")[0]!.get("details").element).toBe(earlier);
  expect(arriving.open).toBe(false);
  earlier.open = true;
  await wrapper.findAll(".assistant-turn")[0]!.get("details").trigger("toggle");
  expect(earlier.open).toBe(true);
  expect(arriving.open).toBe(false);
  expect(turns[0]!.text()).toContain("Late earlier result");
  expect(turns[1]!.text()).toContain("Final reasoning");
});

it("collapses completed native calls during streaming across empty generation boundaries", async () => {
  const turn = reactive(createTurn());
  const wrapper = mount(ChatTranscript, {
    props: {
      messages: [
        {
          id: "earlier",
          role: "user",
          content: "Earlier question",
          blocks: [
            {
              id: "a",
              kind: "tool",
              title: "Used tool",
              content: "",
              complete: true,
              state: "completed",
            },
            {
              id: "b",
              kind: "tool",
              title: "Used tool",
              content: "",
              complete: true,
              state: "completed",
            },
          ],
        },
        { id: "current", role: "user", content: "Current question" },
      ],
      blocks: turn.blocks,
      progress: [],
      working: true,
      draft: "",
      loading: false,
    },
  });
  const event = async (name: string, data: Record<string, unknown> = {}) => {
    reduceNativeTurn(turn, name, data);
    await nextTick();
  };
  await event("message.start");
  await event("message.delta", { text: "Starting." });
  await event("tool.start", { tool_id: "a", name: "terminal", args: { command: "pwd" } });
  const current = wrapper.findAll(".assistant-turn")[1]!;
  const first = current.get(".activity").element;
  await event("tool.complete", { tool_id: "a", name: "terminal", result_text: "first result" });
  await event("message.start"); // a new native generation does not create a visible separator
  await event("message.delta", { text: "" });
  await event("tool.start", { tool_id: "b", name: "terminal", args: { command: "ls" } });
  expect(current.findAll(".turn-work")).toHaveLength(1);
  const summary = current.get(".work-summary");
  expect(summary.text()).toContain("Ran 1 command");
  expect(summary.attributes("aria-expanded")).toBe("false");
  expect(summary.find(".working-shimmer").exists()).toBe(false);
  expect(current.get(".work-timeline > div").attributes("style")).toContain("display: none");
  const active = current.get(".current-activity .activity");
  const activeElement = active.element;
  await event("tool.progress", { tool_id: "b", name: "terminal", text: "live result" });
  expect(active.get("pre").text()).toContain("live result");
  expect(current.get(".activity").element).toBe(first);
  await summary.trigger("click");
  expect(
    wrapper.findAll(".assistant-turn")[0]!.get(".work-summary").attributes("aria-expanded"),
  ).toBe("false");
  await summary.trigger("click");
  expect(current.get(".current-activity").isVisible()).toBe(true);
  await event("tool.complete", { tool_id: "b", name: "terminal", result_text: "second result" });
  expect(summary.text()).toContain("Ran 2 commands");
  expect(current.findAll(".current-activity")).toHaveLength(0);
  expect(current.findAll(".activity")[1]!.element).toBe(activeElement);
  expect(
    current
      .findAll(".work-timeline > div")
      .every((row) => row.attributes("style")?.includes("display: none")),
  ).toBe(true);
  await event("reasoning.delta", { text: "A separate phase." });
  await event("tool.start", { tool_id: "c", name: "read_file", args: { path: "file.txt" } });
  expect(current.findAll(".turn-work")).toHaveLength(2);
  expect(current.findAll(".current-activity")).toHaveLength(1);
  await event("message.complete", { text: "Finished.", status: "cancelled" });
  await wrapper.setProps({ working: false });
  expect(current.get(".activity-failed summary").text()).toContain("Interrupted");
  expect(current.findAll(":scope > *").map((row) => row.classes()[0])).toEqual([
    "message",
    "turn-work",
    "activity",
    "turn-work",
    "message",
  ]);
  expect(wrapper.findAll(".transcript > div > *")[2]!.classes()).toContain("message");
  await summary.trigger("click");
  expect(current.findAll(".activity")[1]!.attributes("open")).toBeUndefined();
  await current.findAll(".activity")[1]!.get("summary").trigger("click");
  expect(current.findAll(".activity")[1]!.attributes("open")).toBeDefined();
  expect(current.findAll(".activity")[1]!.get("pre").text()).toContain("second result");
  wrapper.unmount();
});
