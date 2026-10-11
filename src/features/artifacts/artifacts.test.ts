import { describe, expect, it } from "vite-plus/test";
import {
  artifact,
  fileUrl,
  messageArtifacts,
  previewKind,
  textArtifacts,
  toolArtifacts,
  uploadedArtifacts,
} from "./artifacts";
describe("native artifact references", () => {
  it("reconstructs uploaded files without showing internal paths", () => {
    const content =
      "Review this\nAttached file quarterly report.csv: /srv/hermes/uploads/chathermes/abc.csv\nAttached image chart.png: /srv/hermes/uploads/chathermes/abc.png";
    expect(textArtifacts(content).text).toBe("Review this");
    expect(messageArtifacts({ role: "user", id: "m1", content })).toMatchObject([
      { name: "quarterly report.csv", direction: "uploaded", messageId: "m1", type: "text/plain" },
      { name: "chart.png", direction: "uploaded", type: "image/png" },
    ]);
  });
  it("recognizes Desktop media, sandbox, local links and quoted delivery tags", () => {
    const result = textArtifacts(
      'Here are the files.\n[Report](sandbox:/tmp/report.pdf)\nMEDIA: "/tmp/a chart.png"\n[Data](#media:%2Ftmp%2Fdata.csv)',
    );
    expect(result.files.map((file) => file.path)).toEqual([
      "/tmp/report.pdf",
      "/tmp/data.csv",
      "/tmp/a chart.png",
    ]);
    expect(result.text).toBe("Here are the files.");
  });
  it("keeps fenced code and ordinary web links intact", () => {
    const content = "```sh\ncat /tmp/report.pdf\n```\n[Docs](https://example.com/docs)";
    expect(textArtifacts(content)).toEqual({ text: content, files: [] });
    expect(artifact("javascript:alert(1)")).toBeUndefined();
  });
  it("extracts producer outputs and explicit artifacts, not files merely read", () => {
    const block = {
      id: "tool",
      kind: "tool" as const,
      title: "Tool",
      complete: true,
      content: '{"path":"/tmp/report.pdf"}',
      output: '{"output_path":"/tmp/chart.png"}',
      toolName: "write_file",
    };
    expect(toolArtifacts(block).map((file) => file.path)).toEqual([
      "/tmp/chart.png",
      "/tmp/report.pdf",
    ]);
    expect(
      toolArtifacts({ ...block, toolName: "read_file", output: '{"path":"/tmp/private.txt"}' }),
    ).toEqual([]);
    expect(toolArtifacts({ ...block, state: "failed" })).toEqual([]);
    expect(toolArtifacts({ ...block, complete: false })).toEqual([]);
  });
  it("pins retrieval to the originating profile and stored session", () => {
    const url = new URL(
      fileUrl({ ...artifact("/tmp/report.pdf")!, sessionId: "session-1" }, "work", true),
      "https://dashboard.test",
    );
    expect(url.pathname).toBe("/api/plugins/chathermes/files/download");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      path: "/tmp/report.pdf",
      profile: "work",
      session_id: "session-1",
      name: "report.pdf",
    });
    expect(previewKind(artifact("/tmp/app.html")!)).toBe("text");
    expect(previewKind(artifact("/tmp/unknown.bin")!)).toBeUndefined();
  });
});

it("preserves multiple image content parts and determines types from server filenames", () => {
  const images = messageArtifacts({
    role: "assistant",
    content: [
      { type: "image_url", image_url: { url: "data:image/png;base64,AA==" } },
      { type: "image_url", image_url: { url: "data:image/png;base64,AQ==" } },
    ],
  });
  expect(images).toHaveLength(2);
  expect(artifact("sandbox:/tmp/report.pdf", "Download")).toMatchObject({
    name: "report.pdf",
    type: "application/pdf",
  });
});

it("hides native context refs when the original upload annotation supplies a card", () => {
  const parsed = textArtifacts(
    "Review this\nAttached file report.txt: /tmp/original.txt\n@file:./attachments/report.txt",
  );
  expect(parsed.text).toBe("Review this");
  expect(parsed.files.map((file) => file.name)).toEqual(["report.txt"]);
});

it("retains authoritative tool file metadata when available", () => {
  expect(
    toolArtifacts({
      id: "generated",
      kind: "tool",
      title: "Generated",
      complete: true,
      toolName: "export_report",
      content: "",
      output: JSON.stringify({
        output_path: "/tmp/report.pdf",
        mime_type: "application/pdf",
        bytes: 4096,
      }),
    }),
  ).toMatchObject([{ name: "report.pdf", type: "application/pdf", size: 4096 }]);
});

it("keeps requested output paths in the user prompt and does not collect arbitrary tool reads", () => {
  const content =
    "Create /tmp/report.pdf and /tmp/chart.png\nAttached file source.txt: /tmp/uploaded.txt";
  expect(uploadedArtifacts(content).text).toBe("Create /tmp/report.pdf and /tmp/chart.png");
  expect(messageArtifacts({ role: "user", content }).map((file) => file.name)).toEqual([
    "source.txt",
  ]);
  expect(
    messageArtifacts({
      role: "tool",
      tool_name: "read_file",
      content: '{"path":"/tmp/private.txt"}',
    }),
  ).toEqual([]);
});
