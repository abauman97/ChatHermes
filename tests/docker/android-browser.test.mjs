import assert from "node:assert/strict";
import { test } from "node:test";
import { openDashboard } from "./android-browser.mjs";

function chrome({ authenticated = false, failure, lostTarget = false } = {}) {
  let closed = false;
  const calls = [];
  const page = {
    url: () => `http://localhost:9119/${authenticated ? "chathermes" : "login"}`,
    isClosed: () => closed,
    setDefaultTimeout() {},
    goto: async () => {},
    getByLabel: (name) => ({ fill: async () => calls.push(name) }),
    getByRole: (_, { name }) => ({
      click: async () => {
        calls.push(name);
        authenticated = true;
      },
      waitFor: async () => {
        if (failure) {
          closed = lostTarget;
          throw failure;
        }
      },
    }),
  };
  const context = { pages: () => [page] };
  const browser = {
    contexts: () => [context],
    isConnected: () => true,
    close: async () => calls.push("disconnect"),
  };
  return { browser, context, page, calls };
}

await test("signs in and returns the ready dashboard without reconnecting", async () => {
  const device = chrome();
  const result = await openDashboard(device.browser, () => assert.fail("unexpected reconnect"));
  assert.equal(result.page, device.page);
  assert.deepEqual(device.calls, ["Username", "Password", "Sign in"]);
});

await test("recovers a replaced sign-in target and reuses successful authentication", async () => {
  const initial = chrome({ failure: new Error("Target closed"), lostTarget: true });
  const replacement = chrome({ authenticated: true });
  let reconnects = 0;
  const result = await openDashboard(initial.browser, async () => {
    reconnects++;
    return replacement.browser;
  });
  assert.equal(result.browser, replacement.browser);
  assert.equal(result.page, replacement.page);
  assert.equal(reconnects, 1);
  assert.deepEqual(initial.calls, ["Username", "Password", "Sign in", "disconnect"]);
  assert.deepEqual(replacement.calls, []);
});

await test("a live-page readiness error fails without retrying authentication", async () => {
  const failure = new Error("Composer did not load");
  const device = chrome({ failure });
  await assert.rejects(
    openDashboard(device.browser, () => assert.fail("unexpected reconnect")),
    (error) => error === failure,
  );
  assert.equal(device.calls.at(-1), "disconnect");
});

await test("repeated target closures stop after three attempts", async () => {
  const failure = new Error("Target closed");
  const devices = Array.from({ length: 3 }, () => chrome({ failure, lostTarget: true }));
  let reconnects = 0;
  await assert.rejects(
    openDashboard(devices[0].browser, async () => devices[++reconnects].browser),
    (error) => error === failure,
  );
  assert.equal(reconnects, 2);
  for (const device of devices) assert.equal(device.calls.at(-1), "disconnect");
});
