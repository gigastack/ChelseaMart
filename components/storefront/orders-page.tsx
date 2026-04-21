import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatMoney } from "@/lib/currency/format";
import type { OrderRecord } from "@/lib/orders/repository";
import { cn } from "@/lib/utils";

type OrdersPageProps = {
  orders: OrderRecord[];
};

const customerStatusLabels: Record<OrderRecord["status"], string> = {
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

function getNextAction(order: OrderRecord) {
  if (order.shippingPaymentState === "pending" && order.shippingCostNgn !== null) {
    return "Pay shipping";
  }

  if (["shipping_paid", "in_transit", "arrived_destination", "out_for_delivery"].includes(order.status)) {
    return "Track delivery";
  }

  if (order.status === "delivered") {
    return "Delivered";
  }

  if (["awaiting_warehouse", "arrived_at_warehouse", "weighed"].includes(order.status)) {
    return "Waiting on warehouse";
  }

  if (order.status === "cancelled") {
    return "Closed";
  }

  return "View details";
}

export function OrdersPage({ orders }: OrdersPageProps) {
  const awaitingShipping = orders.filter((order) => order.status === "awaiting_shipping_payment").length;
  const inTransit = orders.filter((order) =>
    ["shipping_paid", "in_transit", "arrived_destination", "out_for_delivery"].includes(order.status),
  ).length;
  const delivered = orders.filter((order) => order.status === "delivered").length;

  return (
    <main className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Orders</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Follow every order from product payment to delivery.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              See what has been paid, what is waiting on the warehouse, and what still needs your action.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping due</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{awaitingShipping}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">In progress</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{inTransit}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Delivered</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{delivered}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const latestEvent = order.statusEvents.at(-1);

          return (
            <article
              key={order.id}
              className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5 shadow-[0_16px_45px_rgba(4,47,46,0.04)] transition-shadow hover:shadow-[0_24px_60px_rgba(4,47,46,0.08)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{order.createdLabel}</p>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{order.id}</h2>
                  <p className="text-sm uppercase tracking-[0.16em] text-[rgb(var(--brand-600))]">
                    {order.routeSnapshot
                      ? `${order.routeSnapshot.originLabel} to ${order.routeSnapshot.destinationLabel}`
                      : order.route ?? "Route pending"}
                  </p>
                </div>

                <div className="grid gap-2 text-sm lg:text-right">
                  <p className="font-semibold uppercase tracking-[0.14em] text-[rgb(var(--text-primary))]">
                    {customerStatusLabels[order.status]}
                  </p>
                  <p className="text-[rgb(var(--text-secondary))]">{getNextAction(order)}</p>
                </div>
              </div>

              <div className="grid gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 md:grid-cols-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Product payment</p>
                  <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">
                    {formatMoney(order.productPaymentTotalNgn, "NGN")}
                  </p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">{formatMoney(order.productSubtotalCny, "CNY")} reference</p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping</p>
                  <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">
                    {order.shippingCostUsd === null ? "Not ready yet" : formatMoney(order.shippingCostUsd, "USD")}
                  </p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    {order.shippingPaymentState === "paid"
                      ? "Shipping paid"
                      : order.shippingPaymentState === "pending"
                        ? "Waiting for payment"
                        : "Will open later"}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Last update</p>
                  <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">
                    {latestEvent ? customerStatusLabels[latestEvent.status] : customerStatusLabels[order.status]}
                  </p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    {latestEvent ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(latestEvent.createdAt)) : order.createdLabel}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Next action</p>
                    <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"} in this order.
                    </p>
                  </div>
                  <Link
                    className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "w-full justify-center")}
                    href={`/account/orders/${order.id}`}
                  >
                    View order details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
