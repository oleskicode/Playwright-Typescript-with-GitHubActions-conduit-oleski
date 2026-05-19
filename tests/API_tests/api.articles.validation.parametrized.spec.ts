import { test, expect } from "../../fixtures/api.auth.fixture";
import { ArticleBuilder } from "../../helpers/articleBuilder";

let articleSlug: string | undefined;

test.afterEach(async ({ request, authToken }) => {
  if (!articleSlug) return;

  const response = await request.delete(
    `${process.env.API_BASE_URL}/articles/${articleSlug}`,
    {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );

  expect(response.ok()).toBeTruthy();
  articleSlug = undefined;
});

const testCases = [
  {
    testCase: "empty title",
    buildArticle: () => new ArticleBuilder().withTitle("").build(),
  },
  {
    testCase: "empty body",
    buildArticle: () => new ArticleBuilder().withBody("").build(),
  },
  {
    testCase: "empty body and title",
    buildArticle: () => new ArticleBuilder().withTitle("").withBody("").build(),
  },
];

for (const { testCase: testCase, buildArticle } of testCases) {
  test(`API - create article with ${testCase}`, async ({
    request,
    authToken,
  }) => {
    const authHeaders = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    const invalidArticle = buildArticle();

    const response = await request.post(
      `${process.env.API_BASE_URL}/articles`,
      {
        headers: authHeaders,
        data: invalidArticle,
      },
    );

    const responseBody = await response.json();
    articleSlug = responseBody.article.slug;

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
}
