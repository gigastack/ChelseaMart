import { expect, test } from "@playwright/test";
import { seededOrderIds, signInAsAdmin, signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("admin order status updates are reflected in the customer account timeline", async ({ browser }) => {
  const adminPage = await browser.newPage();
  await signInAsAdmin(adminPage, `/admin/orders/${seededOrderIds.processing}`);
  await expect(adminPage.getByRole("heading", { name: seededOrderIds.processing })).toBeVisible();
  const markAsShippedButton = adminPage.getByRole("button", { name: /mark as shipped/i });
  await Promise.all([adminPage.waitForLoadState("networkidle"), markAsShippedButton.click()]);
  await expect(markAsShippedButton).toHaveCount(0);
  await expect(adminPage.getByText(/^shipped$/i)).toBeVisible();
  await adminPage.close();

  const customerPage = await browser.newPage();
  await signInAsCustomer(customerPage, "/account/orders");
  await expect(customerPage.getByText(/status: shipped/i)).toBeVisible();
  await customerPage.close();
});
