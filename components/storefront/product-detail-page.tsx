import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <Card>
            <CardHeader>
              <CardDescription>Description</CardDescription>
              <CardTitle>What to expect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-[rgb(var(--text-secondary))]">
              <p>{product.longDescription}</p>
              <p>
                This listing shows the curated product price only. Route-based logistics is calculated later in
                checkout so the buyer can choose Air or Sea without cluttering the browse surface.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Specifications</CardDescription>
              <CardTitle>Quick details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.specs.map((spec) => (
                <div
                  key={spec}
                  className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] px-4 py-3 text-sm text-[rgb(var(--text-secondary))]"
                >
                  <Badge className="mb-2">Spec</Badge>
                  <p>{spec}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
