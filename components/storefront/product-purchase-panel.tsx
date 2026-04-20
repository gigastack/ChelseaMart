import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type ProductPurchasePanelProps = {
  product: StorefrontProductRecord;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  return (
    <div className="space-y-6 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="space-y-3">
        <Badge>{product.category}</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{product.title}</h1>
          <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">{product.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-semibold text-[rgb(var(--text-primary))]">{product.priceDisplay}</p>
        <p className="text-sm text-[rgb(var(--text-secondary))]">
          Logistics fee is added at checkout after you choose Air or Sea.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Minimum order</p>
          <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">{product.moq}</p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Checkout currency</p>
          <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">NGN</p>
        </div>
      </div>

      <Button className="w-full">Add to cart</Button>
    </div>
  );
}
