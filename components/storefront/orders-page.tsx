import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/orders/repository";

type OrdersPageProps = {
  orders: OrderRecord[];
};

export function OrdersPage({ orders }: OrdersPageProps) {
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <Badge>Orders</Badge>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">Track order progress</h1>
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
                <p className="capitalize">Status: {order.status}</p>
                <p className="uppercase">Route: {order.route}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-base font-semibold text-[rgb(var(--text-primary))]">
                  NGN {order.grandTotalNgn.toLocaleString("en-NG")}
                </p>
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
