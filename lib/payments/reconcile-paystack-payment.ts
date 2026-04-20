import { findOrderByPaymentReference, recordPaystackEvent, updateOrderPaymentState } from "@/lib/orders/repository";

type ReconcilePaystackPaymentInput = {
  eventType: string;
  note: string;
  payload: Record<string, unknown>;
  paymentReference: string;
  transactionStatus: string;
};

function deriveOrderStatus(transactionStatus: string) {
  switch (transactionStatus) {
    case "success":
      return {
        orderStatus: "confirmed" as const,
        paymentStatus: "paid" as const,
      };
    case "abandoned":
    case "failed":
      return {
        orderStatus: "cancelled" as const,
        paymentStatus: "failed" as const,
      };
    default:
      return {
        orderStatus: "pending" as const,
        paymentStatus: "pending" as const,
      };
  }
}

export async function reconcilePaystackPayment(input: ReconcilePaystackPaymentInput) {
  const order = await findOrderByPaymentReference(input.paymentReference);

  if (!order) {
    return {
      orderId: null,
      state: "missing-order" as const,
    };
  }

  const nextState = deriveOrderStatus(input.transactionStatus);
  const dedupeKey = `${input.eventType}:${input.paymentReference}:${nextState.paymentStatus}`;

  await recordPaystackEvent({
    dedupeKey,
    eventType: input.eventType,
    orderId: order.id,
    payload: input.payload,
    paymentReference: input.paymentReference,
  });

  await updateOrderPaymentState({
    note: input.note,
    orderId: order.id,
    paymentStatus: nextState.paymentStatus,
    status: nextState.orderStatus,
  });

  return {
    orderId: order.id,
    state: nextState.paymentStatus,
  };
}
