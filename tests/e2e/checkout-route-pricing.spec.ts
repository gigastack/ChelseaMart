import { expect, test } from "@playwright/test";
import { signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("customer checkout separates route acceptance from the first product payment", async ({ page }) => {
  await signInAsCustomer(page, "/catalog");
  await page.getByRole("link", { name: /product image sample/i }).click();
  await expect(page).toHaveURL(/\/products\//);
  await page.getByRole("button", { name: /add to cart/i }).click();
  await expect(page.getByText(/added to cart/i)).toBeVisible();
  await page.goto("/checkout");

  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole("heading", { name: /choose a route\. pay for products\. shipping comes later\./i })).toBeVisible();
  await expect(page.getByText("Ngozi Receiver", { exact: true })).toBeVisible();
  await expect(page.getByText(/what happens after payment/i)).toBeVisible();
  await expect(page.getByText(/you pay for products in naira now/i)).toBeVisible();
  await expect(page.getByText(/cny reference/i)).toBeVisible();
  await expect(page.getByText(/cny to ngn rate/i)).toBeVisible();

  const seaRouteButton = page.getByRole("button", { name: /lagos to uk sea freight/i });
  await seaRouteButton.click();
  await expect(seaRouteButton).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText(/shipping is billed separately after warehouse weighing and proof upload/i),
  ).toBeVisible();
});
