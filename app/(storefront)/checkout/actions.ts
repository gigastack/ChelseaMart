"use server";

import { redirect } from "next/navigation";
import { createPaystackTransaction } from "@/lib/payments/create-paystack-transaction";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import {
  attachProductPaymentReference,
  createRouteAcceptedOrderRecord,
  findConsigneeById,
  listCheckoutCartItems,
} from "@/lib/orders/repository";

export async function startCheckoutPaymentAction(formData: FormData) {
  const user = await requireAuthenticatedUser("/checkout");
  const consigneeId = String(formData.get("consigneeId") ?? "");
  const shippingRouteId = String(formData.get("shippingRouteId") ?? "");
  const acceptTerms = String(formData.get("acceptTerms") ?? "") === "accepted";
  const cartItems = await listCheckoutCartItems();
  const consignee = await findConsigneeById(consigneeId, user.id);

  if (!consignee) {
    redirect(`/checkout?error=${encodeURIComponent("Choose a saved consignee before payment.")}`);
  }

  if (!shippingRouteId) {
    redirect(`/checkout?error=${encodeURIComponent("Choose a shipping route before product payment.")}`);
  }

  if (!acceptTerms) {
    redirect(`/checkout?error=${encodeURIComponent("Accept the shipping terms before paying for products.")}`);
  }

  if (!cartItems.length) {
    redirect(`/checkout?error=${encodeURIComponent("Your checkout cart is empty.")}`);
  }

  const pendingOrder = await createRouteAcceptedOrderRecord({
    cartItems,
    consigneeId,
    shippingRouteId,
    userId: user.id,
  });

  const paystackRequest = createPaystackTransaction({
    amountNgn: pendingOrder.totals.productPaymentTotalNgn,
    callbackUrl: pendingOrder.callbackUrl,
    customerEmail: user.email ?? "",
    metadata: {
      orderId: pendingOrder.orderId,
      paymentPhase: "product",
      shippingRouteId,
    },
    reference: `product-${pendingOrder.paymentId}`,
  });

  const response = await fetch(paystackRequest.url, {
    body: JSON.stringify(paystackRequest.payload),
    headers: paystackRequest.headers,
    method: "POST",
  });

  if (!response.ok) {
    redirect(`/payment/failed?kind=product&error=${encodeURIComponent("Paystack initialization failed. Please try again.")}`);
  }

  const payload = (await response.json()) as {
    data?: {
      authorization_url?: string;
      reference?: string;
    };
  };

  const paymentReference = payload.data?.reference ?? paystackRequest.payload.reference;
  await attachProductPaymentReference(pendingOrder.orderId, pendingOrder.paymentId, {
    authorizationUrl: payload.data?.authorization_url ?? null,
    paymentReference,
  });

  if (!payload.data?.authorization_url) {
    redirect(`/payment/pending?kind=product&reference=${encodeURIComponent(paymentReference)}`);
  }

  redirect(payload.data.authorization_url);
}
