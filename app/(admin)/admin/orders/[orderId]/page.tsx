import { AdminOrderDetailPage } from "@/components/admin/order-detail-page";
import { findAdminConsigneeById, findAdminOrderById } from "@/lib/orders/repository";

type AdminOrderDetailRouteProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AdminOrderDetailRoute({ params }: AdminOrderDetailRouteProps) {
  const { orderId } = await params;
  const order = await findAdminOrderById(orderId);
  const consignee = order ? await findAdminConsigneeById(order.consigneeId) : null;
  return <AdminOrderDetailPage consignee={consignee} order={order} />;
}
