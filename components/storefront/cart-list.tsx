import Link from "next/link";
import type { CartItemRecord } from "@/lib/orders/repository";

type CartListProps = {
  items: CartItemRecord[];
};

function buildImageBackground(imageUrl: string) {
  return {
    backgroundImage: `url("${imageUrl}")`,
  };
}

export function CartList({ items }: CartListProps) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5 shadow-[0_18px_50px_rgba(4,47,46,0.05)] sm:grid-cols-[132px_minmax(0,1fr)]"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] border border-[rgba(var(--border-strong),0.42)] bg-[rgb(var(--surface-strong))]">
            <div className="absolute inset-0 bg-cover bg-center" style={buildImageBackground(item.imageUrl)} />
            <div className="absolute inset-0 bg-[rgba(9,19,31,0.14)]" />
          </div>

          <div className="grid gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Link className="text-xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]" href={`/products/${item.slug}`}>
                  {item.title}
                </Link>
                <div className="flex flex-wrap gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                  <span className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-3 py-1">MOQ {item.effectiveMoq}</span>
                  <span className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-3 py-1">Qty {item.quantity}</span>
                  <span className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-3 py-1">Air + Sea</span>
                </div>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-sm text-[rgb(var(--text-secondary))]">{item.priceDisplay} reference</p>
                <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                  NGN {(item.sellPriceNgn * item.quantity).toLocaleString("en-NG")}
                </p>
              </div>
            </div>

            <div className="grid gap-3 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 md:grid-cols-3">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Unit reference</p>
                <p className="mt-2 text-sm font-medium text-[rgb(var(--text-primary))]">{item.priceDisplay}</p>
                <p className="text-sm text-[rgb(var(--text-secondary))]">{item.priceDisplayNgn} at checkout</p>
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">MOQ enforcement</p>
                <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                  This cart line is prefilled at the effective MOQ so checkout never starts below the minimum.
                </p>
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping posture</p>
                <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                  No logistics charge is included here. Route acceptance happens next, and shipping opens only after warehouse proof.
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
