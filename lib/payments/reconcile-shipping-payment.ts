import {
  findOrderByShippingPaymentReference,
  recordPaystackEvent,
  updateShippingPaymentState,
} from "@/lib/orders/repository";

type ReconcileShippingPaystackPaymentInput = {
  eventType: string;
  note: string;
  payload: Record<string, unknown>;
  paymentReference: string;
  transactionStatus: string;
};

function deriveShippingPaymentState(transactionStatus: string) {
  switch (transactionStatus) {
    case "success":
      return {
        paymentState: "paid" as const,
        status: "in_transit" as const,
      };
    case "abandoned":
    case "failed":
      return {
        paymentState: "failed" as const,
        status: "awaiting_shipping_payment" as const,
      };
    default:
      return {
        paymentState: "pending" as const,
        status: "awaiting_shipping_payment" as const,
      };
  }
}

export async function reconcileShippingPaystackPayment(input: ReconcileShippingPaystackPaymentInput) {
  const payment = await findOrderByShippingPaymentReference(input.paymentReference);

  if (!payment) {
    return {
      orderId: null,
      state: "missing-order" as const,
    };
  }

  const nextState = deriveShippingPaymentState(input.transactionStatus);
  const dedupeKey = `${input.eventType}:${input.paymentReference}:shipping:${nextState.paymentState}`;

  await recordPaystackEvent({
    dedupeKey,
    eventType: input.eventType,
    orderId: payment.orderId,
    payload: input.payload,
    paymentReference: input.paymentReference,
  });

  await updateShippingPaymentState({
    note: input.note,
    orderId: payment.orderId,
    paymentId: payment.paymentId,
    paymentState: nextState.paymentState,
    status: nextState.status,
  });

  return {
    orderId: payment.orderId,
    state: nextState.paymentState,
  };
}
