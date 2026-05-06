import { test, expect } from "../../fixtures/auth-fixture";

let articleSlug: string | undefined;

test.describe("API - Articles", { tag: "@api" }, () => {
  test.afterEach(async ({ request, authToken }, testInfo) => {
    // Run cleanup if test failed
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

    // reset articleSlug value
    articleSlug = undefined;
  });

  test("API - Article CRUD operations", async ({ request, authToken }) => {
    const articlesUrl = `${process.env.API_BASE_URL}/articles`;

    const authHeaders = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };
    // console.log("Using authToken: ", authToken);

    const timestamp = Date.now();

    const articleDataOriginal = {
      title: `Article Name ${timestamp}`,
      description: `Description for ${timestamp}`,
      body: `Body Text for ${timestamp}`,
      tagList: [],
    };

    const articleDataUpdated = {
      title: `UPD Article Name ${timestamp}`,
      description: `UPD Description for ${timestamp}`,
      body: `UPD Body Text for ${timestamp}`,
    };

    // --- CREATE ---
    const requestURLCreateArticle = `${articlesUrl}`;
    const createResponse = await request.post(requestURLCreateArticle, {
      headers: authHeaders,
      data: {
        article: articleDataOriginal,
      },
    });

    expect(createResponse).toBeOK();
    const createResponseBody = await createResponse.json();
    articleSlug = createResponseBody.article.slug;
    // console.log("Created Article Slug: ", articleSlug);

    // -- READ --
    const readResponse = await request.get(
      `${requestURLCreateArticle}/${articleSlug}`,
    );
    expect(readResponse).toBeOK();
    const responseReadBody = await readResponse.json();
    expect(responseReadBody.article.title).toEqual(articleDataOriginal.title);
    expect(responseReadBody.article.description).toEqual(
      articleDataOriginal.description,
    );
    expect(responseReadBody.article.body).toEqual(articleDataOriginal.body);

    // --- UPDATE ---
    const updateResponse = await request.put(
      `${requestURLCreateArticle}/${articleSlug}`,
      {
        headers: authHeaders,
        data: {
          article: articleDataUpdated,
        },
      },
    );
    if (!updateResponse.ok()) {
      console.log(await updateResponse.json());
    }

    expect(updateResponse).toBeOK();
    const updateResponseBody = await updateResponse.json();
    expect(updateResponseBody.article.title).toEqual(articleDataUpdated.title);
    expect(updateResponseBody.article.description).toEqual(
      articleDataUpdated.description,
    );
    expect(updateResponseBody.article.body).toEqual(articleDataUpdated.body);
    expect(updateResponseBody.article.slug).toEqual(articleSlug);

    // --- DELETE ---
    const deleteResponse = await request.delete(
      `${articlesUrl}/${articleSlug}`,
      {
        headers: authHeaders,
      },
    );
    if (!deleteResponse.ok()) {
      console.log(await deleteResponse.json());
    }
    expect(deleteResponse).toBeOK();
    expect(deleteResponse.status()).toBe(204);

    // --- VERIFY DELETION ---
    const verifyDeleteResponse = await request.get(
      `${articlesUrl}/${articleSlug}`,
    );
    expect(verifyDeleteResponse.status()).toBe(404);
    articleSlug = undefined;
  });
});
