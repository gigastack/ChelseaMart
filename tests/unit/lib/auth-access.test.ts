import { describe, expect, it } from "vitest";
import { assertAdminEmail, getUserAccess, isAdminEmail, normalizeEmail } from "@/lib/auth/access";

describe("auth access helpers", () => {
  it("normalizes email case and whitespace", () => {
    expect(normalizeEmail(" Admin@Example.com ")).toBe("admin@example.com");
    expect(normalizeEmail(null)).toBeNull();
  });

  it("checks admin membership against normalized addresses", () => {
    expect(isAdminEmail("Admin@Example.com", ["owner@example.com", "admin@example.com"])).toBe(true);
    expect(isAdminEmail("viewer@example.com", ["owner@example.com", "admin@example.com"])).toBe(false);
  });

  it("builds access flags for route-level guards", () => {
    expect(getUserAccess("viewer@example.com", ["admin@example.com"])).toEqual({
      email: "viewer@example.com",
      isAdmin: false,
      isAuthenticated: true,
    });
  });

  it("throws when a non-admin user hits an admin-only boundary", () => {
    expect(() => assertAdminEmail("viewer@example.com", ["admin@example.com"])).toThrow(/admin/i);
  });
});
