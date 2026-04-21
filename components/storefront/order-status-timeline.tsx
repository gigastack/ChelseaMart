import type { OrderStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const phases = [
  {
    key: "route",
    label: "Route locked",
    statuses: ["route_selected"] as OrderStatus[],
  },
  {
    key: "product",
    label: "Products paid",
    statuses: ["paid_for_products", "awaiting_warehouse"] as OrderStatus[],
  },
  {
    key: "warehouse",
    label: "Warehouse proof",
    statuses: ["arrived_at_warehouse", "weighed", "awaiting_shipping_payment"] as OrderStatus[],
  },
  {
    key: "shipping",
    label: "Shipping settled",
    statuses: ["shipping_paid"] as OrderStatus[],
  },
  {
    key: "delivery",
    label: "Delivery run",
    statuses: ["in_transit", "arrived_destination", "out_for_delivery", "delivered"] as OrderStatus[],
  },
];

function formatStatusLabel(status: OrderStatus) {
  return status.replaceAll("_", " ");
}

type OrderStatusTimelineProps = {
  currentStatus: OrderStatus;
};

export function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  if (currentStatus === "cancelled") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[rgba(var(--danger),0.25)] bg-[rgba(var(--danger),0.08)] px-5 py-4 text-sm text-[rgb(var(--danger))]">
        This order has been cancelled.
      </div>
    );
  }

  const currentPhaseIndex = phases.findIndex((phase) => phase.statuses.includes(currentStatus));

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {phases.map((phase, index) => {
        const isComplete = currentPhaseIndex > index;
        const isCurrent = currentPhaseIndex === index;

        return (
          <section
            key={phase.key}
            className={cn(
              "grid gap-3 rounded-[var(--radius-lg)] border px-4 py-4",
              isCurrent
                ? "border-[rgb(var(--brand-600))] bg-[rgba(var(--brand-500),0.08)]"
                : isComplete
                  ? "border-[rgba(var(--border-strong),0.65)] bg-[rgb(var(--surface-card))]"
                  : "border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))]",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                Phase {index + 1}
              </p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
                  isCurrent
                    ? "bg-[rgb(var(--brand-600))] text-white"
                    : isComplete
                      ? "bg-[rgb(var(--surface-alt))] text-[rgb(var(--text-primary))]"
                      : "bg-[rgb(var(--surface-alt))] text-[rgb(var(--text-muted))]",
                )}
              >
                {isCurrent ? "Current" : isComplete ? "Complete" : "Pending"}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">{phase.label}</h2>
              <div className="flex flex-wrap gap-2">
                {phase.statuses.map((status) => (
                  <span
                    key={status}
                    className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-2.5 py-1 text-[0.68rem] font-medium capitalize text-[rgb(var(--text-secondary))]"
                  >
                    {formatStatusLabel(status)}
                  </span>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
