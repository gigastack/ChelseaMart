import { listAdminProducts } from "@/lib/catalog/repository";
import { listAdminOrders } from "@/lib/orders/repository";

type GetBiDashboardInput = {
  from: string;
  to: string;
};

export async function getBiDashboard({ from, to }: GetBiDashboardInput) {
  const [orders, products] = await Promise.all([listAdminOrders(), listAdminProducts()]);
  const revenue = orders.reduce((sum, order) => sum + order.grandTotalNgn, 0);
  const routeSplit = orders.reduce(
    (acc, order) => {
      acc[order.route as "air" | "sea"] += 1;
      return acc;
    },
    { air: 0, sea: 0 },
  );
  const unavailableProducts = products.filter((product) => product.status === "unavailable");
  const draftProducts = products.filter((product) => product.status === "draft");
  const liveProducts = products.filter((product) => product.status === "live");

  return {
    catalog: {
      drafts: draftProducts.length,
      live: liveProducts.length,
      unavailable: unavailableProducts.length,
    },
    executive: {
      dateRange: { from, to },
      revenueNgn: revenue,
      totalOrders: orders.length,
    },
    operations: {
      failedImports: 0,
      processedImports: products.length,
      unavailableAlerts: unavailableProducts.length,
    },
    payments: {
      pendingVerification: orders.filter((order) => order.paymentReference === null).length,
      successRate: orders.length === 0 ? 1 : orders.filter((order) => order.paymentReference).length / orders.length,
      webhookHealth: "seeded",
    },
    sales: {
      routeSplit,
      topProducts: orders
        .flatMap((order) =>
          order.items.map((item: { quantity: number; sellPriceNgn: number; title: string }) => ({
            revenueNgn: item.sellPriceNgn * item.quantity,
            title: item.title,
          })),
        )
        .sort((left, right) => right.revenueNgn - left.revenueNgn)
        .slice(0, 5),
    },
  };
}
