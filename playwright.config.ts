import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/visual",
  testMatch:
    process.env.CHATHERMES_TEST_SUITE === "legacy" ? "**/*.spec.ts" : "**/live-real.spec.ts",
  outputDir: "./tests/visual-output",
  testIgnore: process.env.CHATHERMES_TEST_SUITE === "legacy" ? "**/live-real.spec.ts" : [],
  timeout: 90_000,
  workers: 1,
  use: {
    launchOptions: { executablePath: process.env.CHATHERMES_CHROMIUM },
    baseURL: process.env.CHATHERMES_TEST_URL || "http://127.0.0.1:9119",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
});
