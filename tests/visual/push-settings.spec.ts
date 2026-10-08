import { expect, test } from "@playwright/test";
import { signIn } from "./login";

const origin = new URL(process.env.CHATHERMES_TEST_URL || "http://127.0.0.1:9119").origin;
test.use({
  trace: "off",
  launchOptions: {
    executablePath: process.env.CHATHERMES_CHROMIUM,
    args: ["--unsafely-treat-insecure-origin-as-secure=" + origin],
  },
});

test("profile notifications have independent status and actions in the mounted dashboard", async ({
  page,
  context,
}, info) => {
  await context.grantPermissions(["notifications"], { origin });
  // Substitute only the browser's external push service. Profile storage, status,
  // subscription and deletion routes run through the authenticated dashboard.
  await page.addInitScript(() => {
    const subscription = {
      endpoint: "https://push.example.test/synthetic-profile-settings",
      toJSON: () => ({
        endpoint: "https://push.example.test/synthetic-profile-settings",
        expirationTime: null,
        keys: { p256dh: "synthetic_key", auth: "synthetic_auth" },
      }),
      unsubscribe: async () => {
        throw new Error("Shared browser subscription must remain registered");
      },
    };
    PushManager.prototype.getSubscription = async () => subscription as unknown as PushSubscription;
    PushManager.prototype.subscribe = async () => subscription as unknown as PushSubscription;
  });
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  await composer.click();
  await expect(composer).toBeFocused();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation" }).click();
  const settings = plugin.getByRole("button", { name: "Settings", exact: true });
  const select = plugin.getByRole("combobox", { name: "Active profile", exact: true });
  const panel = plugin.locator(".push-setting");
  const endpoint = "https://push.example.test/synthetic-profile-settings";
  const status = async (profile: string) => {
    const response = await page.request.post(
      "/api/plugins/chathermes/push/status?profile=" + profile,
      { data: { endpoint } },
    );
    expect(response.ok()).toBe(true);
    return response.json() as Promise<{ enabled: boolean; id: string | null }>;
  };
  // A preserved disposable volume may contain a previous run's synthetic device.
  for (const profile of ["default", "test-profile"]) {
    const saved = await status(profile);
    if (saved.id)
      await page.request.delete(
        "/api/plugins/chathermes/push/subscriptions/" + saved.id + "?profile=" + profile,
      );
  }
  // Reload the real plugin's initial status after cleanup.
  await page.reload();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation" }).click();
  await settings.click();
  await expect(panel).toContainText("Notifications for default");
  await panel.getByRole("button", { name: "Enable notifications", exact: true }).click();
  await expect(panel).toContainText("Notifications enabled for default on this device.");
  await page.screenshot({ path: info.outputPath("push-default-enabled.png") });
  await select.selectOption("test-profile");
  await expect(panel).toContainText("Notifications for test-profile");
  await expect(panel).toContainText("Notifications disabled for test-profile on this device.");
  await panel.getByRole("button", { name: "Enable notifications", exact: true }).click();
  await expect(panel).toContainText("Notifications enabled for test-profile on this device.");
  expect((await status("default")).enabled).toBe(true);
  await panel.getByRole("button", { name: "Disable notifications", exact: true }).click();
  await expect(panel).toContainText("Notifications disabled for test-profile on this device.");
  expect((await status("default")).enabled).toBe(true);
  expect((await status("test-profile")).enabled).toBe(false);
  await page.screenshot({ path: info.outputPath("push-secondary-disabled.png") });
  await select.selectOption("");
  await expect(panel).toContainText("Notifications enabled for default on this device.");
  await panel.getByRole("button", { name: "Disable notifications", exact: true }).click();
  await expect(panel).toContainText("Notifications disabled for default on this device.");
  await plugin.getByRole("button", { name: "Close settings" }).click();
  if (info.project.name === "mobile") await page.keyboard.press("Escape");
  await composer.click();
  await expect(composer).toBeFocused();
});
