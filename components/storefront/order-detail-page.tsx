import { notFound } from "next/navigation";
import { startShippingPaymentAction } from "@/app/(storefront)/account/orders/actions";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsigneeRecord, OrderRecord } from "@/lib/orders/repository";

type OrderDetailPageProps = {
  consignee: ConsigneeRecord | null;
  order: OrderRecord | null;
};

function formatNgn(value: number) {
  return `NGN ${value.toLocaleString("en-NG")}`;
}

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
    <main className="space-y-6">
      <div className="space-y-2">
        <Badge>Order detail</Badge>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">{order.id}</h1>
      </div>

      <OrderStatusTimeline currentStatus={order.status} />

      <div className="grid gap-6 lg:grid-cols-2">
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
            <CardDescription>Payment summary</CardDescription>
            <CardTitle>{formatNgn(order.productPaymentTotalNgn)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
            <p>Product payment: {formatStatusLabel(order.productPaymentState)}</p>
            <p>Shipping payment: {formatStatusLabel(order.shippingPaymentState)}</p>
            <p>Product subtotal: {formatNgn(order.productSubtotalNgn)}</p>
            <p>Service fee: {formatNgn(order.serviceFeeNgn)}</p>
            <p>
              Shipping invoice: {order.shippingCostNgn === null ? "Pending warehouse measurement" : formatNgn(order.shippingCostNgn)}
            </p>
            <p>Combined total: {formatNgn(order.grandTotalNgn)}</p>
            {order.shippingPaymentState === "pending" && order.shippingCostNgn !== null ? (
              <form action={startShippingPaymentAction} className="pt-3">
                <input name="orderId" type="hidden" value={order.id} />
                <Button type="submit">Pay shipping now</Button>
              </form>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Warehouse shipment</CardDescription>
            <CardTitle>{formatShipmentMeasurement(order)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
            <p>Measured at: {order.shipment?.measuredAt ?? "Awaiting warehouse confirmation"}</p>
            <p>Customer notified: {order.shipment?.customerNotifiedAt ?? "Not yet"}</p>
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
            <p>Proof type: {order.shipment?.weighingProofMimeType ?? "Not available yet"}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
