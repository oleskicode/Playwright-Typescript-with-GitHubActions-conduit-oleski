import { test } from "../fixtures/ui.pages.fixture";
import { createUser } from "../helpers/userFactory";

test.describe("User Registration", () => {
  test("UI - Register new user successfully", async ({
    homePage,
    registerPage,
  }) => {
    const { username, email, password } = createUser();

    // Open Main Page
    await homePage.goto();
    await homePage.openSignUpPage();

    // Fill and submit the form
    await registerPage.fillRegistrationForm(username, email, password);
    await registerPage.submitRegistration();

    // Verify registration - user is logged in
    await homePage.verifyUserIsLoggedIn(username);

    console.log("username:", username);
    console.log("email:", email);
    console.log("password:", password);
  });
});
