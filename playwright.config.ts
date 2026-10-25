import { defineConfig, devices } from "@playwright/test";
const workflow = process.env.CHATHERMES_TEST_SUITE === "workflow";
export default defineConfig({
  testDir: workflow ? "./tests/workflows" : "./tests/visual",
  testMatch: workflow
    ? "**/*.spec.ts"
    : process.env.CHATHERMES_TEST_SUITE === "legacy"
      ? "**/*.spec.ts"
      : [
          "**/live-real.spec.ts",
          "**/routing-live.spec.ts",
          "**/notification-click-live.spec.ts",
          "**/profile-routing-live.spec.ts",
          "**/native-profile-live.spec.ts",
          "**/unattended-native-live.spec.ts",
          "**/image-preview-live.spec.ts",
        ],
  outputDir: "./tests/visual-output",
  testIgnore:
    process.env.CHATHERMES_TEST_SUITE === "legacy"
      ? [
          "**/live-real.spec.ts",
          "**/routing-live.spec.ts",
          "**/notification-click-live.spec.ts",
          "**/profile-routing-live.spec.ts",
          "**/native-profile-live.spec.ts",
          "**/unattended-native-live.spec.ts",
          "**/image-preview-live.spec.ts",
        ]
      : [],
  grepInvert: workflow && !process.env.CHATHERMES_NATIVE_TESTS ? /@installed|@native/ : undefined,
  timeout: 90_000,
  expect: { timeout: workflow ? 30_000 : 5_000 },
  workers: 1,
  use: {
    launchOptions: { executablePath: process.env.CHATHERMES_CHROMIUM },
    baseURL: process.env.CHATHERMES_TEST_URL || "http://127.0.0.1:9119",
    screenshot: "only-on-failure",
    // Authentication and gateway tickets can appear in raw traces.
    trace: workflow ? "off" : "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
    ...(workflow
      ? [
          {
            name: "android",
            use: { browserName: "chromium" as const, isMobile: true },
            grepInvert: process.env.CHATHERMES_NATIVE_TESTS
              ? /@desktop/
              : /@desktop|@installed|@native/,
          },
        ]
      : []),
  ],
});
