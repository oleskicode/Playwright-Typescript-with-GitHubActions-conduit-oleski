import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import dotenv from "dotenv";

test("UI - Simple Login Test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Open Login page
  await loginPage.goto();

  // Login
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

  // Verify
  await loginPage.verifyUserIsLoggedIn(process.env.USER_NAME!);
});

test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push({
    type: "Start Time:",
    description: new Date().toISOString(),
  });
});

test.afterEach(async ({ page }, testInfo) => {
  testInfo.annotations.push({
    type: "End Time:",
    description: new Date().toISOString(),
  });

  // attach screenshot to the playwright html report
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot({
      fullPage: true,
    });
    await testInfo.attach("Screenshot on failure:", {
      body: screenshot,
      contentType: "image/png",
    });
  }
});
