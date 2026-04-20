import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    description: "Products stay stored in the local catalog, priced in CNY, and converted to NGN only when payment begins.",
    title: "CNY-native merchandising",
  },
  {
    description: "Customers pick a route and accept its terms before the first payment, then settle logistics only after warehouse proof exists.",
    title: "Two-phase trust",
  },
  {
    description: "The customer account and admin surface both show the same warehouse milestones, invoices, and evidence chain.",
    title: "Shared operational truth",
  },
];

type StorefrontHomePageProps = {
  products: StorefrontProductRecord[];
};

export function StorefrontHomePage({ products }: StorefrontHomePageProps) {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface-base))]">
      <section className="border-b border-[rgb(var(--border-subtle))]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:px-12 lg:py-20">
          <div className="space-y-8">
            <Badge>Storefront</Badge>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand-600))]">
                Cargo-led commerce for deliberate buyers
              </p>
              <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.05em] text-[rgb(var(--text-primary))] sm:text-6xl">
                Curated product buying with the logistics truth kept visible from the first route choice to the final invoice.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[rgb(var(--text-secondary))]">
                Browse in CNY or NGN, pay for products in Naira, then settle a measured shipping invoice only after the
                warehouse uploads proof. No hidden landed cost theatre.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={cn(buttonVariants({ variant: "primary" }))} href="/catalog">
                Enter catalog
              </Link>
              <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/account/orders">
                Review service center
              </Link>
            </div>
          </div>

          <div className="grid gap-6 border-t border-[rgb(var(--border-subtle))] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="grid gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">
                Cargo Ledger
              </p>
              <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                Calm browse surface. Operationally honest back office.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">
                  Product display
                </p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">CNY first</p>
              </div>
              <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">
                  Product payment
                </p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">NGN only</p>
              </div>
              <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">
                  Logistics invoice
                </p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">USD shown, NGN settled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 lg:grid-cols-3 lg:px-12">
        {featureCards.map((card) => (
          <div key={card.title} className="border-t border-[rgb(var(--border-subtle))] pt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgb(var(--brand-600))]">{card.title}</p>
            <p className="mt-3 max-w-[30ch] text-sm leading-7 text-[rgb(var(--text-secondary))]">{card.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-16 lg:px-12">
        <div className="grid gap-4 border-t border-[rgb(var(--border-subtle))] pt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Featured manifest</p>
            <h2 className="font-serif text-4xl tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Fewer listings. Cleaner price truth. Better follow-through after checkout.
            </h2>
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{products.length} products surfaced</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
