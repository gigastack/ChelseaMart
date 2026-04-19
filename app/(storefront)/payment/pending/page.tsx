import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PaymentPendingPage() {
  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-center">
        <Badge>Payment pending</Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Verification in progress</h1>
        <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">If Paystack has not completed verification yet, keep checking your order page instead of retrying multiple payments.</p>
        <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/account/orders">
          Check order status
        </Link>
      </section>
    </main>
  );
}
