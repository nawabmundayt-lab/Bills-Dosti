import { test, expect, type Page } from "@playwright/test";

/**
 * E2E — Auth flow (plan Phase 6: "auth flow" scenario).
 * Demo mode: any 4-digit OTP signs in as the seeded demo user.
 */

async function clearDemoData(page: Page) {
  await page.goto("/en");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test("welcome → login → OTP → home", async ({ page }) => {
  await clearDemoData(page);

  // Welcome: language + continue
  await expect(page.getByRole("heading", { name: "BillSplit Dost" })).toBeVisible();
  await page.getByRole("link", { name: /Continue/ }).click();

  // Login
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  const phone = page.getByPlaceholder("300 1234567");
  await phone.fill("3001234567");
  await page.getByRole("button", { name: "Send OTP" }).click();

  // OTP: type 4 digits (WebOTP autofill is simulated by typing)
  await expect(page.getByRole("heading", { name: "Verify" })).toBeVisible();
  for (let i = 0; i < 4; i++) {
    await page.locator('input[aria-label^="OTP digit"]').nth(i).fill("4");
  }
  await page.getByRole("button", { name: "Verify & Continue" }).click();

  // Home dashboard
  await expect(page.getByRole("heading", { name: /Assalam-o-Alaikum/ })).toBeVisible();
  await expect(page.getByText("Chai Gang")).toBeVisible();
});

test("login validation rejects a bad phone number", async ({ page }) => {
  await clearDemoData(page);
  await page.goto("/en/login");
  await page.getByPlaceholder("300 1234567").fill("123");
  await page.getByRole("button", { name: "Send OTP" }).click();
  await expect(page.getByText("Enter a 10-digit number")).toBeVisible();
});

test("country toggle switches to India +91", async ({ page }) => {
  await clearDemoData(page);
  await page.goto("/en/login");
  await page.getByRole("button", { name: "🇮🇳 India" }).click();
  await expect(page.locator("text=+91").first()).toBeVisible();
});
