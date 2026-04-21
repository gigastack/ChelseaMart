import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type StorefrontProductDetailPageProps = {
  product: StorefrontProductRecord | null;
};

export function StorefrontProductDetailPage({ product }: StorefrontProductDetailPageProps) {
  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-[var(--max-shell)] space-y-10 px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-4 border-b border-[rgba(var(--border-subtle),0.92)] pb-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
          <div className="space-y-3">
            <Badge>Product</Badge>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-[rgb(var(--text-primary))]">
                {product.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">{product.longDescription}</p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Quick facts</p>
            <div className="grid gap-3 text-sm text-[rgb(var(--text-secondary))]">
              <p>MOQ {product.effectiveMoq}</p>
              <p>Browse in CNY, pay in NGN.</p>
              <p>Shipping is billed after warehouse proof.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] xl:items-start">
          <div className="grid gap-8">
            <ProductGallery images={[product.imageUrl]} title={product.title} />

            <section className="grid gap-8 border-t border-[rgba(var(--border-subtle),0.92)] pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div className="space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
                  About this product
                </p>
                <p className="text-sm leading-7 text-[rgb(var(--text-secondary))]">{product.longDescription}</p>
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
                    Product payment
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                    NGN at checkout
                  </p>
                </div>

                <div className="border-t border-[rgba(var(--border-subtle),0.92)] pt-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping</p>
                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-secondary))]">The shipping invoice opens after warehouse measurement and proof upload.</p>
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
