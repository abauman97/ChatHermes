import type { LocationQuery, RouteLocationRaw } from "vue-router";
export type RouteName =
  | "home"
  | "chat"
  | "inbox"
  | "artifacts"
  | "projects"
  | "project"
  | "project-artifacts"
  | "project-settings"
  | "project-instructions"
  | "scheduled"
  | "scheduled-job"
  | "scheduled-run"
  | "settings";
export const identifier = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;
export function validProjectId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 4096 &&
    !Array.from(value).some((char) => char.charCodeAt(0) < 32 || char === "?" || char === "#") &&
    !value.split(/[\\/]/).some((part) => part === "." || part === "..")
  );
}
export const profileName = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
export function queryString(value: LocationQuery[string]): string {
  return typeof value === "string" ? value : "";
}
export function safeReturn(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\#\r\n]/.test(value)
  )
    return "/";
  const url = new URL(value, "https://plugin.invalid");
  if (
    url.pathname === "/settings" ||
    !/^\/(?:chat\/[^/]+|inbox|artifacts|projects(?:\/[^/]+(?:\/(?:artifacts|settings|instructions))?)?|scheduled(?:\/[^/]+(?:\/[^/]+)?)?)?$/.test(
      url.pathname,
    )
  )
    return "/";
  return url.pathname + url.search;
}
export function destination(
  name: RouteName,
  profile = "",
  session = "",
  project = "",
  extra: Record<string, string> = {},
): RouteLocationRaw {
  return {
    name,
    query: {
      ...(profile ? { profile } : {}),
      ...(session ? { session } : {}),
      ...(project ? { project } : {}),
      ...extra,
    },
  };
}
export function resolvePluginUrl(
  input: string,
  origin = window.location.origin,
): string | undefined {
  try {
    const url = new URL(input, origin);
    if (url.origin === origin && url.pathname === "/chathermes" && url.hash.startsWith("#/"))
      return url.hash.slice(1);
  } catch {
    /* Invalid notification destinations are ignored. */
  }
}
