import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { authenticate } from "../docker/prepare-browser.mjs";
import { sessionFromUrl } from "../visual/login";

for (const profile of ["default", "alpha", "beta"]) {
  test(`session navigation and restoration stay isolated in ${profile}`, async ({ page }, info) => {
    const origin = new URL(page.url()).origin;
    await authenticate(page, `${origin}/chathermes?profile=${profile}#/?profile=${profile}`);
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    const prompt = `[workflow-stream] ${profile} ${randomUUID()}`;
    await composer.fill(prompt);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    const conversation = page.url();
    const open = page
      .locator(".chathermes-embedded")
      .getByRole("button", { name: "Open navigation", exact: true });
    if (await open.isVisible()) await open.click();
    await page
      .locator(".chathermes-embedded")
      .getByRole("button", { name: "New chat", exact: true })
      .click();
    await expect(page.locator(".message.user")).toHaveCount(0);
    await expect(composer).toBeEnabled();
    await composer.fill(`Draft in ${profile}`);
    await expect(composer).toBeFocused();
    await page.goto(conversation);
    await expect(page.locator(".message.user")).toHaveText(prompt);
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    await page.reload();
    await expect(page.locator(".message.user")).toHaveCount(1);
    await page.screenshot({ path: info.outputPath(`restored-${profile}.png`) });
  });
}

test("browser disconnect recovers without sending the prompt twice", async ({ page }) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText("First visible chunk.");
  // A CDP network fault applies to this page on desktop and real Android.
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: true,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
    await expect(composer).toBeEnabled();
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
    await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
    await expect(page.locator(".message.user")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(".message.user")).toHaveCount(1);
    await expect(page.locator(".message.assistant")).toHaveCount(1);
  } finally {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
    });
    await cdp.detach();
  }
});

test("file and camera inputs use authenticated uploads and preserve composer focus", async ({
  page,
}, info) => {
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.focus();
  await expect(composer).toBeFocused();
  await expect(composer).toHaveCSS("font-size", "16px");
  const uploaded = page.waitForResponse(
    (response) => response.url().includes("/uploads") && response.request().method() === "POST",
  );
  await page.locator('input[aria-label="Upload files"]').setInputFiles({
    name: "workflow.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic workflow upload"),
  });
  expect((await uploaded).status()).toBe(201);
  await expect(page.locator(".composer")).toContainText("workflow.txt");
  await page.getByRole("button", { name: "Remove workflow.txt" }).click();
  await expect(page.getByRole("button", { name: "Remove workflow.txt" })).toHaveCount(0);
  await expect(composer).toBeFocused();
  await page.locator("input[capture]").setInputFiles({
    name: "camera.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(page.locator(".composer img")).toBeVisible();
  await page.screenshot({ path: info.outputPath("attachment.png") });
  await page.getByRole("button", { name: "Remove camera.png" }).click();
  await expect(page.getByRole("button", { name: "Remove camera.png" })).toHaveCount(0);
});

// This is a deterministic worker-routing probe, separate from the native tray
// delivery test above. It exercises the installed worker and real Hermes data.
test("@desktop worker clicks load exact session/profile and saved scheduled output in the open plugin", async ({
  page,
}, info) => {
  const context = page.context();
  const origin = new URL(page.url()).origin;
  await context.grantPermissions(["notifications"], { origin });
  await page.goto(`${origin}/chathermes?profile=alpha#/?profile=alpha`);
  await page.evaluate(async () => {
    await navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
      scope: "/chathermes",
      updateViaCache: "none",
    });
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  const plugin = page.locator(".chathermes-embedded");
  const area = plugin.getByRole("textbox", { name: "Message Hermes" });
  await expect(area).toBeVisible();
  const prompt = `[workflow-stream] notification destination ${randomUUID()}`;
  await area.fill(prompt);
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(plugin.locator(".message.assistant")).toContainText("Stream complete.");
  const target = page.url();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  const newChat = plugin.getByRole("button", { name: "New chat", exact: true });
  await newChat.click();
  await expect(newChat).toBeEnabled();
  await expect.poll(() => sessionFromUrl(page.url())).not.toBe(sessionFromUrl(target));
  await expect(plugin.locator(".message.user")).toHaveCount(0);
  await area.fill("Draft in the other chat");
  await page.evaluate(async () => {
    document.documentElement.dataset.notificationDocument = "original";
    await navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
      scope: "/chathermes",
      updateViaCache: "none",
    });
    await navigator.serviceWorker.ready;
  });
  const worker = context.serviceWorkers()[0] || (await context.waitForEvent("serviceworker"));
  const handoffs: boolean[] = [];
  await page.exposeFunction("notificationHandoff", (hasPort: boolean) => handoffs.push(hasPort));
  await page.evaluate(() => {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "chathermes.navigate")
        void (
          window as unknown as { notificationHandoff: (hasPort: boolean) => Promise<void> }
        ).notificationHandoff(event.ports.length === 1);
    });
  });
  const click = (url: string) =>
    worker.evaluate(async (url) => {
      const scope = self as unknown as {
        registration: ServiceWorkerRegistration;
        NotificationEvent: new (type: string, init: { notification: Notification }) => Event;
      };
      await scope.registration.showNotification("Synthetic routing probe", {
        tag: "chathermes:issue202",
        data: { url },
      });
      const [notification] = await scope.registration.getNotifications({
        tag: "chathermes:issue202",
      });
      const event = new scope.NotificationEvent("notificationclick", {
        notification: notification!,
      });
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
  await expect(plugin.locator(".message.user")).toHaveText(prompt);
  await expect(plugin.locator(".message.assistant")).toContainText("Stream complete.");
  await expect(area).toHaveValue("");
  await expect(plugin.locator(".topbar-profile")).toHaveText("alpha");
  expect(new URL(page.url()).hash).toBe(new URL(target).hash);
  expect(handoffs).toEqual([true]);
  expect(context.pages()).toHaveLength(windows);
  // Cold native reconstruction can legitimately reach the fallback deadline.
  // Check document reuse separately once the destination is already loaded.
  await page.evaluate(() => {
    document.documentElement.dataset.notificationDocument = "original";
  });
  // Repeated clicks to an already-loaded route must acknowledge without reload.
  await click(target);
  expect(await page.evaluate(() => document.documentElement.dataset.notificationDocument)).toBe(
    "original",
  );
  await area.focus();
  await expect(area).toBeFocused();
  await page.screenshot({ path: info.outputPath("notification-loaded-session.png") });

  const { runtime } = await import("./helpers");
  const name = `Notification destination ${randomUUID()}`;
  const saved = runtime(
    "import json,sys; from cron.jobs import create_job,save_job_output; j=create_job(prompt='Synthetic notification routing',schedule='0 0 1 1 *',name=sys.argv[1],paused=True); p=save_job_output(j['id'],'Exact issue 202 saved scheduled destination.'); print(json.dumps({'job':j['id'],'run':'output:'+p.stem}))",
    name,
  );
  const scheduled = `${origin}/chathermes?profile=default#/scheduled/${encodeURIComponent(saved.job)}/${encodeURIComponent(saved.run)}?profile=default`;
  await click(scheduled);
  await expect(plugin.locator(".scheduled-page")).toContainText(name);
  await expect(plugin.locator(".scheduled-page .message.assistant")).toContainText(
    "Exact issue 202 saved scheduled destination.",
  );
  await expect(plugin.locator(".topbar-profile")).toHaveText("default");
  expect(new URL(page.url()).hash).toBe(new URL(scheduled).hash);
  expect(await page.evaluate(() => document.documentElement.dataset.notificationDocument)).toBe(
    "original",
  );
  expect(context.pages()).toHaveLength(windows);
  await area.focus();
  await expect(area).toBeFocused();
  await page.screenshot({ path: info.outputPath("notification-loaded-scheduled.png") });
});
