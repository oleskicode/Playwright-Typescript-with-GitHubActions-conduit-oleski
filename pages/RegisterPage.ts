import { type Locator, type Page, expect } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define Locators
    this.usernameInput = page.getByPlaceholder("Username");
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.signUpButton = page.getByRole("button", { name: "Sign up" });
  }

  async fillRegistrationForm(
    username: string,
    email: string,
    password: string,
  ) {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitRegistration() {
    await expect(this.signUpButton).toBeEnabled();
    await this.signUpButton.click();
  }
}
