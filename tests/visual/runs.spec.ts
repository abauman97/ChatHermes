import { signIn } from "./login";
import { expect, test } from "@playwright/test";

test("actual dashboard reloads an in-flight legacy run once, accepts guidance and stops", async ({
  page,
}, info) => {
  await signIn(page, "/chathermes");
  const plugin = page.locator(".chathermes-embedded");
  await expect(plugin.locator("#prompt")).toBeVisible();
  if (info.project.name === "mobile")
    await plugin.getByRole("button", { name: "Open navigation" }).click();
  await plugin.getByRole("combobox", { name: "Profile", exact: true }).selectOption("test-profile");
  await expect(plugin.locator("#prompt")).toBeEnabled();
  // Seed a genuinely admitted pre-migration Runs pointer through the authenticated
  // HTTP adapter. New UI sends must remain native after this pointer drains.
  const created = await page.request.post(
    "/api/plugins/chathermes/api/sessions?profile=test-profile",
    { data: {} },
  );
  const session = (await created.json()).session.id as string;
  const admitted = await page.request.post("/api/plugins/chathermes/v1/runs?profile=test-profile", {
    data: { session_id: session, input: "Keep working for this isolated test [hold-run]" },
    headers: { "Idempotency-Key": "legacy-fixture-" + Date.now() },
  });
  expect(admitted.status()).toBe(202);
  const receipt = await admitted.json();
  let admissions = 1;
  page.on("request", (request) => {
    if (request.method() === "POST" && new URL(request.url()).pathname.endsWith("/v1/runs"))
      admissions++;
  });
  await page.evaluate(
    ({ session, run }) =>
      localStorage.setItem("chathermes.run.v1:" + JSON.stringify(["test-profile", session]), run),
    { session, run: receipt.run_id },
  );
  await page.goto("/chathermes?profile=test-profile&session=" + encodeURIComponent(session));
  const state = await page.request.get(
    `/api/plugins/chathermes/v1/runs/${receipt.run_id}?profile=test-profile`,
  );
  expect(["pending", "running", "queued"]).toContain((await state.json()).status);
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("before-midflight-reload.png") });
  await page.reload();
  await expect(plugin.locator("#prompt")).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toBeVisible();
  await expect(plugin.locator(".message.user")).toHaveCount(1);
  expect(admissions).toBe(1);
  const composer = plugin.locator(".composer #prompt");
  await composer.click();
  await expect(composer).toBeFocused();
  await composer.fill("Draft remains editable");
  await expect(composer).toHaveValue("Draft remains editable");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(
    await plugin.locator(".transcript").evaluate((element) => getComputedStyle(element).overflowY),
  ).toBe("auto");
  await page.screenshot({ path: info.outputPath("resumed-inflight-run.png") });
  await plugin.getByRole("textbox", { name: "Message Hermes" }).fill("Use a concise answer");
  const guidance = page.waitForResponse((response) =>
    response.url().includes(`/runs/${receipt.run_id}/steer`),
  );
  await plugin.getByRole("button", { name: "Guide this run" }).click();
  expect((await guidance).ok()).toBe(true);
  await page.getByRole("button", { name: "Stop response", exact: true }).click();
  await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeVisible({
    timeout: 60_000,
  });
  expect(admissions).toBe(1);
  await page.screenshot({ path: info.outputPath("stopped-run.png") });
});
