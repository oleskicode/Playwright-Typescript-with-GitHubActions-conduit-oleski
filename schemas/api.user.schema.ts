import { z } from "zod";

export const UserSchema = z.object({
  username: z.string(),
  email: z.string(),
  bio: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  token: z.string(),
});

export const UserResponseSchema = z.object({
  user: UserSchema,
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
