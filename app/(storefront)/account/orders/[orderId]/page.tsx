import { OrderDetailPage } from "@/components/storefront/order-detail-page";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { findConsigneeById, findOrderById } from "@/lib/orders/repository";

type AccountOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AccountOrderDetailPage({ params }: AccountOrderDetailPageProps) {
  const { orderId } = await params;
  const user = hasSupabaseAuthEnv() ? await requireAuthenticatedUser(`/account/orders/${orderId}`) : null;
  const order = await findOrderById(orderId, user?.id);
  const consignee = order ? await findConsigneeById(order.consigneeId, user?.id) : null;
  return <OrderDetailPage consignee={consignee} order={order} />;
}
