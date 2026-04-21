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
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Order details</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              {order.id}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Track the current status, pay shipping when it opens, and review the proof uploaded by the warehouse.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Current status</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {customerStatusLabels[order.status]}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Product payment</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {formatMoney(order.productPaymentTotalNgn, "NGN")}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping invoice</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {order.shippingCostUsd === null ? "Waiting" : formatMoney(order.shippingCostUsd, "USD")}
            </p>
          </div>
        </div>
      </div>

      <OrderStatusTimeline currentStatus={order.status} statusEvents={order.statusEvents} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
        <div className="grid gap-6">
          <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Items</p>
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

          <details className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <summary className="cursor-pointer list-none text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              Payment details
            </summary>
            <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--text-secondary))]">
              <div className="flex items-center justify-between gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-3">
                <span>Product subtotal</span>
                <span className="font-medium text-[rgb(var(--text-primary))]">{formatMoney(order.productSubtotalCny, "CNY")}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-3">
                <span>CNY to NGN rate</span>
                <span className="font-medium text-[rgb(var(--text-primary))]">{order.productPaymentCnyToNgnRate.toLocaleString("en-NG")}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-3">
                <span>Product payment</span>
                <span className="font-medium text-[rgb(var(--text-primary))]">{formatMoney(order.productPaymentTotalNgn, "NGN")}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-3">
                <span>Shipping payable</span>
                <span className="font-medium text-[rgb(var(--text-primary))]">
                  {order.shippingCostNgn === null ? "Not open yet" : formatMoney(order.shippingCostNgn, "NGN")}
                </span>
              </div>
            </div>
          </details>

          <details className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <summary className="cursor-pointer list-none text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              Route and consignee
            </summary>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                <p className="font-semibold text-[rgb(var(--text-primary))]">Route</p>
                <p>
                  {order.routeSnapshot
                    ? `${order.routeSnapshot.originLabel} to ${order.routeSnapshot.destinationLabel}`
                    : order.route?.toUpperCase() ?? "Route pending"}
                </p>
                <p>{order.routeSnapshot?.formulaLabel ?? "Route formula pending."}</p>
                <p>
                  ETA: {order.routeSnapshot?.etaDaysMin ?? "?"}-{order.routeSnapshot?.etaDaysMax ?? "?"} days
                </p>
              </div>

              <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                <p className="font-semibold text-[rgb(var(--text-primary))]">Consignee</p>
                <p>{consignee?.fullName ?? "Consignee pending"}</p>
                <p>{consignee?.cityOrState}</p>
                <p>{consignee?.phone}</p>
                <p>{consignee?.notes}</p>
              </div>
            </div>
          </details>
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
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">Shipping action</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                  {order.shippingCostUsd === null ? "Waiting for warehouse proof" : formatMoney(order.shippingCostUsd, "USD")}
                </h2>
              </div>
              <div className="grid gap-2 text-sm text-[rgba(255,255,255,0.82)]">
                <p>
                  {order.shippingCostUsd === null
                    ? "The warehouse has not finished measurement yet."
                    : `Payable in Naira as ${formatMoney(order.shippingCostNgn ?? 0, "NGN")}.`}
                </p>
                <p>Shipment size: {formatShipmentMeasurement(order)}</p>
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
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Warehouse proof</p>
              <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                {formatShipmentMeasurement(order)}
              </p>
              <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                <p>Measured at: {order.shipment?.measuredAt ?? "Awaiting warehouse confirmation"}</p>
                <p>Proof type: {order.shipment?.weighingProofMimeType ?? "Not available yet"}</p>
                <p>
                  Proof file:{" "}
                  {order.shipment?.weighingProofPath ? (
                    <a
                      className="font-semibold text-[rgb(var(--brand-600))] underline-offset-4 hover:underline"
                      href={order.shipment.weighingProofPath}
                      rel="noreferrer"
                      target="_blank"
                    >
                      View proof
                    </a>
                  ) : (
                    "Pending upload"
                  )}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
