import { BiDrilldownTable } from "@/components/admin/bi-drilldown-table";
import { BiFilterBar } from "@/components/admin/bi-filter-bar";
import { BiKpiGrid } from "@/components/admin/bi-kpi-grid";
import { BiSalesChart } from "@/components/admin/bi-sales-chart";
import { Badge } from "@/components/ui/badge";
import { getBiDashboard } from "@/lib/bi/get-bi-dashboard";

export default async function AdminBiPage() {
  const dashboard = await getBiDashboard({
    from: "2026-01-01",
    to: "2026-01-31",
  });
  const averageOrderValue =
    dashboard.executive.totalOrders === 0
      ? 0
      : Math.round(dashboard.executive.revenueNgn / dashboard.executive.totalOrders);
  const shippingMix =
    dashboard.executive.revenueNgn === 0
      ? 0
      : Math.round((dashboard.executive.shippingRevenueNgn / dashboard.executive.revenueNgn) * 100);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>BI suite</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Business intelligence
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Revenue, warehouse velocity, and catalog performance should sit beside finance and ops in the same frame
              so the split-ledger model stays legible without exporting raw tables first.
            </p>
          </div>
        </div>
        <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
            Decision notes
          </p>
          <div className="grid gap-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
            <p>Average order value is NGN {averageOrderValue.toLocaleString("en-NG")} in the active window.</p>
            <p>Shipping contributes {shippingMix}% of recognized revenue once the second payment clears.</p>
          </div>
        </div>
      </div>

      <BiFilterBar from={dashboard.executive.dateRange.from} to={dashboard.executive.dateRange.to} />
      <BiKpiGrid
        revenueNgn={dashboard.executive.revenueNgn}
        totalOrders={dashboard.executive.totalOrders}
        unavailable={dashboard.catalog.unavailable}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <BiSalesChart airCount={dashboard.sales.routeSplit.air} seaCount={dashboard.sales.routeSplit.sea} />
        <article className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Payments intelligence</p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Webhook health: {dashboard.payments.webhookHealth}
            </h2>
          </div>
          <div className="grid gap-3 text-sm text-[rgb(var(--text-secondary))]">
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(var(--border-subtle),0.92)] pb-3">
              <span>Product revenue</span>
              <span className="font-medium text-[rgb(var(--text-primary))]">
                NGN {dashboard.executive.productRevenueNgn.toLocaleString("en-NG")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(var(--border-subtle),0.92)] pb-3">
              <span>Shipping revenue</span>
              <span className="font-medium text-[rgb(var(--text-primary))]">
                NGN {dashboard.executive.shippingRevenueNgn.toLocaleString("en-NG")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(var(--border-subtle),0.92)] pb-3">
              <span>Success rate</span>
              <span className="font-medium text-[rgb(var(--text-primary))]">
                {(dashboard.payments.successRate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(var(--border-subtle),0.92)] pb-3">
              <span>Pending verification</span>
              <span className="font-medium text-[rgb(var(--text-primary))]">{dashboard.payments.pendingVerification}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Shipping invoices due</span>
              <span className="font-medium text-[rgb(var(--text-primary))]">{dashboard.payments.shippingInvoicesDue}</span>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <article className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))]">
          <div className="grid gap-2 border-b border-[rgba(var(--border-subtle),0.92)] px-6 py-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Top products</p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Revenue drilldown</h2>
          </div>
          <div className="px-6 py-5">
            <BiDrilldownTable rows={dashboard.sales.topProducts} />
          </div>
        </article>

        <article className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Ops and catalog context</p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Read finance beside execution signals.
            </h2>
          </div>
          <div className="grid gap-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4">
              <p className="font-medium text-[rgb(var(--text-primary))]">Air vs sea remains balanced.</p>
              <p className="mt-2">
                Air orders: {dashboard.sales.routeSplit.air}. Sea orders: {dashboard.sales.routeSplit.sea}.
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4">
              <p className="font-medium text-[rgb(var(--text-primary))]">Catalog risk is currently low.</p>
              <p className="mt-2">{dashboard.catalog.unavailable} products are currently unavailable after admin scans.</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
