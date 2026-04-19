import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BiSalesChartProps = {
  airCount: number;
  seaCount: number;
};

export function BiSalesChart({ airCount, seaCount }: BiSalesChartProps) {
  const total = airCount + seaCount || 1;

  return (
    <Card>
      <CardHeader>
        <CardDescription>Sales intelligence</CardDescription>
        <CardTitle>Route split</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
              <span>Air</span>
              <span>{airCount}</span>
            </div>
            <div className="h-3 rounded-full bg-[rgb(var(--surface-alt))]">
              <div
                className="h-3 rounded-full bg-[rgb(var(--brand-600))]"
                style={{ width: `${(airCount / total) * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
              <span>Sea</span>
              <span>{seaCount}</span>
            </div>
            <div className="h-3 rounded-full bg-[rgb(var(--surface-alt))]">
              <div
                className="h-3 rounded-full bg-[rgb(var(--text-primary))]"
                style={{ width: `${(seaCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
