import { notFound } from "next/navigation";
import { OrderStatusPanel } from "@/components/admin/order-status-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsigneeRecord, OrderRecord } from "@/lib/orders/repository";

type AdminOrderDetailPageProps = {
  consignee: ConsigneeRecord | null;
  order: OrderRecord | null;
};

export function AdminOrderDetailPage({ consignee, order }: AdminOrderDetailPageProps) {
  if (!order) {
    notFound();
  }

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
                <CardDescription>Internal notes</CardDescription>
                <CardTitle>Operational context</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
                This admin surface will later persist notes separately from customer-facing status updates.
              </CardContent>
            </Card>
          </div>
          <OrderStatusPanel status={order.status} />
        </div>
      </div>
    </main>
  );
}
