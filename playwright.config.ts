import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

const CHROMIUM_PATH =
  "/home/punkhazard/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome";
const chromiumExecutable = fs.existsSync(CHROMIUM_PATH)
  ? CHROMIUM_PATH
  : undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath: chromiumExecutable,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    },
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: "Laptop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 375, height: 812 },
      },
    },
  ],
  webServer: {
    command: "bun run start",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
