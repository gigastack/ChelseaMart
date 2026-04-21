import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StorefrontCurrencyProvider } from "@/components/storefront/currency-provider";
import { ProductCard } from "@/components/storefront/product-card";

describe("ProductCard", () => {
  it("shows the product price, MOQ, and shipping-later cue", () => {
    render(
      <StorefrontCurrencyProvider>
        <ProductCard
          product={{
            category: "Lighting",
            description: "Curated desk lamp",
            effectiveMoq: 2,
            id: "p1",
            imageUrl: "/lamp.jpg",
            longDescription: "Long form product detail",
            moq: 2,
            priceDisplay: "CN¥ 90.91",
            priceDisplayNgn: "NGN 20,000",
            sellPriceCny: 90.91,
            sellPriceNgn: 20000,
            slug: "desk-lamp",
            specs: [],
            title: "Desk Lamp",
            weightKg: 1.4,
          }}
        />
      </StorefrontCurrencyProvider>,
    );

    expect(screen.getByText("Desk Lamp")).toBeInTheDocument();
    expect(screen.getByText("CN¥ 90.91")).toBeInTheDocument();
    expect(screen.getByText(/MOQ 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Shipping billed later/i)).toBeInTheDocument();
  });
});
