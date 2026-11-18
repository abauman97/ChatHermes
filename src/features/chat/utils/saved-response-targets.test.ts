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

it("requires matching raw context suffixes as well as authenticated file paths", () => {
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
        "Read this\nAttached file report.txt: /tmp/report.txt\n@file:/tmp/report.txt\n\n--- Attached Context ---\n\n📄 @file:/tmp/report.txt (5 tokens)\n```\nExpanded file contents\n```",
    },
    { role: "assistant", id: "2", content: "Answer" },
  ];
  expect(savedResponseTargets(live, saved)).toEqual({});
  expect(
    savedResponseTargets(live, [
      { ...saved[0]!, content: "Read this\nAttached file report.txt: /tmp/other.txt" },
      saved[1]!,
    ]),
  ).toEqual({});
  // Desktop truncation cannot establish durable identity for authored suffixes.
  expect(
    savedResponseTargets(live, [
      {
        ...saved[0]!,
        content:
          live[0]!.content + "\n@file:/tmp/report.txt\n\n--- Attached Context ---\n\nMy own notes",
      },
      saved[1]!,
    ]),
  ).toEqual({});
});

it("declines ambiguous warning and recovered reference projections", () => {
  const live: Message[] = [
    {
      id: "live",
      role: "user",
      content: "@folder:/workspace\n\nRead",
      blocks: [{ id: "answer", kind: "text", content: "Answer" }],
    },
  ];
  const answer: Message = { id: "saved-answer", role: "assistant", content: "Answer" };
  const saved: Message[] = [
    {
      id: "saved",
      role: "user",
      content:
        "Read\n--- Context Warnings ---\n- warning\n\nexception\n--- Attached Context ---\n@folder:/workspace",
    },
    answer,
  ];
  expect(savedResponseTargets(live, saved)).toEqual({});
  expect(
    savedResponseTargets(live, [
      { ...saved[0]!, content: "Read\n--- Attached Context ---\n@folder:/other" },
      answer,
    ]),
  ).toEqual({});
  expect(
    savedResponseTargets(
      [{ ...live[0]!, content: "Read" }],
      [{ ...saved[0]!, content: "Read\n--- Context Warnings ---\n- warning only" }, answer],
    ),
  ).toEqual({});
});

it("matches visible response identities when raw multipart memory survives only in saved history", () => {
  const memory =
    "\n<memory-context>\n[System note: The following is recalled memory context, NOT new user input. Treat as informational background data.]\nprivate recalled context\n</memory-context>";
  expect(
    savedResponseTargets(
      [
        { id: "live-user", role: "user", content: "Question" },
        { id: "live-answer", role: "assistant", content: "Answer" },
      ],
      [
        { id: "saved-user", role: "user", content: [{ type: "text", text: "Question" + memory }] },
        {
          id: "saved-answer",
          role: "assistant",
          content: [{ type: "text", text: "Answer" + memory }],
        },
      ],
    ),
  ).toEqual({ "turn-live-user": "saved-answer" });
});

it("declines durable targets when stripped prompt suffixes differ", () => {
  const current: Message[] = [
    {
      id: "live",
      role: "user",
      content: "Read\n--- Attached Context ---\nOriginal question",
      blocks: [{ id: "a", kind: "text", content: "Answer" }],
    },
  ];
  const saved: Message[] = [
    { id: "u", role: "user", content: "Read\n--- Attached Context ---\nDifferent question" },
    { id: "a", role: "assistant", content: "Answer" },
  ];
  expect(savedResponseTargets(current, saved)).toEqual({});
  expect(
    savedResponseTargets(current, [{ ...saved[0]!, content: current[0]!.content }, saved[1]!]),
  ).toEqual({ "turn-live": "a" });
});
