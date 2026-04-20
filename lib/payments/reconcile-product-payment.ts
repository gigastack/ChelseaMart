import {
  findOrderByProductPaymentReference,
  recordPaystackEvent,
  updateProductPaymentState,
} from "@/lib/orders/repository";

type ReconcileProductPaystackPaymentInput = {
  eventType: string;
  note: string;
  payload: Record<string, unknown>;
  paymentReference: string;
  transactionStatus: string;
};

function deriveProductPaymentState(transactionStatus: string) {
  switch (transactionStatus) {
    case "success":
      return {
        paymentState: "paid" as const,
        status: "awaiting_warehouse" as const,
      };
    case "abandoned":
    case "failed":
      return {
        paymentState: "failed" as const,
        status: "cancelled" as const,
      };
    default:
      return {
        paymentState: "pending" as const,
        status: "route_selected" as const,
      };
  }
}

export async function reconcileProductPaystackPayment(input: ReconcileProductPaystackPaymentInput) {
  const payment = await findOrderByProductPaymentReference(input.paymentReference);

  if (!payment) {
    return {
      orderId: null,
      state: "missing-order" as const,
    };
  }

  const nextState = deriveProductPaymentState(input.transactionStatus);
  const dedupeKey = `${input.eventType}:${input.paymentReference}:product:${nextState.paymentState}`;

  await recordPaystackEvent({
    dedupeKey,
    eventType: input.eventType,
    orderId: payment.orderId,
    payload: input.payload,
    paymentReference: input.paymentReference,
  });

  await updateProductPaymentState({
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
