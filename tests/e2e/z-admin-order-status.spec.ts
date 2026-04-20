import { expect, test } from "@playwright/test";
import { seededOrderIds, signInAsAdmin, signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("admin order status updates are reflected in the customer account timeline", async ({ browser }) => {
  const adminPage = await browser.newPage();
  await signInAsAdmin(adminPage, `/admin/orders/${seededOrderIds.shippingPaid}`);
  await expect(adminPage.getByRole("heading", { name: seededOrderIds.shippingPaid })).toBeVisible();
  const markAsInTransitButton = adminPage.getByRole("button", { name: /mark as in transit/i });
  await Promise.all([adminPage.waitForLoadState("networkidle"), markAsInTransitButton.click()]);
  await expect(markAsInTransitButton).toHaveCount(0);
  await expect(adminPage.getByText(/^in transit$/i)).toBeVisible();
  await adminPage.close();

  const customerPage = await browser.newPage();
  await signInAsCustomer(customerPage, `/account/orders/${seededOrderIds.shippingPaid}`);
  await expect(customerPage.getByText(/^in transit$/i)).toBeVisible();
  await customerPage.close();
});
