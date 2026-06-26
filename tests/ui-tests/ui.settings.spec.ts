import { test } from "../../fixtures/ui.pages.fixture";

test.describe("UI - Settings", () => {
  test(
    "UI - Settings Page - Signed In",
    { tag: ["@smoke", "@settings"] },
    async ({ homePage, settingsPage }) => {
      // Open Settings Page as a signed-in user
      await homePage.goto();
      await settingsPage.goto();

      // Verify Settings page for the signed-in user
      await settingsPage.verifyUserIsSignedIn();
    },
  );
});
