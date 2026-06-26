import { test } from "../../fixtures/ui.pages.fixture";
import { createUser } from "../../helpers/userFactory";

test.use({ storageState: { cookies: [], origins: [] } }); // override storageState to have it clean for this test

test.describe("User Registration", () => {
  test("UI - Register new user successfully", async ({
    homePage,
    registerPage,
  }) => {
    const { username, email, password } = createUser();

    await test.step("Open Sign Up page", async () => {
      await homePage.goto();
      await homePage.openSignUpPage();
    });

    await test.step("Fill and submit the registration form", async () => {
      await registerPage.fillRegistrationForm(username, email, password);
      await registerPage.submitRegistration();
    });

    await test.step("Verify registration is successful. User is signed in", async () => {
      await homePage.verifyHomePageIsOpened();
      await homePage.verifyUserIsLoggedIn(username);

      // Log newly registered user:
      // console.log("username:", username);
      // console.log("email:", email);
      // console.log("password:", password);
    });
  });
});
