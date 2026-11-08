import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { runtime } from "./helpers";

async function showSidebar(page: Page) {
  const menu = page.locator(".mobile-menu");
  await expect(menu).toBeAttached();
  if (await menu.isVisible()) {
    if ((await menu.getAttribute("aria-expanded")) !== "true") await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
  }
}
async function hideSidebar(page: Page) {
  const menu = page.locator(".mobile-menu");
  const close = page
    .locator(".sidebar")
    .getByRole("button", { name: "Close navigation", exact: true });
  if ((await menu.isVisible()) && (await menu.getAttribute("aria-expanded")) === "true")
    await close.click();
}

test("sidebar working survives navigation and reconnect, isolates simultaneous profiles and coexists with unread", async ({
  page,
}, info) => {
  test.setTimeout(150000);
  const origin = new URL(page.url()).origin;
  const id = `sidebar-working-${randomUUID()}`;
  const secondId = `${id}-second`;
  runtime(
    `
import json,sys
from hermes_cli.web_server_sessions import _open_session_db_for_profile
for profile, sid, title in [('alpha',sys.argv[1],'Alpha working'),('beta',sys.argv[1],'Beta working'),('alpha',sys.argv[2],'Second working')]:
    db = _open_session_db_for_profile(profile, read_only=False)
    db.create_session(sid, source='desktop')
    db.set_session_title(sid, title + ' ' + sid)
    db.append_message(sid, 'user', 'Earlier prompt')
    db.append_message(sid, 'assistant', 'Earlier answer')
    db.close()
print(json.dumps(True))
`,
    id,
    secondId,
  );
  const beta = await page.context().newPage();
  const second = await page.context().newPage();
  const open = (target: Page, profile: string, sid: string) =>
    target.goto(`${origin}/chathermes#/chat/${sid}?profile=${profile}`);
  try {
    await Promise.all([
      open(page, "alpha", id),
      open(beta, "beta", id),
      open(second, "alpha", secondId),
    ]);
    const send = async (target: Page) => {
      const input = target.getByRole("textbox", { name: "Message Hermes" });
      await input.fill(`[workflow-sidebar] ${randomUUID()}`);
      await expect(target.getByRole("button", { name: "Send message", exact: true })).toBeEnabled();
      await target.getByRole("button", { name: "Send message", exact: true }).click();
      await expect(
        target.getByRole("button", { name: "Stop response", exact: true }),
      ).toBeVisible();
    };
    await Promise.all([send(page), send(beta), send(second)]);
    const statuses = async (profile: string) => {
      const response = await page.request.get(
        `${origin}/api/plugins/chathermes/session-activity/${profile}`,
      );
      expect(response.ok()).toBe(true);
      const data = (await response.json()) as {
        sessions: { id: string; session_key: string; status: string }[];
      };
      expect(
        data.sessions.every(
          (row) =>
            Object.keys(row).sort().join() ===
            "id,session_key,session_keys,session_keys_complete,status",
        ),
      ).toBe(true);
      return data.sessions;
    };
    await expect
      .poll(
        async () =>
          (await statuses("alpha")).filter(
            (row) => [id, secondId].includes(row.session_key) && row.status === "working",
          ).length,
      )
      .toBe(2);
    await expect
      .poll(async () =>
        (await statuses("beta")).some((row) => row.session_key === id && row.status === "working"),
      )
      .toBe(true);
    await page.bringToFront();
    await showSidebar(page);
    const alphaRow = page
      .locator(".sidebar .session-select")
      .filter({ hasText: `Alpha working ${id}` });
    await expect(alphaRow.locator(".session-working")).toBeVisible();
    await expect(alphaRow).toHaveAttribute("aria-current", "page");
    await alphaRow.scrollIntoViewIfNeeded();
    await page.screenshot({
      animations: "disabled",
      path: info.outputPath("sidebar-working-selected.png"),
    });
    await hideSidebar(page);
    // A page navigation closes only its viewer, not the underlying turn.
    await page.goto(`${origin}/chathermes#/?profile=alpha`);
    await showSidebar(page);
    await expect(alphaRow.locator(".session-working")).toBeVisible();
    await expect(page.locator(".sidebar .session-working")).toHaveCount(2);
    // Stop beta's identically named stored ID; alpha must continue working.
    await beta.getByRole("button", { name: "Stop response", exact: true }).click();
    await expect(beta.getByRole("button", { name: "Stop response", exact: true })).toHaveCount(0);
    await page
      .locator(".sidebar")
      .getByRole("combobox", { name: "Profile", exact: true })
      .selectOption("beta");
    const betaRow = page
      .locator(".sidebar .session-select")
      .filter({ hasText: `Beta working ${id}` });
    await expect(betaRow).toHaveCount(1);
    await expect(betaRow.locator(".session-working")).toHaveCount(0);
    await showSidebar(page);
    await betaRow.scrollIntoViewIfNeeded();
    await page.screenshot({
      animations: "disabled",
      path: info.outputPath("sidebar-working-beta-idle.png"),
    });
    await page
      .locator(".sidebar")
      .getByRole("combobox", { name: "Profile", exact: true })
      .selectOption("alpha");
    await showSidebar(page);
    await expect(alphaRow.locator(".session-working")).toBeVisible();
    runtime(
      `
import json,sys,time
sys.path.insert(0,'/opt/data/plugins')
from chathermes.dashboard import inbox,push_store
inbox.record(push_store,'alpha',sys.argv[1],sys.argv[1]+':prior-answer','turn.complete',occurred=time.time(),title='Earlier answer',preview='Earlier answer')
print(json.dumps(True))
`,
      id,
    );
    // A real shell reload fetches both unread and live snapshots.
    await page.reload();
    await showSidebar(page);
    await expect(alphaRow.locator(".session-unread")).toBeVisible();
    await expect(alphaRow.locator(".session-working")).toBeVisible();
    await expect(alphaRow).toHaveAccessibleName(/Unread Working/);
    await alphaRow.scrollIntoViewIfNeeded();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(alphaRow.locator(".session-working")).toHaveCSS("animation-name", "none");
    await expect(alphaRow.locator(".session-working")).toHaveCSS(
      "-webkit-text-fill-color",
      "rgb(212, 212, 212)",
    );
    await page.screenshot({
      animations: "disabled",
      path: info.outputPath("sidebar-working-unread-reduced.png"),
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(alphaRow.locator(".session-working")).toHaveCSS(
      "animation-name",
      /session-shimmer/,
    );
    await page.screenshot({
      animations: "disabled",
      path: info.outputPath("sidebar-working-unread.png"),
    });
    await second.getByRole("button", { name: "Stop response", exact: true }).click();
    await expect
      .poll(
        async () => (await statuses("alpha")).find((row) => row.session_key === secondId)?.status,
      )
      .toBe("idle");
    await expect(
      page
        .locator(".sidebar .session-select")
        .filter({ hasText: `Second working ${secondId}` })
        .locator(".session-working"),
    ).toHaveCount(0);
    await expect(alphaRow.locator(".session-working")).toBeVisible();
    await page.context().setOffline(true);
    // APIRequestContext remains online and witnesses actual completion while
    // every browser viewer is disconnected. No fabricated events or routes.
    await expect
      .poll(async () => (await statuses("alpha")).find((row) => row.session_key === id)?.status, {
        timeout: 70000,
      })
      .toBe("idle");
    await page.context().setOffline(false);
    await expect(alphaRow.locator(".session-working")).toHaveCount(0);
    await expect(alphaRow.locator(".session-unread")).toBeVisible();
    await page.screenshot({
      animations: "disabled",
      path: info.outputPath("sidebar-working-reconnected-finished.png"),
    });
    await alphaRow.click();
    await expect(page.locator(".message.assistant").last()).toContainText("Resume complete.");
    await showSidebar(page);
    await expect(alphaRow).toHaveAttribute("aria-current", "page");
    await expect(alphaRow.locator(".session-unread")).toHaveCount(0);
    await hideSidebar(page);
    const input = page.getByRole("textbox", { name: "Message Hermes" });
    await input.fill("Draft after background completion");
    await expect(input).toBeFocused();
    await expect(input).toHaveCSS("font-size", "16px");
    await expect(
      page.getByRole("button", { name: "Attachment options", includeHidden: true }),
    ).toBeAttached();
    await input.fill(Array.from({ length: 30 }, (_, n) => `Scrollable draft line ${n}`).join("\n"));
    await expect
      .poll(() => input.evaluate((element) => element.scrollHeight > element.clientHeight))
      .toBe(true);
    await input.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect.poll(() => input.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect(input).toBeFocused();
    await page.screenshot({
      animations: "disabled",
      path: info.outputPath("sidebar-working-composer-scroll.png"),
    });
  } finally {
    await page.context().setOffline(false);
    await beta.close();
    await second.close();
  }
});

test("a failed native turn clears the sidebar working title and leaves the composer usable", async ({
  page,
}, info) => {
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-sidebar-error] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("button", { name: "Stop response", exact: true })).toBeVisible();
  await showSidebar(page);
  const selected = page.locator('.sidebar .session-select[aria-current="page"]');
  await expect(selected.locator(".session-working")).toBeVisible();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("sidebar-working-before-error.png"),
  });
  // An inference failure may expose its partial output only when it settles.
  // Observe the actual running edge before waiting for that terminal output.
  await expect(page.locator(".message.assistant")).toContainText(
    "Partial response before interruption.",
  );
  await expect(selected.locator(".session-working")).toHaveCount(0, { timeout: 60000 });
  await hideSidebar(page);
  await expect(page.getByRole("status").filter({ hasText: "Response failed" })).toBeVisible();
  const input = page.getByRole("textbox", { name: "Message Hermes" });
  await input.fill("Draft after failure");
  await expect(input).toBeFocused();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("sidebar-working-error-settled.png"),
  });
});

test("waiting for native clarification keeps the title working until the turn finishes", async ({
  page,
}, info) => {
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-clarify] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByText("Choose a workflow direction", { exact: true })).toBeVisible();
  const id = new URL(page.url().split("#")[1]!, new URL(page.url()).origin).pathname
    .split("/")
    .pop()!;
  await expect
    .poll(async () => {
      const response = await page.request.get("/api/plugins/chathermes/session-activity/default");
      expect(response.ok()).toBe(true);
      const data = (await response.json()) as {
        sessions: { session_key: string; status: string }[];
      };
      return data.sessions.find((row) => row.session_key === id)?.status;
    })
    .toBe("waiting");
  await showSidebar(page);
  const selected = page.locator('.sidebar .session-select[aria-current="page"]');
  await expect(selected.locator(".session-working")).toBeVisible();
  await page.emulateMedia({ forcedColors: "active" });
  await expect(selected.locator(".session-working")).toHaveCSS("animation-name", "none");
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("sidebar-working-waiting-forced-colors.png"),
  });
  await page.emulateMedia({ forcedColors: "none" });
  await hideSidebar(page);
  await page.getByRole("button", { name: /^Proceed with workflow/ }).click();
  await expect(page.locator(".message.assistant").last()).toContainText("Clarification accepted.");
  await expect(selected.locator(".session-working")).toHaveCount(0);
  await showSidebar(page);
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("sidebar-working-clarification-completed.png"),
  });
});

test("compressed continuation follows the original attached viewer through polling, navigation and completion", async ({
  page,
}, info) => {
  const id = `sidebar-compressed-${randomUUID()}`;
  const tip = `${id}-tip`;
  runtime(
    `
import json,sys
from hermes_cli.web_server_sessions import _open_session_db_for_profile
db = _open_session_db_for_profile('default', read_only=False)
try:
    root, tip = sys.argv[1:]
    db.create_session(root, source='desktop')
    db.append_message(root, 'user', 'Earlier question')
    db.create_session(root + '-stale', source='desktop', parent_session_id=root)
    db.end_session(root + '-stale', 'ws_orphan_reap')
    db._execute_write(lambda conn: conn.execute('UPDATE sessions SET started_at=0 WHERE id=?', (root + '-stale',)))
    db.publish_compression_child(parent_session_id=root, child_session_id=tip, source='desktop', messages=[{'role':'user','content':'Earlier summary'}], require_compression_lease=False)
    assert db.get_compression_lineage(tip) == [tip]
    assert db.resolve_resume_session_id(root) == tip
    db.set_session_title(tip, 'Compressed working ' + root)
    print(json.dumps(True))
finally:
    db.close()
`,
    id,
    tip,
  );
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes#/chat/${id}?profile=default`);
  await page
    .getByRole("textbox", { name: "Message Hermes" })
    .fill(`[workflow-clarify] ${randomUUID()}`);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByText("Choose a workflow direction", { exact: true })).toBeVisible();
  const snapshot = await page.request.get(
    `${origin}/api/plugins/chathermes/session-activity/default`,
  );
  expect(snapshot.ok()).toBe(true);
  const body = await snapshot.json();
  const row = body.sessions.find((row: { session_key: string }) => row.session_key === tip);
  expect(row.session_keys).toEqual(expect.arrayContaining([id, tip]));
  expect(row.session_keys).not.toContain(`${id}-stale`);
  expect(row.status).toBe("waiting");
  await showSidebar(page);
  const selected = page
    .locator(".sidebar .session-select")
    .filter({ hasText: `Compressed working ${id}` });
  await expect(selected.locator(".session-working")).toBeVisible();
  // A reload on Home discards the viewer and restores work by continuation ID.
  await page.goto(`${origin}/chathermes#/?profile=default`);
  await showSidebar(page);
  await expect(selected.locator(".session-working")).toBeVisible();
  await selected.scrollIntoViewIfNeeded();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("compressed-background-working.png"),
  });
  await page.goto(`${origin}/chathermes#/chat/${id}?profile=default`);
  await expect(page.getByText("Choose a workflow direction", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^Proceed with workflow/ }).click();
  await expect(page.locator(".message.assistant").last()).toContainText("Clarification accepted.");
  await showSidebar(page);
  await expect(selected.locator(".session-working")).toHaveCount(0);
  await selected.scrollIntoViewIfNeeded();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("compressed-completed.png"),
  });
});
