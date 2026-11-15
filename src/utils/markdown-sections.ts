import { renderMarkdown } from "./markdown";

// Parse the whole response together so emphasis, reference definitions and other
// Markdown context survive cards inserted in the middle of a paragraph. Only
// parser-approved, displayable deliveries supply boundaries; paths are never HTML.
export function renderMarkdownSections(
  text: string,
  boundaries: { offset: number; block: boolean }[],
): string[] {
  const original = renderMarkdown(text);
  if (!boundaries.length) return [original];
  let prefix = "CHATHERMESARTIFACTBOUNDARY";
  // Also check rendered text: entities must not be able to forge a boundary.
  while (text.includes(prefix) || original.includes(prefix)) prefix += "X";
  const template = document.createElement("template");
  template.innerHTML = renderMarkdown(text, prefix, boundaries);
  const sections: DocumentFragment[] = [document.createDocumentFragment()];
  const ancestors: Element[] = [];
  let containers: Node[] = [sections[0]!];
  const marker = new RegExp(`${prefix}\\d+END`, "g");
  function next() {
    const section = document.createDocumentFragment();
    sections.push(section);
    containers = [section];
    // Reopen formatting ancestors in the following fragment. Each result is
    // balanced HTML, even for **before [file](MEDIA:...) after**.
    for (const ancestor of ancestors) {
      const clone = ancestor.cloneNode(false);
      containers.at(-1)!.appendChild(clone);
      containers.push(clone);
    }
  }
  function visit(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.textContent || "";
      let start = 0;
      for (const match of value.matchAll(marker)) {
        containers.at(-1)!.appendChild(document.createTextNode(value.slice(start, match.index)));
        next();
        start = match.index + match[0].length;
      }
      containers.at(-1)!.appendChild(document.createTextNode(value.slice(start)));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const clone = element.cloneNode(false);
      containers.at(-1)!.appendChild(clone);
      ancestors.push(element);
      containers.push(clone);
      node.childNodes.forEach(visit);
      ancestors.pop();
      containers.pop();
    }
  }
  template.content.childNodes.forEach(visit);
  const emptyWrappers = "p,strong,em,s,a";
  function hasContent(node: ParentNode & Node) {
    // Only these reopened formatting/paragraph wrappers are disposable. Code
    // (including whitespace), rules, images and empty structural blocks carry
    // Markdown meaning independently of their textContent.
    return Boolean(node.textContent?.trim() || node.querySelector(`:not(${emptyWrappers})`));
  }
  return sections.map((section) => {
    // Discard empty wrappers left by boundary-only paragraphs or formatting.
    for (const element of section.querySelectorAll(emptyWrappers))
      if (!hasContent(element)) element.remove();
    // A block boundary has its own otherwise empty paragraph.
    if (!hasContent(section)) return "";
    const container = document.createElement("div");
    container.appendChild(section);
    return container.innerHTML;
  });
}
