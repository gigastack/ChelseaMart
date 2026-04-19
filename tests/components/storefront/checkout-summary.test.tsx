import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";

describe("CheckoutSummary", () => {
  it("shows product subtotal, logistics total, and NGN grand total", () => {
    render(
      <CheckoutSummary
        summary={{
          currency: "NGN",
          grandTotalNgn: 49000,
          itemsSubtotalNgn: 40000,
          logisticsTotalNgn: 9000,
        }}
      />,
    );

    expect(screen.getByText("NGN 49,000")).toBeInTheDocument();
    expect(screen.getByText("Product subtotal")).toBeInTheDocument();
    expect(screen.getByText("Logistics total")).toBeInTheDocument();
  });
});
