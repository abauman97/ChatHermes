// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mount as vueMount, flushPromises } from "@vue/test-utils";
import { createChatHermesRouter } from "./router";
const mount: typeof vueMount = (component, options = {}) =>
  vueMount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [...(options.global?.plugins || []), createChatHermesRouter()],
    },
  });
import { api } from "./services/hermes-api";
import App from "./App.vue";

const json = (value: unknown) =>
  new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

beforeEach(() => {
  vi.spyOn(api, "tracking").mockResolvedValue({ tracking: [], sessions: [] });
});
beforeEach(() => {
  history.replaceState({}, "", "/chathermes?profile=alpha#/?profile=alpha");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  history.replaceState({}, "", "/chathermes");
  localStorage.clear();
});

describe("project chat header", () => {
  it.each(["", "&project=wrong-project&session=wrong-session"])(
    "derives the session header from backend membership on a deep link: %s",
    async (query) => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async (input: string, init?: RequestInit) => {
          if (input.endsWith("/profiles")) return json({ profiles: [{ name: "alpha" }] });
          if (/\/projects(?:\?|$)/.test(input))
            return json({
              projects: [
                {
                  id: "p1",
                  label: "Hermes Mobile",
                  path: "/workspace",
                  sessionCount: 1,
                  repos: [
                    {
                      id: "r1",
                      label: "Repo",
                      groups: [
                        {
                          id: "g1",
                          label: "Group",
                          sessions: [{ id: "s1", title: "Investigate mobile flow" }],
                        },
                      ],
                    },
                  ],
                  previewSessions: [{ id: "s1", title: "Investigate mobile flow" }],
                  sessionIds: ["s1"],
                },
              ],
              scoped_session_ids: ["s1"],
            });
          if (input.includes("/api/sessions?"))
            return json({ sessions: [{ id: "s1", title: "Investigate mobile flow" }], total: 1 });
          if (input.includes("/capabilities")) return json({ features: {}, endpoints: {} });
          if (input.includes("/models")) return json({ data: [] });
          if (input.includes("/workspace/sessions/s1"))
            return json({ session: { id: "s1", title: "Investigate mobile flow" }, messages: [] });
          if (input.includes("/api/sessions/s1"))
            return json({ session: { id: "s1", title: "Investigate mobile flow" } });
          if (input.includes("/sessions/s1/messages")) return json({ messages: [] });
          if (input.includes("/sessions")) return json({ sessions: [], total: 0 });
          if (input.includes("/projects/detail?"))
            return json({
              project: {
                id: "p1",
                label: "Hermes Mobile",
                path: "/workspace",
                sessionCount: 1,
                repos: [
                  {
                    id: "r1",
                    label: "Repo",
                    groups: [
                      {
                        id: "g1",
                        label: "Group",
                        sessions: [{ id: "s1", title: "Investigate mobile flow" }],
                      },
                    ],
                  },
                ],
                previewSessions: [{ id: "s1", title: "Investigate mobile flow" }],
                sessionIds: ["s1"],
              },
            });
          if (input.includes("/projects/session?"))
            return json({ session: { id: "s1", title: "Investigate mobile flow" } });
          if (input.includes("/projects/") && init?.method === "POST") return json({});
          if (input.includes("/projects?") || input.endsWith("/projects"))
            return json({
              projects: [
                {
                  id: "p1",
                  label: "Hermes Mobile",
                  path: "/workspace",
                  sessionCount: 1,
                  repos: [
                    {
                      id: "r1",
                      label: "Repo",
                      groups: [
                        {
                          id: "g1",
                          label: "Group",
                          sessions: [{ id: "s1", title: "Investigate mobile flow" }],
                        },
                      ],
                    },
                  ],
                  previewSessions: [{ id: "s1", title: "Investigate mobile flow" }],
                  sessionIds: ["s1"],
                },
              ],
              scoped_session_ids: ["s1"],
            });
          return json({});
        }),
      );
      history.replaceState({}, "", "/chathermes#/chat/s1?profile=alpha" + query);
      const wrapper = mount(App);
      await flushPromises();
      expect(wrapper.get(".header-title").text()).toBe("Investigate mobile flow");
      await flushPromises();
      await flushPromises();
      expect(wrapper.get(".header-project-subtitle").text()).toBe("Hermes Mobile");
      wrapper.unmount();
    },
  );
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

// Deliberately ignore abort in these fixtures: late backend replies must still be harmless.
describe("page-owned header navigation", () => {
  const project = (id: string, label = `Project ${id}`) => ({
    id,
    label,
    path: `/workspace/${id}`,
    sessionCount: 1,
    repos: [],
    sessionIds: [id === "p1" ? "s1" : "s2"],
  });
  function setup() {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json({})),
    );
    vi.spyOn(api, "projects").mockResolvedValue({
      projects: [project("p1"), project("p2")],
      scoped_session_ids: ["s1", "s2"],
    });
    vi.spyOn(api, "project").mockImplementation(async (_profile, id) => project(id));
    vi.spyOn(api, "sessions").mockResolvedValue({
      sessions: [
        { id: "s1", title: "First conversation" },
        { id: "s2", title: "Second conversation" },
      ],
      total: 2,
    });
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    const go = async (path: string) => {
      await router.push(`${path}${path.includes("?") ? "&" : "?"}profile=alpha`);
      await flushPromises();
    };
    const title = () => wrapper.get(".header-title").text();
    const subtitle = () => wrapper.find(".header-project-subtitle").text();
    return { router, wrapper, go, title, subtitle };
  }

  it("keeps titles reactive, follows reused chat routes, and clears context on fixed pages and home", async () => {
    const { wrapper, go, title, subtitle } = setup();
    await flushPromises();
    await go("/chat/s1?session=s2&project=p2");
    expect(title()).toBe("First conversation");
    expect(subtitle()).toBe("Project p1");
    const sidebar = wrapper.findComponent({ name: "SessionSidebar" });
    vi.spyOn(api, "rename").mockResolvedValue({ id: "s1", title: "Renamed conversation" });
    sidebar.vm.$emit("rename", "s1", "Renamed conversation");
    await flushPromises();
    expect(title()).toBe("Renamed conversation");
    await go("/chat/s2");
    expect(title()).toBe("Second conversation");
    expect(subtitle()).toBe("Project p2");
    await go("/inbox");
    expect(title()).toBe("Inbox");
    expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    await go("/");
    expect(title()).toBe("ChatHermes");
    await go("/chat/unknown");
    expect(title()).toBe("Conversation");
    wrapper.unmount();
  });

  it("uses Projects with no subtitle on active and archived lists", async () => {
    const { wrapper, go, title } = setup();
    await go("/projects/p1");
    for (const path of ["/projects", "/projects?archived=1"]) {
      await go(path);
      expect(title()).toBe("Projects");
      expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    }
    wrapper.unmount();
  });

  it("returns from archived project pages through sidebar Projects and can switch to active", async () => {
    const { router, wrapper, go } = setup();
    const archived = { ...project("p1"), archived: true };
    vi.mocked(api.projects).mockResolvedValue({
      projects: [archived, project("p2")],
      scoped_session_ids: ["s1", "s2"],
    });
    vi.mocked(api.project).mockImplementation(async (_profile, id) =>
      id === "p1" ? archived : project(id),
    );
    await go("/projects?archived=1");
    await wrapper.get('.project-list button[aria-label="Project p1"]').trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.name).toBe("project");
    for (const suffix of ["", "/artifacts", "/settings", "/instructions"]) {
      // Direct navigation also covers a fresh URL without inherited list queries.
      await go(`/projects/p1${suffix}`);
      await wrapper.get(".projects-nav").trigger("click");
      await flushPromises();
      expect(router.currentRoute.value.name).toBe("projects");
      expect(router.currentRoute.value.query).toEqual({ profile: "alpha", archived: "1" });
      expect(wrapper.get(".project-list").text()).toContain("Project p1");
      expect(wrapper.get(".project-list").text()).not.toContain("Project p2");
    }
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper.get('[role="menuitemradio"]').trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query.archived).toBeUndefined();
    expect(wrapper.get(".project-list").text()).toContain("Project p2");
    await wrapper.get('.project-list button[aria-label="Project p2"]').trigger("click");
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query.archived).toBeUndefined();
    await go("/inbox?archived=1");
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query.archived).toBeUndefined();
    wrapper.unmount();
  });

  it.each(["", "/artifacts", "/settings", "/instructions"])(
    "returns to archived Projects while details are pending on %s",
    async (suffix) => {
      const { router, wrapper, go } = setup();
      const archived = { ...project("p1"), archived: true };
      vi.mocked(api.projects).mockResolvedValue({
        projects: [archived, project("p2")],
        scoped_session_ids: ["s1", "s2"],
      });
      const pending = deferred<ReturnType<typeof project>>();
      vi.mocked(api.project).mockReturnValue(pending.promise);
      await go("/projects?archived=1");
      await wrapper.get('.project-list button[aria-label="Project p1"]').trigger("click");
      await flushPromises();
      await go(`/projects/p1${suffix}`);
      expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
      await wrapper.get(".projects-nav").trigger("click");
      await flushPromises();
      expect(router.currentRoute.value.query).toEqual({ profile: "alpha", archived: "1" });
      pending.resolve(archived);
      await flushPromises();
      expect(router.currentRoute.value.name).toBe("projects");
      expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
      wrapper.unmount();
    },
  );

  it("scopes the archive fallback to the current route and profile despite late replies", async () => {
    const { router, wrapper, go } = setup();
    const archived = { ...project("p1"), archived: true };
    vi.mocked(api.projects).mockResolvedValue({
      projects: [archived, project("p2")],
      scoped_session_ids: ["s1", "s2"],
    });
    const oldDetail = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockReturnValue(oldDetail.promise);
    await go("/projects?archived=1");
    await go("/projects/p1");
    expect(wrapper.get(".projects-nav").attributes("href")).toContain("archived=1");
    await go("/projects/p2");
    oldDetail.resolve(archived);
    await flushPromises();
    expect(wrapper.get(".projects-nav").attributes("href")).not.toContain("archived=1");

    // The same ID in another profile must not inherit alpha's archived catalog.
    const betaCatalog = deferred<Awaited<ReturnType<typeof api.projects>>>();
    const betaDetail = deferred<ReturnType<typeof project>>();
    vi.mocked(api.projects).mockReturnValue(betaCatalog.promise);
    vi.mocked(api.project).mockReturnValue(betaDetail.promise);
    await router.push({ name: "project", params: { projectId: "p1" }, query: { profile: "beta" } });
    await flushPromises();
    expect(wrapper.get(".projects-nav").attributes("href")).not.toContain("archived=1");
    betaCatalog.resolve({ projects: [project("p1")], scoped_session_ids: ["s1"] });
    betaDetail.resolve(project("p1"));
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query).toEqual({ profile: "beta" });
    wrapper.unmount();
  });

  it("prefers loaded detail archive state over an older catalog entry", async () => {
    const { wrapper, go } = setup();
    vi.mocked(api.projects).mockResolvedValue({
      projects: [{ ...project("p1"), archived: true }],
      scoped_session_ids: ["s1"],
    });
    const pending = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockReturnValue(pending.promise);
    await go("/projects");
    await go("/projects/p1");
    expect(wrapper.get(".projects-nav").attributes("href")).toContain("archived=1");
    pending.resolve(project("p1"));
    await flushPromises();
    expect(wrapper.get(".projects-nav").attributes("href")).not.toContain("archived=1");
    wrapper.unmount();
  });

  it("ignores a late archived catalog and detail after switching profiles", async () => {
    const { router, wrapper, go } = setup();
    const alphaCatalog = deferred<Awaited<ReturnType<typeof api.projects>>>();
    const alphaDetail = deferred<ReturnType<typeof project>>();
    const betaCatalog = deferred<Awaited<ReturnType<typeof api.projects>>>();
    const betaDetail = deferred<ReturnType<typeof project>>();
    vi.mocked(api.projects).mockImplementation((profile) =>
      profile === "alpha" ? alphaCatalog.promise : betaCatalog.promise,
    );
    vi.mocked(api.project).mockImplementation((profile) =>
      profile === "alpha" ? alphaDetail.promise : betaDetail.promise,
    );
    await go("/projects/p1");
    await router.push({ name: "project", params: { projectId: "p1" }, query: { profile: "beta" } });
    await flushPromises();
    const archived = { ...project("p1"), archived: true };
    alphaCatalog.resolve({ projects: [archived], scoped_session_ids: ["s1"] });
    alphaDetail.resolve(archived);
    await flushPromises();
    expect(wrapper.get(".projects-nav").attributes("href")).not.toContain("archived=1");
    betaCatalog.resolve({ projects: [project("p1")], scoped_session_ids: ["s1"] });
    betaDetail.resolve(project("p1"));
    await flushPromises();
    await router.push({ name: "inbox", query: { profile: "beta", archived: "1" } });
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.query).toEqual({ profile: "beta" });
    wrapper.unmount();
  });

  it("keeps Projects and backend project subtitles across all project views and refresh", async () => {
    const { wrapper, go, title, subtitle } = setup();
    for (const suffix of ["", "/artifacts", "/settings", "/instructions"]) {
      await go(`/projects/p1${suffix}`);
      expect(title()).toBe("Projects");
      expect(subtitle()).toBe("Project p1");
      expect(wrapper.findAll("button").some((button) => button.text() === "← Projects")).toBe(
        false,
      );
    }
    await go("/projects/p1/settings");
    vi.spyOn(api, "projectManage").mockResolvedValue({});
    vi.mocked(api.project).mockResolvedValue(project("p1", "Backend renamed project"));
    await wrapper.get('.project-form input[maxlength="160"]').setValue("Requested label");
    await wrapper.get(".project-form").trigger("submit");
    await flushPromises();
    expect(title()).toBe("Projects");
    expect(subtitle()).toBe("Backend renamed project");
    await go("/projects/p1/instructions");
    expect(title()).toBe("Projects");
    expect(subtitle()).toBe("Backend renamed project");
    wrapper.unmount();
    // A fresh app/router at the current deep URL must resolve the same label.
    const refreshed = mount(App);
    await flushPromises();
    expect(refreshed.get(".header-title").text()).toBe("Projects");
    expect(refreshed.get(".header-project-subtitle").text()).toBe("Backend renamed project");
    refreshed.unmount();
  });

  it("rejects late project replies after parameter changes, fixed-page navigation, and profile remounts", async () => {
    const { router, wrapper, go, title, subtitle } = setup();
    const old = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockImplementation((_profile, id) =>
      id === "p1" ? old.promise : Promise.resolve(project(id)),
    );
    await go("/projects/p1");
    expect(title()).toBe("Projects");
    expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    await go("/projects/p2");
    expect(title()).toBe("Projects");
    expect(subtitle()).toBe("Project p2");
    old.resolve(project("p1", "Obsolete label"));
    await flushPromises();
    expect(title()).toBe("Projects");
    expect(subtitle()).toBe("Project p2");
    const leaving = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockReturnValue(leaving.promise);
    await go("/projects/p1/settings");
    await go("/scheduled");
    leaving.resolve(project("p1", "Departed label"));
    await flushPromises();
    expect(title()).toBe("Scheduled");
    expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    const alpha = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockImplementation((profile, id) =>
      profile === "alpha" ? alpha.promise : Promise.resolve(project(id, "Beta project")),
    );
    await go("/projects/p1");
    await router.push({ name: "project", params: { projectId: "p1" }, query: { profile: "beta" } });
    await flushPromises();
    expect(title()).toBe("Projects");
    expect(subtitle()).toBe("Beta project");
    alpha.resolve(project("p1", "Alpha project"));
    await flushPromises();
    expect(title()).toBe("Projects");
    expect(subtitle()).toBe("Beta project");
    wrapper.unmount();
  });
});
