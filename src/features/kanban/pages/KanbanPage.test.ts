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
    enabled: ref(true),
    checking: ref(false),
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
    manual: { ready: ["done", "blocked"] },
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

async function completionSetup() {
  await flushPromises();
  const state = vi.mocked(useBoard).mock.results[0]!.value as ReturnType<typeof useBoard>;
  const task = { id: "ap/1", title: "AP reconciliation", status: "ready" };
  state.snapshot.value!.columns[2]!.tasks = [task, { ...task, id: "other", title: "Other" }];
  state.detail.value = {
    task,
    comments: [],
    events: [],
    runs: [],
    links: { parents: [], children: [] },
  };
  state.taskId.value = task.id;
  vi.mocked(api.boards).mockResolvedValue({
    boards: [{ slug: "default" }, { slug: "second" }],
    current: "default",
  });
  await wrapper
    .get('[role="menu"]')
    .findAll("button")
    .find((b) => b.text() === "Refresh")!
    .trigger("click");
  await flushPromises();
  return state;
}
async function requestCompletion(via: string) {
  if (via === "details") await wrapper.get('[aria-label="Move task"]').setValue("done");
  else
    await wrapper.get('[aria-label="done tasks"]').trigger("drop", {
      dataTransfer: { getData: () => JSON.stringify({ board: "default", id: "ap/1" }) },
    });
}
it.each(["details", "drop"])(
  "requests user evidence via %s and sends trimmed summary with the captured identity",
  async (via) => {
    await completionSetup();
    await requestCompletion(via);
    const input = wrapper.get('[aria-label="Completion summary"]');
    expect(document.activeElement).toBe(input.element);
    expect((wrapper.get('[aria-label="Move task"]').element as HTMLSelectElement).value).toBe(
      "ready",
    );
    expect(api.write).not.toHaveBeenCalled();
    await input.setValue("  Reconciled AP invoices against the ledger. \n");
    await wrapper.get('[aria-label="Complete task"]').trigger("submit");
    await flushPromises();
    expect(api.write).toHaveBeenCalledWith(
      "/tasks/ap%2F1",
      "PATCH",
      { status: "done", summary: "Reconciled AP invoices against the ledger." },
      "default",
    );
    expect(api.write).toHaveBeenCalledWith("/dispatch", "POST", {}, "default");
    expect(wrapper.find('[aria-label="Complete task"]').exists()).toBe(false);
  },
);
it.each(["details", "drop"])(
  "rejects blank evidence and cancels without writes via %s",
  async (via) => {
    await completionSetup();
    await requestCompletion(via);
    await wrapper.get('[aria-label="Completion summary"]').setValue(" \n\t ");
    const form = wrapper.get('[aria-label="Complete task"]');
    expect(form.get("button").attributes("disabled")).toBeDefined();
    await form.trigger("submit");
    expect(api.write).not.toHaveBeenCalled();
    await form.findAll("button")[1]!.trigger("click");
    expect(wrapper.find('[aria-label="Complete task"]').exists()).toBe(false);
    expect(api.write).not.toHaveBeenCalled();
    await flushPromises();
    expect(document.activeElement).toBe(
      wrapper.get(via === "details" ? '[aria-label="Move task"]' : '[data-task-id="ap/1"]').element,
    );
  },
);
it.each(["board", "task", "disable"])(
  "discards pending completion when switching %s",
  async (scope) => {
    const state = await completionSetup();
    await requestCompletion("details");
    await wrapper.get('[aria-label="Completion summary"]').setValue("Completed reconciliation");
    if (scope === "board") {
      await wrapper
        .get('[role="menu"]')
        .findAll("button")
        .find((b) => b.text() === "Refresh")!
        .trigger("click");
      await flushPromises();
      await wrapper.get('[aria-label="Kanban board"]').setValue("second");
    } else if (scope === "task") state.taskId.value = "other";
    else (useKanban().visible as { value: boolean }).value = false;
    await flushPromises();
    expect(wrapper.find('[aria-label="Complete task"]').exists()).toBe(false);
    expect(api.write).not.toHaveBeenCalled();
  },
);
it("does not apply an old completion callback to another board or leak upstream errors", async () => {
  await completionSetup();
  let reject!: (reason: Error) => void;
  vi.mocked(api.write).mockImplementationOnce(
    () =>
      new Promise((_, r) => {
        reject = r;
      }),
  );
  await requestCompletion("details");
  await wrapper.get('[aria-label="Completion summary"]').setValue("Completed reconciliation");
  await wrapper.get('[aria-label="Complete task"]').trigger("submit");
  await wrapper.get('[aria-label="Kanban board"]').setValue("second");
  reject(new Error("private upstream diagnostics"));
  await flushPromises();
  expect(wrapper.text()).not.toContain("private upstream diagnostics");
  expect(wrapper.find('[role="alert"]').exists()).toBe(false);
});
it("keeps failed evidence editable and shows only a safe error", async () => {
  await completionSetup();
  let reject!: (reason: Error) => void;
  vi.mocked(api.write).mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  await requestCompletion("details");
  await wrapper.get('[aria-label="Completion summary"]').setValue("Completed reconciliation");
  await wrapper.get('[aria-label="Complete task"]').trigger("submit");
  await flushPromises();
  expect(wrapper.get('[aria-label="Completion summary"]').attributes("disabled")).toBeDefined();
  reject(new Error("private upstream diagnostics"));
  await flushPromises();
  expect(wrapper.get('[aria-label="Completion summary"]').attributes("disabled")).toBeUndefined();
  expect(wrapper.get('[role="alert"]').text()).toContain("Kanban operation failed");
  expect(wrapper.text()).not.toContain("private upstream diagnostics");
  expect(
    (wrapper.get('[aria-label="Completion summary"]').element as HTMLTextAreaElement).value,
  ).toBe("Completed reconciliation");
});
it.each(["details", "drop"])("moves without a summary for non-completion via %s", async (via) => {
  await completionSetup();
  if (via === "details") await wrapper.get('[aria-label="Move task"]').setValue("blocked");
  else
    await wrapper.get('[aria-label="blocked tasks"]').trigger("drop", {
      dataTransfer: { getData: () => JSON.stringify({ board: "default", id: "ap/1" }) },
    });
  await flushPromises();
  expect(api.write).toHaveBeenCalledWith(
    "/tasks/ap%2F1",
    "PATCH",
    { status: "blocked" },
    "default",
  );
  expect(wrapper.find('[aria-label="Complete task"]').exists()).toBe(false);
});

it("keeps dispatch on the completed board when a successful write finishes after switching", async () => {
  await completionSetup();
  let resolve!: (value: { ok: boolean }) => void;
  vi.mocked(api.write).mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  await requestCompletion("drop");
  await wrapper.get('[aria-label="Completion summary"]').setValue("Verified ledger totals");
  await wrapper.get('[aria-label="Complete task"]').trigger("submit");
  await wrapper.get('[aria-label="Kanban board"]').setValue("second");
  resolve({ ok: true });
  await flushPromises();
  expect(api.write).toHaveBeenCalledWith("/dispatch", "POST", {}, "default");
  expect(api.write).not.toHaveBeenCalledWith("/dispatch", "POST", {}, "second");
  expect(wrapper.get('[aria-label="Kanban board"]').element).toHaveProperty("value", "second");
});
it("cancels completion with Escape and ignores drags from another board", async () => {
  await completionSetup();
  await wrapper.get('[aria-label="done tasks"]').trigger("drop", {
    dataTransfer: { getData: () => JSON.stringify({ board: "second", id: "ap/1" }) },
  });
  expect(wrapper.find('[aria-label="Complete task"]').exists()).toBe(false);
  await requestCompletion("details");
  await wrapper.get('[aria-label="Completion summary"]').trigger("keydown", { key: "Escape" });
  expect(wrapper.find('[aria-label="Complete task"]').exists()).toBe(false);
  expect(api.write).not.toHaveBeenCalled();
});

it("uses the displayed task state when board polling still shows its prior status", async () => {
  const state = await completionSetup();
  state.snapshot.value!.columns[2]!.tasks[0] = {
    id: "ap/1",
    title: "AP reconciliation",
    status: "triage",
  };
  await requestCompletion("details");
  expect(wrapper.get('[aria-label="Complete task"]').text()).toContain("AP reconciliation");
  expect(api.write).not.toHaveBeenCalled();
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

it.each(["details", "drop"])(
  "locks submitted evidence and restores %s focus only after refresh enables controls",
  async (via) => {
    const state = await completionSetup();
    const patch = deferred<{ ok: boolean }>();
    const refreshed = deferred<void>();
    vi.mocked(api.write).mockImplementationOnce(() => patch.promise);
    vi.mocked(state.refresh).mockReturnValueOnce(refreshed.promise);
    await requestCompletion(via);
    const input = wrapper.get('[aria-label="Completion summary"]');
    await input.setValue("Verified ledger totals");
    const origin = wrapper.get(
      via === "details" ? '[aria-label="Move task"]' : '[data-task-id="ap/1"]',
    ).element as HTMLElement;
    const focus = vi.spyOn(origin, "focus");
    await wrapper.get('[aria-label="Complete task"]').trigger("submit");
    expect(input.attributes("disabled")).toBeDefined();
    expect(wrapper.get('[aria-label="Move task"]').attributes("disabled")).toBeDefined();
    expect(api.write).toHaveBeenCalledWith(
      "/tasks/ap%2F1",
      "PATCH",
      { status: "done", summary: "Verified ledger totals" },
      "default",
    );
    patch.resolve({ ok: true });
    await flushPromises();
    expect(focus).not.toHaveBeenCalled();
    expect(wrapper.get('[aria-label="Move task"]').attributes("disabled")).toBeDefined();
    if (via === "drop") {
      const task = state.snapshot.value!.columns[2]!.tasks.shift()!;
      state.snapshot.value!.columns[4]!.tasks.push({ ...task, status: "done" });
      await flushPromises();
      expect(origin.isConnected).toBe(false);
    }
    refreshed.resolve();
    await flushPromises();
    expect(wrapper.get('[aria-label="Move task"]').attributes("disabled")).toBeUndefined();
    expect(document.activeElement).toBe(
      via === "details" ? origin : wrapper.get('[data-task-id="ap/1"]').element,
    );
    expect(focus).toHaveBeenCalledTimes(via === "details" ? 1 : 0);
  },
);

it.each(["board", "task", "disable", "navigation"])(
  "does not restore completion focus after %s changes during the success refresh",
  async (scope) => {
    const state = await completionSetup();
    const refreshed = deferred<void>();
    vi.mocked(state.refresh).mockReturnValueOnce(refreshed.promise);
    await requestCompletion("details");
    await wrapper.get('[aria-label="Completion summary"]').setValue("Verified ledger totals");
    const origin = wrapper.get('[aria-label="Move task"]').element as HTMLElement;
    const focus = vi.spyOn(origin, "focus");
    await wrapper.get('[aria-label="Complete task"]').trigger("submit");
    await flushPromises();
    if (scope === "board") await wrapper.get('[aria-label="Kanban board"]').setValue("second");
    else if (scope === "task") {
      state.taskId.value = "other";
      await flushPromises();
      state.taskId.value = "ap/1";
    } else if (scope === "disable") (useKanban().visible as { value: boolean }).value = false;
    else wrapper.unmount();
    await flushPromises();
    refreshed.resolve();
    await flushPromises();
    expect(focus).not.toHaveBeenCalled();
  },
);

it.each(["complete", "sustained", "board", "disable", "navigation"])(
  "drains real useBoard overlap before drag focus restoration: %s",
  async (scope) => {
    wrapper.unmount();
    const actual = await vi.importActual<typeof import("../useBoard")>("../useBoard");
    vi.mocked(useBoard).mockImplementation(actual.useBoard);
    const task = { id: "ap/1", title: "AP reconciliation", status: "ready" };
    const snapshot = (status: string) => ({
      latest_event_id: 4,
      columns: columns.map((name) => ({
        name,
        tasks: name === status ? [{ ...task, status }] : [],
      })),
      assignees: [],
    });
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    vi.spyOn(api, "board").mockResolvedValue(snapshot("ready"));
    vi.mocked(api.boards).mockResolvedValue({
      boards: [{ slug: "default" }, { slug: "second" }],
      current: "default",
    });
    wrapper = mount(KanbanPage, {
      attachTo: document.body,
      global: { plugins: [createChatHermesRouter()] },
    });
    await flushPromises();
    const state = vi.mocked(useBoard).mock.results.at(-1)!.value as ReturnType<typeof useBoard>;
    const stale = deferred<ReturnType<typeof snapshot>>();
    const fresh = deferred<ReturnType<typeof snapshot>>();
    vi.mocked(api.board).mockClear();
    vi.mocked(api.board)
      .mockImplementationOnce(() => stale.promise)
      .mockImplementationOnce(() => fresh.promise);
    // An event/poll read started before PATCH; its response cannot include Done.
    let settled = false;
    const background = state.refresh().then(() => {
      settled = true;
    });
    const origin = wrapper.get('[data-task-id="ap/1"]').element as HTMLElement;
    const focus = vi.spyOn(origin, "focus");
    await requestCompletion("drop");
    await wrapper.get('[aria-label="Completion summary"]').setValue("Verified ledger totals");
    await wrapper.get('[aria-label="Complete task"]').trigger("submit");
    await flushPromises();
    expect(api.write).toHaveBeenCalledWith(
      "/tasks/ap%2F1",
      "PATCH",
      { status: "done", summary: "Verified ledger totals" },
      "default",
    );
    expect(focus).not.toHaveBeenCalled();
    expect(wrapper.get(".kanban-new-task").attributes("disabled")).toBeDefined();
    expect(api.board).toHaveBeenCalledTimes(1);
    stale.resolve(snapshot("ready"));
    await flushPromises();
    expect(api.board).toHaveBeenCalledTimes(2);
    expect(settled).toBe(true);
    expect(focus).not.toHaveBeenCalled();
    expect(wrapper.get(".kanban-new-task").attributes("disabled")).toBeDefined();
    const later = deferred<ReturnType<typeof snapshot>>();
    let laterSettled = false;
    let laterRefresh: Promise<void> | undefined;
    if (scope === "sustained") {
      vi.mocked(api.board).mockImplementationOnce(() => later.promise);
      laterRefresh = state.refresh().then(() => {
        laterSettled = true;
      });
    }
    const signal = vi.mocked(api.board).mock.calls[1]![2]!;
    if (scope === "board") await wrapper.get('[aria-label="Kanban board"]').setValue("second");
    else if (scope === "disable") (useKanban().visible as { value: boolean }).value = false;
    else if (scope === "navigation") wrapper.unmount();
    await flushPromises();
    if (!["complete", "sustained"].includes(scope)) expect(signal.aborted).toBe(true);
    // Resolve even after abort to exercise guards against transports ignoring it.
    fresh.resolve(snapshot("done"));
    await background;
    await flushPromises();
    expect(settled).toBe(true);
    expect(focus).not.toHaveBeenCalled();
    if (["complete", "sustained"].includes(scope)) {
      const replacement = wrapper.get('[aria-label="done tasks"] [data-task-id="ap/1"]');
      expect(origin.isConnected).toBe(false);
      expect(document.activeElement).toBe(replacement.element);
      expect(wrapper.get(".kanban-new-task").attributes("disabled")).toBeUndefined();
      if (scope === "sustained") {
        expect(api.board).toHaveBeenCalledTimes(3);
        expect(laterSettled).toBe(false);
        later.resolve(snapshot("done"));
        await laterRefresh;
      }
    } else if (scope === "board") {
      expect(state.snapshot.value).toEqual(snapshot("ready"));
      expect(wrapper.find('[aria-label="done tasks"] [data-task-id="ap/1"]').exists()).toBe(false);
    } else if (scope === "disable") expect(state.snapshot.value).toBeUndefined();
  },
);
