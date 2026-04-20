import { z } from "zod";
import { getServerEnv } from "@/lib/config/env";

const verifyTransactionSchema = z.object({
  data: z.object({
    reference: z.string(),
    status: z.string(),
  }),
  message: z.string().optional(),
  status: z.boolean(),
});

export async function verifyPaystackTransaction(reference: string) {
  const { paystackApiBaseUrl, paystackSecretKey } = getServerEnv();

  if (!paystackApiBaseUrl) {
    throw new Error("PAYSTACK_API_BASE_URL is required for payment verification.");
  }
  if (!paystackSecretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is required for payment verification.");
  }

  const url = new URL(
    `/transaction/verify/${encodeURIComponent(reference)}`,
    paystackApiBaseUrl.endsWith("/") ? paystackApiBaseUrl : `${paystackApiBaseUrl}/`,
  ).toString();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Paystack verification failed.");
  }

  return verifyTransactionSchema.parse(await response.json());
}
