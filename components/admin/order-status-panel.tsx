import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/lib/domain/types";

const nextStatusLabels: Record<OrderStatus, string[]> = {
  cancelled: [],
  confirmed: ["processing", "cancelled"],
  delivered: [],
  pending: ["confirmed", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
};

type OrderStatusPanelProps = {
  status: OrderStatus;
};

export function OrderStatusPanel({ status }: OrderStatusPanelProps) {
  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
      <div className="space-y-2">
        <Badge>Order status</Badge>
        <p className="text-2xl font-semibold capitalize text-[rgb(var(--text-primary))]">{status}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {nextStatusLabels[status].map((label) => (
          <Button key={label} size="sm" variant={label === "cancelled" ? "danger" : "secondary"}>
            Mark as {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
