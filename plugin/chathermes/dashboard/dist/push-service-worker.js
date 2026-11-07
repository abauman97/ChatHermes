const APP_URL = "/chathermes";
// Replaced by the production build; no network-loaded configuration or data.
const PRECACHE = {"release":"bdc19a84ff66415fee201fd8dbfbd24be525af0e6a13457557dbdf18cddd411a","assets":[{"url":"/api/plugins/chathermes/assets/dist/apple-touch-icon.png","revision":"c524550b4303ee7c98358c93bf2b869a807f8c84466f60bac0f4d5e1ba6bda1c"},{"url":"/dashboard-plugins/chathermes/dist/assets/app-CUHsnDUS.js","revision":"37c258c9537f38bb58e9c16781a29efb03d8b3adff3734aa6bee56f95f3c3d66"},{"url":"/api/plugins/chathermes/assets/dist/icons/icon-192.png","revision":"c524550b4303ee7c98358c93bf2b869a807f8c84466f60bac0f4d5e1ba6bda1c"},{"url":"/api/plugins/chathermes/assets/dist/icons/icon-512.png","revision":"c3f98539df31124555d18f4d40d20406c5765db39888a80f2da1f5b59fe09fe5"},{"url":"/dashboard-plugins/chathermes/dist/index.js","revision":"026c31316aa16341d2530cf57bce2b7bad4b8d148edb920cfc1cd4c97e46a549"},{"url":"/api/plugins/chathermes/assets/dist/manifest.webmanifest","revision":"ac096a5fc3e3a99c3db695b8d226a0441aaa0b642d8c3690dd91cd7b5104e023"},{"url":"/dashboard-plugins/chathermes/dist/style.css","revision":"e1b3b0e7871445247571eda966ae6ac3d8a490349ab3c926ed29a2bdc6174e32"}]};
// The authenticated worker route binds only the dashboard's serving profile.
// Other profiles can own different plugin copies and must remain network-only.
const ASSET_PROFILE = /* __CHATHERMES_ASSET_PROFILE__ */ "";
const ASSETS = PRECACHE
  ? PRECACHE.assets.flatMap((asset) => {
      const prefix = "/dashboard-plugins/";
      return ASSET_PROFILE && asset.url.startsWith(prefix)
        ? [
            asset,
            {
              ...asset,
              url:
                prefix +
                "@" +
                encodeURIComponent(ASSET_PROFILE) +
                "/" +
                asset.url.slice(prefix.length),
            },
          ]
        : [asset];
    })
  : [];
const CACHE_PREFIX = "chathermes-static-v1-";
const CACHE_NAME =
  PRECACHE &&
  CACHE_PREFIX + PRECACHE.release + (ASSET_PROFILE ? "-" + encodeURIComponent(ASSET_PROFILE) : "");

async function verifiedAsset(asset) {
  const response = await fetch(new URL(asset.url, self.location.origin), {
    credentials: "same-origin",
    cache: "no-store",
    redirect: "error",
  });
  if (response.status !== 200 || response.redirected) throw new Error("Static asset unavailable");
  const bytes = await response.clone().arrayBuffer();
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  if (hash !== asset.revision) throw new Error("Static asset release mismatch");
  return response;
}

async function installAssets() {
  if (!PRECACHE) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    for (const asset of ASSETS) {
      await cache.put(new URL(asset.url, self.location.origin), await verifiedAsset(asset));
    }
    for (const asset of ASSETS) {
      if (!(await cache.match(new URL(asset.url, self.location.origin))))
        throw new Error("Static asset cache incomplete");
    }
  } catch (error) {
    await caches.delete(CACHE_NAME);
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (!PRECACHE || request.method !== "GET" || request.mode === "navigate") return;
  if (
    request.headers.has("range") ||
    request.headers.has("authorization") ||
    request.headers.has("x-hermes-gateway-ticket")
  )
    return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.search) return;
  const asset = ASSETS.find((asset) => asset.url === url.pathname);
  // Open tabs may still import an older release's hashed chunks after another
  // tab approves activation. Only previously verified immutable chunks qualify;
  // stable entry/CSS URLs must never fall back to another release.
  const immutable = ASSETS.some((entry) => {
    const directory = entry.url.slice(0, entry.url.lastIndexOf("/") + 1);
    return (
      directory.endsWith("/dist/assets/") &&
      url.pathname.startsWith(directory) &&
      /^[^/]+-[A-Za-z0-9_-]{8,}\.(?:js|css)$/.test(url.pathname.slice(directory.length))
    );
  });
  if (!asset && !immutable) return;
  event.respondWith(
    (async () => {
      if (!asset) {
        for (const name of await caches.keys()) {
          if (!name.startsWith(CACHE_PREFIX)) continue;
          const response = await (await caches.open(name)).match(request);
          if (response) return response;
        }
        return fetch(request);
      }
      const cache = await caches.open(CACHE_NAME);
      // Never fall back to another release's stable entry/CSS. A cache eviction
      // may use the network only if it still serves these exact build bytes.
      return (await cache.match(request)) || verifiedAsset(asset);
    })(),
  );
});

// Never cache WindowClient URLs or session state: both can outlive SPA routes.
function currentSession(client) {
  return new Promise((resolve) => {
    if (client.visibilityState !== "visible") return resolve(null);
    const channel = new MessageChannel();
    const finish = (value) => {
      clearTimeout(timer);
      channel.port1.close();
      channel.port2.close();
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), 300);
    channel.port1.onmessage = (event) =>
      finish(client.visibilityState === "visible" ? visibleSession(event.data) : null);
    try {
      client.postMessage({ type: "chathermes.session.query" }, [channel.port2]);
    } catch {
      finish(null);
    }
  });
}

function routeSession(value) {
  try {
    const url = new URL(value);
    if (url.origin !== self.location.origin || url.pathname !== APP_URL) return null;
    if (!url.hash.startsWith("#/")) return null;
    const hash = new URL(url.hash.slice(1), self.location.origin);
    const scheduled = /^\/scheduled\/([^/]+)\/([^/]+)$/.exec(hash.pathname);
    const match = /^\/chat\/([^/]+)$/.exec(hash.pathname);
    if ((!match && !scheduled) || hash.searchParams.getAll("profile").length > 1) return null;
    const params = hash.searchParams,
      session = match ? decodeURIComponent(match[1]) : "";
    const profile = params.get("profile") || "default";
    if (scheduled) {
      const job = decodeURIComponent(scheduled[1]),
        run = decodeURIComponent(scheduled[2]);
      if (!validScheduled(job, run) || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(profile))
        return null;
      return { profile, session: "", job, run };
    }
    if (
      !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(profile) ||
      !/^[A-Za-z0-9_-]{1,128}$/.test(session)
    )
      return null;
    return { profile, session };
  } catch {
    return null;
  }
}

function validScheduled(job, run) {
  return (
    typeof job === "string" &&
    /^[A-Za-z0-9][A-Za-z0-9_-]{0,159}$/.test(job) &&
    typeof run === "string" &&
    (/^output:\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/.test(run) ||
      /^execution:[a-f0-9]{32}$/.test(run) ||
      new RegExp("^cron_" + job + "_\\d{8}_\\d{6}$").test(run))
  );
}

function visibleSession(data) {
  if (
    data?.type !== "chathermes.session" ||
    (data.connected !== true && data.scheduled !== true) ||
    data.visible !== true ||
    typeof data.url !== "string"
  )
    return null;
  const route = routeSession(data.url);
  return route &&
    route.profile === data.profile &&
    (route.job
      ? data.scheduled === true && route.job === data.job && route.run === data.run
      : data.connected === true && route.session === data.session)
    ? route
    : null;
}

async function windowClients() {
  try {
    return await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  } catch {
    return [];
  }
}

async function visibleSessions(onVisible = () => false) {
  const clients = await windowClients();
  const sameOrigin = (client) => {
    try {
      return new URL(client.url).origin === self.location.origin;
    } catch {
      return false;
    }
  };
  const candidates = (
    await Promise.all(
      clients
        .filter(sameOrigin)
        .map(async (client) => ({ id: client.id, session: await currentSession(client) })),
    )
  ).filter((reply) => reply.session);
  if (!candidates.length) return [];
  // An early positive may have become hidden or changed sessions while another client timed out.
  // Re-query only positive candidates that still exist after every handshake.
  const currentClients = await windowClients();
  const confirmed = (
    await Promise.all(
      currentClients
        .filter(sameOrigin)
        .filter((client) => candidates.some((reply) => reply.id === client.id))
        .map(async (client) => ({ id: client.id, session: await currentSession(client) })),
    )
  ).filter((reply) => reply.session);
  const sessions = [];
  // A positive in that round can age too. Confirm and act one client at a time:
  // never wait for another client's reply between confirmation and its action.
  for (const reply of confirmed) {
    const live = await windowClients();
    const client = live.find((client) => client.id === reply.id && sameOrigin(client));
    if (!client) continue;
    const session = await currentSession(client);
    if (!session || !matches(session, reply.session)) continue;
    sessions.push(session);
    if (onVisible(session)) break;
  }
  return sessions;
}
const matches = (a, b) =>
  a.profile === b.profile && a.session === b.session && a.job === b.job && a.run === b.run;
async function closeVisibleNotifications(target) {
  // Fetch first: a pending notification lookup must not age a positive reply.
  const notifications = await self.registration.getNotifications().catch(() => []);
  let visible = false;
  await visibleSessions((session) => {
    for (const notification of notifications) {
      if (!notification.tag?.startsWith("chathermes:")) continue;
      const route = routeSession(notification.data?.url);
      if (route && matches(session, route)) notification.close();
    }
    if (target && matches(session, target)) visible = true;
    return visible;
  });
  return target ? visible : true;
}

// Serialize display and close operations; then re-query after display so a
// visible session arriving during showNotification cannot leave a stale notification.
let notificationWork = Promise.resolve();
function enqueue(work) {
  const result = notificationWork.then(work);
  notificationWork = result.catch(() => {});
  return result;
}
self.addEventListener("message", (event) => {
  if (event.data?.type === "chathermes.update.activate") {
    // Only a same-origin plugin window can request user-approved activation.
    // No claim or broadcast navigation: each tab decides when to reload.
    if (!event.source?.id) return;
    try {
      const url = new URL(event.source.url);
      if (url.origin !== self.location.origin || url.pathname !== APP_URL) return;
    } catch {
      return;
    }
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (event.data?.type !== "chathermes.session" || !event.source?.id) return;
  event.waitUntil(
    enqueue(async () => {
      await closeVisibleNotifications();
    }),
  );
});

// Installation always waits; only the explicit message above skips waiting.
self.addEventListener("install", (event) => event.waitUntil(installAssets()));
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      if (!PRECACHE) return;
      // Forced activation can leave other tabs running older code. Preserve
      // their verified chunks until a later activation with no plugin windows.
      if (
        (await windowClients()).some((client) => {
          try {
            const url = new URL(client.url);
            return url.origin === self.location.origin && url.pathname === APP_URL;
          } catch {
            return false;
          }
        })
      )
        return;
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    })(),
  ),
);
self.addEventListener("push", (event) => {
  let data;
  try {
    data = event.data?.json();
  } catch {
    return;
  }
  if (
    !data ||
    !["turn.complete", "approval", "clarify", "attention", "test", "scheduled"].includes(data.type)
  )
    return;
  const profile =
    typeof data.profile === "string" && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(data.profile)
      ? data.profile
      : "";
  const scheduled = data.type === "scheduled";
  const title =
    scheduled && typeof data.title === "string" && data.title.trim()
      ? Array.from(data.title).slice(0, 200).join("")
      : profile || "ChatHermes";
  // Accept queued legacy payloads, but never display a title for another profile.
  if (!scheduled && data.title !== title && data.title !== "ChatHermes") return;
  const session =
    typeof data.session_id === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(data.session_id)
      ? data.session_id
      : "";
  if (scheduled && (!profile || !validScheduled(data.job_id, data.run_id))) return;
  if (!session && data.type !== "test" && !scheduled) return;
  const url = new URL(APP_URL, self.location.origin);
  url.searchParams.set("profile", profile || "default");
  const query = new URLSearchParams(profile ? { profile } : {});
  url.hash =
    (scheduled
      ? "/scheduled/" + encodeURIComponent(data.job_id) + "/" + encodeURIComponent(data.run_id)
      : session
        ? "/chat/" + encodeURIComponent(session)
        : "/") + (query.size ? "?" + query : "");
  event.waitUntil(
    enqueue(async () => {
      if (data.type !== "test" && profile) {
        if (
          await closeVisibleNotifications(
            scheduled
              ? { profile, session: "", job: data.job_id, run: data.run_id }
              : { profile, session },
          )
        )
          return;
      }
      await self.registration.showNotification(title, {
        body: typeof data.body === "string" ? Array.from(data.body).slice(0, 3000).join("") : "",
        tag:
          typeof data.tag === "string" && /^chathermes:[A-Za-z0-9_:-]{1,300}$/.test(data.tag)
            ? data.tag
            : `chathermes:${profile}:${session}:${data.type}`,
        renotify: false,
        data: { url: url.href },
        icon: "/api/plugins/chathermes/assets/dist/icons/icon-192.png",
        badge: "/api/plugins/chathermes/assets/dist/icons/icon-192.png",
      });
      if (data.type !== "test") await closeVisibleNotifications();
    }),
  );
});
function navigateInApp(client, target) {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (loaded) => {
      clearTimeout(timer);
      channel.port1.close();
      channel.port2.close();
      resolve(loaded);
    };
    const timer = setTimeout(() => finish(false), 10000);
    channel.port1.onmessage = ({ data }) => {
      if (data?.url !== target.href) return;
      if (data.type === "chathermes.navigated") finish(true);
    };
    try {
      client.postMessage({ type: "chathermes.navigate", url: target.href }, [channel.port2]);
    } catch {
      finish(false);
    }
  });
}
self.addEventListener("notificationclick", (event) => {
  // Keep the notification until the destination session is visible.
  let target;
  try {
    target = new URL(event.notification.data?.url || APP_URL, self.location.origin);
  } catch {
    return;
  }
  if (
    target.origin !== self.location.origin ||
    target.pathname !== APP_URL ||
    !target.hash.startsWith("#/")
  )
    return;
  if (target.hash.startsWith("#/scheduled/") && !routeSession(target.href)) return;
  event.waitUntil(
    (async () => {
      const clients = (await windowClients()).filter(
        (client) => new URL(client.url).origin === target.origin,
      );
      const client =
        clients.find((client) => new URL(client.url).pathname === APP_URL) || clients[0];
      if (client) {
        try {
          await client.focus();
        } catch {
          // Activation restrictions can deny focus. Routing the existing
          // client must still run; it does not require focus permission.
        }
        if (await navigateInApp(client, target)) return;
        if (typeof client.navigate === "function") {
          try {
            if (await client.navigate(target.href)) return;
          } catch {
            // A dashboard page outside this worker's scope cannot be navigated
            // by this worker. Fall through to the browser's window-opening path.
          }
        }
      }
      await self.clients.openWindow(target.href);
    })(),
  );
});
