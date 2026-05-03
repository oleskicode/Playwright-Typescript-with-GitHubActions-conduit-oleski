import { test as base, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

// type for the fixture
type MyFixtures = {
  authToken: string;
};

export const test = base.extend<MyFixtures>({
  authToken: async ({ request }, use) => {
    // --- SETUP (beforeEach logic) ---
    const loginURL = `${process.env.API_BASE_URL}/users/login`;
    const response = await request.post(loginURL, {
      data: {
        user: {
          email: process.env.USER_EMAIL,
          password: process.env.USER_PASSWORD,
        },
      },
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    const token = responseBody.user.token;
    expect(token).toBeDefined();

    // Pass the token to the test
    await use(token);
  },
});

export { expect };
