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

  it("keeps backend project labels across all project views and refresh", async () => {
    const { wrapper, go, title } = setup();
    for (const suffix of ["", "/artifacts", "/settings", "/instructions"]) {
      await go(`/projects/p1${suffix}`);
      expect(title()).toBe("Project p1");
      expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    }
    await go("/projects/p1/settings");
    vi.spyOn(api, "projectManage").mockResolvedValue({});
    vi.mocked(api.project).mockResolvedValue(project("p1", "Backend renamed project"));
    await wrapper.get('.project-form input[maxlength="160"]').setValue("Requested label");
    await wrapper.get(".project-form").trigger("submit");
    await flushPromises();
    expect(title()).toBe("Backend renamed project");
    await go("/projects/p1/instructions");
    expect(title()).toBe("Backend renamed project");
    wrapper.unmount();
    // A fresh app/router at the current deep URL must resolve the same label.
    const refreshed = mount(App);
    await flushPromises();
    expect(refreshed.get(".header-title").text()).toBe("Backend renamed project");
    refreshed.unmount();
  });

  it("rejects late project replies after parameter changes, fixed-page navigation, and profile remounts", async () => {
    const { router, wrapper, go, title } = setup();
    const old = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockImplementation((_profile, id) =>
      id === "p1" ? old.promise : Promise.resolve(project(id)),
    );
    await go("/projects/p1");
    expect(title()).toBe("Project");
    await go("/projects/p2");
    expect(title()).toBe("Project p2");
    old.resolve(project("p1", "Obsolete label"));
    await flushPromises();
    expect(title()).toBe("Project p2");
    const leaving = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockReturnValue(leaving.promise);
    await go("/projects/p1/settings");
    await go("/scheduled");
    leaving.resolve(project("p1", "Departed label"));
    await flushPromises();
    expect(title()).toBe("Scheduled");
    const alpha = deferred<ReturnType<typeof project>>();
    vi.mocked(api.project).mockImplementation((profile, id) =>
      profile === "alpha" ? alpha.promise : Promise.resolve(project(id, "Beta project")),
    );
    await go("/projects/p1");
    await router.push({ name: "project", params: { projectId: "p1" }, query: { profile: "beta" } });
    await flushPromises();
    expect(title()).toBe("Beta project");
    alpha.resolve(project("p1", "Alpha project"));
    await flushPromises();
    expect(title()).toBe("Beta project");
    wrapper.unmount();
  });
});
