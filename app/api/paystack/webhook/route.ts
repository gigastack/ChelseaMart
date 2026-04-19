import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/config/env";
import { verifyPaystackWebhook } from "@/lib/payments/verify-paystack-webhook";

const processedWebhookEvents = new Set<string>();
const allowedEventTypes = new Set(["charge.success", "charge.failed"]);

export async function POST(request: Request) {
  const secret = getServerEnv().paystackWebhookSecret;

  if (!secret) {
    return NextResponse.json({ error: "Paystack webhook secret is missing." }, { status: 500 });
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

    const dedupeKey = `${eventType}:${reference}`;
    if (processedWebhookEvents.has(dedupeKey)) {
      return NextResponse.json({ ok: true, duplicate: true, received: true });
    }

    processedWebhookEvents.add(dedupeKey);

    return NextResponse.json({ ok: true, received: true, type: eventType });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook" }, { status: 400 });
  }
}
