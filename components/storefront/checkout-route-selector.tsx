"use client";

import type { ShippingRouteRecord } from "@/lib/orders/repository";
import { cn } from "@/lib/utils";

type CheckoutRouteSelectorProps = {
  onRouteChange: (routeId: string) => void;
  routeId: string;
  routes: ShippingRouteRecord[];
};

export function CheckoutRouteSelector({ onRouteChange, routeId, routes }: CheckoutRouteSelectorProps) {
  return (
    <div className="grid gap-4">
      <p className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] px-4 py-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
        Final shipping cost is confirmed only after warehouse measurement and proof upload.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {routes.map((route) => (
          <button
            aria-pressed={routeId === route.id}
            key={route.id}
            className={cn(
              "grid gap-4 rounded-[var(--radius-lg)] border p-5 text-left transition-colors",
              routeId === route.id
                ? "border-[rgb(var(--brand-600))] bg-[rgba(var(--brand-500),0.08)]"
                : "border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))]",
            )}
            onClick={() => onRouteChange(route.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                  {route.mode}
                </p>
                <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{route.title}</p>
              </div>
              <span className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-secondary))]">
                {route.etaDaysMin}-{route.etaDaysMax} days
              </span>
            </div>

            <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
              <p>
                {route.originLabel} to {route.destinationLabel}
              </p>
              <p className="font-medium text-[rgb(var(--text-primary))]">{route.formulaLabel}</p>
            </div>

            <div className="grid gap-3 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
              <p>{route.termsSummary}</p>
              <p>
                Shipping is not charged here. This route only establishes how warehouse measurement will later produce the logistics invoice.
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
