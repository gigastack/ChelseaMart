import { expect, test } from "@playwright/test";

test("admin manual product creation flow uses the canonical QA product", async ({ page }) => {
  await page.goto("/admin/products/new");
  await expect(page.getByRole("heading", { name: /choose how this product enters the catalog/i })).toBeVisible();

  await page.getByRole("link", { name: /start manual upload/i }).click();

  await expect(page.getByRole("heading", { level: 1, name: /create manual product/i })).toBeVisible();
  await expect(page.getByRole("textbox", { name: /product title/i })).toHaveValue("Product Image Sample");
  await expect(page.getByRole("button", { name: /publish product/i })).toBeVisible();
});
