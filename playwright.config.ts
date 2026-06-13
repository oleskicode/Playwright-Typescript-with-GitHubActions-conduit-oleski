import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  // Global setup:
  globalSetup: "./setup/global.resigster.user.setup.ts",
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    baseURL: process.env.BASE_URL,
    storageState: `userStorageState.json`,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Android / Pixel-like experience
    {
      name: "android",
      use: {
        ...devices["Pixel 7"],
      },
    },
    // iPhone / Safari experience
    {
      name: "iphone",
      use: {
        ...devices["iPhone 15 Pro"],
      },
    },
  ],
});
