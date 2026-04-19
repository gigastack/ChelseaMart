import { AdminOrderDetailPage } from "@/components/admin/order-detail-page";
import { findConsigneeById, findOrderById } from "@/lib/orders/repository";

type AdminOrderDetailRouteProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AdminOrderDetailRoute({ params }: AdminOrderDetailRouteProps) {
  const { orderId } = await params;
  const order = await findOrderById(orderId);
  const consignee = order ? await findConsigneeById(order.consigneeId) : null;
  return <AdminOrderDetailPage consignee={consignee} order={order} />;
}
