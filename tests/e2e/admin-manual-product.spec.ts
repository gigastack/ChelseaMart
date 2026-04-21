import { expect, test } from "@playwright/test";
import path from "node:path";
import { signInAsAdmin, signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("customer is blocked from admin while admin can access the control surface", async ({ browser }) => {
  const customerPage = await browser.newPage();
  await signInAsCustomer(customerPage, "/");
  await expect(customerPage.getByRole("link", { name: /admin/i })).toHaveCount(0);
  await customerPage.goto("/admin");
  await expect(customerPage).toHaveURL(/\/account\/orders/);
  await customerPage.close();

  const adminPage = await browser.newPage();
  await signInAsAdmin(adminPage, "/admin");
  await expect(adminPage).toHaveURL(/\/admin/);
  await expect(adminPage.getByRole("heading", { name: /operations dashboard/i })).toBeVisible();
  await adminPage.goto("/admin/products");
  await expect(adminPage.getByRole("heading", { level: 1, name: /^products$/i })).toBeVisible();
  await adminPage.goto("/admin/products/new?source=manual");

  const uniqueId = Date.now();
  await adminPage.getByLabel(/product title/i).fill(`Playwright Product ${uniqueId}`);
  await adminPage.getByLabel(/moq override/i).fill("3");
  await adminPage.getByLabel(/short description/i).fill("Created by Playwright");
  await adminPage.getByLabel(/cost price \(cny\)/i).fill("120");
  await adminPage.getByLabel(/selling price \(cny\)/i).fill("180");
  await adminPage.getByLabel(/cover image/i).setInputFiles(path.join(process.cwd(), "public", "ProductImage.jpg"));
  await Promise.all([
    adminPage.waitForURL(/\/admin\/products\/[0-9a-f-]+/),
    adminPage.getByRole("button", { name: /publish product/i }).click(),
  ]);
  await expect(adminPage.getByText(/product saved\./i)).toBeVisible();
  await expect(adminPage.getByText(/^live$/i).first()).toBeVisible();
  await adminPage.close();
});
