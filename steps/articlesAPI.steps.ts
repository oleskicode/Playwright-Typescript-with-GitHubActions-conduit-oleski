import { expect, type APIRequestContext } from "@playwright/test";
import { ArticleResponseSchema } from "../schemas/api.article.schema";

type ArticleData = {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
};

export class ArticlesAPISteps {
  readonly articlesUrl = `${process.env.API_BASE_URL}/articles`;
  readonly timestamp = Date.now();

  readonly authHeaders: Record<string, string>;
  readonly apiContext: APIRequestContext;

  readonly articleDataOriginal: ArticleData;
  readonly articleDataUpdated: ArticleData;

  constructor(apiContext: APIRequestContext, authToken: string) {
    this.apiContext = apiContext;

    this.authHeaders = {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    };

    this.articleDataOriginal = {
      title: `Article Name ${this.timestamp}`,
      description: `Description for ${this.timestamp}`,
      body: `Body Text for ${this.timestamp}`,
      tagList: [],
    };

    this.articleDataUpdated = {
      title: `UPD Article Name ${this.timestamp}`,
      description: `UPD Description for ${this.timestamp}`,
      body: `UPD Body Text for ${this.timestamp}`,
    };
  }

  async createArticle(): Promise<string> {
    const response = await this.apiContext.post(this.articlesUrl, {
      headers: this.authHeaders,
      data: {
        article: this.articleDataOriginal,
      },
    });

    await expect(response).toBeOK();
    const body = await response.json();
    const { article } = ArticleResponseSchema.parse(body);

    return article.slug;
  }

  async readArticle(articleSlug: string) {
    const response = await this.apiContext.get(
      `${this.articlesUrl}/${articleSlug}`,
    );

    await expect(response).toBeOK();

    const body = await response.json();
    const { article } = ArticleResponseSchema.parse(body);

    expect(article.title).toBe(this.articleDataOriginal.title);
    expect(article.description).toBe(this.articleDataOriginal.description);
    expect(article.body).toBe(this.articleDataOriginal.body);
  }

  async updateArticle(articleSlug: string) {
    const response = await this.apiContext.put(
      `${this.articlesUrl}/${articleSlug}`,
      {
        headers: this.authHeaders,
        data: {
          article: this.articleDataUpdated,
        },
      },
    );

    await expect(response).toBeOK();

    const body = await response.json();
    const { article } = ArticleResponseSchema.parse(body);

    expect(article.slug).toBe(articleSlug);
    expect(article.title).toBe(this.articleDataUpdated.title);
    expect(article.description).toBe(this.articleDataUpdated.description);
    expect(article.body).toBe(this.articleDataUpdated.body);
  }

  async deleteArticle(articleSlug: string) {
    const response = await this.apiContext.delete(
      `${this.articlesUrl}/${articleSlug}`,
      {
        headers: this.authHeaders,
      },
    );

    await expect(response).toBeOK();
    expect(response.status()).toBe(204);
  }

  async verifyArticleDoesNotExist(articleSlug: string) {
    const response = await this.apiContext.get(
      `${this.articlesUrl}/${articleSlug}`,
    );

    await expect(response).not.toBeOK();
    expect(response.status()).toBe(404);
  }
}
