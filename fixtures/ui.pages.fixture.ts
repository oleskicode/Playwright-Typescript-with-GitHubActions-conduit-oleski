import { test as base } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { SettingsPage } from "../pages/SettingsPage";
import { UserFeedPage } from "../pages/UserFeedPage";
import { UserProfilePage } from "../pages/UserProfilePage";

type AppFixtures = {
  homePage: HomePage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  settingsPage: SettingsPage;
  userFeedPage: UserFeedPage;
  userProfilePage: UserProfilePage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  userFeedPage: async ({ page }, use) => {
    await use(new UserFeedPage(page));
  },
  userProfilePage: async ({ page }, use) => {
    await use(new UserProfilePage(page));
  },
});

export { expect } from "@playwright/test";
