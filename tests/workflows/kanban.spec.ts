import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures";
import { api } from "./helpers";

test("Kanban opt-in, board isolation, task operations and upstream synchronization", async ({
  page,
}, info) => {
  const eventTasks = new Set<string>();
  page.on("websocket", (socket) => {
    if (!socket.url().includes("/api/plugins/kanban/events")) return;
    socket.on("framereceived", (frame) => {
      try {
        const data = JSON.parse(String(frame.payload));
        for (const event of data.events || [])
          if (typeof event.task_id === "string") eventTasks.add(event.task_id);
      } catch {
        /* Ignore protocol noise. */
      }
    });
  });
  const shell = page.locator(".chathermes-embedded");
  const nav = async () => {
    const open = shell.getByRole("button", { name: "Open navigation", exact: true });
    if (await open.isVisible()) await open.click();
  };
  await expect(shell.locator(".kanban-nav")).toHaveCount(0);
  const initial = await api(page, "/api/plugins/kanban/boards");
  expect(initial.status).toBe(200);
  const current = initial.body.current;
  await nav();
  await shell.getByRole("button", { name: "Settings", exact: true }).click();
  const toggle = shell.getByRole("checkbox", { name: "Kanban Viewer", exact: true });
  await expect(
    shell
      .locator(".settings-group")
      .filter({ has: page.getByRole("checkbox", { name: "Kanban Viewer", exact: true }) }),
  ).toContainText("Keep Screen Awake");
  await expect(toggle).not.toBeChecked();
  await expect(toggle).toBeEnabled();
  await toggle.check();
  await page.screenshot({ animations: "disabled", path: info.outputPath("kanban-settings.png") });
  await nav();
  await shell.locator(".kanban-nav").click();
  const viewer = shell.getByRole("region", { name: "Kanban viewer", exact: true });
  const marker = "kanban-" + randomUUID().slice(0, 8);
  const menu = shell.getByRole("menu", { name: "Screen options", exact: true });
  const openMenu = async () => {
    await shell.getByRole("button", { name: "Screen options", exact: true }).click();
  };
  await expect(viewer.locator(".kanban-toolbar").getByRole("button")).toHaveCount(0);
  await openMenu();
  await page.screenshot({ animations: "disabled", path: info.outputPath("kanban-menu.png") });
  await menu.getByRole("menuitem", { name: "Refresh", exact: true }).click();
  await expect(menu).toBeHidden();
  await openMenu();
  await menu.getByRole("menuitem", { name: "Board settings", exact: true }).click();
  await expect(viewer.getByRole("textbox", { name: "Board name", exact: true })).toBeVisible();
  await viewer.getByRole("button", { name: "Cancel", exact: true }).click();
  await openMenu();
  await menu.getByRole("menuitem", { name: "New board", exact: true }).click();
  await viewer.getByRole("textbox", { name: "Board slug", exact: true }).fill(marker);
  await viewer
    .getByRole("textbox", { name: "Board name", exact: true })
    .fill("Integration board " + marker);
  await viewer.getByRole("button", { name: "Save board", exact: true }).click();
  await expect(viewer.getByRole("button", { name: "Save board", exact: true })).toHaveCount(0);
  await viewer.getByRole("combobox", { name: "Kanban board", exact: true }).selectOption(marker);
  await expect(viewer.getByRole("region", { name: "todo tasks", exact: true })).toBeVisible();
  const triageLane = viewer.getByRole("region", { name: "triage tasks", exact: true });
  const todoLane = viewer.getByRole("region", { name: "todo tasks", exact: true });
  await expect(viewer.locator(".kanban-column")).toHaveCount(
    await viewer.getByRole("button", { name: "New task", exact: true }).count(),
  );
  await todoLane.getByRole("button", { name: "New task", exact: true }).click();
  await expect(todoLane.getByRole("textbox", { name: "Task title", exact: true })).toBeFocused();
  await todoLane.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(todoLane.getByRole("button", { name: "New task", exact: true })).toBeFocused();
  for (const status of ["blocked", "done"]) {
    const lane = viewer.getByRole("region", { name: status + " tasks", exact: true });
    await lane.getByRole("button", { name: "New task", exact: true }).click();
    await lane
      .getByRole("textbox", { name: "Task title", exact: true })
      .fill(status + " task " + marker);
    if (status === "done")
      await lane
        .getByRole("textbox", { name: "Task completion summary", exact: true })
        .fill("Completed before adding to this board.");
    await lane.getByRole("button", { name: "Create task", exact: true }).click();
    await expect(
      lane.locator(".kanban-card").filter({ hasText: status + " task " + marker }),
    ).toBeVisible();
  }
  await triageLane.getByRole("button", { name: "New task", exact: true }).click();
  await expect(triageLane.getByRole("textbox", { name: "Task title", exact: true })).toBeFocused();
  await expect(viewer.getByRole("checkbox", { name: "Start in triage", exact: true })).toHaveCount(
    0,
  );
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("kanban-lane-create.png"),
  });
  await viewer
    .getByRole("textbox", { name: "Task title", exact: true })
    .fill("First task " + marker);
  await viewer
    .getByRole("textbox", { name: "Task description", exact: true })
    .fill("A deterministic Kanban task.");
  await viewer.getByRole("button", { name: "Create task", exact: true }).click();
  const card = viewer.locator(".kanban-card").filter({ hasText: "First task " + marker });
  await expect(card).toBeVisible();
  await expect(triageLane.getByRole("button", { name: "New task", exact: true })).toBeEnabled();
  await expect(
    triageLane.locator(".kanban-card").filter({ hasText: "First task " + marker }),
  ).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ animations: "disabled", path: info.outputPath("kanban-board.png") });
  if (info.project.name === "desktop") {
    const ready = viewer.getByRole("region", { name: "ready tasks", exact: true });
    await card.dragTo(ready);
    await expect(
      ready.locator(".kanban-card").filter({ hasText: "First task " + marker }),
    ).toBeVisible();
    // Hermes promotes dependency-free Todo tasks on dispatch; Triage stays put.
    const triage = viewer.getByRole("region", { name: "triage tasks", exact: true });
    await card.dragTo(triage);
    await expect(
      triage.locator(".kanban-card").filter({ hasText: "First task " + marker }),
    ).toBeVisible();
  }
  await card.click();
  const detail = viewer.getByRole("region", { name: "Task details", exact: true });
  await expect(detail.getByRole("heading", { name: "First task " + marker })).toBeVisible();
  await expect(detail.getByRole("heading", { name: "First task " + marker })).toBeFocused();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("kanban-task-heading.png"),
  });
  await detail.getByRole("button", { name: "Edit task", exact: true }).click();
  await detail
    .getByRole("textbox", { name: "Task title", exact: true })
    .fill("Updated task " + marker);
  await detail.getByRole("button", { name: "Save task", exact: true }).click();
  await expect(detail.getByRole("heading", { name: "Updated task " + marker })).toBeVisible();
  await detail.getByRole("combobox", { name: "Move task", exact: true }).selectOption("triage");
  await expect(detail.getByRole("combobox", { name: "Move task", exact: true })).toHaveValue(
    "triage",
  );
  await detail
    .getByRole("textbox", { name: "New task comment", exact: true })
    .fill("Integration comment");
  await detail.getByRole("button", { name: "Add comment", exact: true }).click();
  await expect(detail.locator(".kanban-comment")).toContainText(["Integration comment"]);
  await expect(detail.getByRole("textbox", { name: "New task comment", exact: true })).toHaveValue(
    "",
  );
  // File selection can be forced by Playwright even while a native input is disabled.
  await expect(detail.getByLabel("Task attachment", { exact: true })).toBeEnabled();
  await detail.getByLabel("Task attachment", { exact: true }).setInputFiles({
    name: "kanban-note.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Kanban attachment fixture"),
  });
  await expect(detail.getByRole("link", { name: "kanban-note.txt", exact: true })).toBeVisible();
  const download = await page.request.get(
    (await detail
      .getByRole("link", { name: "kanban-note.txt", exact: true })
      .getAttribute("href")) || "",
  );
  expect(await download.text()).toBe("Kanban attachment fixture");
  await expect(detail.getByLabel("Task attachment", { exact: true })).toBeEnabled();
  await detail.getByText("Run history (0)", { exact: true }).click();
  await expect(detail.getByText("No runs yet.", { exact: true })).toBeVisible();
  await detail.getByText("Worker log", { exact: true }).click();
  await expect(detail.getByText("No worker log yet.", { exact: true })).toBeVisible();
  await page.screenshot({ animations: "disabled", path: info.outputPath("kanban-task.png") });
  await detail
    .getByRole("button", { name: "Remove attachment kanban-note.txt", exact: true })
    .click();
  await expect(detail.getByRole("link", { name: "kanban-note.txt", exact: true })).toHaveCount(0);
  await detail.getByRole("button", { name: "Close task details", exact: true }).click();
  await expect(
    viewer.locator(".kanban-card").filter({ hasText: "Updated task " + marker }),
  ).toBeFocused();
  // A second client uses the real authenticated upstream API; no route mocks.
  const external = await api(page, "/api/plugins/kanban/tasks?board=" + marker, {
    title: "External task " + marker,
  });
  expect(external.status).toBe(200);
  await expect.poll(() => eventTasks.has(external.body.task.id)).toBe(true);
  await expect(
    viewer.locator(".kanban-card").filter({ hasText: "External task " + marker }),
  ).toBeVisible();
  const boards = await api(page, "/api/plugins/kanban/boards");
  expect(boards.body.current).toBe(current); // UI selection never switches CLI/global current.
  const other = boards.body.boards.find((b: { slug: string }) => b.slug !== marker)?.slug;
  expect(other).toBeTruthy();
  await viewer.getByRole("combobox", { name: "Kanban board", exact: true }).selectOption(other);
  await expect(viewer.locator(".kanban-card").filter({ hasText: marker })).toHaveCount(0);
  await viewer.getByRole("combobox", { name: "Kanban board", exact: true }).selectOption(marker);
  await viewer
    .locator(".kanban-card")
    .filter({ hasText: "Updated task " + marker })
    .click();
  await detail.getByRole("button", { name: "Archive task", exact: true }).click();
  await expect(detail.getByRole("combobox", { name: "Move task", exact: true })).toHaveValue(
    "archived",
  );
  await detail.getByRole("button", { name: "Close task details", exact: true }).click();
  await expect(
    viewer.locator(".kanban-card").filter({ hasText: "Updated task " + marker }),
  ).toHaveCount(0);
  await openMenu();
  await menu.getByRole("menuitemcheckbox", { name: "Show archived tasks", exact: true }).click();
  await viewer
    .locator(".kanban-card")
    .filter({ hasText: "Updated task " + marker })
    .click();
  await detail.getByText("Delete task", { exact: true }).click();
  await detail.getByRole("button", { name: "Delete task…", exact: true }).click();
  await detail.getByRole("button", { name: "Confirm delete task", exact: true }).click();
  await expect(detail).toHaveCount(0);
  await expect(
    viewer.locator(".kanban-card").filter({ hasText: "Updated task " + marker }),
  ).toHaveCount(0);
  await nav();
  await shell.getByRole("button", { name: "Settings", exact: true }).click();
  await toggle.uncheck();
  await expect(shell.locator(".kanban-nav")).toHaveCount(0);
  await page.reload();
  await expect(toggle).not.toBeChecked();
});
