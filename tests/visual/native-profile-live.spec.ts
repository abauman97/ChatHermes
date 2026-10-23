import { expect, test } from "@playwright/test";
import { signIn, sessionFromUrl } from "./login";

test("native gateway chats and recovers independently in every profile", async ({
  page,
  context,
}, info) => {
  test.setTimeout(240000);
  await signIn(page);
  const plugin = page.locator(".chathermes-embedded");
  const selected: { profile: string; id: string; marker: string }[] = [];
  const calls: { profile?: string; method: string }[] = [];
  const sockets: string[] = [];
  page.on("websocket", (socket) => {
    sockets.push(new URL(socket.url()).pathname);
    socket.on("framesent", (event) => {
      try {
        const f = JSON.parse(String(event.payload));
        if (f.method) calls.push({ profile: f.params?.profile, method: f.method });
      } catch {
        /* only sanitized RPC route metadata is retained */
      }
    });
  });
  try {
    for (const profile of ["default", "alpha", "beta"]) {
      await page.goto(`/chathermes?profile=${profile}#/?profile=${profile}`);
      await expect(plugin.getByRole("button", { name: "Choose model", exact: true })).toBeEnabled();
      const marker = `NATIVE_${profile.toUpperCase()}_${info.project.name.toUpperCase()}`;
      const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
      await composer.fill(`Reply with exactly ${marker}. Do not use any tools.`);
      await plugin.getByRole("button", { name: "Send message", exact: true }).click();
      await expect.poll(() => sessionFromUrl(page.url())).toBeTruthy();
      const id = sessionFromUrl(page.url())!;
      selected.push({ profile, id, marker });
      await expect(plugin.locator(".message.assistant")).toContainText(marker, { timeout: 80000 });
      await composer.fill(`Draft for ${profile}`);
      await expect(composer).toBeFocused();
      await expect(composer).toHaveCSS("font-size", "16px");
      await page.screenshot({
        path: info.outputPath(`native-${profile}.png`),
        mask: [plugin.locator('[class*="model"]')],
      });
      // A real offline/online transition closes the viewer; recovery must use
      // the same profile and must never re-dispatch the prompt.
      const submits = calls.filter((call) => call.method === "prompt.submit").length;
      await context.setOffline(true);
      await expect(composer).toBeEnabled();
      await context.setOffline(false);
      await expect(plugin.getByRole("button", { name: "Send message", exact: true })).toBeEnabled({
        timeout: 20000,
      });
      await expect(plugin.locator(".message.assistant")).toContainText(marker);
      expect(calls.filter((call) => call.method === "prompt.submit")).toHaveLength(submits);
    }
    for (const entry of selected) {
      await page.goto(
        `/chathermes?profile=${entry.profile}#/chat/${entry.id}?profile=${entry.profile}`,
      );
      await expect(plugin.locator(".message.assistant")).toContainText(entry.marker);
      for (const other of selected.filter((other) => other.profile !== entry.profile))
        await expect(plugin.locator(".transcript")).not.toContainText(other.marker);
    }
    expect(sockets).toContain("/api/ws");
    expect(sockets).not.toContain("/api/plugins/chathermes/chat/ws");
    expect(
      calls.filter((call) => call.method === "prompt.submit").map((call) => call.profile),
    ).toEqual(["default", "alpha", "beta"]);
  } finally {
    await context.setOffline(false);
    const stop = plugin.getByRole("button", { name: "Stop response", exact: true });
    if (await stop.isVisible()) await stop.click();
    for (const { profile, id } of selected)
      await page.request.delete(`/api/plugins/chathermes/api/sessions/${id}?profile=${profile}`);
  }
});

test("native gateway requires a fresh authenticated ticket", async ({ page }) => {
  await signIn(page);
  const result = await page.evaluate(async () => {
    const connect = (ticket?: string) =>
      new Promise<boolean>((resolve) => {
        const url = new URL("/api/ws", location.href);
        url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
        const socket = new WebSocket(
          url,
          ticket ? ["hermes-gateway-v1", "hermes-gateway-ticket." + ticket] : [],
        );
        const timer = setTimeout(() => {
          socket.close();
          resolve(false);
        }, 10000);
        socket.onopen = () => {
          clearTimeout(timer);
          socket.close();
          resolve(true);
        };
        socket.onerror = socket.onclose = () => {
          clearTimeout(timer);
          resolve(false);
        };
      });
    const unauthenticated = await fetch("/api/auth/ws-ticket", {
      method: "POST",
      credentials: "omit",
    });
    const { ticket } = await (await fetch("/api/auth/ws-ticket", { method: "POST" })).json();
    const missing = await connect();
    const accepted = await connect(ticket);
    const reused = await connect(ticket);
    return { unauthenticated: unauthenticated.status, missing, accepted, reused };
  });
  expect(result).toEqual({ unauthenticated: 401, missing: false, accepted: true, reused: false });
});

test("native resume scopes the same stored ID to its profile", async ({ page }) => {
  await signIn(page);
  const id = `native-collision-${crypto.randomUUID()}`;
  const profiles = ["default", "alpha", "beta"];
  try {
    for (const profile of profiles) {
      const created = await page.request.post(
        `/api/plugins/chathermes/api/sessions?profile=${profile}`,
        { data: { id, title: `Synthetic collision ${profile}` } },
      );
      expect(created.status()).toBe(201);
    }
    const results = await page.evaluate(
      async ({ id, profiles }) => {
        const results: {
          profile: string;
          runtime: string;
          title?: string;
          owner?: string;
          failed?: boolean;
        }[] = [];
        for (const profile of profiles) {
          const { ticket } = await (await fetch("/api/auth/ws-ticket", { method: "POST" })).json();
          results.push(
            await new Promise((resolve) => {
              const url = new URL("/api/ws", location.href);
              url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
              const socket = new WebSocket(url, [
                "hermes-gateway-v1",
                "hermes-gateway-ticket." + ticket,
              ]);
              const finish = (value: (typeof results)[number]) => {
                clearTimeout(timer);
                socket.onclose = null;
                socket.close();
                resolve(value);
              };
              let runtime = "";
              let owner: string | undefined;
              const timer = setTimeout(() => finish({ profile, runtime: "", failed: true }), 15000);
              socket.onopen = () =>
                socket.send(
                  JSON.stringify({
                    jsonrpc: "2.0",
                    id: "resume",
                    method: "session.resume",
                    params: { profile, session_id: id, source: "desktop" },
                  }),
                );
              socket.onmessage = (event) => {
                for (const line of String(event.data).split("\n").filter(Boolean)) {
                  const frame = JSON.parse(line);
                  if (frame.id === "resume") {
                    if (frame.error) {
                      finish({ profile, runtime: "", failed: true });
                      continue;
                    }
                    runtime = frame.result?.session_id || "";
                    owner = frame.result?.info?.profile_name;
                    socket.send(
                      JSON.stringify({
                        jsonrpc: "2.0",
                        id: "title",
                        method: "session.title",
                        params: { profile, session_id: runtime },
                      }),
                    );
                  } else if (frame.id === "title")
                    finish({
                      profile,
                      runtime,
                      owner,
                      title: frame.result?.title,
                      failed: !!frame.error,
                    });
                }
              };
              socket.onerror = () => {};
              socket.onclose = () => finish({ profile, runtime: "", failed: true });
            }),
          );
        }
        return results;
      },
      { id, profiles },
    );
    for (const result of results) {
      expect(result.failed).toBe(false);
      expect(result.runtime).toBeTruthy();
      expect(result.title).toBe(`Synthetic collision ${result.profile}`);
      if (result.owner) expect(result.owner).toBe(result.profile);
    }
    expect(new Set(results.map((result) => result.runtime)).size).toBe(3);
  } finally {
    for (const profile of profiles)
      await page.request.delete(`/api/plugins/chathermes/api/sessions/${id}?profile=${profile}`);
  }
});

test("default-profile aliases keep legacy uncertain sends locked", async ({ page }) => {
  await signIn(page);
  const id = `alias-lock-${crypto.randomUUID()}`;
  const response = await page.request.post("/api/plugins/chathermes/api/sessions?profile=default", {
    data: { id, title: "Synthetic alias lock" },
  });
  expect(response.status()).toBe(201);
  try {
    await page.evaluate(
      (id) =>
        localStorage.setItem(
          "chathermes.native-outcome:" + JSON.stringify(["", id]) + ":legacy",
          "unknown",
        ),
      id,
    );
    await page.goto(`/chathermes?profile=default#/chat/${id}?profile=default`);
    const plugin = page.locator(".chathermes-embedded");
    await expect(
      plugin.getByRole("button", { name: "Resolve uncertain submission", exact: true }),
    ).toBeVisible();
    const composer = plugin.getByRole("textbox", { name: "Message Hermes" });
    await composer.fill("Draft stays editable while its old send is uncertain");
    await expect(composer).toBeFocused();
    await expect(plugin.locator(".composer .send-button")).toBeDisabled();
  } finally {
    await page.evaluate(
      (id) =>
        localStorage.removeItem(
          "chathermes.native-outcome:" + JSON.stringify(["", id]) + ":legacy",
        ),
      id,
    );
    await page.request.delete(`/api/plugins/chathermes/api/sessions/${id}?profile=default`);
  }
});
