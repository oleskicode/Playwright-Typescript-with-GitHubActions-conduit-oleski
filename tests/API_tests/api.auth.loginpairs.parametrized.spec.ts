import { test, expect } from "@playwright/test";

type LoginCase = {
  scenario: string;
  email: string;
  password: string;
  successExpected: boolean;
};

const loginCases: LoginCase[] = [
  {
    scenario: "Invalid email and invalid password",
    email: "invalidemail",
    password: "wrongpassword",
    successExpected: false,
  },
  {
    scenario: "Correct email and incorrect password",
    email: process.env.USER_EMAIL!,
    password: process.env.USER_PASSWORD! + "123",
    successExpected: false,
  },
  {
    scenario: "Incorrect email and correct password",
    email: process.env.USER_EMAIL! + "abc",
    password: process.env.USER_PASSWORD!,
    successExpected: false,
  },
  {
    scenario: "Correct email and correct password",
    email: process.env.USER_EMAIL!,
    password: process.env.USER_PASSWORD!,
    successExpected: true,
  },
];

test.describe("API Login", () => {
  for (const loginCase of loginCases) {
    test(`${loginCase.scenario}`, async ({ request }) => {
      const loginURL = `${process.env.API_BASE_URL}/users/login`;

      const response = await request.post(loginURL, {
        data: {
          user: {
            email: loginCase.email,
            password: loginCase.password,
          },
        },
      });

      if (loginCase.successExpected) {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.user.token).toBeDefined();
      } else {
        expect(response.status()).not.toBe(200);
        expect(response.ok()).toBe(false);
      }
    });
  }
});
