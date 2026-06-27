import { APIRequestContext, expect } from "@playwright/test";

// Helper function to fetch the authentication token.
export async function getAuthTokenFn(
  request: APIRequestContext,
): Promise<string> {
  const apiBaseURL = process.env.API_BASE_URL;

  if (!apiBaseURL) {
    throw new Error("API_BASE_URL is not defined in the .env variables.");
  }
  const loginURL = `${apiBaseURL}/users/login`;

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

  return token;
}
