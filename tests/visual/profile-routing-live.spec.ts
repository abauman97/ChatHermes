import { expect, test } from "@playwright/test";
import { signIn } from "./login";

// The disposable launcher seeds three profiles with distinct server-side keys.
// Use one session ID in all three stores to catch accidental default routing.
test("hosted profiles keep HTTP sessions and uploads isolated", async ({ page }, info) => {
  await signIn(page);
  for (const profile of ["default", "alpha", "beta"])
    expect(
      await page.evaluate(async (profile) => {
        const response = await fetch(`/api/plugins/chathermes/v1/capabilities?profile=${profile}`, {
          credentials: "omit",
        });
        return response.status;
      }, profile),
    ).toBe(401);
  const id = `profile-routing-${crypto.randomUUID()}`;
  const profiles = ["default", "alpha", "beta"];
  const request = (profile: string, path: string, method?: string, body?: object) =>
    page.evaluate(
      async ({ profile, path, method, body }) => {
        const options: RequestInit = { method };
        if (body) {
          options.headers = { "Content-Type": "application/json" };
          options.body = JSON.stringify(body);
        }
        const response = await fetch(
          `/api/plugins/chathermes/${path}?profile=${encodeURIComponent(profile)}`,
          options,
        );
        return { status: response.status, body: await response.json() };
      },
      { profile, path, method, body },
    );
  try {
    for (const profile of profiles) {
      const created = await request(profile, "api/sessions", "POST", {
        id,
        title: `Synthetic ${profile} isolation`,
      });
      expect(created.status).toBe(201);
    }
    for (const profile of profiles) {
      for (const path of ["v1/capabilities", "v1/models", "scheduled"])
        expect((await request(profile, path)).status).toBe(200);
      const session = await request(profile, `api/sessions/${id}`);
      expect(session.status).toBe(200);
      expect((session.body.session || session.body).title).toBe(`Synthetic ${profile} isolation`);
      const uploaded = await request(profile, "uploads", "POST", {
        name: "profile-routing.txt",
        data: "data:text/plain;base64,U3ludGhldGljIHByb2ZpbGUgdXBsb2Fk",
      });
      expect(uploaded.status).toBe(201);
      expect(uploaded.body.path).toContain(
        profile === "default" ? "/opt/data/uploads/" : `/opt/data/profiles/${profile}/uploads/`,
      );
      const plugin = page.locator(".chathermes-embedded");
      if (info.project.name === "mobile")
        await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
      await plugin.locator("#profile-field").selectOption(profile);
      await expect(plugin.locator("#profile-field")).toHaveValue(profile);
      await expect(
        plugin.getByText(`Synthetic ${profile} isolation`, { exact: true }),
      ).toBeAttached();
      const close = plugin.getByRole("button", { name: "Close navigation", exact: true });
      if (await close.isVisible()) await close.click();
      await expect(plugin.getByText("Loading sessions...", { exact: true })).toHaveCount(0);
      const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
      await composer.fill(`Synthetic ${profile} draft`);
      await expect(composer).toBeFocused();
      await expect(composer).toHaveCSS("font-size", "16px");
      await page.screenshot({
        path: info.outputPath(`profile-${profile}.png`),
        mask: [plugin.locator('[class*="model"]')],
      });
    }
  } finally {
    for (const profile of profiles) await request(profile, `api/sessions/${id}`, "DELETE");
  }
});
