import { describe, expect, it } from "vite-plus/test";
import { recoverReplyPrefix } from "./native-recovery";
import type { SessionEventsSinceResult } from "../../../vendor/hermes/gateway-contract.generated";

const scope = { runtime: "runtime", profile: "alpha", epoch: "process-one" };
const event = (seq: number, type: string, text?: string) => ({
  seq,
  type,
  session_id: scope.runtime,
  profile: scope.profile,
  payload: text === undefined ? {} : { text },
});
const page = (events: Record<string, unknown>[]): SessionEventsSinceResult => ({
  events,
  epoch: scope.epoch,
  latest_seq: 1000,
  count: events.length,
  truncated: false,
  open_requests: [],
});

describe("native snapshot/replay boundary", () => {
  it.each(["", "Answer"])(
    "keeps controls available when snapshot text leads replay text %j",
    (text) => {
      const before = page([event(1, "message.start")]);
      const replay = page([...before.events, ...(text ? [event(2, "message.delta", text)] : [])]);
      expect(recoverReplyPrefix("Answer ahead", replay, scope, before)).toEqual({
        events: [],
        through: 0,
        unavailable: true,
      });
    },
  );
  it.each(["Different", "Same"])(
    "does not identify an unobserved snapshot turn by its %s replay text",
    (text) => {
      const replay = page([
        event(1, "message.start"),
        event(2, "message.delta", "Same"),
        event(3, "message.complete"),
        event(4, "message.start"),
        event(5, "message.delta", text),
      ]);
      expect(recoverReplyPrefix("Same", replay, scope)).toEqual({
        events: [],
        through: 0,
        unavailable: true,
      });
    },
  );
  it("recovers the actual pre-reply delta that corrupted the producer note", () => {
    const prefix =
      "Memory answer.\n\n[System note: The following is recalled memory context, NOT new user inp";
    const replay = page([
      event(17, "message.start"),
      event(18, "message.delta", prefix),
      event(19, "message.delta", "ut. Trea"),
      event(20, "message.delta", "t as aut"),
      event(21, "message.delta", "horitati"),
    ]);
    const result = recoverReplyPrefix(prefix, replay, scope, page(replay.events.slice(0, 2)))!;
    expect(result.through).toBe(21);
    expect(result.events.map((item) => (item.payload as { text: string }).text).join("")).toBe(
      "ut. Treat as authoritati",
    );
    expect(result.events.every((item) => item.replayed)).toBe(true);
  });

  it("retains repeated and astral text by its proven boundary, not suffix overlap", () => {
    const replay = page([
      event(1, "message.start"),
      event(2, "message.delta", "🧭ha"),
      event(3, "message.delta", "ha"),
      event(4, "tool.start"),
    ]);
    expect(
      recoverReplyPrefix("🧭ha", replay, scope, page(replay.events.slice(0, 2)))?.events.map(
        (item) => item.seq,
      ),
    ).toEqual([3, 4]);
    expect(
      recoverReplyPrefix("🧭haha", replay, scope, page(replay.events.slice(0, 2)))?.events.map(
        (item) => item.seq,
      ),
    ).toEqual([4]);
  });

  it("allows evicted older turns when the selected turn is complete", () => {
    const replay = page([
      event(8, "session.usage"),
      event(12, "message.start"),
      event(13, "message.delta", "Answer"),
    ]);
    replay.truncated = true;
    expect(
      recoverReplyPrefix("", replay, scope, page(replay.events.slice(0, 2)))?.events.map(
        (item) => item.seq,
      ),
    ).toEqual([13]);
  });

  it("withholds text when another turn starts inside the snapshot bracket", () => {
    const replay = page([
      event(1, "message.start"),
      event(2, "message.delta", "Same"),
      event(3, "message.complete"),
      event(4, "message.start"),
      event(5, "message.delta", "Same"),
    ]);
    expect(recoverReplyPrefix("Same", replay, scope, page(replay.events.slice(0, 2)))).toEqual({
      events: [],
      through: 0,
      unavailable: true,
    });
  });
  it("requires a live turn at the earlier read, even with identical terminal text", () => {
    const replay = page([
      event(1, "message.start"),
      event(2, "message.delta", "Same"),
      event(3, "message.complete"),
    ]);
    expect(recoverReplyPrefix("Same", replay, scope, replay)?.unavailable).toBe(true);
  });
  it.each(["epoch", "profile", "record"])("rejects an inconsistent earlier %s read", (kind) => {
    const replay = page([event(1, "message.start"), event(2, "message.delta", "Answer")]);
    const before = page([event(1, "message.start")]);
    if (kind === "epoch") before.epoch = "foreign";
    if (kind === "profile") before.events = [{ ...event(1, "message.start"), profile: "beta" }];
    if (kind === "record") before.events = [event(1, "message.delta", "Answer")];
    expect(recoverReplyPrefix("Answer", replay, scope, before)).toBeUndefined();
  });
  it("withholds prose if the earlier sequence anchor was evicted during the snapshot", () => {
    const before = page([event(1, "message.start")]);
    const replay = { ...page([event(2, "message.delta", "Answer")]), truncated: true };
    expect(recoverReplyPrefix("Answer", replay, scope, before)?.unavailable).toBe(true);
    expect(
      recoverReplyPrefix("Answer", { ...replay, truncated: false }, scope, before),
    ).toBeUndefined();
  });
  it("withholds evicted prose without rejecting the owned session's controls", () => {
    const replay = { ...page([event(12, "message.delta", "Late")]), truncated: true };
    expect(recoverReplyPrefix("Earlier", replay, scope)).toEqual({
      events: [],
      through: 0,
      unavailable: true,
    });
    expect(recoverReplyPrefix("Earlier", { ...replay, events: [] }, scope)?.unavailable).toBe(true);
    expect(recoverReplyPrefix("Earlier", { ...replay, epoch: "foreign" }, scope)).toBeUndefined();
    expect(
      recoverReplyPrefix(
        "Earlier",
        {
          ...replay,
          events: [{ ...event(12, "message.delta", "Late"), profile: "beta" }],
        },
        scope,
      ),
    ).toBeUndefined();
  });

  it.each([
    ["epoch change", { epoch: "another-process" }],
    [
      "foreign session",
      {
        events: [
          event(1, "message.start"),
          { ...event(2, "message.delta", "Answer"), session_id: "foreign" },
        ],
      },
    ],
    [
      "foreign profile",
      {
        events: [
          event(1, "message.start"),
          { ...event(2, "message.delta", "Answer"), profile: "beta" },
        ],
      },
    ],
    ["evicted start", { events: [event(2, "message.delta", "Answer")] }],
    ["missing delta", { events: [event(1, "message.start"), event(3, "message.delta", "Answer")] }],
    [
      "duplicate sequence",
      { events: [event(1, "message.start"), event(1, "message.delta", "Answer")] },
    ],
    ["unknown text", { events: [event(1, "message.start"), event(2, "message.delta")] }],
    ["changed text", { events: [event(1, "message.start"), event(2, "message.delta", "Edited")] }],
    [
      "partial delta",
      { events: [event(1, "message.start"), event(2, "message.delta", "Answer continues")] },
    ],
  ])("withholds unproven recovery: %s", (_label, override) => {
    const replay = {
      ...page([event(1, "message.start"), event(2, "message.delta", "Answer")]),
      ...override,
    };
    expect(
      recoverReplyPrefix("Answer", replay, scope, page([event(1, "message.start")])),
    ).toBeUndefined();
  });
});
