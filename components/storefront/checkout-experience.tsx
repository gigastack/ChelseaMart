"use client";

import { useMemo, useState } from "react";
import { startCheckoutPaymentAction } from "@/app/(storefront)/checkout/actions";
import { CheckoutRouteSelector } from "@/components/storefront/checkout-route-selector";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CartItemRecord, ConsigneeRecord, ShippingRouteRecord } from "@/lib/orders/repository";
import { sumProductPaymentTotals } from "@/lib/pricing/calculate";

type CheckoutExperienceProps = {
  cartItems: CartItemRecord[];
  cnyToNgnRate: number;
  consignees: ConsigneeRecord[];
  routes: ShippingRouteRecord[];
};

function buildSummary(cartItems: CartItemRecord[], cnyToNgnRate: number) {
  const { productSubtotalCny, productSubtotalNgn } = sumProductPaymentTotals({
    cnyToNgnRate,
    items: cartItems.map((item) => ({
      effectiveMoq: item.effectiveMoq,
      quantity: item.quantity,
      sellPriceCny: item.sellPriceCny,
    })),
  });
  const serviceFeeNgn = 0;

  return {
    cnyToNgnRate,
    currency: "NGN" as const,
    payNowTotalNgn: productSubtotalNgn + serviceFeeNgn,
    productSubtotalCny,
    productSubtotalNgn,
    serviceFeeNgn,
  };
}

export function CheckoutExperience({ cartItems, cnyToNgnRate, consignees, routes }: CheckoutExperienceProps) {
  const defaultConsignee = consignees.find((consignee) => consignee.isDefault) ?? consignees[0];
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const moqValid = cartItems.every((item) => item.quantity >= item.effectiveMoq);
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id ?? "");
  const [selectedConsigneeId, setSelectedConsigneeId] = useState(defaultConsignee?.id ?? "");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId) ?? routes[0] ?? null,
    [routes, selectedRouteId],
  );
  const selectedConsignee = useMemo(
    () => consignees.find((consignee) => consignee.id === selectedConsigneeId) ?? defaultConsignee ?? null,
    [consignees, defaultConsignee, selectedConsigneeId],
  );
  const summary = useMemo(() => buildSummary(cartItems, cnyToNgnRate), [cartItems, cnyToNgnRate]);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] xl:items-start">
      <div className="grid gap-6">
        <section className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <Badge>Checkout</Badge>
            <h2 className="sr-only">Choose a route and pay for products only</h2>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Choose a route. Pay for products. Shipping comes later.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Confirm the delivery contact, accept the route terms, and start the first payment for products only.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-4 text-sm text-[rgb(var(--text-secondary))]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Items</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{itemCount}</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-4 text-sm text-[rgb(var(--text-secondary))]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">MOQ check</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{moqValid ? "Ready" : "Fix cart"}</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-4 text-sm text-[rgb(var(--text-secondary))]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Shipping now</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Not charged</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">1. Consignee</p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              Choose who receives the shipment
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.92fr)]">
            {consignees.length ? (
              <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]" htmlFor="consignee-select">
                Saved consignees
                <select
                  className="min-h-12 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 text-sm text-[rgb(var(--text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))]"
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
            ) : (
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
                Save at least one consignee before checkout can continue.
              </div>
            )}

            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Selected consignee</p>
              {selectedConsignee ? (
                <div className="mt-3 space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                  <p className="font-semibold text-[rgb(var(--text-primary))]">{selectedConsignee.fullName}</p>
                  <p>{selectedConsignee.cityOrState}</p>
                  <p>{selectedConsignee.phone}</p>
                  <p>{selectedConsignee.notes}</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-[rgb(var(--text-secondary))]">Add a consignee before checkout can continue.</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">2. Route</p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              Choose the shipping lane that defines the later invoice
            </h2>
          </div>
          <CheckoutRouteSelector onRouteChange={setSelectedRouteId} routeId={selectedRouteId} routes={routes} />
        </section>

        <section className="space-y-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">3. Product payment</p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
              Confirm the route terms and start the first Paystack charge
            </h2>
          </div>

          <form action={startCheckoutPaymentAction} className="grid gap-4">
            <input name="consigneeId" type="hidden" value={selectedConsigneeId} />
            <input name="shippingRouteId" type="hidden" value={selectedRouteId} />
            <input name="acceptTerms" type="hidden" value={acceptTerms ? "accepted" : "pending"} />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
                <p className="font-semibold text-[rgb(var(--text-primary))]">Route acceptance snapshot</p>
                {selectedRoute ? (
                  <div className="mt-3 space-y-2">
                    <p>
                      {selectedRoute.originLabel} to {selectedRoute.destinationLabel}
                    </p>
                    <p>{selectedRoute.formulaLabel}</p>
                    <p>
                      ETA: {selectedRoute.etaDaysMin}-{selectedRoute.etaDaysMax} days
                    </p>
                    <p>{selectedRoute.termsSummary}</p>
                  </div>
                ) : (
                  <p className="mt-3">Choose a route to continue.</p>
                )}
              </div>

              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
                <p className="font-semibold text-[rgb(var(--text-primary))]">What happens after payment</p>
                <div className="mt-3 space-y-2">
                  <p>1. You pay for products in Naira now.</p>
                  <p>2. The order moves to the warehouse queue.</p>
                  <p>3. Shipping opens only after measurement and proof.</p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
              <input
                checked={acceptTerms}
                className="mt-1 h-4 w-4 rounded border border-[rgb(var(--border-subtle))]"
                onChange={(event) => setAcceptTerms(event.target.checked)}
                type="checkbox"
              />
              <span>
                I accept the selected route terms and understand that shipping is billed separately after warehouse weighing and proof upload.
              </span>
            </label>

            <Button
              className="w-full"
              disabled={!selectedConsignee || !selectedRoute || !acceptTerms || !moqValid || !cartItems.length}
              size="lg"
              type="submit"
            >
              Pay for products with Paystack
            </Button>
          </form>
        </section>
      </div>

      <CheckoutSummary summary={summary} />
    </div>
  );
}
