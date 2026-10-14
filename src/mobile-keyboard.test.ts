// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { watchMobileKeyboardSpacing } from "./mobile-keyboard";

describe("mobile keyboard spacing", () => {
  let initialActiveElement: PropertyDescriptor | undefined;
  let initialVisualViewport: PropertyDescriptor | undefined;
  let initialInnerWidth: PropertyDescriptor | undefined;
  let initialInnerHeight: PropertyDescriptor | undefined;

  afterEach(() => {
    document.body.replaceChildren();
    for (const [target, key, descriptor] of [
      [document, "activeElement", initialActiveElement],
      [window, "visualViewport", initialVisualViewport],
      [window, "innerWidth", initialInnerWidth],
      [window, "innerHeight", initialInnerHeight],
    ] as const) {
      if (descriptor) Object.defineProperty(target, key, descriptor);
      else Reflect.deleteProperty(target, key);
    }
    initialActiveElement = undefined;
    initialVisualViewport = undefined;
    initialInnerWidth = undefined;
    initialInnerHeight = undefined;
    vi.restoreAllMocks();
  });

  it("toggles only for a focused editable and restores spacing when dismissed", () => {
    const root = document.createElement("div");
    document.body.append(root);
    initialActiveElement = Object.getOwnPropertyDescriptor(document, "activeElement");
    initialVisualViewport = Object.getOwnPropertyDescriptor(window, "visualViewport");
    initialInnerWidth = Object.getOwnPropertyDescriptor(window, "innerWidth");
    initialInnerHeight = Object.getOwnPropertyDescriptor(window, "innerHeight");
    let activeElement: Element | null = null;
    const viewport = Object.assign(new EventTarget(), { height: 800 });
    Object.defineProperty(document, "activeElement", {
      configurable: true,
      get: () => activeElement,
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: viewport as unknown as VisualViewport,
    });

    const textarea = document.createElement("textarea");
    document.body.append(textarea);
    const cleanup = watchMobileKeyboardSpacing(root);
    expect(root.classList.contains("keyboard-visible")).toBe(false);
    viewport.height = 450;
    viewport.dispatchEvent(new Event("resize"));
    expect(root.classList.contains("keyboard-visible")).toBe(false);

    activeElement = textarea;
    document.dispatchEvent(new Event("focusin"));
    expect(root.classList.contains("keyboard-visible")).toBe(true);
    viewport.height = 760;
    viewport.dispatchEvent(new Event("resize"));
    expect(root.classList.contains("keyboard-visible")).toBe(false);

    cleanup();
    root.remove();
    textarea.remove();
  });

  it("removes listeners and clears the state on cleanup", () => {
    const root = document.createElement("div");
    root.classList.add("keyboard-visible");
    initialVisualViewport = Object.getOwnPropertyDescriptor(window, "visualViewport");
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    Object.defineProperty(window, "visualViewport", { configurable: true, value: null });

    const cleanup = watchMobileKeyboardSpacing(root);
    expect(root.classList.contains("keyboard-visible")).toBe(false);
    cleanup();
  });
});
