// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
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

  it("groups all activity before the response and keeps only active work visible", async () => {
    const blocks = [
      {
        id: "r1",
        kind: "thinking" as const,
        title: "Thought",
        content: "First plan",
        complete: true,
      },
      { id: "commentary", kind: "text" as const, content: "Checking files" },
      {
        id: "t1",
        kind: "tool" as const,
        title: "Read package.json",
        content: "details",
        complete: true,
      },
      {
        id: "active",
        kind: "thinking" as const,
        title: "Thinking…",
        content: "streaming",
        complete: false,
      },
      { id: "answer", kind: "text" as const, content: "Answer" },
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
      "turn-work",
      "message",
      "message",
    ]);
    expect(wrapper.get(".work-summary").text()).toBe("›Working…");
    expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
    expect(wrapper.findAll(".activity").map((row) => row.get("summary").isVisible())).toEqual([
      false,
      false,
      true,
    ]);
    expect(wrapper.get(".current-activity .activity").attributes("open")).toBeDefined();
    expect(wrapper.findAll(".working-shimmer")).toHaveLength(2);
    await wrapper.get(".work-summary").trigger("click");
    expect(
      wrapper
        .findAll(".work-timeline > div")
        .every((row) => row.attributes("style") !== "display: none;"),
    ).toBe(true);
    // Independent native disclosures can be opened without changing siblings.
    const first = wrapper.findAll(".activity").at(0)!;
    (first.element as HTMLDetailsElement).open = true;
    await first.trigger("toggle");
    expect(wrapper.findAll(".activity[open]")).toHaveLength(2);
    expect(wrapper.findAll(".activity").at(1)!.attributes("open")).toBeUndefined();
    await wrapper.setProps({
      blocks: blocks.map((block) => (block.kind !== "text" ? { ...block, complete: true } : block)),
      working: false,
    });
    expect(wrapper.get(".work-summary").text()).toBe("›Worked");
    expect(wrapper.get(".work-summary").attributes("aria-expanded")).toBe("false");
    expect(
      wrapper
        .findAll(".work-timeline > div")
        .every((row) => row.attributes("style") === "display: none;"),
    ).toBe(true);
    expect(wrapper.findAll(".working-shimmer")).toHaveLength(0);
    await wrapper.get(".work-summary").trigger("click");
    expect(
      wrapper
        .findAll(".work-timeline > div")
        .every((row) => row.attributes("style") !== "display: none;"),
    ).toBe(true);
    expect(wrapper.findAll(".activity[open]")).toHaveLength(0);
  });
  it("puts only the normalized active tool inline with Working and preserves completed disclosures", async () => {
    const tool = {
      id: "tool",
      kind: "tool" as const,
      toolName: "session_search",
      title: "Search sessions",
      content: '{"query":"old chat"}',
      output: "partial result",
      complete: false,
    };
    const wrapper = mount(ChatTranscript, {
      props: {
        messages: [{ role: "user", content: "Question" }],
        blocks: [tool],
        working: true,
        progress: [],
        draft: "",
        loading: false,
      },
    });
    for (const state of ["pending", "running"] as const) {
      await wrapper.setProps({ blocks: [{ ...tool, state, output: "More results" }] });
      expect(wrapper.get(".work-summary").text()).toBe("›Working… Using tool: session_search");
      expect(wrapper.get(".work-summary .working-shimmer").text()).toBe(
        "Working… Using tool: session_search",
      );
      expect(wrapper.get(".working-shimmer-tool").classes()).toContain("working-shimmer-tool");
      expect(wrapper.findAll(".working-shimmer")).toHaveLength(1);
      expect(wrapper.find("pre").exists()).toBe(false);
      await wrapper.get(".work-summary").trigger("click");
      expect(wrapper.find("pre").exists()).toBe(false);
    }
    await wrapper.setProps({ blocks: [{ ...tool, complete: true }], working: false });
    expect(wrapper.find(".active-tool").exists()).toBe(false);
    expect(wrapper.get(".work-summary").text()).toBe("›Worked");
    await wrapper.get(".work-summary").trigger("click");
    const details = wrapper.get("details");
    expect(details.isVisible()).toBe(true);
    expect(details.attributes("open")).toBeUndefined();
    (details.element as HTMLDetailsElement).open = true;
    await details.trigger("toggle");
    expect(wrapper.get("pre").text()).toContain("old chat");
    expect(wrapper.get("pre").text()).toContain("partial result");
  });

  it("shows approval waiting independently of completed activity and keeps history inspectable", async () => {
    const blocks = [
      {
        id: "tool",
        kind: "tool" as const,
        title: "Ran command",
        content: "approval command",
        complete: true,
        state: "failed" as const,
      },
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
      slots: { request: "<button>Approve</button>" },
    });
    expect(wrapper.get(".work-summary").text()).toContain("Working…");
    expect(wrapper.get(".activity").isVisible()).toBe(false);
    await wrapper.setProps({ approvalPending: true });
    expect(wrapper.get(".work-summary").text()).toContain("Waiting for approval");
    expect(wrapper.get('.work-summary [role="status"]').text()).toBe("Waiting for approval");
    expect(wrapper.findAll(".work-summary .working-shimmer")).toHaveLength(0);
    expect(wrapper.find(".current-activity").exists()).toBe(false);
    expect(wrapper.findAll(".current-activity").filter((row) => row.isVisible())).toHaveLength(0);
    expect(wrapper.findAll(".work-timeline > div")[0]!.attributes("style")).toContain(
      "display: none",
    );
    expect(wrapper.get("button:last-child").isVisible()).toBe(true);
    await wrapper.get(".work-summary").trigger("click");
    expect(wrapper.findAll(".work-timeline > div")[0]!.attributes("style")).not.toContain(
      "display: none",
    );
    expect(wrapper.get(".activity summary").text()).toContain("Failed");
    expect(wrapper.get(".activity").attributes("open")).toBeUndefined();
    expect(wrapper.get("button:last-child").isVisible()).toBe(true);
    await wrapper.get(".work-summary").trigger("click");
    expect(wrapper.get('.work-summary [role="status"]').isVisible()).toBe(true);
    await wrapper.setProps({
      approvalPending: false,
      blocks: [
        ...blocks,
        {
          id: "running",
          kind: "tool",
          toolName: "search",
          title: "Searching",
          content: "",
          output: "",
          complete: false,
        },
      ],
    });
    expect(wrapper.findAll(".current-activity")).toHaveLength(0);
    expect(wrapper.get(".work-summary .working-shimmer").text()).toBe(
      "Working… Using tool: search",
    );
    expect(wrapper.get(".activity").isVisible()).toBe(false);
    await wrapper.setProps({ approvalPending: false, working: false });
    expect(wrapper.get(".work-summary").text()).toContain("Worked");
    expect(wrapper.get(".activity").isVisible()).toBe(false);
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
    expect(wrapper.get(".assistant").text()).toBe("Answer");
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
