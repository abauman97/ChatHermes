<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { api, KanbanError } from "../api";
import { useKanban } from "../context";
import { useBoard } from "../useBoard";
import TaskForm from "../TaskForm.vue";
import TaskDetail from "../TaskDetail.vue";
import type { BoardMeta, Boards, Workflow } from "../types";
const kanban = useKanban();
const route = useRoute();
const page = ref<HTMLElement>();
async function closeTask() {
  const id = taskId.value;
  taskId.value = "";
  await nextTick();
  Array.from(page.value?.querySelectorAll<HTMLButtonElement>(".kanban-card") || [])
    .find((card) => card.dataset.taskId === id)
    ?.focus();
}
const boards = ref<BoardMeta[]>([]),
  selected = ref(""),
  archived = ref(false),
  workflow = ref<Workflow>();
const catalogError = ref(""),
  actionError = ref(""),
  notice = ref(""),
  busy = ref(false),
  creating = ref(false);
const boardEditor = ref<"create" | "edit" | "">("");
const boardSlug = ref(""),
  boardName = ref(""),
  boardDescription = ref(""),
  boardDirectory = ref("");
const confirmArchive = ref(false);
const live = useBoard(selected, kanban.visible, archived, () => {
  void kanban.check();
});
const { snapshot, detail, log, taskId, error, loading } = live;
const selectedMeta = computed(() => boards.value.find((b) => b.slug === selected.value));
let disposed = false,
  generation = 0;
onUnmounted(() => {
  disposed = true;
  generation++;
  kanban.screenActions.value = [];
});
function remembered() {
  try {
    return localStorage.getItem("chathermes.kanban-board") || "";
  } catch {
    return "";
  }
}
let catalogRequest: AbortController | undefined;
async function loadCatalog() {
  catalogRequest?.abort();
  const request = (catalogRequest = new AbortController());
  const token = generation;
  try {
    const result: Boards = await api.boards(request.signal);
    if (disposed || token !== generation || !kanban.visible.value) return;
    boards.value = result.boards;
    if (!result.boards.some((b) => b.slug === selected.value)) {
      const saved = typeof route.query.board === "string" ? route.query.board : remembered();
      selected.value =
        result.boards.find((b) => b.slug === saved)?.slug ||
        result.boards.find((b) => b.slug === result.current)?.slug ||
        result.boards[0]?.slug ||
        "";
    }
    catalogError.value = "";
  } catch (err) {
    if (!disposed && !request.signal.aborted && token === generation) {
      catalogError.value = err instanceof KanbanError ? err.message : "Could not load boards.";
      if (err instanceof KanbanError && [401, 403, 404, 503].includes(err.status))
        kanban.unavailable();
    }
  }
}
watch(
  kanban.visible,
  (active, _, cleanup) => {
    generation++;
    if (!active) {
      boards.value = [];
      selected.value = "";
      workflow.value = undefined;
      creating.value = false;
      boardEditor.value = "";
      busy.value = false;
      return;
    }
    const controller = new AbortController();
    void loadCatalog();
    void api
      .workflow(controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) workflow.value = value;
      })
      .catch(() => {
        /* View remains usable; moves fail closed without the upstream workflow. */
      });
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") void loadCatalog();
    }, 8000);
    cleanup(() => {
      controller.abort();
      catalogRequest?.abort();
      clearInterval(poll);
    });
  },
  { immediate: true },
);
watch(selected, (value) => {
  generation++;
  busy.value = false;
  creating.value = false;
  boardEditor.value = "";
  actionError.value = "";
  notice.value = "";
  confirmArchive.value = false;
  if (value === route.query.board && typeof route.query.task === "string")
    taskId.value = route.query.task;
  try {
    localStorage.setItem("chathermes.kanban-board", value);
  } catch {
    /* Selection remains mount-local. */
  }
});
watch(
  [() => route.query.board, () => route.query.task, kanban.visible],
  ([board, task, visible]) => {
    if (!visible || typeof board !== "string" || typeof task !== "string") return;
    if (selected.value !== board) {
      if (boards.value.some((row) => row.slug === board)) selected.value = board;
      return;
    }
    taskId.value = task;
  },
  { immediate: true },
);
watch(
  [busy, selected, archived, kanban.visible],
  () => {
    kanban.screenActions.value = kanban.visible.value
      ? [
          {
            label: "Refresh",
            disabled: busy.value,
            run: () => {
              void refresh();
            },
          },
          {
            label: "New board",
            disabled: busy.value,
            run: () => {
              openBoardEditor("create");
            },
          },
          {
            label: "Board settings",
            disabled: busy.value || !selected.value,
            run: () => {
              openBoardEditor("edit");
            },
          },
          {
            label: "Show archived tasks",
            checked: archived.value,
            run: () => {
              archived.value = !archived.value;
            },
          },
        ]
      : [];
  },
  { immediate: true },
);
async function startTask() {
  creating.value = true;
  await nextTick();
  page.value?.querySelector<HTMLInputElement>('input[aria-label="Task title"]')?.focus();
}
async function cancelCreate() {
  creating.value = false;
  await nextTick();
  page.value?.querySelector<HTMLButtonElement>(".kanban-new-task")?.focus();
}
async function refresh() {
  await Promise.all([loadCatalog(), live.refresh()]);
}
async function perform(work: () => Promise<unknown>, after?: () => void, nudge = false) {
  if (busy.value || !kanban.visible.value) return;
  const token = generation,
    slug = selected.value;
  busy.value = true;
  actionError.value = "";
  notice.value = "";
  try {
    const result = await work();
    if (nudge && slug) void api.write("/dispatch", "POST", {}, slug).catch(() => {});
    if (disposed || token !== generation) return;
    if (result && typeof result === "object" && "ok" in result && result.ok === false) {
      actionError.value = "Hermes could not complete this action. Check the task state in Hermes.";
      return;
    }
    if (result && typeof result === "object" && "warning" in result && result.warning)
      notice.value =
        "Hermes saved the task with a dispatcher warning. Check the Hermes dispatcher if it does not start.";
    after?.();
    await refresh();
  } catch (err) {
    if (!disposed && token === generation) {
      actionError.value =
        err instanceof KanbanError
          ? err.message
          : "Kanban operation failed. Refresh to inspect the outcome before retrying.";
      await live.refresh();
    }
  } finally {
    if (!disposed && token === generation) busy.value = false;
  }
}
function taskOperation(
  path: string,
  method: string,
  body: unknown,
  nudge = true,
  after?: () => void,
) {
  const slug = selected.value;
  void perform(
    () => api.write(path, method, body, slug),
    () => {
      after?.();
      if (method === "DELETE" && path === "/tasks/" + encodeURIComponent(taskId.value))
        taskId.value = "";
    },
    nudge,
  );
}
async function createTask(body: Record<string, unknown>) {
  const slug = selected.value;
  const token = generation;
  let created = false;
  await perform(
    async () => {
      const result = await api.write<{ task: { id: string; status: string }; warning?: string }>(
        "/tasks",
        "POST",
        body,
        slug,
      );
      created = true;
      return result;
    },
    undefined,
    true,
  );
  if (created && !disposed && token === generation) await cancelCreate();
}
function upload(file: File) {
  const slug = selected.value,
    id = taskId.value;
  void perform(() => api.upload(slug, id, file));
}
function openBoardEditor(mode: "create" | "edit") {
  boardEditor.value = mode;
  boardSlug.value = mode === "edit" ? selected.value : "";
  boardName.value = mode === "edit" ? selectedMeta.value?.name || "" : "";
  boardDescription.value = mode === "edit" ? selectedMeta.value?.description || "" : "";
  boardDirectory.value = mode === "edit" ? selectedMeta.value?.default_workdir || "" : "";
}
function saveBoard() {
  const editing = boardEditor.value === "edit";
  const body = {
    name: boardName.value,
    description: boardDescription.value,
    default_workdir: boardDirectory.value,
    ...(!editing ? { slug: boardSlug.value.trim(), switch: false } : {}),
  };
  void perform(
    () =>
      api.write(
        "/boards" + (editing ? "/" + encodeURIComponent(selected.value) : ""),
        editing ? "PATCH" : "POST",
        body,
      ),
    () => {
      boardEditor.value = "";
    },
  );
}
function archiveBoard() {
  const slug = selected.value;
  void perform(
    () => api.write("/boards/" + encodeURIComponent(slug), "DELETE", undefined),
    () => {
      confirmArchive.value = false;
    },
  );
}
function move(id: string, status: string) {
  const task = snapshot.value?.columns.flatMap((c) => c.tasks).find((t) => t.id === id);
  if (
    !task ||
    !workflow.value?.columns.some((c) => c.key === status && c.drag_target) ||
    !workflow.value.manual[task.status]?.includes(status)
  )
    return;
  taskOperation("/tasks/" + encodeURIComponent(id), "PATCH", { status });
}
function drag(event: DragEvent, id: string) {
  event.dataTransfer?.setData(
    "application/x-chathermes-task",
    JSON.stringify({ board: selected.value, id }),
  );
}
function drop(event: DragEvent, status: string) {
  try {
    const data = JSON.parse(event.dataTransfer?.getData("application/x-chathermes-task") || "");
    if (data.board === selected.value) move(data.id, status);
  } catch {
    /* Ignore unrelated drags. */
  }
}
</script>
<template>
  <section ref="page" class="kanban-page page-content" aria-label="Kanban viewer">
    <div v-if="!kanban.visible.value" class="kanban-empty">
      <p>
        {{
          kanban.enabled.value
            ? "Hermes Kanban is unavailable. Your chats remain available."
            : "Enable Kanban Viewer in global Settings to view boards."
        }}
      </p>
      <button :disabled="kanban.checking.value" @click="kanban.check()">
        Recheck availability
      </button>
    </div>
    <template v-else>
      <div class="kanban-toolbar">
        <label
          >Board<select v-model="selected" aria-label="Kanban board">
            <option v-for="board in boards" :key="board.slug" :value="board.slug">
              {{ board.name || board.slug }}
            </option>
          </select></label
        >
        <button
          class="kanban-new-task"
          :disabled="busy || !selected || creating"
          :aria-expanded="creating"
          @click="startTask"
        >
          New task
        </button>
      </div>
      <TaskForm
        v-if="creating"
        :key="selected"
        :assignees="snapshot?.assignees || []"
        :busy="busy"
        @save="createTask"
        @cancel="cancelCreate"
      />
      <p v-if="catalogError || actionError || error" role="alert" class="kanban-error">
        {{ actionError || catalogError || error }}
      </p>
      <p v-if="notice" role="status" class="kanban-muted">{{ notice }}</p>
      <p v-if="!workflow" class="kanban-muted">
        Manual movement is unavailable until the Hermes workflow API responds.
      </p>
      <form
        v-if="boardEditor"
        class="kanban-form kanban-board-editor"
        aria-label="Board settings"
        @submit.prevent="saveBoard"
      >
        <label v-if="boardEditor === 'create'"
          >Board slug<input v-model="boardSlug" required aria-label="Board slug"
        /></label>
        <label>Board name<input v-model="boardName" aria-label="Board name" /></label>
        <label
          >Description<textarea v-model="boardDescription" aria-label="Board description" />
        </label>
        <label
          >Default directory on Hermes<input
            v-model="boardDirectory"
            aria-label="Board default directory"
        /></label>
        <div class="kanban-toolbar">
          <button :disabled="busy">Save board</button
          ><button type="button" :disabled="busy" @click="boardEditor = ''">Cancel</button>
          <button
            v-if="boardEditor === 'edit' && selected !== 'default' && !confirmArchive"
            type="button"
            :disabled="busy"
            @click="confirmArchive = true"
          >
            Archive board…</button
          ><button v-if="confirmArchive" type="button" :disabled="busy" @click="archiveBoard">
            Confirm archive board
          </button>
        </div>
      </form>
      <p v-if="loading" role="status">Loading board…</p>
      <p v-else-if="!boards.length && !catalogError" class="kanban-empty">
        No boards available. Create a board to get started.
      </p>
      <div class="kanban-workspace" :class="{ 'has-detail': taskId }">
        <div class="kanban-columns" aria-label="Board columns">
          <section
            v-for="column in snapshot?.columns"
            :key="column.name"
            class="kanban-column"
            :class="{ 'kanban-column-empty': !column.tasks.length }"
            :aria-label="column.name + ' tasks'"
            @dragover.prevent
            @drop.prevent="drop($event, column.name)"
          >
            <h2>
              {{ workflow?.columns.find((c) => c.key === column.name)?.label || column.name }}
              <span class="kanban-muted">{{ column.tasks.length }}</span>
            </h2>
            <p v-if="!column.tasks.length" class="kanban-muted">No tasks</p>
            <button
              v-for="task in column.tasks"
              :key="task.id"
              class="kanban-card"
              :data-task-id="task.id"
              :class="{ selected: taskId === task.id }"
              :draggable="!busy"
              @dragstart="drag($event, task.id)"
              @click="taskId = task.id"
            >
              <strong>{{ task.title }}</strong
              ><span class="kanban-muted"
                >{{ task.status }} · {{ task.assignee || "Unassigned" }} · Priority
                {{ task.priority ?? 0 }}</span
              >
              <span v-if="task.progress"
                >{{ task.progress.done }}/{{ task.progress.total }} subtasks</span
              >
              <span v-if="task.comment_count">{{ task.comment_count }} comments</span>
              <span v-if="task.warnings?.count">{{ task.warnings.count }} warnings</span>
              <span v-if="task.latest_summary" class="kanban-card-summary">{{
                task.latest_summary
              }}</span>
            </button>
          </section>
        </div>
        <TaskDetail
          v-if="detail"
          :key="selected + ':' + detail.task.id"
          :board="selected"
          :detail="detail"
          :log="log"
          :workflow="workflow"
          :assignees="snapshot?.assignees || []"
          :busy="busy"
          @close="closeTask"
          @select="taskId = $event"
          @operation="taskOperation"
          @upload="upload"
        />
        <section v-else-if="taskId" class="kanban-detail" aria-label="Task details">
          <button @click="taskId = ''">Close task details</button>
          <p>
            {{
              error
                ? "Task details are unavailable. Refresh or select another task."
                : "Loading task…"
            }}
          </p>
        </section>
      </div>
    </template>
  </section>
</template>
<style src="../kanban.css"></style>
