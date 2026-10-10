// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import UserMessage from "../chat/components/UserMessage.vue";
import AssistantTurn from "../chat/components/AssistantTurn.vue";
import ChatComposer from "../chat/components/ChatComposer.vue";
import ArtifactBrowser from "./ArtifactBrowser.vue";
import ArtifactAttachment from "./ArtifactAttachment.vue";
import ArtifactPreview from "./ArtifactPreview.vue";
import { fileIconFor } from "./fileIcons";
import {
  artifacts,
  cleanFileText,
  hasReference,
  previewable,
  fileSize,
  type Artifact,
} from "./service";
const artifact: Artifact = {
  id: "a".repeat(64),
  session_id: "one",
  name: "report.pdf",
  mime: "application/pdf",
  size: 2048,
  direction: "uploaded",
  created_at: 100,
  reference: "/remote/report.pdf",
  ref_text: "@file:/remote/report.pdf",
  can_delete: true,
};
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function reader() {
  vi.stubGlobal(
    "FileReader",
    class {
      result = "data:text/plain;base64,aGk=";
      onload?: () => void;
      readAsDataURL() {
        this.onload?.();
      }
    },
  );
}
describe("shared attachments and artifacts", () => {
  it("stages picker/drop files through one service without sending and preserves other files on failure", async () => {
    reader();
    const stage = vi
      .fn()
      .mockResolvedValueOnce({
        name: "first.txt",
        type: "text/plain",
        data: "data:text/plain;base64,aGk=",
        size: 2,
        artifactId: artifact.id,
      })
      .mockRejectedValueOnce(new Error("Upload failed"));
    const submit = vi.fn(async () => false);
    const wrapper = mount(ChatComposer, {
      props: { disabled: false, sending: false, stageAttachment: stage, submitMessage: submit },
    });
    await wrapper.get("textarea").setValue("My draft");
    const input = wrapper.get('input[aria-label="Upload files"]');
    Object.defineProperty(input.element, "files", { value: [new File(["hi"], "first.txt")] });
    await input.trigger("change");
    await flushPromises();
    await (wrapper.vm as unknown as { addFiles: (files: File[]) => Promise<void> }).addFiles([
      new File(["hi"], "second.txt"),
    ]);
    expect(stage).toHaveBeenCalledTimes(2);
    expect(wrapper.emitted("send")).toBeUndefined();
    expect(submit).not.toHaveBeenCalled();
    expect(wrapper.get("textarea").element.value).toBe("My draft");
    expect(wrapper.get('[role="alert"]').text()).toContain("Upload failed");
    expect(wrapper.get('button[aria-label="Remove first.txt"]')).toBeTruthy();
    await wrapper.get(".send-button").trigger("click");
    await flushPromises();
    expect(submit).toHaveBeenCalledWith("My draft", [
      expect.objectContaining({ artifactId: artifact.id }),
    ]);
    expect(wrapper.get("textarea").element.value).toBe("My draft");
    await wrapper.get('button[aria-label="Remove first.txt"]').trigger("click");
    expect(wrapper.find('button[aria-label="Remove first.txt"]').exists()).toBe(false);
    wrapper.unmount();
  });
  it("shares preview/download components and passes project filters to the common browser", async () => {
    const list = vi
      .spyOn(artifacts, "list")
      .mockResolvedValue({ artifacts: [artifact], has_more: false, next_offset: 1 });
    const remove = vi.spyOn(artifacts, "remove").mockResolvedValue({ deleted: true });
    const wrapper = mount(ArtifactBrowser, {
      props: { profile: "alpha", projectId: "project-one" },
    });
    await flushPromises();
    expect(list).toHaveBeenCalledWith(
      "alpha",
      { offset: "0", project_id: "project-one" },
      expect.any(AbortSignal),
    );
    expect(wrapper.findComponent(ArtifactAttachment).exists()).toBe(true);
    await wrapper.get('[aria-label="More actions for report.pdf"]').trigger("click");
    expect(wrapper.get('[role="menu"]').text()).toContain("Delete");
    await wrapper.get('[role="menuitem"]:last-child').trigger("click");
    expect(remove).not.toHaveBeenCalled();
    await wrapper.get('[role="alertdialog"] button:last-child').trigger("click");
    await flushPromises();
    expect(remove).toHaveBeenCalledWith("alpha", artifact.id);
    expect(wrapper.find("article").exists()).toBe(false);
    wrapper.unmount();
  });
  it("renders paged artifacts as tiles and preserves conversation and deletion actions", async () => {
    const newer = {
      ...artifact,
      id: "d".repeat(64),
      name: "a-very-long-generated-report-name.pdf",
      created_at: 200,
      session_title: "Quarterly report",
      project_id: "project-one",
      project_name: "Research",
      can_delete: false,
    };
    const list = vi
      .spyOn(artifacts, "list")
      .mockResolvedValueOnce({ artifacts: [artifact], has_more: true, next_offset: 1 })
      .mockResolvedValueOnce({ artifacts: [artifact, newer], has_more: false, next_offset: 3 });
    const remove = vi.spyOn(artifacts, "remove").mockResolvedValue({ deleted: true });
    const wrapper = mount(ArtifactBrowser, {
      props: { profile: "alpha", projectId: "project-one" },
    });
    await flushPromises();
    expect(list).toHaveBeenNthCalledWith(
      2,
      "alpha",
      { offset: "1", project_id: "project-one" },
      expect.any(AbortSignal),
    );
    const cards = wrapper.findAll(".artifact-grid > .artifact-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]!.text()).toContain(newer.name);
    expect(cards[0]!.findComponent(ArtifactAttachment).props("tiled")).toBe(true);
    expect(cards[0]!.text()).toContain("Research");
    expect(cards[0]!.findAll(".artifact-menu-trigger")).toHaveLength(1);
    await cards[0]!
      .get('button[aria-label="Open conversation: Quarterly report"]')
      .trigger("click");
    expect(wrapper.emitted("conversation")).toEqual([["one", "project-one"]]);
    await cards[1]!.get('[aria-label="More actions for report.pdf"]').trigger("click");
    await cards[1]!.get('[role="menuitem"]:last-child').trigger("click");
    await wrapper.get('[role="alertdialog"] button:first-child').trigger("click");
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false);
    expect(remove).not.toHaveBeenCalled();
    expect(wrapper.findAll(".artifact-card")).toHaveLength(2);
    wrapper.unmount();
  });
  it("keeps tiled image previews and authenticated downloads available after thumbnail failure", async () => {
    const image = { ...artifact, mime: "image/png", name: "image.png" };
    const wrapper = mount(ArtifactAttachment, {
      props: { artifact: image, profile: "alpha", tiled: true },
    });
    expect(wrapper.get(".artifact-tile-media img").attributes("src")).toBe(
      artifacts.content("alpha", image.id, true),
    );
    await wrapper.get("img").trigger("load");
    expect(wrapper.emitted("imageLoad")).toHaveLength(1);
    await wrapper.get("img").trigger("error");
    expect(wrapper.get(".artifact-tile-media img").attributes("data-icon")).toBe("png");
    expect(wrapper.get(".artifact-file-symbol img").attributes("src")).toBe(
      fileIconFor(image.name, image.mime),
    );
    expect(wrapper.get("a[download]").attributes("href")).toBe(
      artifacts.content("alpha", image.id),
    );
    await wrapper.get('button[aria-label="Preview image.png"]').trigger("click");
    expect(wrapper.findComponent(ArtifactPreview).props("mime")).toBe("image/png");
    wrapper.findComponent(ArtifactPreview).vm.$emit("close");
    await flushPromises();
    expect(wrapper.findComponent(ArtifactPreview).exists()).toBe(false);
    wrapper.unmount();
  });
  it("only offers downloads for unsafe preview formats and keeps inline attachments compact", () => {
    const file = { ...artifact, mime: "text/html", name: "page.html" };
    const tile = mount(ArtifactAttachment, { props: { artifact: file, profile: "", tiled: true } });
    expect(tile.find("button").exists()).toBe(false);
    expect(tile.find(".artifact-tile-media").exists()).toBe(true);
    expect(tile.get("a[download]").text()).toBe("Download");
    const inline = mount(ArtifactAttachment, { props: { artifact, profile: "" } });
    expect(inline.find(".artifact-attachment-tiled").exists()).toBe(false);
    expect(inline.find(".artifact-tile-media").exists()).toBe(false);
    expect(inline.find('button[aria-label="Preview report.pdf"]').exists()).toBe(true);
    tile.unmount();
    inline.unmount();
  });
  it("hides octet-stream artifacts in the browser while retaining known MIME types", async () => {
    vi.spyOn(artifacts, "list").mockResolvedValue({
      artifacts: [
        artifact,
        { ...artifact, id: "b".repeat(64), name: "unknown.bin", mime: "application/octet-stream" },
      ],
      has_more: false,
      next_offset: 2,
    });
    const wrapper = mount(ArtifactBrowser, { props: { profile: "" } });
    await flushPromises();
    expect(wrapper.findAll("article")).toHaveLength(1);
    expect(wrapper.text()).toContain("report.pdf");
    expect(wrapper.text()).not.toContain("unknown.bin");
    wrapper.unmount();
  });
  it("keeps a file visible when native deletion is unsupported", async () => {
    vi.spyOn(artifacts, "list").mockResolvedValue({
      artifacts: [artifact],
      has_more: false,
      next_offset: 1,
    });
    vi.spyOn(artifacts, "remove").mockRejectedValue(
      new Error("This Hermes backend does not support file deletion."),
    );
    const wrapper = mount(ArtifactBrowser, { props: { profile: "" } });
    await flushPromises();
    await wrapper.get('[aria-label="More actions for report.pdf"]').trigger("click");
    await wrapper.get('[role="menuitem"]:last-child').trigger("click");
    await wrapper.get('[role="alertdialog"] button:last-child').trigger("click");
    await flushPromises();
    expect(wrapper.find("article").exists()).toBe(true);
    expect(wrapper.get('[role="alertdialog"]').text()).toContain("does not support");
    wrapper.unmount();
  });
  it("hides octet-stream attachments from session inline cards but keeps known MIME cards", () => {
    const opaque = { ...artifact, id: "c".repeat(64), mime: "application/octet-stream" };
    const user = mount(UserMessage, {
      props: {
        message: { role: "user", content: "Attached file report.pdf: /remote/report.pdf" },
        artifacts: [artifact, opaque],
      },
    });
    expect(user.findAllComponents(ArtifactAttachment)).toHaveLength(1);
    expect(user.text()).not.toContain("application/octet-stream");
    const generated = { ...artifact, direction: "generated" as const };
    const opaqueGenerated = { ...opaque, direction: "generated" as const };
    const assistant = mount(AssistantTurn, {
      props: {
        entry: {
          kind: "turn",
          key: "one",
          blocks: [{ kind: "text", id: "text", content: "MEDIA:/remote/report.pdf" }],
        },
        artifacts: [generated, opaqueGenerated],
      },
    });
    expect(assistant.findAllComponents(ArtifactAttachment)).toHaveLength(1);
    expect(assistant.text()).not.toContain("application/octet-stream");
    user.unmount();
    assistant.unmount();
  });
  it("keeps generated paths mentioned in a request out of uploaded message cards", () => {
    const generated = { ...artifact, direction: "generated" as const };
    const user = mount(UserMessage, {
      props: {
        message: { role: "user", content: "Please create /remote/report.pdf" },
        artifacts: [generated],
      },
    });
    expect(user.findComponent(ArtifactAttachment).exists()).toBe(false);
    const assistant = mount(AssistantTurn, {
      props: {
        entry: {
          kind: "turn",
          key: "one",
          blocks: [{ kind: "text", id: "text", content: "I read /remote/report.pdf" }],
        },
        artifacts: [artifact],
      },
    });
    expect(assistant.findComponent(ArtifactAttachment).exists()).toBe(false);
    user.unmount();
    assistant.unmount();
  });
  it.each([
    "Read /remote/report.pdf",
    "[Report](/remote/report.pdf)",
    "@file:/remote/report.pdf",
    '{"output_path":"/remote/report.pdf","saved_to":"/remote/report.pdf"}',
  ])("does not render a card for a mere mention: %s", (content) => {
    const generated = { ...artifact, direction: "generated" as const };
    for (const file of [artifact, generated]) expect(hasReference(content, file)).toBe(false);
    const user = mount(UserMessage, {
      props: { message: { role: "user", content }, artifacts: [artifact, generated] },
    });
    const assistant = mount(AssistantTurn, {
      props: {
        entry: { kind: "turn", key: "one", blocks: [{ kind: "text", id: "text", content }] },
        artifacts: [generated],
      },
    });
    expect(user.findComponent(ArtifactAttachment).exists()).toBe(false);
    expect(assistant.findComponent(ArtifactAttachment).exists()).toBe(false);
    user.unmount();
    assistant.unmount();
  });
  it("renders only explicit transfers and submitted composer attachments", () => {
    const generated = { ...artifact, direction: "generated" as const };
    expect(hasReference("MEDIA:/remote/report.pdf", artifact)).toBe(false);
    expect(hasReference([{ type: "attachment", id: artifact.id }], artifact)).toBe(true);
    expect(hasReference(artifact.id, artifact)).toBe(false);
    expect(
      hasReference([{ type: "image_url", image_url: { url: artifact.reference } }], artifact),
    ).toBe(true);
    for (const content of [
      "Attached file report.pdf: /remote/report.pdf",
      [{ type: "attachment", id: artifact.id }],
    ]) {
      const user = mount(UserMessage, {
        props: { message: { role: "user", content }, artifacts: [artifact] },
      });
      expect(user.findAllComponents(ArtifactAttachment)).toHaveLength(1);
      user.unmount();
    }
    const user = mount(UserMessage, {
      props: {
        message: { role: "user", content: "Please generate MEDIA:/remote/report.pdf" },
        artifacts: [artifact, generated],
      },
    });
    expect(user.findComponent(ArtifactAttachment).exists()).toBe(false);
    expect(user.text()).toContain("MEDIA:/remote/report.pdf");
    user.unmount();
    for (const blocks of [
      [{ kind: "text" as const, id: "text", content: "MEDIA:/remote/report.pdf" }],
      [
        {
          kind: "tool" as const,
          id: "tool",
          title: "Generate",
          content: "",
          output: 'MEDIA:"/remote/report.pdf"',
          complete: true,
        },
      ],
    ]) {
      const assistant = mount(AssistantTurn, {
        props: { entry: { kind: "turn", key: "one", blocks }, artifacts: [generated] },
      });
      expect(assistant.findAllComponents(ArtifactAttachment)).toHaveLength(1);
      assistant.unmount();
    }
    const assistant = mount(AssistantTurn, {
      props: {
        entry: {
          kind: "turn",
          key: "one",
          blocks: [
            {
              kind: "thinking",
              id: "thinking",
              title: "Thinking",
              content: "MEDIA:/remote/report.pdf",
              complete: true,
            },
            {
              kind: "tool",
              id: "tool",
              title: "Generate",
              content: "MEDIA:/remote/report.pdf",
              output: "Created /remote/report.pdf",
              complete: true,
            },
          ],
        },
        artifacts: [generated],
      },
    });
    expect(assistant.findComponent(ArtifactAttachment).exists()).toBe(false);
    assistant.unmount();
    expect(cleanFileText("MEDIA:/remote/report.pdf", [artifact])).toBe("MEDIA:/remote/report.pdf");
    expect(cleanFileText("Delivered MEDIA:/remote/report.pdf", [generated])).toBe("Delivered");
  });
  it("uses inert formats for previews and hides native refs while retaining message association", () => {
    expect(previewable("image/svg+xml")).toBe(false);
    expect(previewable("text/html")).toBe(false);
    expect(previewable("application/pdf")).toBe(true);
    expect(previewable("audio/mpeg")).toBe(true);
    expect(fileSize(artifact.size)).toBe("2.0 KB");
    expect(hasReference("Attached file report.pdf: /remote/report.pdf", artifact)).toBe(true);
    expect(
      cleanFileText(
        "Review\nAttached file report.pdf: /remote/report.pdf\n@file:/remote/report.pdf",
        [artifact],
      ),
    ).toBe("Review");
    expect(artifacts.content("alpha", artifact.id, true)).toContain("?preview=1&profile=alpha");
    expect(() => artifacts.content("../beta", artifact.id)).toThrow("Invalid profile");
  });
});
