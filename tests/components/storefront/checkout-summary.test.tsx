import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";

describe("CheckoutSummary", () => {
  it("shows the product-only payment summary", () => {
    render(
      <CheckoutSummary
        summary={{
          currency: "NGN",
          payNowTotalNgn: 40000,
          productSubtotalNgn: 40000,
          serviceFeeNgn: 0,
        }}
      />,
    );

    expect(screen.getAllByText("NGN 40,000")).toHaveLength(2);
    expect(screen.getByText("Product subtotal")).toBeInTheDocument();
    expect(screen.getByText("Marketplace service fee")).toBeInTheDocument();
    expect(screen.getByText(/shipping is billed separately/i)).toBeInTheDocument();
  });
});
