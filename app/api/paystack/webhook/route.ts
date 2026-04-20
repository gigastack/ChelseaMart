import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/config/env";
import { reconcilePaystackPayment } from "@/lib/payments/reconcile-paystack-payment";
import { resolvePaystackWebhookSecret } from "@/lib/payments/resolve-paystack-webhook-secret";
import { verifyPaystackWebhook } from "@/lib/payments/verify-paystack-webhook";

const allowedEventTypes = new Set(["charge.success", "charge.failed"]);

export async function POST(request: Request) {
  const { paystackSecretKey, paystackWebhookSecret } = getServerEnv();
  const secret = resolvePaystackWebhookSecret({
    paystackSecretKey,
    paystackWebhookSecret,
  });

  if (!secret) {
    return NextResponse.json({ error: "Paystack secret key is missing." }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  try {
    const event = await verifyPaystackWebhook({ rawBody, secret, signature });
    const eventType = typeof event.event === "string" ? event.event : "unknown";
    const reference =
      event.data && typeof event.data === "object" && "reference" in event.data && typeof event.data.reference === "string"
        ? event.data.reference
        : "missing-reference";

    if (!allowedEventTypes.has(eventType)) {
      return NextResponse.json({ ok: false, received: false }, { status: 202 });
    }

    const transactionStatus =
      event.data && typeof event.data === "object" && "status" in event.data && typeof event.data.status === "string"
        ? event.data.status
        : eventType === "charge.success"
          ? "success"
          : "failed";

    await reconcilePaystackPayment({
      eventType,
      note: eventType === "charge.success" ? "Paystack webhook confirmed payment." : "Paystack webhook reported payment failure.",
      payload: event,
      paymentReference: reference,
      transactionStatus,
    });

    return NextResponse.json({ ok: true, received: true, type: eventType });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook" }, { status: 400 });
  }
}
