import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { sessionFromUrl } from "../visual/login";

// Read the real native runtime through the dashboard's authenticated contract.
// Return only effort values, never tickets, full frames or provider metadata.
async function runtimeEffort(
  page: import("@playwright/test").Page,
  stored: string,
  profile = "default",
) {
  return page.evaluate(
    async ({ stored, profile }) => {
      const response = await fetch("/api/auth/ws-ticket", { method: "POST" });
      const { ticket } = await response.json();
      return new Promise<string>((resolve, reject) => {
        const url = new URL("/api/ws", location.href);
        url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
        const socket = new WebSocket(url, ["hermes-gateway-v1", `hermes-gateway-ticket.${ticket}`]);
        const timer = setTimeout(() => {
          socket.close();
          reject(new Error("Native effort read timed out"));
        }, 15000);
        socket.onopen = () =>
          socket.send(
            JSON.stringify({
              jsonrpc: "2.0",
              id: "effort-read",
              method: "session.resume",
              params: { profile, session_id: stored, source: "desktop" },
            }),
          );
        socket.onmessage = (event) => {
          for (const line of String(event.data).split("\n").filter(Boolean)) {
            const frame = JSON.parse(line);
            if (frame.id !== "effort-read") continue;
            clearTimeout(timer);
            socket.close();
            if (frame.error) reject(new Error("Native effort read failed"));
            else resolve(frame.result.info.reasoning_effort);
          }
        };
        socket.onerror = () => {
          clearTimeout(timer);
          socket.close();
          reject(new Error("Native connection failed"));
        };
      });
    },
    { stored, profile },
  );
}

test("authenticated model inventory gates reasoning by provider and model", async ({ page }) => {
  await page.route("**/api/plugins/chathermes/api/model/options**", async (route) => {
    const response = await route.fetch();
    const inventory = await response.json();
    await route.fulfill({
      json: {
        ...inventory,
        providers: [
          {
            slug: "workflow-capabilities",
            name: "Workflow capabilities",
            models: ["reasoning-disabled", "reasoning-enabled", "reasoning-unknown"],
            capabilities: {
              "reasoning-disabled": { reasoning: false },
              "reasoning-enabled": { reasoning: true },
            },
          },
        ],
      },
    });
  });
  await page.reload();

  const picker = page.getByRole("button", {
    name: "Choose model",
    exact: true,
  });
  const effort = page.getByRole("combobox", {
    name: "Reasoning effort",
    exact: true,
  });
  await expect(picker).toBeEnabled();
  await picker.click();
  await expect(effort).toBeVisible();
  await page.getByRole("button", { name: /Workflow capabilities/ }).click();
  await page.getByRole("button", { name: "reasoning-disabled", exact: true }).click();
  await expect(effort).toHaveCount(0);
  await page.getByRole("button", { name: "Choose model", exact: true }).click();
  await page.getByRole("button", { name: /Workflow capabilities/ }).click();
  await page.getByRole("button", { name: "reasoning-enabled", exact: true }).click();
  await page.getByRole("button", { name: "Choose model", exact: true }).click();
  await expect(effort).toBeVisible();
  await page.getByRole("button", { name: /Workflow capabilities/ }).click();
  await page.getByRole("button", { name: "reasoning-unknown", exact: true }).click();
  await page.getByRole("button", { name: "Choose model", exact: true }).click();
  await expect(effort).toBeVisible();
});

test("composer reasoning reaches the native runtime and stays in its chat", async ({
  page,
}, info) => {
  const picker = page.getByRole("button", {
    name: "Choose model",
    exact: true,
  });
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await expect(picker).toBeEnabled();
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await composer.blur();
  await picker.click();
  const effort = page.getByRole("combobox", {
    name: "Reasoning effort",
    exact: true,
  });
  await expect(effort).toHaveValue("");
  await expect(effort).toHaveCSS("font-size", "16px");
  await effort.selectOption("high");
  await page.screenshot({ path: info.outputPath("reasoning-picker.png") });
  await effort.press("Escape");
  await expect(picker).toBeFocused();
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  const stored = sessionFromUrl(page.url())!;
  expect(await runtimeEffort(page, stored)).toBe("high");
  await picker.click();
  await expect(effort).toHaveValue("high");
  await effort.selectOption("none");
  await effort.press("Escape");
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toHaveCount(2);
  await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
  expect(await runtimeEffort(page, stored)).toBe("none");
  // A new mount has no in-memory picker choices: resume must restore the
  // session's runtime effort rather than the profile's medium default.
  await page.reload();
  await expect(picker).toBeEnabled();
  await expect(page.locator(".message.assistant")).toHaveCount(2);
  await picker.click();
  await expect(effort).toHaveValue("none");
  await page.screenshot({ path: info.outputPath("resumed-reasoning-picker.png") });
  await effort.press("Escape");
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toHaveCount(3);
  await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
  expect(await runtimeEffort(page, stored)).toBe("none");
  const plugin = page.locator(".chathermes-embedded");
  const navigation = plugin.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  if (await navigation.isVisible()) await navigation.click();
  await plugin.getByRole("button", { name: "New chat", exact: true }).click();
  await expect(page.locator(".message.user")).toHaveCount(0);
  await expect(picker).toBeEnabled();
  await picker.click();
  await expect(effort).toHaveValue("");
  await effort.press("Escape");
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  expect(await runtimeEffort(page, sessionFromUrl(page.url())!)).not.toBe("none");
  expect(await runtimeEffort(page, stored)).toBe("none");
  // Change profile through the real native select without remounting the page.
  if (await navigation.isVisible()) await navigation.click();
  await plugin.getByRole("combobox", { name: "Profile", exact: true }).selectOption("beta");
  const closeNavigation = plugin.getByRole("button", {
    name: "Close navigation",
    exact: true,
  });
  if (await closeNavigation.isVisible()) await closeNavigation.click();
  await expect(page.locator(".message.user")).toHaveCount(0);
  await expect(picker).toBeEnabled();
  await picker.click();
  await expect(effort).toHaveValue("");
  await effort.selectOption("low");
  await effort.press("Escape");
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  expect(await runtimeEffort(page, sessionFromUrl(page.url())!, "beta")).toBe("low");
  expect(await runtimeEffort(page, stored)).toBe("none");
  await composer.fill("Draft remains editable");
  await expect(composer).toBeFocused();
});
