"use server";

import { redirect } from "next/navigation";
import { createPaystackTransaction } from "@/lib/payments/create-paystack-transaction";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import {
  attachPaystackReference,
  createPendingOrder,
  findConsigneeById,
  listCheckoutCartItems,
} from "@/lib/orders/repository";

function normalizeRoute(value: FormDataEntryValue | null) {
  return value === "sea" ? "sea" : "air";
}

export async function startCheckoutPaymentAction(formData: FormData) {
  const user = await requireAuthenticatedUser("/checkout");
  const consigneeId = String(formData.get("consigneeId") ?? "");
  const route = normalizeRoute(formData.get("route"));
  const cartItems = await listCheckoutCartItems();
  const consignee = await findConsigneeById(consigneeId, user.id);

  if (!consignee) {
    redirect(`/checkout?error=${encodeURIComponent("Choose a saved consignee before payment.")}`);
  }

  if (!cartItems.length) {
    redirect(`/checkout?error=${encodeURIComponent("Your checkout cart is empty.")}`);
  }

  const pendingOrder = await createPendingOrder({
    cartItems,
    consigneeId,
    route,
    userId: user.id,
  });

  const paystackRequest = createPaystackTransaction({
    amountNgn: pendingOrder.totals.grandTotalNgn,
    callbackUrl: pendingOrder.callbackUrl,
    customerEmail: user.email ?? "",
    metadata: {
      orderId: pendingOrder.orderId,
      route,
    },
    reference: `order-${pendingOrder.orderId}`,
  });

  const response = await fetch(paystackRequest.url, {
    body: JSON.stringify(paystackRequest.payload),
    headers: paystackRequest.headers,
    method: "POST",
  });

  if (!response.ok) {
    redirect(`/payment/failed?error=${encodeURIComponent("Paystack initialization failed. Please try again.")}`);
  }

  const payload = (await response.json()) as {
    data?: {
      authorization_url?: string;
      reference?: string;
    };
  };

  const paymentReference = payload.data?.reference ?? paystackRequest.payload.reference;
  await attachPaystackReference(pendingOrder.orderId, {
    authorizationUrl: payload.data?.authorization_url ?? null,
    paymentReference,
  });

  if (!payload.data?.authorization_url) {
    redirect(`/payment/pending?reference=${encodeURIComponent(paymentReference)}`);
  }

  redirect(payload.data.authorization_url);
}
