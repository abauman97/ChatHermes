import { expect, test } from "@playwright/test";
import { signIn } from "./login";

test("context RPC results reach the composer panel in the dashboard plugin", async ({
  page,
}, info) => {
  await signIn(page);
  const created = await page.request.post("/api/plugins/chathermes/api/sessions?profile=default", {
    data: {},
  });
  expect(created.ok()).toBeTruthy();
  const body = await created.json();
  const sessionId = (body.session || body).id;
  let breakdownRequests = 0;
  // Keep authentication, attach, recovery and the dashboard real. Replay the
  // captured successful RPC payloads without depending on provider token counts.
  await page.routeWebSocket(/\/api\/ws(?:\?|$)/, (socket) => {
    const server = socket.connectToServer();
    socket.onMessage((message) => {
      const frame = JSON.parse(String(message));
      if (frame.method === "session.usage" || frame.method === "session.context_breakdown") {
        const usage = {
          model: "qwen3.8:27b",
          context_used: 14584,
          context_max: 131072,
          context_percent: 11,
          calls: 1,
        };
        const result =
          frame.method === "session.usage"
            ? usage
            : {
                model: usage.model,
                categories: [
                  { id: "system_prompt", label: "System prompt", tokens: 1200 },
                  { id: "tool_definitions", label: "Tool definitions", tokens: 4000 },
                  { id: "rules", label: "Rules", tokens: 300 },
                  { id: "skills", label: "Skills", tokens: 500 },
                  { id: "mcp", label: "MCP", tokens: 800 },
                  { id: "subagent_definitions", label: "Subagent definitions", tokens: 200 },
                  { id: "memory", label: "Memory", tokens: 100 },
                  { id: "conversation", label: "Conversation", tokens: 0 },
                ],
              };
        if (frame.method === "session.context_breakdown") breakdownRequests++;
        socket.send(JSON.stringify({ jsonrpc: "2.0", id: frame.id, result }));
      } else server.send(message);
    });
  });
  await page.goto(`/chathermes?profile=default#/chat/${encodeURIComponent(sessionId)}`);
  await page.reload();
  const plugin = page.locator(".chathermes-embedded");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  const meter = plugin.getByRole("button", { name: "Context 11 percent used", exact: true });
  await expect(meter).toBeVisible();
  await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
  await area.fill("Keep this context panel draft");
  if (info.project.name === "mobile") await expect(meter).toBeHidden();
  else await expect(meter).toBeVisible();
  if (info.project.name === "mobile")
    await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeHidden();
  else
    await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeVisible();
  if (info.project.name === "mobile")
    await expect(
      plugin.getByRole("button", { name: "Attachment options", exact: true }),
    ).toBeHidden();
  else
    await expect(
      plugin.getByRole("button", { name: "Attachment options", exact: true }),
    ).toBeVisible();
  await page.screenshot({ path: info.outputPath("context-focused.png") });
  await area.blur();
  await expect(meter).toBeVisible();
  await meter.click();
  const panel = plugin.getByRole("dialog", { name: "Context usage", exact: true });
  await expect(panel).toContainText("qwen3.8:27b");
  await expect(panel).toContainText("14,584 / 131,072 tokens · 11%");
  await expect(panel).toContainText("System prompt");
  await expect(panel).toContainText("1,200 tokens");
  await expect(panel.locator("dt")).toHaveText([
    "System prompt",
    "Tool definitions",
    "Rules",
    "Skills",
    "MCP",
    "Subagent definitions",
    "Memory",
    "Conversation",
  ]);
  await expect(panel.locator(".context-breakdown-bar > span")).toHaveCount(8);
  await expect.poll(() => breakdownRequests).toBeGreaterThan(0);
  await expect(area).toHaveValue("Keep this context panel draft");
  const box = (await panel.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({ path: info.outputPath("context-usage.png") });
  await area.focus();
  await expect(area).toBeFocused();
  await expect(panel).toBeHidden();
  if (info.project.name === "mobile") await expect(meter).toBeHidden();
  else await expect(meter).toBeVisible();
  await area.blur();
  await meter.click();
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "Close context usage" }).click();
  await expect(panel).toBeHidden();
});
