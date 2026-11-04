// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import { createChatHermesRouter } from "../../../router";
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
    { attachTo: document.body, global: { plugins: [createChatHermesRouter()] } },
  );
});
afterEach(() => {
  wrapper.unmount();
  vi.restoreAllMocks();
});
it("exposes board actions in the screen menu and one creation button beside the selector", async () => {
  await flushPromises();
  expect(wrapper.findAll(".kanban-toolbar .kanban-new-task")).toHaveLength(1);
  expect(wrapper.findAll(".kanban-column .kanban-new-task")).toHaveLength(0);
  const menu = wrapper.get('[role="menu"]');
  expect(menu.text()).toContain("Refresh");
  await menu
    .findAll("button")
    .find((b) => b.text() === "New board")!
    .trigger("click");
  expect(wrapper.find('[aria-label="Board slug"]').exists()).toBe(true);
  await menu.get('[role="menuitemcheckbox"]').trigger("click");
  expect(menu.get('[role="menuitemcheckbox"]').attributes("aria-checked")).toBe("true");
  wrapper.unmount();
  expect(useKanban().screenActions.value).toEqual([]);
});
it.each([true, false])("creates through the supported API with triage=%s", async (triage) => {
  await flushPromises();
  vi.mocked(api.write).mockResolvedValue({
    task: { id: "new-task", status: triage ? "triage" : "todo" },
  });
  await wrapper.get(".kanban-new-task").trigger("click");
  const title = wrapper.get('[aria-label="Task title"]');
  expect(document.activeElement).toBe(title.element);
  await title.setValue("Board task");
  await wrapper.get('input[type="checkbox"]').setValue(triage);
  await wrapper.get(".kanban-form").trigger("submit");
  await flushPromises();
  expect(api.write).toHaveBeenCalledWith(
    "/tasks",
    "POST",
    expect.objectContaining({ title: "Board task", triage }),
    "default",
  );
  expect(vi.mocked(api.write).mock.calls.filter(([, method]) => method === "PATCH")).toHaveLength(
    0,
  );
  expect(wrapper.find(".kanban-form").exists()).toBe(false);
  expect(document.activeElement).toBe(wrapper.get(".kanban-new-task").element);
});
