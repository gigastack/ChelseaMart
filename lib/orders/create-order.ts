type CartItemInput = {
  productId: string;
  quantity: number;
  sellPriceNgn: number;
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
  consigneeId: string;
  routeSnapshot: RouteSnapshot;
  serviceFeeNgn: number;
  userId: string;
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function createRouteAcceptedOrder(input: CreateRouteAcceptedOrderInput) {
  const items = input.cartItems.map((item) => ({
    lineTotalNgnSnapshot: roundMoney(item.sellPriceNgn * item.quantity),
    moqSnapshot: 1,
    productId: item.productId,
    productTitleSnapshot: item.title,
    productUnitPriceNgnSnapshot: item.sellPriceNgn,
    quantity: item.quantity,
  }));

  const productSubtotalNgn = roundMoney(items.reduce((sum, item) => sum + item.lineTotalNgnSnapshot, 0));
  const productPaymentTotalNgn = roundMoney(productSubtotalNgn + input.serviceFeeNgn);

  return {
    consigneeId: input.consigneeId,
    items,
    productPaymentState: "pending" as const,
    productPaymentTotalNgn,
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
