import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/storefront/product-card";
import type { StorefrontProductRecord } from "@/lib/catalog/repository";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    description: "Curated products saved into a local catalog, not a volatile marketplace mirror.",
    title: "Curated sourcing",
  },
  {
    description: "Customers browse in NGN or USD, then complete payment in NGN with no currency ambiguity.",
    title: "Transparent checkout",
  },
  {
    description: "Air or Sea is chosen at checkout, with customer tracking driven by status updates.",
    title: "Operational clarity",
  },
];

type StorefrontHomePageProps = {
  products: StorefrontProductRecord[];
};

export function StorefrontHomePage({ products }: StorefrontHomePageProps) {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface-base))]">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div className="max-w-3xl space-y-6">
          <Badge>Premium trust commerce</Badge>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))] sm:text-5xl">
              Curated China sourcing for Nigerians who want a calmer, more reliable buying experience.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[rgb(var(--text-secondary))]">
              Browse a locally managed catalog, switch price display between NGN and USD, and complete orders with
              route-based logistics added only at checkout.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className={cn(buttonVariants({ variant: "primary" }))} href="/catalog">
              Shop products
            </Link>
            <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/search">
              Search catalog
            </Link>
          </div>
        </div>

        <Card className="max-w-xl bg-[linear-gradient(135deg,rgba(var(--brand-950),1)_0%,rgba(var(--brand-600),0.92)_100%)] text-[rgb(var(--surface-card))]">
          <CardHeader>
            <CardTitle className="text-[rgb(var(--surface-card))]">Built for curated imports, not marketplace chaos</CardTitle>
            <CardDescription className="text-[rgba(255,255,255,0.78)]">
              The storefront stays calm while the admin side handles sourcing, syncs, BI, and operational review.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] p-4">
              <p className="text-sm uppercase tracking-[0.08em] text-[rgba(255,255,255,0.7)]">Checkout currency</p>
              <p className="mt-2 text-2xl font-semibold">NGN only</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] p-4">
              <p className="text-sm uppercase tracking-[0.08em] text-[rgba(255,255,255,0.7)]">Display currencies</p>
              <p className="mt-2 text-2xl font-semibold">NGN / USD</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-3 lg:px-12">
        {featureCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-16 lg:px-12">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[rgb(var(--brand-600))]">Featured picks</p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
            Start with curated products instead of raw supplier noise
          </h2>
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
