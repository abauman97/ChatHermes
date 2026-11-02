// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import KanbanPage from "./KanbanPage.vue";
import KanbanActions from "../KanbanActions.vue";
import { useKanban } from "../context";
import { useBoard } from "../useBoard";
import { api } from "../api";
vi.mock("../context", () => ({ useKanban: vi.fn() }));
vi.mock("../useBoard", () => ({ useBoard: vi.fn() }));
const columns = ["triage", "todo", "ready", "blocked", "done", "running"];
let wrapper: ReturnType<typeof mount>;
beforeEach(() => {
  localStorage.clear();
  vi.mocked(useKanban).mockReturnValue({
    visible: ref(true),
    screenActions: ref([]),
    check: vi.fn(),
  } as unknown as ReturnType<typeof useKanban>);
  vi.mocked(useBoard).mockReturnValue({
    snapshot: ref({ columns: columns.map((name) => ({ name, tasks: [] })), assignees: [] }),
    detail: ref(),
    log: ref(),
    taskId: ref(""),
    error: ref(""),
    loading: ref(false),
    refresh: vi.fn(),
  } as unknown as ReturnType<typeof useBoard>);
  vi.spyOn(api, "boards").mockResolvedValue({ boards: [{ slug: "default" }], current: "default" });
  vi.spyOn(api, "workflow").mockResolvedValue({
    columns: columns.map((key) => ({ key, label: key, drag_target: key !== "running" })),
    manual: {},
    archived: "archived",
  });
  vi.spyOn(api, "write").mockResolvedValue({ ok: true });
  wrapper = mount(
    defineComponent({
      components: { KanbanPage, KanbanActions },
      template: '<div><div role="menu"><KanbanActions /></div><KanbanPage /></div>',
    }),
    { attachTo: document.body },
  );
});
afterEach(() => {
  wrapper.unmount();
  vi.restoreAllMocks();
});
it("exposes board actions in the screen menu and a creation button in every lane", async () => {
  await flushPromises();
  expect(wrapper.findAll(".kanban-toolbar button")).toHaveLength(0);
  expect(wrapper.findAll(".kanban-column .kanban-new-task")).toHaveLength(columns.length);
  const menu = wrapper.get('[role="menu"]');
  expect(menu.text()).toContain("Refresh");
  await menu
    .findAll("button")
    .find((b) => b.text() === "New board")!
    .trigger("click");
  expect(wrapper.find('[aria-label="Board slug"]').exists()).toBe(true);
  await menu.get('[role="menuitemcheckbox"]').trigger("click");
  expect(menu.get('[role="menuitemcheckbox"]').attributes("aria-checked")).toBe("true");
  expect(wrapper.get('[data-status="running"]').attributes("disabled")).toBeDefined();
  wrapper.unmount();
  expect(useKanban().screenActions.value).toEqual([]);
});
it.each(["triage", "todo", "ready", "blocked", "done"])(
  "creates in the %s lane through the supported API",
  async (status) => {
    await flushPromises();
    vi.mocked(api.write).mockImplementation(async (path) =>
      path === "/tasks"
        ? { task: { id: "new-task", status: status === "triage" ? "triage" : "ready" } }
        : { ok: true },
    );
    await wrapper.get(`[data-status="${status}"]`).trigger("click");
    const title = wrapper.get('[aria-label="Task title"]');
    expect(document.activeElement).toBe(title.element);
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
    await title.setValue("Lane task");
    if (status === "done")
      await wrapper.get('[aria-label="Task completion summary"]').setValue("Completed work");
    await wrapper.get(".kanban-column form").trigger("submit");
    await flushPromises();
    expect(api.write).toHaveBeenCalledWith(
      "/tasks",
      "POST",
      expect.objectContaining({ title: "Lane task", triage: status === "triage" }),
      "default",
    );
    if (!["triage", "ready"].includes(status))
      expect(api.write).toHaveBeenCalledWith(
        "/tasks/new-task",
        "PATCH",
        { status, ...(status === "done" ? { summary: "Completed work" } : {}) },
        "default",
      );
    expect(wrapper.find(".kanban-column form").exists()).toBe(false);
    expect(document.activeElement).toBe(wrapper.get(`[data-status="${status}"]`).element);
  },
);
