"use server";

import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/guards";
import { updateOrderStatus } from "@/lib/orders/repository";

const allowedStatuses = new Set(["confirmed", "processing", "shipped", "delivered", "cancelled"]);

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminUser("/account/orders");

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!orderId || !allowedStatuses.has(status)) {
    redirect("/admin/orders");
  }

  await updateOrderStatus({
    note: `Admin marked the order as ${status}.`,
    orderId,
    status: status as "cancelled" | "confirmed" | "delivered" | "processing" | "shipped",
  });

  redirect(`/admin/orders/${orderId}`);
}
