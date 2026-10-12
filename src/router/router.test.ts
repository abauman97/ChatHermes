// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { createMemoryHistory } from "vue-router";
import { createPluginHistory } from "./history";
import { createChatHermesRouter } from "./index";
import { resolvePluginUrl, safeReturn } from "./links";
beforeEach(() =>
  history.replaceState(
    { usr: { host: true }, key: "host-key", idx: 7, extra: "kept" },
    "",
    "/chathermes?host=kept",
  ),
);
afterEach(() => vi.restoreAllMocks());
describe("plugin routing", () => {
  it.each([
    ["/", "home"],
    ["/chat/s1", "chat"],
    ["/artifacts", "artifacts"],
    ["/projects", "projects"],
    ["/projects/p1", "project"],
    ["/projects/p1/artifacts", "project-artifacts"],
    ["/projects/p1/settings", "project-settings"],
    ["/projects/p1/instructions", "project-instructions"],
    ["/scheduled", "scheduled"],
    ["/scheduled/j1", "scheduled-job"],
    ["/scheduled/j1/output:2026-01-01", "scheduled-run"],
    ["/settings", "settings"],
  ])("resolves %s", async (path, name) => {
    const router = createChatHermesRouter(createMemoryHistory());
    await router.push(path + "?profile=alpha");
    expect(router.currentRoute.value.name).toBe(name);
    expect(router.currentRoute.value.query.profile).toBe("alpha");
  });
  it.each([
    "?session=s1",
    "?profile=alpha&session=s1",
    "?project=p1",
    "?view=projects&archived=1",
    "?view=scheduled&job=j1&scheduled_run=old",
    "?view=settings&return_view=projects",
  ])("rejects the removed query route %s", (query) => {
    expect(resolvePluginUrl(location.origin + "/chathermes" + query)).toBeUndefined();
  });
  it("resolves only same-origin canonical hash destinations", () => {
    expect(
      resolvePluginUrl(
        location.origin + "/chathermes?session=stale&profile=old#/chat/new?profile=alpha",
      ),
    ).toBe("/chat/new?profile=alpha");
    expect(resolvePluginUrl("https://elsewhere.test/chathermes#/chat/s1")).toBeUndefined();
    expect(resolvePluginUrl(location.origin + "/sessions#/chat/s1")).toBeUndefined();
    expect(resolvePluginUrl(location.origin + "/chathermes")).toBeUndefined();
  });
  it.each([
    "//evil.test",
    "https://evil.test",
    "/settings",
    "/chat/s1#x",
    "/../login",
    "/chat/s1\\evil",
  ])("rejects unsafe Settings return %s", (value) => expect(safeReturn(value)).toBe("/"));
  it("rejects malformed routes, arrays, and duplicate navigation", async () => {
    const router = createChatHermesRouter(createMemoryHistory());
    await router.push("/chat/s1?profile=alpha&profile=beta");
    expect(router.currentRoute.value.name).toBe("home");
    await router.push("/chat/%2Fbad");
    expect(router.currentRoute.value.name).toBe("home");
    await router.push("/projects?archived=1");
    await router.push("/projects?archived=1");
    expect(router.currentRoute.value.query.archived).toBe("1");
  });
});
describe("host history", () => {
  it("namespaces plugin state while preserving host state and index/key conventions", () => {
    const plugin = createPluginHistory();
    plugin.replace("/?profile=alpha", { replacement: true });
    expect(history.state).toMatchObject({
      usr: { host: true },
      idx: 7,
      key: "host-key",
      extra: "kept",
      chathermes: { position: 0 },
    });
    plugin.push("/projects", { marker: "plugin" });
    expect(history.state).toMatchObject({
      usr: { host: true },
      idx: 8,
      extra: "kept",
      chathermes: { position: 1 },
    });
    expect(history.state.key).not.toBe("host-key");
    expect(location.pathname).toBe("/chathermes");
    expect(location.search).toBe("?host=kept");
    expect(plugin.createHref("/settings")).toBe("/chathermes?host=kept#/settings");
    plugin.destroy();
    plugin.destroy();
  });
  it("traverses, suppresses duplicate hash events, and leaves host navigation alone", () => {
    const plugin = createPluginHistory(),
      listener = vi.fn();
    plugin.replace("/");
    const previous = history.state;
    plugin.push("/projects");
    plugin.listen(listener);
    history.replaceState(previous, "", "/chathermes#/");
    dispatchEvent(new PopStateEvent("popstate", { state: previous }));
    dispatchEvent(new HashChangeEvent("hashchange"));
    expect(listener).toHaveBeenCalledExactlyOnceWith("/", "/projects", {
      delta: -1,
      type: "pop",
      direction: "back",
    });
    history.replaceState({ idx: 9 }, "", "/settings");
    dispatchEvent(new PopStateEvent("popstate"));
    expect(listener).toHaveBeenCalledTimes(1);
    plugin.push("/artifacts");
    expect(location.pathname).toBe("/settings");
    plugin.destroy();
    history.replaceState({}, "", "/chathermes#/artifacts");
    dispatchEvent(new PopStateEvent("popstate"));
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it("supports go without notifying listeners", () => {
    const plugin = createPluginHistory(),
      listener = vi.fn();
    plugin.listen(listener);
    const go = vi.spyOn(history, "go").mockImplementation(() => {});
    plugin.go(-1, false);
    expect(go).toHaveBeenCalledWith(-1);
    history.replaceState({}, "", "/chathermes#/projects");
    dispatchEvent(new PopStateEvent("popstate"));
    expect(listener).not.toHaveBeenCalled();
    plugin.destroy();
  });
  it("opens a canonical entry without adding history or losing host metadata", async () => {
    history.replaceState(
      { usr: { host: true }, idx: 4, key: "entry" },
      "",
      "/chathermes?profile=alpha#/chat/s1?profile=alpha",
    );
    const length = history.length,
      router = createChatHermesRouter();
    await router.push(router.options.history.location);
    expect(location.hash).toContain("/chat/s1");
    expect(location.search).toBe("?profile=alpha");
    expect(history.length).toBe(length);
    expect(history.state).toMatchObject({ usr: { host: true }, idx: 4, key: "entry" });
    router.options.history.destroy();
  });
});

it("recovers a canonical document-entry hash rewritten by host profile hydration", async () => {
  history.replaceState(
    { idx: 0, key: "host", usr: null },
    "",
    "/chathermes?view=projects&profile=default",
  );
  const router = createChatHermesRouter(
    undefined,
    location.origin + "/chathermes?view=projects#/settings?return_to=%2Fprojects",
  );
  await router.push(router.options.history.location);
  expect(router.currentRoute.value.name).toBe("settings");
  expect(location.search).toBe("?view=projects&profile=default");
  expect(location.hash).toContain("/settings");
  router.options.history.destroy();
});

it("accepts path-shaped project IDs and rejects traversal-shaped project hints", async () => {
  const router = createChatHermesRouter(createMemoryHistory());
  await router.push("/projects/%2Fauto%2Frepo");
  expect(router.currentRoute.value.params.projectId).toBe("/auto/repo");
  await router.push("/projects/%2Fauto%2F..%2Frepo");
  expect(router.currentRoute.value.name).toBe("home");
});
