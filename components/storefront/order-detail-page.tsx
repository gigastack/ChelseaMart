import { notFound } from "next/navigation";
import { startShippingPaymentAction } from "@/app/(storefront)/account/orders/actions";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/currency/format";
import type { ConsigneeRecord, OrderRecord } from "@/lib/orders/repository";

type OrderDetailPageProps = {
  consignee: ConsigneeRecord | null;
  order: OrderRecord | null;
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function formatShipmentMeasurement(order: OrderRecord) {
  if (!order.shipment?.measurementBasis) {
    return "Waiting for warehouse measurement";
  }

  if (order.shipment.measurementBasis === "volume_cbm") {
    return `${order.shipment.measuredVolumeCbm ?? 0} CBM`;
  }

  return `${order.shipment.measuredWeightKg ?? 0} KG`;
}

export function OrderDetailPage({ consignee, order }: OrderDetailPageProps) {
  if (!order) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <div className="space-y-3">
        <Badge>Service record</Badge>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">{order.id}</h1>
          <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
            This order keeps both payment phases visible: product value stays referenced in CNY, Paystack settlement
            stays in NGN, and the logistics invoice stays in USD until the second payment is requested.
          </p>
        </div>
      </div>

      <OrderStatusTimeline currentStatus={order.status} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]">
        <div className="grid gap-6">
          <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
            <CardHeader>
              <CardDescription>Product payment ledger</CardDescription>
              <CardTitle>{formatMoney(order.productPaymentTotalNgn, "NGN")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 border-t border-[rgb(var(--border-subtle))] pt-4 text-sm text-[rgb(var(--text-secondary))]">
                <p>Product payment: {formatStatusLabel(order.productPaymentState)}</p>
                <p>Shipping payment: {formatStatusLabel(order.shippingPaymentState)}</p>
                <p>Product subtotal: {formatMoney(order.productSubtotalCny, "CNY")}</p>
                <p>CNY to NGN rate: {order.productPaymentCnyToNgnRate.toLocaleString("en-NG")}</p>
              </div>
              <div className="space-y-2 border-t border-[rgb(var(--border-subtle))] pt-4 text-sm text-[rgb(var(--text-secondary))]">
                <p>NGN product subtotal: {formatMoney(order.productSubtotalNgn, "NGN")}</p>
                <p>Marketplace service fee: {formatMoney(order.serviceFeeNgn, "NGN")}</p>
                <p>Product payment settled: {formatMoney(order.productPaymentTotalNgn, "NGN")}</p>
                <p>Combined order total: {formatMoney(order.grandTotalNgn, "NGN")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Ordered items</CardDescription>
              <CardTitle>{order.items.length} line item{order.items.length === 1 ? "" : "s"}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 border-t border-[rgb(var(--border-subtle))] pt-4 text-sm text-[rgb(var(--text-secondary))] md:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-[rgb(var(--text-primary))]">{item.title}</p>
                    <p>
                      Qty {item.quantity} · MOQ {item.effectiveMoq}
                    </p>
                    <p>
                      Unit price {formatMoney(item.sellPriceCny, "CNY")} reference / {formatMoney(item.sellPriceNgn, "NGN")} payable
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-semibold text-[rgb(var(--text-primary))]">
                      {formatMoney(item.sellPriceCny * item.quantity, "CNY")}
                    </p>
                    <p>{formatMoney(item.sellPriceNgn * item.quantity, "NGN")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Route acceptance</CardDescription>
              <CardTitle>
                {order.routeSnapshot
                  ? `${order.routeSnapshot.originLabel} to ${order.routeSnapshot.destinationLabel}`
                  : order.route?.toUpperCase() ?? "Route pending"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-[rgb(var(--text-secondary))] md:grid-cols-2">
              <div className="space-y-2 border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="font-semibold text-[rgb(var(--text-primary))]">Accepted formula</p>
                <p>{order.routeSnapshot?.formulaLabel ?? "Route formula pending."}</p>
                <p>
                  ETA: {order.routeSnapshot?.etaDaysMin ?? "?"}-{order.routeSnapshot?.etaDaysMax ?? "?"} days
                </p>
              </div>
              <div className="space-y-2 border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="font-semibold text-[rgb(var(--text-primary))]">Terms carried into order</p>
                <p>{order.routeSnapshot?.termsSummary ?? "Shipping is invoiced after warehouse measurement."}</p>
                <p className="uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">
                  Mode {order.routeSnapshot?.mode ?? order.route ?? "pending"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--brand-950),0.98)_0%,rgba(var(--brand-800),0.9)_100%)] text-[rgb(var(--surface-card))]">
            <CardHeader>
              <CardDescription className="text-[rgba(255,255,255,0.72)]">Logistics invoice</CardDescription>
              <CardTitle className="text-[rgb(var(--surface-card))]">
                {order.shippingCostUsd === null ? "Awaiting warehouse proof" : formatMoney(order.shippingCostUsd, "USD")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[rgba(255,255,255,0.82)]">
              <p>
                {order.shippingCostUsd === null
                  ? "The warehouse has not finished measurement yet, so no USD logistics invoice is available."
                  : `Once paid, this invoice settles in Naira as ${formatMoney(order.shippingCostNgn ?? 0, "NGN")}.`}
              </p>
              <p>
                Warehouse measurement: <span className="font-semibold text-[rgb(var(--surface-card))]">{formatShipmentMeasurement(order)}</span>
              </p>
              <p>Customer notified: {order.shipment?.customerNotifiedAt ?? "Not yet"}</p>
              {order.shippingPaymentState === "pending" && order.shippingCostNgn !== null ? (
                <form action={startShippingPaymentAction} className="pt-3">
                  <input name="orderId" type="hidden" value={order.id} />
                  <Button className="w-full bg-[rgb(var(--surface-card))] text-[rgb(var(--brand-950))] hover:bg-[rgba(255,255,255,0.92)]" type="submit">
                    Pay shipping in NGN
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Warehouse evidence</CardDescription>
              <CardTitle>{formatShipmentMeasurement(order)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[rgb(var(--text-secondary))]">
              <p>Measured at: {order.shipment?.measuredAt ?? "Awaiting warehouse confirmation"}</p>
              <p>Proof type: {order.shipment?.weighingProofMimeType ?? "Not available yet"}</p>
              <p>
                Proof of weighing:{" "}
                {order.shipment?.weighingProofPath ? (
                  <a
                    className="font-medium text-[rgb(var(--brand-600))] underline-offset-4 hover:underline"
                    href={order.shipment.weighingProofPath}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View uploaded proof
                  </a>
                ) : (
                  "Pending upload"
                )}
              </p>
              <p>
                Settlement posture:{" "}
                {order.shippingCostUsd === null
                  ? "No invoice yet."
                  : `${formatMoney(order.shippingCostUsd, "USD")} invoiced / ${formatMoney(order.shippingCostNgn ?? 0, "NGN")} payable`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Consignee</CardDescription>
              <CardTitle>{consignee?.fullName ?? "Consignee pending"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
              <p>{consignee?.cityOrState}</p>
              <p>{consignee?.phone}</p>
              <p>{consignee?.notes}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
