import { AdminDashboardPage } from "@/components/admin/dashboard-page";
import { listAdminProducts } from "@/lib/catalog/repository";
import { listAdminOrders } from "@/lib/orders/repository";

export default async function AdminDashboardRoute() {
  const [orders, products] = await Promise.all([listAdminOrders(), listAdminProducts()]);
  const liveProducts = products.filter((product) => product.status === "live").length;
  const draftProducts = products.filter((product) => product.status === "draft").length;
  const warehouseQueue = orders.filter((order) =>
    ["awaiting_warehouse", "arrived_at_warehouse", "weighed"].includes(order.status),
  ).length;
  const shippingInvoicesDue = orders.filter((order) => order.shippingPaymentState === "pending").length;
  const productRevenueNgn = orders.reduce((sum, order) => sum + order.productPaymentTotalNgn, 0);
  const shippingRevenueNgn = orders.reduce(
    (sum, order) => sum + (order.shippingPaymentState === "paid" ? order.shippingCostNgn ?? 0 : 0),
    0,
  );

  return (
    <AdminDashboardPage
      overviewTiles={[
        {
          description: "Orders waiting for warehouse receipt, measurement, or shipping invoice release.",
          title: "Warehouse queue",
          value: String(warehouseQueue),
        },
        {
          description: "Customers who have paid for products and are waiting to settle a measured shipping invoice.",
          title: "Shipping invoices due",
          value: String(shippingInvoicesDue),
        },
        {
          description: "Product and shipping revenue stay split so operations can reconcile both phases cleanly.",
          title: "Split revenue",
          value: `NGN ${productRevenueNgn.toLocaleString("en-NG")} / ${shippingRevenueNgn.toLocaleString("en-NG")}`,
        },
        {
          description: "Manual-upload products remain the main QA path while ELIM stays admin-only and quota-light.",
          title: "Catalog posture",
          value: `${liveProducts} live / ${draftProducts} draft`,
        },
      ]}
    />
  );
}
