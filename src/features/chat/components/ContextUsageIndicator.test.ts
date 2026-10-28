// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ContextUsageIndicator from "./ContextUsageIndicator.vue";
import ChatComposer from "./ChatComposer.vue";
const usage = {
  model: "current",
  context_used: 800,
  context_max: 1000,
  context_percent: 80,
  compressions: 2,
  context_estimated: true,
  context_source: "estimate",
};
const breakdown = {
  ...usage,
  estimated_total: 400,
  categories: [
    { id: "system_prompt", label: "System prompt", tokens: 300, color: "var(--color)" },
    { id: "future", label: "Future category", tokens: 100, color: "var(--future)" },
    { id: "memory", label: "Memory", tokens: 0, color: "var(--memory)" },
  ],
};
afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("context usage control", () => {
  it.each([
    [0, "text-emerald-200"],
    [74, "text-emerald-200"],
    [75, "text-amber-200"],
    [89, "text-amber-200"],
    [90, "text-red-200"],
    [100, "text-red-200"],
  ])("renders clockwise SVG progress for %s percent", (percent, tone) => {
    const wrapper = mount(ContextUsageIndicator, {
      props: {
        usage: { context_percent: Number(percent) },
        breakdown: null,
        loading: false,
        active: true,
      },
    });
    expect(wrapper.get('circle[pathLength="100"]').attributes("stroke-dasharray")).toBe(
      `${percent} 100`,
    );
    expect(wrapper.get("svg").classes()).toContain("-rotate-90");
    expect(wrapper.get(".context-meter").classes()).toContain(tone);
    wrapper.unmount();
  });
  it.each([null, undefined, NaN, Infinity, -1, 101, "", true])(
    "does not invent occupancy from %s or cumulative tokens",
    (value) => {
      const wrapper = mount(ContextUsageIndicator, {
        props: {
          usage: { context_percent: value, total: 90000 } as any,
          breakdown: null,
          loading: false,
          active: true,
        },
      });
      expect(wrapper.get(".context-meter").text()).toBe("—");
      expect(wrapper.findAll("circle")).toHaveLength(1);
      wrapper.unmount();
    },
  );
  it("opens on mouse hover, pins on click, dismisses outside/Escape and toggles on touch", async () => {
    vi.useFakeTimers();
    const wrapper = mount(ContextUsageIndicator, {
      attachTo: document.body,
      props: { usage, breakdown, loading: false, active: true },
    });
    const meter = wrapper.get(".context-meter");
    await meter.trigger("pointerenter", { pointerType: "touch" });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await meter.trigger("pointerenter", { pointerType: "mouse" });
    expect(wrapper.emitted("open")).toEqual([[true]]);
    expect(wrapper.get('[role="dialog"]').text()).toContain("800 / 1,000 tokens · 80%");
    expect(wrapper.get('[role="dialog"]').text()).toContain("Estimated usage");
    expect(wrapper.get('[role="dialog"]').text()).toContain("2 compressions");
    expect(wrapper.findAll("dt").map((row) => row.text())).toEqual([
      "System prompt",
      "Future category",
      "Memory",
    ]);
    expect(
      wrapper.findAll(".context-breakdown-bar > span").map((row) => row.attributes("style")),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining("width: 75%"),
        expect.stringContaining("width: 25%"),
        expect.stringContaining("width: 0%"),
      ]),
    );
    await meter.trigger("click");
    await wrapper.trigger("pointerleave");
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    await meter.trigger("click");
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await meter.trigger("click");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await meter.trigger("click");
    document.body.click();
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    wrapper.unmount();
  });
  it("shows loading and unavailable details without fabricating categories", async () => {
    const wrapper = mount(ContextUsageIndicator, {
      props: { usage: null, breakdown: null, loading: true, active: true },
    });
    await wrapper.get(".context-meter").trigger("click");
    expect(wrapper.text()).toContain("Loading context breakdown");
    await wrapper.setProps({ loading: false });
    expect(wrapper.text()).toContain("Context breakdown unavailable");
    expect(wrapper.findAll("dt")).toHaveLength(0);
    wrapper.unmount();
  });
  it.each([false, true])(
    "hides the single meter and dismisses details on textarea focus (sending %s)",
    async (sending) => {
      vi.stubGlobal("innerWidth", 390);
      const wrapper = mount(ChatComposer, {
        attachTo: document.body,
        props: {
          disabled: false,
          sending,
          sessionId: "one",
          contextUsage: usage,
          contextBreakdown: breakdown,
        },
      });
      expect(wrapper.findAll(".context-meter")).toHaveLength(1);
      await wrapper.get(".context-meter").trigger("click");
      (wrapper.get("textarea").element as HTMLTextAreaElement).focus();
      await nextTick();
      expect(wrapper.get(".context-meter").isVisible()).toBe(false);
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
      expect(document.activeElement).toBe(wrapper.get("textarea").element);
      await wrapper.get(".context-meter").trigger("pointerenter", { pointerType: "mouse" });
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
      document.body.tabIndex = -1;
      document.body.focus();
      await nextTick();
      expect(wrapper.get(".context-meter").isVisible()).toBe(true);
      wrapper.unmount();
    },
  );
});

it("distinguishes measured occupancy from the estimated category breakdown and honors source provenance", async () => {
  const wrapper = mount(ContextUsageIndicator, {
    props: {
      usage: { ...usage, context_estimated: false, context_source: "provider_usage" },
      breakdown,
      loading: false,
      active: true,
    },
  });
  await wrapper.get(".context-meter").trigger("click");
  expect(wrapper.text()).toContain("Estimated breakdown");
  expect(wrapper.text()).not.toContain("Estimated usage");
  await wrapper.setProps({
    usage: {
      ...usage,
      context_estimated: undefined,
      context_source: "provider_usage_plus_estimate",
    },
  });
  expect(wrapper.text()).toContain("Estimated usage");
  await wrapper.setProps({ usage: null });
  expect(wrapper.text()).toContain("800 / 1,000 tokens · 80%");
  wrapper.unmount();
});
