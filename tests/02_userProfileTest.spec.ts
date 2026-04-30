import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { UserProfilePage } from "../pages/UserProfilePage";

test("UI - User Profile Elements", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const userProfilePage = new UserProfilePage(page);

  // Open Login page
  await loginPage.goto();

  // Login
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  await homePage.verifyUserIsLoggedIn(process.env.USER_NAME!);

  // Open User Profile
  await homePage.openUserProfile();

  // Verify user Profile Elements are visible
  await userProfilePage.verifyPageElements();
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
