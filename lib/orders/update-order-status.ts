import type { OrderStatus } from "@/lib/domain/types";

type UpdateOrderStatusInput = {
  actorId: string;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
  orderId: string;
};

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  cancelled: [],
  confirmed: ["processing", "cancelled"],
  delivered: [],
  pending: ["confirmed", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
};

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  if (!allowedTransitions[input.currentStatus].includes(input.nextStatus)) {
    throw new Error(`Cannot transition order from ${input.currentStatus} to ${input.nextStatus}.`);
  }

  return {
    auditEvent: {
      actorId: input.actorId,
      note: null,
      orderId: input.orderId,
      status: input.nextStatus,
    },
    orderId: input.orderId,
    status: input.nextStatus,
  };
}
