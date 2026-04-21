import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";
import { formatMoney } from "@/lib/currency/format";
import type { OrderRecord } from "@/lib/orders/repository";

type AdminOrdersPageProps = {
  orders: OrderRecord[];
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function AdminOrdersPage({ orders }: AdminOrdersPageProps) {
  const warehouseQueue = orders.filter((order) =>
    ["awaiting_warehouse", "arrived_at_warehouse", "weighed", "awaiting_shipping_payment"].includes(order.status),
  ).length;
  const shippingInvoicesDue = orders.filter(
    (order) => order.shippingPaymentState === "pending" && order.shippingCostUsd !== null,
  ).length;
  const paidShipping = orders.reduce(
    (sum, order) => sum + (order.shippingPaymentState === "paid" ? order.shippingCostNgn ?? 0 : 0),
    0,
  );

  const summaryCards = [
    {
      description: "Orders waiting for receipt, measurement, or invoice release.",
      title: "Warehouse queue",
      value: String(warehouseQueue),
    },
    {
      description: "USD logistics invoices already measured and waiting on customer payment.",
      title: "Invoices due",
      value: String(shippingInvoicesDue),
    },
    {
      description: "Paid product revenue already settled through the first Paystack flow.",
      title: "Product settlement",
      value: formatMoney(orders.reduce((sum, order) => sum + order.productPaymentTotalNgn, 0), "NGN"),
    },
    {
      description: "Shipping revenue recognized only after the second customer payment clears.",
      title: "Shipping settlement",
      value: formatMoney(paidShipping, "NGN"),
    },
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Orders</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Track warehouse, shipping, and delivery in one queue.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Review the current stage, what is waiting on the customer, and what the team needs to do next.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <Link
            className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm font-medium text-[rgb(var(--text-primary))] transition-colors hover:bg-[rgb(var(--surface-alt))]"
            href="/admin/settings"
          >
            Review settings
          </Link>
          <Link
            className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm font-medium text-[rgb(var(--text-primary))] transition-colors hover:bg-[rgb(var(--surface-alt))]"
            href="/admin/bi"
          >
            Open insights
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.title}
            className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{card.title}</p>
            <p className="text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{card.value}</p>
            <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))]">
        <div className="grid gap-2 border-b border-[rgba(var(--border-subtle),0.92)] px-6 py-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Order ledger</p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Review each order and open the next action.
            </h2>
          </div>

        <div className="px-6 py-5">
          <DataTable>
            <DataTableHeader>
              <DataTableRow>
                <DataTableHead>Order</DataTableHead>
                <DataTableHead>Status</DataTableHead>
                <DataTableHead>Route</DataTableHead>
                <DataTableHead>Product payment</DataTableHead>
                <DataTableHead>Logistics invoice</DataTableHead>
                <DataTableHead>Shipping payment</DataTableHead>
                <DataTableHead>Next step</DataTableHead>
                <DataTableHead>Created</DataTableHead>
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {orders.map((order) => (
                <DataTableRow key={order.id}>
                  <DataTableCell>
                    <Link className="font-medium text-[rgb(var(--text-primary))] underline-offset-4 hover:underline" href={`/admin/orders/${order.id}`}>
                      {order.id}
                    </Link>
                  </DataTableCell>
                  <DataTableCell>{formatStatusLabel(order.status)}</DataTableCell>
                  <DataTableCell className="uppercase">{order.routeSnapshot ? order.routeSnapshot.mode : order.route}</DataTableCell>
                  <DataTableCell>
                    <div>{formatStatusLabel(order.productPaymentState)}</div>
                    <div className="text-xs text-[rgb(var(--text-secondary))]">
                      {formatMoney(order.productSubtotalCny, "CNY")} / {formatMoney(order.productPaymentTotalNgn, "NGN")}
                    </div>
                  </DataTableCell>
                  <DataTableCell>
                    {order.shippingCostUsd === null ? (
                      <span className="text-[rgb(var(--text-secondary))]">Pending proof</span>
                    ) : (
                      <div>
                        <div>{formatMoney(order.shippingCostUsd, "USD")}</div>
                        <div className="text-xs text-[rgb(var(--text-secondary))]">{formatMoney(order.shippingCostNgn ?? 0, "NGN")}</div>
                      </div>
                    )}
                  </DataTableCell>
                  <DataTableCell>{formatStatusLabel(order.shippingPaymentState)}</DataTableCell>
                  <DataTableCell>
                    {order.status === "awaiting_warehouse"
                      ? "Confirm arrival"
                      : order.status === "arrived_at_warehouse"
                        ? "Record measurement"
                        : order.status === "awaiting_shipping_payment"
                          ? "Wait for payment"
                          : order.status === "shipping_paid"
                            ? "Start transit"
                            : order.status === "in_transit"
                              ? "Await destination arrival"
                              : order.status === "arrived_destination"
                                ? "Mark out for delivery"
                                : order.status === "out_for_delivery"
                                  ? "Mark delivered"
                                  : "Review details"}
                  </DataTableCell>
                  <DataTableCell>{order.createdLabel}</DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </div>
      </section>
    </section>
  );
}
