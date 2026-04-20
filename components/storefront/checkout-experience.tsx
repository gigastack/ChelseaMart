"use client";

import { useMemo, useState } from "react";
import { startCheckoutPaymentAction } from "@/app/(storefront)/checkout/actions";
import { CheckoutRouteSelector } from "@/components/storefront/checkout-route-selector";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CheckoutRoute } from "@/lib/domain/types";
import type { CartItemRecord, ConsigneeRecord } from "@/lib/orders/repository";
import { quoteOrderTotals } from "@/lib/pricing/calculate";

const USD_TO_NGN_RATE = 1600;

type CheckoutExperienceProps = {
  cartItems: CartItemRecord[];
  consignees: ConsigneeRecord[];
  routeConfigs: Record<CheckoutRoute, { minimumFeeNgn: number; pricePerKgUsd: number }>;
};

function buildSummary(
  route: CheckoutRoute,
  cartItems: CartItemRecord[],
  routeConfigs: CheckoutExperienceProps["routeConfigs"],
) {
  const totals = quoteOrderTotals({
    items: cartItems.map((item) => ({
      productTitle: item.title,
      quantity: item.quantity,
      sellPriceNgn: item.sellPriceNgn,
      weightKg: item.weightKg,
    })),
    routeConfig: routeConfigs[route],
    usdToNgnRate: USD_TO_NGN_RATE,
  });

  return {
    currency: "NGN" as const,
    grandTotalNgn: totals.grandTotalNgn,
    itemsSubtotalNgn: totals.productSubtotalNgn,
    logisticsTotalNgn: totals.logisticsTotalNgn,
  };
}

export function CheckoutExperience({ cartItems, consignees, routeConfigs }: CheckoutExperienceProps) {
  const [route, setRoute] = useState<CheckoutRoute>("air");
  const defaultConsignee = consignees.find((consignee) => consignee.isDefault) ?? consignees[0];
  const [selectedConsigneeId, setSelectedConsigneeId] = useState(defaultConsignee?.id ?? "");
  const summary = useMemo(() => buildSummary(route, cartItems, routeConfigs), [cartItems, route, routeConfigs]);

  function handleRouteChange(nextRoute: CheckoutRoute) {
    setRoute(nextRoute);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
      <div className="space-y-8">
        <section className="space-y-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <div className="space-y-2">
            <Badge>1. Consignee</Badge>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">Choose who receives the order in Nigeria</h2>
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
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">Choose Air or Sea</h2>
          </div>
          <CheckoutRouteSelector onRouteChange={handleRouteChange} route={route} />
        </section>
      </div>

      <div className="space-y-6">
        <CheckoutSummary summary={summary} />
        <form action={startCheckoutPaymentAction} className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <input name="consigneeId" type="hidden" value={selectedConsigneeId} />
          <input name="route" type="hidden" value={route} />
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Displayed prices may appear in USD while browsing, but payment is processed in NGN before Paystack is
            initialized.
          </p>
          <Button className="mt-4 w-full" type="submit">
            Pay with Paystack
          </Button>
        </form>
      </div>
    </div>
  );
}
