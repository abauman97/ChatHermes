import type { Activity, Message, TurnBlock } from "../types/hermes";
import { messageText } from "./hermes-api";

type Data = Record<string, unknown>;
const string = (value: unknown) => (typeof value === "string" ? value : "");
const detail = (value: unknown) =>
  typeof value === "string" ? value : value == null ? "" : JSON.stringify(value, null, 2);
export function nativeSubagentId(data: Data): string {
  const direct = string(data.subagent_id) || string(data.child_session_id);
  if (direct) return direct;
  const delegation = string(data.delegation_id);
  return delegation && typeof data.task_index === "number" && Number.isSafeInteger(data.task_index)
    ? `${delegation}:${data.task_index}`
    : "";
}
export function toolTitle(name: string, complete = false): string {
  const labels: Record<string, [string, string]> = {
    file_search: ["Searching files", "Searched files"],
    terminal: ["Running command", "Ran command"],
    search: ["Searching files", "Searched files"],
    read_file: ["Reading file", "Read file"],
    write_file: ["Updating file", "Updated file"],
    web_search: ["Searching the web", "Searched the web"],
    web_extract: ["Reading web page", "Read web page"],
    python: ["Executing Python", "Executed Python"],
    browser: ["Using browser", "Used browser"],
  };
  const key = Object.keys(labels).find((key) => name === key || name.startsWith(key + "_"));
  return key ? labels[key]![complete ? 1 : 0] : complete ? "Used tool" : "Using tool";
}
export interface TurnEvent {
  type:
    | "text"
    | "text.snapshot"
    | "text.completed"
    | "reasoning"
    | "reasoning.completed"
    | "tool.started"
    | "tool.updated"
    | "tool.completed"
    | "tool.failed"
    | "status"
    | "completed"
    | "failed"
    | "approval";
  data: Data;
  key?: string;
}
interface NativeTurnState {
  boundary: number;
  streamText?: string;
  interimText?: string;
  finalText?: string;
  toolStream: boolean;
}
export interface AssistantTurn {
  blocks: TurnBlock[];
  seen: Set<string>;
  sequence: number;
  native?: NativeTurnState;
}
export const createTurn = (): AssistantTurn => ({ blocks: [], seen: new Set(), sequence: 0 });
export function finishTurn(turn: AssistantTurn) {
  for (const block of turn.blocks)
    if (block.kind !== "text") {
      block.complete = true;
      if (block.kind === "thinking") block.title = "Thought";
      if (block.state === "running" || block.state === "pending") block.state = "completed";
    }
}
function closeReasoning(turn: AssistantTurn) {
  for (const block of turn.blocks)
    if (block.kind === "thinking") {
      block.complete = true;
      block.state = "completed";
      block.title = "Thought";
    }
}
export function reduceTurn(turn: AssistantTurn, event: TurnEvent): void {
  if (event.key && turn.seen.has(event.key)) return;
  if (event.key) turn.seen.add(event.key);
  const { type, data } = event;
  const delta = string(data.delta) || string(data.text) || string(data.preview);
  const id = string(data.tool_call_id) || string(data.tool_id);
  const name = string(data.tool_name) || string(data.name) || string(data.tool);
  const nextId = () => `block-${++turn.sequence}`;
  if (type === "text" || type === "text.snapshot" || type === "text.completed") {
    closeReasoning(turn);
    const content = type === "text.completed" ? string(data.content) : delta;
    if (!content) return;
    // A completion can repeat streamed text after a trailing activity.
    // Compare only the latest text phase, exactly, so earlier phases stay distinct.
    if (
      type === "text.completed" &&
      [...turn.blocks].reverse().find((block) => block.kind === "text")?.content === content
    )
      return;
    let block = turn.blocks.at(-1);
    if (type === "text.snapshot") {
      const existing = turn.blocks
        .filter((item) => item.kind === "text")
        .map((item) => item.content)
        .join("");
      if (existing === content || existing.startsWith(content)) return;
      if (content.startsWith(existing)) {
        reduceTurn(turn, { type: "text", data: { delta: content.slice(existing.length) } });
        return;
      }
      // Hermes snapshots contain the current text phase, not necessarily earlier commentary.
      if (block?.kind === "text") {
        block.content = content;
        return;
      }
    }
    if (block?.kind !== "text") {
      block = { id: nextId(), kind: "text", content: "" };
      turn.blocks.push(block);
    }
    block.content = type === "text.completed" ? content : block.content + content;
  } else if (type === "reasoning" || type === "status") {
    let block = turn.blocks.at(-1);
    if (block?.kind !== "thinking" || block.complete) {
      block = {
        id: nextId(),
        kind: "thinking",
        title: type === "status" ? "Working…" : "Thinking…",
        content: "",
        complete: false,
        state: "running",
      };
      turn.blocks.push(block);
    }
    block.content += delta;
  } else if (type === "reasoning.completed") closeReasoning(turn);
  else if (type.startsWith("tool.")) {
    closeReasoning(turn);
    let block = turn.blocks.find((item) => item.kind === "tool" && id && item.id === id) as
      | Activity
      | undefined;
    if (!block && !id)
      block = [...turn.blocks]
        .reverse()
        .find(
          (item) => item.kind === "tool" && !item.complete && (!name || item.toolName === name),
        ) as Activity | undefined;
    if (!block) {
      block = {
        id: id || nextId(),
        kind: "tool",
        title: toolTitle(name),
        toolName: name,
        content: "",
        complete: false,
        state: "pending",
        startedAt: data.persisted
          ? undefined
          : typeof data.ts === "number"
            ? data.ts * 1000
            : Date.now(),
      };
      turn.blocks.push(block);
    }
    if (type === "tool.started" && block.complete) return;
    if (type === "tool.started") {
      block.state = "running";
      block.content = detail(data.args) || delta || block.content;
    } else if (type === "tool.updated") {
      if (!block.complete) block.state = "running";
      block.output = (block.output || "") + delta;
    } else {
      block.complete = true;
      block.state = type === "tool.failed" ? "failed" : "completed";
      block.title = toolTitle(block.toolName || name, true);
      block.output = detail(data.output ?? data.result ?? data.error) || block.output || delta;
      block.content = detail(data.args) || block.content;
      block.duration =
        typeof data.duration_s === "number"
          ? data.duration_s
          : block.startedAt
            ? Math.max(
                0,
                ((typeof data.ts === "number" ? data.ts * 1000 : Date.now()) - block.startedAt) /
                  1000,
              )
            : undefined;
    }
  } else {
    if (type === "failed")
      for (const block of turn.blocks)
        if (block.kind === "tool" && !block.complete) {
          block.state = "failed";
          block.output ||= "The response ended before this tool completed.";
        }
    finishTurn(turn);
  }
}

// History retains native reasoning and call IDs; tool result rows update their call.
export function historyBlocks(messages: Message[]): TurnBlock[] {
  const turn = createTurn();
  for (const message of messages) {
    if (message.role === "assistant") {
      const reasoning = message.reasoning_content || message.reasoning;
      if (reasoning) {
        reduceTurn(turn, { type: "reasoning", data: { delta: reasoning } });
        closeReasoning(turn);
      }
      const text = messageText(message.content);
      if (text) {
        // Distinct persisted assistant messages are distinct text phases.
        turn.blocks.push({ id: `block-${++turn.sequence}`, kind: "text", content: text });
      }
      const images = Array.isArray(message.content)
        ? message.content.flatMap((part) => {
            const url = part?.image_url?.url;
            return typeof url === "string" && /^(data:image\/|https?:\/\/)/.test(url) ? [url] : [];
          })
        : [];
      if (images.length) {
        let block = turn.blocks.at(-1);
        if (block?.kind !== "text") {
          block = { id: `block-${++turn.sequence}`, kind: "text", content: "" };
          turn.blocks.push(block);
        }
        block.images = images;
      }
      for (const call of message.tool_calls || [])
        reduceTurn(turn, {
          type: "tool.started",
          data: {
            tool_call_id: call.id,
            tool_name: call.function?.name,
            args: call.function?.arguments,
            persisted: true,
          },
        });
    } else if (message.role === "tool") {
      const output = messageText(message.content);
      let failed = false;
      try {
        const result = JSON.parse(output);
        failed =
          result?.is_error === true ||
          result?.success === false ||
          !!result?.error ||
          (typeof result?.exit_code === "number" && result.exit_code !== 0);
      } catch {
        /* Plain terminal/file output. */
      }
      reduceTurn(turn, {
        type: failed ? "tool.failed" : "tool.completed",
        data: {
          tool_call_id: message.tool_call_id,
          tool_name: message.tool_name,
          output,
          persisted: true,
        },
      });
    }
  }
  closeReasoning(turn);
  return turn.blocks;
}

// Merge each persisted phase once, using later matches as insertion anchors.
// History can lag live events, so retain longer live text and unfinished calls.
export function mergeHistoryBlocks(turn: AssistantTurn, restored: TurnBlock[], active: boolean) {
  const live = [...turn.blocks];
  const matches = new Map<TurnBlock, TurnBlock>();
  const toolAnchors = new Map<number, number>();
  let toolCursor = 0;
  for (const [index, item] of restored.entries()) {
    if (item.kind !== "tool") continue;
    const liveIndex = live.findIndex(
      (block, index) =>
        index >= toolCursor &&
        block.kind === "tool" &&
        (item.id === block.id || item.id.startsWith("block-") || block.id.startsWith("block-")),
    );
    if (liveIndex >= 0) {
      toolAnchors.set(index, liveIndex);
      toolCursor = liveIndex + 1;
    }
  }
  let cursor = 0;
  for (const [restoredIndex, item] of restored.entries()) {
    // Match text only between its surrounding tools, even when a phase is missing.
    const previousTool = [...toolAnchors].reverse().find(([index]) => index < restoredIndex)?.[1];
    const nextTool = [...toolAnchors].find(([index]) => index > restoredIndex)?.[1];
    const index =
      item.kind === "tool"
        ? (toolAnchors.get(restoredIndex) ?? -1)
        : live.findIndex(
            (block, index) =>
              index >= Math.max(cursor, (previousTool ?? -1) + 1) &&
              index < (nextTool ?? live.length) &&
              block.kind === item.kind &&
              (item.content.startsWith(block.content) ||
                block.content.startsWith(item.content) ||
                (!active &&
                  item === restored.at(-1) &&
                  block === live.at(-1) &&
                  item.kind === "text")),
          );
    if (index >= 0) {
      matches.set(item, live[index]!);
      cursor = index + 1;
    }
  }
  for (const [index, item] of restored.entries()) {
    const block = matches.get(item);
    if (block) {
      if (item.kind === "tool" && block.kind === "tool") {
        if (item.complete) {
          block.output = item.output;
          block.complete = true;
          block.state = item.state;
          block.title = item.title;
        }
      } else if (item.kind === "text" && block.kind === "text") {
        if (!block.content.startsWith(item.content)) block.content = item.content;
        if (item.images) block.images = item.images;
      } else if (item.content.startsWith(block.content)) block.content = item.content;
    } else {
      const next = restored
        .slice(index + 1)
        .map((item) => matches.get(item))
        .find(Boolean);
      const anchor = next ? turn.blocks.indexOf(next) : turn.blocks.length;
      const id = item.id.startsWith("block-") ? `block-${++turn.sequence}` : item.id;
      turn.blocks.splice(anchor, 0, { ...item, id });
    }
  }
}

/**
 * A sealed stream can lose a few characters while the authoritative final
 * remains the same reply. Limit the tolerated edit distance so a separate
 * assistant segment cannot replace a merely similar interim.
 */
function hasHighTextOverlap(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length);

  if (maxLength < 160) {
    return false;
  }

  const maxEdits = Math.max(1, Math.min(32, Math.floor(maxLength * 0.02)));

  if (Math.abs(left.length - right.length) > maxEdits) {
    return false;
  }

  const [shorter, longer] = left.length < right.length ? [left, right] : [right, left];

  let previous = Array.from({ length: shorter.length + 1 }, (_, index) =>
    index <= maxEdits ? index : Number.POSITIVE_INFINITY,
  );

  let current = Array.from({ length: shorter.length + 1 }, () => Number.POSITIVE_INFINITY);

  for (let longerIndex = 1; longerIndex <= longer.length; longerIndex += 1) {
    const start = Math.max(1, longerIndex - maxEdits);
    const end = Math.min(shorter.length, longerIndex + maxEdits);
    current.fill(Number.POSITIVE_INFINITY, start, end + 1);
    current[start - 1] = start === 1 ? longerIndex : Number.POSITIVE_INFINITY;

    let rowMinimum = Number.POSITIVE_INFINITY;

    for (let shorterIndex = start; shorterIndex <= end; shorterIndex += 1) {
      current[shorterIndex] = Math.min(
        previous[shorterIndex] + 1,
        current[shorterIndex - 1] + 1,
        previous[shorterIndex - 1] + Number(longer[longerIndex - 1] !== shorter[shorterIndex - 1]),
      );
      rowMinimum = Math.min(rowMinimum, current[shorterIndex]);
    }

    if (rowMinimum > maxEdits) {
      return false;
    }

    const nextPrevious = current;
    current = previous;
    previous = nextPrevious;
  }

  return previous[shorter.length] <= maxEdits;
}

/** Native Desktop semantics, without Electron/React presentation side effects.
 * References: gateway-event/message-stream.ts, index.ts, collapse-duplicate-final.ts,
 * tools.ts and chat-messages/tool-parts.ts
 * in Hermes ac28abc96ce83f22f6b831f80d9007e2aba81f21 (MIT). */
export function reduceNativeTurn(turn: AssistantTurn, name: string, data: Data) {
  const native = (turn.native ??= {
    boundary: 0,
    toolStream: false,
    streamText: turn.blocks.at(-1)?.kind === "text" ? turn.blocks.at(-1)?.id : undefined,
  });
  const textBlock = (id?: string) =>
    turn.blocks.find(
      (block, index) => index >= native.boundary && block.kind === "text" && block.id === id,
    );
  const appendText = (content: string) => {
    const block: TurnBlock = { id: `block-${++turn.sequence}`, kind: "text", content };
    turn.blocks.push(block);
    return block;
  };
  if (name === "message.start") {
    // Inputs/corrections allocate fresh turns in native-session. A prompt-less
    // start also begins an occurrence, while retaining earlier display parts.
    turn.native = { boundary: turn.blocks.length, toolStream: false };
    return;
  }
  if (name === "thinking.delta" || name === "tool.generating") return;
  if (name === "message.interim") {
    const content = string(data.text).trim();
    if (!content) return;
    closeReasoning(turn);
    let block = textBlock(native.streamText);
    // Even already_streamed interims materialize when deltas were missed.
    // Only the nearest seal can be a duplicate; earlier phases stay distinct.
    if (!block) {
      const prior = textBlock(native.interimText ?? native.finalText);
      if (
        prior &&
        prior.content.replace(/\s+/g, " ").trim() === content.replace(/\s+/g, " ").trim()
      )
        block = prior;
    }
    block ??= appendText(content);
    block.content = content;
    native.interimText = block.id;
    native.streamText = undefined;
    native.finalText = undefined;
    native.toolStream = false;
  } else if (name === "message.delta" || name === "message.complete") {
    const content = string(data.text);
    if (name === "message.delta" && content) {
      closeReasoning(turn);
      let block = textBlock(native.streamText);
      if (!block || block !== turn.blocks.at(-1)) block = appendText("");
      block.content += content;
      native.streamText = block.id;
      native.finalText = undefined;
    } else if (name === "message.complete" && content.trim()) {
      closeReasoning(turn);
      const final = content.trim();
      const streamed = textBlock(native.streamText);
      const lastTool = turn.blocks.reduce(
        (last, block, index) => (block.kind === "tool" ? index : last),
        -1,
      );
      // A final with no post-tool deltas is a new text phase. An interim seal
      // can still confirm pre-tool text via streamText (delayed seal ordering).
      const live = streamed && turn.blocks.indexOf(streamed) > lastTool ? streamed : undefined;
      const interim = textBlock(native.interimText);
      const failed = Boolean(data.error || (data.status && data.status !== "complete"));
      // Flattened Desktop bubbles retain their tools in place. Drop only the
      // duplicate text sibling, never any intervening activity or prior phase.
      const identicalSibling =
        !failed &&
        interim &&
        interim.content.trim() === final &&
        (!live || live.content.trim() === final);
      const continuesInterim =
        !failed &&
        !live &&
        !native.toolStream &&
        interim &&
        interim.content.trim() &&
        (data.response_previewed ||
          data.response_transformed ||
          interim.content.trim() === final ||
          final.startsWith(interim.content.trim()) ||
          interim.content.trim().startsWith(final) ||
          hasHighTextOverlap(interim.content.trim(), final));
      let block: TurnBlock;
      if (identicalSibling || continuesInterim) {
        block = interim!;
        if (live && live !== interim) turn.blocks.splice(turn.blocks.indexOf(live), 1);
      } else {
        // Settle an existing stream even if the authoritative text differs.
        // Exact terminal repeats are scoped to this occurrence, not all text.
        const settled = textBlock(native.finalText);
        block = live ?? (settled?.content.trim() === final ? settled : appendText(""));
      }
      block.content = final;
      native.finalText = block.id;
      native.streamText = undefined;
      native.interimText = undefined;
      native.toolStream = false;
    }
    if (name === "message.complete") {
      for (const block of turn.blocks)
        if (block.kind !== "text" && !block.delegated) {
          block.complete = true;
          if (block.state === "running" || block.state === "pending")
            block.state = data.status === "complete" ? "completed" : "failed";
        }
      if (data.reasoning && !turn.blocks.some((b) => b.kind === "thinking"))
        reduceTurn(turn, { type: "reasoning", data: { text: data.reasoning } });
      closeReasoning(turn);
    }
  } else if (name === "reasoning.delta" || name === "reasoning.available") {
    if (name === "reasoning.available") {
      const block = [...turn.blocks].reverse().find((b) => b.kind === "thinking");
      if (block && block.kind === "thinking") {
        block.content = string(data.text);
        block.complete = false;
        return;
      }
    }
    reduceTurn(turn, { type: "reasoning", data: { delta: data.text } });
  } else if (name === "tool.start" || name === "tool.complete" || name === "tool.progress") {
    if (name === "tool.start") native.toolStream = true;
    const result = data.result as Record<string, unknown> | undefined;
    const failed =
      data.is_error ||
      data.error ||
      (result &&
        typeof result === "object" &&
        (result.error ||
          result.success === false ||
          (typeof result.exit_code === "number" && result.exit_code !== 0)));
    reduceTurn(turn, {
      type:
        name === "tool.start"
          ? "tool.started"
          : name === "tool.progress"
            ? "tool.updated"
            : failed
              ? "tool.failed"
              : "tool.completed",
      data: {
        ...data,
        tool_call_id: data.tool_id,
        tool_name: data.name,
        delta: data.text || data.delta || data.preview,
        output: data.result_text ?? data.result,
      },
    });
  } else if (name.startsWith("subagent.")) {
    const id = nativeSubagentId(data);
    if (!id) return;
    const terminal = ["subagent.complete", "subagent.failed", "subagent.cancelled"].includes(name);
    reduceTurn(turn, {
      type: terminal
        ? name === "subagent.complete" && data.status === "completed"
          ? "tool.completed"
          : "tool.failed"
        : "tool.updated",
      data: {
        tool_call_id: "subagent-" + id,
        tool_name: string(data.name) || "Delegated task",
        delta: string(data.text),
        output: data.summary ?? data.text ?? data.output_tail,
      },
    });
    const block = turn.blocks.find((b) => b.id === "subagent-" + id);
    if (block && block.kind === "tool") block.delegated = true;
  }
}
