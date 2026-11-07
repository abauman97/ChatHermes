import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";

test("Projects header follows selection, edits, navigation and history", async ({ page }, info) => {
  const marker = randomUUID();
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    marker,
  );
  const name = `Header ${marker}`;
  const created = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "create",
    name,
    primary_path: workspace,
  });
  expect(created.status).toBe(200);
  const plugin = page.locator(".chathermes-embedded");
  const title = plugin.locator(".header-title");
  const subtitle = plugin.locator(".header-project-subtitle");
  const options = plugin.getByRole("button", { name: "Screen options", exact: true });
  const list = plugin.getByRole("navigation", { name: "Project list", exact: true });
  const expectHeader = async (label?: string) => {
    await expect(title).toHaveText("Projects");
    if (label) await expect(subtitle).toHaveText(label);
    else await expect(subtitle).toHaveCount(0);
    await expect(plugin.getByRole("button", { name: "← Projects", exact: true })).toHaveCount(0);
    await expect(title).toBeInViewport();
    expect(await plugin.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  };
  await page.goto(
    `${new URL(page.url()).origin}/chathermes?profile=default#/projects?profile=default`,
  );
  await expect(list).toBeVisible();
  await expectHeader();
  await page.screenshot({ path: info.outputPath("projects-list-header.png") });
  await list.getByRole("button", { name, exact: true }).click();
  await expectHeader(name);
  const projectURL = page.url();
  const composer = plugin.getByRole("textbox", { name: "Message Hermes", exact: true });
  await composer.fill("Project header draft");
  await expect(composer).toBeFocused();
  await page.screenshot({ path: info.outputPath("selected-project-header.png") });
  await plugin.getByRole("button", { name: "Artifacts", exact: true }).click();
  await expect(plugin.getByRole("region", { name: "Artifacts", exact: true })).toBeVisible();
  await expectHeader(name);
  await options.click();
  await plugin.getByRole("menuitem", { name: "Edit project", exact: true }).click();
  const renamed = `${name} renamed`;
  await plugin.getByRole("textbox", { name: "Project name", exact: true }).fill(renamed);
  await plugin.getByRole("button", { name: "Save changes", exact: true }).click();
  await expectHeader(renamed);
  await page.screenshot({ path: info.outputPath("renamed-project-header.png") });
  // The editor's own return navigation stays available.
  await plugin.getByRole("button", { name: `← ${renamed}`, exact: true }).click();
  await expect(page).toHaveURL(projectURL);
  await expectHeader(renamed);
  await composer.fill("Returned project draft");
  await expect(composer).toBeFocused();
  await options.click();
  await plugin.getByRole("menuitem", { name: "Edit Instructions", exact: true }).click();
  await expect(
    plugin.getByRole("region", { name: "Edit Instructions", exact: true }),
  ).toBeVisible();
  await expectHeader(renamed);
  await page.reload();
  await expectHeader(renamed);
  await plugin.getByRole("button", { name: `← ${renamed}`, exact: true }).click();
  await expect(page).toHaveURL(projectURL);
  await expectHeader(renamed);
  const openNavigation = plugin.getByRole("button", { name: "Open navigation", exact: true });
  if (await openNavigation.isVisible()) await openNavigation.click();
  await plugin.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(list).toBeVisible();
  await expectHeader();
  await page.goBack();
  await expectHeader(renamed);
  await expect(plugin.getByRole("button", { name: "Other chats", exact: true })).toBeVisible();
  await page.goForward();
  await expect(list).toBeVisible();
  await expectHeader();
  await options.click();
  await plugin.getByRole("menuitemradio", { name: "Archived projects", exact: true }).click();
  await expect(page).toHaveURL(/archived=1/);
  await expectHeader();
  await page.reload();
  await expect(plugin.getByRole("region", { name: "Projects", exact: true })).toBeVisible();
  await expect(plugin.locator(".projects-page")).toContainText("Archived projects");
  await expectHeader();
  await page.screenshot({ path: info.outputPath("archived-projects-header.png") });

  // Seed an archived item, then exercise the real list → project → sidebar path.
  const archived = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "archive",
    id: created.body.project.id,
  });
  expect(archived.status).toBe(200);
  await page.reload();
  for (const view of ["home", "artifacts", "settings", "instructions"]) {
    await list.getByRole("button", { name: renamed, exact: true }).click();
    await expectHeader(renamed);
    if (view === "artifacts")
      await plugin.getByRole("button", { name: "Artifacts", exact: true }).click();
    if (view === "settings" || view === "instructions") {
      await options.click();
      await plugin
        .getByRole("menuitem", {
          name: view === "settings" ? "Edit project" : "Edit Instructions",
          exact: true,
        })
        .click();
    }
    // Reload proves the destination comes from backend state, not browser history.
    await page.reload();
    await expectHeader(renamed);
    if (view === "home") {
      await composer.fill("Archived project draft");
      await expect(composer).toBeFocused();
      await page.screenshot({ path: info.outputPath("opened-archived-project.png") });
    }
    if (await openNavigation.isVisible()) await openNavigation.click();
    await plugin.getByRole("link", { name: "Projects", exact: true }).click();
    if (await openNavigation.isVisible())
      await expect(
        plugin.getByRole("complementary", { name: "Navigation", exact: true }),
      ).not.toBeInViewport();
    await expect(page).toHaveURL(/#\/projects\?profile=default&archived=1$/);
    await expect(list.getByRole("button", { name: renamed, exact: true })).toBeVisible();
    await expectHeader();
  }
  await page.screenshot({ path: info.outputPath("returned-archived-projects.png") });
  await options.click();
  await expect(
    plugin.getByRole("menuitemradio", { name: "Archived projects", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await plugin.getByRole("menuitemradio", { name: "Active projects", exact: true }).click();
  await expect(page).not.toHaveURL(/archived=1/);
  await expect(list.getByRole("button", { name: renamed, exact: true })).toHaveCount(0);
});

test("Archived Projects sidebar works before project details arrive", async ({ page }, info) => {
  const marker = randomUUID();
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    marker,
  );
  const name = `Pending archive ${marker}`;
  const created = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "create",
    name,
    primary_path: workspace,
  });
  expect(created.status).toBe(200);
  expect(
    (
      await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
        action: "archive",
        id: created.body.project.id,
      })
    ).status,
  ).toBe(200);
  const plugin = page.locator(".chathermes-embedded");
  const list = plugin.getByRole("navigation", { name: "Project list", exact: true });
  await page.goto(
    `${new URL(page.url()).origin}/chathermes?profile=default#/projects?profile=default&archived=1`,
  );
  await expect(list.getByRole("button", { name, exact: true })).toBeVisible();
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  let started!: () => void;
  const requested = new Promise<void>((resolve) => {
    started = resolve;
  });
  // Delay the real authenticated detail request; keep the real catalog and response.
  await page.route("**/api/plugins/chathermes/projects/detail?**", async (route) => {
    started();
    await pending;
    await route.continue();
  });
  try {
    await list.getByRole("button", { name, exact: true }).click();
    await requested;
    await expect(plugin.locator(".header-project-subtitle")).toHaveCount(0);
    const openNavigation = plugin.getByRole("button", { name: "Open navigation", exact: true });
    if (await openNavigation.isVisible()) await openNavigation.click();
    const link = plugin.getByRole("link", { name: "Projects", exact: true });
    await expect(link).toHaveAttribute("href", /archived=1/);
    if (await openNavigation.isVisible())
      await expect
        .poll(
          async () =>
            (
              await plugin
                .getByRole("complementary", { name: "Navigation", exact: true })
                .boundingBox()
            )?.x,
        )
        .toBe(0);
    await page.screenshot({ path: info.outputPath("pending-archived-project.png") });
    await link.click();
    await expect(page).toHaveURL(/#\/projects\?profile=default&archived=1$/);
    await expect(list.getByRole("button", { name, exact: true })).toBeVisible();
    if (await openNavigation.isVisible())
      await expect(
        plugin.getByRole("complementary", { name: "Navigation", exact: true }),
      ).not.toBeInViewport();
    await page.screenshot({ path: info.outputPath("pending-return-archived-projects.png") });
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
  await expect(plugin.locator(".header-project-subtitle")).toHaveCount(0);
});
