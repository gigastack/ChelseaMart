import { describe, expect, it } from "vitest";
import { createRouteAcceptedOrder } from "@/lib/orders/create-order";

describe("createRouteAcceptedOrder", () => {
  it("creates a CNY-native order summary that only charges products and service fees", () => {
    const order = createRouteAcceptedOrder({
      cartItems: [
        {
          effectiveMoq: 3,
          productId: "prod-1",
          quantity: 3,
          sellPriceCny: 420,
          title: "Product Image Sample",
        },
      ],
      cnyToNgnRate: 220,
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
      productPaymentCnyToNgnRate: 220,
      productPaymentTotalNgn: 279700,
      productSubtotalCny: 1260,
      productSubtotalNgn: 277200,
      routeAccepted: true,
      serviceFeeNgn: 2500,
      shippingCostNgn: null,
      shippingPaymentState: "not_due",
      status: "route_selected",
      userId: "user-1",
    });
    expect(order.items).toEqual([
      expect.objectContaining({
        effectiveMoqSnapshot: 3,
        lineTotalCnySnapshot: 1260,
        lineTotalNgnSnapshot: 277200,
        productUnitPriceCnySnapshot: 420,
        productUnitPriceNgnSnapshot: 92400,
        productTitleSnapshot: "Product Image Sample",
        quantity: 3,
      }),
    ]);
  });

  it("rejects quantities below the effective MOQ", () => {
    expect(() =>
      createRouteAcceptedOrder({
        cartItems: [
          {
            effectiveMoq: 3,
            productId: "prod-1",
            quantity: 2,
            sellPriceCny: 420,
            title: "Product Image Sample",
          },
        ],
        cnyToNgnRate: 220,
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
        serviceFeeNgn: 0,
        userId: "user-1",
      }),
    ).toThrow(/MOQ/i);
  });
});
