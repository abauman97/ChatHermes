import { describe, expect, it } from "vite-plus/test";
import type { Activity } from "../../../types/hermes";
import { commandPreview, toolGroupLabel, toolLabel } from "./activity-labels";
const command: Activity = {
  id: "a",
  kind: "tool",
  toolName: "terminal",
  title: "Running command",
  content: JSON.stringify({ command: "git status --short\nprintf done" }),
  complete: true,
  state: "completed",
};
describe("desktop activity labels", () => {
  it("shows the first command line and updates its execution verb", () => {
    expect(commandPreview(command)).toBe("git status --short");
    expect(toolLabel(command, true)).toBe("Running git status --short");
    expect(toolGroupLabel([command], false)).toBe("Ran 1 command");
  });
  it("summarizes mixed adjacent tools as commands and tools", () => {
    const search = { ...command, toolName: "session_search" };
    expect(toolGroupLabel([command, command, search], false)).toBe("Ran 2 commands, used 1 tool");
    expect(toolGroupLabel([command, search], true)).toBe("Ran 1 command, using 1 tool");
  });
  it("does not describe failed or missing results as successful execution", () => {
    expect(toolLabel({ ...command, state: "failed" }, false)).toBe("Command git status --short");
    expect(toolGroupLabel([command, { ...command, state: "unknown" }], false)).toBe("2 commands");
  });
  it("handles incomplete streaming arguments and avoids duplicate tool names", () => {
    expect(toolLabel({ ...command, content: '{"command":' }, true)).toBe("Running command");
    expect(
      toolLabel({ ...command, toolName: "session_search", title: "Searching sessions" }, true),
    ).toBe("Searching sessions");
  });
});

it("matches desktop file exploration and multi-page extraction summaries", () => {
  const read = { ...command, toolName: "read_file", content: '{"path":"/repo/wiring.tsx"}' };
  expect(toolGroupLabel([read, command], false)).toBe("Explored wiring.tsx, ran 1 command");
  expect(toolGroupLabel([read, read], false)).toBe("Explored 2 files");
  expect(
    toolGroupLabel(
      [
        {
          ...command,
          toolName: "web_extract",
          content: '{"urls":["https://a.test","https://b.test"]}',
        },
      ],
      false,
    ),
  ).toBe("Read 2 pages");
});
it("counts unknown tools and narrates only the active category", () => {
  const tool = { ...command, toolName: "custom_tool", title: "Used tool" };
  expect(toolGroupLabel([tool, tool], false)).toBe("Used 2 tools");
  expect(toolGroupLabel([tool, { ...command, complete: false, state: "running" }], true)).toBe(
    "Running git status --short, used 1 tool",
  );
  expect(toolLabel(tool, false)).toBe("Used custom tool");
});
