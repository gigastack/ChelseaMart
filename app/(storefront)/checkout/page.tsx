import { CheckoutExperience } from "@/components/storefront/checkout-experience";
import { Badge } from "@/components/ui/badge";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { listCheckoutCartItems, listConsignees, listRouteConfigs } from "@/lib/orders/repository";

export default async function CheckoutPage() {
  const user = hasSupabaseAuthEnv() ? await requireAuthenticatedUser("/checkout") : null;

  const [cartItems, consignees, routeConfigs] = await Promise.all([
    listCheckoutCartItems(),
    listConsignees(user?.id),
    listRouteConfigs(),
  ]);

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
        <div className="space-y-2">
          <Badge>Checkout</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Review the NGN total before payment</h1>
        </div>
        <CheckoutExperience cartItems={cartItems} consignees={consignees} routeConfigs={routeConfigs} />
      </section>
    </main>
  );
}
