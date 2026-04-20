import { ProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type StorefrontCatalogPageProps = {
  categories: string[];
  products: StorefrontProductRecord[];
};

export function StorefrontCatalogPage({ categories, products }: StorefrontCatalogPageProps) {
  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
        <div className="grid gap-4 border-b border-[rgb(var(--border-subtle))] pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <Badge>Catalog</Badge>
          <div className="space-y-2">
            <h1 className="font-serif text-4xl tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Curated products, ledger-style price truth, and no supplier clutter.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Browse CNY-native products with NGN preview support, visible minimum order rules, and route terms that
              stay separate from the browse surface.
            </p>
          </div>
          <p className="text-sm uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">{products.length} active lines</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))]"
            >
              {category}
            </span>
          ))}
        </div>

        <section className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </section>
    </main>
  );
}
