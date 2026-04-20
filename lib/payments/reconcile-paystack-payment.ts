import { reconcileProductPaystackPayment } from "@/lib/payments/reconcile-product-payment";
import { reconcileShippingPaystackPayment } from "@/lib/payments/reconcile-shipping-payment";

type ReconcilePaystackPaymentInput = {
  eventType: string;
  note: string;
  payload: Record<string, unknown>;
  paymentReference: string;
  transactionStatus: string;
};

export async function reconcilePaystackPayment(input: ReconcilePaystackPaymentInput) {
  const productResult = await reconcileProductPaystackPayment(input);

  if (productResult.state !== "missing-order") {
    return {
      ...productResult,
      phase: "product" as const,
    };
  }

  const shippingResult = await reconcileShippingPaystackPayment(input);

  if (shippingResult.state !== "missing-order") {
    return {
      ...shippingResult,
      phase: "shipping" as const,
    };
  }

  return {
    orderId: null,
    phase: null,
    state: "missing-order" as const,
  };
}
