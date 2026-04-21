import { listAdminProducts } from "@/lib/catalog/repository";
import { listAdminOrders } from "@/lib/orders/repository";

type GetBiDashboardInput = {
  from: string;
  to: string;
};

export async function getBiDashboard({ from, to }: GetBiDashboardInput) {
  const [orders, products] = await Promise.all([listAdminOrders(), listAdminProducts()]);
  const productRevenue = orders.reduce((sum, order) => sum + order.productPaymentTotalNgn, 0);
  const shippingRevenue = orders.reduce(
    (sum, order) => sum + (order.shippingPaymentState === "paid" ? order.shippingCostNgn ?? 0 : 0),
    0,
  );
  const revenue = productRevenue + shippingRevenue;
  const routeSplit = orders.reduce(
    (acc, order) => {
      if (order.route) {
        acc[order.route] += 1;
      }

      return acc;
    },
    { air: 0, sea: 0 },
  );
  const unavailableProducts = products.filter((product) => product.status === "unavailable");
  const draftProducts = products.filter((product) => product.status === "draft");
  const liveProducts = products.filter((product) => product.status === "live");
  const warehouseQueue = orders.filter((order) =>
    ["awaiting_warehouse", "arrived_at_warehouse", "weighed"].includes(order.status),
  ).length;
  const awaitingShippingInvoices = orders.filter((order) => order.shippingPaymentState === "pending").length;
  const topProductsMap = new Map<string, number>();

  orders.forEach((order) => {
    order.items.forEach((item: { quantity: number; sellPriceNgn: number; title: string }) => {
      const currentRevenue = topProductsMap.get(item.title) ?? 0;
      topProductsMap.set(item.title, currentRevenue + item.sellPriceNgn * item.quantity);
    });
  });

  return {
    catalog: {
      drafts: draftProducts.length,
      live: liveProducts.length,
      unavailable: unavailableProducts.length,
    },
    executive: {
      dateRange: { from, to },
      productRevenueNgn: productRevenue,
      revenueNgn: revenue,
      shippingRevenueNgn: shippingRevenue,
      totalOrders: orders.length,
    },
    operations: {
      failedImports: 0,
      processedImports: products.length,
      warehouseQueue,
      awaitingShippingInvoices,
      unavailableAlerts: unavailableProducts.length,
    },
    payments: {
      pendingVerification: orders.filter((order) => order.productPaymentState !== "paid").length,
      successRate: orders.length === 0 ? 1 : orders.filter((order) => order.productPaymentState === "paid").length / orders.length,
      shippingInvoicesDue: awaitingShippingInvoices,
      webhookHealth: "seeded",
    },
    sales: {
      routeSplit,
      topProducts: Array.from(topProductsMap.entries())
        .map(([title, revenueNgn]) => ({
          revenueNgn,
          title,
        }))
        .sort((left, right) => right.revenueNgn - left.revenueNgn)
        .slice(0, 5),
    },
  };
}
