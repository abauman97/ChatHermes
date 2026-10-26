import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { signIn, sessionFromUrl } from "./login";

test.use({ trace: "off" });

test("native execution completes after the browser leaves during a quiet tool", async ({
  page,
}, info) => {
  test.setTimeout(180000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const marker = `UNATTENDED_${info.project.name.toUpperCase()}`;
  let submissions = 0;
  page.on("websocket", (socket) => {
    if (new URL(socket.url()).pathname !== "/api/ws") return;
    socket.on("framesent", (event) => {
      const frame = JSON.parse(String(event.payload));
      if (frame.method === "prompt.submit") submissions++;
    });
  });
  const devices: { profile: string; id: string }[] = [];
  const container = process.env.CHATHERMES_LIVE_CONTAINER;
  if (container) {
    for (const profile of ["default", "alpha"]) {
      const subscription = await page.request.post(
        `/api/plugins/chathermes/push/subscriptions?profile=${profile}`,
        {
          data: {
            endpoint: `https://push.invalid/unattended-${info.project.name}-${profile}`,
            keys: { p256dh: "a", auth: "b" },
          },
        },
      );
      expect(subscription.ok()).toBe(true);
      devices.push({ profile, id: (await subscription.json()).id });
    }
  }
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(
    `Use the terminal tool once to run this exact command: python3 -c 'import time; time.sleep(35); print("${marker}")'. After the command finishes, reply with exactly ${marker}. Do not use other tools.`,
  );
  await plugin.getByRole("button", { name: "Send message", exact: true }).click();
  await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
  const id = sessionFromUrl(page.url())!;
  const url = page.url();
  try {
    await expect(
      plugin
        .locator(".activity[open]")
        .filter({ hasText: /terminal/i })
        .first(),
    ).toBeVisible({ timeout: 60000 });
    await expect(composer).toBeEnabled();
    await composer.focus();
    await expect(composer).toBeFocused();
    await page.screenshot({ path: info.outputPath("unattended-tool-active.png") });
    await page.goto("about:blank");
    // Exceed the pin's ordinary orphan grace while the tool emits no activity.
    await page.waitForTimeout(45000);
    await page.goto(url);
    await expect(plugin.locator(".message.assistant")).toContainText(marker, { timeout: 60000 });
    await expect(plugin.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
    await expect(plugin.locator(".message.user")).toHaveCount(1);
    expect(submissions).toBe(1);
    if (container) {
      const readDelivery = () =>
        JSON.parse(
          execFileSync(
            "docker",
            [
              "exec",
              container,
              "/opt/hermes/.venv/bin/python",
              "-c",
              "import sqlite3,json,sys; db=sqlite3.connect('/opt/data/state/chathermes.sqlite3'); print(json.dumps(db.execute('SELECT profile,device,delivered FROM deliveries WHERE session=? AND kind=?',(sys.argv[1],'turn.complete')).fetchall()))",
              id,
            ],
            { encoding: "utf8" },
          ),
        );
      await expect.poll(readDelivery, { timeout: 15000 }).toEqual([["default", devices[0]!.id, 0]]);
    }
    await composer.fill("Draft after unattended completion");
    await expect(composer).toBeFocused();
    await page.screenshot({ path: info.outputPath("unattended-completed.png") });
  } finally {
    for (const device of devices)
      await page.request.delete(
        `/api/plugins/chathermes/push/subscriptions/${device.id}?profile=${device.profile}`,
      );
    const stop = plugin.getByRole("button", { name: "Stop response", exact: true });
    if (await stop.isVisible()) await stop.click();
    await page.request.delete(`/api/plugins/chathermes/api/sessions/${id}?profile=default`);
  }
});
