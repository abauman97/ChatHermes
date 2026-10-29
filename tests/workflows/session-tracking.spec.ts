import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { authenticate } from "../docker/prepare-browser.mjs";

async function navigation(page: import("@playwright/test").Page, mobile: boolean) {
  const button = page
    .locator(".chathermes-embedded")
    .getByRole("button", { name: "Open navigation", exact: true });
  await page.locator(".chathermes-embedded #profile-field").waitFor({ state: "attached" });
  if (mobile) await button.click();
  await expect(page.locator(".chathermes-embedded #profile-field")).toBeInViewport();
}

test("manual settlement preserves an executing chat and survives reload and profile switches", async ({
  page,
}, info) => {
  // Native profile cold starts use the same budget as the native-profile contracts.
  test.setTimeout(180_000);
  const admission: string[] = [];
  page.on("websocket", (socket) => {
    const pending = new Map<string | number, string>();
    socket.on("framesent", ({ payload }) => {
      try {
        const frame = JSON.parse(String(payload));
        if (
          ["gateway.ping", "session.create", "session.resume", "prompt.submit"].includes(
            frame.method,
          )
        ) {
          pending.set(frame.id, frame.method);
          admission.push(`sent ${frame.method}`);
        }
      } catch {
        /* Never retain raw protocol data or credentials. */
      }
    });
    socket.on("framereceived", ({ payload }) => {
      for (const line of String(payload).split("\n"))
        try {
          const frame = JSON.parse(line);
          const method = pending.get(frame.id);
          if (method) {
            admission.push(`reply ${method} ${frame.error ? "error" : "ok"}`);
            pending.delete(frame.id);
          }
        } catch {
          /* Only method names and reply outcomes are retained. */
        }
    });
  });
  const origin = new URL(page.url()).origin;
  await authenticate(page, `${origin}/chathermes?profile=alpha#/?profile=alpha`);
  await expect(page.locator(".chathermes-embedded #profile-field")).toHaveValue("alpha");
  await expect(page.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill(`[workflow-stream] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  try {
    await expect(page.locator(".message.assistant")).toContainText("First visible chunk.", {
      timeout: 80_000,
    });
  } catch (error) {
    await info.attach("native-admission-methods", {
      body: JSON.stringify(admission),
      contentType: "application/json",
    });
    throw error;
  }
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toBeVisible();
  const conversation = page.url();
  const id = decodeURIComponent(new URL(conversation).hash.split("?")[0]!.split("/").at(-1)!);
  await navigation(page, info.project.name !== "desktop");
  const active = page.getByRole("region", { name: "Active", exact: true });
  const selected = active
    .locator(".session-row")
    .filter({ has: page.locator('[aria-current="page"]') });
  await expect(selected).toHaveCount(1);
  await selected.getByRole("button", { name: /^Options for / }).click();
  const activeMenu = page.getByRole("dialog", { name: "Session options" });
  await expect(activeMenu.getByRole("button", { name: "Mark settled", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("menu-open.png") });
  await page.keyboard.press("Escape");
  const settle = selected.getByRole("button", { name: /^Mark .* settled$/ });
  const bounds = await settle.boundingBox();
  expect(Math.round(bounds!.width)).toBeGreaterThanOrEqual(44);
  expect(Math.round(bounds!.height)).toBeGreaterThanOrEqual(44);
  await settle.click();
  const recents = page.getByRole("region", { name: "Recents", exact: true });
  await expect(recents.locator('.session-select[aria-current="page"]')).toHaveCount(1);
  const close = page
    .locator(".chathermes-embedded")
    .getByRole("button", { name: "Close navigation", exact: true });
  if (await close.isVisible()) await close.click();
  await expect(page.locator(".message.assistant")).toContainText("Stream complete.");
  await composer.focus();
  await expect(composer).toBeFocused();
  const metadata = async () =>
    (await page.request.get(`/api/plugins/chathermes/session-tracking?profile=alpha`)).json();
  expect(
    (await metadata()).tracking.find((row: { session_id: string }) => row.session_id === id).status,
  ).toBe("settled");
  await composer.fill(`[workflow-stream] follow-up ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator(".message.assistant")).toHaveCount(2);
  await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
  expect(
    (await metadata()).tracking.find((row: { session_id: string }) => row.session_id === id).status,
  ).toBe("settled");
  await page.reload();
  await expect(page.locator(".message.user")).toHaveCount(2);
  await expect(page.locator(".message.assistant").last()).toContainText("Stream complete.");
  await expect(page.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
  await navigation(page, info.project.name !== "desktop");
  await expect(recents.locator('.session-select[aria-current="page"]')).toHaveCount(1);
  const row = recents
    .locator(".session-row")
    .filter({ has: page.locator('[aria-current="page"]') });
  await row.getByRole("button", { name: /^Options for / }).click();
  const settledMenu = page.getByRole("dialog", { name: "Session options" });
  await expect(settledMenu.getByRole("button", { name: "Make active", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("menu-settled.png") });
  await page
    .getByRole("dialog", { name: "Session options" })
    .getByRole("button", { name: "Make active", exact: true })
    .click();
  await expect(active.locator('.session-select[aria-current="page"]')).toHaveCount(1);
  await active.getByRole("heading", { name: "Active", exact: true }).scrollIntoViewIfNeeded();
  await expect(page.locator(".chathermes-embedded #profile-field")).toBeInViewport();
  await page.screenshot({ path: info.outputPath("tracking-active.png") });
  await page.getByLabel("Profile", { exact: true }).selectOption("beta");
  await expect(page.locator('.session-select[aria-current="page"]')).toHaveCount(0);
  expect(
    (await page.request.get("/api/plugins/chathermes/session-tracking?profile=beta")).ok(),
  ).toBe(true);
  await page.getByLabel("Profile", { exact: true }).selectOption("alpha");
  await expect(active.locator(".session-row")).not.toHaveCount(0);
  await page.goto(conversation);
  await expect(page.locator(".message.user")).toHaveCount(2);
});

test("older Open sessions stay visible outside Recents pagination with no sidebar transcript reads", async ({
  page,
}, info) => {
  const origin = new URL(page.url()).origin;
  await authenticate(page, `${origin}/chathermes?profile=beta#/?profile=beta`);
  const marker = randomUUID();
  let old = "";
  for (let index = 0; index < 32; index++) {
    const result = await page.request.post("/api/plugins/chathermes/api/sessions?profile=beta", {
      data: { source: "desktop", title: `Tracking ${marker} ${index}` },
    });
    expect(result.status()).toBe(201);
    const id = (await result.json()).session.id;
    if (index === 0) old = id;
    else
      expect(
        (
          await page.request.put(`/api/plugins/chathermes/session-tracking/${id}?profile=beta`, {
            data: { status: "settled" },
          })
        ).ok(),
      ).toBe(true);
  }
  const requests: string[] = [];
  page.on("request", (request) => {
    if (/\/messages(?:\?|$)/.test(request.url())) requests.push(request.url());
  });
  await page.reload();
  await navigation(page, info.project.name !== "desktop");
  const oldRow = page
    .getByRole("region", { name: "Active", exact: true })
    .locator(".session-row")
    .filter({ hasText: `Tracking ${marker} 0` });
  await expect(oldRow).toHaveCount(1);
  requests.length = 0;
  await page.getByRole("button", { name: "Load more", exact: true }).click();
  await expect(
    page.locator(".session-select").filter({ hasText: `Tracking ${marker} 0` }),
  ).toHaveCount(1);
  expect(requests).toEqual([]);
  await oldRow.getByRole("button", { name: /^Mark .* settled$/ }).click();
  await expect(
    page
      .getByRole("region", { name: "Recents", exact: true })
      .locator(".session-select")
      .filter({ hasText: `Tracking ${marker} 0` }),
  ).toHaveCount(1);
  await page.screenshot({ path: info.outputPath("tracking-older-settled.png") });
  const metadata = await page.request.get("/api/plugins/chathermes/session-tracking?profile=beta");
  expect(
    (await metadata.json()).tracking.find((row: { session_id: string }) => row.session_id === old)
      .status,
  ).toBe("settled");
});
