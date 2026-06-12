import { test } from "../fixtures/ui.auth.fixture";

test(
  "UI - User Profile Elements",
  { tag: ["@smoke", "@userProfile"] },
  async ({ homePage, userProfilePage }) => {
    // Open User Profile
    await homePage.goto();
    await homePage.openUserProfile();

    // Verify user Profile Elements are visible
    await userProfilePage.verifyPageElements();
  },
);
