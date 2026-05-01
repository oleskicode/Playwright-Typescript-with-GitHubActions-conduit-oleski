import { test } from "../fixtures/baseTest";
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
