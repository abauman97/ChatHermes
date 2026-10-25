import { expect, test } from "@playwright/test";
import { signIn } from "./login";

test("uploaded image renders inline and opens from persisted chat history", async ({
  page,
}, info) => {
  let historyRouteCalls = 0;
  let capabilityRouteCalls = 0;
  const capabilities = { features: { native_chat: false } };
  await page.route(
    (url) => url.pathname === "/api/plugins/chathermes/v1/capabilities",
    async (route) => {
      capabilityRouteCalls += 1;
      await route.fulfill({ json: capabilities });
    },
  );
  const ready = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/api/plugins/chathermes/v1/capabilities",
  );
  await signIn(page);
  await ready;
  expect(capabilityRouteCalls).toBeGreaterThan(0);
  const file = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/mAAAAABJRU5ErkJggg==",
    "base64",
  );
  const upload = await page.request.post("/api/plugins/chathermes/uploads", {
    data: {
      name: "pixel.png",
      type: "image/png",
      data: `data:image/png;base64,${file.toString("base64")}`,
      size: file.length,
    },
  });
  expect(upload.status()).toBe(201);
  const storedPath = (await upload.json()).path as string;
  const imageId = storedPath.split("/").pop()!;
  const session = await page.request.post("/api/plugins/chathermes/chat/sessions?profile=default", {
    data: {},
  });
  const sessionBody = await session.json();
  const sessionId = (sessionBody.session || sessionBody).id as string;
  await page.route(
    (url) => url.pathname === `/api/plugins/chathermes/api/sessions/${sessionId}/messages`,
    async (route) => {
      historyRouteCalls += 1;
      await route.fulfill({
        json: {
          messages: [
            {
              id: "persisted-upload-row",
              role: "user",
              content: `Inspect this image\nAttached image pixel.png: /uploads/chathermes/${imageId}`,
            },
          ],
        },
      });
    },
  );
  await page.goto(`/chathermes?profile=default#/chat/${encodeURIComponent(sessionId)}`);
  await expect.poll(() => historyRouteCalls).toBeGreaterThan(0);
  const plugin = page.locator(".chathermes-embedded");
  const message = plugin.locator("article.message.user").filter({ hasText: "Inspect this image" });
  const card = message.locator(".artifact-card");
  const image = card.locator("button img");
  await expect(image).toBeVisible({ timeout: 30_000 });
  await expect(image).toHaveJSProperty("complete", true);
  await expect(image).toHaveJSProperty("naturalWidth", 1);
  const src = await image.getAttribute("src");
  expect(src).toContain(`/api/plugins/chathermes/images/${imageId}`);
  const request = await page.request.get(new URL(src!, page.url()).href);
  expect(request.status()).toBe(200);
  expect(request.headers()["content-type"]).toMatch(/^image\/png/);

  await page.screenshot({ path: info.outputPath("persisted-inline-image.png"), fullPage: true });
  await image.click();
  const dialog = message.locator("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute("src", src!);
  await page.screenshot({ path: info.outputPath("image-preview-dialog.png"), fullPage: true });
});
