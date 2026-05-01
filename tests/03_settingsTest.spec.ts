import { test, expect } from "@playwright/test";
import { SettingsPage } from "../pages/SettingsPage";
import { HomePage } from "../pages/HomePage";

test("UI - Settings Page - Logged Out", async ({ page }) => {
  const homePage = new HomePage(page);
  const settingsPage = new SettingsPage(page);

  // Open Settings Page as a Logged In user
  await homePage.goto();
  await settingsPage.goto();
  await settingsPage.verifyUserIsSignedIn();
});

test.beforeEach(async ({ page, request }, testInfo) => {
  testInfo.annotations.push({
    type: "Start Time:",
    description: new Date().toISOString(),
  });

  // Get Auth Token via API
  const requestURL = process.env.API_BASE_URL + "/users/login";
  const response = await request.post(requestURL, {
    data: {
      user: {
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
      },
    },
  });
  expect(response.ok).toBeTruthy();
  const responceBody = await response.json();
  const authToken = responceBody.user.token;

  // inject token into Browser Context
  await page.addInitScript((token) => {
    window.localStorage.setItem("id_token", token);
  }, authToken);
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
