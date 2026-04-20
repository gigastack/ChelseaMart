import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    kind?: string | string[];
  }>;
};

function readParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const params = await searchParams;
  const kind = readParam(params.kind) === "shipping" ? "shipping" : "product";

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-center">
        <Badge>Payment success</Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Payment confirmed</h1>
        <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">
          {kind === "shipping"
            ? "Your shipping invoice has been paid. The order can now advance into transit."
            : "Your product payment has been confirmed and the order is now in the warehouse flow."}
        </p>
        <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/account/orders">
          View orders
        </Link>
      </section>
    </main>
  );
}
