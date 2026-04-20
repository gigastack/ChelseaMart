import { expect, test } from "@playwright/test";
import { seededOrderIds, signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("customer account pages show seeded orders and consignees from Supabase", async ({ page }) => {
  await signInAsCustomer(page, "/account/orders");

  await expect(page).toHaveURL(/\/account\/orders/);
  await expect(page.getByText(seededOrderIds.awaitingShippingPayment)).toBeVisible();
  await expect(page.getByText(/status: awaiting shipping payment/i)).toBeVisible();
  await page.getByRole("link", { name: /view details/i }).first().click();
  await expect(page).toHaveURL(new RegExp(seededOrderIds.awaitingShippingPayment));
  await expect(page.getByRole("button", { name: /pay shipping now/i })).toBeVisible();
  await expect(page.getByText(/proof of weighing:/i)).toBeVisible();

  await page.goto("/account/consignees");
  await expect(page.getByRole("heading", { name: /Nigeria hub recipients/i })).toBeVisible();
  await expect(page.getByText(/Ngozi Receiver/i)).toBeVisible();
  await expect(page.getByText(/Tunde Receiver/i)).toBeVisible();
});
