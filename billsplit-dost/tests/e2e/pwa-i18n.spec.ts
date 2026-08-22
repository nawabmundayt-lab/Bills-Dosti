import { test, expect } from "@playwright/test";

/**
 * E2E — PWA & localization (plan Phase 6 §4/§6):
 * manifest installability, service worker, Urdu RTL, Hindi rendering.
 */

test("PWA manifest is installable", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBeTruthy();
  const manifest = await res.json();
  expect(manifest.name).toBe("BillSplit Dost");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
});

test("service worker is served", async ({ request }) => {
  const res = await request.get("/sw.js");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain("self.addEventListener");
});

test("Urdu locale renders RTL with Urdu copy", async ({ page }) => {
  await page.goto("/ur");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ur");
  await expect(page.getByText(/دوستوں کے ساتھ حساب/)).toBeVisible();
});

test("Hindi locale renders Devanagari copy", async ({ page }) => {
  await page.goto("/hi");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByText(/दोस्तों के साथ हिसाब/)).toBeVisible();
});

test("dates render DD MMM (DD/MM/YYYY convention)", async ({ page }) => {
  // demo login, then check an expense date on the group page
  await page.goto("/en/login");
  await page.getByPlaceholder("300 1234567").fill("3001234567");
  await page.getByRole("button", { name: "Send OTP" }).click();
  for (let i = 0; i < 4; i++) {
    await page.locator('input[aria-label^="OTP digit"]').nth(i).fill("4");
  }
  await page.getByRole("button", { name: "Verify & Continue" }).click();
  await page.goto("/en/groups/chai");
  // e.g. "21 Aug" — day first, month short
  await expect(page.getByText(/\d{1,2} \w{3}/)).toBeVisible();
});
