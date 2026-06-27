import { test as base } from "@playwright/test";
import { getAuthTokenFn } from "../helpers/api.getAuthToken";

type AuthTokenFixture = {
  authToken: string;
};

export const test = base.extend<AuthTokenFixture>({
  authToken: async ({ request }, use) => {
    const token = await getAuthTokenFn(request);
    await use(token);
  },
});

export { expect } from "@playwright/test";
