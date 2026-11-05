/// <reference types="node" />
import { createHash, webcrypto } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vite-plus/test";

const source = await readFile("public/push-service-worker.js", "utf8");
const origin = "https://chat.test";
const root = "/dashboard-plugins/chathermes/dist/";
const hash = (bytes: string) => createHash("sha256").update(bytes).digest("hex");
const manifest = (release = "one", body = "old") => ({
  release,
  assets: ["index.js", "style.css", "assets/app-abc.js"].map((name) => ({
    url: root + name,
    revision: hash(body + name),
  })),
});
function storage() {
  const stores = new Map<string, Map<string, Response>>();
  const key = (value: Request | URL | string) =>
    value instanceof Request ? value.url : String(value);
  return {
    stores,
    keys: async () => [...stores.keys()],
    delete: vi.fn(async (name: string) => stores.delete(name)),
    open: async (name: string) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name)!;
      return {
        match: async (request: Request | URL | string) => store.get(key(request))?.clone(),
        put: async (request: Request | URL | string, response: Response) => {
          store.set(key(request), response.clone());
        },
      };
    },
  };
}
function worker(release = manifest(), caches = storage(), profile = "") {
  const handlers: Record<string, (event: any) => void> = {};
  const fetch = vi.fn(
    async (url: URL) =>
      new Response((release.release === "one" ? "old" : "new") + url.pathname.slice(root.length)),
  );
  const skipWaiting = vi.fn();
  const claim = vi.fn();
  const matchAll = vi.fn(async () => [] as { url: string }[]);
  runInNewContext(
    source
      .replace("/* __CHATHERMES_PRECACHE__ */ null", JSON.stringify(release))
      .replace('/* __CHATHERMES_ASSET_PROFILE__ */ ""', JSON.stringify(profile)),
    {
      URL,
      Uint8Array,
      crypto: webcrypto,
      caches,
      fetch,
      self: {
        location: { origin },
        addEventListener: (type: string, handler: any) => {
          handlers[type] = handler;
        },
        skipWaiting,
        clients: { claim, matchAll },
      },
    },
  );
  const lifecycle = async (type: string) => {
    let pending: Promise<void> | undefined;
    handlers[type]!({
      waitUntil: (promise: Promise<void>) => {
        pending = promise;
      },
    });
    await pending;
  };
  const request = (path: string, init?: RequestInit) => {
    let response: Promise<Response> | undefined;
    handlers.fetch!({
      request: new Request(new URL(path, origin), init),
      respondWith: (promise: Promise<Response>) => {
        response = promise;
      },
    });
    return response;
  };
  const message = async (data: unknown, source?: { id: string; url: string }) => {
    let pending: Promise<void> | undefined;
    handlers.message!({
      data,
      source,
      waitUntil: (work: Promise<void>) => {
        pending = work;
      },
    });
    await pending;
  };
  return { caches, fetch, lifecycle, request, skipWaiting, claim, matchAll, message };
}

describe("release precaching", () => {
  it("activates only on an explicit message from a same-origin plugin window", async () => {
    const w = worker();
    await w.lifecycle("install");
    for (const source of [
      undefined,
      { id: "tab", url: "https://other.test/chathermes" },
      { id: "tab", url: origin + "/sessions" },
    ])
      await w.message({ type: "chathermes.update.activate" }, source);
    expect(w.skipWaiting).not.toHaveBeenCalled();
    await w.message(
      { type: "chathermes.update.activate" },
      { id: "tab", url: origin + "/chathermes#/chat/test" },
    );
    expect(w.skipWaiting).toHaveBeenCalledTimes(1);
    expect(w.claim).not.toHaveBeenCalled();
  });

  it("retains old verified chunks for open tabs after activation, never old stable entries", async () => {
    const before = manifest();
    before.assets[2]!.url = root + "assets/app-abcdefgh.js";
    before.assets[2]!.revision = hash("oldassets/app-abcdefgh.js");
    const old = worker(before);
    await old.lifecycle("install");
    const after = manifest("two", "new");
    after.assets[2]!.url = root + "assets/app-ijklmnop.js";
    after.assets[2]!.revision = hash("newassets/app-ijklmnop.js");
    const next = worker(after, old.caches);
    await next.lifecycle("install");
    next.matchAll.mockResolvedValue([{ url: origin + "/chathermes#/chat/test" }]);
    await next.lifecycle("activate");
    expect(await old.caches.keys()).toHaveLength(2);
    next.fetch.mockRejectedValue(new Error("offline"));
    expect(await (await next.request(before.assets[2]!.url))!.text()).toBe(
      "oldassets/app-abcdefgh.js",
    );
    expect(await (await next.request(root + "index.js"))!.text()).toBe("newindex.js");
    expect(next.request(root + "assets/app-abcdefgh.js?profile=other")).toBeUndefined();
    next.caches.stores.get("chathermes-static-v1-two")!.clear();
    await expect(next.request(root + "index.js")).rejects.toThrow("offline");
    next.matchAll.mockResolvedValue([]);
    await next.lifecycle("activate");
    expect(await old.caches.keys()).toEqual(["chathermes-static-v1-two"]);
  });
  it("installs every asset and serves repeated/offline loads without fetching", async () => {
    const w = worker();
    await w.lifecycle("install");
    expect(w.fetch).toHaveBeenCalledTimes(3);
    expect(w.fetch.mock.calls[0]![0].origin).toBe(origin);
    w.fetch.mockRejectedValue(new Error("offline"));
    for (const asset of manifest().assets) {
      expect(await (await w.request(asset.url))!.text()).toBe("old" + asset.url.slice(root.length));
      expect(await (await w.request(asset.url))!.text()).toBe("old" + asset.url.slice(root.length));
    }
    expect(w.fetch).toHaveBeenCalledTimes(3);
    await w.lifecycle("activate");
    expect(w.skipWaiting).not.toHaveBeenCalled();
    expect(w.claim).not.toHaveBeenCalled();
  });

  it("keeps stable entry/CSS and hashed chunks in the old release until natural activation", async () => {
    const old = worker();
    await old.lifecycle("install");
    const updatedManifest = manifest("two", "new");
    updatedManifest.assets[2]!.url = root + "assets/app-def.js";
    updatedManifest.assets[2]!.revision = hash("newassets/app-def.js");
    const next = worker(updatedManifest, old.caches);
    await next.lifecycle("install");
    expect(await old.caches.keys()).toHaveLength(2);
    for (const asset of manifest().assets)
      expect(await (await old.request(asset.url))!.text()).toBe(
        "old" + asset.url.slice(root.length),
      );
    expect(next.skipWaiting).not.toHaveBeenCalled();
    await old.caches.open("other-app-cache");
    await old.caches.open("chathermes-static-v1-interrupted");
    await next.lifecycle("activate");
    expect(await old.caches.keys()).toEqual(["chathermes-static-v1-two", "other-app-cache"]);
    expect(await (await next.request(root + "index.js"))!.text()).toBe("newindex.js");
    expect(next.claim).not.toHaveBeenCalled();
  });

  for (const fault of [
    "network",
    "wrong bytes",
    "unauthorized",
    "redirect",
    "quota",
    "missing write",
  ]) {
    it(`rejects ${fault} during install and preserves a working release`, async () => {
      const old = worker();
      await old.lifecycle("install");
      const next = worker(manifest("two", "new"), old.caches);
      if (fault === "network")
        next.fetch
          .mockImplementationOnce(
            async (url: URL) => new Response("new" + url.pathname.slice(root.length)),
          )
          .mockRejectedValueOnce(new Error("interrupted"));
      if (fault === "wrong bytes") next.fetch.mockResolvedValueOnce(new Response("another deploy"));
      if (fault === "unauthorized")
        next.fetch.mockResolvedValueOnce(new Response("login", { status: 401 }));
      if (fault === "redirect") {
        const response = new Response("newindex.js");
        Object.defineProperty(response, "redirected", { value: true });
        next.fetch.mockResolvedValueOnce(response);
      }
      if (fault === "quota" || fault === "missing write") {
        const open = old.caches.open;
        vi.spyOn(old.caches, "open").mockImplementation(async (name) => {
          const cache = await open(name);
          if (name.endsWith("two"))
            cache.put = async () => {
              if (fault === "quota") throw new Error("quota");
            };
          return cache;
        });
      }
      await expect(next.lifecycle("install")).rejects.toThrow();
      expect(await old.caches.keys()).toEqual(["chathermes-static-v1-one"]);
      expect(await (await old.request(root + "index.js"))!.text()).toBe("oldindex.js");
    });
  }

  it("precaches only the serving profile alias without sharing another profile's copy", async () => {
    const w = worker(manifest(), storage(), "alpha");
    w.fetch.mockImplementation(
      async (url: URL) => new Response("old" + url.pathname.split("/dist/")[1]),
    );
    await w.lifecycle("install");
    expect(w.fetch).toHaveBeenCalledTimes(6);
    w.fetch.mockRejectedValue(new Error("offline"));
    expect(
      await (await w.request("/dashboard-plugins/@alpha/chathermes/dist/index.js"))!.text(),
    ).toBe("oldindex.js");
    expect(w.request("/dashboard-plugins/@beta/chathermes/dist/index.js")).toBeUndefined();
    expect(w.request("/dashboard-plugins/chathermes/dist/index.js?profile=beta")).toBeUndefined();
  });

  it("only uses a verified network fallback after eviction, without runtime cache writes", async () => {
    const w = worker();
    await w.lifecycle("install");
    w.caches.stores.get("chathermes-static-v1-one")!.clear();
    expect(await (await w.request(root + "style.css"))!.text()).toBe("oldstyle.css");
    expect(w.caches.stores.get("chathermes-static-v1-one")!.size).toBe(0);
    w.fetch.mockResolvedValue(new Response("new CSS"));
    await expect(w.request(root + "style.css")).rejects.toThrow("release mismatch");
  });

  it("leaves dynamic, authenticated, host, navigation, query and non-GET requests network-only", async () => {
    const w = worker();
    for (const path of [
      "/chathermes",
      "/api/sessions",
      "/api/plugins/chathermes/rpc",
      "/api/ws-ticket",
      "/api/plugins/chathermes/uploads/file.png",
      "/dashboard-plugins/other/dist/index.js",
      root + "unknown.js",
      root + "index.js?profile=alpha",
      "https://other.test" + root + "index.js",
    ])
      expect(w.request(path)).toBeUndefined();
    expect(w.request(root + "index.js", { method: "POST" })).toBeUndefined();
    expect(w.request(root + "index.js", { headers: { Authorization: "test" } })).toBeUndefined();
    expect(
      w.request(root + "index.js", { headers: { "X-Hermes-Gateway-Ticket": "test" } }),
    ).toBeUndefined();
    expect(w.request(root + "index.js", { headers: { Range: "bytes=0-1" } })).toBeUndefined();
    expect(w.fetch).not.toHaveBeenCalled();
    expect(await w.caches.keys()).toEqual([]);
  });
});

it("discovers build outputs with deployed URLs and deterministic byte-sensitive releases", async () => {
  const modulePath = "../../../../scripts/precache.mjs";
  const { generatePrecache } = await import(modulePath);
  const dir = await mkdtemp(join(tmpdir(), "chathermes-precache-"));
  try {
    await mkdir(join(dir, "assets"));
    await mkdir(join(dir, "icons"));
    const names = [
      "index.js",
      "style.css",
      "assets/app-abc.js",
      "assets/lazy-xyz.js",
      "lazy-root.mjs",
      "manifest.webmanifest",
      "icons/icon-192.png",
      "icons/icon-512.png",
      "apple-touch-icon.png",
    ];
    for (const name of names) await writeFile(join(dir, name), name);
    await writeFile(join(dir, "private.json"), "do not cache");
    const first = await generatePrecache(dir, source);
    expect(first.assets).toHaveLength(names.length);
    expect(first.assets.map((asset: { url: string }) => asset.url)).toContain(
      root + "lazy-root.mjs",
    );
    expect(first.assets.map((asset: { url: string }) => asset.url)).toContain(
      root + "assets/lazy-xyz.js",
    );
    expect(first.assets.map((asset: { url: string }) => asset.url)).toContain(
      "/api/plugins/chathermes/assets/dist/icons/icon-192.png",
    );
    expect(await generatePrecache(dir, source)).toEqual(first);
    for (const name of names) {
      await writeFile(join(dir, name), "changed " + name);
      expect((await generatePrecache(dir, source)).release).not.toBe(first.release);
      await writeFile(join(dir, name), name);
    }
    expect((await generatePrecache(dir, source + "\n// worker fix")).release).not.toBe(
      first.release,
    );
    const deployed = await readFile(join(dir, "push-service-worker.js"), "utf8");
    expect(deployed).toContain('"assets":');
    expect(deployed).not.toContain("/* __CHATHERMES_PRECACHE__ */ null");
    await rm(join(dir, "style.css"));
    await expect(generatePrecache(dir, source)).rejects.toThrow("style.css");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
