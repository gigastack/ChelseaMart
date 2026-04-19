import { expect, test } from "@playwright/test";

test("storefront browse and product detail flow", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByRole("heading", { name: /curated products/i })).toBeVisible();
  await page.getByRole("link", { name: /product image sample/i }).click();
  await expect(page.getByRole("heading", { name: /product image sample/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
});
