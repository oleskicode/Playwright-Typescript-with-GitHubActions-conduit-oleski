import { type Locator, type Page, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly newArticleLink: Locator;
  readonly settings: Locator;
  readonly signUpLink: Locator;
  readonly yourFeedLink: Locator;
  readonly popularTagsList: Locator;
  readonly noArticlesAreHereText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define Locators
    this.newArticleLink = page.getByRole("link", { name: "New Article" });
    this.settings = page.getByRole("link", { name: "Settings" });
    this.signUpLink = page.getByRole("link", { name: "Sign up" });
    this.yourFeedLink = page.getByRole("link", { name: "Your Feed" });
    this.popularTagsList = page.locator(".tag-list");
    this.noArticlesAreHereText = page.getByText("No articles are here... yet.");
  }

  async verifyHomePageIsOpened() {
    await expect(this.page).toHaveURL(process.env.BASE_URL!);
  }

  async goto() {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl)
      throw new Error("BASE_URL is not defined in environment variables");
    await this.page.goto(baseUrl);
    await this.verifyHomePageIsOpened();
  }

  getProfileLink(userName: string) {
    // dynamic locator
    return this.page.locator("li.nav-item").getByRole("link", {
      name: userName,
    });
  }

  async verifyUserIsLoggedIn(userName: string = process.env.USER_NAME!) {
    await expect(this.newArticleLink).toBeVisible();
    await expect(this.settings).toBeVisible();
    await expect(this.getProfileLink(userName)).toBeVisible();
  }

  async openUserProfile(userName: string = process.env.USER_NAME!) {
    const profileLink = this.getProfileLink(userName);
    await expect(profileLink).toBeVisible();
    await profileLink.click();
  }

  async openSignUpPage() {
    await expect(this.signUpLink).toBeVisible();
    await this.signUpLink.click();
  }

  async openUserFeed() {
    // there is a hydration issue here so we add additional checks and use Promise.all
    await expect(this.yourFeedLink).toBeVisible();
    await expect(this.yourFeedLink).toBeEnabled();

    await Promise.all([
      this.page.waitForURL("**/my-feed"),
      this.yourFeedLink.click(),
    ]);
  }

  async verifyPopularTagsListIsEmpty() {
    await expect(this.popularTagsList.locator("a")).toHaveCount(0);
    await expect(this.popularTagsList.getByRole("link")).toHaveCount(0);
  }

  async verifyArticlesEmptyState() {
    await expect(this.noArticlesAreHereText).toBeVisible();
  }
}
