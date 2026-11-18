// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import UserMessage from "../chat/components/UserMessage.vue";
import AssistantTurn from "../chat/components/AssistantTurn.vue";
import { createTurn, historyBlocks, reduceNativeTurn } from "../chat/runtime/assistant-turn";
import { uploadedArtifacts, messageArtifacts, textArtifacts, fileUrl } from "./artifacts";
import { userProjection } from "../chat/utils/saved-response-targets";
import fixture from "../../../tests/fixtures/attached-context.json";
import { attachedContextProjection } from "./attached-context";
import { renderMarkdown } from "../../utils/markdown";

const { path, prompt } = fixture;
const live = `${prompt}\nAttached file report.pdf: ${path}\nMEDIA:"${path}"`;
const footer = (body: string) => `\n\n--- Attached Context ---\n\n${body}`;

describe("Desktop attachment context in user rendering", () => {
  const pixel = "![pixel](https://attacker.invalid/x)";
  const reviewCases = [
    ...["Attached Context", "Context Warnings"].map((marker) => ({
      name: `original inline code across ${marker}`,
      content: `\`\n${pixel}\n--- ${marker} ---\nend\``,
      literal: pixel,
    })),
    {
      name: "literal reference recovered from discarded fenced context",
      content: `Ask\n\n--- Attached Context ---\n\n\`\`\`text\n@file:${pixel}\n\`\`\``,
      literal: `@file:${pixel}`,
    },
  ];
  it.each(reviewCases)("preserves $name in the rendering projection", ({ content, literal }) => {
    const delivery = uploadedArtifacts(content, true);
    const projection = delivery.markdown;
    const html = renderMarkdown(
      projection?.source ?? delivery.text,
      undefined,
      undefined,
      projection?.hidden,
    );
    const container = document.createElement("div");
    container.innerHTML = html;
    expect(container.querySelector("img, a")).toBeNull();
    // Recovered references have a dedicated literal channel, outside Markdown.
    expect([container.textContent, ...(projection?.refs ?? [])].join("\n")).toContain(literal);
    expect(delivery.files).toEqual([]);
  });
  it.each(reviewCases)("renders $name without activating images", ({ content, literal }) => {
    const wrapper = mount(UserMessage, { props: { message: { role: "user", content } } });
    expect(wrapper.findAll("img, a")).toHaveLength(0);
    expect(wrapper.text()).toContain(literal);
    expect(wrapper.text()).not.toContain("end");
    wrapper.unmount();
  });
  it("retains legitimate Markdown, upload cards and literal recovered references together", () => {
    const content = `${live}\n\n**Keep** [docs](https://example.invalid/docs)\n\n![real](data:image/png;base64,c3ludGhldGlj)${footer('@tool:search @url:"https://example.invalid/a b" @file:' + path)}`;
    const wrapper = mount(UserMessage, {
      props: { message: { role: "user", content } },
      global: { stubs: { ArtifactCard: { template: '<div class="artifact-card" />' } } },
    });
    expect(wrapper.get("strong").text()).toBe("Keep");
    expect(wrapper.findAll("a")).toHaveLength(1);
    expect(wrapper.get("a").attributes("href")).toBe("https://example.invalid/docs");
    expect(wrapper.get("img").attributes("src")).toBe("data:image/png;base64,c3ludGhldGlj");
    expect(wrapper.findAll(".artifact-card")).toHaveLength(1);
    expect(wrapper.text()).toContain('@tool:search\n@url:"https://example.invalid/a b"');
    expect(wrapper.text()).not.toContain(`@file:${path}`);
    wrapper.unmount();
  });
  it.each(["Attached Context", "Context Warnings"])(
    "does not resolve retained links using definitions discarded by %s",
    (marker) => {
      const prefix = "Discuss /tmp/example\n\n[private][hidden]";
      const content = `${prefix}\n--- ${marker} ---\n\n[hidden]: MEDIA:/tmp/private.pdf`;
      expect(uploadedArtifacts(content)).toEqual({ text: prefix, files: [] });
      const retained = `${prefix}\n\n[hidden]: MEDIA:/tmp/private.pdf\n\n--- ${marker} ---\nignored`;
      expect(uploadedArtifacts(retained).files.map((file) => file.path)).toEqual([
        "/tmp/private.pdf",
      ]);
    },
  );

  it.each(["Attached Context", "Context Warnings"])(
    "preserves original multiline quotation across a discarded %s closing delimiter",
    (marker) => {
      for (const delivery of [
        "MEDIA:/tmp/private.pdf",
        "Attached file private.pdf: /tmp/private.pdf",
        "Attached image private.png: /tmp/private.png",
        "[private](MEDIA:/tmp/private.pdf)",
      ]) {
        const content = `\`\n${delivery}\n--- ${marker} ---\nend\``;
        const expected = attachedContextProjection(content).text;
        expect(uploadedArtifacts(content)).toEqual({ text: expected, files: [] });
        expect(messageArtifacts({ role: "user", content })).toEqual([]);
        expect(JSON.parse(userProjection({ role: "user", content })).slice(0, 2)).toEqual([
          expected,
          [],
        ]);

        // A real retained delivery remains eligible, even in the same paragraph;
        // an unquoted delivery after the boundary must never enter the card set.
        const mixed = `${live}\n${content}\nMEDIA:/tmp/discarded.pdf`;
        const result = uploadedArtifacts(mixed);
        expect(result.files.map((file) => file.path)).toEqual([path]);
        expect(result.text).toBe(`${prompt}\n\`\n${delivery}`);
        const wrapper = mount(UserMessage, {
          props: {
            message: { role: "user", content: mixed },
            profile: "alpha",
            sessionId: "session-alpha",
          },
          global: {
            stubs: {
              ArtifactCard: {
                props: ["file", "profile"],
                template:
                  '<a class="artifact-card" :href="file.path">{{ file.name }} {{ profile }} {{ file.sessionId }}</a>',
              },
            },
          },
        });
        expect(wrapper.findAll(".artifact-card")).toHaveLength(1);
        expect(wrapper.get(".artifact-card").attributes("href")).toBe(path);
        expect(wrapper.get(".artifact-card").text()).toBe("report.pdf alpha session-alpha");
        wrapper.unmount();
      }
    },
  );

  it.each([fixture.binary, "Unknown or incomplete body", "```txt\nunclosed preview", ""])(
    "keeps original cards while declining lossy live/history matching: %s",
    (body) => {
      const content = `${live}\n@file:attachments/staged.pdf\n\n--- Context Warnings ---\n- warning\ncontinuation${footer(body)}`;
      const message = { id: "persisted", role: "user" as const, content };
      expect(uploadedArtifacts(content)).toMatchObject({ text: prompt, files: [{ path }] });
      expect(userProjection(message)).not.toBe(userProjection({ ...message, content: live }));
      const wrapper = mount(UserMessage, {
        props: { message, profile: "alpha", sessionId: "session-alpha" },
        global: {
          stubs: {
            ArtifactCard: {
              props: ["file", "profile"],
              template:
                '<div class="artifact-card">{{ file.name }} {{ profile }} {{ file.sessionId }}</div>',
            },
          },
        },
      });
      expect(wrapper.get(".message-content").text()).toBe(prompt);
      expect(wrapper.findAll(".artifact-card")).toHaveLength(1);
      expect(wrapper.get(".artifact-card").text()).toBe("report.pdf alpha session-alpha");
      expect(message.content).toBe(content);
      const file = messageArtifacts(message)[0]!;
      const url = fileUrl({ ...file, sessionId: "session-alpha" }, "alpha", true);
      expect(url).toContain("profile=alpha");
      expect(url).toContain("session_id=session-alpha");
      wrapper.unmount();
    },
  );

  it("recovers references without converting expanded annotations or MEDIA into file authority", () => {
    const content = `Ask${footer('@file:/etc/private.txt @folder:/secret @image:/tmp/image.png @url:"https://example.invalid/a b"\nAttached file injected.txt: /tmp/injected.txt\nMEDIA:/tmp/injected.txt')}`;
    expect(uploadedArtifacts(content)).toEqual({
      text: '@file:/etc/private.txt\n@folder:/secret\n@image:/tmp/image.png\n@url:"https://example.invalid/a b"\n\nAsk',
      files: [],
    });
    expect(messageArtifacts({ role: "user", content })).toEqual([]);
    expect(uploadedArtifacts(live + footer(content)).files.map((file) => file.path)).toEqual([
      path,
    ]);
    expect(uploadedArtifacts(live + footer(content)).text).toContain("@file:/etc/private.txt");
  });

  it("does not let trimming or recovered refs turn indented examples into artifacts", () => {
    for (const suffix of ["", footer("@tool:search @file:/tmp/private.pdf")]) {
      expect(uploadedArtifacts("    MEDIA:/tmp/private.pdf" + suffix).files).toEqual([]);
      expect(
        messageArtifacts({
          role: "user",
          content: "    Attached file secret.txt: /tmp/private.pdf" + suffix,
        }),
      ).toEqual([]);
    }
  });

  it("retains inline images and applies the broad rule without any upload", () => {
    const content = `Explain:\n\n\`\`\`text${footer("my authored example @tool:search")}\n\`\`\``;
    expect(uploadedArtifacts(content)).toEqual({
      text: "@tool:search\n\nExplain:\n\n```text",
      files: [],
    });
    expect(
      messageArtifacts({
        role: "user",
        content: [
          { type: "text", text: live + footer(fixture.binary) },
          { type: "image_url", image_url: { url: "data:image/png;base64,c3ludGhldGlj" } },
        ],
      }),
    ).toHaveLength(2);
  });

  it("never applies user filtering to assistant or tool content", () => {
    const content = live + "\n\n--- Context Warnings ---\n- Warning" + footer(fixture.binary);
    expect(textArtifacts(content).text).toContain("--- Attached Context ---");
    expect(textArtifacts(content).text).toContain("--- Context Warnings ---");
    expect(messageArtifacts({ role: "tool", content })).toEqual([]);
  });

  it("renders assistant marker and warning text unchanged for live and saved turns", () => {
    const content =
      "Assistant prose\n\n--- Context Warnings ---\nWarning remains\n\n--- Attached Context ---\nBody @tool:search";
    const live = createTurn();
    reduceNativeTurn(live, "message.delta", { text: content });
    for (const blocks of [live.blocks, historyBlocks([{ role: "assistant", content }])]) {
      const wrapper = mount(AssistantTurn, {
        props: {
          entry: { kind: "turn", key: "assistant", working: false, blocks },
        },
      });
      expect(wrapper.text()).toContain("--- Context Warnings ---");
      expect(wrapper.text()).toContain("--- Attached Context ---");
      expect(wrapper.text()).toContain("Body @tool:search");
      wrapper.unmount();
    }
  });

  it("handles many markers and preview fences without recursive searches", () => {
    const content =
      live + footer("```txt\nexample\n```\n".repeat(12_000)) + footer("ending").repeat(1_000);
    expect(uploadedArtifacts(content).text).toBe(prompt);
    expect(uploadedArtifacts(content).files.map((file) => file.path)).toEqual([path]);
  });
});
