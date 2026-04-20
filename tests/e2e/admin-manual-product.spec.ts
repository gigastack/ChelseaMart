import { expect, test } from "@playwright/test";
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
  await expect(adminPage.getByRole("heading", { name: /operations control room/i })).toBeVisible();
  await adminPage.goto("/admin/products");
  await expect(adminPage.getByRole("heading", { name: /^products$/i })).toBeVisible();
  await adminPage.close();
});
