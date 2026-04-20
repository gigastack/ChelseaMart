import { CheckoutExperience } from "@/components/storefront/checkout-experience";
import { Badge } from "@/components/ui/badge";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { listCheckoutCartItems, listCheckoutShippingRoutes, listConsignees } from "@/lib/orders/repository";
import { getCommerceSettings } from "@/lib/settings/repository";

export default async function CheckoutPage() {
  const user = hasSupabaseAuthEnv() ? await requireAuthenticatedUser("/checkout") : null;

  const [cartItems, consignees, routes, settings] = await Promise.all([
    listCheckoutCartItems(),
    listConsignees(user?.id),
    listCheckoutShippingRoutes(),
    getCommerceSettings(),
  ]);

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
        <div className="space-y-2">
          <Badge>Checkout</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
            Choose a route and pay for products only
          </h1>
        </div>
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
