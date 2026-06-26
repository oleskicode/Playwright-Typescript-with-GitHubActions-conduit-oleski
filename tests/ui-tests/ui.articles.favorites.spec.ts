import { expect, APIRequestContext } from "@playwright/test";
import { test } from "../../fixtures/ui.pages.fixture";
import { createUser } from "../../helpers/userFactory";
import { ArticleBuilder } from "../../helpers/articleBuilder";

const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("API_BASE_URL must be set in environment to run UI tests");
}

async function registerUser(request: APIRequestContext, user: any) {
  const res = await request.post(`${apiBaseUrl}/users`, { data: { user } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  return body.user;
}

async function createArticle(
  request: APIRequestContext,
  token: string,
  title: string,
) {
  const payload = new ArticleBuilder().withTitle(title).build();
  const res = await request.post(`${apiBaseUrl}/articles`, {
    headers: { Authorization: `Token ${token}` },
    data: payload,
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  return body.article;
}

test.describe("UI - Articles Favorites", () => {
  let articleSlug: string | undefined;
  let authorTokenForArticleCleanup: string | undefined;

  test.afterEach(async ({ request }) => {
    if (articleSlug && authorTokenForArticleCleanup) {
      await request.delete(`${apiBaseUrl}/articles/${articleSlug}`, {
        headers: { Authorization: `Token ${authorTokenForArticleCleanup}` },
      });
    }
    articleSlug = undefined;
    authorTokenForArticleCleanup = undefined;
  });

  test("UI - Favorite counter updates to 2 after two users like an article", async ({
    page,
    request,
    homePage,
  }) => {
    const author = createUser();
    const liker2 = createUser();

    const registeredAuthor = await registerUser(request, author);
    const authorToken = registeredAuthor.token;
    authorTokenForArticleCleanup = authorToken; // this is for afterEach clean up
    const registeredLiker2 = await registerUser(request, liker2);

    const articleTitle = `Article for favorites test ${Date.now()}`;
    const article = await createArticle(request, authorToken, articleTitle);
    articleSlug = article.slug;

    await homePage.goto();
    const articlePreview = page.locator(".article-preview", {
      has: page.locator("h1[data-qa-type='preview-title']", {
        hasText: articleTitle,
      }),
    });
    const favoriteButton = articlePreview.getByRole("button");

    await expect(articlePreview).toBeVisible();
    await expect(favoriteButton).toHaveText("0");

    await favoriteButton.click();
    await expect(favoriteButton).toHaveText("1");

    const browser = page.context().browser();
    if (!browser) {
      throw new Error(
        "Unable to access browser instance for second user context",
      );
    }

    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    await secondPage.addInitScript((token: string) => {
      globalThis.localStorage.setItem("id_token", token);
    }, registeredLiker2.token);

    try {
      await secondPage.goto(process.env.BASE_URL!);
      const secondPreview = secondPage.locator(".article-preview", {
        has: secondPage.locator("h1[data-qa-type='preview-title']", {
          hasText: articleTitle,
        }),
      });
      const secondFavoriteButton = secondPreview.getByRole("button");

      await expect(secondPreview).toBeVisible();
      await expect(secondFavoriteButton).toHaveText("1");

      await secondFavoriteButton.click();
      await expect(secondFavoriteButton).toHaveText("2");
    } finally {
      await secondContext.close();
    }

    await page.reload();
    const refreshedPreview = page.locator(".article-preview", {
      has: page.locator("h1[data-qa-type='preview-title']", {
        hasText: articleTitle,
      }),
    });
    const refreshedButton = refreshedPreview.getByRole("button");

    await expect(refreshedPreview).toBeVisible();
    await expect(refreshedButton).toHaveText("2");
  });
});
