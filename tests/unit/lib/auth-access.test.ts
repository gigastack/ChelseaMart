import { describe, expect, it } from "vitest";
import { assertAdminRole, getUserAccess, isAdminRole, normalizeEmail, parseProfileRole } from "@/lib/auth/access";

describe("auth access helpers", () => {
  it("normalizes email case and whitespace", () => {
    expect(normalizeEmail(" Admin@Example.com ")).toBe("admin@example.com");
    expect(normalizeEmail(null)).toBeNull();
  });

  it("parses persisted roles and identifies admins", () => {
    expect(parseProfileRole("admin")).toBe("admin");
    expect(parseProfileRole("customer")).toBe("customer");
    expect(parseProfileRole("owner")).toBeNull();
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("customer")).toBe(false);
  });

  it("builds access flags for route-level guards", () => {
    expect(getUserAccess("viewer@example.com", "customer")).toEqual({
      email: "viewer@example.com",
      isAdmin: false,
      isAuthenticated: true,
      role: "customer",
    });
  });

  it("throws when a non-admin user hits an admin-only boundary", () => {
    expect(() => assertAdminRole("customer")).toThrow(/admin/i);
  });
});
