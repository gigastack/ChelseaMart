import { CheckoutExperience } from "@/components/storefront/checkout-experience";
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
