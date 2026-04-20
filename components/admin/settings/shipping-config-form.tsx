import type { ShippingRouteRecord } from "@/lib/orders/repository";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ShippingConfigFormProps = {
  routes: ShippingRouteRecord[];
};

export function ShippingConfigForm({ routes }: ShippingConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Route ledger</CardDescription>
        <CardTitle>Customer-facing shipping routes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {routes.map((route) => (
          <div key={route.id} className="grid gap-2 border-t border-[rgb(var(--border-subtle))] pt-4 text-sm text-[rgb(var(--text-secondary))]">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold uppercase tracking-[0.14em] text-[rgb(var(--text-primary))]">
                {route.mode} · {route.title}
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-[rgb(var(--text-muted))]">
                {route.etaDaysMin}-{route.etaDaysMax} days
              </p>
            </div>
            <p>
              {route.originLabel} to {route.destinationLabel}
            </p>
            <p>{route.formulaLabel}</p>
            <p>{route.termsSummary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
