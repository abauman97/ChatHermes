import type { Message } from "../../../types/hermes";
import { messageText } from "../../../services/hermes-api";
import { uploadedArtifacts } from "../../artifacts/artifacts";
import {
  assistantTextSource,
  memoryContextSlice,
  memoryContextRanges,
} from "../../../utils/memory-context";
import { transcriptEntries } from "./transcript-entries";

// Native file.attach adds staged @file refs alongside the original upload identity.
// Compare the same prose and file identities that UserMessage renders.
export function userProjection(message: Message): string {
  const upload = uploadedArtifacts(messageText(message.content));
  const raw = messageText(message.content);
  // Display truncation is lossy. Without producer provenance, differing hidden
  // suffixes cannot establish a durable conversation identity.
  const suffix = raw.match(/(?:^|\n)--- (?:Attached Context|Context Warnings) ---[\s\S]*$/)?.[0];
  return JSON.stringify([upload.text, upload.files.map((file) => file.path).sort(), suffix]);
}

/** Branch only when the entire ordered visible conversation agrees with saved
 * history. Repeated answers remain distinct by position; a partial/steered or
 * unreconciled projection gets no inferred durable identities. */
export function savedResponseTargets(
  projected: Message[],
  saved: Message[],
): Record<string, string> {
  const prose = (messages: Message[]) =>
    transcriptEntries({ messages, progress: [] }).flatMap((entry) => {
      if (entry.kind === "user")
        return [
          {
            kind: "user",
            text: userProjection(entry.message),
            key: entry.key,
            id: undefined as string | undefined,
          },
        ];
      if (entry.kind !== "turn") return [];
      const source = assistantTextSource(
        entry.blocks.filter((block) => block.kind === "text").map((block) => block.content),
      );
      const text = memoryContextSlice(
        source.text,
        0,
        source.text.length,
        false,
        memoryContextRanges(source.text, false, source.boundaries),
      ).trim();
      return text.trim() ? [{ kind: "turn", text, key: entry.key, id: entry.responseId }] : [];
    });
  const current = prose(projected),
    stored = prose(saved);
  if (
    current.length !== stored.length ||
    current.some(
      (entry, index) => entry.kind !== stored[index]!.kind || entry.text !== stored[index]!.text,
    )
  )
    return {};
  return Object.fromEntries(
    current.flatMap((entry, index) => (stored[index]!.id ? [[entry.key, stored[index]!.id!]] : [])),
  );
}
