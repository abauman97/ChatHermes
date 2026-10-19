const APP_URL = "/chathermes";

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
      /^execution:[a-f0-9]{32}$/.test(run))
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
  if (event.data?.type !== "chathermes.session" || !event.source?.id) return;
  event.waitUntil(
    enqueue(async () => {
      await closeVisibleNotifications();
    }),
  );
});

self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
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
      const clients = await windowClients();
      for (const client of clients) {
        if (
          new URL(client.url).origin === target.origin &&
          new URL(client.url).pathname === APP_URL
        ) {
          await client.focus();
          if (typeof client.navigate === "function") {
            try {
              await client.navigate(target.href);
              return;
            } catch {
              // Keep the focused PWA open rather than creating a duplicate.
            }
          }
          client.postMessage({ type: "chathermes.navigate", url: target.href });
          return;
        }
      }
      await self.clients.openWindow(target.href);
    })(),
  );
});
