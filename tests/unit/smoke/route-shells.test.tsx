import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminDashboardPage } from "@/components/admin/dashboard-page";
import { StorefrontCurrencyProvider } from "@/components/storefront/currency-provider";
import { StorefrontHomePage } from "@/components/storefront/home-page";
import { seedProducts } from "@/lib/demo/manual-upload-seed";

describe("route shells", () => {
  it("renders the storefront landing shell", () => {
    render(
      <StorefrontCurrencyProvider>
        <StorefrontHomePage
          products={[
            {
              category: seedProducts[0]!.category,
              description: seedProducts[0]!.description,
              effectiveMoq: seedProducts[0]!.moq,
              id: seedProducts[0]!.id,
              imageUrl: seedProducts[0]!.coverImageUrl,
              longDescription: seedProducts[0]!.longDescription,
              moq: seedProducts[0]!.moq,
              priceDisplay: "CN¥ 309.09",
              priceDisplayNgn: "NGN 68,000",
              sellPriceCny: 309.09,
              sellPriceNgn: seedProducts[0]!.basePriceNgn,
              slug: seedProducts[0]!.slug,
              specs: seedProducts[0]!.specs,
              title: seedProducts[0]!.title,
              weightKg: seedProducts[0]!.weightKg,
            },
          ]}
        />
      </StorefrontCurrencyProvider>,
    );

    expect(screen.getByRole("heading", { name: /source products in cny\. pay in naira\. handle shipping later\./i })).toBeVisible();
    expect(screen.getByRole("link", { name: /shop catalog/i })).toBeVisible();
    expect(screen.queryByRole("link", { name: /open admin/i })).not.toBeInTheDocument();
  });

  it("renders the admin dashboard shell", () => {
    render(
      <AdminDashboardPage
        overviewTiles={[
          {
            description: "Orders, catalog, and payments are surfaced here.",
            title: "Warehouse queue",
            value: "1",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: /see what needs action\./i })).toBeVisible();
    expect(screen.getByText(/orders, catalog, and payments are surfaced here/i)).toBeVisible();
  });
});
