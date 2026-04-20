"use server";

import { redirect } from "next/navigation";
import { createPaystackTransaction } from "@/lib/payments/create-paystack-transaction";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { getPublicEnv } from "@/lib/config/env";
import { attachShippingPaymentReference, findPendingShippingPaymentByOrderId } from "@/lib/orders/repository";

export async function startShippingPaymentAction(formData: FormData) {
  const user = await requireAuthenticatedUser("/account/orders");
  const orderId = String(formData.get("orderId") ?? "");

  if (!orderId) {
    redirect("/account/orders");
  }

  const shippingPayment = await findPendingShippingPaymentByOrderId(orderId, user.id);

  if (!shippingPayment) {
    redirect(`/account/orders/${orderId}?error=${encodeURIComponent("Shipping payment is not ready yet.")}`);
  }

  const publicEnv = getPublicEnv();
  const callbackUrl = publicEnv.siteUrl
    ? new URL("/payment/pending?kind=shipping", publicEnv.siteUrl).toString()
    : "/payment/pending?kind=shipping";
  const paystackRequest = createPaystackTransaction({
    amountNgn: shippingPayment.amountNgn,
    callbackUrl,
    customerEmail: user.email ?? "",
    metadata: {
      orderId,
      paymentPhase: "shipping",
    },
    reference: `shipping-${shippingPayment.paymentId}`,
  });

  const response = await fetch(paystackRequest.url, {
    body: JSON.stringify(paystackRequest.payload),
    headers: paystackRequest.headers,
    method: "POST",
  });

  if (!response.ok) {
    redirect(`/payment/failed?kind=shipping&error=${encodeURIComponent("Paystack initialization failed. Please try again.")}`);
  }

  const payload = (await response.json()) as {
    data?: {
      authorization_url?: string;
      reference?: string;
    };
  };

  const paymentReference = payload.data?.reference ?? paystackRequest.payload.reference;
  await attachShippingPaymentReference(orderId, shippingPayment.paymentId, {
    paymentReference,
  });

  if (!payload.data?.authorization_url) {
    redirect(`/payment/pending?kind=shipping&reference=${encodeURIComponent(paymentReference)}`);
  }

  redirect(payload.data.authorization_url);
}
