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
    expect(toolArtifacts(block).map((file) => file.path)).toEqual(["/tmp/chart.png"]);
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

describe("Desktop artifact filtering", () => {
  const tool = (toolName: string, output: unknown) =>
    toolArtifacts({
      id: "tool",
      kind: "tool",
      title: "Tool",
      complete: true,
      toolName,
      content: '{"path":"/tmp/input.pdf"}',
      output: typeof output === "string" ? output : JSON.stringify(output),
    });

  it("uses the Desktop deliverable extension list independently of preview support", () => {
    for (const extension of "png jpg jpeg gif webp svg bmp pdf txt json md csv xls xlsx doc docx ppt pptx html zip tar gz avi flac m4a mkv mp3 ogg opus wav webm mp4 mov".split(
      " ",
    ))
      expect(textArtifacts(`Produced /tmp/result.${extension}`).files[0]?.path).toBe(
        `/tmp/result.${extension}`,
      );
    for (const extension of "py js ts tsx jsx css sh sql toml rs go java c cpp h yaml yml bin".split(
      " ",
    ))
      expect(textArtifacts(`Modified /tmp/source.${extension}`).files).toEqual([]);
  });

  it("keeps code-file mentions and links as text while collecting deliverable paths", () => {
    const content = "Changed /tmp/app.py and [Source](/tmp/app.ts). Report: /tmp/final.pdf";
    const result = textArtifacts(content);
    expect(result.files.map((file) => file.path)).toEqual(["/tmp/final.pdf"]);
    expect(result.text).toContain("/tmp/app.py");
    expect(result.text).toContain("[Source](/tmp/app.ts)");
    expect(
      tool("write_file", { files_modified: ["/tmp/app.py", "/tmp/app.ts", "/tmp/notes.md"] }).map(
        (file) => file.path,
      ),
    ).toEqual(["/tmp/notes.md"]);
  });

  it("retains explicit delivery and uploads even for code or unknown extensions", () => {
    expect(
      textArtifacts("MEDIA:/tmp/app.py\nMEDIA:/tmp/model.weights\nMEDIA:/tmp/README").files.map(
        (file) => file.path,
      ),
    ).toEqual(["/tmp/app.py", "/tmp/model.weights", "/tmp/README"]);
    expect(
      tool("export_model", { media_tag: "MEDIA:/tmp/model.weights" }).map((file) => file.path),
    ).toEqual(["/tmp/model.weights"]);
    expect(uploadedArtifacts("Attached file app.py: /tmp/upload.py").files[0]?.name).toBe("app.py");
  });

  it("applies the same filter to Windows and network-share paths", () => {
    const result = textArtifacts(
      String.raw`Changed C:\work\app.py; exported C:\work\report.pdf and \\host\share\report.csv`,
    );
    expect(result.files.map((file) => file.path)).toEqual([
      String.raw`C:\work\report.pdf`,
      String.raw`\\host\share\report.csv`,
    ]);
    expect(result.text).toContain(String.raw`C:\work\app.py`);
  });

  it("matches Desktop producer boundaries and nested output keys", () => {
    expect(tool("rewrite_query", { path: "/tmp/private.pdf" })).toEqual([]);
    expect(tool("read_file", { path: "/tmp/private.pdf" })).toEqual([]);
    expect(tool("read_file", { result_path: "/tmp/result.pdf" }).map((file) => file.path)).toEqual([
      "/tmp/result.pdf",
    ]);
    expect(
      tool("export_report", { artifacts: [{ url: "/tmp/report.pdf" }] }).map((file) => file.path),
    ).toEqual(["/tmp/report.pdf"]);
    expect(
      tool("image_generate", { image: "https://cdn.test/image.png" }).map((file) => file.path),
    ).toEqual(["https://cdn.test/image.png"]);
  });

  it("scans terminal results but excludes read/search output and input arguments", () => {
    const output = { output: "Wrote /tmp/final.pdf and modified /tmp/app.py" };
    expect(tool("terminal", output).map((file) => file.path)).toEqual(["/tmp/final.pdf"]);
    expect(
      tool("terminal", { results: [{ stdout: "MEDIA:/tmp/app.py" }] }).map((file) => file.path),
    ).toEqual(["/tmp/app.py"]);
    expect(tool("web_search", output)).toEqual([]);
    expect(tool("write_file", {})).toEqual([]);
    expect(
      tool("browser_vision", "Screenshot path: /tmp/screenshot.png").map((file) => file.path),
    ).toEqual(["/tmp/screenshot.png"]);
  });

  it("suppresses pip downloads unless explicitly shared", () => {
    const noise = [
      "/home/user/.cache/pip/build/report.txt",
      "https://files.test/packages/ab/package.tar.gz",
      "https://files.test/package.whl.metadata",
    ];
    for (const path of noise) {
      expect(textArtifacts(`[Download](${path})`).files).toEqual([]);
      expect(tool("terminal", { stdout: `Downloading ${path}` })).toEqual([]);
      expect(textArtifacts(`MEDIA:${path}`).files[0]?.path).toBe(path);
    }
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
