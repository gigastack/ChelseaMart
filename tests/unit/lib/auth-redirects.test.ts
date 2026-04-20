import { describe, expect, it } from "vitest";
import { buildSignInHref, sanitizeNextPath } from "@/lib/auth/redirects";

describe("auth redirect helpers", () => {
  it("keeps same-site relative next paths", () => {
    expect(sanitizeNextPath("/checkout")).toBe("/checkout");
    expect(sanitizeNextPath("/admin")).toBe("/admin");
  });

  it("rejects unsafe or empty next paths", () => {
    expect(sanitizeNextPath("")).toBe("/account/orders");
    expect(sanitizeNextPath("https://evil.example/redirect")).toBe("/account/orders");
    expect(sanitizeNextPath("//evil.example/redirect")).toBe("/account/orders");
    expect(sanitizeNextPath("javascript:alert(1)")).toBe("/account/orders");
  });

  it("builds a sign-in URL that preserves the intended destination", () => {
    expect(buildSignInHref("/checkout")).toBe("/auth/sign-in?next=%2Fcheckout");
  });
});
