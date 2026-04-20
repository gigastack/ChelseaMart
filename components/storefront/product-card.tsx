"use client";

import Link from "next/link";
import { useStorefrontCurrency } from "@/components/storefront/currency-provider";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

export type StorefrontProductCardViewModel = StorefrontProductRecord;

type ProductCardProps = {
  product: StorefrontProductCardViewModel;
};

export function ProductCard({ product }: ProductCardProps) {
  const { currency } = useStorefrontCurrency();
  const displayedPrice = currency === "NGN" ? product.priceDisplayNgn : product.priceDisplay;

  return (
    <Link
      className="group grid gap-4 border-t border-[rgb(var(--border-subtle))] pt-5 transition-transform duration-200 hover:-translate-y-0.5"
      href={`/products/${product.slug}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(140deg,rgba(var(--brand-950),0.96)_0%,rgba(var(--brand-800),0.86)_52%,rgba(var(--surface-alt),1)_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(180deg,transparent_0%,rgba(9,19,31,0.18)_100%)]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/80">
            Cargo ready
          </span>
          <span className="rounded-full bg-[rgb(var(--surface-card))] px-3 py-1 text-xs font-semibold text-[rgb(var(--text-primary))]">
            {displayedPrice}
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
              {product.category}
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              {product.title}
            </h3>
          </div>
          <p className="text-sm font-medium text-[rgb(var(--text-secondary))]">MOQ {product.effectiveMoq}</p>
        </div>
        <p className="max-w-[30ch] text-sm leading-6 text-[rgb(var(--text-secondary))]">{product.description}</p>
        <div className="flex items-center justify-between border-t border-dashed border-[rgb(var(--border-subtle))] pt-3 text-xs uppercase tracking-[0.12em] text-[rgb(var(--text-muted))]">
          <span>Air + Sea available</span>
          <span>{product.weightKg} KG base weight</span>
        </div>
      </div>
    </Link>
  );
}
