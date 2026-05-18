import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test.beforeEach(async ({}, testInfo) => {
  testInfo.annotations.push({
    type: "startTime",
    description: new Date().toISOString(),
  });
});

test.afterEach(async ({}, testInfo) => {
  testInfo.annotations.push({
    type: "endTime",
    description: new Date().toISOString(),
  });
});

test(
  "should login successfully with valid credentials",
  { tag: ["@smoke", "@authentication"] },
  async ({ page }) => {
    const userEmail = process.env.USER_EMAIL;
    const userPassword = process.env.USER_PASSWORD;
    const userName = process.env.USER_NAME;

    if (!userEmail || !userPassword || !userName) {
      throw new Error("Missing required environment variables");
    }

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await test.step("Open login page", async () => {
      await loginPage.goto();
    });

    await test.step("Login with valid credentials", async () => {
      await loginPage.login(userEmail, userPassword);
    });

    await test.step("Verify login is successful", async () => {
      await homePage.verifyUserIsLoggedIn(userName);
    });
  },
);
