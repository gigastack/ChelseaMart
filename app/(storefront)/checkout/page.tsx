import { CheckoutExperience } from "@/components/storefront/checkout-experience";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { listCheckoutCartItems, listCheckoutShippingRoutes, listConsignees } from "@/lib/orders/repository";
import { getCommerceSettings } from "@/lib/settings/repository";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function CheckoutPage() {
  const user = hasSupabaseAuthEnv() ? await requireAuthenticatedUser("/checkout") : null;

  const [cartItems, consignees, routes, settings] = await Promise.all([
    listCheckoutCartItems(),
    listConsignees(user?.id),
    listCheckoutShippingRoutes(),
    getCommerceSettings(),
  ]);

  if (!cartItems.length) {
    return (
      <main className="bg-[rgb(var(--surface-base))]">
        <section className="mx-auto max-w-[var(--max-shell)] space-y-6 px-6 py-14 lg:px-10">
          <Badge>Checkout</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">Your cart is empty.</h1>
            <p className="max-w-2xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Add products to the cart first, then return here to choose a route and pay for products.
            </p>
          </div>
          <Link className={cn(buttonVariants({ size: "lg" }))} href="/catalog">
            Browse catalog
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-[var(--max-shell)] px-6 py-10 lg:px-10 lg:py-12">
        <CheckoutExperience
          cartItems={cartItems}
          cnyToNgnRate={settings.cnyToNgnRate}
          consignees={consignees}
          routes={routes}
        />
      </section>
    </main>
  );
}
