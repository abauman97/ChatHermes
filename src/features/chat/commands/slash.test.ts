import { describe, expect, it } from "vite-plus/test";
import {
  canonical,
  commandMethod,
  isSlash,
  limitation,
  parseSlash,
  promptDirective,
} from "./slash";
const catalog = {
  canon: { "/ctx": "/context" },
  commands: {
    "/context": {},
    "/history": {},
    "/skills": { desktop_subcommands: ["pending", "diff"] },
    "/plan": {},
    "/work": { argument_mode: "text" as const },
  },
  plugin_commands: { work: "Plugin command" },
};
describe("reviewed slash boundary", () => {
  it("preserves multiline command arguments and distinguishes ordinary slash text", () => {
    expect(parseSlash("/PLAN first\n  second\n\nthird")).toEqual({
      name: "plan",
      arg: "first\n  second\n\nthird",
    });
    expect(isSlash("/plan first\nsecond")).toBe(true);
    for (const text of ["/usr/local", "explain /plan", "```/plan```", "//comment"])
      expect(isSlash(text)).toBe(false);
    expect(canonical(catalog, "ctx")).toBe("context");
  });
  it("uses metadata and reviewed parity instead of trusting catalog presence", () => {
    expect(limitation(catalog, "history")).toContain("does not support");
    expect(limitation(catalog, "skills", "install x")).toContain("pending, diff");
    expect(limitation(catalog, "skills", "pending")).toBe("");
    expect(limitation(catalog, "usage", "reset")).toContain("unavailable");
    expect(commandMethod(catalog, "plan")).toBe("command.dispatch");
    expect(commandMethod(catalog, "context")).toBe("slash.exec");
    expect(commandMethod(catalog, "work")).toBe("command.dispatch");
    expect(commandMethod(catalog, "new-dynamic-bundle")).toBe("command.dispatch");
    expect(limitation(catalog, "work")).toBe("");
  });
  it("does not treat an empty directive as a successful agent prompt", () => {
    expect(() => promptDirective({ type: "skill", message: "" })).toThrow("empty command prompt");
    expect(promptDirective({ type: "send", message: "Resolved native prompt" })).toBe(
      "Resolved native prompt",
    );
    expect(promptDirective({ output: "Output" })).toBeUndefined();
  });
});
