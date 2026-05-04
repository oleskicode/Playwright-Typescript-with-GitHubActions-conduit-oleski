import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test("UI - Login Test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // Open Login page
  await loginPage.goto();

  // Login
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

  // Verify
  await homePage.verifyUserIsLoggedIn(process.env.USER_NAME!);
});

test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push({
    type: "Start Time (from beforeEach):",
    description: new Date().toISOString(),
  });
});

test.afterEach(async ({ page }, testInfo) => {
  testInfo.annotations.push({
    type: "End Time (from afterEach):",
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
