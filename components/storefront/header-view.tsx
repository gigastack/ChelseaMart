"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { UserAccess } from "@/lib/auth/access";
import { cn } from "@/lib/utils";
import { useStorefrontCurrency } from "@/components/storefront/currency-provider";

const navItems = [
  { href: "/catalog", label: "Catalog" },
  { href: "/search", label: "Search" },
  { href: "/account/orders", label: "Orders" },
];

type StorefrontHeaderViewProps = {
  access: UserAccess;
  signOutControl?: ReactNode;
};

export function StorefrontHeaderView({ access, signOutControl }: StorefrontHeaderViewProps) {
  const { currency, setCurrency } = useStorefrontCurrency();

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(var(--border-subtle),0.9)] bg-[rgba(var(--surface-base),0.92)] backdrop-blur-xl">
      <div className="hidden border-b border-[rgba(var(--border-subtle),0.8)] lg:block">
        <div className="mx-auto flex max-w-[var(--max-shell)] items-center justify-between px-6 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[rgb(var(--text-muted))] lg:px-10">
          <p>Browse in CNY.</p>
          <div className="flex items-center gap-3">
            <span>Pay in NGN</span>
            <span className="text-[rgb(var(--brand-600))]">Shipping billed later</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--max-shell)] flex-col gap-3 px-4 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <Link className="min-w-fit pr-2" href="/">
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[rgb(var(--brand-600))]">
              Chelsea Mart
            </span>
            <span className="text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">Cargo Ledger</span>
          </Link>

          <form action="/search" className="flex-1">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
              <input
                className="h-12 w-full rounded-full border border-[rgba(var(--border-strong),0.65)] bg-[rgba(var(--surface-card),0.92)] pl-11 pr-4 text-sm text-[rgb(var(--text-primary))] shadow-[0_20px_50px_rgba(4,47,46,0.08)] outline-none transition-colors placeholder:text-[rgb(var(--text-muted))] focus:border-[rgba(var(--brand-500),0.6)]"
                name="q"
                placeholder="Search products"
                type="search"
              />
            </label>
          </form>

          <div className="hidden rounded-full border border-[rgba(var(--border-strong),0.55)] bg-[rgba(var(--surface-card),0.92)] p-1 shadow-[0_20px_50px_rgba(4,47,46,0.08)] xl:flex">
            {(["CNY", "NGN"] as const).map((option) => (
              <button
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                  currency === option
                    ? "bg-[rgb(var(--brand-950))] text-[rgb(var(--surface-card))]"
                    : "text-[rgb(var(--text-secondary))]",
                )}
                key={option}
                onClick={() => setCurrency(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {access.isAdmin ? (
              <Link className={cn(buttonVariants({ size: "sm", variant: "secondary" }))} href="/admin">
                Admin
              </Link>
            ) : null}
            {access.isAuthenticated ? (
              <>
                <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} href="/account/orders">
                  Account
                </Link>
                {signOutControl ?? (
                  <Button size="sm" type="button" variant="ghost">
                    Sign out
                  </Button>
                )}
              </>
            ) : (
              <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} href="/auth/sign-in">
                Sign in
              </Link>
            )}
            <Link
              aria-label="Cart"
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "px-2")}
              href="/cart"
            >
              <ShoppingBag className="size-4" />
              <span className="sr-only">Cart</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:text-[rgb(var(--text-primary))]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Badge className="border-[rgba(var(--brand-500),0.18)] bg-[rgba(var(--brand-500),0.12)] text-[rgb(var(--brand-700))]">
              MOQ stays visible
            </Badge>
            <Badge className="hidden sm:inline-flex border-[rgba(var(--accent-premium),0.22)] bg-[rgba(var(--accent-premium),0.14)] text-[rgb(var(--text-primary))]">
              {currency} view
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
