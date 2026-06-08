import { test, expect } from "@playwright/test";

test("Mock - Verify no articles is shown", async ({ page }) => {
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
  await page.goto("/");
  const emptyStateLocator = page.getByText("No articles are here... yet.");
  await expect(emptyStateLocator).toBeVisible();
});
