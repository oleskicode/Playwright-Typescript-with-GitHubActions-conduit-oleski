import { test, expect } from "../fixtures/ui.pages.fixture";

test("UI - API Response Mock - Empty tag list", async ({ page, homePage }) => {
  await page.route(`**/api/tags**`, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        contentType: "application/json",
        json: {
          tags: [], // Mocking the empty tags list here
        },
      });
    } else {
      await route.continue();
    }
  });

  // Open Home Page
  await homePage.goto();

  // Make sure the Popular Tags list is empty
  await homePage.verifyPopularTagsListIsEmpty();
});
