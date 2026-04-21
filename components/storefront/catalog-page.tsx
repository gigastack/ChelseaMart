import { ProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type StorefrontCatalogPageProps = {
  categories: string[];
  products: StorefrontProductRecord[];
};

const catalogSignals = [
  "CNY pricing on the browse surface",
  "MOQ visible on every product line",
  "Shipping remains outside product checkout",
];

export function StorefrontCatalogPage({ categories, products }: StorefrontCatalogPageProps) {
  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-[var(--max-shell)] space-y-8 px-6 py-10 lg:px-10 lg:py-12">
        <h2 className="sr-only">Curated products</h2>
        <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
          <div className="space-y-3">
            <Badge>Catalog</Badge>
            <div className="space-y-3">
              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-[rgb(var(--text-primary))]">
                A calmer product grid with the commercial truth left intact.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
                The catalog stays product-first: CNY-native prices, visible MOQ, route selection deferred to checkout,
                and shipping invoicing deferred until warehouse proof exists.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {catalogSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm text-[rgb(var(--text-secondary))]"
              >
                {signal}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-[rgba(var(--border-strong),0.58)] bg-[rgba(var(--surface-card),0.92)] px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))]"
              >
                {category}
              </span>
            ))}
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{products.length} active lines</p>
        </div>

        <section className="grid gap-8 border-t border-[rgba(var(--border-subtle),0.92)] pt-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </section>
    </main>
  );
}
