"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStorefrontCurrency } from "@/components/storefront/currency-provider";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type ProductPurchasePanelProps = {
  product: StorefrontProductRecord;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { currency } = useStorefrontCurrency();
  const displayedPrice = currency === "NGN" ? product.priceDisplayNgn : product.priceDisplay;

  return (
    <div className="space-y-6 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.72)] bg-[rgba(var(--surface-card),0.9)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="space-y-4">
        <Badge>{product.category}</Badge>
        <div className="space-y-2">
          <h1 className="font-serif text-4xl tracking-[-0.04em] text-[rgb(var(--text-primary))]">{product.title}</h1>
          <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">{product.description}</p>
        </div>
      </div>

      <div className="space-y-3 border-y border-[rgb(var(--border-subtle))] py-5">
        <p className="text-3xl font-semibold text-[rgb(var(--text-primary))]">{displayedPrice}</p>
        <p className="text-sm text-[rgb(var(--text-secondary))]">{product.priceDisplayNgn} payable at checkout</p>
        <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
          Shipping is invoiced later in USD after warehouse measurement and proof upload. Product payment stays separate.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Minimum order</p>
          <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">{product.effectiveMoq}</p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Display view</p>
          <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">{currency}</p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Settlement</p>
          <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">NGN</p>
        </div>
      </div>

      <Button className="w-full">Add to cart</Button>
    </div>
  );
}
