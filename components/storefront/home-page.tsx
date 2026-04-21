import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";
import { cn } from "@/lib/utils";

type StorefrontHomePageProps = {
  products: StorefrontProductRecord[];
};

function buildImageBackground(imageUrl: string) {
  return {
    backgroundImage: `url("${imageUrl}")`,
  };
}

export function StorefrontHomePage({ products }: StorefrontHomePageProps) {
  const heroProduct = products[0] ?? null;
  const featuredProducts = products.slice(0, 4);

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="border-b border-[rgba(var(--border-subtle),0.92)]">
        <div className="mx-auto grid max-w-[var(--max-shell)] gap-8 px-6 py-10 lg:px-10 lg:py-12 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] xl:items-stretch">
          <div className="grid gap-8">
            <div className="grid gap-4">
              <Badge>Storefront</Badge>
              <div className="space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand-600))]">
                  Chelsea Mart
                </p>
                <h1 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-[rgb(var(--text-primary))] sm:text-6xl xl:text-7xl">
                  Source products in CNY. Pay in Naira. Handle shipping later.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-[rgb(var(--text-secondary))]">
                  Browse the latest catalog, keep MOQ visible, and move to checkout only when you are ready.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={cn(buttonVariants({ size: "lg" }))} href="/catalog">
                Shop catalog
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "secondary" }))} href="/account/orders">
                Track orders
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[rgba(var(--border-strong),0.46)] bg-[rgb(var(--surface-strong))]">
              <div className="relative aspect-[4/5]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={buildImageBackground(heroProduct?.imageUrl ?? "/ProductImage.jpg")}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(9, 19, 31, 0.08) 0%, rgba(9, 19, 31, 0.04) 22%, rgba(9, 19, 31, 0.72) 100%)",
                  }}
                />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-5">
                  <span className="rounded-full border border-white/16 bg-[rgba(255,255,255,0.14)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
                    Featured product
                  </span>
                  <span className="rounded-full border border-white/16 bg-[rgba(9,19,31,0.42)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
                    Shipping billed later
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 grid gap-4 p-5 text-white">
                  <div className="grid gap-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Featured line</p>
                    <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em]">{heroProduct?.title ?? "Latest catalog pick"}</h2>
                    <p className="max-w-lg text-sm leading-6 text-white/80">{heroProduct?.description ?? "MOQ stays visible. Shipping is billed later."}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[var(--radius-md)] border border-white/14 bg-[rgba(9,19,31,0.3)] px-4 py-3 backdrop-blur">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/68">Browse</p>
                      <p className="mt-2 text-xl font-semibold">CNY first</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] border border-white/14 bg-[rgba(9,19,31,0.3)] px-4 py-3 backdrop-blur">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/68">Checkout</p>
                      <p className="mt-2 text-xl font-semibold">NGN only</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] border border-white/14 bg-[rgba(9,19,31,0.3)] px-4 py-3 backdrop-blur">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/68">Logistics</p>
                      <p className="mt-2 text-xl font-semibold">USD shown</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featuredProducts.slice(0, 2).map((product) => (
                <Link
                  key={product.id}
                  className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4 transition-colors hover:bg-[rgb(var(--surface-alt))]"
                  href={`/products/${product.slug}`}
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">{product.category}</p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">{product.title}</p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">MOQ {product.effectiveMoq} · {product.priceDisplay}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--max-shell)] gap-6 px-6 pb-16 lg:px-10 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="space-y-3 border-t border-[rgba(var(--border-subtle),0.92)] pt-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand-600))]">Catalog</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">Latest products</h2>
          <p className="text-sm uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{products.length} products surfaced</p>
        </div>

        <div className="grid gap-8 border-t border-[rgba(var(--border-subtle),0.92)] pt-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
