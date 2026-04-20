import { describe, expect, it } from "vitest";
import {
  buildRouteAcceptanceSnapshot,
  calculateShippingInvoice,
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

  it("calculates an air shipping invoice in USD and payable NGN", () => {
    const result = calculateShippingInvoice({
      measuredWeightKg: 12.4,
      mode: "air",
      pricePerKgUsd: 8,
      usdToNgnRate: 1600,
    });

    expect(result).toEqual({
      measurementBasis: "weight_kg",
      rateCurrency: "USD",
      shippingCostNgn: 158720,
      shippingCostUsd: 99.2,
      usdToNgnRate: 1600,
    });
  });

  it("calculates a sea shipping invoice in USD and payable NGN", () => {
    const result = calculateShippingInvoice({
      measuredVolumeCbm: 1.8,
      mode: "sea",
      pricePerCbmUsd: 45,
      usdToNgnRate: 1600,
    });

    expect(result).toEqual({
      measurementBasis: "volume_cbm",
      rateCurrency: "USD",
      shippingCostNgn: 129600,
      shippingCostUsd: 81,
      usdToNgnRate: 1600,
    });
  });

  it("rejects incomplete warehouse measurements", () => {
    expect(() =>
      calculateShippingInvoice({
        measuredWeightKg: 0,
        mode: "air",
        pricePerKgUsd: 8,
        usdToNgnRate: 1600,
      }),
    ).toThrow(/weight/i);
  });
});
