// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { flushPromises, mount as vueMount } from "@vue/test-utils";
import { createChatHermesRouter } from "./router";
function routeUrl() {
  return new URL(location.hash.slice(1) || "/", location.origin);
}
function routeSession() {
  return routeUrl().pathname.startsWith("/chat/")
    ? decodeURIComponent(routeUrl().pathname.slice(6))
    : null;
}
function routeProject() {
  return /^\/projects\/([^/]+)/.exec(routeUrl().pathname)?.[1] || null;
}
const mount: typeof vueMount = (component, options = {}) =>
  vueMount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [...(options.global?.plugins || []), createChatHermesRouter()],
    },
  });
import App from "./App.vue";
import ChatComposer from "./features/chat/components/ChatComposer.vue";
import { NativeGatewayViewer } from "./features/chat/runtime/native-gateway";
import SessionSidebar from "./features/sessions/components/SessionSidebar.vue";
import * as nativeSession from "./features/chat/runtime/native-session";
import { api } from "./services/hermes-api";
import { projectRoot, projectSessions } from "./features/projects/utils/projects";
import type { Project, ProjectTree } from "./types/hermes";
const nativeFactory = nativeSession.useNativeSession;
let nativeOwner: ReturnType<typeof nativeFactory>;
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.spyOn(api, "tracking").mockResolvedValue({ tracking: [], sessions: [] });
});
beforeEach(() => {
  vi.spyOn(nativeSession, "useNativeSession").mockImplementation((callback) => {
    const owner = (nativeOwner = nativeFactory(callback));
    owner.attach = vi.fn(async (profile, id) => {
      owner.connection.value = "ready";
      owner.messages.value = await api.messages(profile, id);
    });
    owner.submit = vi.fn();
    return owner;
  });
});
const a: Project = {
  id: "p_a",
  label: "Project A",
  path: "/workspace/a",
  sessionCount: 1,
  repos: [
    {
      id: "repo",
      label: "Repo",
      path: "/repo",
      groups: [
        {
          id: "worktree",
          label: "Outside worktree",
          path: "/elsewhere/worktree",
          sessions: [
            {
              id: "project_s1",
              title: "Native worktree chat",
              preview: "Actual workspace preview",
              cwd: "/elsewhere/worktree",
              last_active: 3,
            },
          ],
        },
      ],
    },
  ],
};
const b: Project = { id: "p_b", label: "Project B", sessionCount: 0, repos: [] };
const auto: Project = {
  ...b,
  id: "/auto/repo",
  label: "Automatic repo",
  isAuto: true,
  repos: [{ id: "repo", label: "Repo", path: "/auto/repo", groups: [] }],
};
const home: Project = { ...b, id: "home", label: "Home", isNoProject: true };
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  history.replaceState({}, "", "/chathermes");
});
function setup(
  detail: (id: string) => Promise<Response> = async (id) =>
    json({ project: [a, b, auto, home].find((p) => p.id === id) }),
) {
  let created = false;
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.includes("/profiles")) return json({ profiles: [{ name: "alpha" }, { name: "beta" }] });
    if (url.includes("/scheduled")) return json({ jobs: [] });
    if (url.includes("/projects/session?")) {
      created = true;
      return json(
        {
          session: {
            id: "project_created",
            source: "desktop",
            cwd: "/workspace/a",
            workspace_rpc: true,
          },
        },
        201,
      );
    }
    if (/\/projects(?:\?|$)/.test(url))
      return json({
        projects: [
          created ? { ...a, sessionIds: ["project_s1", "project_created"] } : a,
          b,
          auto,
          home,
        ],
        scoped_session_ids: ["project_s1"],
      });
    if (url.includes("/projects/"))
      return detail(new URL(url, "http://dashboard.test").searchParams.get("project_id")!);
    if (url.includes("/capabilities"))
      return json({
        features: { native_chat: true },
      });
    if (url.includes("/v1/models")) return json({ data: [] });
    if (url.includes("/model/options")) return json({ providers: [] });
    if (url.includes("/api/sessions/project_created/messages")) return json({}, 404);
    if (url.includes("/messages"))
      return json({ messages: [{ role: "assistant", content: "Native chat history" }] });
    if (/\/api\/sessions\/project_created(?:\?|$)/.test(url))
      return json({
        object: "hermes.session",
        session: { id: "project_created", message_count: 0 },
      });
    if (init?.method === "POST") return json({ session: { id: "other_created" } }, 201);
    // Deliberately same cwd as A but not claimed by the tree: frontend must not classify it.
    return json({
      sessions: [
        { id: "s1", title: "Ungrouped", cwd: a.path, message_count: 2 },
        { id: "project_s1", title: "Native worktree chat" },
        ...(created ? [{ id: "project_created", message_count: 0 }] : []),
      ],
      total: 2,
    });
  });
  vi.stubGlobal("fetch", fetch);
  return fetch;
}
describe("authoritative gateway Projects", () => {
  async function toggleAutomatic(wrapper: ReturnType<typeof mount>, checked: boolean) {
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    const toggle = wrapper.get('[role="menuitemcheckbox"]');
    expect(toggle.get("span").text()).toBe("Hide automatic projects");
    expect(toggle.get('[aria-hidden="true"]').text()).toBe(checked ? "✓" : "");
    expect(toggle.attributes("aria-checked")).toBe(String(checked));
    await toggle.trigger("click");
    await flushPromises();
  }

  it("hides only automatic list rows by default and toggles active and archived lists", async () => {
    const fetch = setup();
    vi.spyOn(api, "projects").mockResolvedValue({
      projects: [
        a,
        b,
        auto,
        home,
        { ...b, id: "archived", archived: true },
        { ...auto, id: "archived-auto", label: "Archived automatic", archived: true },
      ],
      scoped_session_ids: ["project_s1"],
    });
    history.replaceState({}, "", "/chathermes?profile=alpha#/projects?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    const list = () => wrapper.get('[aria-label="Project list"]');
    expect(list().text()).toContain("Project A");
    expect(list().text()).toContain("Project B");
    expect(list().text()).not.toContain("Automatic repo");
    expect(list().text()).not.toContain("Home");
    const url = location.href;
    const requests = fetch.mock.calls.length;
    await toggleAutomatic(wrapper, true);
    expect(location.href).toBe(url);
    expect(fetch.mock.calls.length).toBe(requests);
    expect(list().text()).toContain("Automatic repo");
    expect(localStorage.getItem("chathermes.hide-automatic-projects")).toBe("false");
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper.findAll('[role="menuitemradio"]')[1]!.trigger("click");
    await flushPromises();
    expect(list().text()).toContain("Project B");
    expect(list().text()).toContain("Archived automatic");
    expect(list().text()).not.toContain("Project A");
    await toggleAutomatic(wrapper, false);
    expect(list().text()).toContain("Project B");
    expect(list().text()).not.toContain("Archived automatic");
    expect(localStorage.getItem("chathermes.hide-automatic-projects")).toBe("true");
    expect(wrapper.get('[aria-label="Sessions"]').text()).toContain("Ungrouped");
    expect(fetch.mock.calls.some(([, init]) => init?.method)).toBe(false);
    wrapper.unmount();
  });

  it("retains the browser preference through navigation, profile changes and remounts", async () => {
    setup();
    history.replaceState({}, "", "/chathermes?profile=alpha#/projects?profile=alpha");
    let wrapper = mount(App);
    await flushPromises();
    await toggleAutomatic(wrapper, true);
    await wrapper.get('[aria-label="Project A"]').trigger("click");
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).toContain("Automatic repo");
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(routeUrl().searchParams.get("profile")).toBe("beta");
    expect(wrapper.get('[aria-label="Project list"]').text()).toContain("Automatic repo");
    wrapper.unmount();
    wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).toContain("Automatic repo");
    await toggleAutomatic(wrapper, false);
    wrapper.unmount();
    wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).not.toContain("Automatic repo");
    wrapper.unmount();
  });

  it("keeps automatic project conversations and membership available while hidden", async () => {
    setup();
    const withChat = { ...a, id: auto.id, label: auto.label, isAuto: true };
    vi.spyOn(api, "projects").mockResolvedValue({
      projects: [withChat, b, home],
      scoped_session_ids: ["project_s1"],
    });
    vi.spyOn(api, "project").mockResolvedValue(withChat);
    history.replaceState({}, "", "/chathermes?profile=alpha#/projects?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).not.toContain(auto.label);
    await wrapper.findAll(".session-select")[1]!.trigger("click");
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe(auto.label);
    expect(wrapper.text()).toContain("Native chat history");
    expect(nativeOwner.attach).toHaveBeenCalledWith("alpha", "project_s1");
    expect(routeSession()).toBe("project_s1");
    wrapper.unmount();
  });

  it.each([null, "true", "invalid"])("defaults to hiding with stored value %s", async (value) => {
    setup();
    if (value !== null) localStorage.setItem("chathermes.hide-automatic-projects", value);
    history.replaceState({}, "", "/chathermes#/projects");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).not.toContain(auto.label);
    wrapper.unmount();
  });

  it("keeps the toggle usable when storage reads and writes fail", async () => {
    setup();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    history.replaceState({}, "", "/chathermes#/projects");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).not.toContain(auto.label);
    await toggleAutomatic(wrapper, true);
    expect(wrapper.get('[aria-label="Project list"]').text()).toContain(auto.label);
    await toggleAutomatic(wrapper, false);
    expect(wrapper.get('[aria-label="Project list"]').text()).not.toContain(auto.label);
    wrapper.unmount();
  });
  it.each(["hierarchy", "summary"])(
    "resumes a drawer session in its owning Project using %s membership",
    async (shape) => {
      setup();
      if (shape === "summary")
        vi.spyOn(api, "projects").mockResolvedValue({
          projects: [{ ...a, repos: [], previewSessions: [], sessionIds: ["project_s1"] }, b, home],
          scoped_session_ids: ["project_s1"],
        });
      history.replaceState(
        {},
        "",
        "/chathermes?profile=alpha#/projects/p_b?profile=alpha&project=p_b",
      );
      const wrapper = mount(App);
      await flushPromises();
      await wrapper.get(".session-select").trigger("click");
      await flushPromises();
      await flushPromises();
      // Same cwd does not imply membership; an ungrouped chat clears the old scope.
      expect(routeUrl().search).not.toContain("project=");
      await wrapper.findAll(".session-select")[1]!.trigger("click");
      await flushPromises();
      await flushPromises();
      expect(wrapper.get(".header-project-subtitle").text()).toBe(a.label);
      expect(location.hash).toContain("/chat/project_s1");
      expect(routeUrl().search).toContain("profile=alpha");
      expect(routeUrl().search).not.toContain("view=project");
      expect(wrapper.find('[aria-label="Selected Project"]').exists()).toBe(false);
      expect(wrapper.text()).toContain("Native chat history");
      expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
      expect(api.isWorkspace("alpha", "project_s1")).toBe(true);
      await wrapper.get("textarea").setValue("Continue in this project");
      await wrapper.get("form").trigger("submit");
      await flushPromises();
      await flushPromises();
      expect(nativeOwner.submit).toHaveBeenCalledWith(
        "Continue in this project",
        expect.any(Function),
        expect.any(Object),
        expect.any(Array),
      );
      await wrapper.get(".session-select").trigger("click");
      await flushPromises();
      await flushPromises();
      expect(routeUrl().search).not.toContain("project=");
      expect(location.hash).toContain("/chat/s1");
      wrapper.unmount();
    },
  );
  it("discovers Project membership after opening a drawer session", async () => {
    setup();
    let finish!: (value: ProjectTree) => void;
    vi.spyOn(api, "projects").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.findAll(".session-select")[1]!.trigger("click");
    await flushPromises();
    await flushPromises();
    finish({ projects: [a], scoped_session_ids: ["project_s1"] });
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe(a.label);
    expect(location.hash).toContain("/chat/project_s1");
    wrapper.unmount();
  });
  it("ignores a pending drawer resume when the profile changes", async () => {
    setup();
    let finish!: (value: ProjectTree) => void;
    vi.spyOn(api, "projects").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.findAll(".session-select")[1]!.trigger("click");
    await flushPromises();
    await flushPromises();
    const oldRead = finish;
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    oldRead({ projects: [a], scoped_session_ids: ["project_s1"] });
    await flushPromises();
    expect(routeUrl().search).toBe("?profile=beta");
    expect(wrapper.text()).not.toContain("Native chat history");
    wrapper.unmount();
  });
  it("ignores initial membership arriving after another drawer session is selected", async () => {
    setup();
    const reads: ((value: ProjectTree) => void)[] = [];
    vi.spyOn(api, "projects").mockImplementation(
      () =>
        new Promise((resolve) => {
          reads.push(resolve);
        }),
    );
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.findAll(".session-select")[1]!.trigger("click");
    await flushPromises();
    await flushPromises();
    await wrapper.get(".session-select").trigger("click");
    await flushPromises();
    await flushPromises();
    reads.at(-1)!({ projects: [a], scoped_session_ids: ["project_s1"] });
    await flushPromises();
    for (const finish of reads) finish({ projects: [a], scoped_session_ids: ["project_s1"] });
    await flushPromises();
    expect(location.hash).toBe("#/chat/s1");
    wrapper.unmount();
  });
  it.each([
    { label: "populated", rows: [a, b] },
    { label: "empty", rows: [] },
  ])("keeps $label Projects stable during event refreshes", async ({ rows }) => {
    setup();
    vi.stubGlobal("EventSource", class {});
    let refresh!: () => void, finish!: (value: ProjectTree) => void;
    vi.spyOn(api, "projectEvents").mockImplementation((_profile, callback) => {
      refresh = callback;
      return vi.fn();
    });
    const read = vi.spyOn(api, "projects").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    history.replaceState({}, "", "/chathermes?profile=default#/projects");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('.projects-page [role="status"]').text()).toBe("Loading Projects…");
    finish({ projects: rows, scoped_session_ids: [] });
    await flushPromises();
    expect(wrapper.find('.projects-page [role="status"]').exists()).toBe(false);
    const content = wrapper.get(".projects-page").text(),
      before = read.mock.calls.length;
    refresh();
    await new Promise((resolve) => setTimeout(resolve, 150));
    await flushPromises();
    expect(read.mock.calls.length).toBe(before + 1);
    expect(wrapper.get(".projects-page").text()).toBe(content);
    expect(wrapper.find('.projects-page [role="status"]').exists()).toBe(false);
    finish({ projects: rows, scoped_session_ids: [] });
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper.get('[role="menuitemradio"][aria-checked="false"]').trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.text()).toContain("No archived projects.");
    expect(wrapper.find('.projects-page [role="status"]').exists()).toBe(false);
    finish({ projects: rows, scoped_session_ids: [] });
    await flushPromises();
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.get('.projects-page [role="status"]').text()).toBe("Loading Projects…");
    expect(wrapper.find('[aria-label="Project A"]').exists()).toBe(false);
    finish({ projects: [], scoped_session_ids: [] });
    await flushPromises();
    expect(wrapper.text()).toContain("No projects yet.");
    wrapper.unmount();
  });
  it("keeps initial loading on retry until Projects have loaded successfully", async () => {
    setup();
    const read = vi.spyOn(api, "projects").mockRejectedValue(new Error("Unavailable"));
    history.replaceState({}, "", "/chathermes?profile=default#/projects");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('.projects-page [role="alert"]').text()).toContain(
      "Could not load Projects.",
    );
    let finish!: (value: ProjectTree) => void;
    read.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    await wrapper.get('.projects-page [role="alert"] button').trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.get('.projects-page [role="status"]').text()).toBe("Loading Projects…");
    finish({ projects: [], scoped_session_ids: [] });
    await flushPromises();
    expect(wrapper.find('.projects-page [role="status"]').exists()).toBe(false);
    expect(wrapper.text()).toContain("No projects yet.");
    wrapper.unmount();
  });
  it("keeps selected Project content stable while its hierarchy refreshes", async () => {
    setup();
    vi.stubGlobal("EventSource", class {});
    let refresh!: () => void, finish!: (value: Project) => void;
    vi.spyOn(api, "projectEvents").mockImplementation((_profile, callback) => {
      refresh = callback;
      return vi.fn();
    });
    vi.spyOn(api, "project").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    history.replaceState({}, "", "/chathermes?profile=default#/projects/p_a?project=p_a");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get('[aria-label="Selected Project"] [role="status"]').text()).toBe(
      "Loading Project…",
    );
    finish(a);
    await flushPromises();
    const content = wrapper.get('[aria-label="Selected Project"]').text();
    expect(wrapper.get(".header-title").text()).toBe("Projects");
    expect(wrapper.get(".header-project-subtitle").text()).toBe(a.label);
    refresh();
    await new Promise((resolve) => setTimeout(resolve, 150));
    await flushPromises();
    expect(wrapper.get('[aria-label="Selected Project"]').text()).toBe(content);
    expect(wrapper.find('[aria-label="Selected Project"] [role="status"]').exists()).toBe(false);
    expect(wrapper.get(".header-project-subtitle").text()).toBe(a.label);
    finish({ ...a, label: "Updated Project A" });
    await flushPromises();
    expect(wrapper.get(".header-title").text()).toBe("Projects");
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Updated Project A");
    wrapper.unmount();
  });
  it("moves Projects out of the drawer and navigates to selected project sessions", async () => {
    const fetch = setup();
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.find('.sidebar [aria-label="Project A"]').exists()).toBe(false);
    expect(wrapper.get(".drawer-chat").attributes("aria-label")).toBe("New chat");
    expect(wrapper.find(".drawer-account #profile-field").exists()).toBe(true);
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).not.toContain("Automatic repo");
    expect(wrapper.get('[aria-label="Project list"]').text()).not.toContain("Home");
    expect(wrapper.get('[aria-label="Sessions"]').text()).toContain("Ungrouped");
    await wrapper.get('[aria-label="Project A"]').trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.get('[aria-label="Selected Project"]').text()).toContain("Native worktree chat");
    expect(wrapper.get("textarea").attributes("disabled")).toBeUndefined();
    await wrapper
      .findAll('[aria-label="Selected Project"] button')
      .find((button) => button.attributes("aria-label") === "Native worktree chat")!
      .trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.text()).toContain("Native chat history");
    expect(wrapper.get(".header-project-subtitle").text()).toBe(a.label);
    expect(location.hash).toContain("/chat/project_s1");
    expect(api.isWorkspace("", "project_s1")).toBe(true);
    expect(
      fetch.mock.calls.some(([url]) => url.includes("/api/sessions/project_s1/messages")),
    ).toBe(true);
    expect(fetch.mock.calls.some(([, init]) => init?.method === "POST")).toBe(false);
    wrapper.unmount();
  });
  it("opens a fresh composer when browsing a separate project", async () => {
    history.replaceState({}, "", "/chathermes?profile=default#/chat/project_s1?project=p_a");
    const fetch = setup();
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    await flushPromises();
    await wrapper.get('[aria-label="Project B"]').trigger("click");
    await flushPromises();
    await flushPromises();
    expect(routeSession()).toBeNull();
    expect(routeProject()).toBe("p_b");
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project B");
    expect(wrapper.get(".header-title").text()).toBe("Projects");
    expect(fetch.mock.calls.some(([, init]) => init?.method === "POST")).toBe(false);
    wrapper.unmount();
  });
  it("shows plain project chat rows with only supplied previews and keeps creation in the menu", async () => {
    setup();
    history.replaceState({}, "", "/chathermes?profile=default#/projects/p_a?project=p_a");
    const wrapper = mount(App);
    await flushPromises();
    const home = wrapper.get('[aria-label="Selected Project"]');
    expect(home.find(".project-chats-heading").exists()).toBe(false);
    expect(home.findAll("button").some((button) => button.text() === "New chat")).toBe(false);
    const row = home.get('[aria-label="Project chats"] button');
    expect(row.get(".project-chat-title").text()).toBe("Native worktree chat");
    expect(row.get(".project-chat-preview").text()).toBe("Actual workspace preview");
    await row.trigger("click");
    await flushPromises();
    await flushPromises();
    expect(location.hash).toContain("/chat/project_s1");
    wrapper.unmount();
    setup(async () =>
      json({
        project: {
          ...a,
          repos: [
            {
              ...a.repos[0],
              groups: [
                { id: "lane", label: "Main", sessions: [{ id: "no_preview", title: null }] },
              ],
            },
          ],
        },
      }),
    );
    const titlesOnly = mount(App);
    await flushPromises();
    await titlesOnly.get(".projects-nav").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(titlesOnly.get(".projects-page").text()).toContain("New project");
    await titlesOnly.get('[aria-label="Project A"]').trigger("click");
    await flushPromises();
    await flushPromises();
    expect(titlesOnly.get(".project-chat-title").text()).toBe("Untitled session");
    expect(titlesOnly.find(".project-chat-preview").exists()).toBe(false);
    titlesOnly.unmount();
  });
  it("retains new chat scope when empty REST detail and list rows precede catalog membership", async () => {
    setup();
    vi.spyOn(api, "projects").mockResolvedValue({
      projects: [a, b],
      scoped_session_ids: ["project_s1"],
    });
    history.replaceState({}, "", "/chathermes#/chat/project_s1?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper
      .findAll('[role="menuitem"]')
      .find((item) => item.text() === "New Project Chat")!
      .trigger("click");
    await flushPromises();
    await wrapper.get("#prompt").setValue("First project message");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(routeSession()).toBe("project_created");
    await vi.waitFor(() =>
      expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A"),
    );
    expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Project A");
    wrapper.unmount();
  });
  it("restores draft scope on history and reload without leaking across routes or profiles", async () => {
    setup();
    vi.spyOn(api, "projects").mockResolvedValue({
      projects: [a, b],
      scoped_session_ids: ["project_s1"],
    });
    history.replaceState({}, "", "/chathermes#/chat/project_s1?profile=alpha");
    const create = vi.spyOn(api, "projectCreate");
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper
      .findAll('[role="menuitem"]')
      .find((item) => item.text() === "New Project Chat")!
      .trigger("click");
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    router.back();
    await vi.waitFor(() => expect(routeSession()).toBe("project_s1"));
    router.forward();
    await vi.waitFor(() => expect(routeUrl().pathname).toBe("/projects/p_a/new"));
    await vi.waitFor(() =>
      expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A"),
    );
    wrapper.unmount();
    const reloadedRouter = createChatHermesRouter();
    const reloaded = vueMount(App, { global: { plugins: [reloadedRouter] } });
    await flushPromises();
    expect(reloaded.get(".header-project-subtitle").text()).toBe("Project A");
    await reloadedRouter.push("/chat/s1?profile=alpha");
    await flushPromises();
    expect(reloaded.find(".header-project-subtitle").exists()).toBe(false);
    expect(reloaded.get("#prompt").attributes("placeholder")).toBe("Message Hermes…");
    await reloadedRouter.push("/?profile=alpha");
    await flushPromises();
    expect(reloaded.find(".header-project-subtitle").exists()).toBe(false);
    await reloadedRouter.push("/?profile=gamma");
    await flushPromises();
    expect(reloaded.find(".header-project-subtitle").exists()).toBe(false);
    await reloadedRouter.push("/projects/p_a/new?profile=alpha");
    await flushPromises();
    expect(reloaded.get(".header-project-subtitle").text()).toBe("Project A");
    expect(create).not.toHaveBeenCalled();
    reloaded.unmount();
  });
  it("retires provisional scope when backend membership appears and later changes", async () => {
    setup();
    vi.stubGlobal("EventSource", class {});
    let refresh!: () => void;
    vi.spyOn(api, "projectEvents").mockImplementation((_profile, callback) => {
      refresh = callback;
      return vi.fn();
    });
    const catalog = vi
      .spyOn(api, "projects")
      .mockResolvedValue({ projects: [a, b], scoped_session_ids: ["project_s1"] });
    history.replaceState({}, "", "/chathermes#/chat/project_s1?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper
      .findAll('[role="menuitem"]')
      .find((item) => item.text() === "New Project Chat")!
      .trigger("click");
    await flushPromises();
    await wrapper.get("#prompt").setValue("First project message");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    catalog.mockResolvedValue({
      projects: [a, { ...b, sessionIds: ["project_created"] }],
      scoped_session_ids: ["project_s1", "project_created"],
    });
    refresh();
    await vi.waitFor(() =>
      expect(wrapper.get(".header-project-subtitle").text()).toBe("Project B"),
    );
    catalog.mockResolvedValue({ projects: [a, b], scoped_session_ids: ["project_s1"] });
    refresh();
    await vi.waitFor(() => expect(wrapper.find(".header-project-subtitle").exists()).toBe(false));
    wrapper.unmount();
  });
  it("preserves an empty draft's move destination through reload", async () => {
    setup();
    const key = "chathermes.project-draft:alpha:project_created";
    sessionStorage.setItem(key, "p_a");
    vi.spyOn(api, "projects").mockResolvedValue({ projects: [a, b], scoped_session_ids: [] });
    const move = vi.spyOn(api, "moveSession").mockResolvedValue({});
    history.replaceState({}, "", "/chathermes#/chat/project_created?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    wrapper.getComponent(SessionSidebar).vm.$emit("project", "project_created", "p_b");
    await flushPromises();
    expect(move).toHaveBeenCalledWith("alpha", "project_created", "p_b");
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project B");
    expect(sessionStorage.getItem(key)).toBe("p_b");
    wrapper.unmount();
    const reloaded = mount(App);
    await flushPromises();
    expect(reloaded.get(".header-project-subtitle").text()).toBe("Project B");
    expect(reloaded.get("#prompt").attributes("placeholder")).toBe("Message Project B");
    reloaded.unmount();
  });
  it.each([
    ["detail", "failed"],
    ["list", "failed"],
    ["detail", "member"],
    ["list", "member"],
    ["detail", "moved"],
    ["list", "moved"],
  ])("reconciles %s persistence against a fresh delayed catalog (%s)", async (source, outcome) => {
    setup();
    const id = source === "detail" ? "project_created" : "s1";
    const key = `chathermes.project-draft:alpha:${id}`;
    sessionStorage.setItem(key, "p_a");
    let stored = false;
    const detail = vi.spyOn(api, "session").mockImplementation(async () => {
      if (source === "list") throw new Error("Detail unavailable");
      return { id, message_count: stored ? 2 : 0 };
    });
    vi.spyOn(api, "sessions").mockImplementation(async () => ({
      sessions: [{ id, message_count: stored && source === "list" ? 2 : 0 }],
      total: 1,
    }));
    vi.stubGlobal("EventSource", class {});
    let refresh!: () => void;
    vi.spyOn(api, "projectEvents").mockImplementation((_p, callback) => {
      refresh = callback;
      return vi.fn();
    });
    let finish!: (result: { projects: (typeof a)[]; scoped_session_ids: string[] }) => void;
    let fail!: (cause: Error) => void;
    const catalog = vi.spyOn(api, "projects").mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          finish = resolve;
          fail = reject;
        }),
    );
    history.replaceState({}, "", `/chathermes#/chat/${id}?profile=alpha`);
    const wrapper = mount(App);
    await flushPromises();
    // Return the initial catalog, read before persistence evidence.
    finish({ projects: [a, b], scoped_session_ids: [] });
    await flushPromises();
    stored = true;
    if (source === "list") wrapper.getComponent(SessionSidebar).vm.$emit("more");
    else {
      refresh();
      await vi.waitFor(() => expect(catalog).toHaveBeenCalledTimes(2));
      finish({ projects: [a, b], scoped_session_ids: [] });
    }
    await flushPromises();
    expect(catalog.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    expect(sessionStorage.getItem(key)).toBe("p_a");
    if (outcome !== "failed") {
      finish({
        projects:
          outcome === "member"
            ? [{ ...a, sessionIds: [...(a.sessionIds || []), id] }, b]
            : [a, { ...b, sessionIds: [id] }],
        scoped_session_ids: [id],
      });
      await flushPromises();
      const label = outcome === "member" ? "Project A" : "Project B";
      expect(wrapper.get(".header-project-subtitle").text()).toBe(label);
      expect(wrapper.get("#prompt").attributes("placeholder")).toBe(`Message ${label}`);
      expect(sessionStorage.getItem(key)).toBeNull();
      wrapper.unmount();
      return;
    }
    fail(new Error("Catalog unavailable"));
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    expect(sessionStorage.getItem(key)).toBe("p_a");
    // Retry on reload: only the fresh read after persistence may remove scope.
    wrapper.unmount();
    catalog.mockResolvedValue({ projects: [a, b], scoped_session_ids: [] });
    const reloaded = mount(App);
    await flushPromises();
    expect(reloaded.find(".header-project-subtitle").exists()).toBe(false);
    expect(sessionStorage.getItem(key)).toBeNull();
    expect(detail).toHaveBeenCalled();
    reloaded.unmount();
  });
  it("retires stale reloaded scope for a persisted ungrouped chat outside the sidebar page", async () => {
    setup();
    const key = "chathermes.project-draft:alpha:old_chat";
    sessionStorage.setItem(key, "p_a");
    vi.spyOn(api, "session").mockResolvedValue({ id: "old_chat", cwd: a.path, message_count: 2 });
    history.replaceState({}, "", "/chathermes#/chat/old_chat?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Hermes…");
    expect(sessionStorage.getItem(key)).toBeNull();
    wrapper.unmount();
  });
  it("retires stale scope on a catalog refresh even when membership was never observed", async () => {
    setup();
    vi.stubGlobal("EventSource", class {});
    let refresh!: () => void;
    vi.spyOn(api, "projectEvents").mockImplementation((_profile, callback) => {
      refresh = callback;
      return vi.fn();
    });
    vi.spyOn(api, "projects").mockImplementation(async () => ({
      projects: [a, b],
      scoped_session_ids: ["project_s1"],
    }));
    const persisted = vi.spyOn(api, "session").mockRejectedValue(new Error("No durable row"));
    const key = "chathermes.project-draft:alpha:away_draft";
    sessionStorage.setItem(key, "p_a");
    history.replaceState({}, "", "/chathermes#/chat/away_draft?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    // The first prompt and move to Other chats happened while this tab was away.
    persisted.mockResolvedValue({ id: "away_draft", cwd: a.path, message_count: 2 });
    refresh();
    await vi.waitFor(() => expect(wrapper.find(".header-project-subtitle").exists()).toBe(false));
    expect(sessionStorage.getItem(key)).toBeNull();
    wrapper.unmount();
  });
  it("uses persisted list rows but preserves live drafts from tracking summaries", async () => {
    setup();
    const key = "chathermes.project-draft:alpha:s1";
    sessionStorage.setItem(key, "p_a");
    sessionStorage.setItem("chathermes.project-draft:alpha:project_created", "p_a");
    vi.spyOn(api, "session").mockRejectedValue(new Error("Detail unavailable"));
    vi.spyOn(api, "tracking").mockResolvedValue({
      tracking: [],
      sessions: [{ id: "project_created" }],
    });
    history.replaceState({}, "", "/chathermes#/chat/s1?profile=alpha");
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    await flushPromises();
    expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    expect(sessionStorage.getItem(key)).toBeNull();
    await router.push("/chat/project_created?profile=alpha");
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    wrapper.unmount();
  });
  it.each([404, 503])(
    "preserves reloaded draft scope when persistence cannot be proven (%s)",
    async (status) => {
      setup();
      sessionStorage.setItem("chathermes.project-draft:alpha:project_created", "p_a");
      vi.spyOn(api, "session").mockRejectedValue(new Error(`Request failed (${status})`));
      history.replaceState({}, "", "/chathermes#/chat/project_created?profile=alpha");
      const wrapper = mount(App);
      await flushPromises();
      expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
      await wrapper.get("textarea").setValue("First draft send");
      await wrapper.get("form").trigger("submit");
      await flushPromises();
      expect(nativeOwner.submit).toHaveBeenCalledWith(
        "First draft send",
        expect.any(Function),
        expect.any(Object),
        expect.any(Array),
      );
      wrapper.unmount();
    },
  );
  it.each(["archive", "delete", "project"] as const)(
    "updates only the owning draft after delayed %s succeeds across a profile switch",
    async (action) => {
      setup();
      const key = "chathermes.project-draft:alpha:delayed_draft";
      const otherKey = "chathermes.project-draft:beta:delayed_draft";
      sessionStorage.setItem(key, "p_a");
      sessionStorage.setItem(otherKey, "p_b");
      vi.spyOn(api, "session").mockRejectedValue(new Error("No durable row"));
      let complete!: () => void;
      const pending = new Promise<void>((resolve) => {
        complete = resolve;
      });
      const mutation =
        action === "project"
          ? vi.spyOn(api, "moveSession").mockImplementation(async () => {
              await pending;
            })
          : vi
              .spyOn(api, action === "archive" ? "archive" : "deleteSession")
              .mockImplementation(async () => {
                await pending;
              });
      history.replaceState({}, "", "/chathermes#/chat/delayed_draft?profile=alpha");
      const router = createChatHermesRouter();
      const wrapper = vueMount(App, { global: { plugins: [router] } });
      await flushPromises();
      wrapper.getComponent(SessionSidebar).vm.$emit(action, "delayed_draft", "p_b");
      await flushPromises();
      expect(mutation).toHaveBeenCalledWith(
        "alpha",
        "delayed_draft",
        ...(action === "project" ? ["p_b"] : []),
      );
      await router.push("/chat/delayed_draft?profile=beta");
      await flushPromises();
      complete();
      await flushPromises();
      expect(sessionStorage.getItem(key)).toBe(action === "project" ? "p_b" : null);
      expect(sessionStorage.getItem(otherKey)).toBe("p_b");
      expect(wrapper.get(".header-project-subtitle").text()).toBe("Project B");
      await router.push("/chat/delayed_draft?profile=alpha");
      await flushPromises();
      if (action === "project")
        expect(wrapper.get(".header-project-subtitle").text()).toBe("Project B");
      else expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
      wrapper.unmount();
    },
  );
  it("keeps draft scope in memory when storage is unavailable and retires it when persistence appears", async () => {
    setup();
    vi.spyOn(api, "projects").mockResolvedValue({
      projects: [a, b],
      scoped_session_ids: ["project_s1"],
    });
    vi.spyOn(api, "session").mockRejectedValue(new Error("No durable row"));
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    history.replaceState({}, "", "/chathermes#/projects/p_a?profile=alpha");
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper
      .findAll('[role="menuitem"]')
      .find((item) => item.text() === "New Project Chat")!
      .trigger("click");
    await flushPromises();
    await wrapper.get("#prompt").setValue("First project message");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    await router.push("/?profile=alpha");
    await flushPromises();
    vi.spyOn(api, "session").mockResolvedValue({ id: "project_created", message_count: 2 });
    await router.push("/chat/project_created?profile=alpha");
    await flushPromises();
    expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    wrapper.unmount();
  });
  it("does not revive stale readable storage when removal fails", async () => {
    setup();
    const key = "chathermes.project-draft:alpha:old_chat";
    sessionStorage.setItem(key, "p_a");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Read only");
    });
    vi.spyOn(api, "session").mockResolvedValue({ id: "old_chat", message_count: 2 });
    history.replaceState({}, "", "/chathermes#/chat/old_chat?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    expect(sessionStorage.getItem(key)).toBe("p_a");
    expect(wrapper.find(".header-project-subtitle").exists()).toBe(false);
    wrapper.unmount();
  });
  it("creates a scoped chat and uses the existing composer/runtime interface", async () => {
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/projects/p_a?profile=alpha&project=p_a",
    );
    const fetch = setup();
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper.get('[role="menuitem"]').trigger("click");
    await flushPromises();
    await flushPromises();
    expect(routeUrl().pathname).toBe("/projects/p_a/new");
    expect(fetch.mock.calls.some(([url]) => url.includes("/projects/session?"))).toBe(false);
    await wrapper.get("textarea").setValue("Check this workspace");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(location.hash).toContain("/chat/project_created");
    expect(
      fetch.mock.calls.find(
        ([url, init]) =>
          url.includes("/projects/session?project_id=p_a") && init?.method === "POST",
      ),
    ).toEqual(
      expect.arrayContaining([
        "/api/plugins/chathermes/projects/session?project_id=p_a&prepare=1&profile=alpha",
        expect.objectContaining({ body: "{}" }),
      ]),
    );
    expect(nativeOwner.submit).toHaveBeenCalledWith(
      "Check this workspace",
      expect.any(Function),
      expect.any(Object),
      expect.any(Array),
    );
    wrapper.unmount();
  });
  it.each([
    "/projects/p_a?profile=alpha",
    "/chat/project_s1?profile=alpha&project=p_a",
    "/projects/p_a/settings?profile=alpha",
    "/projects/p_a/instructions?profile=alpha",
  ])("creates a fresh project chat from active context %s", async (context) => {
    setup();
    history.replaceState({}, "", "/chathermes?profile=alpha#" + context);
    const create = vi.spyOn(api, "projectCreate"),
      unscoped = vi.spyOn(api, "create");
    const wrapper = mount(App);
    await flushPromises();
    if (context.startsWith("/chat/")) {
      expect(wrapper.find('[aria-label="Selected Project"]').exists()).toBe(false);
      expect(routeSession()).toBe("project_s1");
    }
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    const menu = wrapper.get('[role="menu"]');
    expect(
      menu.findAll('[role="menuitem"]').filter((button) => button.text() === "New chat"),
    ).toHaveLength(1);
    const action = menu
      .findAll('[role="menuitem"]')
      .find((button) => button.text() === "New Project Chat")!;
    expect(action).toBeDefined();
    expect(action.attributes("disabled")).toBeUndefined();
    await action.trigger("click");
    await flushPromises();
    await flushPromises();
    expect(create).not.toHaveBeenCalled();
    expect(unscoped).not.toHaveBeenCalled();
    expect(routeProject()).toBe("p_a");
    expect(routeUrl().pathname).toBe("/projects/p_a/new");
    expect(routeSession()).toBeNull();
    expect(routeSession()).not.toBe("project_s1");
    expect(new URLSearchParams(routeUrl().search).has("view")).toBe(false);
    expect(wrapper.find('[role="menu"]').isVisible()).toBe(false);
    await vi.waitFor(() =>
      expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Project A"),
    );
    wrapper.unmount();
  });
  it.each([
    "/",
    "/chat/s1",
    "/projects",
    "/scheduled",
    "/projects?project=p_a&session=project_s1",
    "/scheduled?project=p_a&session=project_s1",
    "/projects/home",
    "/chat/s1?project=home",
    "/projects/p_missing",
    "/chat/s1?project=p_a",
  ])("hides New Project Chat outside project context: %s", async (query) => {
    setup();
    history.replaceState({}, "", "/chathermes?profile=default#" + query);
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    expect(wrapper.get('[role="menu"]').text()).not.toContain("New Project Chat");
    wrapper.unmount();
  });
  it.each([".projects-nav", ".scheduled-nav"])(
    "hides New Project Chat after leaving a selected project through %s",
    async (selector) => {
      setup();
      history.replaceState({}, "", "/chathermes?profile=default#/chat/project_s1?project=p_a");
      const wrapper = mount(App);
      await flushPromises();
      await wrapper.get(selector).trigger("click");
      await flushPromises();
      await flushPromises();
      await wrapper.get('[aria-label="Screen options"]').trigger("click");
      await flushPromises();
      expect(wrapper.get('[role="menu"]').text()).not.toContain("New Project Chat");
      wrapper.unmount();
    },
  );
  it.each(["pathless", "archived", "offline"])(
    "disables New Project Chat for a %s project context",
    async (state) => {
      setup(async () =>
        json({ project: state === "pathless" ? b : { ...a, archived: state === "archived" } }),
      );
      history.replaceState(
        {},
        "",
        "/chathermes?profile=default#/projects/" + (state === "pathless" ? "p_b" : "p_a"),
      );
      const create = vi.spyOn(api, "projectCreate");
      const wrapper = mount(App);
      await flushPromises();
      if (state === "offline") {
        vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
        dispatchEvent(new Event("offline"));
        await flushPromises();
      }
      await wrapper.get('[aria-label="Screen options"]').trigger("click");
      await flushPromises();
      const action = wrapper
        .findAll('[role="menuitem"]')
        .find((button) => button.text() === "New Project Chat")!;
      expect(action.attributes("disabled")).toBeDefined();
      await action.trigger("click");
      await flushPromises();
      await flushPromises();
      expect(create).not.toHaveBeenCalled();
      wrapper.unmount();
    },
  );
  it("preserves the unscoped New chat action from an open project chat", async () => {
    setup();
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/chat/project_s1?profile=alpha&project=p_a",
    );
    const create = vi.spyOn(api, "create"),
      scoped = vi.spyOn(api, "projectCreate");
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper
      .findAll('[role="menuitem"]')
      .find((button) => button.text() === "New chat")!
      .trigger("click");
    await flushPromises();
    await flushPromises();
    expect(create).toHaveBeenCalledExactlyOnceWith("alpha");
    expect(scoped).not.toHaveBeenCalled();
    expect(routeSession()).toBe("other_created");
    expect(new URLSearchParams(routeUrl().search).has("project")).toBe(false);
    wrapper.unmount();
  });
  it.each([
    { sessionId: "s1", action: "New chat" },
    { sessionId: "project_s1", action: "New chat" },
    { sessionId: "project_s1", action: "New Project Chat" },
  ])(
    "$action resets text, mode and late attachments from $sessionId",
    async ({ sessionId, action }) => {
      setup();
      let finish!: (value: { id: string }) => void;
      vi.spyOn(api, "create").mockImplementation(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      );
      let uploaded!: (value: { path: string }) => void;
      const upload = vi.spyOn(api, "upload").mockImplementation(
        () =>
          new Promise((resolve) => {
            uploaded = resolve;
          }),
      );
      history.replaceState({}, "", `/chathermes#/chat/${sessionId}?profile=alpha`);
      const wrapper = mount(App);
      await flushPromises();
      await wrapper.get("#prompt").setValue("Existing session draft");
      await wrapper.get('[aria-label="Attachment options"]').trigger("click");
      await wrapper
        .findAll("button")
        .find((button) => button.text() === "Plan mode")!
        .trigger("click");
      const staging = (
        wrapper.getComponent(ChatComposer).vm as unknown as {
          stageFiles(files: File[]): Promise<void>;
        }
      ).stageFiles([new File(["old"], "old.txt", { type: "text/plain" })]);
      await vi.waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
      await wrapper.get('[aria-label="Screen options"]').trigger("click");
      await wrapper
        .findAll('[role="menuitem"]')
        .find((button) => button.text() === action)!
        .trigger("click");
      await flushPromises();
      if (action === "New chat") {
        await wrapper.get("#prompt").setValue("Old draft edited during explicit creation");
        finish({ id: "other_created" });
        await flushPromises();
        expect(routeSession()).toBe("other_created");
      } else expect(routeUrl().pathname).toBe("/projects/p_a/new");
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe("");
      expect(wrapper.find('[aria-label="Remove old.txt"]').exists()).toBe(false);
      expect(wrapper.text()).not.toContain("Plan mode · next message");
      await wrapper.get("#prompt").setValue("Clean new draft");
      uploaded({ path: "/uploads/old.txt" });
      await staging;
      await flushPromises();
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe("Clean new draft");
      expect(wrapper.find('[aria-label="Remove old.txt"]').exists()).toBe(false);
      await wrapper.get("form").trigger("submit");
      await flushPromises();
      expect(vi.mocked(nativeOwner.submit).mock.calls[0]![0]).toBe("Clean new draft");
      const content = vi.mocked(nativeOwner.submit).mock.calls[0]![1] as () => Promise<unknown>;
      expect(await content()).toBe("Clean new draft");
      wrapper.unmount();
    },
  );

  it.each(["s1", "project_s1"])(
    "ignores late explicit New chat after leaving and returning to %s",
    async (sessionId) => {
      setup();
      let finish!: (value: { id: string }) => void;
      vi.spyOn(api, "create").mockImplementation(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      );
      history.replaceState({}, "", `/chathermes#/chat/${sessionId}?profile=alpha`);
      const router = createChatHermesRouter();
      const wrapper = vueMount(App, { global: { plugins: [router] } });
      await flushPromises();
      await wrapper.get("#prompt").setValue("Abandoned draft");
      await wrapper.get('[aria-label="Screen options"]').trigger("click");
      await wrapper
        .findAll('[role="menuitem"]')
        .find((button) => button.text() === "New chat")!
        .trigger("click");
      await router.push("/projects/p_a/new?profile=alpha");
      await flushPromises();
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe("");
      await router.push(`/chat/${sessionId}?profile=alpha`);
      await flushPromises();
      await wrapper.get("#prompt").setValue("Returned draft");
      finish({ id: "abandoned_creation" });
      await flushPromises();
      expect(routeSession()).toBe(sessionId);
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe("Returned draft");
      expect(nativeOwner.submit).not.toHaveBeenCalled();
      wrapper.unmount();
    },
  );

  it("attaches a native draft separately from the metadata event subscription", async () => {
    vi.stubGlobal("EventSource", class {});
    const close = vi.fn();
    const events = vi.spyOn(api, "projectEvents").mockReturnValue(close);
    setup();
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/projects/p_a?profile=alpha&project=p_a",
    );
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper.get('[role="menuitem"]').trigger("click");
    await flushPromises();
    await wrapper.get("#prompt").setValue("First project message");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(events).toHaveBeenLastCalledWith("alpha", expect.any(Function));
    expect(nativeOwner.attach).toHaveBeenCalledWith("alpha", "project_created");
    wrapper.unmount();
    expect(close).toHaveBeenCalled();
  });
  it("ignores a late create after profile changes, and keeps the request pinned to its owner", async () => {
    setup();
    let finish!: (value: { id: string }) => void;
    const create = vi.spyOn(api, "projectCreate").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/projects/p_a?profile=alpha&project=p_a",
    );
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper
      .findAll('[role="menuitem"]')
      .find((button) => button.text() === "New Project Chat")!
      .trigger("click");
    await flushPromises();
    await wrapper.get("#prompt").setValue("First project message");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    expect(
      wrapper
        .findAll('[role="menuitem"]')
        .find((button) => button.text() === "New Project Chat")!
        .attributes("disabled"),
    ).toBeDefined();
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    finish({ id: "late_project_session" });
    await flushPromises();
    expect(create).toHaveBeenCalledWith("alpha", "p_a");
    expect(routeUrl().search).toContain("profile=beta");
    expect(routeUrl().search).not.toContain("late_project_session");
    wrapper.unmount();
  });
  it("ignores late creation after changing Project scope", async () => {
    setup();
    let finish!: (value: { id: string }) => void;
    vi.spyOn(api, "projectCreate").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    history.replaceState({}, "", "/chathermes?profile=default#/projects/p_a?project=p_a");
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper
      .findAll('[role="menuitem"]')
      .find((button) => button.text() === "New Project Chat")!
      .trigger("click");
    await flushPromises();
    await wrapper.get("#prompt").setValue("First project message");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    await flushPromises();
    await wrapper.get('[aria-label="Project B"]').trigger("click");
    await flushPromises();
    await flushPromises();
    finish({ id: "late_other_scope" });
    await flushPromises();
    expect(routeProject()).toBe("p_b");
    expect(routeUrl().search).not.toContain("session=");
    wrapper.unmount();
  });
  it("restores Project scope with a session and browser navigation", async () => {
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/chat/project_s1?profile=alpha&project=p_a",
    );
    setup();
    let wrapper = mount(App);
    await flushPromises();
    expect(wrapper.text()).toContain("Native chat history");
    wrapper.unmount();
    wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".header-project-subtitle").text()).toBe(a.label);
    history.pushState({}, "", "/chathermes?profile=default#/projects/p_b?project=p_b");
    dispatchEvent(new PopStateEvent("popstate"));
    await flushPromises();
    expect(wrapper.get(".topbar h1").text()).toBe("Projects");
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project B");
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    expect(wrapper.get('[role="menuitem"]').attributes("disabled")).toBeDefined();
    wrapper.unmount();
  });
  it("surfaces deleted/failed Projects and ignores cancelled late reads", async () => {
    history.replaceState({}, "", "/chathermes?profile=default#/projects/p_a?project=p_a");
    setup(async () => json({}, 404));
    let wrapper = mount(App);
    await flushPromises();
    expect(wrapper.text()).toContain("Project no longer exists");
    wrapper.unmount();
    let finish!: (response: Response) => void;
    setup(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    wrapper = mount(App);
    await flushPromises();
    await wrapper.get(".drawer-chat").trigger("click");
    await flushPromises();
    await flushPromises();
    finish(json({ project: a }));
    await flushPromises();
    expect(wrapper.find('[aria-label="Selected Project"]').exists()).toBe(false);
    wrapper.unmount();
  });
  it("refreshes selected hierarchy on gateway events and closes subscription on profile change/unmount", async () => {
    let refresh!: () => void;
    const close = vi.fn();
    vi.stubGlobal("EventSource", class {});
    const events = vi.spyOn(api, "projectEvents").mockImplementation((_profile, callback) => {
      refresh = callback;
      return close;
    });
    const fetch = setup();
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/projects/p_a?profile=alpha&project=p_a",
    );
    const wrapper = mount(App);
    await flushPromises();
    const before = fetch.mock.calls.length;
    refresh();
    await new Promise((resolve) => setTimeout(resolve, 150));
    await flushPromises();
    expect(
      fetch.mock.calls
        .slice(before)
        .some(([url]) => url.includes("/projects/detail?project_id=p_a")),
    ).toBe(true);
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    expect(close).toHaveBeenCalledOnce();
    expect(events).toHaveBeenLastCalledWith("beta", expect.any(Function));
    wrapper.unmount();
    expect(close).toHaveBeenCalledTimes(2);
  });
  it("uses project names in the header subtitle and composer in home and chat views", async () => {
    setup();
    history.replaceState({}, "", "/chathermes?profile=default#/projects/p_a?project=p_a");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get(".topbar h1").text()).toBe("Projects");
    expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Project A");
    expect(wrapper.find(".project-settings").exists()).toBe(false);
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    await wrapper
      .findAll('[aria-label="Selected Project"] button')
      .find((button) => button.attributes("aria-label") === "Native worktree chat")!
      .trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.get(".topbar h1").text()).toBe("Native worktree chat");
    expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
    expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Project A");
    await wrapper.get(".drawer-chat").trigger("click");
    await flushPromises();
    await flushPromises();
    expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Hermes…");
    wrapper.unmount();
  });
  it("moves project editing and deletion to the screen menu and restores editor URLs", async () => {
    setup();
    history.replaceState({}, "", "/chathermes?profile=default#/projects/p_a?project=p_a");
    const wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    const edit = wrapper
      .findAll('[role="menuitem"]')
      .find((button) => button.text() === "Edit project")!;
    await edit.trigger("click");
    await flushPromises();
    await flushPromises();
    expect(routeUrl().pathname).toBe("/projects/p_a/settings");
    expect(wrapper.get('[aria-label="Edit project"] input').element).toHaveProperty(
      "value",
      "Project A",
    );
    expect(wrapper.find('[aria-label="Selected Project"]').exists()).toBe(false);
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper
      .findAll('[role="menuitem"]')
      .find((button) => button.text() === "Delete project")!
      .trigger("click");
    await flushPromises();
    expect(wrapper.get('[role="alertdialog"]').text()).toContain("Files and chats will be kept.");
    expect(wrapper.get('[role="alertdialog"] button').element).toBe(document.activeElement);
    await wrapper.get('[role="alertdialog"] button').trigger("click");
    await flushPromises();
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false);
    wrapper.unmount();
    const restored = mount(App);
    await flushPromises();
    expect(restored.get('[aria-label="Edit project"] input').element).toHaveProperty(
      "value",
      "Project A",
    );
    restored.unmount();
  });
  it("restores instruction URLs and saves through the selected profile without touching sessions", async () => {
    const fetch = setup();
    vi.spyOn(api, "projectInstructions").mockResolvedValue({
      filename: ".hermes.md",
      content: "Be concise",
      revision: null,
    });
    const save = vi.spyOn(api, "saveProjectInstructions").mockResolvedValue({
      filename: ".hermes.md",
      content: "Follow project conventions",
      revision: "saved",
    });
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/projects/p_a/instructions?profile=alpha&session=project_s1&project=p_a",
    );
    const wrapper = mount(App);
    await flushPromises();
    const editor = wrapper.get('[aria-label="Edit Instructions"]');
    expect(editor.get("textarea").element).toHaveProperty("value", "Be concise");
    expect(wrapper.get("#prompt").attributes("disabled")).toBeUndefined();
    expect(
      wrapper.get('.composer button[aria-label="Send message"]').attributes("disabled"),
    ).toBeDefined();
    await editor.get("textarea").setValue("Follow project conventions");
    await editor.get("form").trigger("submit");
    await flushPromises();
    await flushPromises();
    expect(save).toHaveBeenCalledWith("alpha", "p_a", {
      filename: ".hermes.md",
      content: "Follow project conventions",
      revision: null,
    });
    expect(fetch.mock.calls.some(([, init]) => init?.method === "POST")).toBe(false);
    await wrapper.get("#profile-field").setValue("beta");
    await flushPromises();
    expect(wrapper.find('[aria-label="Edit Instructions"]').exists()).toBe(false);
    wrapper.unmount();
  });
  it("deletes only after confirmation and uses the current project and profile", async () => {
    setup();
    const manage = vi.spyOn(api, "projectManage").mockResolvedValue({});
    history.replaceState(
      {},
      "",
      "/chathermes?profile=alpha#/projects/p_a?profile=alpha&project=p_a",
    );
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await flushPromises();
    await wrapper
      .findAll('[role="menuitem"]')
      .find((button) => button.text() === "Delete project")!
      .trigger("click");
    await flushPromises();
    expect(manage).not.toHaveBeenCalled();
    await wrapper
      .findAll('[role="alertdialog"] button')
      .find((button) => button.text() === "Delete project permanently")!
      .trigger("click");
    await flushPromises();
    await flushPromises();
    expect(manage).toHaveBeenCalledWith("alpha", "delete", { id: "p_a" });
    expect(wrapper.find(".projects-page").exists()).toBe(true);
    wrapper.unmount();
  });
  it("preserves the archived list on sidebar navigation and switches through the list filter", async () => {
    setup();
    history.replaceState({}, "", "/chathermes?profile=default#/projects?archived=1");
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.text()).toContain("No archived projects.");
    expect(wrapper.find(".project-tabs").exists()).toBe(false);
    await wrapper.get(".projects-nav").trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("No archived projects.");
    expect(routeUrl().search).toContain("archived=1");
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper.get('[role="menuitemradio"]').trigger("click");
    await flushPromises();
    expect(wrapper.get('[aria-label="Project list"]').text()).toContain("Project A");
    expect(routeUrl().search).not.toContain("archived=1");
    wrapper.unmount();
  });
  it("uses Project path then first repository path; keeps hierarchy and deduplicates UI rows", () => {
    expect(projectRoot(a)).toBe("/workspace/a");
    expect(projectRoot(auto)).toBe("/auto/repo");
    expect(projectRoot(home)).toBeUndefined();
    const duplicate = { ...a, repos: [...a.repos, ...a.repos] };
    expect(projectSessions(duplicate)).toHaveLength(1);
    expect(duplicate.repos).toHaveLength(2);
  });
  it("validates authenticated Project paths and keeps workspace operations profile scoped", async () => {
    const fetch = setup();
    await api.projects("alpha");
    await api.project("alpha", "p_a");
    expect(fetch.mock.calls[0]?.[0]).toBe("/api/plugins/chathermes/projects?profile=alpha");
    await expect(api.project("alpha", "../x")).rejects.toThrow("Invalid Hermes Project response");
    await api.project("alpha", "/auto/repo");
    expect(fetch.mock.calls.at(-1)?.[0]).toBe(
      "/api/plugins/chathermes/projects/detail?project_id=%2Fauto%2Frepo&profile=alpha",
    );
    await api.projectCreate("alpha", "p_a");
    await expect(api.messages("beta", "project_created")).rejects.toMatchObject({ status: 404 });
    expect(fetch.mock.calls.at(-1)?.[0]).toContain("/api/sessions/project_created/messages");
  });
});

it("restores canonical session membership without a project hint", async () => {
  setup();
  history.replaceState({}, "", "/chathermes?profile=alpha#/chat/project_s1?profile=alpha");
  const wrapper = mount(App);
  await flushPromises();
  expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
  expect(nativeOwner.attach).toHaveBeenCalledExactlyOnceWith("alpha", "project_s1");
  await wrapper.get('[aria-label="Screen options"]').trigger("click");
  expect(wrapper.get('[role="menu"]').text()).toContain("New Project Chat");
  wrapper.unmount();
});
it("opens an automatic project whose gateway ID is a filesystem path", async () => {
  setup();
  history.replaceState({}, "", "/chathermes?profile=alpha#/projects/%2Fauto%2Frepo?profile=alpha");
  const wrapper = mount(App);
  await flushPromises();
  expect(wrapper.get('[aria-label="Selected Project"]').text()).toContain("/auto/repo");
  expect(nativeOwner.attach).not.toHaveBeenCalled();
  wrapper.unmount();
});

describe("URL-authoritative composer context", () => {
  it.each([
    ["/?session=project_s1&project=p_a", "", "Message Hermes…", "ChatHermes"],
    ["/projects/p_a?session=project_s1&project=p_b", "", "Message Project A", "Projects"],
    [
      "/chat/project_s1?session=s1&project=p_b",
      "project_s1",
      "Message Project A",
      "Native worktree chat",
    ],
    ["/chat/s1?session=project_s1&project=p_a", "s1", "Message Hermes…", "Ungrouped"],
  ])("uses the path on deep link and refresh: %s", async (path, selected, placeholder, title) => {
    setup();
    history.replaceState({}, "", "/chathermes#" + path);
    for (let refresh = 0; refresh < 2; refresh++) {
      const wrapper = mount(App);
      await flushPromises();
      expect(wrapper.findComponent({ name: "SessionSidebar" }).props("selected")).toBe(selected);
      expect(wrapper.get("#prompt").attributes("placeholder")).toBe(placeholder);
      expect(wrapper.get(".header-title").text()).toBe(title);
      expect(wrapper.find(".header-project-subtitle").exists()).toBe(
        selected === "project_s1" || path.startsWith("/projects/p_a"),
      );
      if (!selected) expect(nativeOwner.attach).not.toHaveBeenCalled();
      else expect(nativeOwner.attach).toHaveBeenCalledExactlyOnceWith("", selected);
      wrapper.unmount();
    }
  });

  it.each([
    "/inbox",
    "/projects",
    "/scheduled",
    "/scheduled/job",
    "/scheduled/job/run",
    "/projects/p_a/settings",
    "/projects/p_a/instructions",
    "/projects/p_a/artifacts",
    "/artifacts",
    "/settings",
    "/kanban",
  ])("selects no session and hides the composer on %s", async (path) => {
    setup();
    history.replaceState({}, "", `/chathermes#${path}?session=project_s1&project=p_a`);
    const wrapper = mount(App);
    await flushPromises();
    expect(wrapper.get("#prompt").isVisible()).toBe(false);
    expect(wrapper.findComponent({ name: "SessionSidebar" }).props("selected")).toBe("");
    expect(nativeOwner.attach).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it.each(["alpha", "beta"])("opens and reloads an empty route-owned draft in %s", async (p) => {
    setup();
    const create = vi.spyOn(api, "projectCreate");
    const detail = vi.spyOn(api, "project");
    history.replaceState({}, "", `/chathermes#/projects/p_a/new?profile=${p}&session=s1`);
    let wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    expect(detail).toHaveBeenCalledWith(p, "p_a", expect.any(AbortSignal));
    expect(nativeOwner.attach).not.toHaveBeenCalled();
    expect(wrapper.findAll(".message")).toHaveLength(0);
    await wrapper.get("#prompt").setValue("Unsent local text");
    (wrapper.get("#prompt").element as HTMLTextAreaElement).focus();
    expect(document.activeElement).toBe(wrapper.get("#prompt").element);
    wrapper.unmount();
    wrapper = mount(App, { attachTo: document.body });
    await flushPromises();
    expect(routeUrl().pathname).toBe("/projects/p_a/new");
    expect(routeUrl().searchParams.get("profile")).toBe(p);
    expect((wrapper.get("#prompt").element as HTMLTextAreaElement).value).toBe("");
    expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Project A");
    expect(create).not.toHaveBeenCalled();
    expect(nativeOwner.attach).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it.each(["missing", "archived", "pathless", "wrong-id", "other-profile"])(
    "blocks first send from a direct %s project draft while keeping focus",
    async (state) => {
      setup();
      vi.spyOn(api, "project").mockImplementation(async (p) => {
        if (state === "missing" || (state === "other-profile" && p === "beta"))
          throw new Error("Project unavailable");
        return {
          ...a,
          id: state === "wrong-id" ? "p_b" : a.id,
          archived: state === "archived",
          path: state === "pathless" ? "" : a.path,
          repos: state === "pathless" ? [] : a.repos,
        };
      });
      const create = vi.spyOn(api, "projectCreate");
      history.replaceState(
        {},
        "",
        `/chathermes#/projects/p_a/new?profile=${state === "other-profile" ? "beta" : "alpha"}`,
      );
      const wrapper = mount(App, { attachTo: document.body });
      await flushPromises();
      await wrapper.get("#prompt").setValue("Do not send");
      (wrapper.get("#prompt").element as HTMLTextAreaElement).focus();
      expect(document.activeElement).toBe(wrapper.get("#prompt").element);
      expect(wrapper.get('[aria-label="Send message"]').attributes("disabled")).toBeDefined();
      await wrapper.get("form").trigger("submit");
      await flushPromises();
      expect(create).not.toHaveBeenCalled();
      expect(nativeOwner.submit).not.toHaveBeenCalled();
      wrapper.unmount();
    },
  );

  it("opens another empty composer when New Project Chat is selected on a draft", async () => {
    setup();
    const create = vi.spyOn(api, "projectCreate");
    history.replaceState({}, "", "/chathermes#/projects/p_a/new?profile=alpha");
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get("#prompt").setValue("Discard this unsent draft");
    await wrapper.get('[aria-label="Screen options"]').trigger("click");
    await wrapper
      .findAll('[role="menuitem"]')
      .find((item) => item.text() === "New Project Chat")!
      .trigger("click");
    await flushPromises();
    expect((wrapper.get("#prompt").element as HTMLTextAreaElement).value).toBe("");
    expect(routeUrl().pathname + routeUrl().search).toBe("/projects/p_a/new?profile=alpha");
    expect(create).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("rejects late Project details after draft navigation and profile changes", async () => {
    setup();
    let finish!: (value: Project) => void;
    vi.spyOn(api, "project").mockImplementation((p, id) =>
      p === "alpha" && id === "p_a"
        ? new Promise((resolve) => {
            finish = resolve;
          })
        : Promise.resolve({ ...b, path: "/workspace/b" }),
    );
    const create = vi.spyOn(api, "projectCreate");
    history.replaceState({}, "", "/chathermes#/projects/p_a/new?profile=alpha");
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    await flushPromises();
    await router.push("/projects/p_b/new?profile=beta");
    await flushPromises();
    finish(a);
    await flushPromises();
    expect(wrapper.get("#prompt").attributes("placeholder")).toBe("Message Project B");
    await wrapper.get("#prompt").setValue("Send in beta only");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(create).toHaveBeenCalledExactlyOnceWith("beta", "p_b");
    expect(nativeOwner.submit).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it.each(["preparation", "native creation"])(
    "restores first-send text and attachments after failed %s and retries once",
    async (failure) => {
      const fetch = setup();
      const normalFetch = fetch.getMockImplementation()!;
      let fail = true;
      fetch.mockImplementation(async (url, init) => {
        if (url.includes("/projects/session?") && fail)
          return failure === "preparation"
            ? json({ detail: "Preparation unavailable" }, 503)
            : json({ native_create: { cwd: a.path } });
        return normalFetch(url, init);
      });
      const nativeCreate = vi
        .spyOn(NativeGatewayViewer, "create")
        .mockRejectedValue(new Error("Creation unavailable"));
      const upload = vi.spyOn(api, "upload").mockResolvedValue({ path: "/uploads/draft.txt" });
      history.replaceState({}, "", "/chathermes#/projects/p_a/new?profile=alpha");
      const wrapper = mount(App);
      await flushPromises();
      await wrapper.get("#prompt").setValue("  Keep my first message  ");
      await (
        wrapper.getComponent(ChatComposer).vm as unknown as {
          stageFiles(files: File[]): Promise<void>;
        }
      ).stageFiles([new File(["draft"], "draft.txt", { type: "text/plain" })]);
      await wrapper.get("form").trigger("submit");
      await flushPromises();
      expect(routeUrl().pathname).toBe("/projects/p_a/new");
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe(
        "  Keep my first message  ",
      );
      expect(wrapper.find('[aria-label="Remove draft.txt"]').exists()).toBe(true);
      expect(wrapper.get('[aria-label="Send message"]').attributes("disabled")).toBeUndefined();
      expect(nativeOwner.submit).not.toHaveBeenCalled();
      expect(nativeCreate).toHaveBeenCalledTimes(failure === "native creation" ? 1 : 0);
      fail = false;
      await wrapper.get("form").trigger("submit");
      await flushPromises();
      expect(routeSession()).toBe("project_created");
      expect(nativeOwner.submit).toHaveBeenCalledExactlyOnceWith(
        "Keep my first message",
        expect.any(Function),
        expect.any(Object),
        [
          { type: "text", text: "Keep my first message" },
          { type: "text", text: expect.stringContaining("/uploads/draft.txt") },
        ],
      );
      const content = vi.mocked(nativeOwner.submit).mock.calls[0]![1] as () => Promise<unknown>;
      expect(await content()).toEqual([
        { type: "text", text: "Keep my first message" },
        { type: "text", text: expect.stringContaining("/uploads/draft.txt") },
      ]);
      expect(upload).toHaveBeenCalledTimes(1);
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe("");
      wrapper.unmount();
    },
  );

  it.each(["edit", "attachment", "navigation", "leave and return", "profile"])(
    "does not restore an abandoned send after %s during failed creation",
    async (change) => {
      setup();
      let reject!: (error: Error) => void;
      vi.spyOn(api, "projectCreate").mockImplementation(
        () =>
          new Promise((_resolve, fail) => {
            reject = fail;
          }),
      );
      vi.spyOn(api, "upload").mockResolvedValue({ path: "/uploads/new.txt" });
      history.replaceState({}, "", "/chathermes#/projects/p_a/new?profile=alpha");
      const router = createChatHermesRouter();
      const wrapper = vueMount(App, { global: { plugins: [router] } });
      await flushPromises();
      await wrapper.get("#prompt").setValue("Old first message");
      await wrapper.get("form").trigger("submit");
      if (change === "navigation" || change === "leave and return") {
        await router.push("/?profile=alpha");
        await flushPromises();
        if (change === "leave and return") await router.push("/projects/p_a/new?profile=alpha");
      } else if (change === "profile") await router.push("/projects/p_a/new?profile=beta");
      await flushPromises();
      if (change === "attachment")
        await (
          wrapper.getComponent(ChatComposer).vm as unknown as {
            stageFiles(files: File[]): Promise<void>;
          }
        ).stageFiles([new File(["new"], "new.txt", { type: "text/plain" })]);
      else {
        await wrapper.get("#prompt").setValue("Changed draft");
        // Even an edit back to empty owns the cleared draft.
        if (change === "edit") await wrapper.get("#prompt").setValue("");
      }
      reject(new Error("Late creation failure"));
      await flushPromises();
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe(
        change === "edit" || change === "attachment" ? "" : "Changed draft",
      );
      expect(wrapper.find('[aria-label="Remove new.txt"]').exists()).toBe(change === "attachment");
      expect(nativeOwner.submit).not.toHaveBeenCalled();
      wrapper.unmount();
    },
  );

  it.each(["/", "/projects/p_a", "/projects/p_a/new"])(
    "preserves follow-up text, attachments and mode through slow successful first send from %s",
    async (path) => {
      setup();
      let finish!: (value: { id: string }) => void;
      vi.spyOn(api, path === "/" ? "create" : "projectCreate").mockImplementation(
        () =>
          new Promise<{ id: string; source: string; cwd: string }>((resolve) => {
            finish = (made) => resolve({ ...made, source: "desktop", cwd: "/workspace/a" });
          }),
      );
      let uploaded!: (value: { path: string }) => void;
      const upload = vi.spyOn(api, "upload").mockImplementation(
        () =>
          new Promise((resolve) => {
            uploaded = resolve;
          }),
      );
      history.replaceState({}, "", `/chathermes#${path}?profile=alpha`);
      const wrapper = mount(App, { attachTo: document.body });
      await flushPromises();
      await wrapper.get("#prompt").setValue("First submission");
      await wrapper.get("form").trigger("submit");
      const original = wrapper.get("#prompt").element;
      await wrapper.get("#prompt").setValue("  Follow-up while creating  ");
      await wrapper.get('[aria-label="Attachment options"]').trigger("click");
      await wrapper
        .findAll("button")
        .find((button) => button.text() === "Plan mode")!
        .trigger("click");
      const staging = (
        wrapper.getComponent(ChatComposer).vm as unknown as {
          stageFiles(files: File[]): Promise<void>;
        }
      ).stageFiles([new File(["follow-up"], "follow-up.txt", { type: "text/plain" })]);
      await vi.waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
      (original as HTMLTextAreaElement).focus();
      finish({ id: "project_created" });
      await flushPromises();
      expect(routeSession()).toBe("project_created");
      expect(wrapper.get("#prompt").element).toBe(original);
      expect(document.activeElement).toBe(original);
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe(
        "  Follow-up while creating  ",
      );
      expect(wrapper.find('[aria-label="Remove follow-up.txt"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("Plan mode · next message");
      expect(nativeOwner.submit).toHaveBeenCalledExactlyOnceWith(
        "First submission",
        expect.any(Function),
        expect.any(Object),
        expect.any(Array),
      );
      await wrapper.get("#prompt").setValue("Latest edit after transition");
      uploaded({ path: "/uploads/follow-up.txt" });
      await staging;
      await wrapper.get("form").trigger("submit");
      await flushPromises();
      expect(vi.mocked(nativeOwner.submit).mock.calls[1]![0]).toBe(
        "/plan\nLatest edit after transition",
      );
      const content = vi.mocked(nativeOwner.submit).mock.calls[1]![1] as () => Promise<unknown>;
      expect(await content()).toEqual([
        { type: "text", text: "/plan\nLatest edit after transition" },
        { type: "text", text: expect.stringContaining("/uploads/follow-up.txt") },
      ]);
      wrapper.unmount();
    },
  );

  it.each(["navigation", "leave and return", "profile"])(
    "does not transfer a follow-up after %s during successful creation",
    async (change) => {
      setup();
      let finish!: (value: { id: string }) => void;
      vi.spyOn(api, "projectCreate").mockImplementation(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      );
      history.replaceState({}, "", "/chathermes#/projects/p_a/new?profile=alpha");
      const router = createChatHermesRouter();
      const wrapper = vueMount(App, { global: { plugins: [router] } });
      await flushPromises();
      await wrapper.get("#prompt").setValue("First submission");
      await wrapper.get("form").trigger("submit");
      await wrapper.get("#prompt").setValue("Abandoned follow-up");
      await router.push(
        change === "profile" ? "/projects/p_a/new?profile=beta" : "/?profile=alpha",
      );
      await flushPromises();
      if (change === "leave and return") {
        await router.push("/projects/p_a/new?profile=alpha");
        await flushPromises();
      }
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe("");
      await wrapper.get("#prompt").setValue("New destination edit");
      finish({ id: "project_created" });
      await flushPromises();
      expect(wrapper.get<HTMLTextAreaElement>("#prompt").element.value).toBe(
        "New destination edit",
      );
      expect(routeSession()).toBeNull();
      expect(nativeOwner.submit).not.toHaveBeenCalled();
      wrapper.unmount();
    },
  );

  it("creates and sends once, replacing the draft URL and ignoring stale project queries", async () => {
    setup();
    let finish!: (value: { id: string }) => void;
    const create = vi.spyOn(api, "projectCreate").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    history.replaceState({}, "", "/chathermes#/chat/project_s1?profile=alpha");
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    await flushPromises();
    await router.push("/projects/p_a/new?profile=alpha&project=p_b&session=s1");
    await flushPromises();
    await wrapper.get("#prompt").setValue("Send only once");
    await wrapper.get("form").trigger("submit");
    await wrapper.get("form").trigger("submit");
    expect(create).toHaveBeenCalledExactlyOnceWith("alpha", "p_a");
    finish({ id: "project_created" });
    await flushPromises();
    expect(routeUrl().pathname + routeUrl().search).toBe("/chat/project_created?profile=alpha");
    expect(nativeOwner.submit).toHaveBeenCalledExactlyOnceWith(
      "Send only once",
      expect.any(Function),
      expect.any(Object),
      expect.any(Array),
    );
    router.back();
    await vi.waitFor(() => expect(routeSession()).toBe("project_s1"));
    wrapper.unmount();
  });

  it("does not submit after navigating away and returning during canonical attachment", async () => {
    setup();
    history.replaceState({}, "", "/chathermes#/projects/p_a/new?profile=alpha");
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    await flushPromises();
    let attached!: () => void;
    vi.mocked(nativeOwner.attach).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          attached = resolve;
        }),
    );
    await wrapper.get("#prompt").setValue("Must not follow navigation");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(routeSession()).toBe("project_created");
    await router.push("/?profile=alpha");
    await flushPromises();
    await wrapper.get("#prompt").setValue("A new home draft stays available");
    expect(wrapper.get('[aria-label="Send message"]').attributes("disabled")).toBeUndefined();
    await router.push("/chat/project_created?profile=alpha");
    await flushPromises();
    attached();
    await flushPromises();
    expect(nativeOwner.submit).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("keeps a newer first-send locked when an abandoned creation completes", async () => {
    setup();
    const pending: ((value: { id: string }) => void)[] = [];
    const create = vi.spyOn(api, "projectCreate").mockImplementation(
      () =>
        new Promise((resolve) => {
          pending.push(resolve);
        }),
    );
    history.replaceState({}, "", "/chathermes#/projects/p_a/new?profile=alpha");
    const router = createChatHermesRouter();
    const wrapper = vueMount(App, { global: { plugins: [router] } });
    await flushPromises();
    await wrapper.get("#prompt").setValue("Abandoned send");
    await wrapper.get("form").trigger("submit");
    await router.push("/?profile=alpha");
    await flushPromises();
    await router.push("/projects/p_a/new?profile=alpha");
    await flushPromises();
    await wrapper.get("#prompt").setValue("Current send");
    await wrapper.get("form").trigger("submit");
    expect(create).toHaveBeenCalledTimes(2);
    pending[0]!({ id: "abandoned" });
    await flushPromises();
    expect(routeSession()).toBeNull();
    await wrapper.get("form").trigger("submit");
    expect(create).toHaveBeenCalledTimes(2);
    pending[1]!({ id: "project_created" });
    await flushPromises();
    expect(nativeOwner.submit).toHaveBeenCalledExactlyOnceWith(
      "Current send",
      expect.any(Function),
      expect.any(Object),
      expect.any(Array),
    );
    wrapper.unmount();
  });

  it.each(["/", "/projects/p_a"])("submits the first draft once using %s", async (path) => {
    setup();
    history.replaceState({}, "", `/chathermes#${path}?session=project_s1&project=p_b`);
    const create = vi.spyOn(api, "create"),
      scoped = vi.spyOn(api, "projectCreate");
    const wrapper = mount(App);
    await flushPromises();
    await wrapper.get("#prompt").setValue("Initial submission");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    if (path === "/") {
      expect(create).toHaveBeenCalledExactlyOnceWith("");
      expect(scoped).not.toHaveBeenCalled();
    } else {
      expect(scoped).toHaveBeenCalledExactlyOnceWith("", "p_a");
      expect(create).not.toHaveBeenCalled();
    }
    expect(routeUrl().pathname).toBe(`/chat/${path === "/" ? "other_created" : "project_created"}`);
    expect(routeUrl().search).toBe("");
    expect(nativeOwner.submit).toHaveBeenCalledExactlyOnceWith(
      "Initial submission",
      expect.any(Function),
      expect.any(Object),
      expect.any(Array),
    );
    wrapper.unmount();
  });
});

it("updates session membership from backend events without changing URL or reattaching", async () => {
  setup();
  vi.stubGlobal("EventSource", class {});
  let refresh!: () => void;
  vi.spyOn(api, "projectEvents").mockImplementation((_profile, callback) => {
    refresh = callback;
    return vi.fn();
  });
  const catalog = vi
    .spyOn(api, "projects")
    .mockResolvedValue({ projects: [a, b], scoped_session_ids: ["project_s1"] });
  history.replaceState({}, "", "/chathermes#/chat/project_s1?project=wrong");
  const wrapper = mount(App);
  await flushPromises();
  expect(wrapper.get(".header-project-subtitle").text()).toBe("Project A");
  const url = location.href;
  const close = vi.spyOn(nativeOwner, "close");
  catalog.mockResolvedValue({
    projects: [{ ...b, sessionIds: ["project_s1"] }],
    scoped_session_ids: ["project_s1"],
  });
  refresh();
  await vi.waitFor(() => expect(wrapper.get(".header-project-subtitle").text()).toBe("Project B"));
  catalog.mockResolvedValue({ projects: [], scoped_session_ids: [] });
  refresh();
  await vi.waitFor(() => expect(wrapper.find(".header-project-subtitle").exists()).toBe(false));
  expect(location.href).toBe(url);
  expect(nativeOwner.attach).toHaveBeenCalledTimes(1);
  expect(close).not.toHaveBeenCalled();
  wrapper.unmount();
});
