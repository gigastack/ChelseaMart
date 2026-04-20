import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { reconcilePaystackPayment } from "@/lib/payments/reconcile-paystack-payment";
import { verifyPaystackTransaction } from "@/lib/payments/verify-paystack-transaction";
import { cn } from "@/lib/utils";

type PaymentPendingPageProps = {
  searchParams: Promise<{
    kind?: string | string[];
    reference?: string | string[];
    trxref?: string | string[];
  }>;
};

function readParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentPendingPage({ searchParams }: PaymentPendingPageProps) {
  const params = await searchParams;
  const kind = readParam(params.kind) === "shipping" ? "shipping" : "product";
  const reference = readParam(params.reference) ?? readParam(params.trxref);

  if (reference) {
    try {
      const verification = await verifyPaystackTransaction(reference);
      const result = await reconcilePaystackPayment({
        eventType: "callback.verify",
        note:
          verification.data.status === "success"
            ? "Customer returned from Paystack and payment verification succeeded."
            : "Customer returned from Paystack before final success state was confirmed.",
        payload: verification,
        paymentReference: verification.data.reference,
        transactionStatus: verification.data.status,
      });

      if (result.state === "paid") {
        redirect(`/payment/success?kind=${encodeURIComponent(kind)}&reference=${encodeURIComponent(reference)}`);
      }

      if (result.state === "failed") {
        redirect(`/payment/failed?kind=${encodeURIComponent(kind)}&reference=${encodeURIComponent(reference)}`);
      }
    } catch {
      // Keep the pending surface if verification is not ready yet.
    }
  }

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-center">
        <Badge>Payment pending</Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Verification in progress</h1>
        <p className="text-base leading-7 text-[rgb(var(--text-secondary))]">
          {kind === "shipping"
            ? "If Paystack has not completed shipping-payment verification yet, keep checking your order page instead of retrying the invoice."
            : "If Paystack has not completed product-payment verification yet, keep checking your order page instead of retrying checkout."}
        </p>
        <Link className={cn(buttonVariants({ variant: "secondary" }))} href="/account/orders">
          Check order status
        </Link>
      </section>
    </main>
  );
}
