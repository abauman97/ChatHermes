import type {
  CommandsCatalogResult,
  SlashExecResult,
} from "../../../vendor/hermes/gateway-contract.generated";
import { gatewayCommands } from "./gateway-parity";
import { reasoningEfforts } from "../../../types/hermes";

// The pinned slash worker does not mirror reasoning to the live session.
export function reasoningAction(arg: string) {
  const words = arg.toLowerCase().split(/\s+/).filter(Boolean);
  const scope = words.includes("--global") ? "global" : "session";
  const value = words.filter((word) => !["--global", "--session"].includes(word)).join(" ");
  if (!arg.trim()) return { scope, value: "", effort: false };
  const effort =
    reasoningEfforts.includes(value as (typeof reasoningEfforts)[number]) ||
    ["false", "disabled"].includes(value);
  if (
    !effort &&
    !["show", "on", "hide", "off", "full", "all", "clamp", "collapse", "short"].includes(value)
  )
    throw new Error(
      "Use /reasoning with an effort level, show, hide, full or clamp; optionally --global or --session.",
    );
  return { scope, value, effort };
}

export const isSlash = (text: string) => /^\/[^\s/]*(?:\s|$)/.test(text);
export function parseSlash(text: string) {
  const match = /^\/([^\s/]+)([\s\S]*)$/.exec(text);
  return { name: match?.[1]?.toLowerCase() || "", arg: match?.[2]?.trim() || "" };
}
const local = new Set(["help", "commands", "retry", "compress", "stop", "steer", "title"]);
// Desktop owns these modes rather than inheriting the legacy CLI's hints.
// Keep the rest in the session/profile-scoped native registry.
export function argumentMode(catalog: CommandsCatalogResult, name: string) {
  const command = canonical(catalog, name);
  if (["compress", "title", "steer"].includes(command)) return "text";
  if (command === "reasoning") return "options";
  return catalog.commands?.[`/${command}`]?.argument_mode ?? null;
}
export function canonical(catalog: CommandsCatalogResult, name: string) {
  return (catalog.canon?.[`/${name}`] || `/${name}`).replace(/^\//, "");
}
export function limitation(catalog: CommandsCatalogResult, name: string, arg = "") {
  const key = `/${name}`;
  const meta = catalog.commands?.[key];
  const builtin =
    gatewayCommands.has(name) || (!!meta && !Object.hasOwn(catalog.plugin_commands || {}, name));
  if (local.has(name)) return "";
  if (builtin && (!gatewayCommands.has(name) || (meta?.desktop && meta.desktop !== "hidden")))
    return `/${name} requires a client or terminal feature that ChatHermes does not support. Use the existing dashboard controls or Hermes terminal.`;
  if (meta?.desktop_subcommands && !meta.desktop_subcommands.includes(arg.split(/\s/)[0] || ""))
    return `/${name} supports these arguments here: ${meta.desktop_subcommands.join(", ")}.`;
  // The legacy worker is broader than the shared gateway parity boundary.
  if (
    (["usage", "suggestions", "profile"].includes(name) && arg) ||
    (name === "cron" && arg && arg !== "list") ||
    (name === "voice" && arg.toLowerCase() === "tts")
  )
    return `This /${name} form is unavailable in ChatHermes. Use the Hermes terminal.`;
  return "";
}
export function commandMethod(catalog: CommandsCatalogResult, name: string) {
  // These built-ins produce directives in the pinned legacy gateway, without
  // invoking its worker. Extensions (including bundles) resolve there too.
  return ["goal", "loop", "plan", "learn", "init", "moa", "retry"].includes(name) ||
    !catalog.commands?.[`/${name}`] ||
    Object.hasOwn(catalog.plugin_commands || {}, name)
    ? "command.dispatch"
    : "slash.exec";
}
export function promptDirective(result: SlashExecResult) {
  if (result.type !== "send" && result.type !== "skill") return;
  if (typeof result.message !== "string" || !result.message.trim())
    throw new Error("Hermes returned an empty command prompt.");
  return result.message;
}
