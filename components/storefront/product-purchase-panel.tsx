"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { AddToCartForm } from "@/components/storefront/add-to-cart-form";
import { useStorefrontCurrency } from "@/components/storefront/currency-provider";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";
import { cn } from "@/lib/utils";

type ProductPurchasePanelProps = {
  product: StorefrontProductRecord;
};

const ledgerRows = [
  {
    label: "First payment",
    value: "Product only",
  },
  {
    label: "Second payment",
    value: "Shipping after proof",
  },
];

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { currency } = useStorefrontCurrency();
  const displayedPrice = currency === "NGN" ? product.priceDisplayNgn : product.priceDisplay;

  return (
    <aside className="xl:sticky xl:top-[calc(var(--header-height)+2rem)]">
      <div className="grid gap-6 rounded-[var(--radius-lg)] border border-[rgba(var(--border-strong),0.46)] bg-[rgba(var(--surface-card),0.94)] p-6 shadow-[0_24px_70px_rgba(4,47,46,0.08)] backdrop-blur">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{product.category}</Badge>
            <span className="rounded-full border border-[rgba(var(--border-strong),0.7)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-secondary))]">
              MOQ {product.effectiveMoq}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              {product.title}
            </h1>
            <p className="max-w-xl text-base leading-7 text-[rgb(var(--text-secondary))]">{product.description}</p>
          </div>
        </div>

        <div className="grid gap-3 border-y border-[rgba(var(--border-subtle),0.92)] py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                Current display
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
                {displayedPrice}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] px-4 py-3 text-right">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                Checkout
              </p>
              <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">{product.priceDisplayNgn}</p>
            </div>
          </div>
          <p className="text-sm text-[rgb(var(--text-secondary))]">{product.priceDisplayNgn} payable at checkout</p>
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Browse in CNY or preview in NGN. Product settlement still happens only in Naira when checkout starts.
          </p>
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Shipping is invoiced later in USD after warehouse measurement and proof upload.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
              Minimum order
            </p>
            <p className="mt-2 text-xl font-semibold text-[rgb(var(--text-primary))]">{product.effectiveMoq}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
              Payment
            </p>
            <p className="mt-2 text-xl font-semibold text-[rgb(var(--text-primary))]">NGN at checkout</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
              Shipping
            </p>
            <p className="mt-2 text-xl font-semibold text-[rgb(var(--text-primary))]">Billed later</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-[var(--radius-md)] border border-[rgba(var(--border-strong),0.42)] bg-[rgb(var(--surface-alt))] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
              Payment split
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[rgb(var(--text-muted))]">{currency} browse</p>
          </div>
          {ledgerRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-3 text-sm"
            >
              <span className="text-[rgb(var(--text-secondary))]">{row.label}</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">{row.value}</span>
            </div>
          ))}
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Customers accept the route first, pay only for products now, then settle logistics after the warehouse
            measures the shipment and uploads proof.
          </p>
        </div>

        <div className="grid gap-3">
          <AddToCartForm effectiveMoq={product.effectiveMoq} productId={product.id} />
          <Link className={cn(buttonVariants({ size: "lg" }), "w-full")} href="/checkout">
            Continue to checkout
          </Link>
          <Link className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "w-full")} href="/cart">
            Review cart and MOQ
          </Link>
        </div>
      </div>
    </aside>
  );
}
