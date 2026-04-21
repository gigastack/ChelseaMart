import { notFound } from "next/navigation";
import { markOrderArrivedAtWarehouseAction, recordWarehouseMeasurementAction } from "@/app/(admin)/admin/orders/actions";
import { OrderStatusPanel } from "@/components/admin/order-status-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/currency/format";
import type { ConsigneeRecord, OrderRecord } from "@/lib/orders/repository";

type AdminOrderDetailPageProps = {
  consignee: ConsigneeRecord | null;
  order: OrderRecord | null;
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function AdminOrderDetailPage({ consignee, order }: AdminOrderDetailPageProps) {
  if (!order) {
    notFound();
  }

  const measurementLabel = order.route === "sea" ? "Measured volume (CBM)" : "Measured weight (KG)";

  return (
    <section className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Order detail</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              {order.id}
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              This record keeps the full two-phase ledger in view: accepted route snapshot, CNY product reference, USD
              logistics invoice, proof asset, and the actions that move the order through warehouse and delivery.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Product payment</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {formatStatusLabel(order.productPaymentState)}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping payment</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {formatStatusLabel(order.shippingPaymentState)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
        <div className="grid gap-6">
          <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Settlement ledger</p>
                <p className="text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
                  {formatMoney(order.grandTotalNgn, "NGN")}
                </p>
                <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                  <p>Product subtotal: {formatMoney(order.productSubtotalCny, "CNY")}</p>
                  <p>Product settlement: {formatMoney(order.productPaymentTotalNgn, "NGN")}</p>
                  <p>Service fee: {formatMoney(order.serviceFeeNgn, "NGN")}</p>
                </div>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] p-4 text-sm text-[rgb(var(--text-secondary))]">
                <p className="font-semibold text-[rgb(var(--text-primary))]">Logistics invoice</p>
                <div className="mt-3 grid gap-2">
                  <p>
                    USD invoice:{" "}
                    {order.shippingCostUsd === null ? "Pending warehouse proof" : formatMoney(order.shippingCostUsd, "USD")}
                  </p>
                  <p>
                    NGN payable:{" "}
                    {order.shippingCostNgn === null ? "Pending invoice" : formatMoney(order.shippingCostNgn, "NGN")}
                  </p>
                  <p>
                    Measured shipment:{" "}
                    {order.shipment?.measurementBasis ? formatStatusLabel(order.shipment.measurementBasis) : "Awaiting warehouse entry"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Consignee</p>
              <div className="mt-4 grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                <p className="text-lg font-semibold text-[rgb(var(--text-primary))]">{consignee?.fullName}</p>
                <p>{consignee?.cityOrState}</p>
                <p>{consignee?.phone}</p>
                <p>{consignee?.notes}</p>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Route acceptance</p>
              <div className="mt-4 grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                <p className="text-lg font-semibold text-[rgb(var(--text-primary))]">
                  {order.routeSnapshot
                    ? `${order.routeSnapshot.originLabel} to ${order.routeSnapshot.destinationLabel}`
                    : order.route?.toUpperCase() ?? "Route pending"}
                </p>
                <p>{order.routeSnapshot?.formulaLabel ?? "Route formula pending."}</p>
                <p>
                  ETA: {order.routeSnapshot?.etaDaysMin ?? "?"}-{order.routeSnapshot?.etaDaysMax ?? "?"} days
                </p>
                <p>{order.routeSnapshot?.termsSummary ?? "Shipping is invoiced after warehouse measurement."}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Warehouse evidence</p>
            <div className="mt-4 grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
              <p>Proof status: {order.shipment?.weighingProofPath ? "Uploaded" : "Pending upload"}</p>
              <p>Measured at: {order.shipment?.measuredAt ?? "Awaiting warehouse confirmation"}</p>
              <p>Proof type: {order.shipment?.weighingProofMimeType ?? "Not available yet"}</p>
              <p>
                Proof asset:{" "}
                {order.shipment?.weighingProofPath ? (
                  <a
                    className="font-semibold text-[rgb(var(--brand-600))] underline-offset-4 hover:underline"
                    href={order.shipment.weighingProofPath}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View upload
                  </a>
                ) : (
                  "Pending upload"
                )}
              </p>
            </div>
          </section>

          {order.status === "awaiting_warehouse" ? (
            <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Warehouse arrival</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Confirm items reached the warehouse.</h2>
              <form action={markOrderArrivedAtWarehouseAction} className="mt-4">
                <input name="orderId" type="hidden" value={order.id} />
                <Button type="submit">Mark arrived at warehouse</Button>
              </form>
            </section>
          ) : null}

          {order.status === "arrived_at_warehouse" ? (
            <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Warehouse measurement</p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                  Record shipment size, proof, and invoice trigger.
                </h2>
              </div>
              <form action={recordWarehouseMeasurementAction} className="mt-4 grid gap-4">
                <input name="orderId" type="hidden" value={order.id} />
                <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                  {measurementLabel}
                  <input
                    className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 text-sm text-[rgb(var(--text-primary))]"
                    min="0.01"
                    name="measuredValue"
                    required
                    step="0.01"
                    type="number"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                  Proof of weighing
                  <input
                    accept="image/png,image/jpeg,video/mp4,application/pdf"
                    className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-3 text-sm text-[rgb(var(--text-primary))]"
                    name="proofFile"
                    required
                    type="file"
                  />
                </label>
                <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
                  Saving this form uploads proof, snapshots the warehouse measurement, and creates the USD logistics
                  invoice the customer will later settle in NGN.
                </p>
                <Button type="submit">Generate shipping invoice</Button>
              </form>
            </section>
          ) : null}
        </div>

        <OrderStatusPanel orderId={order.id} status={order.status} />
      </div>
    </section>
  );
}
