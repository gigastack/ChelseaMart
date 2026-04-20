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
      <section className="mx-auto max-w-7xl space-y-10 px-6 py-12 lg:px-12">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <ProductGallery images={[product.imageUrl]} title={product.title} />
          <ProductPurchasePanel product={product} />
        </div>

        <section className="grid gap-6 border-t border-[rgb(var(--border-subtle))] pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
              Purchase notes
            </p>
            <div className="grid gap-4 text-sm leading-7 text-[rgb(var(--text-secondary))]">
              <p>{product.longDescription}</p>
              <p>
                The browse surface stays focused on curated product pricing. Route selection and shipping terms are
                accepted in checkout, while the final logistics invoice is created only after warehouse measurement and
                proof upload.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">MOQ</p>
              <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">{product.effectiveMoq}</p>
            </div>
            <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Route posture</p>
              <p className="mt-2 text-sm leading-7 text-[rgb(var(--text-secondary))]">
                Air and Sea are both available. The route version is accepted before product payment, then the USD
                invoice is generated later from warehouse evidence.
              </p>
            </div>
            <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Specs</p>
              <div className="mt-3 grid gap-2">
                {product.specs.map((spec) => (
                  <div key={spec} className="flex items-start gap-3 text-sm text-[rgb(var(--text-secondary))]">
                    <Badge>Spec</Badge>
                    <p>{spec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
