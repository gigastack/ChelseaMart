import { notFound } from "next/navigation";
import { startShippingPaymentAction } from "@/app/(storefront)/account/orders/actions";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/currency/format";
import type { ConsigneeRecord, OrderRecord } from "@/lib/orders/repository";

type OrderDetailPageProps = {
  consignee: ConsigneeRecord | null;
  order: OrderRecord | null;
};

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
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
        <div className="space-y-3">
          <Badge>Service record</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              {order.id}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              This order keeps both payment phases visible: product value referenced in CNY, first settlement completed
              in NGN, logistics invoice shown in USD, and the second payment opened only after warehouse evidence exists.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Product payment</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {formatMoney(order.productPaymentTotalNgn, "NGN")}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping invoice</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {order.shippingCostUsd === null ? "Pending" : formatMoney(order.shippingCostUsd, "USD")}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Warehouse proof</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {order.shipment?.weighingProofPath ? "Available" : "Pending"}
            </p>
          </div>
        </div>
      </div>

      <OrderStatusTimeline currentStatus={order.status} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
        <div className="grid gap-6">
          <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Product payment ledger</p>
                <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                  <p>Product payment: {order.productPaymentState.replaceAll("_", " ")}</p>
                  <p>Shipping payment: {order.shippingPaymentState.replaceAll("_", " ")}</p>
                  <p>Product subtotal: {formatMoney(order.productSubtotalCny, "CNY")}</p>
                  <p>CNY to NGN rate: {order.productPaymentCnyToNgnRate.toLocaleString("en-NG")}</p>
                </div>
              </div>
              <div className="grid gap-2 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] p-4 text-sm text-[rgb(var(--text-secondary))]">
                <p className="font-semibold text-[rgb(var(--text-primary))]">NGN settlement snapshot</p>
                <p>NGN product subtotal: {formatMoney(order.productSubtotalNgn, "NGN")}</p>
                <p>Marketplace service fee: {formatMoney(order.serviceFeeNgn, "NGN")}</p>
                <p>Product payment settled: {formatMoney(order.productPaymentTotalNgn, "NGN")}</p>
                <p>Combined order total: {formatMoney(order.grandTotalNgn, "NGN")}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Ordered items</p>
              <div className="grid gap-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 md:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div className="space-y-2">
                      <p className="text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">{item.title}</p>
                      <div className="flex flex-wrap gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">
                        <span className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-3 py-1">Qty {item.quantity}</span>
                        <span className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-3 py-1">MOQ {item.effectiveMoq}</span>
                      </div>
                      <p className="text-sm text-[rgb(var(--text-secondary))]">
                        Unit reference {formatMoney(item.sellPriceCny, "CNY")} / {formatMoney(item.sellPriceNgn, "NGN")} payable
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-lg font-semibold text-[rgb(var(--text-primary))]">
                        {formatMoney(item.sellPriceCny * item.quantity, "CNY")}
                      </p>
                      <p className="text-sm text-[rgb(var(--text-secondary))]">{formatMoney(item.sellPriceNgn * item.quantity, "NGN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Route acceptance</p>
                <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                  {order.routeSnapshot
                    ? `${order.routeSnapshot.originLabel} to ${order.routeSnapshot.destinationLabel}`
                    : order.route?.toUpperCase() ?? "Route pending"}
                </p>
                <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                  <p>{order.routeSnapshot?.formulaLabel ?? "Route formula pending."}</p>
                  <p>
                    ETA: {order.routeSnapshot?.etaDaysMin ?? "?"}-{order.routeSnapshot?.etaDaysMax ?? "?"} days
                  </p>
                  <p>{order.routeSnapshot?.termsSummary ?? "Shipping is invoiced after warehouse measurement."}</p>
                </div>
              </div>

              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] p-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
                <p className="font-semibold text-[rgb(var(--text-primary))]">Consignee</p>
                <div className="mt-3 space-y-2">
                  <p>{consignee?.fullName ?? "Consignee pending"}</p>
                  <p>{consignee?.cityOrState}</p>
                  <p>{consignee?.phone}</p>
                  <p>{consignee?.notes}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6">
          <section
            className="rounded-[var(--radius-lg)] p-6 text-[rgb(var(--surface-card))] shadow-[0_24px_70px_rgba(4,47,46,0.14)]"
            style={{
              backgroundColor: "rgb(var(--brand-950))",
              backgroundImage:
                "linear-gradient(180deg, rgba(4, 47, 46, 1) 0%, rgba(11, 87, 82, 0.92) 100%)",
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">Logistics invoice</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                  {order.shippingCostUsd === null ? "Awaiting warehouse proof" : formatMoney(order.shippingCostUsd, "USD")}
                </h2>
              </div>
              <div className="grid gap-2 text-sm text-[rgba(255,255,255,0.82)]">
                <p>
                  {order.shippingCostUsd === null
                    ? "The warehouse has not finished measurement yet, so no USD logistics invoice is available."
                    : `Once paid, this invoice settles in Naira as ${formatMoney(order.shippingCostNgn ?? 0, "NGN")}.`}
                </p>
                <p>Warehouse measurement: {formatShipmentMeasurement(order)}</p>
                <p>Customer notified: {order.shipment?.customerNotifiedAt ?? "Not yet"}</p>
              </div>

              {order.shippingPaymentState === "pending" && order.shippingCostNgn !== null ? (
                <form action={startShippingPaymentAction} className="pt-2">
                  <input name="orderId" type="hidden" value={order.id} />
                  <Button
                    className="w-full bg-[rgb(var(--surface-card))] text-[rgb(var(--brand-950))] hover:bg-[rgba(255,255,255,0.92)]"
                    size="lg"
                    type="submit"
                  >
                    Pay shipping in NGN
                  </Button>
                </form>
              ) : null}
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Warehouse evidence</p>
              <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                {formatShipmentMeasurement(order)}
              </p>
              <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                <p>Measured at: {order.shipment?.measuredAt ?? "Awaiting warehouse confirmation"}</p>
                <p>Proof type: {order.shipment?.weighingProofMimeType ?? "Not available yet"}</p>
                <p>
                  Proof of weighing:{" "}
                  {order.shipment?.weighingProofPath ? (
                    <a
                      className="font-semibold text-[rgb(var(--brand-600))] underline-offset-4 hover:underline"
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
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
