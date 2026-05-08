import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";
import { test } from "@playwright/test";
import { createUser, User } from "../helpers/userFactory";

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
    const testUser = createUser();
    const username = testUser.username;
    const uniqueEmail = testUser.email;
    const password = testUser.password;

    await registerPage.fillRegistrationForm(username, uniqueEmail, password);
    await registerPage.submitRegistration();

    // Verify that the user is redirected to the home page and logged in
    await homePage.verifyUserIsLoggedIn(username);
  });
});
