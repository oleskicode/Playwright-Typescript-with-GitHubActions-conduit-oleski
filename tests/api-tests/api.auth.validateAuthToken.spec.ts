import { test, expect } from "../../fixtures/api.authToken.fixture";
import { JwtPayloadSchema } from "../../schemas/api.jwt.schema";

test.describe(
  "API - Authentication",
  { tag: ["@api", "@authentication"] },
  () => {
    test("API - Get and validate JWT auth token", async ({ authToken }) => {
      // Verify token structure
      expect(authToken).toBeTruthy();
      expect(typeof authToken).toBe("string");
      const tokenParts = authToken.split(".");
      expect(tokenParts).toHaveLength(3); // JWT token has 3 parts separated by dots

      // Decode JWT payload
      const decoded = JSON.parse(
        Buffer.from(tokenParts[1]!, "base64").toString("utf-8"), // in the second part of JWT there is username encoded
      );

      // Validate payload structure and types
      const payload = JwtPayloadSchema.parse(decoded);

      // Validate payload data
      expect(payload.username).toBe(process.env.USER_NAME?.toLowerCase());
    });
  },
);
