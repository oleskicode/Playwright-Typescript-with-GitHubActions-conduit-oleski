import { type Locator, type Page, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly userProfileNameLink: Locator;
  readonly newArticleLink: Locator;
  readonly settings: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define Locators
    this.newArticleLink = page
      .getByRole("listitem")
      .filter({ hasText: "New Article" });
    this.settings = page.getByRole("listitem").filter({ hasText: "Settings" });
    this.userProfileNameLink = page.getByRole("link", {
      name: process.env.USER_NAME,
    });
    this.signUpLink = page.getByRole("link", { name: "Sign up" });
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL!);
  }

  async verifyUserIsLoggedIn(userName: string) {
    await expect(this.newArticleLink).toBeEnabled();
    await expect(this.settings).toBeEnabled();
    await expect(this.page.getByRole("link", { name: userName })).toBeEnabled();
  }

  async openUserProfile() {
    await expect(this.userProfileNameLink).toBeEnabled();
    await this.userProfileNameLink.click();
  }

  async openSignUpPage() {
    await expect(this.signUpLink).toBeEnabled();
    await this.signUpLink.click();
  }
}
