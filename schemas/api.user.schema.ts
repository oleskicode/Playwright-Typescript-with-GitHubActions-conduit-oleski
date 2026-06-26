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

export const ErrorResponseSchema = z.object({
  errors: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
