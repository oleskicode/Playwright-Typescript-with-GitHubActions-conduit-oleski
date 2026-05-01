import { expect, test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { UserProfilePage } from "../pages/UserProfilePage";

test("UI - User Profile Elements", async ({ page }) => {
  const homePage = new HomePage(page);
  const userProfilePage = new UserProfilePage(page);

  // Open User Profile
  await homePage.goto();
  await homePage.openUserProfile();

  // Verify user Profile Elements are visible
  await userProfilePage.verifyPageElements();
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
