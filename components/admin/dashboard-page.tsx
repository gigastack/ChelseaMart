import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type OverviewTile = {
  description: string;
  title: string;
  value: string;
};

type AdminDashboardPageProps = {
  overviewTiles: OverviewTile[];
};

export function AdminDashboardPage({ overviewTiles }: AdminDashboardPageProps) {
  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge>Admin shell</Badge>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                Operations control room
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
                Warehouse intake, customer invoicing, catalog readiness, and revenue split should all be readable from
                the first screen. This dashboard now frames the two-phase commerce model instead of acting like a
                placeholder.
              </p>
            </div>
          </div>
          <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))] lg:text-right">
            <Link className="font-medium text-[rgb(var(--brand-600))] underline-offset-4 hover:underline" href="/admin/orders">
              Open warehouse queue
            </Link>
            <Link className="font-medium text-[rgb(var(--brand-600))] underline-offset-4 hover:underline" href="/admin/settings">
              Review rates and MOQ
            </Link>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--brand-950),0.98)_0%,rgba(var(--brand-800),0.9)_100%)] text-[rgb(var(--surface-card))]">
            <CardHeader>
              <CardDescription className="text-[rgba(255,255,255,0.72)]">Live operating posture</CardDescription>
              <CardTitle className="text-[rgb(var(--surface-card))]">
                Product settlement and logistics settlement stay separated all the way through delivery.
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm leading-6 text-[rgba(255,255,255,0.82)] md:grid-cols-3">
              <p>Catalog pricing remains native in CNY, with NGN shown only as the payable product-settlement view.</p>
              <p>Warehouse measurement and proof are the authoritative trigger for the USD logistics invoice.</p>
              <p>Admin settings now own the two active exchange rates and the global MOQ that new products inherit.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Priority links</CardDescription>
              <CardTitle>Move directly to the queues that need action</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Link className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] px-4 py-3 text-[rgb(var(--text-primary))] transition-colors hover:bg-[rgb(var(--surface-alt))]" href="/admin/orders">
                Orders and warehouse queue
              </Link>
              <Link className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] px-4 py-3 text-[rgb(var(--text-primary))] transition-colors hover:bg-[rgb(var(--surface-alt))]" href="/admin/products">
                Catalog and publish readiness
              </Link>
              <Link className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] px-4 py-3 text-[rgb(var(--text-primary))] transition-colors hover:bg-[rgb(var(--surface-alt))]" href="/admin/bi">
                BI and payment funnel
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {overviewTiles.map((tile) => (
            <Card key={tile.title} className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
              <CardHeader>
                <CardDescription>{tile.title}</CardDescription>
                <CardTitle>{tile.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
                <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">{tile.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
