import { expect, test } from "@playwright/test";
import { signIn, sessionFromUrl } from "./login";

const origin = new URL(process.env.CHATHERMES_TEST_URL || "http://127.0.0.1:9119").origin;
test.use({
  // The isolated HTTP dashboard needs a secure context for its real worker.
  launchOptions: {
    executablePath: process.env.CHATHERMES_CHROMIUM,
    args: ["--unsafely-treat-insecure-origin-as-secure=" + origin],
  },
  trace: "off",
});
test("a dispatched worker click navigates even without focus permission", async ({
  page,
  context,
}, info) => {
  await context.grantPermissions(["notifications"], { origin });
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const create = async () => {
    if (info.project.name === "mobile")
      await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
    await plugin.locator(".drawer-chat").click();
    await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
    await expect(plugin.locator(".drawer-chat")).toBeEnabled();
    return page.url();
  };
  const target = await create();
  await create();
  await expect.poll(() => sessionFromUrl(page.url())).not.toBe(sessionFromUrl(target));
  await page.evaluate(async () => {
    await navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
      scope: "/chathermes",
      updateViaCache: "none",
    });
    await navigator.serviceWorker.ready;
  });
  const worker = context.serviceWorkers()[0] || (await context.waitForEvent("serviceworker"));
  const click = (url: string) =>
    worker.evaluate(async (url) => {
      const scope = self as unknown as {
        registration: ServiceWorkerRegistration;
        NotificationEvent: new (type: string, init: { notification: Notification }) => Event;
      };
      await scope.registration.showNotification("Synthetic click probe", {
        tag: "chathermes:click-regression",
        data: { url },
      });
      const [notification] = await scope.registration.getNotifications({
        tag: "chathermes:click-regression",
      });
      const event = new scope.NotificationEvent("notificationclick", {
        notification: notification!,
      });
      // Synthetic dispatch has no OS notification activation or extendable
      // event lifetime. Capture waitUntil, leaving focus/navigate unmodified.
      let pending: Promise<unknown> | undefined;
      Object.defineProperty(event, "waitUntil", {
        value: (promise: Promise<unknown>) => {
          pending = promise;
        },
      });
      self.dispatchEvent(event);
      await pending;
    }, url);
  const windows = context.pages().length;
  await click(target);
  await expect(page).toHaveURL(target);
  await expect(
    plugin.locator(".notice").filter({ hasText: /read-only until reconnected|Reconnecting/ }),
  ).toHaveCount(0);
  await expect(plugin.getByText("Loading conversation...", { exact: true })).toHaveCount(0);
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await area.click();
  await expect(area).toBeFocused();
  await page.screenshot({ path: info.outputPath("notification-click-chat.png") });
  const scheduled = new URL(target);
  scheduled.hash = "/scheduled/audit/output%3A2026-01-01_00-00-00?profile=default";
  await click(scheduled.href);
  await expect(page).toHaveURL(scheduled.href);
  await expect(plugin.locator(".scheduled-page")).toBeVisible();
  await area.click();
  await expect(area).toBeFocused();
  // Retain the destination through asynchronous host/profile hydration.
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(scheduled.href);
  expect(context.pages()).toHaveLength(windows);
  await page.screenshot({ path: info.outputPath("notification-click-scheduled.png") });
  await worker.evaluate(async () => {
    const scope = self as unknown as { registration: ServiceWorkerRegistration };
    for (const notification of await scope.registration.getNotifications()) notification.close();
  });
});
