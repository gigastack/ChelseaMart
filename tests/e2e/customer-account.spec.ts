import { expect, test } from "@playwright/test";
import { seededOrderIds, signInAsCustomer } from "@/tests/e2e/helpers/auth";

test("customer account pages show seeded orders and consignees from Supabase", async ({ page }) => {
  await signInAsCustomer(page, "/account/orders");

  await expect(page).toHaveURL(/\/account\/orders/);
  await expect(page.getByRole("heading", { name: /follow every order from product payment to delivery/i })).toBeVisible();
  await expect(page.getByText(seededOrderIds.awaitingShippingPayment)).toBeVisible();
  await expect(page.getByText(/shipping payment due|at warehouse|in transit/i).first()).toBeVisible();
  await page.getByRole("link", { name: /view order details/i }).first().click();
  await expect(page).toHaveURL(new RegExp(seededOrderIds.awaitingShippingPayment));
  await expect(page.getByRole("button", { name: /pay shipping in ngn/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /view proof/i })).toBeVisible();

  await page.goto("/account/consignees");
  await expect(page.getByRole("heading", { name: /manage the people who can receive your orders/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Ngozi Receiver/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Tunde Receiver/i })).toBeVisible();

  const uniqueId = Date.now();
  const createdName = `Playwright Receiver ${uniqueId}`;
  const updatedName = `Updated Receiver ${uniqueId}`;
  await page.getByLabel(/full name/i).last().fill(createdName);
  await page.getByLabel(/^phone$/i).last().fill(`+2348000${uniqueId}`.slice(0, 14));
  await page.getByLabel(/city \/ state/i).last().fill("Ibadan");
  await page.getByLabel(/^notes$/i).last().fill("Created by Playwright");
  await Promise.all([page.waitForURL(/\/account\/consignees/), page.getByRole("button", { name: /save consignee/i }).click()]);
  await expect(page.getByText(createdName)).toBeVisible();

  const createdCard = page.locator("article").filter({ hasText: createdName });
  await createdCard.getByText(/edit consignee/i).click();
  await createdCard.getByLabel(/full name/i).fill(updatedName);
  await createdCard.getByRole("textbox", { name: /^note$/i }).fill("Updated by Playwright");
  await Promise.all([page.waitForURL(/\/account\/consignees/), createdCard.getByRole("button", { name: /save changes/i }).click()]);
  await expect(page.getByText(updatedName)).toBeVisible();

  const updatedCard = page.locator("article").filter({ hasText: updatedName });
  await Promise.all([page.waitForURL(/\/account\/consignees/), updatedCard.getByRole("button", { name: /delete/i }).click()]);
  await expect(page.getByText(updatedName)).toHaveCount(0);
});
