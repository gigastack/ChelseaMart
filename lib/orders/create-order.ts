import { quoteOrderTotals } from "@/lib/pricing/calculate";
import type { CheckoutRoute } from "@/lib/domain/types";
import type { CartItemRecord } from "@/lib/orders/repository";

type CreateOrderInput = {
  cartItems: CartItemRecord[];
  consigneeId: string;
  route: CheckoutRoute;
  routeConfig: {
    minimumFeeNgn: number;
    pricePerKgUsd: number;
  };
  usdToNgnRate: number;
  userId: string;
};

export function createOrder(input: CreateOrderInput) {
  const summary = quoteOrderTotals({
    items: input.cartItems.map((item) => ({
      productTitle: item.title,
      quantity: item.quantity,
      sellPriceNgn: item.sellPriceNgn,
      weightKg: item.weightKg,
    })),
    routeConfig: input.routeConfig,
    usdToNgnRate: input.usdToNgnRate,
  });

  return {
    consigneeId: input.consigneeId,
    currency: "NGN" as const,
    grandTotalNgn: summary.grandTotalNgn,
    items: input.cartItems.map((item, index) => ({
      lineTotalNgnSnapshot: summary.lines[index]?.productSubtotalNgn ?? 0,
      logisticsFeeNgnSnapshot: summary.lines[index]?.logisticsFeeNgn ?? 0,
      moqSnapshot: 1,
      productTitleSnapshot: item.title,
      productUnitPriceNgnSnapshot: item.sellPriceNgn,
      quantity: item.quantity,
      weightKgSnapshot: item.weightKg,
    })),
    logisticsTotalNgn: summary.logisticsTotalNgn,
    productSubtotalNgn: summary.productSubtotalNgn,
    route: input.route,
    userId: input.userId,
  };
}
