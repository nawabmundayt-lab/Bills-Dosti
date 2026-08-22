import { test, expect, type Page } from "@playwright/test";

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

test("settle list shows debts and payments to confirm", async ({ page }) => {
  await login(page);
  await page.goto("/en/settle/list");

  // Seeded: Ali owes someone (net after confirmed settlements) + Sara's pending payment
  await expect(page.getByText("Pay imran").first()).toBeVisible();
  await expect(page.getByText("Payments to confirm (1)")).toBeVisible();
});

test("payer records a settlement via deep-link flow", async ({ page }) => {
  await login(page);
  await page.goto("/en/settle/list");

  await page.getByRole("link", { name: "Pay" }).first().click();
  await expect(page.getByRole("heading", { name: /Settle with imran/ })).toBeVisible();

  // Choose payment app, deep link is constructed client-side
  await page.getByRole("button", { name: /JazzCash/ }).click();

  // "I've paid" records a pending settlement
  await page.getByRole("button", { name: /I've paid/ }).click();
  await expect(page.getByText(/Payment recorded/)).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();

  // The new pending payment shows up in the list
  await expect(page.getByText(/waiting for/)).toBeVisible();
});

test("receiver confirms a pending payment → settles", async ({ page }) => {
  await login(page);
  await page.goto("/en/settle/list");

  // Seeded pending payment from sara (to Ali) — confirm it
  await page
    .getByRole("button", { name: /Confirm received/ })
    .first()
    .click();
  await expect(page.getByText("Confirmed — settled ✓")).toBeVisible();

  // After confirmation it disappears from "payments to confirm"
  await expect(page.getByText("Payments to confirm (1)")).not.toBeVisible();
});
