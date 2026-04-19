"use client";

import type { CheckoutRoute } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

type CheckoutRouteSelectorProps = {
  onRouteChange: (route: CheckoutRoute) => void;
  route: CheckoutRoute;
};

const routeOptions: { description: string; route: CheckoutRoute; title: string }[] = [
  {
    description: "Faster delivery into Nigeria hubs with higher per-line logistics pricing.",
    route: "air",
    title: "Air",
  },
  {
    description: "Lower logistics pricing with a slower arrival timeline into Nigeria hubs.",
    route: "sea",
    title: "Sea",
  },
];

export function CheckoutRouteSelector({ onRouteChange, route }: CheckoutRouteSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {routeOptions.map((option) => (
        <button
          aria-pressed={route === option.route}
          key={option.route}
          className={cn(
            "rounded-[var(--radius-lg)] border p-5 text-left transition-colors",
            route === option.route
              ? "border-[rgb(var(--brand-600))] bg-[rgba(var(--brand-600),0.08)]"
              : "border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))]",
          )}
          onClick={() => onRouteChange(option.route)}
          type="button"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">{option.title}</p>
          <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-secondary))]">{option.description}</p>
        </button>
      ))}
    </div>
  );
}
