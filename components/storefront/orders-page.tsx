import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/currency/format";
import type { OrderRecord } from "@/lib/orders/repository";

type OrdersPageProps = {
  orders: OrderRecord[];
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function OrdersPage({ orders }: OrdersPageProps) {
  return (
    <main className="space-y-8">
      <div className="space-y-3">
        <Badge>Service center</Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
            Product receipts, warehouse proof, and logistics invoices
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
            Every order keeps the same ledger shape: product value referenced in CNY, product payment settled in NGN,
            logistics invoiced in USD, and shipment proof surfaced before the second payment is requested.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
            <CardHeader className="border-b border-[rgb(var(--border-subtle))]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <CardDescription>{order.createdLabel}</CardDescription>
                  <CardTitle>{order.id}</CardTitle>
                  <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                    {order.routeSnapshot
                      ? `${order.routeSnapshot.originLabel} to ${order.routeSnapshot.destinationLabel}`
                      : order.route ?? "Route pending"}
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))] lg:text-right">
                  <p className="uppercase tracking-[0.14em]">{formatStatusLabel(order.status)}</p>
                  <p>
                    Product payment {formatStatusLabel(order.productPaymentState)} · Shipping payment{" "}
                    {formatStatusLabel(order.shippingPaymentState)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 border-t border-[rgb(var(--border-subtle))] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                    Product payment
                  </p>
                  <p className="text-xl font-semibold text-[rgb(var(--text-primary))]">
                    {formatMoney(order.productPaymentTotalNgn, "NGN")}
                  </p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    {formatMoney(order.productSubtotalCny, "CNY")} referenced at rate{" "}
                    {order.productPaymentCnyToNgnRate.toLocaleString("en-NG")}
                  </p>
                </div>
                <div className="space-y-2 border-t border-[rgb(var(--border-subtle))] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                    Logistics invoice
                  </p>
                  <p className="text-xl font-semibold text-[rgb(var(--text-primary))]">
                    {order.shippingCostUsd === null ? "Pending warehouse proof" : formatMoney(order.shippingCostUsd, "USD")}
                  </p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    {order.shippingCostNgn === null
                      ? "NGN settlement opens after measurement."
                      : `${formatMoney(order.shippingCostNgn, "NGN")} payable in Naira`}
                  </p>
                </div>
                <div className="space-y-2 border-t border-[rgb(var(--border-subtle))] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                    Warehouse signal
                  </p>
                  <p className="text-xl font-semibold text-[rgb(var(--text-primary))]">
                    {order.shipment?.weighingProofPath ? "Proof uploaded" : "Awaiting proof"}
                  </p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    {order.shipment?.measurementBasis
                      ? `Measured ${order.shipment.measurementBasis === "volume_cbm" ? `${order.shipment.measuredVolumeCbm ?? 0} CBM` : `${order.shipment.measuredWeightKg ?? 0} KG`}`
                      : "Warehouse measurement not recorded yet."}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
                <Link
                  className="text-sm font-medium text-[rgb(var(--brand-600))] underline-offset-4 hover:underline"
                  href={`/account/orders/${order.id}`}
                >
                  Open service record
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
