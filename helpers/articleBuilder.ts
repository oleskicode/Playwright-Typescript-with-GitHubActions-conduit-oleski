import { faker } from "@faker-js/faker";

export interface ArticlePayload {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

export class ArticleBuilder {
  // Initialize
  private payload: ArticlePayload = {
    article: {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(2),
      body: faker.lorem.paragraphs(3),
      tagList: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
    },
  };

  // Chaining methods
  withTitle(title: string): this {
    this.payload.article.title = title;
    return this;
  }

  withDescription(description: string): this {
    this.payload.article.description = description;
    return this;
  }

  withBody(body: string): this {
    this.payload.article.body = body;
    return this;
  }

  withTags(tags: string[]): this {
    this.payload.article.tagList = tags;
    return this;
  }

  // Build
  build(): ArticlePayload {
    return this.payload;
  }
}
