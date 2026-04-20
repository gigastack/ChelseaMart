"use client";

import { useMemo, useState } from "react";
import { startCheckoutPaymentAction } from "@/app/(storefront)/checkout/actions";
import { CheckoutRouteSelector } from "@/components/storefront/checkout-route-selector";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CartItemRecord, ConsigneeRecord, ShippingRouteRecord } from "@/lib/orders/repository";

type CheckoutExperienceProps = {
  cartItems: CartItemRecord[];
  consignees: ConsigneeRecord[];
  routes: ShippingRouteRecord[];
};

function buildSummary(cartItems: CartItemRecord[]) {
  const productSubtotalNgn = cartItems.reduce((sum, item) => sum + item.sellPriceNgn * item.quantity, 0);
  const serviceFeeNgn = 0;

  return {
    currency: "NGN" as const,
    payNowTotalNgn: productSubtotalNgn + serviceFeeNgn,
    productSubtotalNgn,
    serviceFeeNgn,
  };
}

export function CheckoutExperience({ cartItems, consignees, routes }: CheckoutExperienceProps) {
  const defaultConsignee = consignees.find((consignee) => consignee.isDefault) ?? consignees[0];
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id ?? "");
  const [selectedConsigneeId, setSelectedConsigneeId] = useState(defaultConsignee?.id ?? "");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId) ?? routes[0] ?? null,
    [routes, selectedRouteId],
  );
  const summary = useMemo(() => buildSummary(cartItems), [cartItems]);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
      <div className="space-y-8">
        <section className="space-y-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <Badge>1. Consignee</Badge>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              Choose who receives the order
            </h2>
          </div>
          <div className="rounded-[var(--radius-md)] bg-[rgb(var(--surface-alt))] p-4">
            <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]" htmlFor="consignee-select">
              Saved consignees
              <select
                className="min-h-11 rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-4 text-sm text-[rgb(var(--text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))]"
                id="consignee-select"
                onChange={(event) => setSelectedConsigneeId(event.target.value)}
                value={selectedConsigneeId}
              >
                {consignees.map((consignee) => (
                  <option key={consignee.id} value={consignee.id}>
                    {consignee.fullName} · {consignee.cityOrState}
                  </option>
                ))}
              </select>
            </label>
            {defaultConsignee ? (
              <>
                <p className="mt-4 font-semibold text-[rgb(var(--text-primary))]">
                  {(consignees.find((consignee) => consignee.id === selectedConsigneeId) ?? defaultConsignee).fullName}
                </p>
                <p className="text-sm text-[rgb(var(--text-secondary))]">
                  {(consignees.find((consignee) => consignee.id === selectedConsigneeId) ?? defaultConsignee).cityOrState}
                </p>
                <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                  {(consignees.find((consignee) => consignee.id === selectedConsigneeId) ?? defaultConsignee).notes}
                </p>
              </>
            ) : null}
          </div>
        </section>

        <section className="space-y-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <Badge>2. Route</Badge>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              Choose a shipping lane before product payment
            </h2>
          </div>
          <CheckoutRouteSelector onRouteChange={setSelectedRouteId} routeId={selectedRouteId} routes={routes} />
          {selectedRoute ? (
            <div className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-alt))] p-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
              <p className="font-semibold text-[rgb(var(--text-primary))]">Route pricing notice</p>
              <p className="mt-2">{selectedRoute.formulaLabel}</p>
              <p>
                Estimated delivery: {selectedRoute.etaDaysMin}-{selectedRoute.etaDaysMax} days.
              </p>
              <p>Final shipping cost is confirmed only after warehouse measurement and proof upload.</p>
            </div>
          ) : null}
        </section>
      </div>

      <div className="space-y-6">
        <CheckoutSummary summary={summary} />
        <form action={startCheckoutPaymentAction} className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <input name="consigneeId" type="hidden" value={selectedConsigneeId} />
          <input name="shippingRouteId" type="hidden" value={selectedRouteId} />
          <input name="acceptTerms" type="hidden" value={acceptTerms ? "accepted" : "pending"} />
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Displayed prices may appear in USD while browsing, but payment is processed in NGN before Paystack is
            initialized. Shipping payment is collected later, after warehouse proof confirms the shipment size.
          </p>
          <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
            <input
              checked={acceptTerms}
              className="mt-1 h-4 w-4 rounded border border-[rgb(var(--border-subtle))]"
              onChange={(event) => setAcceptTerms(event.target.checked)}
              type="checkbox"
            />
            <span>
              I accept the selected route terms, including that shipping is billed separately after warehouse weighing.
            </span>
          </label>
          <Button className="mt-4 w-full" type="submit">
            Pay for products with Paystack
          </Button>
        </form>
      </div>
    </div>
  );
}
