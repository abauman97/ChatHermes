import { computed, nextTick, onBeforeUnmount, ref, useId, watch, type Ref } from "vue";
import type {
  CommandsCatalogResult,
  CompleteSlashResult,
  CompletionItem,
} from "../../../vendor/hermes/gateway-contract.generated";
import { argumentMode, canonical, isSlash, limitation, parseSlash } from "./slash";
export type SlashCompletion = CompleteSlashResult & {
  catalog: CommandsCatalogResult;
  notice?: string;
};
export type SlashComplete = (text: string) => Promise<SlashCompletion>;

export function useSlashCompletion(
  value: Ref<string>,
  scope: () => unknown,
  complete: () => SlashComplete | undefined,
  area: Ref<HTMLTextAreaElement | undefined>,
) {
  const open = ref(false),
    loading = ref(false),
    error = ref("");
  const items = ref<(CompletionItem & { group: string; limitation: string })[]>([]);
  const selected = ref(0),
    explicit = ref(false);
  const catalog = ref<CommandsCatalogResult>({});
  const directive = ref<{ text: string; kind: string } | null>(null);
  // The canonical draft includes the invocation exactly once. The native
  // textarea edits only its suffix while the accepted invocation is a chip.
  const inputOffset = computed(() => {
    const token = directive.value?.text;
    if (!token || !(value.value === token || value.value.startsWith(token + " "))) return 0;
    return token.length + (value.value[token.length] === " " ? 1 : 0);
  });
  const input = computed({
    get: () => value.value.slice(inputOffset.value),
    set: (text: string) => {
      value.value = value.value.slice(0, inputOffset.value) + text;
    },
  });
  const menuId = `slash-${useId()}`;
  let revision = 0,
    timer: ReturnType<typeof setTimeout> | undefined;
  let active = false;
  let replaceFrom = 1,
    requestText = "",
    requestCursor = 0,
    requestStart = 0;
  const cursor = ref<number | null>(null);
  const prefix = computed(() =>
    value.value.slice(0, Math.min(cursor.value ?? value.value.length, value.value.length)),
  );
  const trigger = computed(() => {
    const before = prefix.value;
    // Inline skills take priority over a leading command's argument tail:
    // /goal use /work must complete the skill rather than goal subcommands.
    const match = /\s(\/(?:[a-zA-Z][\w-]*)?)$/.exec(before);
    if (match) return { text: match[1]!, start: before.length - match[1]!.length, inline: true };
    if (isSlash(before) && !before.includes("\n")) return { text: before, start: 0, inline: false };
    return null;
  });
  const mode = computed(() =>
    argumentMode(catalog.value, parseSlash(trigger.value?.text || "").name),
  );
  const argStage = computed(() => /\s/.test(trigger.value?.text || ""));
  const freeText = computed(() => argStage.value && ["text", "mixed"].includes(mode.value || ""));
  function updateCursor() {
    cursor.value = area.value ? area.value.selectionStart + inputOffset.value : value.value.length;
  }
  function close() {
    active = false;
    revision++;
    clearTimeout(timer);
    open.value = false;
    loading.value = false;
    items.value = [];
  }
  watch(scope, () => {
    catalog.value = {};
    directive.value = null;
  });
  watch(value, (text) => {
    if (
      directive.value &&
      !(text === directive.value.text || text.startsWith(`${directive.value.text} `))
    )
      directive.value = null;
  });
  watch([value, scope, cursor], () => {
    close();
    const callback = complete();
    const text = value.value;
    const found = trigger.value;
    if (!callback || !found) return;
    const before = found.text;
    if (!found.inline && directive.value && prefix.value.length >= directive.value.text.length)
      return;
    if (argStage.value && mode.value === "text") return;
    active = true;
    open.value = true;
    loading.value = true;
    error.value = "";
    selected.value = 0;
    explicit.value = false;
    const position = prefix.value.length;
    const current = revision;
    timer = setTimeout(async () => {
      try {
        const result = await callback(before);
        if (revision !== current) return;
        catalog.value = result.catalog;
        requestText = text;
        requestCursor = position;
        requestStart = found.start;
        const column = result.replace_from ?? 1;
        if (!Number.isInteger(column) || column < 0 || column > Array.from(before).length)
          throw new Error();
        // Python columns count Unicode code points; textarea offsets use UTF-16.
        replaceFrom = Array.from(before).slice(0, column).join("").length;
        const parsed = parseSlash(before);
        items.value = (result.items || [])
          .filter((item) => !found.inline || item.kind === "skill")
          .map((item) => {
            const name = canonical(
              result.catalog,
              parseSlash(item.text.startsWith("/") ? item.text : `/${item.text}`).name,
            );
            const category = result.catalog.categories?.find((group) =>
              group.pairs?.some(([key]) => key?.toLowerCase() === `/${name}`),
            );
            return {
              ...item,
              group:
                replaceFrom > 1
                  ? "Arguments"
                  : item.kind === "skill"
                    ? "Skills and bundles"
                    : category?.name || "Commands",
              limitation:
                replaceFrom > 1
                  ? limitation(result.catalog, canonical(result.catalog, parsed.name), item.text)
                  : limitation(result.catalog, name),
            };
          });
        if (result.catalog.warning)
          error.value =
            "Some command sources are unavailable or have naming conflicts. Hermes may omit affected commands.";
        if (result.notice) error.value = result.notice;
        // Text arguments have no picker. Empty finite/mixed results must not
        // trap Enter, but retain genuine discovery notices for inspection.
        if (argStage.value && (mode.value === "text" || !items.value.length) && !error.value)
          open.value = false;
      } catch {
        if (revision === current)
          error.value =
            "Command discovery unavailable. Ordinary messages still work; slash commands will not be sent as prompts.";
      } finally {
        if (revision === current) loading.value = false;
      }
    }, 100);
  });
  onBeforeUnmount(close);
  function fullText(item: CompletionItem) {
    const start = replaceFrom === 1 && item.text.startsWith("/") ? 0 : replaceFrom;
    return requestText.slice(requestStart, requestStart + start) + item.text;
  }
  async function place(text: string, position: number, keepOpen: boolean) {
    cursor.value = position;
    value.value = text;
    await nextTick();
    if (!keepOpen) close();
    area.value?.focus({ preventScroll: true });
    const visiblePosition = Math.max(0, position - inputOffset.value);
    area.value?.setSelectionRange(visiblePosition, visiblePosition);
  }
  async function accept(index = selected.value) {
    const item = items.value[index];
    if (
      !item ||
      requestText !== value.value ||
      requestCursor !== prefix.value.length ||
      loading.value
    )
      return;
    const token = fullText(item).trimEnd();
    const name = parseSlash(token).name;
    const nextMode = argumentMode(catalog.value, name);
    const expands = requestStart === 0 && !/\s/.test(token) && nextMode !== null;
    const suffix = value.value.slice(requestCursor);
    // A completed directive carries one separating space; don't duplicate an
    // existing suffix separator. Argument-taking commands descend without a pill.
    const inserted = requestText.slice(0, requestStart) + token + (/^\s/.test(suffix) ? "" : " ");
    if (!expands && requestStart === 0)
      directive.value = { text: token, kind: item.kind === "skill" ? "Skill" : "Command" };
    await place(inserted + suffix, inserted.length, expands && nextMode !== "text");
  }
  function implicitIndex() {
    if (explicit.value) return selected.value;
    const typed = (trigger.value?.text || "").trimEnd().toLowerCase();
    if (typed === "/") return -1;
    const texts = items.value.map((item) => fullText(item).trimEnd().toLowerCase());
    const exact = texts.indexOf(typed);
    if (exact >= 0) return exact;
    if (texts[selected.value]?.startsWith(typed)) return selected.value;
    const matches = texts.flatMap((text, index) => (text.startsWith(typed) ? [index] : []));
    return matches.length === 1 ? matches[0]! : -1;
  }
  function keydown(event: KeyboardEvent) {
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return false;
    if (
      directive.value &&
      event.key === "Backspace" &&
      area.value?.selectionStart === 0 &&
      area.value.selectionEnd === 0
    ) {
      event.preventDefault();
      void editDirective();
      return true;
    }
    if (event.key === "Escape" && open.value) {
      event.preventDefault();
      close();
      return true;
    }
    if (open.value && ["ArrowDown", "ArrowUp"].includes(event.key) && items.value.length) {
      event.preventDefault();
      explicit.value = true;
      selected.value =
        (selected.value + (event.key === "ArrowDown" ? 1 : -1) + items.value.length) %
        items.value.length;
      void nextTick(() =>
        document
          .getElementById(`${menuId}-${selected.value}`)
          ?.scrollIntoView?.({ block: "nearest" }),
      );
      return true;
    }
    if (open.value && event.key === "Tab" && loading.value) {
      event.preventDefault();
      return true;
    }
    const accepts =
      event.key === "Tab" ||
      ((event.key === "Enter" || event.key === " ") &&
        (!freeText.value || (event.key === "Enter" && explicit.value)));
    if (open.value && items.value.length && accepts) {
      const index = event.key === "Tab" ? selected.value : implicitIndex();
      if (index >= 0) {
        event.preventDefault();
        void accept(index);
        return true;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        return true;
      }
    }
    // Exact finite arguments disappear from native suggestions. Space/Tab
    // commit the verbatim directive; Enter submits through the normal gate.
    if (
      active &&
      !loading.value &&
      !items.value.length &&
      argStage.value &&
      mode.value === "options" &&
      [" ", "Tab"].includes(event.key)
    ) {
      event.preventDefault();
      const token = prefix.value.trimEnd();
      directive.value = { text: token, kind: "Command" };
      const suffix = value.value.slice(prefix.value.length);
      const inserted = token + (/^\s/.test(suffix) ? "" : " ");
      void place(inserted + suffix, inserted.length, false);
      return true;
    }
    // An unavailable name picker keeps its discovery explanation inspectable.
    if (
      open.value &&
      !argStage.value &&
      !items.value.length &&
      (loading.value || !!error.value) &&
      ["Enter", "Tab"].includes(event.key)
    ) {
      event.preventDefault();
      return true;
    }
    return false;
  }
  async function editDirective() {
    const end = directive.value?.text.length;
    directive.value = null;
    close();
    await nextTick();
    area.value?.focus({ preventScroll: true });
    if (end !== undefined) area.value?.setSelectionRange(0, end);
  }
  return {
    input,
    open,
    loading,
    error,
    items,
    selected,
    menuId,
    directive,
    editDirective,
    accept,
    close,
    keydown,
    updateCursor,
    activeId: computed(() =>
      open.value && items.value.length ? `${menuId}-${selected.value}` : undefined,
    ),
  };
}
