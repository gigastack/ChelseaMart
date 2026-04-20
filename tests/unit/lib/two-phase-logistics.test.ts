import { describe, expect, it } from "vitest";
import {
  buildRouteAcceptanceSnapshot,
  calculateShippingChargeNgn,
} from "@/lib/logistics/two-phase";

describe("two-phase logistics", () => {
  it("creates a customer-facing route acceptance snapshot", () => {
    const snapshot = buildRouteAcceptanceSnapshot({
      destinationLabel: "UK",
      etaDaysMax: 10,
      etaDaysMin: 7,
      formulaLabel: "Air Freight = Price per KG × Total Weight",
      mode: "air",
      originLabel: "Lagos",
      routeId: "route-1",
      routeVersionId: "route-version-1",
      termsSummary: "Final cost confirmed after warehouse weighing.",
    });

    expect(snapshot).toEqual({
      destinationLabel: "UK",
      etaDaysMax: 10,
      etaDaysMin: 7,
      formulaLabel: "Air Freight = Price per KG × Total Weight",
      mode: "air",
      originLabel: "Lagos",
      routeId: "route-1",
      routeVersionId: "route-version-1",
      termsSummary: "Final cost confirmed after warehouse weighing.",
    });
  });

  it("calculates air shipping charges from actual warehouse weight", () => {
    const result = calculateShippingChargeNgn({
      measuredWeightKg: 12.4,
      mode: "air",
      pricePerKg: 8,
      rateCurrency: "USD",
      usdToNgnRate: 1600,
    });

    expect(result).toBe(158720);
  });

  it("calculates sea shipping charges from measured CBM volume", () => {
    const result = calculateShippingChargeNgn({
      measuredVolumeCbm: 1.8,
      mode: "sea",
      pricePerCbm: 55000,
      rateCurrency: "NGN",
    });

    expect(result).toBe(99000);
  });

  it("rejects incomplete warehouse measurements", () => {
    expect(() =>
      calculateShippingChargeNgn({
        measuredWeightKg: 0,
        mode: "air",
        pricePerKg: 8,
        rateCurrency: "USD",
        usdToNgnRate: 1600,
      }),
    ).toThrow(/weight/i);
  });
});
