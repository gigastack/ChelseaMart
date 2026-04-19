import { getServerEnv } from "@/lib/config/env";

type CreatePaystackTransactionInput = {
  amountNgn: number;
  callbackUrl: string;
  customerEmail: string;
  metadata?: Record<string, unknown>;
  reference: string;
};

export function createPaystackTransaction(input: CreatePaystackTransactionInput) {
  const { paystackApiBaseUrl, paystackSecretKey } = getServerEnv();

  if (!paystackApiBaseUrl) {
    throw new Error("PAYSTACK_API_BASE_URL is required for checkout.");
  }
  if (!paystackSecretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is required for checkout.");
  }

  return {
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      "Content-Type": "application/json",
    },
    payload: {
      amount: Math.round(input.amountNgn * 100),
      callback_url: input.callbackUrl,
      currency: "NGN",
      email: input.customerEmail,
      metadata: input.metadata,
      reference: input.reference,
    },
    url: new URL("/transaction/initialize", paystackApiBaseUrl.endsWith("/") ? paystackApiBaseUrl : `${paystackApiBaseUrl}/`).toString(),
  };
}
