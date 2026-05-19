import { test, expect } from "../../fixtures/api.auth.fixture";

test.describe(
  "API - Authentication",
  { tag: ["@api", "@authentication"] },
  () => {
    test("API - Get and validate JWT auth token", async ({ authToken }) => {
      // console.log("Using authToken:", authToken);

      // Verify token structure
      expect(authToken).toBeTruthy();
      expect(typeof authToken).toBe("string");
      const tokenParts = authToken.split(".");
      expect(tokenParts).toHaveLength(3); // JWT token has 3 parts separated by dots

      // Decode JWT payload
      const payload = JSON.parse(
        Buffer.from(tokenParts[1]!, "base64").toString("utf-8"), // in the second part of JWT there is username encoded
      );

      // Validate payload data
      expect(payload).toHaveProperty("iat");
      expect(payload).toHaveProperty("exp");
      expect(payload).toHaveProperty("username");
      expect(payload.username).toBe(process.env.USER_NAME?.toLowerCase());
    });
  },
);
