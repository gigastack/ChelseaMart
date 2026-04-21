import Link from "next/link";
import { CartList } from "@/components/storefront/cart-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { listCheckoutCartItems } from "@/lib/orders/repository";
import { cn } from "@/lib/utils";

export default async function CartPage() {
  const cartItems = await listCheckoutCartItems();
  const subtotal = cartItems.reduce((sum, item) => sum + item.sellPriceNgn * item.quantity, 0);
  const subtotalCny = cartItems.reduce((sum, item) => sum + item.sellPriceCny * item.quantity, 0);

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-[var(--max-shell)] space-y-8 px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div className="space-y-3">
            <Badge>Cart</Badge>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-[rgb(var(--text-primary))]">
                Product payment stays clean here. Shipping comes later with evidence.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
                The cart only carries product value and MOQ truth. Route choice and route terms happen in checkout,
                while the shipping invoice only exists after warehouse measurement and proof upload.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Cart total now</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
                NGN {subtotal.toLocaleString("en-NG")}
              </p>
              <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">CNY reference: CN¥{subtotalCny.toFixed(2)}</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
              This cart is prefilled to satisfy effective MOQ. Checkout will still stop if any product falls below its minimum.
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
          <CartList items={cartItems} />

          <aside className="grid gap-4 xl:sticky xl:top-[calc(var(--header-height)+2rem)]">
            <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6 shadow-[0_18px_50px_rgba(4,47,46,0.05)]">
              <div className="space-y-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Product-only payment</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
                    NGN {subtotal.toLocaleString("en-NG")}
                  </p>
                </div>
                <div className="grid gap-3 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 text-sm text-[rgb(var(--text-secondary))]">
                  <div className="flex items-center justify-between gap-4">
                    <span>Product subtotal</span>
                    <span className="font-medium text-[rgb(var(--text-primary))]">NGN {subtotal.toLocaleString("en-NG")}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Shipping invoice</span>
                    <span className="font-medium text-[rgb(var(--text-primary))]">Deferred</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Settlement flow</span>
                    <span className="font-medium text-[rgb(var(--text-primary))]">NGN now / NGN later</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Next</p>
              <p className="mt-3 text-sm leading-7 text-[rgb(var(--text-secondary))]">
                Choose the consignee, accept the shipping route terms, and pay only for products. Logistics stays outside the first charge.
              </p>
              <Link className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")} href="/checkout">
                Continue to checkout
              </Link>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
