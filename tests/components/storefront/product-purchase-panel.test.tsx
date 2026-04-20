import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StorefrontCurrencyProvider } from "@/components/storefront/currency-provider";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";

describe("ProductPurchasePanel", () => {
  it("shows the effective MOQ and the two-phase payment explanation", () => {
    render(
      <StorefrontCurrencyProvider>
        <ProductPurchasePanel
          product={{
            category: "Lighting",
            description: "Curated desk lamp",
            effectiveMoq: 3,
            id: "product-1",
            imageUrl: "/lamp.jpg",
            longDescription: "Calm editorial product detail.",
            moq: 3,
            priceDisplay: "CN¥ 90.91",
            priceDisplayNgn: "NGN 20,000",
            sellPriceCny: 90.91,
            sellPriceNgn: 20000,
            slug: "desk-lamp",
            specs: ["Air + Sea"],
            title: "Desk Lamp",
            weightKg: 1.4,
          }}
        />
      </StorefrontCurrencyProvider>,
    );

    expect(screen.getByText("CN¥ 90.91")).toBeInTheDocument();
    expect(screen.getByText("NGN 20,000 payable at checkout")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/shipping is invoiced later in usd/i)).toBeInTheDocument();
  });
});
