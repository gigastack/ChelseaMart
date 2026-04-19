import type { OrderStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

type OrderStatusTimelineProps = {
  currentStatus: OrderStatus;
};

export function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex || currentStatus === "cancelled";

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
            {status}
          </div>
        );
      })}
    </div>
  );
}
