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
    <div className="grid gap-4 md:grid-cols-2">
      {routes.map((route) => (
        <button
          aria-pressed={routeId === route.id}
          key={route.id}
          className={cn(
            "rounded-[var(--radius-lg)] border p-5 text-left transition-colors",
            routeId === route.id
              ? "border-[rgb(var(--brand-600))] bg-[rgba(var(--brand-600),0.08)]"
              : "border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))]",
          )}
          onClick={() => onRouteChange(route.id)}
          type="button"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">
                {route.mode}
              </p>
              <p className="mt-2 text-lg font-semibold text-[rgb(var(--text-primary))]">{route.title}</p>
            </div>
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              {route.etaDaysMin}-{route.etaDaysMax} days
            </p>
          </div>
          <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
            {route.originLabel} to {route.destinationLabel}
          </p>
          <p className="mt-4 text-sm font-medium text-[rgb(var(--text-primary))]">{route.formulaLabel}</p>
          <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-secondary))]">{route.termsSummary}</p>
        </button>
      ))}
    </div>
  );
}
