import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  // Global setup:
  globalSetup: "./setup/auth.setup.ts",
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    baseURL: process.env.BASE_URL,
    storageState: `.auth/user.json`,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    // Chromium engine, Pixel 7 viewport/UA
    {
      name: "chromium-pixel7",
      use: {
        ...devices["Pixel 7"],
      },
    },
    // WebKit engine, iPhone 15 Pro viewport/UA
    {
      name: "webkit-iphone15pro",
      use: {
        ...devices["iPhone 15 Pro"],
      },
    },
  ],
});
