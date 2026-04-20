import type { OrderStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const statuses: OrderStatus[] = [
  "route_selected",
  "paid_for_products",
  "awaiting_warehouse",
  "arrived_at_warehouse",
  "weighed",
  "awaiting_shipping_payment",
  "shipping_paid",
  "in_transit",
  "arrived_destination",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

function formatStatusLabel(status: OrderStatus) {
  return status.replaceAll("_", " ");
}

type OrderStatusTimelineProps = {
  currentStatus: OrderStatus;
};

export function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const currentIndex = statuses.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
      {statuses.map((status, index) => {
        const isActive = isCancelled ? status === "cancelled" : index <= currentIndex;

        return (
          <div
            key={status}
            className={cn(
              "rounded-[var(--radius-md)] border px-4 py-3 text-sm font-medium capitalize",
              isActive
                ? "border-[rgb(var(--brand-600))] bg-[rgba(var(--brand-600),0.08)] text-[rgb(var(--text-primary))]"
                : "border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] text-[rgb(var(--text-secondary))]",
            )}
          >
            {formatStatusLabel(status)}
          </div>
        );
      })}
    </div>
  );
}
