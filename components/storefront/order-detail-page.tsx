import { notFound } from "next/navigation";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsigneeRecord, OrderRecord } from "@/lib/orders/repository";

type OrderDetailPageProps = {
  consignee: ConsigneeRecord | null;
  order: OrderRecord | null;
};

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
            <CardDescription>Payment summary</CardDescription>
            <CardTitle>NGN {order.grandTotalNgn.toLocaleString("en-NG")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
            <p className="uppercase">Route: {order.route}</p>
            <p>Receipt and invoice will mirror this breakdown when live data is connected.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
