import { describe, expect, it } from "vitest";
import { verifyPaystackWebhook } from "@/lib/payments/verify-paystack-webhook";

describe("verifyPaystackWebhook", () => {
  it("rejects invalid signatures", async () => {
    await expect(
      verifyPaystackWebhook({
        rawBody: "{}",
        secret: "test-secret",
        signature: "bad-signature",
      }),
    ).rejects.toThrow(/signature/i);
  });
});
