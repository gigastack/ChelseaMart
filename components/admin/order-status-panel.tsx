import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/app/(admin)/admin/orders/actions";
import type { OrderStatus } from "@/lib/domain/types";

const nextStatusLabels: Record<OrderStatus, string[]> = {
  arrived_at_warehouse: [],
  arrived_destination: ["out_for_delivery", "cancelled"],
  awaiting_shipping_payment: [],
  awaiting_warehouse: ["arrived_at_warehouse", "cancelled"],
  cancelled: [],
  cart: [],
  delivered: [],
  in_transit: ["arrived_destination", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  paid_for_products: ["awaiting_warehouse", "cancelled"],
  route_selected: ["cancelled"],
  shipping_paid: ["in_transit", "cancelled"],
  weighed: [],
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

type OrderStatusPanelProps = {
  orderId: string;
  status: OrderStatus;
};

export function OrderStatusPanel({ orderId, status }: OrderStatusPanelProps) {
  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
      <div className="space-y-2">
        <Badge>Order status</Badge>
        <p className="text-2xl font-semibold capitalize text-[rgb(var(--text-primary))]">{formatStatusLabel(status)}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {nextStatusLabels[status].map((label) => (
          <form action={updateOrderStatusAction} key={label}>
            <input name="orderId" type="hidden" value={orderId} />
            <input name="status" type="hidden" value={label} />
            <Button size="sm" type="submit" variant={label === "cancelled" ? "danger" : "secondary"}>
              Mark as {formatStatusLabel(label)}
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
