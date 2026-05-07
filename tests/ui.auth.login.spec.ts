import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push({
    type: "startTime",
    description: new Date().toISOString(),
  });
});

test.afterEach(async ({ page }, testInfo) => {
  testInfo.annotations.push({
    type: "endTime",
    description: new Date().toISOString(),
  });

  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach("failure-screenshot", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  }
});

test(
  "should login successfully with valid credentials",
  { tag: ["@smoke", "@authentication"] },
  async ({ page }) => {
    const userEmail = process.env.USER_EMAIL!;
    const userPassword = process.env.USER_PASSWORD!;
    const userName = process.env.USER_NAME!;

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();

    await loginPage.login(userEmail, userPassword);

    await homePage.verifyUserIsLoggedIn(userName);
  },
);
