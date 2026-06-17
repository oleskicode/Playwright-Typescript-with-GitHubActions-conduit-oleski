import { test, expect } from "../fixtures/ui.pages.fixture";

test("UI - API Response Mock - Verify no articles is shown correctly", async ({
  page,
  homePage,
}) => {
  await test.step("Mock empty API Response for articles", async () => {
    await page.route(`**/articles?*`, async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            articles: [],
            articlesCount: 0,
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  await test.step("Verify Empty Articles info text is shown", async () => {
    await homePage.goto();
    await homePage.verifyArticlesEmptyState();
  });
});
