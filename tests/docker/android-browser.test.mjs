import assert from "node:assert/strict";
import { test } from "node:test";
import { startChrome, waitForChrome, openDashboard } from "./android-browser.mjs";

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

function clock() {
  let time = 0;
  return {
    timeout: 3000,
    now: () => time,
    wait: async (ms) => {
      time += ms;
    },
  };
}

await test("initializes HOME and opens Chrome with onboarding disabled before CDP", async () => {
  const calls = [];
  let homeAttempts = 0;
  let chromeAttempts = 0;
  const adb = (...args) => {
    const command = args.join(" ");
    calls.push(command);
    if (command.includes("category.HOME") && homeAttempts++ === 0) {
      throw new Error("Launcher still starting");
    }
    if (command.includes("action.VIEW") && chromeAttempts++ === 0) {
      return "Error: Activity not started";
    }
    return "Status: ok";
  };
  await startChrome(adb, async () => calls.push("CDP"), clock());
  assert.equal(homeAttempts, 2);
  assert.equal(chromeAttempts, 2);
  const home = calls.findLastIndex((call) => call.includes("category.HOME"));
  const flags = calls.findIndex((call) =>
    call.includes("--no-first-run --disable-fre --no-default-browser-check"),
  );
  const launch = calls.findLastIndex((call) =>
    call.includes("start -W -a android.intent.action.VIEW"),
  );
  assert.ok(home < flags && flags < launch && launch < calls.indexOf("CDP"));
});

await test("failed HOME startup times out before starting Chrome", async () => {
  const calls = [];
  await assert.rejects(
    startChrome(
      (...args) => {
        const command = args.join(" ");
        calls.push(command);
        return "Status: timeout";
      },
      () => assert.fail("premature CDP"),
      clock(),
    ),
    /Android launcher unavailable/,
  );
  assert.ok(calls.every((call) => !call.includes("com.android.chrome")));
});

await test("CDP waits through proxy failures, incomplete metadata, and connection races", async () => {
  let polls = 0;
  let connects = 0;
  const browser = {};
  const result = await waitForChrome(
    "http://localhost:9223",
    async (endpoint, { timeout }) => {
      assert.equal(endpoint, "http://localhost:9223");
      assert.ok(timeout > 0 && timeout <= 5000);
      if (++connects === 1) throw new Error("Chrome replaced its target");
      return browser;
    },
    {
      ...clock(),
      timeout: 10000,
      request: async (url, { signal }) => {
        assert.equal(url, "http://localhost:9223/json/version");
        assert.ok(signal instanceof AbortSignal);
        polls++;
        if (polls === 1) throw new Error("Connection reset");
        return {
          ok: polls !== 2,
          json: async () => (polls === 3 ? {} : { webSocketDebuggerUrl: "ws://chrome" }),
        };
      },
    },
  );
  assert.equal(result, browser);
  assert.equal(polls, 5);
  assert.equal(connects, 2);
});

await test("CDP readiness has a bounded deadline and preserves the last failure", async () => {
  const failure = new Error("Connection reset");
  let polls = 0;
  await assert.rejects(
    waitForChrome("http://localhost:9223", () => assert.fail("premature CDP"), {
      ...clock(),
      request: async () => {
        polls++;
        throw failure;
      },
    }),
    (error) => error.message === "Chrome debugging unavailable" && error.cause === failure,
  );
  assert.equal(polls, 3);
});
