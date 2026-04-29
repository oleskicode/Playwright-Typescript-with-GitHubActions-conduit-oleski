import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

test("UI - Simple Login Test", async ({ page }) => {
  await page.goto(process.env.BASE_URL!); // Error: page.goto: url: expected string, got undefined
  await page.getByRole("link", { name: " Sign in" }).click();
  await page.getByRole("textbox", { name: "Email" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(process.env.USER_EMAIL!);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.USER_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("link", { name: process.env.USER_NAME }),
  ).toBeVisible();
  await page.getByRole("link", { name: process.env.USER_NAME }).click();
  await expect(
    page.getByRole("link", { name: " Edit Profile Settings" }),
  ).toBeVisible();
});

test.beforeEach(() => {
  console.log("HOOK-beforeEach");

  test.info().annotations.push({
    type: "Start Time:",
    description: new Date().toISOString(),
  });
});

test.afterEach(() => {
  console.log("HOOK-afterEach");

  test.info().annotations.push({
    type: "End Time:",
    description: new Date().toISOString(),
  });
});
