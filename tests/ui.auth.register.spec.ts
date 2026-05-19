import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";
import { test } from "@playwright/test";
import { createUser } from "../helpers/userFactory";

test.describe("User Registration", () => {
  let homePage: HomePage;
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registerPage = new RegisterPage(page);
    await homePage.goto();
    await homePage.openSignUpPage();
  });

  test("should register a new user successfully", async () => {
    const { username, email, password } = createUser();

    await registerPage.fillRegistrationForm(username, email, password);
    await registerPage.submitRegistration();

    // Verify registration - user is logged in
    await homePage.verifyUserIsLoggedIn(username);
  });
});
