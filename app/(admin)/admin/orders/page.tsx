import { AdminOrdersPage } from "@/components/admin/orders-page";
import { listAdminOrders } from "@/lib/orders/repository";

export default async function AdminOrdersRoute() {
  const orders = await listAdminOrders();
  return <AdminOrdersPage orders={orders} />;
}
