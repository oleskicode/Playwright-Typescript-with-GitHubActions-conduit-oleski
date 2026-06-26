import { test, expect } from "@playwright/test";
import {
  UserResponseSchema,
  ErrorResponseSchema,
} from "../../schemas/api.user.schema";

type LoginCase = {
  scenario: string;
  email: string;
  password: string;
  successExpected: boolean;
};

const loginCases: LoginCase[] = [
  {
    scenario: "API - Login - Invalid email and invalid password",
    email: "invalidemail",
    password: "wrongpassword",
    successExpected: false,
  },
  {
    scenario: "API - Login - Correct email and incorrect password",
    email: process.env.USER_EMAIL!,
    password: process.env.USER_PASSWORD! + "123",
    successExpected: false,
  },
  {
    scenario: "API - Login - Incorrect email and correct password",
    email: process.env.USER_EMAIL! + "abc",
    password: process.env.USER_PASSWORD!,
    successExpected: false,
  },
  {
    scenario: "API - Login - Correct email and correct password",
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

      const body = await response.json();

      if (loginCase.successExpected) {
        expect(response.status()).toBe(200);

        const { user } = UserResponseSchema.parse(body);
        expect(user.token).toBeDefined();
        expect(user.email).toBe(loginCase.email);
      } else {
        expect(response.status()).not.toBe(200);
        expect(response.ok()).toBe(false);

        const { errors } = ErrorResponseSchema.parse(body);
        expect(errors).toMatchObject({ "email or password": "is invalid" });
      }
    });
  }
});
