import { test, expect } from "@playwright/test";

test("UI - API Response Mock - Empty tag list", async ({ page }) => {
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

  await page.goto("/");

  const tagList = page.locator(".tag-list");

  // We're making sure the tag list is empty
  await expect(tagList.locator("a")).toHaveCount(0);
});
