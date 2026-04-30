import { type Locator, type Page, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly userProfileNameLink: Locator;
  readonly newArticleLink: Locator;
  readonly settings: Locator;

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
  }

  async verifyUserIsLoggedIn(userName: string) {
    await expect(this.newArticleLink).toBeEnabled();
    await expect(this.settings).toBeEnabled();
    await expect(this.userProfileNameLink).toBeEnabled();
  }

  async openUserProfile() {
    await expect(this.userProfileNameLink).toBeEnabled();
    await this.userProfileNameLink.click();
  }
}
