import type { Page } from "@playwright/test";

const defaultCredentials = {
  adminEmail: process.env.DEMO_ADMIN_EMAIL ?? "demo.admin@mart.local",
  adminPassword: process.env.DEMO_ADMIN_PASSWORD ?? "DemoAdmin123!",
  customerEmail: process.env.DEMO_CUSTOMER_EMAIL ?? "demo.customer@mart.local",
  customerPassword: process.env.DEMO_CUSTOMER_PASSWORD ?? "DemoCustomer123!",
};

export const seededOrderIds = {
  awaitingShippingPayment: "77777777-7777-7777-7777-777777777771",
  shippingPaid: "77777777-7777-7777-7777-777777777772",
};

async function submitCredentials(page: Page) {
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith("/auth/sign-in"), {
      timeout: 15_000,
    }),
    page.getByRole("button", { name: /continue/i }).click(),
  ]);
}

export async function signInAsCustomer(page: Page, nextPath = "/account/orders") {
  await page.goto(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
  await page.getByLabel(/email address/i).fill(defaultCredentials.customerEmail);
  await page.getByLabel(/^password$/i).fill(defaultCredentials.customerPassword);
  await submitCredentials(page);
}

export async function signInAsAdmin(page: Page, nextPath = "/admin") {
  await page.goto(`/auth/sign-in?next=${encodeURIComponent(nextPath)}`);
  await page.getByLabel(/email address/i).fill(defaultCredentials.adminEmail);
  await page.getByLabel(/^password$/i).fill(defaultCredentials.adminPassword);
  await submitCredentials(page);
}
