import type { Message } from "../../../types/hermes";
import { messageText } from "../../../services/hermes-api";
export function images(messageContent: unknown, profile?: string): string[] {
  const inline = Array.isArray(messageContent)
    ? messageContent.flatMap((part) => {
        const url = part?.image_url?.url;
        return typeof url === "string" && /^(data:image\/|https?:\/\/)/.test(url) ? [url] : [];
      })
    : [];
  if (inline.length) return inline;
  const text = messageText(messageContent);
  return [
    ...text.matchAll(
      /Attached image [^\n]+: [^\n]*\/uploads\/chathermes\/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))/g,
    ),
  ].map(
    (match) =>
      "/api/plugins/chathermes/images/" +
      match[1] +
      (profile ? "?profile=" + encodeURIComponent(profile) : ""),
  );
}
export function displayText(message: Message) {
  const text = messageText(message.content);
  return message.role === "user"
    ? text
        .replace(
          /Attached image ([^\n]+): [^\n]*\/uploads\/chathermes\/[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)/g,
          "📷 $1",
        )
        .replace(
          /Attached file ([^\n]+): [^\n]*\/uploads\/chathermes\/[a-f0-9]{32}(?:\.[a-z0-9]{1,12})?/g,
          "📎 $1",
        )
        .replace(/\[screenshot\]/g, "📷 Attached image")
    : text;
}
