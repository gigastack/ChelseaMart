import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";
import { cn } from "@/lib/utils";

const workflowSteps = [
  {
    description: "Products stay listed in CNY so browsing reflects the actual sourcing layer rather than a padded checkout view.",
    title: "Browse the catalog in native price language",
  },
  {
    description: "Customers choose and accept a route before product payment, so timing and charging logic are explicit from the start.",
    title: "Lock the route terms before the first payment",
  },
  {
    description: "Warehouse receipt, measurement, and proof create the second invoice only after the shipment is physically known.",
    title: "Settle logistics after evidence exists",
  },
];

const trustSignals = [
  "CNY browse with NGN preview",
  "MOQ carried into cart and checkout",
  "USD logistics invoice after proof",
];

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
  const secondaryProducts = products.slice(0, 3);

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="border-b border-[rgba(var(--border-subtle),0.92)]">
        <div className="mx-auto grid max-w-[var(--max-shell)] gap-8 px-6 py-10 lg:px-10 lg:py-12 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] xl:items-stretch">
          <div className="grid gap-8">
            <div className="grid gap-4">
              <Badge>Storefront</Badge>
              <h2 className="sr-only">
                Curated product buying with the logistics truth kept visible from the first route choice to the final invoice.
              </h2>
              <div className="space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand-600))]">
                  Cargo-led sourcing for deliberate buyers
                </p>
                <h1 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-[rgb(var(--text-primary))] sm:text-6xl xl:text-7xl">
                  Buy the product first. Keep logistics honest enough to wait for proof.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-[rgb(var(--text-secondary))]">
                  Chelsea Mart keeps product browsing calm and native in CNY, then moves route acceptance, warehouse
                  proof, and shipping invoicing into the operational phases where they actually belong.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={cn(buttonVariants({ size: "lg" }))} href="/catalog">
                Enter catalog
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "secondary" }))} href="/account/orders">
                Open service center
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {trustSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))]"
                >
                  {signal}
                </div>
              ))}
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
                    Hero product
                  </span>
                  <span className="rounded-full border border-white/16 bg-[rgba(9,19,31,0.42)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur">
                    Shipping billed later
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 grid gap-4 p-5 text-white">
                  <div className="grid gap-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">Featured line</p>
                    <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em]">{heroProduct?.title ?? "Curated catalog line"}</h2>
                    <p className="max-w-lg text-sm leading-6 text-white/80">
                      {heroProduct?.description ??
                        "Native product pricing now. Measured logistics later. One customer-facing truth all the way through delivery."}
                    </p>
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

            <div className="grid gap-4 md:grid-cols-3">
              {secondaryProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4"
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
                    {product.category}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
                    {product.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">MOQ {product.effectiveMoq} · {product.priceDisplay}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--max-shell)] gap-6 px-6 py-12 lg:px-10 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="space-y-3">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand-600))]">How the system works</p>
          <h2 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
            Merchandising stays calm because the operational truth is handled in the right phase.
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.title}
              className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5"
            >
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                Step {index + 1}
              </p>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{step.title}</h3>
              <p className="text-sm leading-7 text-[rgb(var(--text-secondary))]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--max-shell)] gap-6 px-6 pb-16 lg:px-10 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="space-y-3 border-t border-[rgba(var(--border-subtle),0.92)] pt-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand-600))]">Featured manifest</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
            Curated product lines with MOQ visible and deferred shipping made explicit.
          </h2>
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
