import { beforeEach, describe, expect, it, vi } from "vitest";

const findOrderByProductPaymentReferenceMock = vi.fn();
const findOrderByShippingPaymentReferenceMock = vi.fn();
const recordPaystackEventMock = vi.fn();
const updateProductPaymentStateMock = vi.fn();
const updateShippingPaymentStateMock = vi.fn();

vi.mock("@/lib/orders/repository", () => ({
  findOrderByProductPaymentReference: findOrderByProductPaymentReferenceMock,
  findOrderByShippingPaymentReference: findOrderByShippingPaymentReferenceMock,
  recordPaystackEvent: recordPaystackEventMock,
  updateProductPaymentState: updateProductPaymentStateMock,
  updateShippingPaymentState: updateShippingPaymentStateMock,
}));

describe("two-phase paystack reconciliation", () => {
  beforeEach(() => {
    vi.resetModules();
    findOrderByProductPaymentReferenceMock.mockReset();
    findOrderByShippingPaymentReferenceMock.mockReset();
    recordPaystackEventMock.mockReset();
    updateProductPaymentStateMock.mockReset();
    updateShippingPaymentStateMock.mockReset();
  });

  it("marks product payments as paid and moves orders into the warehouse queue", async () => {
    findOrderByProductPaymentReferenceMock.mockResolvedValue({
      id: "order-1",
      orderId: "order-1",
      paymentId: "product-payment-1",
    });

    const { reconcileProductPaystackPayment } = await import("@/lib/payments/reconcile-product-payment");

    const result = await reconcileProductPaystackPayment({
      eventType: "charge.success",
      note: "Product payment received.",
      payload: { event: "charge.success" },
      paymentReference: "prod-ref-1",
      transactionStatus: "success",
    });

    expect(result).toEqual({
      orderId: "order-1",
      state: "paid",
    });
    expect(updateProductPaymentStateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: "order-1",
        paymentId: "product-payment-1",
        paymentState: "paid",
        status: "awaiting_warehouse",
      }),
    );
  });

  it("marks shipping payments as paid and moves orders into transit", async () => {
    findOrderByShippingPaymentReferenceMock.mockResolvedValue({
      id: "order-1",
      orderId: "order-1",
      paymentId: "shipping-payment-1",
    });

    const { reconcileShippingPaystackPayment } = await import("@/lib/payments/reconcile-shipping-payment");

    const result = await reconcileShippingPaystackPayment({
      eventType: "charge.success",
      note: "Shipping payment received.",
      payload: { event: "charge.success" },
      paymentReference: "ship-ref-1",
      transactionStatus: "success",
    });

    expect(result).toEqual({
      orderId: "order-1",
      state: "paid",
    });
    expect(updateShippingPaymentStateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: "order-1",
        paymentId: "shipping-payment-1",
        paymentState: "paid",
        status: "in_transit",
      }),
    );
  });
});
