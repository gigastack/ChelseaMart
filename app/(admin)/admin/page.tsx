import { AdminDashboardPage } from "@/components/admin/dashboard-page";
import { listAdminProducts } from "@/lib/catalog/repository";
import { listAdminOrders } from "@/lib/orders/repository";

export default async function AdminDashboardRoute() {
  const [orders, products] = await Promise.all([listAdminOrders(), listAdminProducts()]);
  const liveProducts = products.filter((product) => product.status === "live").length;
  const draftProducts = products.filter((product) => product.status === "draft").length;

  return (
    <AdminDashboardPage
      overviewTiles={[
        {
          description: "Current order volume backed by the local catalog and seeded manual-upload QA product.",
          title: "Orders in view",
          value: String(orders.length),
        },
        {
          description: "Manual-upload products remain the main QA path while ELIM stays admin-only and quota-light.",
          title: "Catalog posture",
          value: `${liveProducts} live / ${draftProducts} draft`,
        },
        {
          description: "Single-admin v1 with env-only integrations, local catalog ownership, and hardened server-side services.",
          title: "Access model",
          value: "Single admin",
        },
      ]}
    />
  );
}
