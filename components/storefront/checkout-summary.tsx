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
    <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-strong),0.46)] bg-[rgba(var(--surface-card),0.96)] p-6 shadow-[0_24px_70px_rgba(4,47,46,0.08)] backdrop-blur xl:sticky xl:top-[calc(var(--header-height)+2rem)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">3. Review and pay</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Products now, shipping later</h2>
        </div>

        <div className="grid gap-3 border-y border-[rgba(var(--border-subtle),0.92)] py-4 text-sm">
          <div className="flex items-center justify-between gap-4 text-[rgb(var(--text-secondary))]">
            <span>Product subtotal</span>
            <span className="font-medium text-[rgb(var(--text-primary))]">{formatNgn(summary.productSubtotalNgn)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[rgb(var(--text-secondary))]">
            <span>CNY reference</span>
            <span className="font-medium text-[rgb(var(--text-primary))]">{formatCny(summary.productSubtotalCny)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[rgb(var(--text-secondary))]">
            <span>CNY to NGN rate</span>
            <span className="font-medium text-[rgb(var(--text-primary))]">{summary.cnyToNgnRate.toLocaleString("en-NG")}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[rgb(var(--text-secondary))]">
            <span>Marketplace service fee</span>
            <span className="font-medium text-[rgb(var(--text-primary))]">{formatNgn(summary.serviceFeeNgn)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[rgb(var(--text-secondary))]">
            <span>Shipping collected now</span>
            <span className="font-medium text-[rgb(var(--text-primary))]">Not charged</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-base font-semibold text-[rgb(var(--text-primary))]">
          <span>Product payment due now</span>
          <span>{formatNgn(summary.payNowTotalNgn)}</span>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
          Shipping is billed separately and becomes payable only after warehouse measurement and proof upload.
        </div>
      </div>
    </section>
  );
}
