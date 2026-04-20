import { sumProductPaymentTotals } from "@/lib/pricing/calculate";

type CartItemInput = {
  effectiveMoq: number;
  productId: string;
  quantity: number;
  sellPriceCny: number;
  title: string;
};

type RouteSnapshot = {
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

type CreateRouteAcceptedOrderInput = {
  cartItems: CartItemInput[];
  cnyToNgnRate: number;
  consigneeId: string;
  routeSnapshot: RouteSnapshot;
  serviceFeeNgn: number;
  userId: string;
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function createRouteAcceptedOrder(input: CreateRouteAcceptedOrderInput) {
  const totals = sumProductPaymentTotals({
    cnyToNgnRate: input.cnyToNgnRate,
    items: input.cartItems.map((item) => ({
      effectiveMoq: item.effectiveMoq,
      quantity: item.quantity,
      sellPriceCny: item.sellPriceCny,
    })),
  });
  const items = input.cartItems.map((item, index) => ({
    effectiveMoqSnapshot: totals.lines[index]?.effectiveMoq ?? item.effectiveMoq,
    lineTotalCnySnapshot: totals.lines[index]?.lineTotalCny ?? roundMoney(item.sellPriceCny * item.quantity),
    lineTotalNgnSnapshot: totals.lines[index]?.lineTotalNgn ?? 0,
    moqSnapshot: totals.lines[index]?.effectiveMoq ?? item.effectiveMoq,
    productId: item.productId,
    productTitleSnapshot: item.title,
    productUnitPriceCnySnapshot: totals.lines[index]?.productUnitPriceCny ?? item.sellPriceCny,
    productUnitPriceNgnSnapshot: totals.lines[index]?.productUnitPriceNgn ?? 0,
    quantity: item.quantity,
  }));

  const productSubtotalCny = totals.productSubtotalCny;
  const productSubtotalNgn = totals.productSubtotalNgn;
  const productPaymentTotalNgn = roundMoney(productSubtotalNgn + input.serviceFeeNgn);

  return {
    consigneeId: input.consigneeId,
    items,
    productPaymentCnyToNgnRate: input.cnyToNgnRate,
    productPaymentState: "pending" as const,
    productPaymentTotalNgn,
    productSubtotalCny,
    productSubtotalNgn,
    routeAccepted: true,
    routeAcceptedAt: new Date().toISOString(),
    routeSnapshot: input.routeSnapshot,
    serviceFeeNgn: input.serviceFeeNgn,
    shippingCostNgn: null,
    shippingPaymentState: "not_due" as const,
    status: "route_selected" as const,
    userId: input.userId,
  };
}
