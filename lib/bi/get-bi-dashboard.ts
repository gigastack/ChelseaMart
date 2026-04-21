import { listAdminProducts } from "@/lib/catalog/repository";
import { listImportJobs } from "@/lib/imports/repository";
import { listAdminOrders } from "@/lib/orders/repository";

type GetBiDashboardInput = {
  from: string;
  to: string;
};

export async function getBiDashboard({ from, to }: GetBiDashboardInput) {
  const [orders, products, importJobs] = await Promise.all([listAdminOrders(), listAdminProducts(), listImportJobs()]);
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T23:59:59.999Z`);
  const visibleOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= fromDate && createdAt <= toDate;
  });
  const productRevenue = visibleOrders.reduce((sum, order) => sum + order.productPaymentTotalNgn, 0);
  const shippingRevenue = visibleOrders.reduce(
    (sum, order) => sum + (order.shippingPaymentState === "paid" ? order.shippingCostNgn ?? 0 : 0),
    0,
  );
  const revenue = productRevenue + shippingRevenue;
  const routeSplit = visibleOrders.reduce(
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
  const warehouseQueue = visibleOrders.filter((order) =>
    ["awaiting_warehouse", "arrived_at_warehouse", "weighed"].includes(order.status),
  ).length;
  const awaitingShippingInvoices = visibleOrders.filter((order) => order.shippingPaymentState === "pending").length;
  const topProductsMap = new Map<string, number>();

  visibleOrders.forEach((order) => {
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
      totalOrders: visibleOrders.length,
    },
    operations: {
      failedImports: importJobs.reduce((sum, job) => sum + job.failedCount, 0),
      processedImports: importJobs.reduce((sum, job) => sum + job.importedCount, 0),
      warehouseQueue,
      awaitingShippingInvoices,
      unavailableAlerts: unavailableProducts.length,
    },
    payments: {
      pendingVerification: visibleOrders.filter((order) => order.productPaymentState !== "paid").length,
      successRate:
        visibleOrders.length === 0 ? 1 : visibleOrders.filter((order) => order.productPaymentState === "paid").length / visibleOrders.length,
      shippingInvoicesDue: awaitingShippingInvoices,
      webhookHealth: visibleOrders.length === 0 ? "No recorded activity yet" : "Recorded",
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
