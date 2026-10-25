import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { dockerExec, serviceContainer } from "../docker/compose.mjs";
import { tapAndroid } from "../docker/android-controls.mjs";
import { sessionFromUrl } from "../visual/login";

// This exercises the real external push transport and Android notification tray.
// It is optional because FCM connectivity is a device capability, not service
// readiness or a prerequisite for ordinary deterministic browser workflows.
test("@native Android receives background completion and its notification reopens the exact chat", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "android", "Requires Android's actual notification tray");
  test.setTimeout(150000);
  const container = serviceContainer("android");
  const adb = (...args: string[]) => dockerExec(container, "adb", ...args);
  adb("shell", "pm", "grant", "com.android.chrome", "android.permission.POST_NOTIFICATIONS");
  const origin = new URL(page.url()).origin;
  await page.context().grantPermissions(["notifications"], { origin });
  await page.goto(`${origin}/chathermes?profile=default#/settings?profile=default`);
  const enable = page.getByRole("button", { name: "Enable notifications", exact: true });
  const disable = page.getByRole("button", { name: "Disable notifications", exact: true });
  await expect(enable.or(disable)).toBeVisible();
  if (await enable.isVisible()) await enable.click();
  await expect(disable).toBeEnabled({ timeout: 60000 });
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    for (const notification of await registration.getNotifications()) notification.close();
  });
  await page.goto(`${origin}/chathermes?profile=default`);
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-background] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page
      .locator(".activity")
      .filter({ hasText: /terminal/i })
      .first(),
  ).toBeVisible();
  const session = sessionFromUrl(page.url())!;
  adb(
    "shell",
    "am",
    "start",
    "-W",
    "-a",
    "android.intent.action.MAIN",
    "-c",
    "android.intent.category.HOME",
  );
  await expect.poll(() => page.evaluate(() => document.visibilityState)).toBe("hidden");
  await expect
    .poll(
      () =>
        page.evaluate(async (session) => {
          const registration = await navigator.serviceWorker.ready;
          return (await registration.getNotifications()).some((notification) => {
            const url = notification.data?.url;
            return (
              typeof url === "string" &&
              decodeURIComponent(url).includes(`/chat/${session}?profile=default`)
            );
          });
        }, session),
      { timeout: 60000 },
    )
    .toBe(true);
  adb("shell", "cmd", "statusbar", "expand-notifications");
  await tapAndroid(adb, /^default$/i, 15000);
  // A native click may select another existing Chrome window. Observe all real
  // targets; never substitute a synthetic notificationclick event for this tap.
  let reopened = page;
  await expect
    .poll(async () => {
      for (const candidate of page.context().pages()) {
        if (
          sessionFromUrl(candidate.url()) === session &&
          new URL(candidate.url()).searchParams.get("profile") === "default" &&
          (await candidate.evaluate(() => document.visibilityState).catch(() => "closed")) ===
            "visible"
        ) {
          reopened = candidate;
          return true;
        }
      }
      return false;
    })
    .toBe(true);
  expect(sessionFromUrl(reopened.url())).toBe(session);
  await expect(reopened.locator(".message.assistant")).toContainText(
    "Background execution finished.",
  );
  await reopened.screenshot({ path: info.outputPath("notification-reopened.png") });
});
