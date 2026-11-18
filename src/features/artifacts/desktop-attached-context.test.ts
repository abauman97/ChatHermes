import { existsSync, readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it } from "vite-plus/test";
import fixture from "../../../tests/fixtures/attached-context.json";
import { attachedContextProjection } from "./attached-context";

const sourcePath = ".hermes-source/apps/desktop/src/lib/chat-messages/hydration.ts";
// Execute the actual pinned helper. Adapters only cover unrelated imports:
// these cases are strings, without skill invocations or Discord routing notes.
describe.skipIf(!existsSync(sourcePath))("pinned Desktop attachment presentation parity", () => {
  const source = existsSync(sourcePath) ? readFileSync(sourcePath, "utf8") : "";
  const compiled = ts.transpileModule(source + "\nexport { displayContentForMessage };", {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const desktop: any = {};
  runInNewContext(compiled, {
    exports: desktop,
    require: () => ({ skillInvocationText: () => null, textFromUnknown: (text: string) => text }),
  });
  const refs = [
    "@file:report.pdf",
    '@file:"report with spaces.pdf"',
    "@file:'report with spaces.pdf'",
    "@file:`report with spaces.pdf`",
    "@folder:/tmp/folder",
    '@url:"https://example.invalid/a b"',
    "@image:/tmp/a.png",
    "@tool:search",
    "@terminal:1",
    "@line:2 @session:other",
    "@FILE:upper",
    "@file:report.pdf,",
    '@file:unterminated"',
    "@file:",
  ];
  const bodies = [
    fixture.binary,
    "Unknown body",
    "",
    ...refs,
    refs.join("\n"),
    "@file:report.pdf @file:report.pdf @file:'report.pdf'",
    "@file:report.pdf\n--- Context Warnings ---\n@tool:after-warning",
  ];
  const prefixes = [
    "",
    "  Ask  ",
    "Ask @file:report.pdf inline",
    "@file:report.pdf\nAsk",
    "Ask\n\n--- Context Warnings ---\n- warning\n\nexception continuation",
  ];
  const markers = [
    "\n--- Attached Context ---\n",
    "\n--- Attached Context --- \t\n\n",
    "\r\n--- Attached Context ---\r\n",
    "\n--- Attached Context ---",
    " inline --- Attached Context ---\n",
    "\n> --- Attached Context ---\n",
    "\n    --- Attached Context ---\n",
  ];
  it("matches diverse marker, warning and reference forms exactly", () => {
    for (const prefix of prefixes)
      for (const marker of markers)
        for (const body of bodies) {
          const text = prefix + marker + body;
          expect(attachedContextProjection(text).text, JSON.stringify(text)).toBe(
            desktop.displayContentForMessage("user", text),
          );
          expect(desktop.displayContentForMessage("assistant", text)).toBe(text);
          expect(desktop.displayContentForMessage("tool", text)).toBe(text);
        }
  });
  it.each([
    "--- Attached Context ---\n@file:a",
    "--- Context Warnings ---anything",
    "  Ask \n--- Context Warnings ---\r\n- arbitrary\n\ncontinuation @file:a",
    "Ask\n```text\n--- Attached Context ---\n@file:example.pdf\n```",
    "Ask\n--- Attached Context ---\n@file:first\n--- Attached Context ---\n@image:second",
    "Ask\r--- Attached Context ---\r@file:a",
    "Ask\n--- context warnings ---\nkept",
    "`\nMEDIA:/tmp/private.pdf\n--- Attached Context ---\nend`",
    "`\nMEDIA:/tmp/private.pdf\n--- Context Warnings ---\nend`",
    "`\nAttached file private.pdf: /tmp/private.pdf\n--- Attached Context ---\nend`",
    "`\nAttached file private.pdf: /tmp/private.pdf\n--- Context Warnings ---\nend`",
  ])("matches start markers, warnings alone, fenced and repeated markers: %s", (text) => {
    expect(attachedContextProjection(text).text).toBe(
      desktop.displayContentForMessage("user", text),
    );
  });
});
