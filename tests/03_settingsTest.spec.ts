import { test } from "../fixtures/baseTest";
import { HomePage } from "../pages/HomePage";
import { SettingsPage } from "../pages/SettingsPage";

test("UI - Settings Page - Logged Out", async ({ page }) => {
  const homePage = new HomePage(page);
  const settingsPage = new SettingsPage(page);

  // Open Settings Page as a Logged In user
  await homePage.goto();
  await settingsPage.goto();
  await settingsPage.verifyUserIsSignedIn();
});
