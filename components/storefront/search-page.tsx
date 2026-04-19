import { ProductCard } from "@/components/storefront/product-card";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";

type StorefrontSearchPageProps = {
  products: StorefrontProductRecord[];
  query?: string;
};

export function StorefrontSearchPage({ products, query = "product" }: StorefrontSearchPageProps) {
  const results = products.filter((product) =>
    `${product.title} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
        <div className="space-y-3">
          <Badge>Search</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">
              {results.length} curated products matched your search.
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
