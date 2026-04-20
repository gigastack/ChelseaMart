import type { OrderStatus } from "@/lib/domain/types";

type UpdateOrderStatusInput = {
  actorId: string;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
  orderId: string;
};

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  arrived_at_warehouse: ["weighed", "awaiting_shipping_payment", "cancelled"],
  arrived_destination: ["out_for_delivery", "cancelled"],
  awaiting_shipping_payment: ["shipping_paid", "cancelled"],
  awaiting_warehouse: ["arrived_at_warehouse", "cancelled"],
  cancelled: [],
  cart: ["route_selected", "cancelled"],
  delivered: [],
  in_transit: ["arrived_destination", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  paid_for_products: ["awaiting_warehouse", "cancelled"],
  route_selected: ["paid_for_products", "awaiting_warehouse", "cancelled"],
  shipping_paid: ["in_transit", "cancelled"],
  weighed: ["awaiting_shipping_payment", "cancelled"],
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
