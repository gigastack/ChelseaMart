import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";
import type { OrderRecord } from "@/lib/orders/repository";

type AdminOrdersPageProps = {
  orders: OrderRecord[];
};

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function AdminOrdersPage({ orders }: AdminOrdersPageProps) {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <Badge>Orders</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Warehouse and delivery queue</h1>
        </div>

        <DataTable>
          <DataTableHeader>
            <DataTableRow>
              <DataTableHead>Order</DataTableHead>
              <DataTableHead>Status</DataTableHead>
              <DataTableHead>Route</DataTableHead>
              <DataTableHead>Product payment</DataTableHead>
              <DataTableHead>Shipping payment</DataTableHead>
              <DataTableHead>Total</DataTableHead>
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
                <DataTableCell>{formatStatusLabel(order.productPaymentState)}</DataTableCell>
                <DataTableCell>{formatStatusLabel(order.shippingPaymentState)}</DataTableCell>
                <DataTableCell>NGN {order.grandTotalNgn.toLocaleString("en-NG")}</DataTableCell>
                <DataTableCell>{order.createdLabel}</DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>
    </main>
  );
}
