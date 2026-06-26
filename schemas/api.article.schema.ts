import { z } from "zod";

export const AuthorSchema = z.object({
  username: z.string(),
  bio: z.string().nullable().optional(),
  image: z.string(),
  following: z.boolean(),
});

export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  tagList: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  favorited: z.boolean(),
  favoritesCount: z.number(),
  author: AuthorSchema,
});

export const ArticleResponseSchema = z.object({
  article: ArticleSchema,
});

export type Article = z.infer<typeof ArticleSchema>;
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
