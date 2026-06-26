import { expect, APIRequestContext } from "@playwright/test";
import { test } from "../../fixtures/ui.pages.fixture";
import { createUser } from "../../helpers/userFactory";
import { ArticleBuilder } from "../../helpers/articleBuilder";
import { HomePage } from "../../pages/HomePage";

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
    await homePage.verifyArticlePreviewIsVisible(articleTitle);
    await homePage.verifyFavoriteCount(articleTitle, 0);

    await homePage.clickFavoriteButton(articleTitle);
    await homePage.verifyFavoriteCount(articleTitle, 1);

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
      const secondHomePage = new HomePage(secondPage);
      await secondHomePage.goto();
      await secondHomePage.verifyArticlePreviewIsVisible(articleTitle);
      await secondHomePage.verifyFavoriteCount(articleTitle, 1);

      await secondHomePage.clickFavoriteButton(articleTitle);
      await secondHomePage.verifyFavoriteCount(articleTitle, 2);
    } finally {
      await secondContext.close();
    }

    await page.reload();
    await homePage.verifyArticlePreviewIsVisible(articleTitle);
    await homePage.verifyFavoriteCount(articleTitle, 2);
  });
});
