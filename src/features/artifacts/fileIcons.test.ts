// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import ArtifactAttachment from "./ArtifactAttachment.vue";
import { fileIconFor, fileIconName } from "./fileIcons";
import type { Artifact } from "./service";

const artifact: Artifact = {
  id: "a".repeat(64),
  session_id: "one",
  name: "report.pdf",
  mime: "application/pdf",
  size: 1,
  direction: "uploaded",
  created_at: 1,
  reference: "/report.pdf",
  ref_text: "@file:/report.pdf",
  can_delete: false,
};
const iconArtifact: Artifact = {
  ...artifact,
  name: "report.bin",
  mime: "application/octet-stream",
};

describe("Vivid file icons", () => {
  it.each([
    ["report.PDF", "application/octet-stream", "pdf"],
    [
      "report.bin",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "docx",
    ],
    ["table.csv", "application/octet-stream", "csv"],
    ["archive.7z", "application/octet-stream", "7z"],
    ["track", "audio/mpeg", "mp3"],
    ["photo", "image/jpeg", "jpeg"],
  ])("maps %s to its icon", (name, mime, icon) => {
    expect(fileIconName(name, mime)).toBe(icon);
    expect(fileIconFor(name, mime)).toContain("data:image/svg+xml");
  });
  it.each([
    ["report.pdf", "application/json", "json"],
    ["image.png", "application/json; charset=utf-8", "json"],
    ["data.json", "application/pdf", "pdf"],
    ["data.json", "image/png", "png"],
  ])("prefers a known MIME type over conflicting extension for %s", (name, mime, icon) => {
    expect(fileIconName(name, mime)).toBe(icon);
  });
  it("uses a generic bundled icon for unknown values and never interpolates paths", () => {
    expect(fileIconName("unknown.unknown", "application/octet-stream")).toBe("txt");
    expect(fileIconName("file.pdf/../../evil", "image/svg+xml")).toBe("svg");
  });
  it.each([false, true])("renders the shared Vivid icon inline and on tiles (%s)", (tiled) => {
    const wrapper = mount(ArtifactAttachment, {
      props: { artifact: iconArtifact, profile: "", tiled },
    });
    const icon = wrapper.get(".artifact-file-symbol img");
    expect(icon.attributes("src")).toBe(fileIconFor(iconArtifact.name, iconArtifact.mime));
    expect(icon.attributes("data-icon")).toBe("txt");
    wrapper.unmount();
  });
});
