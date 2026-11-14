import { computed, ref, watch, type Ref } from "vue";
import { NativeGatewayViewer } from "../runtime/native-gateway";
import { NativeError } from "../runtime/native-chat";
import {
  isSlash,
  parseSlash,
  canonical,
  limitation,
  commandMethod,
  promptDirective,
  reasoningAction,
} from "../commands/slash";
import type {
  CommandsCatalogResult,
  CompleteSlashResult,
  SlashExecResult,
  SessionCompressResult,
} from "../../../vendor/hermes/gateway-contract.generated";
import { reasoningEfforts } from "../../../types/hermes";
import { api } from "../../../services/hermes-api";
import { projectRoot } from "../../projects/utils/projects";
import type {
  ReasoningEffort,
  Attachment,
  Message,
  Project,
  ModelOption,
  ProviderOption,
} from "../../../types/hermes";
import type { useNativeSession } from "../runtime/native-session";
import { normalizeRequest, type RequestAnswer } from "../utils/chat-requests";
// Keep the filename annotation for durable metadata and native file staging;
// MEDIA is the direct delivery reference consumed by the artifact parser.
function uploadReference(file: Attachment, path: string) {
  return `Attached ${file.type.startsWith("image/") ? "image" : "file"} ${file.name.replace(/[\r\n]/g, " ")}: ${path}\nMEDIA:"${path}"`;
}
export function useChatController(
  native: ReturnType<typeof useNativeSession>,
  scope: {
    profile: Readonly<Ref<string>>;
    session: Readonly<Ref<string>>;
    messages: Readonly<Ref<Message[]>>;
    chatLoading: Readonly<Ref<boolean>>;
    chatError: Readonly<Ref<string>>;
    canStream: Readonly<Ref<boolean>>;
    composerBlocked: Readonly<Ref<boolean>>;
    projectView: Readonly<Ref<boolean>>;
    selectedProject: Readonly<Ref<Project | undefined>>;
    creating: Readonly<Ref<boolean>>;
    offline: Readonly<Ref<boolean>>;
    models: Readonly<Ref<ModelOption[]>>;
    providers: Readonly<Ref<ProviderOption[]>>;
    modelsLoading: Readonly<Ref<boolean>>;
    model: Ref<string>;
    provider: Ref<string>;
    defaultModel: Readonly<Ref<string>>;
    suggestedPrompt: Ref<string>;
    generation: () => number;
    navigation: () => unknown;
    createSession: () => Promise<string | undefined>;
    suggest: (text: string) => Promise<void>;
    retryHistory: () => Promise<unknown>;
    openBranch: (id: string) => Promise<void>;
  },
) {
  const {
    profile,
    session,
    messages,
    chatLoading,
    chatError,
    canStream,
    projectView,
    composerBlocked,
    selectedProject,
    creating,
    offline,
    models,
    providers,
    modelsLoading,
    model,
    provider,
    defaultModel,
    suggestedPrompt,
  } = scope;
  // Pending choices belong only to this profile/session. A home draft transfers
  // its choice to the newly created session, never to another profile or chat.
  const efforts = ref(new Map<string, ReasoningEffort | "">());
  const modelChoices = ref(new Map<string, { model: string; provider: string }>());
  const effortKey = () => JSON.stringify([profile.value || "default", session.value]);
  const resumed = computed(() => {
    const saved = native.settings.value;
    return saved?.profile === profile.value &&
      saved.session === session.value &&
      saved.generation === native.generationRef.value
      ? saved.info
      : undefined;
  });
  const reasoningEffort = computed(() => {
    const saved = resumed.value?.reasoning_effort;
    return (
      efforts.value.get(effortKey()) ??
      (reasoningEfforts.includes(saved as ReasoningEffort) ? (saved as ReasoningEffort) : "")
    );
  });
  const selectedModel = computed(
    () =>
      modelChoices.value.get(effortKey())?.model ??
      (session.value ? resumed.value?.model || "" : model.value),
  );
  const selectedProvider = computed(
    () =>
      modelChoices.value.get(effortKey())?.provider ??
      (session.value ? resumed.value?.provider || provider.value : provider.value),
  );
  const branching = ref(false);
  const branchDisabled = computed(
    () =>
      branching.value ||
      !canStream.value ||
      viewApprovalPending.value ||
      viewBusy.value ||
      viewLoading.value ||
      viewReconnect.value ||
      offline.value ||
      !session.value,
  );
  async function branch(responseId: string) {
    if (branchDisabled.value) return;
    const owner = scope.generation(),
      navigation = scope.navigation(),
      p = profile.value,
      id = session.value;
    branching.value = true;
    try {
      const made = await api.branch(p, id, responseId);
      if (
        owner === scope.generation() &&
        navigation === scope.navigation() &&
        p === profile.value &&
        id === session.value
      )
        await scope.openBranch(made.id);
    } catch {
      if (owner === scope.generation() && navigation === scope.navigation())
        native.error.value = "Could not branch this response. Refresh history and try again.";
    } finally {
      branching.value = false;
    }
  }
  const nativeMode = canStream;
  const commandRunning = ref(false);
  const commandResults = ref<{ command: string; output: string }[]>([]);
  const commandScope = () =>
    JSON.stringify([
      profile.value,
      session.value,
      // Existing sessions own their workspace in Hermes. Late Project metadata
      // must not invalidate their commands; draft ownership still follows Project.
      session.value ? undefined : selectedProject.value?.id,
      !session.value && selectedProject.value ? projectRoot(selectedProject.value) : undefined,
      scope.generation(),
    ]);
  watch(
    [commandScope, scope.navigation],
    () => {
      commandResults.value = [];
    },
    { flush: "sync" },
  );
  async function discovery<T>(
    method: "commands.catalog" | "complete.slash",
    params: Record<string, unknown> = {},
  ) {
    if (offline.value || !canStream.value) throw new Error("Command discovery unavailable.");
    if (session.value) {
      if (!resumed.value)
        throw new NativeError("The selected session is not ready for commands.", "rejected");
      return native.command<T>(method, params);
    }
    // The wire schema accepts profile/session only. Its internal cwd helper is
    // not a callable draft-workspace API; execution resolves again after create.
    return NativeGatewayViewer.discover<T>(profile.value, method, params);
  }
  async function completeSlash(text: string) {
    // In the legacy pin these dynamic providers run after _session_home_scope
    // has exited. Do not offer launch-profile settings as another profile's args.
    const unsafeArguments =
      /\s/.test(text) &&
      ["skin", "personality", "tools", "handoff"].includes(parseSlash(text).name);
    const [catalog, completion] = await Promise.all([
      discovery<CommandsCatalogResult>("commands.catalog"),
      unsafeArguments
        ? Promise.resolve<CompleteSlashResult>({ items: [] })
        : discovery<CompleteSlashResult>("complete.slash", { text }),
    ]);
    if (!/\s/.test(text)) {
      const descriptions = new Map(
        (catalog.pairs || []).map(([key, description]) => [key?.toLowerCase(), description]),
      );
      // The legacy plugin completer also runs outside its explicit home scope.
      // Only the scoped catalog can authorize/describe a non-skill name here.
      completion.items = (completion.items || [])
        .filter((item) => {
          const key = `/${item.text.trim().replace(/^\//, "").toLowerCase()}`;
          return (
            item.kind === "skill" ||
            descriptions.has(key) ||
            !!catalog.commands?.[key] ||
            !!catalog.canon?.[key]
          );
        })
        .map((item) => {
          const key = `/${item.text.trim().replace(/^\//, "").toLowerCase()}`;
          return {
            ...item,
            meta:
              item.kind === "skill"
                ? (descriptions.get(key) ?? item.meta)
                : (descriptions.get(`/${canonical(catalog, key.slice(1))}`) ??
                  descriptions.get(key) ??
                  ""),
          };
        });
      // The pin's completer omits configured quick commands. Supplement from
      // the same scoped native catalog, keeping native fuzzy order first.
      const seen = new Set(
        (completion.items || []).map((item) => item.text.trim().replace(/^\//, "").toLowerCase()),
      );
      const additions = (catalog.pairs || []).filter(
        ([key]) =>
          key?.toLowerCase().startsWith(text.toLowerCase()) &&
          !seen.has(key.slice(1).toLowerCase()),
      );
      completion.items = [
        ...(completion.items || []),
        ...additions.map(([key, description]) => ({
          text: key!,
          display: key!,
          meta: description || "",
          kind: catalog.skills?.[key!] ? "skill" : "command",
        })),
      ];
    }
    return {
      catalog,
      ...completion,
      notice: unsafeArguments
        ? "Argument discovery for this command is unavailable on the pinned gateway because its dynamic provider is not profile-bound. Type arguments explicitly or use Hermes terminal."
        : !session.value && selectedProject.value && !selectedProject.value.isNoProject
          ? "Profile commands are shown. This Hermes version cannot discover project-local skills before a conversation exists; sending resolves the command in the Project workspace."
          : "",
    };
  }
  const viewMessages = computed(() => (nativeMode.value ? native.messages.value : messages.value));
  const viewBusy = computed(() => native.busy.value || native.uncertain.value);
  const viewLoading = computed(() => (nativeMode.value ? native.loading.value : chatLoading.value));
  const viewError = computed(() => (nativeMode.value ? native.error.value : chatError.value));
  const viewApprovalPending = computed(() => !!native.approval.value);
  const viewReconnect = computed(
    () => nativeMode.value && !!session.value && native.connection.value !== "ready",
  );
  const viewUnavailable = computed(() => native.uncertain.value);
  const viewActive = computed(() => native.busy.value);
  const requestDisabled = computed(() => !nativeMode.value || offline.value || viewReconnect.value);
  async function sendNative(
    text: string,
    attachments: Attachment[],
    display = text,
    nativeRoute = false,
  ) {
    if (
      composer.value.disabled ||
      branching.value ||
      viewBusy.value ||
      creating.value ||
      viewApprovalPending.value ||
      offline.value ||
      !canStream.value ||
      modelsLoading.value
    )
      return false;
    const draftKey = effortKey(),
      navigation = scope.navigation(),
      effort = reasoningEffort.value,
      draftProfile = profile.value,
      draftModel = selectedModel.value,
      draftProvider = selectedProvider.value;
    if (!session.value) {
      const created = await scope.createSession();
      if (!created)
        return navigation === scope.navigation() && profile.value === draftProfile
          ? false
          : undefined;
      if (profile.value !== draftProfile || session.value !== created) return;
      modelChoices.value.set(effortKey(), { model: draftModel, provider: draftProvider });
      if (draftKey !== effortKey()) modelChoices.value.delete(draftKey);
      if (effort) {
        efforts.value.set(effortKey(), effort);
        if (draftKey !== effortKey()) efforts.value.delete(draftKey);
      }
    }
    const current = scope.generation(),
      p = profile.value;
    const preview = [
      { type: "text", text: display },
      ...attachments.flatMap((file): unknown[] => [
        {
          type: "text",
          text: file.path ? uploadReference(file, file.path) : "📎 " + file.name,
        },
        ...(file.type.startsWith("image/")
          ? [{ type: "image_url", image_url: { url: file.data } }]
          : []),
      ]),
    ];
    try {
      await native.submit(
        display,
        async () => {
          const parts: unknown[] = [
            { type: "text", text: text || "Please examine the attached files." },
          ];
          for (const file of attachments) {
            const uploaded = file.path ? { path: file.path } : await api.upload(p, file);
            if (current !== scope.generation())
              throw new Error("Session changed before submission");
            parts.push({
              type: "text",
              text: uploadReference(file, uploaded.path),
            });
            if (file.type.startsWith("image/"))
              parts.push({ type: "image_url", image_url: { url: file.data } });
          }
          return attachments.length ? parts : text;
        },
        nativeRoute
          ? {}
          : {
              model: selectedModel.value || defaultModel.value,
              provider: selectedProvider.value || undefined,
              ...(effort ? { reasoning_effort: effort } : {}),
            },
        preview,
      );
      return true;
    } catch (cause) {
      if (current === scope.generation() && !native.uncertain.value) {
        native.error.value = cause instanceof Error ? cause.message : "Message not submitted";
        return false;
      }
    }
  }
  async function send(text: string, attachments: Attachment[] = []) {
    if (!nativeMode.value || commandRunning.value) return false;
    if (!isSlash(text)) return await sendNative(text, attachments);
    if (composer.value.disabled || viewBusy.value) return false;
    commandRunning.value = true;
    let owner = commandScope();
    let navigation = scope.navigation();
    const current = () => owner === commandScope() && navigation === scope.navigation();
    const record = (command: string, output: string) => {
      if (current())
        commandResults.value = [...commandResults.value.slice(-9), { command, output }];
    };
    let dispatched = false;
    try {
      let command = text;
      let catalog = await discovery<CommandsCatalogResult>("commands.catalog");
      if (!current()) return;
      for (let depth = 0; depth < 8; depth++) {
        const parsed = parseSlash(command);
        const name = canonical(catalog, parsed.name),
          arg = parsed.arg;
        if (!parsed.name) throw new Error("Enter a command name after /.");
        const blocked = limitation(catalog, name, arg);
        if (blocked) throw new Error(blocked);
        if (name === "steer")
          throw new Error("Use Guide this run in the composer while a response is active.");
        const reasoning = name === "reasoning" ? reasoningAction(arg) : undefined;
        if (attachments.length && ["compress", "retry", "stop", "steer", "title"].includes(name))
          throw new Error("Remove attachments before running this session command.");
        if (
          attachments.length &&
          !["plan", "learn", "init", "moa", "goal"].includes(name) &&
          !catalog.skills?.[`/${name}`]
        )
          throw new Error(
            "This command cannot be resolved safely with attachments. Remove them first, or send a normal message.",
          );
        if (name === "help" || name === "commands") {
          record(
            text,
            (catalog.pairs || [])
              .map(([key, description]) => {
                const reason = limitation(catalog, canonical(catalog, key!.slice(1)));
                return `${key} — ${description}${reason ? " (client/terminal limitation; type command for details)" : ""}`;
              })
              .join("\n") || "No commands reported by Hermes.",
          );
          return true;
        }
        if (!session.value) {
          // Unknown extensions may be project-local bundles, so resolution is
          // deliberately left to Hermes after creating the scoped session.
          if (["retry", "compress", "stop", "steer", "title"].includes(name))
            throw new Error(`/${name} needs an existing conversation.`);
          const p = profile.value;
          const draftKey = effortKey(),
            effort = reasoningEffort.value;
          const choice = { model: selectedModel.value, provider: selectedProvider.value };
          const id = await scope.createSession();
          if (!id || profile.value !== p || session.value !== id) return false;
          owner = commandScope();
          navigation = scope.navigation();
          modelChoices.value.set(effortKey(), choice);
          if (effort) efforts.value.set(effortKey(), effort);
          if (draftKey !== effortKey()) {
            modelChoices.value.delete(draftKey);
            efforts.value.delete(draftKey);
          }
          catalog = await discovery<CommandsCatalogResult>("commands.catalog");
          if (!current()) return;
          // Re-resolve against the session's own catalog, never draft metadata.
          continue;
        }
        dispatched = true;
        let result: SlashExecResult;
        if (reasoning) {
          if (reasoning.value) {
            const changed = await native.command<{
              deferred?: boolean;
              confirm_required?: boolean;
            }>("config.set", { key: "reasoning", value: reasoning.value, scope: reasoning.scope });
            if (!current()) return;
            if (changed.deferred || changed.confirm_required)
              throw new Error("Reasoning change was not applied immediately.");
          }
          const state = await native.command<{ value: string; display?: string }>("config.get", {
            key: "reasoning",
          });
          if (!current()) return;
          if (reasoning.effort) {
            const expected = ["false", "disabled"].includes(reasoning.value)
              ? "none"
              : reasoning.value;
            if (state.value !== expected) throw new Error("Reasoning change was not confirmed.");
            efforts.value.set(effortKey(), expected as ReasoningEffort);
          }
          result = {
            output: `Reasoning effort: ${state.value}${state.display ? `; display: ${state.display}` : ""}.`,
          };
        } else if (name === "compress") {
          const compressed = await native.command<SessionCompressResult>(
            "session.compress",
            arg ? { focus_topic: arg } : {},
          );
          result = {
            output:
              [
                compressed.summary?.headline,
                compressed.summary?.token_line,
                compressed.summary?.note,
                compressed.message,
              ]
                .filter(Boolean)
                .join("\n") ||
              (compressed.compressed === false
                ? "Context was not compressed."
                : "Context compression completed."),
          };
        } else if (name === "stop") {
          await native.stop();
          result = { output: "Stop requested." };
        } else if (name === "title" && arg) {
          const titled = await native.command<{ title?: string }>("session.title", { title: arg });
          result = { output: `Session title: ${titled.title || arg}` };
        } else {
          const method = commandMethod(catalog, name);
          result = await native.command<SlashExecResult>(
            method,
            method === "command.dispatch"
              ? { name, arg }
              : { command: `${name}${arg ? ` ${arg}` : ""}` },
          );
        }
        if (!current()) return;
        if (result.type === "alias") {
          if (!result.target?.trim()) throw new Error("Hermes returned an empty alias.");
          command = `/${result.target.replace(/^\//, "")}${arg ? ` ${arg}` : ""}`;
          continue;
        }
        const prompt = promptDirective(result);
        if (prompt) {
          if (result.notice) record(text, result.notice);
          // Retry rewinds durable history before returning the previous prompt.
          // Read that rewind before appending a new optimistic admission.
          if (name === "retry") {
            await native.refreshCommand();
            if (!current()) return;
          }
          // Retain the existing upload, admission, streaming and unknown-outcome
          // path. The model-facing skill body is never the optimistic bubble.
          // /moa already switched the live route and owns its post-turn restore.
          // Applying composer choices here would replace that one-turn route.
          const sent = await sendNative(
            prompt,
            attachments,
            result.display || text,
            name === "moa",
          );
          if (sent === false && current())
            record(
              text,
              "Command resolved, but its prompt was not submitted. Inspect command state before trying again.",
            );
          return sent;
        }
        if (result.type === "prefill") {
          if (result.message) await scope.suggest(result.message);
        } else if (!result.type || result.type === "exec" || result.type === "plugin") {
          if (attachments.length)
            throw new Error(
              "This command did not accept attachments; they remain in the unsent draft.",
            );
          record(
            text,
            [result.warning, result.output || "Command completed without output."]
              .filter(Boolean)
              .join("\n"),
          );
        } else throw new Error("Hermes returned an unsupported command directive.");
        if (current()) {
          // Reconstruct once from the authoritative transcript/settings after
          // control commands. This is a read, never an execution retry.
          try {
            await native.refreshCommand();
          } catch {
            record(text, "Command completed; refresh the conversation to read its updated state.");
          }
        }
        return true;
      }
      throw new Error("Command alias cycle or too many redirects.");
    } catch (cause) {
      if (current()) {
        const detail =
          cause instanceof NativeError && cause.outcome === "rejected"
            ? "Hermes refused this command or its arguments. This gateway may not support it. The command was not submitted as a prompt."
            : !dispatched && cause instanceof Error
              ? cause.message
              : "Hermes could not complete this command. Its outcome may be unknown. Inspect session state before trying again; it was not resent.";
        record(text, detail);
        return false;
      }
    } finally {
      commandRunning.value = false;
    }
  }
  async function stopResponse() {
    const owner = scope.generation();
    if (nativeMode.value) {
      try {
        await native.stop();
      } catch {
        if (owner === scope.generation()) native.error.value = "Could not stop the response.";
      }
      return;
    }
  }
  async function steerResponse(text: string) {
    const owner = scope.generation();
    if (nativeMode.value) {
      try {
        await native.steer(text);
      } catch {
        if (owner === scope.generation()) native.error.value = "Response did not accept guidance.";
      }
      return;
    }
  }

  const request = computed(() => {
    const raw = native.approval.value;
    return raw && typeof raw.request_id === "string" && typeof raw.kind === "string"
      ? normalizeRequest({ id: raw.request_id, method: raw.kind, params: raw })
      : undefined;
  });
  function requestCurrent(id: string, owner: number) {
    return owner === scope.generation() && request.value?.id === id;
  }
  async function answer(id: string, result: RequestAnswer, owner: number) {
    if (requestDisabled.value || !requestCurrent(id, owner)) return;
    try {
      await native.answer(id, { ...result });
    } catch {
      if (requestCurrent(id, owner))
        native.error.value =
          request.value?.kind === "clarify"
            ? "Clarification could not be settled."
            : request.value?.kind === "secret"
              ? "Secret request could not be settled."
              : "Approval could not be settled.";
    }
  }
  const composer = computed(() => ({
    slashScope: JSON.stringify([
      selectedProject.value?.id,
      selectedProject.value ? projectRoot(selectedProject.value) : undefined,
    ]),
    projectName:
      !composerBlocked.value && !selectedProject.value?.isNoProject
        ? selectedProject.value?.label
        : undefined,
    disabled: Boolean(
      composerBlocked.value ||
      branching.value ||
      (projectView.value && selectedProject.value?.archived) ||
      (projectView.value &&
        (!selectedProject.value ||
          (!selectedProject.value.isNoProject && !projectRoot(selectedProject.value)))) ||
      offline.value ||
      creating.value ||
      modelsLoading.value ||
      viewLoading.value ||
      viewApprovalPending.value ||
      viewUnavailable.value ||
      viewReconnect.value ||
      !canStream.value,
    ),
    reason: composerBlocked.value
      ? "Open a chat."
      : projectView.value && selectedProject.value?.archived
        ? "Restore this project to start a new chat."
        : projectView.value &&
            selectedProject.value &&
            !selectedProject.value.isNoProject &&
            !projectRoot(selectedProject.value)
          ? "This Project has no workspace."
          : offline.value
            ? "Offline · sending is unavailable."
            : viewApprovalPending.value
              ? "Approval is pending in Hermes."
              : !canStream.value
                ? "Streaming turns are unavailable for this profile."
                : undefined,
  }));
  const actions = {
    completeSlash,
    loadEarlier: () => native.loadEarlier(),
    branch,
    send,
    stop: stopResponse,
    steer: steerResponse,
    answerFor: (id: string) => {
      const owner = scope.generation();
      return (result: RequestAnswer) => answer(id, result, owner);
    },
    suggest: scope.suggest,
    setContextOpen: (open: boolean) => native.setContextOpen(open),
    retry: () => (viewReconnect.value ? native.reconnect() : scope.retryHistory()),
    resolve: () => native.resolveUncertainty(),
    setReasoningEffort: (value: ReasoningEffort | "") => {
      efforts.value.set(effortKey(), value);
    },
    setModel: (value: string) => {
      modelChoices.value.set(effortKey(), { model: value, provider: selectedProvider.value });
    },
    setProvider: (value: string) => {
      modelChoices.value.set(effortKey(), { model: selectedModel.value, provider: value });
    },
  };
  return {
    view: {
      commandRunning,
      commandResults,
      hasEarlier: native.hasEarlier,
      loadingEarlier: native.loadingEarlier,
      earlierError: native.earlierError,
      contextUsage: computed(() => (resumed.value ? native.contextUsage.value : null)),
      contextBreakdown: computed(() => (resumed.value ? native.contextBreakdown.value : null)),
      contextLoading: native.contextLoading,
      messages: viewMessages,
      branchDisabled,
      responseTargets: native.responseTargets,
      busy: viewBusy,
      loading: viewLoading,
      error: viewError,
      approvalPending: viewApprovalPending,
      reconnect: viewReconnect,
      unavailable: viewUnavailable,
      active: viewActive,
      request,
      requestDisabled,
      connection: computed(() => native.connection.value),
      status: computed(() => (nativeMode.value ? native.status.value : "")),
    },
    composer,
    actions,
    scope: {
      profile,
      session,
      offline,
      canStream,
      models,
      providers,
      modelsLoading,
      reasoningEffort,
      model: selectedModel,
      provider: selectedProvider,
      defaultModel,
      suggestedPrompt: computed(() => suggestedPrompt.value),
    },
  };
}
export type ChatContext = ReturnType<typeof useChatController>;
