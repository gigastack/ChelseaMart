import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type StorefrontProductDetailPageProps = {
  product: StorefrontProductRecord | null;
};

const purchaseSignals = [
  "Route is accepted before the first payment.",
  "Shipping is measured and invoiced later.",
  "Warehouse proof is surfaced in the customer account.",
];

export function StorefrontProductDetailPage({ product }: StorefrontProductDetailPageProps) {
  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-[var(--max-shell)] space-y-10 px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-4 border-b border-[rgba(var(--border-subtle),0.92)] pb-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
          <div className="space-y-3">
            <Badge>Product record</Badge>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-[rgb(var(--text-primary))]">
                {product.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">{product.longDescription}</p>
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
              Purchase posture
            </p>
            <div className="grid gap-3">
              {purchaseSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm leading-6 text-[rgb(var(--text-secondary))]"
                >
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] xl:items-start">
          <div className="grid gap-8">
            <ProductGallery images={[product.imageUrl]} title={product.title} />

            <section className="grid gap-8 border-t border-[rgba(var(--border-subtle),0.92)] pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div className="space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
                  Product notes
                </p>
                <div className="grid gap-4 text-sm leading-7 text-[rgb(var(--text-secondary))]">
                  <p>{product.longDescription}</p>
                  <p>
                    The browse surface stays clean on purpose. Route choice, route terms, and shipping payment are
                    handled in later steps so the first product decision is honest about what is known now versus what
                    is confirmed after the warehouse touches the goods.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="border-t border-[rgba(var(--border-subtle),0.92)] pt-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                    Effective MOQ
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                    {product.effectiveMoq}
                  </p>
                </div>

                <div className="border-t border-[rgba(var(--border-subtle),0.92)] pt-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                    Base weight
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                    {product.weightKg} KG
                  </p>
                </div>

                <div className="border-t border-[rgba(var(--border-subtle),0.92)] pt-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Specs</p>
                  <div className="mt-3 grid gap-2">
                    {product.specs.map((spec) => (
                      <div
                        key={spec}
                        className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm text-[rgb(var(--text-secondary))]"
                      >
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <ProductPurchasePanel product={product} />
        </div>
      </section>
    </main>
  );
}
