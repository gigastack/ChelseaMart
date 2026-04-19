import { OrdersPage } from "@/components/storefront/orders-page";
import { listOrders } from "@/lib/orders/repository";

export default async function AccountOrdersPage() {
  const orders = await listOrders();
  return <OrdersPage orders={orders} />;
}
