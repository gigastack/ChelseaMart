import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CheckoutSummaryProps = {
  summary: {
    cnyToNgnRate: number;
    currency: "NGN";
    payNowTotalNgn: number;
    productSubtotalCny: number;
    productSubtotalNgn: number;
    serviceFeeNgn: number;
  };
};

function formatCny(value: number) {
  return `CN¥${value.toFixed(2)}`;
}

function formatNgn(value: number) {
  return `NGN ${value.toLocaleString("en-NG")}`;
}

export function CheckoutSummary({ summary }: CheckoutSummaryProps) {
  return (
    <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.94)_0%,rgba(var(--surface-alt),0.9)_100%)] shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
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
          <span>CNY reference</span>
          <span>{formatCny(summary.productSubtotalCny)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
          <span>CNY to NGN rate</span>
          <span>{summary.cnyToNgnRate.toLocaleString("en-NG")}</span>
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
