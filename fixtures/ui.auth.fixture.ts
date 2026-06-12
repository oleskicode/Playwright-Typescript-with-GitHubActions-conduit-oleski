import { test as base, expect } from "./ui.pages.fixture";

// Extending base test to include setup and teardown
export const test = base.extend({
  page: async ({ page, request }, use, testInfo) => {
    // --- SETUP (beforeEach logic) ---
    testInfo.annotations.push({
      type: "Start time (logged from the fixture):",
      description: new Date().toISOString(),
    });

    const requestURL = `${process.env.API_BASE_URL}/users/login`;
    const response = await request.post(requestURL, {
      data: {
        user: {
          email: process.env.USER_EMAIL,
          password: process.env.USER_PASSWORD,
        },
      },
    });
    expect(response.ok).toBeTruthy();
    const responseBody = await response.json();
    const authToken = responseBody.user.token;
    await page.addInitScript((token) => {
      window.localStorage.setItem("id_token", token);
    }, authToken);

    // Provide the page to the test
    await use(page);

    // --- TEARDOWN (afterEach logic) ---
    testInfo.annotations.push({
      type: "End Time (logged from the fixture):",
      description: new Date().toISOString(),
    });

    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach(
        "Screenshot on failure (logged from the fixture):",
        {
          body: screenshot,
          contentType: "image/png",
        },
      );
    }
  },
});

export { expect } from "@playwright/test";
