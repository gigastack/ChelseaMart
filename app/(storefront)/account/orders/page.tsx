import { OrdersPage } from "@/components/storefront/orders-page";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { listOrders } from "@/lib/orders/repository";

export default async function AccountOrdersPage() {
  const user = hasSupabaseAuthEnv() ? await requireAuthenticatedUser("/account/orders") : null;
  const orders = await listOrders(user?.id);
  return <OrdersPage orders={orders} />;
}
