import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PaymentSuccessPage() {
  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-center">
        <Badge>Payment success</Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Payment confirmed</h1>
        <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">
          Your order has been confirmed and is now visible in your account timeline.
        </p>
        <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/account/orders">
          View orders
        </Link>
      </section>
    </main>
  );
}
