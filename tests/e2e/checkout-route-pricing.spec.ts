import { expect, test } from "@playwright/test";
import { signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("customer checkout separates route acceptance from the first product payment", async ({ page }) => {
  await signInAsCustomer(page, "/checkout");

  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole("heading", { name: /choose a route and pay for products only/i })).toBeVisible();
  await expect(page.getByText("Ngozi Receiver", { exact: true })).toBeVisible();
  await expect(page.getByText(/no logistics charge is collected in this first payment/i)).toBeVisible();
  await expect(page.getByText(/product payment due now/i)).toBeVisible();
  await expect(page.getByText(/cny reference/i)).toBeVisible();
  await expect(page.getByText(/cny to ngn rate/i)).toBeVisible();

  const seaRouteButton = page.getByRole("button", { name: /lagos to uk sea freight/i });
  await seaRouteButton.click();
  await expect(seaRouteButton).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/final shipping cost is confirmed only after warehouse measurement and proof upload/i)).toBeVisible();
});
