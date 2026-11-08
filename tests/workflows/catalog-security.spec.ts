import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api } from "./helpers";
import { authenticate } from "../docker/prepare-browser.mjs";
import { sessionFromUrl } from "../visual/login";

test("catalog security: authenticated profile chats and durable public-only push identity", async ({
  page,
}) => {
  const origin = new URL(page.url()).origin;
  const first = await api(page, "/api/plugins/chathermes/push/config?profile=default");
  expect(first.status).toBe(200);
  expect(Object.keys(first.body).sort()).toEqual(["available", "vapid_public_key"]);
  expect(first.body.available).toBe(true);
  expect(first.body.vapid_public_key).toMatch(/^[A-Za-z0-9_-]{87}$/);
  for (const path of ["push/config", "sessions", "v1/capabilities"]) {
    const denied = await page.request.get(`${origin}/api/plugins/chathermes/${path}`, {
      headers: { Cookie: "", Authorization: "" },
      maxRedirects: 0,
    });
    expect([401, 403]).toContain(denied.status());
  }
  let alphaSession = "";
  for (const profile of ["alpha", "beta"]) {
    await authenticate(page, `${origin}/chathermes?profile=${profile}#/?profile=${profile}`);
    const composer = page.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill(`[workflow-stream] catalog-${profile}-${randomUUID()}`);
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await expect(page.locator(".message.assistant")).toHaveText(
      "First visible chunk. Second visible chunk. Stream complete.",
    );
    const session = sessionFromUrl(page.url());
    expect(session).toBeTruthy();
    if (profile === "alpha") alphaSession = session!;
    else {
      expect(session).not.toBe(alphaSession);
      const foreign = await api(
        page,
        `/api/plugins/chathermes/api/sessions/${alphaSession}/messages?profile=beta`,
      );
      expect(foreign.status).toBe(404);
    }
    await page.reload();
    await expect(page.locator(".message.assistant")).toHaveCount(1);
    const restored = await api(page, `/api/plugins/chathermes/push/config?profile=${profile}`);
    expect(restored).toEqual(first);
    await composer.focus();
    await expect(composer).toBeFocused();
  }
});
