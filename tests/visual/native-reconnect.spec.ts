import { expect, test } from "@playwright/test";
import { signIn } from "./login";

// Exercise real authenticated attach/replay; never retain tickets in traces.
test.use({ trace: "off" });
test("foreground reconstructs once, keeps stale progress readable, and retries without submitting", async ({
  page,
}, info) => {
  let attaches = 0,
    submits = 0;
  page.on("websocket", (socket) => {
    if (!socket.url().includes("/chathermes/chat/ws")) return;
    socket.on("framesent", (frame) => {
      const value = JSON.parse(String(frame.payload));
      if (value.method === "chat.attach") attaches++;
      if (value.method === "chat.submit") submits++;
    });
  });
  await page.addInitScript(() => {
    const controls = { visible: true, fail: false, delay: false };
    (window as any).recoveryControls = controls;
    Object.defineProperty(document, "visibilityState", {
      get: () => (controls.visible ? "visible" : "hidden"),
    });
    const Socket = window.WebSocket;
    class ControlledSocket extends Socket {
      override send(data: Parameters<WebSocket["send"]>[0]) {
        if (typeof data === "string" && JSON.parse(data).method === "chat.attach") {
          if (controls.fail) {
            this.close();
            return;
          }
          if (controls.delay) {
            setTimeout(() => {
              if (this.readyState === Socket.OPEN) super.send(data);
            }, 1200);
            return;
          }
        }
        super.send(data);
      }
    }
    window.WebSocket = ControlledSocket;
  });
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill("Reconnection fixture [hold-run] [long-run]");
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".activity pre").first()).toContainText(
    "Checking the isolated test request",
    { timeout: 30000 },
  );
  await expect.poll(() => submits).toBe(1);
  const before = attaches;
  await page.evaluate(() => {
    (window as any).recoveryControls.visible = false;
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("online"));
  });
  await expect(plugin.getByText("Session is read-only until reconnected.")).toBeVisible();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  await composer.fill("Draft survives recovery");
  await composer.click();
  await expect(composer).toBeFocused();
  await expect(plugin.getByRole("button", { name: "Guide this run", exact: true })).toBeDisabled();
  await page.waitForTimeout(1500);
  expect(attaches).toBe(before);
  await page.screenshot({ path: info.outputPath("native-stale.png") });
  await page.evaluate(() => {
    (window as any).recoveryControls.visible = true;
    (window as any).recoveryControls.delay = true;
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("online"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(plugin.getByText("Reconnecting…", { exact: true })).toBeVisible();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  await page.screenshot({ path: info.outputPath("native-reconnecting.png") });
  await expect.poll(() => attaches).toBe(before + 1);
  await expect(plugin.getByText("Reconnecting…", { exact: true })).toHaveCount(0);
  await expect(composer).toHaveValue("Draft survives recovery");
  await expect(plugin.getByRole("button", { name: "Guide this run", exact: true })).toBeEnabled();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  await page.screenshot({ path: info.outputPath("native-restored.png") });
  await page.evaluate(() => {
    (window as any).recoveryControls.visible = false;
    document.dispatchEvent(new Event("visibilitychange"));
    (window as any).recoveryControls.fail = true;
    (window as any).recoveryControls.visible = true;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(plugin.getByRole("button", { name: "Reconnect", exact: true })).toBeVisible();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  await page.evaluate(() => {
    (window as any).recoveryControls.fail = false;
  });
  await plugin.getByRole("button", { name: "Reconnect", exact: true }).click();
  await expect(plugin.getByText("Reconnecting…", { exact: true })).toHaveCount(0);
  await expect(plugin.getByRole("button", { name: "Guide this run", exact: true })).toBeEnabled();
  expect(submits).toBe(1);
  await composer.fill("");
  await plugin.getByRole("button", { name: "Stop response", exact: true }).click();
  await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeVisible({
    timeout: 30000,
  });
  await expect(plugin.locator(".activity[open]")).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("native-recovery-stopped.png") });
});
