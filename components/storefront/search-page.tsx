import { ProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type StorefrontSearchPageProps = {
  products: StorefrontProductRecord[];
  query?: string;
};

export function StorefrontSearchPage({ products, query = "" }: StorefrontSearchPageProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? products.filter((product) => `${product.title} ${product.category}`.toLowerCase().includes(normalizedQuery))
    : products;

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
        <div className="space-y-3 border-b border-[rgb(var(--border-subtle))] pb-6">
          <Badge>Search</Badge>
          <div className="space-y-2">
            <h1 className="font-serif text-4xl tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {normalizedQuery ? `Results for “${query}”` : "Search catalog"}
            </h1>
            <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">
              {results.length} products found.
            </p>
          </div>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </section>
    </main>
  );
}
