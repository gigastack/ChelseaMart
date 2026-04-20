import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaymentFailedPageProps = {
  searchParams: Promise<{
    kind?: string | string[];
  }>;
};

function readParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentFailedPage({ searchParams }: PaymentFailedPageProps) {
  const params = await searchParams;
  const kind = readParam(params.kind) === "shipping" ? "shipping" : "product";

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-center">
        <Badge>Payment failed</Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Payment could not be completed</h1>
        <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">
          {kind === "shipping"
            ? "The order remains in your account with its shipping invoice still due. Review the proof and invoice before trying again."
            : "The order remains visible in your account. Review the product payment state before attempting checkout again."}
        </p>
        <div className="flex justify-center gap-4">
          <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/account/orders">
            View orders
          </Link>
          <Link className={cn(buttonVariants())} href={kind === "shipping" ? "/account/orders" : "/checkout"}>
            {kind === "shipping" ? "Return to orders" : "Return to checkout"}
          </Link>
        </div>
      </section>
    </main>
  );
}
