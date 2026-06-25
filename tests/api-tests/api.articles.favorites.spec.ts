import { test, expect, APIRequestContext } from "@playwright/test";
import { createUser } from "../../helpers/userFactory";
import { ArticleBuilder } from "../../helpers/articleBuilder";

const apiBase = process.env.API_BASE_URL;

if (!apiBase) {
  throw new Error("API_BASE_URL must be set in environment to run API tests");
}

async function registerUser(request: APIRequestContext, user: any) {
  const res = await request.post(`${apiBase}/users`, { data: { user } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  return body.user; // contains username, email, token
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
    const created = await createRes.json();
    articleSlug = created.article.slug;

    // Verify initial favorites count is 0
    expect(created.article.favoritesCount).toBe(0);

    // liker1 favorites the article
    const fav1 = await request.post(
      `${apiBase}/articles/${articleSlug}/favorite`,
      {
        headers: { Authorization: `Token ${registeredLiker1.token}` },
      },
    );
    expect(fav1.ok()).toBeTruthy();
    const fav1Body = await fav1.json();
    expect(fav1Body.article.favoritesCount).toBe(1);

    // liker2 favorites the article
    const fav2 = await request.post(
      `${apiBase}/articles/${articleSlug}/favorite`,
      {
        headers: { Authorization: `Token ${registeredLiker2.token}` },
      },
    );
    expect(fav2.ok()).toBeTruthy();
    const fav2Body = await fav2.json();
    expect(fav2Body.article.favoritesCount).toBe(2);

    // final GET to ensure persisted
    const getRes = await request.get(`${apiBase}/articles/${articleSlug}`);
    expect(getRes.ok()).toBeTruthy();
    const getBody = await getRes.json();
    expect(getBody.article.favoritesCount).toBe(2);
  });
});
