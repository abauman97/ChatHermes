import { computed, reactive, ref } from "vue";
import { api, messageText } from "./hermes-api";
import { NativeViewer, NativeError, type NativeSnapshot } from "./native-chat";
import {
  createTurn,
  reduceTurn,
  reduceNativeTurn,
  historyBlocks,
  mergeHistoryBlocks,
  type AssistantTurn,
} from "./assistant-turn";
import { nativeOutcome, uncertainNativeOutcome, settleNativeOutcome } from "./native-admission";
import type { Message } from "../types/hermes";
import type { OpenRequestEntry, PersistedTurn } from "../vendor/hermes/gateway-contract.generated";

/** One state owner for native chat; legacy Runs are deliberately outside it. */
export function useNativeSession(onSettled: () => void) {
  const messages = ref<Message[]>([]),
    busy = ref(false),
    loading = ref(false),
    error = ref(""),
    status = ref("");
  const connection = ref("closed"),
    requests = ref<OpenRequestEntry[]>([]),
    uncertain = ref(false);
  const approval = computed<Record<string, unknown> | undefined>(() => {
    const request = requests.value[0];
    return request
      ? { ...request.params, request_id: request.id, kind: request.method }
      : undefined;
  });
  let viewer: NativeViewer | undefined,
    generation = 0,
    recovering = false,
    hydrating = 0;
  let turn: AssistantTurn | undefined, user: Message | undefined;
  let completed: {
    user: Message;
    turn: AssistantTurn;
    receipt?: PersistedTurn;
    hasCorrections: boolean;
  }[] = [];
  let pendingAttempt = "";
  let p = "",
    s = "",
    pendingInput = false,
    hasCorrections = false,
    sequence = 0,
    receipt: PersistedTurn | undefined;
  const repaint = () => {
    if (user && turn) user.blocks = turn.blocks;
    messages.value = [...messages.value];
  };
  function input(text: string, correction = false, admissionId?: string) {
    if (pendingInput && !correction && user && admissionId === pendingAttempt) {
      pendingInput = false;
      // Keep the immediate attachment preview until authoritative history maps
      // it to a native user row. The spool itself only retains durable refs.
      repaint();
      return;
    }
    if (correction && user && turn) {
      // A correction is another display boundary within the same execution.
      // Keep earlier parts addressable so late tool results update their IDs.
      reduceTurn(turn, { type: "reasoning.completed", data: {} });
      completed.push({ user, turn, hasCorrections: true });
    }
    hasCorrections = correction || false;
    user = { id: `native-user-${++sequence}`, role: "user", content: text };
    messages.value.push(user);
    turn = reactive(createTurn());
    user.blocks = turn.blocks;
    busy.value = true;
    repaint();
  }
  function restore(value: NativeSnapshot) {
    recovering = true;
    hydrating++;
    receipt = undefined;
    turn = undefined;
    user = undefined;
    pendingInput = false;
    completed = [];
    const history = value.messages.map(
      (row) =>
        ({
          ...row,
          id: row.row_id == null ? undefined : String(row.row_id),
          content: row.role === "tool" ? row.content : row.text || row.content || "",
          tool_name: row.name,
        }) as Message,
    );
    const baseline = new Set(value.recovery.base_row_ids || []);
    messages.value = value.recovery.complete
      ? history.filter((row) => row.id && baseline.has(row.id))
      : history;
    busy.value = !!(value.running || value.queued);
    if (!value.recovery.complete && value.inflight?.user) {
      const last = messages.value.reduce(
        (last, row, index) => (row.role === "user" ? index : last),
        -1,
      );
      if (last < 0 || messageText(messages.value[last]!.content) !== value.inflight.user)
        input(value.inflight.user);
      else {
        user = messages.value[last];
        turn = reactive(createTurn());
        mergeHistoryBlocks(turn, historyBlocks(messages.value.slice(last + 1)), busy.value);
        user!.blocks = turn.blocks;
      }
      if (value.inflight.assistant)
        reduceTurn(turn!, { type: "text.snapshot", data: { text: value.inflight.assistant } });
      for (const text of value.inflight.corrections || []) input(text, true);
      if (value.inflight.error) error.value = value.inflight.error;
      if (value.running)
        error.value =
          "Earlier progress is outside retained recovery; saved history is authoritative.";
    }
    busy.value = !!(value.running || value.queued);
  }
  async function hydrate() {
    const current = generation,
      flight = ++hydrating,
      currentViewer = viewer;
    if (!currentViewer || recovering) return;
    try {
      const history = await api.messages(p, s);
      if (current !== generation || flight !== hydrating || recovering) return;
      // A newer turn may start while REST is pending. Preserve its projection;
      // only a receipt with durable row identities retires covered live parts.
      if (busy.value && user && turn) {
        const anchor = receipt?.user_row_id;
        const index = anchor ? history.findIndex((row) => row.id === String(anchor)) : -1;
        if (index >= 0) mergeHistoryBlocks(turn, historyBlocks(history.slice(index + 1)), true);
        repaint();
        return;
      }
      if (user && turn && !completed.length) {
        repaint();
        return true;
      }
      // Native steering persists inside tool context, without a durable user
      // row for its display bubble. Such bubbles are uncovered live remainder.
      if (completed.some((entry) => entry.hasCorrections)) {
        repaint();
        return true;
      }
      for (const entry of completed) {
        const { turn: projection, receipt: coverage } = entry;
        const index =
          coverage?.user_row_id == null
            ? -1
            : history.findIndex((row) => row.id === String(coverage.user_row_id));
        let end = index + 1;
        while (end < history.length && history[end]?.role !== "user") end++;
        if (index >= 0)
          mergeHistoryBlocks(projection, historyBlocks(history.slice(index + 1, end)), false);
        const ids = new Set(history.map((row) => row.id));
        const final = history.find((row) => row.id === String(coverage?.final_assistant_row_id));
        const finalText =
          [...projection.blocks].reverse().find((block) => block.kind === "text")?.content || "";
        const covered =
          coverage?.complete &&
          index >= 0 &&
          coverage.row_ids.every((id) => ids.has(String(id))) &&
          final &&
          messageText(final.content).trim() === finalText.trim();
        // A partial write is not proof that history covers this live occurrence.
        if (!covered) {
          repaint();
          return true;
        }
        history[index] = { ...history[index]!, blocks: projection.blocks };
      }
      messages.value = history;
      const result = await currentViewer.rpc<{ settled: boolean }>("chat.reconciled", {
        through: currentViewer.boundary,
      });
      if (current === generation && result.settled) onSettled();
      return true;
    } catch {
      if (current === generation)
        error.value =
          "Response ended; saved history could not be reconciled. Refresh history before sending again.";
      return false;
    }
  }
  async function attach(profile: string, stored: string) {
    close();
    p = profile;
    s = stored;
    loading.value = true;
    uncertain.value = nativeOutcome(p, s);
    if (uncertain.value)
      error.value =
        "Submission outcome unknown. Inspect history and native state before sending again.";
    const current = generation;
    viewer = new NativeViewer(p, s, {
      snapshot: (value) => {
        if (current === generation) restore(value);
      },
      input: (text, correction, admissionId) => {
        if (current === generation) input(text, correction, admissionId);
      },
      event: (event) => {
        if (current !== generation) return;
        const data = (event.payload || {}) as Record<string, unknown>;
        if (event.type === "message.start") {
          busy.value = true;
          status.value = "Working…";
          receipt = undefined;
        } else if (event.type === "thinking.delta" || event.type === "tool.generating")
          status.value =
            event.type === "tool.generating"
              ? "Preparing " + String(data.name || "tool")
              : String(data.text || "Working…");
        else if (event.type === "status.update") status.value = String(data.text || "");
        if (!turn && user) turn = reactive(createTurn());
        let target = turn;
        if (event.type.startsWith("subagent.") || event.type.startsWith("tool.")) {
          const key = event.type.startsWith("subagent.")
            ? "subagent-" +
              (data.subagent_id ||
                data.child_session_id ||
                (data.delegation_id ? `${data.delegation_id}:${data.task_index}` : ""))
            : data.tool_id;
          target =
            [...completed]
              .reverse()
              .find((entry) => entry.turn.blocks.some((block) => block.id === key))?.turn || turn;
        }
        if (target) reduceNativeTurn(target, event.type, data);
        if (event.type === "message.complete") {
          for (const entry of completed)
            reduceNativeTurn(entry.turn, "message.complete", { status: data.status });
          receipt = data.persisted_turn as PersistedTurn | undefined;
          if (user && turn) completed.push({ user, turn, receipt, hasCorrections });
          busy.value = false;
          status.value = "";
          if (data.status && data.status !== "complete")
            error.value = String(data.error || "Response " + data.status);
          if (!recovering) void hydrate();
        } else if (event.type === "subagent.complete" && !busy.value && !recovering) void hydrate();
        repaint();
      },
      requests: (value) => {
        if (current === generation) requests.value = value;
      },
      connection: (state, notice) => {
        if (current === generation) {
          connection.value = state;
          if (notice) error.value = notice;
        }
      },
      recovered: () => {
        if (current === generation) {
          recovering = false;
          loading.value = false;
          if (!busy.value) void hydrate();
        }
      },
    });
    try {
      await viewer.ensure();
    } catch (cause) {
      if (current === generation) {
        loading.value = false;
        error.value = cause instanceof Error ? cause.message : "Native session unavailable";
      }
    }
  }
  async function submit(
    text: string,
    content: unknown,
    selection: { model?: string; provider?: string },
    preview?: unknown,
  ) {
    if (!viewer || busy.value || uncertain.value || loading.value || connection.value !== "open")
      throw new NativeError("Native session is not ready. Message not submitted.", "rejected");
    const current = generation,
      target = viewer,
      attempt = uncertainNativeOutcome(p, s);
    uncertain.value = true;
    error.value = "";
    input(text);
    user!.content = preview ?? content;
    pendingInput = true;
    pendingAttempt = attempt;
    const optimisticId = user!.id;
    let dispatched = false;
    try {
      const prepared = typeof content === "function" ? await content() : content;
      if (current !== generation)
        throw new NativeError("Viewer detached before submission", "rejected");
      dispatched = true;
      await target.rpc("chat.submit", { input: prepared, admission_id: attempt, ...selection });
      settleNativeOutcome(profileFor(target), target.stored, attempt);
      if (current === generation) uncertain.value = false;
    } catch (cause) {
      if (!dispatched || (cause instanceof NativeError && cause.outcome === "rejected")) {
        settleNativeOutcome(profileFor(target), target.stored, attempt);
        if (current === generation) {
          messages.value = messages.value.filter((row) => row.id !== optimisticId);
          uncertain.value = false;
          pendingInput = false;
          if (user?.id === optimisticId) {
            busy.value = false;
            turn = undefined;
            user = undefined;
          }
        }
      } else if (current === generation)
        error.value =
          "Submission outcome unknown. Inspect history and native state before sending again.";
      throw cause;
    }
  }
  const profileFor = (target: NativeViewer) => target.profile;
  async function resolveUncertainty() {
    if (!viewer) return;
    await viewer.ensure();
    const live = await viewer.rpc<NativeSnapshot>("chat.attach", { session_id: s });
    if (live.running || live.queued) {
      error.value = "Hermes is still working; sending remains locked.";
      return;
    }
    if (await hydrate()) {
      settleNativeOutcome(p, s);
      uncertain.value = false;
    }
  }
  function close() {
    generation++;
    hydrating++;
    viewer?.close();
    viewer = undefined;
    recovering = false;
    messages.value = [];
    busy.value = false;
    loading.value = false;
    connection.value = "closed";
    requests.value = [];
    uncertain.value = false;
    error.value = "";
    status.value = "";
    turn = undefined;
    user = undefined;
    completed = [];
  }
  return {
    messages,
    busy,
    loading,
    error,
    status,
    connection,
    approval,
    uncertain,
    attach,
    submit,
    close,
    hydrate,
    resolveUncertainty,
    reconnect: () => viewer?.ensure(),
    stop: () => viewer?.rpc("chat.stop"),
    steer: (text: string) => viewer?.rpc("chat.steer", { text }),
    answer: (id: string, result: Record<string, unknown>) => viewer?.answer(id, result),
  };
}
