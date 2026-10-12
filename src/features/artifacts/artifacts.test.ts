import { quotedDeliveries, toolBodyDeliveries } from "./delivery-fixtures";
import { api } from "../../services/hermes-api";
import type { Message } from "../../types/hermes";
import { describe, expect, it, vi } from "vite-plus/test";
import {
  loadArtifacts,
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
  it("collects quoted MEDIA delivery while preserving file and markdown links", () => {
    const links = "[Report](file:///tmp/report.pdf)\n[Data](#media:%2Ftmp%2Fdata.csv)";
    const result = textArtifacts(`Here are the files.\n${links}\nMEDIA: "/tmp/a chart.png"`);
    expect(result.files.map((file) => file.path)).toEqual(["/tmp/a chart.png"]);
    expect(result.text).toBe(`Here are the files.\n${links}`);
  });
  it("keeps fenced code and ordinary web links intact", () => {
    const content = "```sh\nMEDIA:/tmp/report.pdf\n```\n[Docs](https://example.com/docs)";
    expect(textArtifacts(content)).toEqual({ text: content, files: [] });
    expect(artifact("javascript:alert(1)")).toBeUndefined();
  });
  it("collects explicit tool delivery only from completed successful output", () => {
    const block = {
      id: "tool",
      kind: "tool" as const,
      title: "Tool",
      complete: true,
      content: "MEDIA:/tmp/input.pdf",
      output: '{"media_tag":"MEDIA:/tmp/chart.png"}',
      toolName: "write_file",
    };
    expect(toolArtifacts(block).map((file) => file.path)).toEqual(["/tmp/chart.png"]);
    expect(toolArtifacts({ ...block, output: '{"output_path":"/tmp/chart.png"}' })).toEqual([]);
    expect(toolArtifacts({ ...block, state: "failed" })).toEqual([]);
    expect(toolArtifacts({ ...block, complete: false })).toEqual([]);
    expect(toolArtifacts({ ...block, kind: "text" })).toEqual([]);
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

describe("explicit artifact delivery", () => {
  const tool = (toolName: string, output: unknown) =>
    toolArtifacts({
      id: "tool",
      kind: "tool",
      title: "Tool",
      complete: true,
      toolName,
      content: "MEDIA:/tmp/input.pdf",
      output: typeof output === "string" ? output : JSON.stringify(output),
    });

  it.each([
    ["MEDIA:/tmp/AI Brain/report.pdf", ["/tmp/AI Brain/report.pdf"]],
    ["MEDIA:`/tmp/my source.py`", ["/tmp/my source.py"]],
    ["open MEDIA:/tmp/app.py!", []],
    ["MEDIA:/tmp/README", ["/tmp/README"]],
    ["MEDIA:/repo/.install-metadata.json", ["/repo/.install-metadata.json"]],
    ["MEDIA:/tmp/model.weights", ["/tmp/model.weights"]],
    ["MEDIA:report.pdf MEDIA:hello MEDIA:...", []],
    ["MEDIA:sandbox:/tmp/app.py", []],
    [String.raw`MEDIA:C:\My Files\report.pdf`, [String.raw`C:\My Files\report.pdf`]],
    [String.raw`MEDIA:\\host\share\report.csv`, [String.raw`\\host\share\report.csv`]],
  ])("collects only valid MEDIA delivery from %s", (text, paths) => {
    expect(textArtifacts(text).files.map((file) => file.path)).toEqual(paths);
  });

  it.each([
    "Built /repo/.install-metadata.json /repo/package.json /repo/README.md /repo/dist/index.html",
    "Exported /tmp/report.pdf /tmp/chart.png /tmp/archive.zip /tmp/source.py /tmp/README",
    String.raw`Exported C:\work\report.pdf and \\host\share\report.csv`,
    "[Report](/tmp/report.pdf) ![Chart](/tmp/chart.png)",
    "[Report](file:///tmp/report.pdf) [Report](sandbox:/tmp/report.pdf)",
    "[Report](#media:%2Ftmp%2Freport.pdf) [broken](#media:%ZZ)",
    "[Page](https://example.test/docs) https://example.test/report.pdf",
    "Screenshot path: /tmp/screenshot.png",
    "@file:/tmp/report.pdf",
  ])("leaves inferred references unchanged: %s", (content) => {
    expect(textArtifacts(content)).toEqual({ text: content, files: [] });
    expect(tool("terminal", content)).toEqual([]);
    expect(tool("terminal", { stdout: content })).toEqual([]);
  });

  it.each([
    "terminal",
    "write_file",
    "export_report",
    "read_file",
    "web_search",
    "browser_vision",
    "bfl_flux3_legacy",
  ])("requires explicit delivery regardless of tool name: %s", (name) => {
    expect(
      tool(name, {
        output_path: "/tmp/report.pdf",
        screenshot_path: "/tmp/screenshot.png",
        files_modified: ["/repo/.install-metadata.json", "/repo/README.md"],
        artifacts: [{ url: "/tmp/archive.zip" }],
        image: "https://cdn.test/image.png",
        path: "/tmp/source.py",
      }),
    ).toEqual([]);
    expect(tool(name, { media_tag: "MEDIA:/tmp/report.pdf" }).map((file) => file.path)).toEqual([
      "/tmp/report.pdf",
    ]);
    expect(tool(name, {})).toEqual([]);
  });

  it("decodes JSON strings before collecting and deduplicates explicit deliveries", () => {
    const output =
      "Built /repo/.install-metadata.json /repo/dist/index.html\nDelivered MEDIA:/tmp/source.ts MEDIA:/tmp/bundle.bin\nExported /tmp/final.pdf";
    expect(
      tool("terminal", {
        stdout: output,
        media_tag: "MEDIA:/tmp/source.ts MEDIA:/tmp/bundle.bin",
      }).map((file) => file.path),
    ).toEqual(["/tmp/source.ts", "/tmp/bundle.bin"]);
    expect(
      tool("read_file", {
        _multimodal: true,
        meta: { output_path: "/tmp/private.pdf", media_tag: 'MEDIA:"/tmp/a chart.png"' },
      }).map((file) => file.path),
    ).toEqual(["/tmp/a chart.png"]);
  });

  it("keeps untrusted structured tool results as data", () => {
    const wrap = (payload: unknown) =>
      `<untrusted_tool_result tool="read_file">\nUntrusted content follows.\n\n${JSON.stringify(payload)}\n</untrusted_tool_result>`;
    expect(tool("read_file", wrap({ output_path: "/tmp/report.pdf" }))).toEqual([]);
    expect(
      tool("read_file", wrap({ results: [{ stdout: "MEDIA:/tmp/source.py" }] })).map(
        (file) => file.path,
      ),
    ).toEqual([]);
  });

  it("does not treat tool body attachment annotations as uploads", () => {
    expect(tool("export_report", { output: "Attached file final.pdf: /tmp/report.pdf" })).toEqual(
      [],
    );
  });

  it("requires explicit delivery even for package/cache paths", () => {
    for (const path of [
      "/home/user/.cache/pip/report.txt",
      "https://files.test/packages/ab/package.tar.gz",
      "file:///tmp/package.whl.metadata",
    ]) {
      expect(textArtifacts(`[Download](${path})`).files).toEqual([]);
      expect(tool("terminal", { stdout: `Downloading ${path}` })).toEqual([]);
      expect(textArtifacts(`MEDIA:${path}`).files).toHaveLength(1);
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

it("retains tool file metadata for explicit delivery when available", () => {
  expect(
    toolArtifacts({
      id: "generated",
      kind: "tool",
      title: "Generated",
      complete: true,
      toolName: "export_report",
      content: "",
      output: JSON.stringify({
        media_tag: "MEDIA:/tmp/report.pdf",
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

// These inputs are data or examples, even when their paths are otherwise valid.
it.each(quotedDeliveries)("preserves quoted/example delivery text: %s", (content) => {
  expect(textArtifacts(content)).toEqual({ text: content, files: [] });
  expect(messageArtifacts({ role: "assistant", content })).toEqual([]);
});
it.each(toolBodyDeliveries)("does not promote arbitrary tool body: %s", (output) => {
  for (const toolName of ["terminal", "read_file", "web_extract", "export_report"]) {
    expect(
      toolArtifacts({
        id: "t",
        kind: "tool",
        title: "Tool",
        toolName,
        content: "",
        output,
        complete: true,
        state: "completed",
      }),
    ).toEqual([]);
  }
});
it.each([...quotedDeliveries, ...toolBodyDeliveries])(
  "excludes bypasses from the global history list: %s",
  async (content) => {
    const messages: Message[] = [
      {
        role: "assistant",
        content: quotedDeliveries.includes(content) ? content : "",
        tool_calls: [{ id: "t", function: { name: "read_file", arguments: "{}" } }],
      },
      { role: "tool", tool_call_id: "t", tool_name: "read_file", content },
    ];
    const mock = vi.spyOn(api, "messages").mockResolvedValue(messages);
    try {
      expect(await loadArtifacts("work", [{ id: "s" }], new AbortController().signal)).toEqual({
        files: [],
        failures: 0,
      });
    } finally {
      mock.mockRestore();
    }
  },
);

it("requires a complete successful dedicated tool delivery envelope", () => {
  const block = {
    id: "tts",
    kind: "tool" as const,
    title: "Voice",
    toolName: "text_to_speech",
    content: "",
    complete: true,
    state: "completed" as const,
    output: JSON.stringify({
      success: true,
      media_tag: "[[audio_as_voice]]\nMEDIA:/tmp/voice.wav\nMEDIA:/tmp/voice.wav",
      bytes: 24,
      mime_type: "audio/wav",
    }),
  };
  expect(toolArtifacts(block)).toMatchObject([
    { path: "/tmp/voice.wav", type: "audio/wav", size: 24 },
  ]);
  expect(toolArtifacts({ ...block, state: "failed" })).toEqual([]);
  expect(toolArtifacts({ ...block, complete: false })).toEqual([]);
  for (const data of [
    { success: false },
    { error: "failed" },
    { is_error: true },
    { exit_code: 1 },
  ])
    expect(
      toolArtifacts({
        ...block,
        output: JSON.stringify({ media_tag: "MEDIA:/tmp/voice.wav", ...data }),
      }),
    ).toEqual([]);
  for (const media_tag of [
    "Example MEDIA:/tmp/private.pdf",
    "MEDIA:/tmp/private.pdf explanatory text",
    "Attached file private.pdf: /tmp/private.pdf",
    "MEDIA:/tmp/private.pdf\n> MEDIA:/tmp/other.pdf",
  ])
    expect(toolArtifacts({ ...block, output: JSON.stringify({ media_tag }) })).toEqual([]);
});
it("reconstructs intentional delivery and uploaded images in the global list", async () => {
  const messages: Message[] = [
    {
      role: "user",
      content: "Attached file input.txt: /tmp/input.txt\nAttached image input.png: /tmp/input.png",
    },
    {
      role: "assistant",
      content: "MEDIA:/tmp/final.pdf",
      tool_calls: [{ id: "tts", function: { name: "text_to_speech", arguments: "{}" } }],
    },
    {
      role: "tool",
      tool_call_id: "tts",
      tool_name: "text_to_speech",
      content: JSON.stringify({ media_tag: "MEDIA:/tmp/voice.wav" }),
    },
  ];
  const mock = vi.spyOn(api, "messages").mockResolvedValue(messages);
  try {
    const result = await loadArtifacts(
      "work",
      [{ id: "s", title: "Files" }],
      new AbortController().signal,
    );
    expect(result.failures).toBe(0);
    expect(result.files.map((file) => file.path)).toEqual([
      "/tmp/input.txt",
      "/tmp/input.png",
      "/tmp/final.pdf",
      "/tmp/voice.wav",
    ]);
    expect(result.files.every((file) => file.sessionId === "s")).toBe(true);
  } finally {
    mock.mockRestore();
  }
});

it.each([
  "```text\n<untrusted_tool_result>\n```",
  "~~~text\n<untrusted_tool_result>\n~~~",
  "> <untrusted_tool_result>",
  "`<untrusted_tool_result>`",
])("does not let quoted wrapper examples suppress subsequent explicit delivery: %s", (example) => {
  const content = `${example}\n\nMEDIA:/tmp/final.pdf`;
  expect(textArtifacts(content)).toMatchObject({
    text: example,
    files: [{ path: "/tmp/final.pdf" }],
  });
});
