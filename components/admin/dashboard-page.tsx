import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
                This dashboard is the foundation for imports, catalog health, order operations, BI, and integration
                diagnostics. The data hooks are being built under typed server-side modules.
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          {overviewTiles.map((tile) => (
            <Card key={tile.title}>
              <CardHeader>
                <CardDescription>{tile.title}</CardDescription>
                <CardTitle>{tile.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">{tile.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
