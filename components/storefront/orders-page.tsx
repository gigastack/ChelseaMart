import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/currency/format";
import type { OrderRecord } from "@/lib/orders/repository";

type OrdersPageProps = {
  orders: OrderRecord[];
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function OrdersPage({ orders }: OrdersPageProps) {
  const awaitingShipping = orders.filter((order) => order.status === "awaiting_shipping_payment").length;
  const inTransit = orders.filter((order) => order.status === "in_transit").length;
  const delivered = orders.filter((order) => order.status === "delivered").length;

  return (
    <main className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Service center</Badge>
          <div className="space-y-3">
            <h2 className="sr-only">Product receipts, warehouse proof, and logistics invoices</h2>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Product receipts, warehouse proof, shipping invoices, and delivery state in one service ledger.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Every order keeps the same two-phase shape: CNY product reference, NGN product settlement, warehouse proof,
              USD logistics invoice, then NGN shipping settlement after measurement exists.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Awaiting shipping payment</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{awaitingShipping}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">In transit</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{inTransit}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Delivered</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{delivered}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5 shadow-[0_16px_45px_rgba(4,47,46,0.04)]"
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

              <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))] lg:text-right">
                <p className="font-semibold uppercase tracking-[0.14em] text-[rgb(var(--text-primary))]">
                  {formatStatusLabel(order.status)}
                </p>
                <p>
                  Product payment {formatStatusLabel(order.productPaymentState)} · Shipping payment{" "}
                  {formatStatusLabel(order.shippingPaymentState)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 md:grid-cols-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Product payment</p>
                <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">
                  {formatMoney(order.productPaymentTotalNgn, "NGN")}
                </p>
                <p className="text-sm text-[rgb(var(--text-secondary))]">
                  {formatMoney(order.productSubtotalCny, "CNY")} at rate {order.productPaymentCnyToNgnRate.toLocaleString("en-NG")}
                </p>
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Logistics invoice</p>
                <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">
                  {order.shippingCostUsd === null ? "Pending" : formatMoney(order.shippingCostUsd, "USD")}
                </p>
                <p className="text-sm text-[rgb(var(--text-secondary))]">
                  {order.shippingCostNgn === null
                    ? "No shipping payment open yet."
                    : `${formatMoney(order.shippingCostNgn, "NGN")} payable`}
                </p>
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Warehouse proof</p>
                <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">
                  {order.shipment?.weighingProofPath ? "Proof uploaded" : "Awaiting proof"}
                </p>
                <p className="text-sm text-[rgb(var(--text-secondary))]">
                  {order.shipment?.measurementBasis
                    ? order.shipment.measurementBasis === "volume_cbm"
                      ? `${order.shipment.measuredVolumeCbm ?? 0} CBM measured`
                      : `${order.shipment.measuredWeightKg ?? 0} KG measured`
                    : "Warehouse measurement not recorded yet."}
                </p>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Service action</p>
                  <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} · open full record for proof and payment actions.
                  </p>
                </div>
                <Link
                  className="text-sm font-semibold text-[rgb(var(--brand-600))] underline-offset-4 hover:underline"
                  href={`/account/orders/${order.id}`}
                >
                  Open service record
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
