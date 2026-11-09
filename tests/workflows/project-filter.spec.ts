import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";

async function expectReadableMenu(page: Page) {
  const menu = page.getByRole("menu", { name: "Screen options", exact: true });
  await expect(menu).toBeVisible();
  const geometry = await menu.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const rows = Array.from(
      element.querySelectorAll<HTMLElement>('[role="menuitemradio"], [role="menuitemcheckbox"]'),
      (row) => {
        const label = row.querySelector("span")!;
        const mark = row.querySelector('[aria-hidden="true"]')!;
        const range = document.createRange();
        range.selectNodeContents(label);
        const labelRect = label.getBoundingClientRect();
        const markRect = mark.getBoundingClientRect();
        return {
          lines: range.getClientRects().length,
          separated: labelRect.right <= markRect.left,
          markRight: markRect.right,
          centered:
            Math.abs(labelRect.top + labelRect.height / 2 - markRect.top - markRect.height / 2) < 1,
          fits: row.scrollWidth <= row.clientWidth,
          targetHeight: row.getBoundingClientRect().height,
          mark: mark.textContent,
          checked: row.getAttribute("aria-checked") === "true",
        };
      },
    );
    return {
      inViewport: rect.left >= 0 && rect.right <= window.innerWidth,
      fits: element.scrollWidth <= element.clientWidth,
      pageFits: document.documentElement.scrollWidth <= window.innerWidth,
      rows,
    };
  });
  expect(geometry.inViewport).toBe(true);
  expect(geometry.fits).toBe(true);
  expect(geometry.pageFits).toBe(true);
  expect(geometry.rows).toHaveLength(3);
  for (const row of geometry.rows) {
    expect(row.lines).toBe(1);
    expect(row.separated).toBe(true);
    expect(row.centered).toBe(true);
    expect(row.fits).toBe(true);
    expect(row.targetHeight).toBeGreaterThanOrEqual(44);
    expect(row.markRight).toBeCloseTo(geometry.rows[0]!.markRight, 1);
    expect(row.mark).toBe(row.checked ? "✓" : "");
  }
}

test("automatic project filter defaults on and persists without losing chats or profile scope", async ({
  page,
}, info) => {
  const marker = `filter-${randomUUID()}`;
  const seeded = runtime(
    "import pathlib,sys,json; from hermes_cli.web_server_sessions import _open_session_db_for_profile; marker=sys.argv[1]; root=pathlib.Path('/opt/data/workflow-tests')/marker; root.mkdir(parents=True); db=_open_session_db_for_profile('default',read_only=False); sid=marker+'-chat'; db.create_session(sid,'desktop',cwd=str(root)); db.set_session_title(sid,marker+' conversation'); db.append_message(sid,'user','Keep this automatic workspace conversation'); db.append_message(sid,'assistant','Automatic workspace history is preserved.'); db.close(); print(json.dumps({'path':str(root),'session':sid}))",
    marker,
  );
  const explicitName = `Explicit ${marker}`;
  const created = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "create",
    name: explicitName,
  });
  expect(created.status).toBe(200);
  const origin = new URL(page.url()).origin;
  const listURL = `${origin}/chathermes?profile=default#/projects?profile=default`;
  const tree = await api(page, "/api/plugins/chathermes/projects?profile=default");
  expect(tree.status).toBe(200);
  const automatic = tree.body.projects.find(
    (project: { id: string }) => project.id === seeded.path,
  );
  expect(automatic?.isAuto).toBe(true);
  await page.goto(listURL);
  const list = page.getByRole("navigation", { name: "Project list", exact: true });
  const automaticRow = list.getByRole("button", { name: automatic.label, exact: true });
  const explicitRow = list.getByRole("button", { name: explicitName, exact: true });
  const options = page.getByRole("button", { name: "Screen options", exact: true });
  const toggle = page.getByRole("menuitemcheckbox", {
    name: /^Hide automatic projects/,
  });
  await expect(explicitRow).toBeVisible();
  await expect(automaticRow).toHaveCount(0);
  await options.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await expectReadableMenu(page);
  await page.screenshot({ path: info.outputPath("projects-default-menu.png") });
  await toggle.click();
  await expect(automaticRow).toBeVisible();
  await expect(explicitRow).toBeVisible();
  await options.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await expectReadableMenu(page);
  await page.screenshot({ path: info.outputPath("projects-unchecked-menu.png") });
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(automaticRow).toBeVisible();
  await automaticRow.click();
  const project = page.getByRole("region", { name: "Selected Project", exact: true });
  await expect(project).toContainText(marker + " conversation");
  await page.goBack();
  await expect(automaticRow).toBeVisible();
  await options.click();
  await toggle.click();
  await expect(automaticRow).toHaveCount(0);
  await page.reload();
  await expect(explicitRow).toBeVisible();
  await expect(automaticRow).toHaveCount(0);
  await explicitRow.scrollIntoViewIfNeeded();
  await expect(explicitRow).toBeInViewport();
  await page.screenshot({ path: info.outputPath("projects-hidden.png") });

  // A hidden Project still resolves directly, with its original conversation.
  await page.goto(
    `${origin}/chathermes?profile=default#/projects/${encodeURIComponent(automatic.id)}?profile=default`,
  );
  await expect(project).toContainText(marker + " conversation");
  await project.getByRole("button", { name: marker + " conversation", exact: true }).click();
  await expect(page.locator(".message.assistant")).toContainText(
    "Automatic workspace history is preserved.",
  );
  const composer = page.getByRole("textbox", { name: "Message Hermes", exact: true });
  await composer.fill("Draft in a hidden automatic project");
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("hidden-project-conversation.png") });

  // The same browser preference applies to another profile without bringing its data along.
  await page.goto(`${origin}/chathermes?profile=beta#/projects?profile=beta`);
  await expect(page.locator(".projects-page")).toBeVisible();
  await expect(explicitRow).toHaveCount(0);
  await options.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await toggle.click();
  await page.goto(listURL);
  await expect(automaticRow).toBeVisible();
  await expect(explicitRow).toBeVisible();
  await page.screenshot({ path: info.outputPath("projects-shown.png") });
});

test("Projects menu fits a narrow mobile viewport and supports keyboard choices", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const origin = new URL(page.url()).origin;
  await page.goto(`${origin}/chathermes?profile=default#/projects?profile=default`);
  const options = page.getByRole("button", { name: "Screen options", exact: true });
  const toggle = page.getByRole("menuitemcheckbox", {
    name: "Hide automatic projects",
    exact: true,
  });
  await options.click();
  await expectReadableMenu(page);
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(options).toBeFocused();
  await expect(options).toHaveAttribute("aria-expanded", "false");
  await options.press("Enter");
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await expectReadableMenu(page);
  const archived = page.getByRole("menuitemradio", { name: "Archived projects", exact: true });
  await archived.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/archived=1/);
  await options.click();
  await expect(archived).toHaveAttribute("aria-checked", "true");
  await expectReadableMenu(page);
  await page.screenshot({ path: info.outputPath("projects-narrow-archived-menu.png") });
  await page.keyboard.press("Escape");
  await expect(options).toBeFocused();
  await expect(options).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("textbox", { name: "Message Hermes", exact: true })).toHaveCount(0);
});
