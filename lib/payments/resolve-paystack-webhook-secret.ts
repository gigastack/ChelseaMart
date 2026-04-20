type ResolvePaystackWebhookSecretInput = {
  paystackSecretKey?: string;
  paystackWebhookSecret?: string;
};

export function resolvePaystackWebhookSecret({
  paystackSecretKey,
  paystackWebhookSecret,
}: ResolvePaystackWebhookSecretInput) {
  return paystackWebhookSecret ?? paystackSecretKey;
}
