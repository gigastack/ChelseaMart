import Link from "next/link";
import { clearCartAction } from "@/app/(storefront)/cart/actions";
import { CartList } from "@/components/storefront/cart-list";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { listCheckoutCartItems } from "@/lib/orders/repository";
import { cn } from "@/lib/utils";

type CartPageProps = {
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export default async function CartPage({ searchParams }: CartPageProps) {
  const cartItems = await listCheckoutCartItems();
  const params = (await (searchParams ?? Promise.resolve({}))) as { error?: string; updated?: string };
  const subtotal = cartItems.reduce((sum, item) => sum + item.sellPriceNgn * item.quantity, 0);
  const subtotalCny = cartItems.reduce((sum, item) => sum + item.sellPriceCny * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!cartItems.length) {
    return (
      <main className="bg-[rgb(var(--surface-base))]">
        <section className="mx-auto max-w-[var(--max-shell)] space-y-6 px-6 py-14 lg:px-10">
          <Badge>Cart</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">Your cart is empty.</h1>
            <p className="max-w-2xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Add products first, then come back here to review quantities before checkout.
            </p>
          </div>
          <Link className={cn(buttonVariants({ size: "lg" }))} href="/catalog">
            Continue shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-[var(--max-shell)] space-y-8 px-6 py-10 lg:px-10 lg:py-12">
        {params.updated ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--brand-500),0.25)] bg-[rgba(var(--brand-500),0.08)] px-4 py-3 text-sm text-[rgb(var(--text-primary))]">
            {params.updated === "cleared"
              ? "Cart cleared."
              : params.updated === "removed"
                ? "Item removed from cart."
                : `${params.updated} updated.`}
          </div>
        ) : null}
        {params.error ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--danger),0.25)] bg-[rgba(var(--danger),0.08)] px-4 py-3 text-sm text-[rgb(var(--text-primary))]">
            {params.error}
          </div>
        ) : null}

        <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div className="space-y-3">
            <Badge>Cart</Badge>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-[rgb(var(--text-primary))]">
                Review products now. Shipping comes later.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
                Check quantities, keep MOQ valid, and move on to checkout when you are ready.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Products in cart</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{itemCount}</p>
              <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">NGN {subtotal.toLocaleString("en-NG")} due for products at checkout</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">CNY reference</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
                CN¥{subtotalCny.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">Shipping is billed separately after warehouse measurement.</p>
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
                Choose the consignee, accept the route terms, and pay only for products. Shipping stays outside the first charge.
              </p>
              <Link className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")} href="/checkout">
                Continue to checkout
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "mt-3 w-full")} href="/catalog">
                Keep shopping
              </Link>
              <form action={clearCartAction} className="mt-3">
                <Button className="w-full" type="submit" variant="ghost">
                  Clear cart
                </Button>
              </form>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
