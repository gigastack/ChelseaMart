"use client";

import Link from "next/link";
import { useStorefrontCurrency } from "@/components/storefront/currency-provider";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

export type StorefrontProductCardViewModel = StorefrontProductRecord;

type ProductCardProps = {
  product: StorefrontProductCardViewModel;
};

function buildImageBackground(imageUrl: string) {
  return {
    backgroundImage: `url("${imageUrl}")`,
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency } = useStorefrontCurrency();
  const displayedPrice = currency === "NGN" ? product.priceDisplayNgn : product.priceDisplay;

  return (
    <Link aria-label={product.title} className="group grid gap-4" href={`/products/${product.slug}`}>
      <article className="grid gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(var(--border-strong),0.42)] bg-[rgb(var(--surface-strong))]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-200 group-hover:scale-[1.03]"
            style={buildImageBackground(product.imageUrl)}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(9, 19, 31, 0.10) 0%, rgba(9, 19, 31, 0.02) 28%, rgba(9, 19, 31, 0.64) 100%)",
            }}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[rgba(255,255,255,0.14)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              <span>{product.category}</span>
              <span className="h-1 w-1 rounded-full bg-white/70" />
              <span>MOQ {product.effectiveMoq}</span>
            </div>
            <span className="rounded-full bg-[rgba(255,255,255,0.92)] px-3 py-1.5 text-xs font-semibold text-[rgb(var(--text-primary))] shadow-[0_14px_35px_rgba(9,19,31,0.12)]">
              {displayedPrice}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 grid gap-3 p-4">
            <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/75">
              <span>Shipping billed later</span>
              <span>{currency} view</span>
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-t border-[rgba(var(--border-subtle),0.92)] pt-4">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">{product.title}</h3>
          <p className="max-w-[34ch] text-sm leading-6 text-[rgb(var(--text-secondary))]">{product.description}</p>
        </div>
      </article>
    </Link>
  );
}
