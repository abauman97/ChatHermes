import { computed, reactive, ref } from "vue";
import { api, messageText } from "../../../services/hermes-api";
import { NativeViewer, NativeError, type NativeSnapshot, type NativeHooks } from "./native-chat";
import {
  createTurn,
  nativeSubagentId,
  reduceTurn,
  reduceNativeTurn,
  historyBlocks,
  mergeHistoryBlocks,
  type AssistantTurn,
} from "./assistant-turn";
import { nativeOutcome, uncertainNativeOutcome, settleNativeOutcome } from "./native-admission";
import type { Message } from "../../../types/hermes";
import type {
  OpenRequestEntry,
  PersistedTurn,
} from "../../../vendor/hermes/gateway-contract.generated.ts";

/** One state owner for TUI chat execution and recovery. */
export function useNativeSession(onSettled: () => void) {
  const messages = ref<Message[]>([]),
    busy = ref(false),
    loading = ref(false),
    error = ref(""),
    status = ref("");
  const connection = ref<"ready" | "stale" | "reconnecting">("stale"),
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
  let reconstruction: Promise<void> | undefined;
  let selected = false;
  let visible = document.visibilityState !== "hidden";
  let online = navigator.onLine;
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
    if (!currentViewer || recovering || connection.value !== "ready") return;
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
    if (!selected || p !== profile || s !== stored) {
      close();
      p = profile;
      s = stored;
      selected = true;
      uncertain.value = nativeOutcome(p, s);
    }
    await reconnect();
  }
  function stale() {
    generation++;
    hydrating++;
    viewer?.close();
    viewer = undefined;
    reconstruction = undefined;
    recovering = false;
    loading.value = false;
    connection.value = "stale";
  }
  function availability(nextVisible: boolean, nextOnline: boolean) {
    const changed = visible !== nextVisible || online !== nextOnline;
    visible = nextVisible;
    online = nextOnline;
    if (!visible || !online) {
      if (selected && connection.value !== "stale") stale();
      return Promise.resolve();
    }
    if (changed) return reconnect();
    return reconstruction || Promise.resolve();
  }
  function reconnect(): Promise<void> {
    if (!selected || !visible || !online || connection.value === "ready") return Promise.resolve();
    if (reconstruction) return reconstruction;
    const current = ++generation;
    hydrating++;
    recovering = true;
    loading.value = messages.value.length === 0;
    connection.value = "reconnecting";
    let staged: (() => void)[] | undefined = [];
    const deliver = (action: () => void) => {
      if (current !== generation) return;
      if (staged) staged.push(action);
      else action();
    };
    const hooks: NativeHooks = {
      snapshot: (value) => {
        // Build from a fresh baseline; nothing reaches visible refs until ready.
        staged = [];
        deliver(() => {
          error.value = uncertain.value
            ? "Submission outcome unknown. Inspect history and native state before sending again."
            : "";
          status.value = "";
          requests.value = [];
          restore(value);
        });
      },
      input: (text, correction, admissionId) => deliver(() => input(text, correction, admissionId)),
      event: (event) =>
        deliver(() => {
          const data = (event.payload || {}) as Record<string, unknown>;
          const text = typeof data.text === "string" ? data.text : "";
          if (event.type === "message.start") {
            busy.value = true;
            status.value = "Working…";
            receipt = undefined;
          } else if (event.type === "thinking.delta" || event.type === "tool.generating")
            status.value =
              event.type === "tool.generating"
                ? "Preparing " + (typeof data.name === "string" && data.name ? data.name : "tool")
                : text || "Working…";
          else if (event.type === "status.update") status.value = text;
          if (!turn && user) turn = reactive(createTurn());
          let target = turn;
          if (event.type.startsWith("subagent.") || event.type.startsWith("tool.")) {
            const key = event.type.startsWith("subagent.")
              ? "subagent-" + nativeSubagentId(data)
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
            if (typeof data.status === "string" && data.status && data.status !== "complete")
              error.value =
                typeof data.error === "string" && data.error
                  ? data.error
                  : "Response " + data.status;
            if (!recovering) void hydrate();
          } else if (event.type === "subagent.complete" && !busy.value && !recovering)
            void hydrate();
          repaint();
        }),
      requests: (value) =>
        deliver(() => {
          requests.value = value;
        }),
      connection: (state, notice) => {
        if (current !== generation) return;
        if (state === "closed") {
          const wasReady = connection.value === "ready";
          stale();
          error.value = notice || "Session connection lost. Reconnect to restore this session.";
          // A live failure gets one visible reconstruction. A failed attempt
          // stays stale until an explicit retry or a new availability transition.
          const staleGeneration = generation;
          if (wasReady)
            queueMicrotask(() => {
              if (generation === staleGeneration && selected && connection.value === "stale")
                void reconnect();
            });
        } else if (notice)
          deliver(() => {
            error.value = notice;
          });
      },
      recovered: () => {
        if (current !== generation) return;
        const actions = staged || [];
        staged = undefined;
        // Vue batches this synchronous replacement into one render, including
        // approvals and all live frames buffered behind the replay boundary.
        for (const action of actions) action();
        recovering = false;
        loading.value = false;
        connection.value = "ready";
        if (!busy.value) void hydrate();
      },
    };
    const target = new NativeViewer(p, s, hooks);
    viewer = target;
    const flight = (async () => {
      try {
        await target.ensure();
        if (current === generation && connection.value !== "ready")
          throw new NativeError("Native session reconstruction did not become ready");
      } catch {
        if (current === generation) {
          stale();
          error.value = "Could not reconnect this session. Retry when the dashboard is available.";
        }
      } finally {
        if (current === generation) reconstruction = undefined;
      }
    })();
    reconstruction = flight;
    return flight;
  }

  async function submit(
    text: string,
    content: unknown,
    selection: { model?: string; provider?: string },
    preview?: unknown,
  ) {
    if (!viewer || busy.value || uncertain.value || loading.value || connection.value !== "ready")
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
        // Availability can replace the viewer without changing the selection.
        // Retire only this attempt; a completion from an earlier selection must
        // not alter the newly selected session, even if its IDs are the same.
        if (selected && p === target.profile && s === target.stored && pendingAttempt === attempt) {
          messages.value = messages.value.filter((row) => row.id !== optimisticId);
          uncertain.value = nativeOutcome(p, s);
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
    if (!selected) return;
    if (connection.value !== "ready") await reconnect();
    if (connection.value !== "ready") return;
    if (busy.value) {
      error.value = "Hermes is still working; sending remains locked.";
      return;
    }
    if (await hydrate()) {
      settleNativeOutcome(p, s);
      uncertain.value = false;
    }
  }
  function close() {
    stale();
    selected = false;
    pendingAttempt = "";
    messages.value = [];
    busy.value = false;
    loading.value = false;
    requests.value = [];
    uncertain.value = false;
    error.value = "";
    status.value = "";
    turn = undefined;
    user = undefined;
    completed = [];
  }
  function readyViewer() {
    if (!viewer || connection.value !== "ready")
      throw new NativeError("Session is read-only until reconnected", "rejected");
    return viewer;
  }
  return {
    messages,
    busy,
    loading,
    error,
    status,
    connection,
    approval,
    requests,
    uncertain,
    attach,
    submit,
    close,
    hydrate,
    resolveUncertainty,
    reconnect,
    availability,
    stop: () => readyViewer().rpc("chat.stop"),
    steer: (text: string) => readyViewer().rpc("chat.steer", { text }),
    answer: (id: string, result: Record<string, unknown>) => readyViewer().answer(id, result),
  };
}
