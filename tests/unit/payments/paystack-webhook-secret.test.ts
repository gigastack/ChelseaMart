import { describe, expect, it } from "vitest";
import { resolvePaystackWebhookSecret } from "@/lib/payments/resolve-paystack-webhook-secret";

describe("resolvePaystackWebhookSecret", () => {
  it("prefers the dedicated webhook secret when it is configured", () => {
    expect(
      resolvePaystackWebhookSecret({
        paystackSecretKey: "sk_test_primary",
        paystackWebhookSecret: "whsec_override",
      }),
    ).toBe("whsec_override");
  });

  it("falls back to the paystack secret key when no webhook secret is provided", () => {
    expect(
      resolvePaystackWebhookSecret({
        paystackSecretKey: "sk_test_primary",
      }),
    ).toBe("sk_test_primary");
  });

  it("returns undefined when neither secret is configured", () => {
    expect(resolvePaystackWebhookSecret({})).toBeUndefined();
  });
});
