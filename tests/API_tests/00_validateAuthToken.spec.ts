import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

test.describe("API - ", { tag: "@smoke" }, () => {
  test("API - Get and Validate Auth Token - should fetch auth token from login endpoint", async ({
    request,
  }) => {
    const requestURL = process.env.API_BASE_URL + "/users/login";

    const response = await request.post(requestURL, {
      data: {
        user: {
          email: process.env.USER_EMAIL,
          password: process.env.USER_PASSWORD,
        },
      },
    });
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    // console.log("responceBody: ", responseBody);

    const authToken = responseBody.user.token;
    console.log("authToken: ", authToken);

    expect(authToken).toBeDefined();
    expect(typeof authToken).toBe("string");
    expect(authToken.length).toBeGreaterThan(0);
    expect(authToken.split(".")).toHaveLength(3);
  });
});
