import { describe, expect, it } from "vitest";
import {
  calculateLineLogisticsNgn,
  convertCnyToNgn,
  quoteOrderTotals,
} from "@/lib/pricing/calculate";

describe("pricing domain", () => {
  it("converts ELIM source pricing from CNY to NGN", () => {
    expect(convertCnyToNgn({ cnyToNgnRate: 220, sourcePriceCny: 10 })).toBe(2200);
  });

  it("calculates per-line logistics with an NGN floor", () => {
    expect(
      calculateLineLogisticsNgn({
        minimumFeeNgn: 15000,
        pricePerKgUsd: 5,
        quantity: 1,
        usdToNgnRate: 1200,
        weightKg: 2,
      }),
    ).toBe(15000);
  });

  it("quotes checkout totals by summing product subtotal and route-based logistics", () => {
    const result = quoteOrderTotals({
      items: [
        {
          productTitle: "Office chair",
          quantity: 2,
          sellPriceNgn: 55000,
          weightKg: 3,
        },
        {
          productTitle: "Desk lamp",
          quantity: 1,
          sellPriceNgn: 18000,
          weightKg: 1.5,
        },
      ],
      routeConfig: {
        minimumFeeNgn: 10000,
        pricePerKgUsd: 4.5,
      },
      usdToNgnRate: 1200,
    });

    expect(result.productSubtotalNgn).toBe(128000);
    expect(result.lines).toHaveLength(2);
    expect(result.logisticsTotalNgn).toBe(42400);
    expect(result.grandTotalNgn).toBe(170400);
  });
});
