import { test } from "../fixtures/ui.auth.fixture";

test.describe("User Feed", () => {
  test("UI - Empty message is shown for a Feed without Subscriptions", async ({
    homePage,
    userFeedPage,
  }) => {
    await homePage.goto();
    await homePage.verifyUserIsLoggedIn(process.env.USER_NAME!);
    await homePage.openUserFeed();
    await userFeedPage.verifyUserFeedPageIsEmpty();
  });
});
