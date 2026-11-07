import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import type { Locator, Page, TestInfo } from "@playwright/test";
import { test, expect } from "./fixtures";
import { mockserverURL } from "../docker/compose.mjs";
import { runtime } from "./helpers";

const token = "very_long_unbroken_path_or_identifier_".repeat(16);
const command = `target=$(mktemp -d /tmp/chathermes-approval-XXXXXX); chmod 777 "$target"; printf workflow-approved # /tmp/${token}`;
const question = `Choose a direction for https://example.test/${token}`;
const choice = `Proceed with ${token}`;

// Load inference through stock MockServer; Hermes still creates the prompts,
// owns their lifetimes and receives the answers through the real gateway.
async function installPrompt(kind: "approval" | "clarify" | "secret", marker: string) {
  const fixtures = JSON.parse(
    await readFile(new URL("../docker/fixtures/inference.json", import.meta.url), "utf8"),
  );
  const fixture = fixtures.find(
    (entry: { id: string }) => entry.id === `chathermes-${kind === "secret" ? "clarify" : kind}`,
  );
  if (kind === "secret") {
    // Raw Python escapes become actual frontmatter newlines when Python writes the file.
    expect(
      runtime(
        String.raw`import json,sys; from hermes_constants import get_hermes_home; from agent.skill_utils import parse_frontmatter; root=get_hermes_home()/'skills'/sys.argv[1]; root.mkdir(parents=True); metadata={'name':sys.argv[1],'description':'Synthetic prompt layout fixture','required_environment_variables':[{'name':sys.argv[2],'prompt':sys.argv[3]}]}; (root/'SKILL.md').write_text('---\n'+json.dumps(metadata)+'\n---\nSynthetic layout check.'); print(json.dumps(parse_frontmatter((root/'SKILL.md').read_text())[0] == metadata))`,
        marker,
        `LAYOUT_${token.toUpperCase()}`,
        question,
      ),
    ).toBe(true);
  }
  fixture.id = marker;
  fixture.priority = 40;
  fixture.httpRequest.body.jsonPath = `$[?(@.messages[-1].role == 'user' && @.messages[-1].content =~ /(?s).*${marker}.*/)]`;
  fixture.httpResponse.body = fixture.httpResponse.body
    .split("\n\n")
    .map((line: string) => {
      if (!line.startsWith("data: {")) return line;
      const frame = JSON.parse(line.slice(6));
      const call = frame.choices[0]?.delta?.tool_calls?.[0];
      if (call) {
        if (kind === "secret") call.function.name = "skill_view";
        call.function.arguments = JSON.stringify(
          kind === "approval"
            ? { command }
            : kind === "secret"
              ? { name: marker }
              : { questions: [{ question, choices: [choice, "Try another direction"] }] },
        );
      }
      return `data: ${JSON.stringify(frame)}`;
    })
    .join("\n\n");
  const response = await fetch(`${mockserverURL()}/mockserver/expectation`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fixture),
  });
  expect(response.ok).toBe(true);
}

async function expectBounded(prompt: Locator) {
  const bounds = await prompt.evaluate((element) => {
    const transcript = element.closest(".transcript")!;
    const container = transcript.getBoundingClientRect();
    const elements = [
      element,
      ...element.querySelectorAll("p, form, fieldset, legend, button, input"),
    ];
    return {
      document: document.documentElement.scrollWidth <= innerWidth,
      transcript: transcript.scrollWidth <= transcript.clientWidth,
      overflowing: elements.flatMap((item) => {
        const rect = item.getBoundingClientRect();
        const bounded =
          rect.left >= container.left - 1 &&
          rect.right <= container.right + 1 &&
          // Text inputs scroll their value internally by design.
          (item instanceof HTMLInputElement || item.scrollWidth <= item.clientWidth + 1);
        return bounded
          ? []
          : [
              {
                tag: item.tagName,
                left: rect.left,
                right: rect.right,
                clientWidth: item.clientWidth,
                scrollWidth: item.scrollWidth,
              },
            ];
      }),
    };
  });
  expect(bounds.document).toBe(true);
  expect(bounds.transcript).toBe(true);
  expect(bounds.overflowing).toEqual([]);
}

async function expectComposerSeparated(page: Page, info: TestInfo, state: string) {
  const geometry = await page.locator(".composer-controls").evaluate((controls) => {
    const hint = controls.closest(".composer")!.querySelector(".composer-hint")!;
    const range = document.createRange();
    range.selectNodeContents(hint);
    const text = [...range.getClientRects()].map((rect) => rect.toJSON());
    const neighbors = [...controls.children]
      .filter((element) => element !== hint)
      .map((element) => ({
        label: element.getAttribute("aria-label") || element.className,
        rect: element.getBoundingClientRect().toJSON(),
      }))
      .filter(({ rect }) => rect.width && rect.height);
    return { text, neighbors };
  });
  const path = info.outputPath(state + "-composer-geometry.json");
  await writeFile(path, JSON.stringify(geometry, null, 2));
  await info.attach(state + "-composer-geometry", { path, contentType: "application/json" });
  await page.screenshot({ path: info.outputPath(state + "-composer.png") });
  const overlaps = geometry.neighbors.filter(({ rect }) =>
    geometry.text.some(
      (text) =>
        text.left < rect.right &&
        text.right > rect.left &&
        text.top < rect.bottom &&
        text.bottom > rect.top,
    ),
  );
  expect(overlaps).toEqual([]);
  // The status must not push Stop/Send onto a separate toolbar row.
  if (state !== "editing") {
    const rows = geometry.neighbors.map(({ rect }) => rect.top);
    expect(Math.max(...rows) - Math.min(...rows)).toBeLessThanOrEqual(1);
  }
}

for (const kind of ["approval", "clarify", "secret"] as const) {
  test(`${kind} long content stays within the mounted conversation`, async ({ page }, info) => {
    const mobile = info.project.name === "mobile";
    await page.setViewportSize(mobile ? { width: 320, height: 740 } : { width: 1280, height: 900 });
    const marker = `prompt-layout-${kind}-${randomUUID()}`;
    await installPrompt(kind, marker);
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill(marker);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    const prompt = page.locator(".live-request");
    await expect(prompt).toContainText(kind === "approval" ? command : question);
    if (kind === "clarify")
      await expect(prompt.getByRole("button", { name: choice })).toBeVisible();
    await expectBounded(prompt);
    await expectComposerSeparated(page, info, "pending");
    await composer.fill("Draft while a prompt is pending");
    await expect(composer).toBeFocused();
    await expectBounded(prompt);
    await expectComposerSeparated(page, info, "editing");
    await composer.blur();
    await expectComposerSeparated(page, info, "blurred");
    await prompt.getByRole("button").last().scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`${kind}-long-content.png`) });
    // Reload exercises the saved native pending request, not just its live event.
    await page.reload();
    await expect(prompt).toContainText(kind === "approval" ? command : question);
    await expectBounded(prompt);
    await expectComposerSeparated(page, info, "restored");
    if (kind === "secret") {
      const input = prompt.locator('input[type="password"]');
      await expect(
        prompt.getByText(`LAYOUT_${token.toUpperCase()}`, { exact: true }),
      ).toBeVisible();
      await input.fill("synthetic-layout-value");
      await expect(input).toBeFocused();
      await expect(input).toHaveCSS("font-size", "16px");
      await expectBounded(prompt);
      await input.blur();
      await page.screenshot({ path: info.outputPath("secret-password-input.png") });
      await page.getByRole("button", { name: "Stop response", exact: true }).click();
      await expect(prompt).toHaveCount(0);
      return;
    }
    if (kind === "clarify") {
      const other = prompt.getByRole("textbox");
      await other.fill(`Proceed with workflow ${token}`);
      await expect(other).toBeFocused();
      expect(
        await other.evaluate((input) => parseFloat(getComputedStyle(input).fontSize)),
      ).toBeGreaterThanOrEqual(16);
      await expectBounded(prompt);
      await other.blur();
      await page.screenshot({ path: info.outputPath("clarify-custom-response.png") });
      await prompt.getByRole("button", { name: "Send", exact: true }).click();
    } else {
      await prompt.getByRole("button", { name: "Deny", exact: true }).click();
    }
    await expect(prompt).toHaveCount(0);
    await expect(page.locator(".message.assistant").last()).toContainText(
      kind === "approval" ? "Approval denied; command did not run." : "Clarification accepted.",
    );
    await composer.fill("Still focusable after answering");
    await expect(composer).toBeFocused();
  });
}
