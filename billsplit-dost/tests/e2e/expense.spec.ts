import { test, expect, type Page } from "@playwright/test";

/** Shared helper: sign in as demo user with fresh localStorage. */
async function login(page: Page) {
  await page.goto("/en");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/en/login");
  await page.getByPlaceholder("300 1234567").fill("3001234567");
  await page.getByRole("button", { name: "Send OTP" }).click();
  for (let i = 0; i < 4; i++) {
    await page.locator('input[aria-label^="OTP digit"]').nth(i).fill("4");
  }
  await page.getByRole("button", { name: "Verify & Continue" }).click();
  await expect(page.getByRole("heading", { name: /Assalam-o-Alaikum/ })).toBeVisible();
}

test("add an expense and see it in the group", async ({ page }) => {
  await login(page);

  // From the group detail, add an expense
  await page.getByText("Chai Gang").first().click();
  await expect(page.getByRole("heading", { name: "🍵 Chai Gang" })).toBeVisible();
  await page.locator('a[aria-label="Add expense"]').click();

  // Fill the form
  await page.getByPlaceholder("Dinner — Baba Jee").fill("E2E Biryani");
  const amountInput = page.locator('input[inputmode="decimal"]');
  await amountInput.fill("400");

  // Default: equal split, all members — save
  await page.getByRole("button", { name: /Save expense/ }).click();

  // Back on group page, the new expense is listed
  await expect(page.getByText("E2E Biryani")).toBeVisible();
  await expect(page.getByText("Rs 400")).toBeVisible();
});

test("live split preview updates when members are toggled", async ({ page }) => {
  await login(page);
  await page.goto("/en/expense/new");

  await page.locator('input[inputmode="decimal"]').fill("600");
  await expect(page.getByText("600 × 3")).toBeVisible(); // equal split among 3 active

  // Toggle a member off → each pays more
  await page.getByRole("button", { name: "Bilal" }).click();
  await expect(page.getByText("300 × 2")).toBeVisible();
});
