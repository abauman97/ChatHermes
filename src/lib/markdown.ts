import MarkdownIt from "markdown-it";

// HTML remains escaped; markdown-it also rejects executable link schemes.
const markdown = new MarkdownIt({ html: false, breaks: true, linkify: true });
markdown.renderer.rules.link_open = (tokens, index, options, _env, renderer) => {
  tokens[index]!.attrSet("target", "_blank");
  tokens[index]!.attrSet("rel", "noopener noreferrer");
  return renderer.renderToken(tokens, index, options);
};
export function renderMarkdown(text: string): string {
  return markdown.render(text);
}
