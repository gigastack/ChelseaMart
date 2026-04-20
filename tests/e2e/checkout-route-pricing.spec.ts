import { expect, test } from "@playwright/test";
import { signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("customer checkout uses seeded data and updates totals when the route changes", async ({ page }) => {
  await signInAsCustomer(page, "/checkout");

  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole("heading", { name: /review the NGN total before payment/i })).toBeVisible();
  await expect(page.getByText("Ngozi Receiver", { exact: true })).toBeVisible();
  await expect(page.getByText("NGN 123,360")).toBeVisible();

  await page.getByRole("button", { name: /^Sea Lower logistics pricing with a slower arrival timeline into Nigeria hubs\./i }).click();
  await expect(page.getByText("NGN 105,440")).toBeVisible();
});
