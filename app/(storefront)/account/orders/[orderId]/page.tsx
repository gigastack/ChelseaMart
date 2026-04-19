import { OrderDetailPage } from "@/components/storefront/order-detail-page";
import { findConsigneeById, findOrderById } from "@/lib/orders/repository";

type AccountOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AccountOrderDetailPage({ params }: AccountOrderDetailPageProps) {
  const { orderId } = await params;
  const order = await findOrderById(orderId);
  const consignee = order ? await findConsigneeById(order.consigneeId) : null;
  return <OrderDetailPage consignee={consignee} order={order} />;
}
