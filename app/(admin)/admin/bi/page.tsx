import { BiDrilldownTable } from "@/components/admin/bi-drilldown-table";
import { BiFilterBar } from "@/components/admin/bi-filter-bar";
import { BiKpiGrid } from "@/components/admin/bi-kpi-grid";
import { BiSalesChart } from "@/components/admin/bi-sales-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBiDashboard } from "@/lib/bi/get-bi-dashboard";

export default async function AdminBiPage() {
  const dashboard = await getBiDashboard({
    from: "2026-01-01",
    to: "2026-01-31",
  });

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <Badge>BI suite</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
            Decision-support dashboard
          </h1>
        </div>

        <BiFilterBar from={dashboard.executive.dateRange.from} to={dashboard.executive.dateRange.to} />
        <BiKpiGrid
          revenueNgn={dashboard.executive.revenueNgn}
          totalOrders={dashboard.executive.totalOrders}
          unavailable={dashboard.catalog.unavailable}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
          <BiSalesChart airCount={dashboard.sales.routeSplit.air} seaCount={dashboard.sales.routeSplit.sea} />
          <Card>
            <CardHeader>
              <CardDescription>Payments intelligence</CardDescription>
              <CardTitle>Webhook health: {dashboard.payments.webhookHealth}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
              <p>Success rate: {(dashboard.payments.successRate * 100).toFixed(0)}%</p>
              <p>Pending verification: {dashboard.payments.pendingVerification}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Top products</CardDescription>
            <CardTitle>Revenue drilldown</CardTitle>
          </CardHeader>
          <CardContent>
            <BiDrilldownTable rows={dashboard.sales.topProducts} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
