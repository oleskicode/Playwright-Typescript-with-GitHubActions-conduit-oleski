import { test as base } from "./ui.pages.fixture";
import { getAuthTokenFn } from "../helpers/api.getAuthToken";

export const test = base.extend({
  page: async ({ page, request }, use, testInfo) => {
    // Fetch Auth Token
    const authToken = await getAuthTokenFn(request);
    // Inject Auth Token into localStorage
    await page.addInitScript((token) => {
      globalThis.localStorage.setItem("id_token", token);
    }, authToken);

    // Pass authenticated page context into the test
    await use(page);

    //
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach("screenshot-on-failure", {
        body: screenshot,
        contentType: "image/png",
      });
    }
  },
});
