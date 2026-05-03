import { test, expect } from "../../fixtures/auth-fixture";

test.describe(" API - Articles", { tag: "@api" }, () => {
  test("API - Acticle CRUD operations", async ({ request, authToken }) => {
    console.log("Using authToken: ", authToken);

    const articleTitle = "Article Name + " + Date.now();
    const articleDescription = "Description for " + articleTitle;
    const articleBody = "Body Text for " + articleTitle;

    // --- CREATE ---
    const requestURLCreateArticle = process.env.API_BASE_URL + "/articles";
    const responseCreate = await request.post(requestURLCreateArticle, {
      // 1. Add the headers object
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
      // 2. Pass data
      data: {
        article: {
          author: {},
          title: articleTitle,
          description: articleDescription,
          body: articleBody,
          tagList: [],
        },
      },
    });

    expect(responseCreate.ok()).toBeTruthy();
    expect(responseCreate.status()).toBe(200);
    const responseBody = await responseCreate.json();
    const createdArticleSlug = responseBody.article.slug;
    console.log("Created Article Slug:", createdArticleSlug);

    // -- READ --
    const responseRead = await request.get(
      requestURLCreateArticle + "/" + createdArticleSlug,
      {
        data: {
          article: {
            slug: createdArticleSlug,
          },
        },
      },
    );

    expect(responseRead.ok()).toBeTruthy();
    expect(responseCreate.status()).toBe(200);
    const responseReadBody = await responseRead.json();
    console.log(responseReadBody);
    expect(responseReadBody.article.title).toEqual(articleTitle);
    expect(responseReadBody.article.description).toEqual(articleDescription);
    expect(responseReadBody.article.body).toEqual(articleBody);

    // --- UPDATE ---
    const requestURLUpdateArticle = `${requestURLCreateArticle}/${createdArticleSlug}`;
    console.log("requestURLUpdateArticle: " + requestURLUpdateArticle);
    const responseUpdate = await request.put(requestURLUpdateArticle, {
      // 1. Add the headers object
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
      // 2. Pass data
      data: {
        article: {
          slug: createdArticleSlug,
          title: "UPD " + articleTitle,
          description: "UPD " + articleDescription,
          body: "UPD " + articleBody,
        },
      },
    });
    if (!responseUpdate.ok()) {
      console.log(await responseUpdate.json());
    }

    expect(responseUpdate.ok()).toBeTruthy();
    expect(responseUpdate.status()).toBe(200);
    const responceUpdateBody = await responseUpdate.json();
    expect(responceUpdateBody.article.title).toEqual("UPD " + articleTitle);
    expect(responceUpdateBody.article.description).toEqual(
      "UPD " + articleDescription,
    );
    expect(responceUpdateBody.article.body).toEqual("UPD " + articleBody);
    expect(responceUpdateBody.article.slug).toEqual(createdArticleSlug);

    // --- DELETE ---
    const requestURLDeleteArticle = `${process.env.API_BASE_URL}/articles/${createdArticleSlug}`;
    console.log("requestURLDeleteArticle: " + requestURLDeleteArticle);

    const requestDelete = await request.delete(requestURLDeleteArticle, {
      // Add the headers object
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!requestDelete.ok()) {
      console.log(await requestDelete.json());
    }
  });
});
