import assert from "node:assert/strict";
import { test } from "node:test";
import { installedPage, openInstalledApp } from "./android-pwa.mjs";

function window(standalone, path = "/chathermes", calls = [], failure) {
  return {
    url: () => `http://localhost:9119${path}`,
    evaluate: async () => standalone,
    getByLabel: (name) => ({ fill: async () => calls.push(name) }),
    getByRole: (_, { name }) => ({
      click: async () => calls.push(name),
      waitFor: async () => {
        if (failure) throw failure;
        calls.push("composer-ready");
      },
    }),
  };
}
function chrome(pages, calls = []) {
  return { contexts: () => [{ pages: () => pages }], close: async () => calls.push("disconnect") };
}
function controls(browsers, calls) {
  return {
    adb: (...args) => {
      calls.push(args.join(" "));
      return args.includes("size") ? "Physical size: 1440x3040" : "";
    },
    tap: async () => calls.push("launch-icon"),
    connectChrome: async () => {
      calls.push("connect");
      return browsers.shift();
    },
  };
}

await test("finds an installed login window among ordinary tabs", async () => {
  const login = window(true, "/login?next=%2Fchathermes");
  assert.equal(await installedPage(chrome([window(false), login]), { timeout: 0 }), login);
});

await test("a browser shortcut cannot satisfy standalone verification and errors omit query values", async () => {
  await assert.rejects(
    installedPage(chrome([window(false, "/chathermes?private=hidden")]), { timeout: 0 }),
    (error) =>
      error.message.includes("/chathermes (standalone=false)") && !error.message.includes("hidden"),
  );
});

await test("verifies first launch before stopping Chrome for the cold start", async () => {
  const calls = [];
  const first = chrome([window(true, "/chathermes", calls)], calls);
  const cold = chrome([window(true, "/chathermes", calls)], calls);
  const native = controls([first, cold], calls);
  let browser = await openInstalledApp(chrome([], calls), native);
  assert.equal(browser, first);
  assert.ok(!calls.some((call) => call.includes("force-stop")));
  browser = await openInstalledApp(browser, native, { coldStart: true });
  assert.equal(browser, cold);
  assert.ok(
    calls.indexOf("composer-ready") < calls.indexOf("shell am force-stop com.android.chrome"),
  );
  const stopped = calls.indexOf("shell am force-stop com.android.chrome");
  assert.equal(
    calls[stopped - 1],
    "shell am start -W -a android.intent.action.MAIN -c android.intent.category.HOME",
  );
  assert.equal(calls.filter((call) => call === "launch-icon").length, 2);
  assert.equal(calls.filter((call) => call === "connect").length, 2);
  assert.equal(calls.at(-1), "composer-ready");
});

await test("restores authentication inside the installed window after a cold start", async () => {
  const calls = [];
  const browser = chrome([window(true, "/login", calls)], calls);
  assert.equal(
    await openInstalledApp(undefined, controls([browser], calls), { coldStart: true }),
    browser,
  );
  assert.deepEqual(calls.slice(-4), ["Username", "Password", "Sign in", "composer-ready"]);
});

await test("returns HOME again when the pin callback foregrounds Chrome instead of swiping it", async () => {
  const calls = [];
  const browser = chrome([window(true, "/chathermes", calls)], calls);
  const native = controls([browser], calls);
  const adb = native.adb;
  native.adb = (...args) => {
    const result = adb(...args);
    return args.includes("activities")
      ? "topResumedActivity=ActivityRecord{com.android.chrome/ChromeTabbedActivity}"
      : result;
  };
  let taps = 0;
  native.tap = async () => {
    if (++taps === 1) throw new Error("Chrome is in front");
  };
  await openInstalledApp(undefined, native);
  assert.equal(taps, 2);
  assert.equal(calls.filter((call) => call.includes("category.HOME")).length, 2);
  assert.ok(!calls.some((call) => call.includes("input swipe")));
});

await test("a failed first launch disconnects and does not proceed to a cold start", async () => {
  const calls = [];
  const failure = new Error("Dashboard unavailable");
  const browser = chrome([window(true, "/chathermes", calls, failure)], calls);
  await assert.rejects(
    openInstalledApp(undefined, controls([browser], calls)),
    (error) => error === failure,
  );
  assert.equal(calls.at(-1), "disconnect");
  assert.ok(!calls.some((call) => call.includes("force-stop")));
});

await test("searches another launcher page when HOME is still in front", async () => {
  const calls = [];
  const native = controls([chrome([window(true)])], calls);
  const adb = native.adb;
  native.adb = (...args) => {
    const result = adb(...args);
    return args.includes("activities")
      ? "topResumedActivity=ActivityRecord{com.google.android.apps.nexuslauncher/.NexusLauncherActivity}"
      : result;
  };
  let taps = 0;
  native.tap = async () => {
    if (++taps === 1) throw new Error("Icon is on another page");
  };
  await openInstalledApp(undefined, native);
  assert.equal(taps, 2);
  assert.equal(calls.filter((call) => call.includes("category.HOME")).length, 1);
  assert.equal(calls.filter((call) => call.includes("input swipe")).length, 1);
});

await test("bounds repeated interruptions and fails without accepting a browser window", async () => {
  const calls = [];
  const native = controls([], calls);
  const adb = native.adb;
  native.adb = (...args) => {
    const result = adb(...args);
    return args.includes("activities")
      ? "topResumedActivity=ActivityRecord{com.android.chrome/Main}"
      : result;
  };
  let taps = 0;
  native.tap = async () => {
    taps++;
    throw new Error("Launcher unavailable");
  };
  await assert.rejects(openInstalledApp(undefined, native), /launcher icon unavailable/);
  assert.equal(taps, 8);
  assert.ok(!calls.includes("connect"));
});
