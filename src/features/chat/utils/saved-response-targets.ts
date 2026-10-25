import type { Message } from "../../../types/hermes";
import { messageText } from "../../../services/hermes-api";
import { uploadedArtifacts } from "../../artifacts/artifacts";
import { transcriptEntries } from "./transcript-entries";

// Native file.attach appends @file references to the authenticated upload path.
// Compare the same prose and file identities that UserMessage renders.
function userProjection(message: Message): string {
  let text = messageText(message.content);
  const files = uploadedArtifacts(text).files;
  if (files.length) {
    // Hermes resolves @file directives into a model-facing context footer.
    // Require an attachment directive immediately before that footer, and keep
    // the original prompt plus the authenticated upload identities for matching.
    text = text.replace(/\n@file:[^\n]+\n\n--- Attached Context ---\n[\s\S]*$/, "");
  }
  const upload = uploadedArtifacts(text);
  return JSON.stringify([upload.text, upload.files.map((file) => file.path).sort()]);
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
      const text = entry.blocks
        .filter((block) => block.kind === "text")
        .map((block) => block.content)
        .join("\n\n");
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
