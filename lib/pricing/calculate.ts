type ConvertCnyToNgnInput = {
  cnyToNgnRate: number;
  sourcePriceCny: number;
};

type ConvertUsdToNgnInput = {
  sourcePriceUsd: number;
  usdToNgnRate: number;
};

type ProductPaymentItem = {
  effectiveMoq: number;
  quantity: number;
  sellPriceCny: number;
};

type SumProductPaymentTotalsInput = {
  cnyToNgnRate: number;
  items: ProductPaymentItem[];
};

type ProductPaymentLine = {
  effectiveMoq: number;
  lineTotalCny: number;
  lineTotalNgn: number;
  productUnitPriceCny: number;
  productUnitPriceNgn: number;
  quantity: number;
};

type SumProductPaymentTotalsResult = {
  lines: ProductPaymentLine[];
  productSubtotalCny: number;
  productSubtotalNgn: number;
};

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function convertCnyToNgn({ cnyToNgnRate, sourcePriceCny }: ConvertCnyToNgnInput) {
  return roundCurrency(sourcePriceCny * cnyToNgnRate);
}

export function convertUsdToNgn({ sourcePriceUsd, usdToNgnRate }: ConvertUsdToNgnInput) {
  return roundCurrency(sourcePriceUsd * usdToNgnRate);
}

export function sumProductPaymentTotals({
  cnyToNgnRate,
  items,
}: SumProductPaymentTotalsInput): SumProductPaymentTotalsResult {
  const lines = items.map((item) => {
    if (!Number.isInteger(item.effectiveMoq) || item.effectiveMoq <= 0) {
      throw new Error("Effective MOQ must be a positive integer.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Quantity must be a positive integer.");
    }

    if (item.quantity < item.effectiveMoq) {
      throw new Error(`Quantity must be at least the effective MOQ of ${item.effectiveMoq}.`);
    }

    const productUnitPriceNgn = convertCnyToNgn({
      cnyToNgnRate,
      sourcePriceCny: item.sellPriceCny,
    });
    const lineTotalCny = roundCurrency(item.sellPriceCny * item.quantity);
    const lineTotalNgn = roundCurrency(productUnitPriceNgn * item.quantity);

    return {
      effectiveMoq: item.effectiveMoq,
      lineTotalCny,
      lineTotalNgn,
      productUnitPriceCny: item.sellPriceCny,
      productUnitPriceNgn,
      quantity: item.quantity,
    };
  });

  const productSubtotalCny = roundCurrency(lines.reduce((sum, line) => sum + line.lineTotalCny, 0));
  const productSubtotalNgn = roundCurrency(lines.reduce((sum, line) => sum + line.lineTotalNgn, 0));

  return {
    lines,
    productSubtotalCny,
    productSubtotalNgn,
  };
}
