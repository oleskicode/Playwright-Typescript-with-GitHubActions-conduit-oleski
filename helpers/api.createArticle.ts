import { APIRequestContext, expect } from "@playwright/test";
import { ArticleBuilder } from "./articleBuilder";
import { ArticleResponseSchema } from "../schemas/api.article.schema";

const apiBase = process.env.API_BASE_URL;

if (!apiBase) {
  throw new Error("API_BASE_URL must be set in environment to run API tests");
}

export async function createArticle(
  request: APIRequestContext,
  token: string,
  title: string,
) {
  const payload = new ArticleBuilder().withTitle(title).build();
  const res = await request.post(`${apiBase}/articles`, {
    headers: { Authorization: `Token ${token}` },
    data: payload,
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  const { article } = ArticleResponseSchema.parse(body);
  return article;
}
