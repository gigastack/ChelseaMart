import { describe, expect, it } from "vitest";
import { createRouteAcceptedOrder } from "@/lib/orders/create-order";

describe("createRouteAcceptedOrder", () => {
  it("creates an order summary that charges only for products and service fees", () => {
    const order = createRouteAcceptedOrder({
      cartItems: [
        {
          productId: "prod-1",
          quantity: 2,
          sellPriceNgn: 92000,
          title: "Product Image Sample",
        },
      ],
      consigneeId: "consignee-1",
      routeSnapshot: {
        destinationLabel: "UK",
        etaDaysMax: 10,
        etaDaysMin: 7,
        formulaLabel: "Air Freight = Price per KG × Total Weight",
        mode: "air",
        originLabel: "Lagos",
        routeId: "route-1",
        routeVersionId: "route-version-1",
        termsSummary: "Final cost confirmed after warehouse weighing.",
      },
      serviceFeeNgn: 2500,
      userId: "user-1",
    });

    expect(order).toMatchObject({
      consigneeId: "consignee-1",
      productPaymentTotalNgn: 186500,
      productSubtotalNgn: 184000,
      routeAccepted: true,
      serviceFeeNgn: 2500,
      shippingCostNgn: null,
      shippingPaymentState: "not_due",
      status: "route_selected",
      userId: "user-1",
    });
    expect(order.items).toEqual([
      expect.objectContaining({
        lineTotalNgnSnapshot: 184000,
        productTitleSnapshot: "Product Image Sample",
        quantity: 2,
      }),
    ]);
  });
});
