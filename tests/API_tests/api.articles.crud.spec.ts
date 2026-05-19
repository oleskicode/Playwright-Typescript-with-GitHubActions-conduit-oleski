import { test } from "../../fixtures/api.auth.fixture";
import { ArticlesAPISteps } from "../../steps/articlesAPI.steps";

let articleSlug: string | undefined;

test.describe("API - Articles", { tag: "@api" }, () => {
  test.afterEach(async ({ request, authToken }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus && articleSlug) {
      const deleteResponse = await request.delete(
        `${process.env.API_BASE_URL}/articles/${articleSlug}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        },
      );

      if (!deleteResponse.ok()) {
        console.log("Cleanup failed:", await deleteResponse.text());
      } else {
        console.log(`Cleanup successful. Deleted article: ${articleSlug}`);
      }
    }

    articleSlug = undefined;
  });

  test("API - Article CRUD operations", async ({ request, authToken }) => {
    const articlesAPISteps = new ArticlesAPISteps(request, authToken);

    // --- CREATE ---
    articleSlug = await articlesAPISteps.createArticle();

    // -- READ --
    await articlesAPISteps.readArticle(articleSlug);

    // --- UPDATE ---
    await articlesAPISteps.updateArticle(articleSlug);

    // --- DELETE ---
    await articlesAPISteps.deleteArticle(articleSlug);

    // --- VERIFY ARTICLE DOES NOT EXIST ---
    await articlesAPISteps.verifyArticleDoesNotExist(articleSlug);

    articleSlug = undefined;
  });
});
