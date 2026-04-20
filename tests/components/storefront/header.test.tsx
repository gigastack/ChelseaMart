import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StorefrontCurrencyProvider } from "@/components/storefront/currency-provider";
import { StorefrontHeaderView } from "@/components/storefront/header";

describe("StorefrontHeaderView", () => {
  it("does not expose admin navigation to signed-out customers", () => {
    render(
      <StorefrontCurrencyProvider>
        <StorefrontHeaderView
          access={{
            email: null,
            isAdmin: false,
            isAuthenticated: false,
            role: null,
          }}
        />
      </StorefrontCurrencyProvider>,
    );

    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /cny/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /ngn/i })).toBeVisible();
  });

  it("shows the admin entry only for admin users", () => {
    render(
      <StorefrontCurrencyProvider>
        <StorefrontHeaderView
          access={{
            email: "admin@example.com",
            isAdmin: true,
            isAuthenticated: true,
            role: "admin",
          }}
        />
      </StorefrontCurrencyProvider>,
    );

    expect(screen.getByRole("link", { name: /admin/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /account/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeVisible();
  });
});
