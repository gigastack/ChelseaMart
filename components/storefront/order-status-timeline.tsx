import type { OrderStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

type OrderStatusTimelineEvent = {
  createdAt: string;
  id: string;
  note: string | null;
  orderId: string;
  status: OrderStatus;
};

const customerStatusLabels: Record<OrderStatus, string> = {
  arrived_at_warehouse: "At warehouse",
  arrived_destination: "Arrived at destination",
  awaiting_shipping_payment: "Shipping payment due",
  awaiting_warehouse: "Waiting for warehouse",
  cancelled: "Cancelled",
  cart: "Cart created",
  delivered: "Delivered",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  paid_for_products: "Products paid",
  route_selected: "Route confirmed",
  shipping_paid: "Shipping paid",
  weighed: "Shipment measured",
};

function formatTimelineDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Time pending";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

type OrderStatusTimelineProps = {
  currentStatus: OrderStatus;
  statusEvents: OrderStatusTimelineEvent[];
};

export function OrderStatusTimeline({ currentStatus, statusEvents }: OrderStatusTimelineProps) {
  const fallbackEvent: OrderStatusTimelineEvent = {
    createdAt: "",
    id: currentStatus,
    note: null,
    orderId: "",
    status: currentStatus,
  };
  const events = statusEvents.length > 0 ? statusEvents : [fallbackEvent];

  return (
    <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
      <div className="space-y-2">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Order timeline</p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Track what changed and what happens next.</h2>
      </div>

      <div className="mt-6 grid gap-4">
        {events.map((event, index) => {
          const isCurrent = event.status === currentStatus && index === events.length - 1;

          return (
            <article
              key={event.id}
              className={cn(
                "grid gap-3 rounded-[var(--radius-md)] border px-4 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center",
                isCurrent
                  ? "border-[rgba(var(--brand-600),0.45)] bg-[rgba(var(--brand-500),0.08)]"
                  : "border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))]",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-3 rounded-full",
                    isCurrent ? "bg-[rgb(var(--brand-600))]" : "bg-[rgba(var(--border-strong),0.9)]",
                  )}
                />
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[rgb(var(--text-muted))]">
                  Step {index + 1}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
                  {customerStatusLabels[event.status]}
                </p>
                <p className="text-sm text-[rgb(var(--text-secondary))]">{formatTimelineDate(event.createdAt)}</p>
              </div>

              <div className="md:text-right">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em]",
                    isCurrent
                      ? "bg-[rgb(var(--brand-600))] text-white"
                      : "bg-[rgb(var(--surface-alt))] text-[rgb(var(--text-secondary))]",
                  )}
                >
                  {isCurrent ? "Current" : "Done"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
