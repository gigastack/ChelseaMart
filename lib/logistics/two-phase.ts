import type { CurrencyCode } from "@/lib/domain/types";

type BuildRouteAcceptanceSnapshotInput = {
  destinationLabel: string;
  etaDaysMax: number;
  etaDaysMin: number;
  formulaLabel: string;
  mode: "air" | "sea";
  originLabel: string;
  routeId: string;
  routeVersionId: string;
  termsSummary: string;
};

type CalculateShippingChargeNgnInput =
  | {
      measuredWeightKg: number;
      mode: "air";
      pricePerKg: number;
      rateCurrency: CurrencyCode;
      usdToNgnRate?: number;
    }
  | {
      measuredVolumeCbm: number;
      mode: "sea";
      pricePerCbm: number;
      rateCurrency: CurrencyCode;
      usdToNgnRate?: number;
    };

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function resolveCurrencyMultiplier(rateCurrency: CurrencyCode, usdToNgnRate?: number) {
  if (rateCurrency === "NGN") {
    return 1;
  }

  if (rateCurrency === "USD" && usdToNgnRate) {
    return usdToNgnRate;
  }

  throw new Error("USD-denominated shipping routes require a USD to NGN rate.");
}

export function buildRouteAcceptanceSnapshot(input: BuildRouteAcceptanceSnapshotInput) {
  return {
    destinationLabel: input.destinationLabel,
    etaDaysMax: input.etaDaysMax,
    etaDaysMin: input.etaDaysMin,
    formulaLabel: input.formulaLabel,
    mode: input.mode,
    originLabel: input.originLabel,
    routeId: input.routeId,
    routeVersionId: input.routeVersionId,
    termsSummary: input.termsSummary,
  };
}

export function calculateShippingChargeNgn(input: CalculateShippingChargeNgnInput) {
  const currencyMultiplier = resolveCurrencyMultiplier(input.rateCurrency, input.usdToNgnRate);

  if (input.mode === "air") {
    if (!input.measuredWeightKg || input.measuredWeightKg <= 0) {
      throw new Error("A positive warehouse weight is required for air shipping.");
    }

    return roundMoney(input.measuredWeightKg * input.pricePerKg * currencyMultiplier);
  }

  if (!input.measuredVolumeCbm || input.measuredVolumeCbm <= 0) {
    throw new Error("A positive warehouse volume is required for sea shipping.");
  }

  return roundMoney(input.measuredVolumeCbm * input.pricePerCbm * currencyMultiplier);
}
