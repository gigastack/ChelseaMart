import { expect, test } from "@playwright/test";

test("checkout updates NGN total when route changes", async ({ page }) => {
  await page.goto("/checkout");
  const grandTotal = page.getByText(/^NGN\s[\d,]+$/).last();
  const airButton = page.getByRole("button", { name: /air/i });
  const seaButton = page.getByRole("button", { name: /sea/i });

  await expect(airButton).toHaveAttribute("aria-pressed", "true");
  await expect(grandTotal).toBeVisible();
  const initialTotal = await grandTotal.textContent();

  await seaButton.click();
  await expect(seaButton).toHaveAttribute("aria-pressed", "true");
  await expect(grandTotal).not.toHaveText(initialTotal ?? "");
});
