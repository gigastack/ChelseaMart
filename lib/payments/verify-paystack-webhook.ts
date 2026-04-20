import crypto from "node:crypto";

type VerifyPaystackWebhookInput = {
  rawBody: string;
  secret: string;
  signature: string | null | undefined;
};

export async function verifyPaystackWebhook({ rawBody, secret, signature }: VerifyPaystackWebhookInput) {
  if (!signature) {
    throw new Error("Missing Paystack signature header.");
  }

  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const valid =
    hash.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));

  if (!valid) {
    throw new Error("Invalid Paystack webhook signature.");
  }

  return JSON.parse(rawBody) as Record<string, unknown>;
}
