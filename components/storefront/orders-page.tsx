import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/orders/repository";

type OrdersPageProps = {
  orders: OrderRecord[];
};

function formatNgn(value: number) {
  return `NGN ${value.toLocaleString("en-NG")}`;
}

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function OrdersPage({ orders }: OrdersPageProps) {
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <Badge>Orders</Badge>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">Track product and shipping progress</h1>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardDescription>{order.createdLabel}</CardDescription>
              <CardTitle>{order.id}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-sm text-[rgb(var(--text-secondary))]">
                <p className="capitalize">Status: {formatStatusLabel(order.status)}</p>
                <p className="capitalize">
                  Product payment: {formatStatusLabel(order.productPaymentState)} · Shipping payment:{" "}
                  {formatStatusLabel(order.shippingPaymentState)}
                </p>
                <p className="uppercase">
                  Route: {order.routeSnapshot ? `${order.routeSnapshot.originLabel} to ${order.routeSnapshot.destinationLabel}` : order.route}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-base font-semibold text-[rgb(var(--text-primary))]">
                    {formatNgn(order.productPaymentTotalNgn)}
                  </p>
                  <p className="text-xs text-[rgb(var(--text-secondary))]">
                    {order.shippingCostNgn === null ? "Shipping billed later" : `Shipping invoice ${formatNgn(order.shippingCostNgn)}`}
                  </p>
                </div>
                <Link className="text-sm font-medium text-[rgb(var(--brand-600))]" href={`/account/orders/${order.id}`}>
                  View details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
