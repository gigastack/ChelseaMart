import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CheckoutSummaryProps = {
  summary: {
    currency: "NGN";
    grandTotalNgn: number;
    itemsSubtotalNgn: number;
    logisticsTotalNgn: number;
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
        <CardTitle>Payment stays in {summary.currency}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
          <span>Product subtotal</span>
          <span>{formatNgn(summary.itemsSubtotalNgn)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
          <span>Logistics total</span>
          <span>{formatNgn(summary.logisticsTotalNgn)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[rgb(var(--border-subtle))] pt-4 text-base font-semibold text-[rgb(var(--text-primary))]">
          <span>Grand total</span>
          <span>{formatNgn(summary.grandTotalNgn)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
