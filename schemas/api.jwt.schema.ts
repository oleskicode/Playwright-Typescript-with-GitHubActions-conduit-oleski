import { z } from "zod";

export const JwtPayloadSchema = z.object({
  iat: z.number(),
  exp: z.number(),
  username: z.string(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
