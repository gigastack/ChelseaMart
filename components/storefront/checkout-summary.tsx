import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CheckoutSummaryProps = {
  summary: {
    currency: "NGN";
    payNowTotalNgn: number;
    productSubtotalNgn: number;
    serviceFeeNgn: number;
  };
};

function formatNgn(value: number) {
  return `NGN ${value.toLocaleString("en-NG")}`;
}

export function CheckoutSummary({ summary }: CheckoutSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Checkout summary</CardDescription>
        <CardTitle>Pay now in {summary.currency}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
          <span>Product subtotal</span>
          <span>{formatNgn(summary.productSubtotalNgn)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
          <span>Marketplace service fee</span>
          <span>{formatNgn(summary.serviceFeeNgn)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[rgb(var(--border-subtle))] pt-4 text-base font-semibold text-[rgb(var(--text-primary))]">
          <span>Product payment due now</span>
          <span>{formatNgn(summary.payNowTotalNgn)}</span>
        </div>
        <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
          Shipping is billed separately after warehouse measurement and proof upload. No logistics charge is collected
          in this first payment.
        </p>
      </CardContent>
    </Card>
  );
}
