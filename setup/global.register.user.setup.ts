import { chromium, request } from "@playwright/test";
import path from "node:path";
import { getAuthTokenFn } from "../helpers/api.getAuthToken";

async function globalSetup() {
  const email = process.env.USER_EMAIL;
  const username = process.env.USER_NAME;
  const password = process.env.USER_PASSWORD;
  const apiBaseUrl = process.env.API_BASE_URL;
  const baseUrl = process.env.BASE_URL;
  const storageStatePath = path.resolve(process.cwd(), ".auth/user.json");

  if (!email || !username || !password || !apiBaseUrl || !baseUrl) {
    throw new Error("Missing ENV variables! Check project .env file");
  }

  const apiContext = await request.newContext({
    baseURL: apiBaseUrl,
  } as any);

  try {
    const response = await apiContext.post(`/api/users`, {
      data: {
        user: {
          username: username,
          email: email,
          password: password,
        },
      },
    });

    if (response.status() === 200 || response.status() === 422) {
      console.log(
        "[Global Setup] Success: User is/already registered successfully (for today).",
      );
    } else {
      throw new Error(
        `[Global Setup] Failed to register user. Status: ${response.status()}`,
      );
    }
  } finally {
    await apiContext.dispose();
  }

  const authContext = await request.newContext({
    baseURL: apiBaseUrl,
  } as any);

  try {
    const authToken = await getAuthTokenFn(authContext);
    if (!authToken) {
      throw new Error("[Global Setup] Failed to retrieve auth token.");
    }
    const browser = await chromium.launch();

    try {
      const context = await browser.newContext({ baseURL: baseUrl });
      const page = await context.newPage();

      await page.addInitScript((token: string) => {
        globalThis.localStorage.setItem("id_token", token);
      }, authToken);

      await page.goto("/"); // so that localStorage is attached to the right origin
      await context.storageState({ path: storageStatePath });
      console.log(
        `[Global Setup] Saved authentication state to ${storageStatePath}`,
      );
    } finally {
      await browser.close();
    }
  } finally {
    await authContext.dispose();
  }
}

export default globalSetup;
