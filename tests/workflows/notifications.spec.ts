import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { test, expect } from "./fixtures";
import { dockerExec, serviceContainer } from "../docker/compose.mjs";
import { tapAndroid } from "../docker/android-controls.mjs";
import { sessionFromUrl } from "../visual/login";
import { runtime } from "./helpers";

function captureDevice(outputPath: (name: string) => string, container: string, name: string) {
  writeFileSync(
    outputPath(name),
    execFileSync("docker", ["exec", container, "adb", "exec-out", "screencap", "-p"]),
  );
}

// Local display bypasses push transport, but the trusted click is delivered
// through Android's actual tray. No PushEvent or NotificationEvent is fabricated.
for (const [destination, content] of [
  ["settings", "chat"],
  ["host", "chat"],
  ["settings", "scheduled"],
  ["host", "scheduled"],
]) {
  test(`@native Android tray click from open ${destination} loads the exact ${content}`, async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "android", "Requires Android's actual notification tray");
    test.setTimeout(150000);
    const container = serviceContainer("android");
    const adb = (...args: string[]) => dockerExec(container, "adb", ...args);
    adb("shell", "pm", "grant", "com.android.chrome", "android.permission.POST_NOTIFICATIONS");
    const context = page.context();
    const origin = new URL(page.url()).origin;
    await context.grantPermissions(["notifications"], { origin });
    await page.evaluate(async () => {
      await navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
        scope: "/chathermes",
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
    });
    await page.reload();
    const prompt = `[workflow-stream] Android tray destination ${randomUUID()}`;
    let target: string;
    const savedOutput = `Exact saved Android tray output ${randomUUID()}`;
    if (content === "scheduled") {
      const saved = runtime(
        "import json,sys; from cron.jobs import create_job,save_job_output; j=create_job(prompt='Local tray routing',schedule='0 0 1 1 *',name=sys.argv[1],paused=True); p=save_job_output(j['id'],sys.argv[2]); print(json.dumps({'job':j['id'],'run':'output:'+p.stem}))",
        `Issue 213 tray ${randomUUID()}`,
        savedOutput,
      );
      target = `${origin}/chathermes?profile=default#/scheduled/${encodeURIComponent(saved.job)}/${encodeURIComponent(saved.run)}?profile=default`;
    } else {
      await page.getByRole("textbox", { name: "Message Hermes" }).fill(prompt);
      await page.getByRole("button", { name: "Send message", exact: true }).click();
      await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
      target = page.url();
    }
    const windows = context.pages().length;

    await page.goto(`${origin}/chathermes?profile=default#/settings?profile=default`);
    await expect(page.locator(".settings-page")).toBeVisible();
    const title = `Issue 213 ${destination} ${randomUUID()}`;
    await page.evaluate(
      async ({ title, target }) => {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body: "Local Android tray navigation verification; no push transport.",
          tag: "chathermes:issue213:tray",
          data: { url: target },
        });
      },
      { title, target },
    );
    try {
      await tapAndroid(adb, /^No thanks$/i, 3000, "com.android.chrome");
    } catch {
      /* Chrome's native notification introduction is optional. */
    }
    if (destination === "host") await page.goto(`${origin}/sessions`);
    await page.evaluate(() => {
      document.documentElement.dataset.notificationDocument = "original";
    });
    await expect.poll(() => page.evaluate(() => document.visibilityState)).toBe("visible");
    captureDevice((name) => info.outputPath(name), container, `${destination}-before-tray.png`);
    adb("shell", "cmd", "statusbar", "expand-notifications");
    await expect
      .poll(() => {
        adb("shell", "rm", "-f", "/data/local/tmp/chathermes-ui.xml");
        adb("shell", "uiautomator", "dump", "/data/local/tmp/chathermes-ui.xml");
        return adb("shell", "cat", "/data/local/tmp/chathermes-ui.xml").includes(title);
      })
      .toBe(true);
    captureDevice((name) => info.outputPath(name), container, `${destination}-tray.png`);
    await tapAndroid(adb, new RegExp(`^${title}$`), 15000);
    let reopened = page;
    await expect
      .poll(async () => {
        for (const candidate of context.pages()) {
          const visibility = await candidate
            .evaluate(() => document.visibilityState)
            .catch(() => "closed");
          if (candidate.url() === target && visibility === "visible") {
            reopened = candidate;
            return true;
          }
        }
        return false;
      })
      .toBe(true);
    if (content === "chat") await expect(reopened.locator(".message.user")).toHaveText(prompt);
    await expect(reopened.locator(".message.assistant")).toContainText(
      content === "scheduled" ? savedOutput : "Stream complete.",
    );
    const composer = reopened.getByRole("textbox", { name: "Message Hermes" });
    await composer.focus();
    await expect(composer).toBeFocused();
    expect(context.pages()).toHaveLength(windows);
    expect(reopened).toBe(page);
    expect(
      await reopened.evaluate(() => document.documentElement.dataset.notificationDocument),
    ).toBe("original");
    await reopened.screenshot({ path: info.outputPath(`${destination}-reopened.png`) });
    captureDevice((name) => info.outputPath(name), container, `${destination}-device-reopened.png`);
  });
}

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
