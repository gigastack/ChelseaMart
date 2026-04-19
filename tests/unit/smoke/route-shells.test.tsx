import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminDashboardPage } from "@/components/admin/dashboard-page";
import { StorefrontHomePage } from "@/components/storefront/home-page";
import { seedProducts } from "@/lib/demo/manual-upload-seed";

describe("route shells", () => {
  it("renders the storefront landing shell", () => {
    render(
      <StorefrontHomePage
        products={[
          {
            category: seedProducts[0]!.category,
            description: seedProducts[0]!.description,
            id: seedProducts[0]!.id,
            imageUrl: seedProducts[0]!.coverImageUrl,
            longDescription: seedProducts[0]!.longDescription,
            moq: seedProducts[0]!.moq,
            priceDisplay: "NGN 68,000",
            sellPriceNgn: seedProducts[0]!.basePriceNgn,
            slug: seedProducts[0]!.slug,
            specs: seedProducts[0]!.specs,
            title: seedProducts[0]!.title,
            weightKg: seedProducts[0]!.weightKg,
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: /curated china sourcing for nigerians/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /shop products/i })).toBeVisible();
  });

  it("renders the admin dashboard shell", () => {
    render(
      <AdminDashboardPage
        overviewTiles={[
          {
            description: "Imports, catalog health, and orders are surfaced here before deeper BI and workflow pages land.",
            title: "Operations control room",
            value: "1",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: /operations control room/i })).toBeVisible();
    expect(screen.getByText(/imports, catalog health, and orders/i)).toBeVisible();
  });
});
