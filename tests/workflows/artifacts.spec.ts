import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api, runtime } from "./helpers";

test("indexed artifact pages preserve project scope, file actions and responsive layout", async ({
  page,
}, info) => {
  const marker = `artifacts-${randomUUID()}`;
  const workspace = runtime(
    "import pathlib,sys,json; p=pathlib.Path('/opt/data/workflow-tests')/sys.argv[1]; p.mkdir(parents=True); print(json.dumps(str(p)))",
    marker,
  );
  const created = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "create",
    name: marker,
    primary_path: workspace,
  });
  expect(created.status).toBe(200);
  const project = created.body.project.id;
  const identity = runtime(
    "import pathlib,sys,json; from hermes_cli.web_server_sessions import _open_session_db_for_profile; p=pathlib.Path(sys.argv[1]); db=_open_session_db_for_profile('default',read_only=False); sid=sys.argv[2]; db.create_session(sid,'api',cwd=str(p)); db.set_session_title(sid,sid); files=[p/('artifact-%02d.txt'%i) for i in range(55)]; [f.write_text('Indexed artifact content') for f in files]; db.append_message(sid,'user','Create explicit artifacts'); db.append_message(sid,'assistant','\\n'.join('MEDIA:'+str(f) for f in files)); db.close(); print(json.dumps(sid))",
    workspace,
    marker,
  );
  // An authenticated upload wakes reconciliation just as a real upload does.
  expect(
    (
      await api(page, "/api/plugins/chathermes/uploads?profile=default", {
        name: "wake.txt",
        data: "data:text/plain;base64,d2FrZQ==",
      })
    ).status,
  ).toBe(201);
  const root = `/api/plugins/chathermes/artifacts?profile=default&project_id=${encodeURIComponent(project)}`;
  await expect.poll(async () => (await api(page, root)).body.files?.length).toBe(50);
  const requests: string[] = [];
  page.on("request", (request) => {
    requests.push(new URL(request.url()).pathname);
  });
  const origin = new URL(page.url()).origin;
  await page.goto(
    `${origin}/chathermes?profile=default#/projects/${encodeURIComponent(project)}/artifacts?profile=default`,
  );
  const library = page.getByRole("region", { name: "Artifacts", exact: true });
  const cards = library.locator(".artifact-card");
  await expect(cards).toHaveCount(50);
  expect(requests.filter((path) => /\/sessions\/[^/]+\/messages$/.test(path))).toEqual([]);
  await page.screenshot({ path: info.outputPath("artifact-first-page.png") });
  await library.getByRole("button", { name: "Load More", exact: true }).click();
  await expect(cards).toHaveCount(55);
  await expect(library.getByRole("button", { name: "Load More", exact: true })).toHaveCount(0);
  const dimensions = await cards.evaluateAll((elements) =>
    elements.slice(0, 5).map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, width: rect.width };
    }),
  );
  expect(dimensions.every((rect) => rect.width > 200 && rect.width < 500)).toBe(true);
  if (info.project.name === "mobile")
    expect(new Set(dimensions.map((rect) => rect.left)).size).toBe(1);
  else expect(new Set(dimensions.map((rect) => rect.left)).size).toBeGreaterThan(1);
  await page.screenshot({ path: info.outputPath("artifact-grid.png") });
  const selected = cards.filter({ hasText: "artifact-54.txt" });
  await selected.getByRole("button", { name: "Preview artifact-54.txt", exact: true }).click();
  const preview = page.locator("dialog[open]");
  await expect(preview.locator("pre")).toHaveText("Indexed artifact content");
  await preview.getByRole("button", { name: "Close preview", exact: true }).click();
  const href = await selected
    .getByRole("link", { name: "Download artifact-54.txt", exact: true })
    .getAttribute("href");
  expect(await page.evaluate(async (url) => (await fetch(url!)).text(), href)).toBe(
    "Indexed artifact content",
  );
  await selected.getByRole("button", { name: "Delete artifact-54.txt", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Delete artifact" });
  await expect(confirmation).toBeVisible();
  // Another dashboard operation may refresh the same workspace while a local
  // action is open. Its metadata must not reset pagination or dismiss the action.
  const refreshedName = `${marker} refreshed`;
  const updated = await api(page, "/api/plugins/chathermes/projects/manage?profile=default", {
    action: "update",
    id: project,
    name: refreshedName,
  });
  expect(updated.status).toBe(200);
  await expect(page.locator(".header-title")).toHaveText(refreshedName);
  await expect(confirmation).toBeVisible();
  await expect(cards).toHaveCount(55);
  const deletionResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "DELETE" &&
      new URL(response.url()).pathname === "/api/plugins/chathermes/files",
  );
  await page
    .getByRole("dialog", { name: "Delete artifact" })
    .getByRole("button", { name: "Delete file", exact: true })
    .click();
  const deleted = await deletionResponse;
  expect(deleted.status(), await deleted.text()).toBe(200);
  expect(await deleted.json()).toEqual({ ok: true });
  await expect(confirmation).not.toBeVisible();
  await expect(cards).toHaveCount(54);
  expect(
    runtime(
      "import pathlib,sys,json; print(json.dumps((pathlib.Path(sys.argv[1])/'artifact-54.txt').exists()))",
      workspace,
    ),
  ).toBe(false);
  const indexed = await api(page, `${root}&limit=100`);
  expect(indexed.status).toBe(200);
  expect(indexed.body.files).toHaveLength(54);
  expect(
    indexed.body.files.some((file: { path: string }) => file.path.endsWith("/artifact-54.txt")),
  ).toBe(false);
  await page.screenshot({ path: info.outputPath("artifact-deleted.png") });
  await library.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(cards).toHaveCount(50);
  await library.getByRole("button", { name: "Load More", exact: true }).click();
  await expect(cards).toHaveCount(54);
  await expect(cards.filter({ hasText: "artifact-54.txt" })).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("artifact-refreshed.png") });
  await cards.first().getByRole("button", { name: identity, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(identity));
  await expect(page.getByRole("textbox", { name: "Message Hermes" })).toBeEnabled();
});
