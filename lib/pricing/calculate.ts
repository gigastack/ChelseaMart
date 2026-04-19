type ConvertCnyToNgnInput = {
  cnyToNgnRate: number;
  sourcePriceCny: number;
};

type CalculateLineLogisticsInput = {
  minimumFeeNgn: number;
  pricePerKgUsd: number;
  quantity: number;
  usdToNgnRate: number;
  weightKg: number;
};

type QuoteOrderItem = {
  productTitle: string;
  quantity: number;
  sellPriceNgn: number;
  weightKg: number;
};

type QuoteOrderTotalsInput = {
  items: QuoteOrderItem[];
  routeConfig: Pick<CalculateLineLogisticsInput, "minimumFeeNgn" | "pricePerKgUsd">;
  usdToNgnRate: number;
};

type QuoteOrderLine = {
  logisticsFeeNgn: number;
  productTitle: string;
  productSubtotalNgn: number;
  quantity: number;
  weightKg: number;
};

type QuoteOrderTotalsResult = {
  grandTotalNgn: number;
  lines: QuoteOrderLine[];
  logisticsTotalNgn: number;
  productSubtotalNgn: number;
};

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function convertCnyToNgn({ cnyToNgnRate, sourcePriceCny }: ConvertCnyToNgnInput) {
  return roundCurrency(sourcePriceCny * cnyToNgnRate);
}

export function calculateLineLogisticsNgn({
  minimumFeeNgn,
  pricePerKgUsd,
  quantity,
  usdToNgnRate,
  weightKg,
}: CalculateLineLogisticsInput) {
  const rawFee = pricePerKgUsd * usdToNgnRate * weightKg * quantity;
  return roundCurrency(Math.max(rawFee, minimumFeeNgn));
}

export function quoteOrderTotals({
  items,
  routeConfig,
  usdToNgnRate,
}: QuoteOrderTotalsInput): QuoteOrderTotalsResult {
  const lines = items.map((item) => {
    const productSubtotalNgn = roundCurrency(item.sellPriceNgn * item.quantity);
    const logisticsFeeNgn = calculateLineLogisticsNgn({
      minimumFeeNgn: routeConfig.minimumFeeNgn,
      pricePerKgUsd: routeConfig.pricePerKgUsd,
      quantity: item.quantity,
      usdToNgnRate,
      weightKg: item.weightKg,
    });

    return {
      logisticsFeeNgn,
      productSubtotalNgn,
      productTitle: item.productTitle,
      quantity: item.quantity,
      weightKg: item.weightKg,
    };
  });

  const productSubtotalNgn = roundCurrency(lines.reduce((sum, line) => sum + line.productSubtotalNgn, 0));
  const logisticsTotalNgn = roundCurrency(lines.reduce((sum, line) => sum + line.logisticsFeeNgn, 0));

  return {
    grandTotalNgn: roundCurrency(productSubtotalNgn + logisticsTotalNgn),
    lines,
    logisticsTotalNgn,
    productSubtotalNgn,
  };
}
