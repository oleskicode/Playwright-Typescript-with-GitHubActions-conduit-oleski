import { test, expect } from "@playwright/test";
import { createUser } from "../../helpers/userFactory";
import { registerUser } from "../../helpers/api.createUser";
import { ArticleBuilder } from "../../helpers/articleBuilder";
import { ArticleResponseSchema } from "../../schemas/api.article.schema";

const apiBase = process.env.API_BASE_URL;

if (!apiBase) {
  throw new Error("API_BASE_URL must be set in environment to run API tests");
}

test.describe("API - Articles Favorites Counter", { tag: "@api" }, () => {
  let articleSlug: string | undefined;
  let authorToken: string | undefined;

  test.afterEach(async ({ request }, testInfo) => {
    if (articleSlug) {
      // cleanup using the article author's token
      await request.delete(`${apiBase}/articles/${articleSlug}`, {
        headers: authorToken ? { Authorization: `Token ${authorToken}` } : {},
      });
    }
    articleSlug = undefined;
    authorToken = undefined;
  });

  test("API - Articles Favorites Counter - receives 2 favorites from two accounts", async ({
    request,
  }) => {
    // Create three accounts: author, liker1, liker2
    const author = createUser();
    const liker1 = createUser();
    const liker2 = createUser();

    const registeredAuthor = await registerUser(request, author);
    authorToken = registeredAuthor.token;
    const registeredLiker1 = await registerUser(request, liker1);
    const registeredLiker2 = await registerUser(request, liker2);

    // Create article as author
    const articlePayload = new ArticleBuilder()
      .withTitle("Article for favorites test")
      .build();

    const createRes = await request.post(`${apiBase}/articles`, {
      headers: { Authorization: `Token ${registeredAuthor.token}` },
      data: articlePayload,
    });
    expect(createRes.ok()).toBeTruthy();
    const createdBody = await createRes.json();
    const { article: created } = ArticleResponseSchema.parse(createdBody);
    articleSlug = created.slug;

    // Verify initial favorites count is 0
    expect(created.favoritesCount).toBe(0);

    // liker1 favorites the article
    const fav1 = await request.post(
      `${apiBase}/articles/${articleSlug}/favorite`,
      {
        headers: { Authorization: `Token ${registeredLiker1.token}` },
      },
    );
    expect(fav1.ok()).toBeTruthy();
    const fav1Body = await fav1.json();
    const { article: fav1Article } = ArticleResponseSchema.parse(fav1Body);
    expect(fav1Article.favoritesCount).toBe(1);

    // liker2 favorites the article
    const fav2 = await request.post(
      `${apiBase}/articles/${articleSlug}/favorite`,
      {
        headers: { Authorization: `Token ${registeredLiker2.token}` },
      },
    );
    expect(fav2.ok()).toBeTruthy();
    const fav2Body = await fav2.json();
    const { article: fav2Article } = ArticleResponseSchema.parse(fav2Body);
    expect(fav2Article.favoritesCount).toBe(2);

    // final GET to ensure persisted
    const getRes = await request.get(`${apiBase}/articles/${articleSlug}`);
    expect(getRes.ok()).toBeTruthy();
    const getBody = await getRes.json();
    const { article: getArticle } = ArticleResponseSchema.parse(getBody);
    expect(getArticle.favoritesCount).toBe(2);
  });
});
