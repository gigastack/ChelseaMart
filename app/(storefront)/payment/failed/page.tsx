import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PaymentFailedPage() {
  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-center">
        <Badge>Payment failed</Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Payment did not complete</h1>
        <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">Return to checkout with the same cart context and try again after confirming the NGN total.</p>
        <Link className={cn(buttonVariants())} href="/checkout">
          Retry checkout
        </Link>
      </section>
    </main>
  );
}
