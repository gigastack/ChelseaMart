import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";
import { formatMoney } from "@/lib/currency/format";
import type { OrderRecord } from "@/lib/orders/repository";

type AdminOrdersPageProps = {
  orders: OrderRecord[];
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function AdminOrdersPage({ orders }: AdminOrdersPageProps) {
  const warehouseQueue = orders.filter((order) =>
    ["awaiting_warehouse", "arrived_at_warehouse", "weighed", "awaiting_shipping_payment"].includes(order.status),
  ).length;
  const shippingInvoicesDue = orders.filter(
    (order) => order.shippingPaymentState === "pending" && order.shippingCostUsd !== null,
  ).length;

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-3">
          <Badge>Orders</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Warehouse and delivery queue
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              This queue keeps the product-settlement ledger and logistics-settlement ledger together so ops can see
              which orders still need warehouse proof, customer notification, or a second payment.
            </p>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
            <CardHeader>
              <CardDescription>Warehouse queue</CardDescription>
              <CardTitle>{warehouseQueue}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
              Orders waiting for receipt, measurement, or invoice release.
            </CardContent>
          </Card>
          <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
            <CardHeader>
              <CardDescription>Invoices due</CardDescription>
              <CardTitle>{shippingInvoicesDue}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
              USD logistics invoices that are already measured and waiting on customer payment.
            </CardContent>
          </Card>
          <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
            <CardHeader>
              <CardDescription>Product settlement</CardDescription>
              <CardTitle>{formatMoney(orders.reduce((sum, order) => sum + order.productPaymentTotalNgn, 0), "NGN")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
              Paid product revenue already settled through the first Paystack flow.
            </CardContent>
          </Card>
          <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
            <CardHeader>
              <CardDescription>Shipping settlement</CardDescription>
              <CardTitle>
                {formatMoney(
                  orders.reduce((sum, order) => sum + (order.shippingPaymentState === "paid" ? order.shippingCostNgn ?? 0 : 0), 0),
                  "NGN",
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
              Shipping revenue recognized only after the second customer payment clears.
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardDescription>Order ledger</CardDescription>
            <CardTitle>Product, warehouse, and logistics states in one queue</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHead>Order</DataTableHead>
                  <DataTableHead>Status</DataTableHead>
                  <DataTableHead>Route</DataTableHead>
                  <DataTableHead>Product payment</DataTableHead>
                  <DataTableHead>Logistics invoice</DataTableHead>
                  <DataTableHead>Shipping payment</DataTableHead>
                  <DataTableHead>Created</DataTableHead>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {orders.map((order) => (
                  <DataTableRow key={order.id}>
                    <DataTableCell>
                      <Link className="font-medium text-[rgb(var(--text-primary))] underline-offset-4 hover:underline" href={`/admin/orders/${order.id}`}>
                        {order.id}
                      </Link>
                    </DataTableCell>
                    <DataTableCell>{formatStatusLabel(order.status)}</DataTableCell>
                    <DataTableCell className="uppercase">{order.routeSnapshot ? order.routeSnapshot.mode : order.route}</DataTableCell>
                    <DataTableCell>
                      <div>{formatStatusLabel(order.productPaymentState)}</div>
                      <div className="text-xs text-[rgb(var(--text-secondary))]">
                        {formatMoney(order.productSubtotalCny, "CNY")} / {formatMoney(order.productPaymentTotalNgn, "NGN")}
                      </div>
                    </DataTableCell>
                    <DataTableCell>
                      {order.shippingCostUsd === null ? (
                        <span className="text-[rgb(var(--text-secondary))]">Pending proof</span>
                      ) : (
                        <div>
                          <div>{formatMoney(order.shippingCostUsd, "USD")}</div>
                          <div className="text-xs text-[rgb(var(--text-secondary))]">{formatMoney(order.shippingCostNgn ?? 0, "NGN")}</div>
                        </div>
                      )}
                    </DataTableCell>
                    <DataTableCell>{formatStatusLabel(order.shippingPaymentState)}</DataTableCell>
                    <DataTableCell>{order.createdLabel}</DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
