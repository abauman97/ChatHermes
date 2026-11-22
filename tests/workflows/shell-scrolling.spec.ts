import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { runtime } from "./helpers";

test("a long sidebar scrolls without moving the fixed chat when controls receive focus", async ({
  page,
}, info) => {
  const marker = `shell-scroll-${randomUUID()}`;
  runtime(
    `import sys,json
sys.path.insert(0, '/opt/data/plugins')
from chathermes.dashboard import push_store,session_tracking
from hermes_cli.web_server_sessions import _open_session_db_for_profile
db=FixtureStore(store=_open_session_db_for_profile('default',read_only=False))
for index in range(30):
 sid=sys.argv[1]+'-'+str(index)
 db.create_session(sid,source='desktop')
 db.set_session_title(sid,'Sidebar scroll fixture '+sid)
 session_tracking.mark(push_store,'default',sid,'open')
db.close()
print(json.dumps(True))`,
    marker,
  );
  await page.reload();
  const plugin = page.locator(".chathermes-embedded");
  const list = plugin.getByRole("navigation", { name: "Sessions", exact: true });
  const compact = info.project.name !== "desktop";
  if (compact) await plugin.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect.poll(() => list.locator(".session-row").count()).toBeGreaterThanOrEqual(30);
  const last = list.locator(".session-select").last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeVisible();
  expect(await list.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  if (compact) await plugin.getByRole("button", { name: "Close navigation", exact: true }).click();
  const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
  await composer.fill("A focused draft stays in the fixed chat");
  await expect(composer).toBeFocused();
  await composer.blur();
  const model = plugin.getByRole("button", { name: "Choose model", exact: true });
  // Native focus/visibility scrolling may center a control. The outer viewport
  // must stay fixed even when a sidebar's clipped descendants extend below it.
  await model.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await model.click();
  await expect(
    plugin.getByRole("combobox", { name: "Reasoning effort", exact: true }),
  ).toBeVisible();
  const header = (await plugin.locator(".topbar").boundingBox())!;
  expect(header.y).toBeGreaterThanOrEqual(0);
  const box = (await plugin.locator(".composer").boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
  await page.screenshot({ path: info.outputPath("long-sidebar-model.png") });
  await plugin.getByRole("button", { name: "Close model picker" }).click();
  await composer.focus();
  await expect(composer).toBeFocused();
  expect((await plugin.locator(".topbar").boundingBox())!.y).toBeGreaterThanOrEqual(0);
  await expect(composer).toHaveValue("A focused draft stays in the fixed chat");
  await page.screenshot({ path: info.outputPath("long-sidebar-focus.png") });
});
