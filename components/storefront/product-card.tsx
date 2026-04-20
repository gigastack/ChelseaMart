import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export type StorefrontProductCardViewModel = {
  id: string;
  imageUrl: string;
  priceDisplay: string;
  slug: string;
  title: string;
};

type ProductCardProps = {
  product: StorefrontProductCardViewModel;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link className="group block" href={`/products/${product.slug}`}>
      <Card className="overflow-hidden border-none bg-transparent shadow-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(160deg,rgba(var(--brand-950),0.95)_0%,rgba(var(--brand-600),0.22)_100%)]">
          <div className="absolute inset-0 scale-100 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_70%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="rounded-full bg-[rgba(255,255,255,0.16)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-white/80">
              Curated
            </div>
            <div className="rounded-full bg-[rgb(var(--text-primary))] px-3 py-1 text-xs font-semibold text-[rgb(var(--surface-card))]">
              {product.priceDisplay}
            </div>
          </div>
        </div>
        <CardContent className="space-y-2 px-0 pb-0 pt-4">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[rgb(var(--text-primary))]">{product.title}</h3>
          <p className="text-sm text-[rgb(var(--text-secondary))]">Logistics added at checkout</p>
        </CardContent>
      </Card>
    </Link>
  );
}
