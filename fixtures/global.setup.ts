import { request } from "@playwright/test";

async function globalSetup() {
  const email = process.env.USER_EMAIL;
  const username = process.env.USER_NAME;
  const password = process.env.USER_PASSWORD;
  const api_base_url = process.env.API_BASE_URL;

  if (!email || !username || !password || !api_base_url) {
    throw new Error("Missing ENV variables! Check project .env file");
  }

  // Create an isolated API context
  const apiContext = await request.newContext({
    baseURL: api_base_url,
  } as any);

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
    // 200 if just registered, 422 if already present in the user base
    console.log(
      "[Global Setup] Success: User is/already registered successfully (for today).",
    );
  } else {
    // Fail the entire test suite run if the prerequisite fails unexpectedly
    throw new Error(
      `[Global Setup] Failed to register user. Status: ${response.status()}`,
    );
  }

  await apiContext.dispose();
}

export default globalSetup;
