// POST https://conduit-api.learnwebdriverio.com/api/articles
// payload {"article":{"author":{},"title":"may2 article","description":"description of may2 article","body":"text for may2 article","tagList":[]}}
// response
// {
//     "article": {
//         "slug": "may2-article-b1kyzz",
//         "title": "may2 article",
//         "description": "description of may2 article",
//         "body": "text for may2 article",
//         "createdAt": "2026-05-02T05:22:24.018Z",
//         "updatedAt": "2026-05-02T05:22:24.018Z",
//         "tagList": [],
//         "favorited": false,
//         "favoritesCount": 0,
//         "author": {
//             "username": "usernameapr30",
//             "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
//             "following": false
//         }
//     }
// }

import { test, expect } from "../../fixtures/auth-fixture";

test.describe(" API - Articles", { tag: "@api" }, () => {
  test("API - Acticle CRUD operations", async ({ request, authToken }) => {
    console.log("Using authToken: ", authToken);

    console.log("API - Articles - Create: "); // TODO
    // https://conduit-api.learnwebdriverio.com/api/articles
  });
});
