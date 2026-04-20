"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ShoppingBag } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--border-subtle))] bg-[rgba(var(--surface-base),0.88)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4 lg:px-12">
        <Link className="min-w-fit" href="/">
          <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[rgb(var(--brand-600))]">
            Cargo Ledger
          </span>
          <span className="font-serif text-2xl tracking-[-0.04em] text-[rgb(var(--text-primary))]">Mart</span>
        </Link>

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

        <div className="hidden flex-1 items-center justify-center xl:flex">
          <div className="rounded-full border border-[rgb(var(--border-subtle))] bg-[rgba(var(--surface-card),0.82)] p-1">
            {(["CNY", "NGN"] as const).map((option) => (
              <button
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
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
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Badge className="hidden sm:inline-flex">Products in {currency} • Pay NGN</Badge>
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
          <Link aria-label="Cart" className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "px-2")} href="/cart">
            <ShoppingBag className="size-4" />
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
