// https://demo.learnwebdriverio.com/settings

import { type Locator, type Page, expect } from "@playwright/test";

export class SettingsPage {
  readonly page: Page;
  readonly yourSettingsHeading: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly userNameProfileLink: Locator;
  readonly settingsPageLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define Locators
    this.yourSettingsHeading = page.getByRole("heading", {
      name: "Your Settings",
    });
    this.signInLink = this.page
      .getByRole("listitem")
      .filter({ hasText: "Sign in" });
    this.signUpLink = this.page
      .getByRole("listitem")
      .filter({ hasText: "Sign up" });
    this.userNameProfileLink = this.page.getByRole("link", {
      name: process.env.USER_NAME,
    });
    this.settingsPageLink = this.page
      .getByRole("listitem")
      .filter({ hasText: "Settings" });
  }

  async goto() {
    await this.settingsPageLink.click();
  }

  async verifyUserIsSignedIn() {
    await expect(this.signInLink).not.toBeVisible();
    await expect(this.signUpLink).not.toBeVisible();
    await expect(this.userNameProfileLink).toBeVisible();
  }

  async verifyUserIsNotSignedIn() {
    await expect(this.signInLink).toBeEnabled();
    await expect(this.signUpLink).toBeEnabled();
    await expect(this.userNameProfileLink).not.toBeVisible();
  }
}
