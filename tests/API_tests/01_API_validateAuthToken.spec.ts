import { test, expect } from "../../fixtures/auth-fixture";

test.describe("API - ", { tag: "@api" }, () => {
  test("API - Get and Validate Auth Token", async ({ authToken }) => {
    console.log("Using authToken: ", authToken);

    // Verify JWT token has 3 parts separated by dots
    expect(typeof authToken).toBe("string");
    expect(authToken.split(".").length).toEqual(3);
    const payload = JSON.parse(
      Buffer.from(authToken.split(".")[1]!, "base64").toString(), // in the second part of JWT there is username encoded
    );
    expect(payload.username).toBe(process.env.USER_NAME!.toLowerCase());
  });
});
