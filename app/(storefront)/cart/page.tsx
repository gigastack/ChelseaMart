import Link from "next/link";
import { CartList } from "@/components/storefront/cart-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listCheckoutCartItems } from "@/lib/orders/repository";
import { cn } from "@/lib/utils";

export default async function CartPage() {
  const cartItems = await listCheckoutCartItems();
  const subtotal = cartItems.reduce((sum, item) => sum + item.sellPriceNgn * item.quantity, 0);

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
        <div className="space-y-2">
          <Badge>Cart</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Guest cart stays lightweight</h1>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <CartList items={cartItems} />
          <Card>
            <CardHeader>
              <CardDescription>Summary</CardDescription>
              <CardTitle>NGN {subtotal.toLocaleString("en-NG")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
                Logistics is calculated at checkout after route selection. Cart subtotal excludes Air or Sea pricing.
              </p>
              <Link className={cn(buttonVariants(), "w-full")} href="/checkout">
                Proceed to checkout
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
