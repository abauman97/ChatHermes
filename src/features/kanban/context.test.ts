// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import { provideKanban } from "./context";
import { api } from "./api";
vi.mock("./api", () => ({ api: { boards: vi.fn() } }));
const wrappers: ReturnType<typeof mount>[] = [];
beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  vi.useRealTimers();
  vi.restoreAllMocks();
});
function setup() {
  let feature!: ReturnType<typeof provideKanban>;
  const offline = ref(false);
  const wrapper = mount(
    defineComponent({
      setup() {
        feature = provideKanban(offline);
        return () => h("div", feature.visible.value ? "Kanban navigation" : "");
      },
    }),
  );
  wrappers.push(wrapper);
  return { feature, offline, wrapper };
}
describe("Kanban global preference and availability", () => {
  it("defaults off, gates enabling on a valid authenticated API, persists independently of profiles", async () => {
    vi.mocked(api.boards).mockResolvedValue({ boards: [{ slug: "default" }], current: "default" });
    const { feature, wrapper } = setup();
    feature.setEnabled(true);
    expect(feature.enabled.value).toBe(false);
    await flushPromises();
    expect(feature.available.value).toBe(true);
    expect(wrapper.text()).toBe("");
    feature.setEnabled(true);
    await flushPromises();
    expect(wrapper.text()).toBe("Kanban navigation");
    expect(localStorage.getItem("chathermes.kanban-viewer")).toBe("true");
    // A healthy periodic recheck must not unmount the viewer.
    const checking = feature.check();
    expect(feature.visible.value).toBe(true);
    await checking;
    feature.setEnabled(false);
    await flushPromises();
    expect(wrapper.text()).toBe("");
  });
  it("fails closed on absent plugins, malformed responses, offline and revoked availability", async () => {
    vi.mocked(api.boards).mockRejectedValue(new Error("404"));
    const { feature, offline } = setup();
    await flushPromises();
    feature.setEnabled(true);
    expect(feature.enabled.value).toBe(false);
    vi.mocked(api.boards).mockResolvedValue({ boards: [{ slug: "one" }], current: "one" });
    await feature.check();
    feature.setEnabled(true);
    offline.value = true;
    await flushPromises();
    expect(feature.visible.value).toBe(false);
    offline.value = false;
    await flushPromises();
    expect(feature.visible.value).toBe(true);
    vi.mocked(api.boards).mockResolvedValue({} as never);
    await feature.check();
    expect(feature.available.value).toBe(false);
    expect(feature.visible.value).toBe(false);
    expect(feature.enabled.value).toBe(true);
    vi.mocked(api.boards).mockRejectedValue(new Error("401"));
    await feature.check();
    expect(feature.available.value).toBe(false);
  });
});
