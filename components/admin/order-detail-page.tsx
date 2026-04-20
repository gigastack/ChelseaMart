import { notFound } from "next/navigation";
import { markOrderArrivedAtWarehouseAction, recordWarehouseMeasurementAction } from "@/app/(admin)/admin/orders/actions";
import { OrderStatusPanel } from "@/components/admin/order-status-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsigneeRecord, OrderRecord } from "@/lib/orders/repository";

type AdminOrderDetailPageProps = {
  consignee: ConsigneeRecord | null;
  order: OrderRecord | null;
};

function formatNgn(value: number) {
  return `NGN ${value.toLocaleString("en-NG")}`;
}

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function AdminOrderDetailPage({ consignee, order }: AdminOrderDetailPageProps) {
  if (!order) {
    notFound();
  }

  const measurementLabel = order.route === "sea" ? "Measured volume (CBM)" : "Measured weight (KG)";

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <Badge>Order detail</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{order.id}</h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardDescription>Consignee</CardDescription>
                <CardTitle>{consignee?.fullName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                <p>{consignee?.cityOrState}</p>
                <p>{consignee?.phone}</p>
                <p>{consignee?.notes}</p>
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
              <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                <p>{order.routeSnapshot?.formulaLabel ?? "Route formula pending."}</p>
                <p>
                  ETA: {order.routeSnapshot?.etaDaysMin ?? "?"}-{order.routeSnapshot?.etaDaysMax ?? "?"} days
                </p>
                <p>{order.routeSnapshot?.termsSummary ?? "Shipping is invoiced after warehouse measurement."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Payments and shipment</CardDescription>
                <CardTitle>{formatNgn(order.grandTotalNgn)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                <p>Product payment: {formatStatusLabel(order.productPaymentState)}</p>
                <p>Shipping payment: {formatStatusLabel(order.shippingPaymentState)}</p>
                <p>Shipping invoice: {order.shippingCostNgn === null ? "Pending measurement" : formatNgn(order.shippingCostNgn)}</p>
                <p>Measured shipment: {order.shipment?.measurementBasis ? formatStatusLabel(order.shipment.measurementBasis) : "Awaiting warehouse entry"}</p>
                <p>
                  Proof:{" "}
                  {order.shipment?.weighingProofPath ? (
                    <a
                      className="font-medium text-[rgb(var(--brand-600))] underline-offset-4 hover:underline"
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
              </CardContent>
            </Card>

            {order.status === "awaiting_warehouse" ? (
              <Card>
                <CardHeader>
                  <CardDescription>Warehouse arrival</CardDescription>
                  <CardTitle>Confirm items reached the warehouse</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={markOrderArrivedAtWarehouseAction}>
                    <input name="orderId" type="hidden" value={order.id} />
                    <Button type="submit">Mark arrived at warehouse</Button>
                  </form>
                </CardContent>
              </Card>
            ) : null}

            {order.status === "arrived_at_warehouse" ? (
              <Card>
                <CardHeader>
                  <CardDescription>Warehouse measurement</CardDescription>
                  <CardTitle>Record shipment size and proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={recordWarehouseMeasurementAction} className="grid gap-4">
                    <input name="orderId" type="hidden" value={order.id} />
                    <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                      {measurementLabel}
                      <input
                        className="min-h-11 rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-4 text-sm text-[rgb(var(--text-primary))]"
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
                        className="min-h-11 rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm text-[rgb(var(--text-primary))]"
                        name="proofFile"
                        required
                        type="file"
                      />
                    </label>
                    <Button type="submit">Generate shipping invoice</Button>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </div>
          <OrderStatusPanel orderId={order.id} status={order.status} />
        </div>
      </div>
    </main>
  );
}
