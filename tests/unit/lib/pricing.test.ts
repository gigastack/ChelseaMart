import { describe, expect, it } from "vitest";
import {
  convertCnyToNgn,
  convertUsdToNgn,
  sumProductPaymentTotals,
} from "@/lib/pricing/calculate";

describe("pricing domain", () => {
  it("converts a CNY product price into NGN at checkout time", () => {
    expect(convertCnyToNgn({ cnyToNgnRate: 220, sourcePriceCny: 10 })).toBe(2200);
  });

  it("converts a USD logistics invoice into NGN for payment", () => {
    expect(convertUsdToNgn({ sourcePriceUsd: 81, usdToNgnRate: 1600 })).toBe(129600);
  });

  it("sums product-payment totals while preserving both CNY and NGN snapshots", () => {
    const items = [
      { effectiveMoq: 2, quantity: 2, sellPriceCny: 250 },
      { effectiveMoq: 1, quantity: 1, sellPriceCny: 80 },
    ];
    const result = sumProductPaymentTotals({ cnyToNgnRate: 220, items });

    expect(result.productSubtotalCny).toBe(580);
    expect(result.lines).toHaveLength(2);
    expect(result.productSubtotalNgn).toBe(127600);
    expect(result.lines[0]).toMatchObject({
      effectiveMoq: 2,
      lineTotalCny: 500,
      lineTotalNgn: 110000,
      productUnitPriceCny: 250,
      productUnitPriceNgn: 55000,
      quantity: 2,
    });
  });
});
