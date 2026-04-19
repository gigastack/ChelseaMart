import { describe, expect, it } from "vitest";
import { getConfigStatus, parseAppEnv } from "@/lib/config/env";

describe("parseAppEnv", () => {
  it("parses the required public keys and optional server integrations", () => {
    const result = parseAppEnv({
      ADMIN_EMAILS: "owner@example.com, ops@example.com ",
      ELIM_API_BASE_URL: "https://api.elim.asia/v1",
      ELIM_API_KEY: "elim_secret",
      NEXT_PUBLIC_SITE_URL: "https://mart.example.com",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      PAYSTACK_API_BASE_URL: "https://api.paystack.co",
      PAYSTACK_SECRET_KEY: "sk_test_xxx",
      PAYSTACK_WEBHOOK_SECRET: "whsec_xxx",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
    });

    expect(result.public.supabaseUrl).toBe("https://project.supabase.co");
    expect(result.server.adminEmails).toEqual(["owner@example.com", "ops@example.com"]);
    expect(result.server.elimApiBaseUrl).toBe("https://api.elim.asia/v1");
    expect(result.server.paystackSecretKey).toBe("sk_test_xxx");
    expect(result.server.paystackApiBaseUrl).toBe("https://api.paystack.co");
    expect(result.server.elimApiKey).toBe("elim_secret");
  });

  it("fails when the required public supabase keys are missing", () => {
    expect(() =>
      parseAppEnv({
        NEXT_PUBLIC_SITE_URL: "https://mart.example.com",
      }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/i);
  });
});

describe("getConfigStatus", () => {
  it("tracks whether env-backed integrations are configured", () => {
    expect(getConfigStatus("configured")).toBe("configured");
    expect(getConfigStatus(undefined)).toBe("missing");
  });
});
