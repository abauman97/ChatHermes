import { expect, it } from "vite-plus/test";
import { savedResponseTargets } from "./saved-response-targets";
import type { Message } from "../../../types/hermes";

it("binds repeated answers by their complete ordered conversation without replacing live blocks", () => {
  const saved: Message[] = [
    { id: "1", role: "user", content: "First" },
    { id: "2", role: "assistant", content: "Same" },
    { id: "3", role: "user", content: "Second" },
    { id: "4", role: "assistant", content: "Same" },
  ];
  const live: Message[] = [
    ...saved.slice(0, 2),
    {
      id: "native-user-1",
      role: "user",
      content: "Second",
      blocks: [{ id: "text", kind: "text", content: "Same" }],
    },
  ];
  expect(savedResponseTargets(live, saved)).toEqual({ "turn-1": "2", "turn-native-user-1": "4" });
  expect(savedResponseTargets(live, saved.slice(0, 2))).toEqual({});
  expect(savedResponseTargets([{ ...live[2]!, content: "Other question" }], saved)).toEqual({});
  expect(
    savedResponseTargets(live, [...saved.slice(0, 3), { ...saved[3]!, content: "Different" }]),
  ).toEqual({});
});

it("matches native upload references while requiring the same authenticated file paths", () => {
  const live: Message[] = [
    {
      role: "user",
      id: "native-user-1",
      content: "Read this\nAttached file report.txt: /tmp/report.txt",
      blocks: [{ kind: "text", id: "answer", content: "Answer" }],
    },
  ];
  const saved: Message[] = [
    {
      role: "user",
      id: "1",
      content:
        "Read this\nAttached file report.txt: /tmp/report.txt\n@file:/tmp/report.txt\n\n--- Attached Context ---\n\nExpanded file contents",
    },
    { role: "assistant", id: "2", content: "Answer" },
  ];
  expect(savedResponseTargets(live, saved)).toEqual({ "turn-native-user-1": "2" });
  expect(
    savedResponseTargets(live, [
      { ...saved[0]!, content: "Read this\nAttached file report.txt: /tmp/other.txt" },
      saved[1]!,
    ]),
  ).toEqual({});
});
