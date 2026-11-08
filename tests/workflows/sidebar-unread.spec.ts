import { randomUUID } from "node:crypto";
import type { Page, TestInfo } from "@playwright/test";
import { test, expect } from "./fixtures";
import { authenticate } from "../docker/prepare-browser.mjs";
import { runtime } from "./helpers";
import type { InboxPage } from "../../src/features/inbox/inbox";

async function verifySidebarUnread(page: Page, info: TestInfo) {
  const origin = new URL(page.url()).origin;
  const sid = `sidebar-unread-${randomUUID()}`;
  const alphaTitle = `Sidebar unread alpha ${sid}`;
  const betaTitle = `Sidebar unread beta ${sid}`;
  runtime(
    `
import json, sys, time
sys.path.insert(0, '/opt/data/plugins')
from hermes_cli.web_server_sessions import _open_session_db_for_profile
from chathermes.dashboard import inbox, push_store
for profile in ('alpha', 'beta'):
    db = _open_session_db_for_profile(profile, read_only=False)
    db.create_session(sys.argv[1], source='desktop')
    db.set_session_title(sys.argv[1], 'Sidebar unread ' + profile + ' ' + sys.argv[1])
    db.append_message(sys.argv[1], 'user', 'Saved prompt')
    identity = db.append_message(sys.argv[1], 'assistant', 'Saved sidebar response')
    db.close()
    inbox.record(push_store, profile, sys.argv[1], str(identity), 'turn.complete', occurred=time.time(), title='Sidebar unread ' + profile + ' ' + sys.argv[1], preview='Saved sidebar response')
print(json.dumps(True))
`,
    sid,
  );
  await authenticate(page, `${origin}/chathermes?profile=alpha#/?profile=alpha`);
  const tracking = await page.request.put(
    `/api/plugins/chathermes/session-tracking/${sid}?profile=alpha`,
    { data: { status: "open" } },
  );
  expect(tracking.ok()).toBe(true);
  await page.goto(`${origin}/chathermes?profile=alpha#/inbox?profile=alpha`);
  await page.reload();
  const sidebar = page.locator(".sidebar");
  const menu = page.locator(".mobile-menu");
  await expect(menu).toBeAttached();
  const mobile = await menu.isVisible();
  const show = async () => {
    if (mobile) {
      if ((await menu.getAttribute("aria-expanded")) !== "true") await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
    }
  };
  const hide = async () => {
    if (mobile)
      await sidebar.getByRole("button", { name: "Close navigation", exact: true }).click();
  };
  const alpha = sidebar.locator(".session-select").filter({ hasText: alphaTitle });
  await show();
  await expect(alpha.locator(".session-unread")).toBeVisible();
  await expect(alpha).toHaveAccessibleName(new RegExp(`${alphaTitle} Unread`));
  await expect(
    sidebar.getByRole("button", { name: `Mark ${alphaTitle} settled`, exact: true }),
  ).toBeVisible();
  // Read both rectangles in one frame while the mobile drawer animates.
  await expect
    .poll(() =>
      alpha.evaluate((button) => {
        const dot = button.querySelector(".session-unread")!;
        return button.getBoundingClientRect().right - dot.getBoundingClientRect().right;
      }),
    )
    .toBeLessThan(20);
  await page.screenshot({ animations: "disabled", path: info.outputPath("sidebar-unread.png") });
  await hide();
  const result = await page.request.get("/api/plugins/chathermes/inbox?profile=default&limit=100");
  const data = (await result.json()) as InboxPage;
  const notice = data.items.find((item) => item.profile === "alpha" && item.session === sid)!;
  expect(notice).toBeTruthy();
  expect(
    (await page.request.put(`/api/plugins/chathermes/inbox/${notice.id}/read?profile=alpha`)).ok(),
  ).toBe(true);
  // The regular shell refresh observes an external read without remounting.
  await expect(alpha.locator(".session-unread")).toHaveCount(0, { timeout: 30000 });
  await show();
  await expect(
    sidebar.getByRole("button", { name: `Mark ${alphaTitle} settled`, exact: true }),
  ).toBeVisible();
  await sidebar.getByRole("combobox", { name: "Profile", exact: true }).selectOption("beta");
  const beta = sidebar.locator(".session-select").filter({ hasText: betaTitle });
  await expect(beta.locator(".session-unread")).toBeVisible();
  await show();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("sidebar-unread-beta.png"),
  });
  await beta.click();
  await expect(page.locator(".message.assistant")).toContainText("Saved sidebar response");
  await show();
  await expect(beta.locator(".session-unread")).toHaveCount(0);
  await expect(beta).toHaveAttribute("aria-current", "page");
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("sidebar-read-selected.png"),
  });
  await hide();
  const composer = page.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill("Sidebar verification draft");
  await expect(composer).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Attachment options", includeHidden: true }),
  ).toBeAttached();
  await page.reload();
  await expect(page.locator(".message.assistant")).toContainText("Saved sidebar response");
  await show();
  await expect(beta.locator(".session-unread")).toHaveCount(0);
}

test("sidebar unread indicators follow Inbox state and profile while preserving tracking", async ({
  page,
}, info) => {
  await verifySidebarUnread(page, info);
});

test("sidebar unread uses the drawer at a narrow desktop viewport", async ({ page }, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Additional responsive coverage for the desktop project",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await verifySidebarUnread(page, info);
});
