import { updateCommerceSettingsAction } from "@/app/(admin)/admin/settings/actions";
import { IntegrationStatusCard } from "@/components/admin/settings/integration-status-card";
import { CurrencyPairsForm } from "@/components/admin/settings/currency-pairs-form";
import { ShippingConfigForm } from "@/components/admin/settings/shipping-config-form";
import { PricingRulesForm } from "@/components/admin/settings/pricing-rules-form";
import { Badge } from "@/components/ui/badge";
import { getConfigStatus, getOptionalServerEnv } from "@/lib/config/env";
import { listCheckoutShippingRoutes } from "@/lib/orders/repository";
import { getCommerceSettings, getIntegrationActivity } from "@/lib/settings/repository";

type AdminSettingsPageProps = {
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export default async function AdminSettingsPage({ searchParams }: AdminSettingsPageProps) {
  const serverEnv = getOptionalServerEnv();
  const [settings, routes, integrationActivity, rawParams] = await Promise.all([
    getCommerceSettings(),
    listCheckoutShippingRoutes(),
    getIntegrationActivity(),
    searchParams ?? Promise.resolve({}),
  ]);
  const params = rawParams as { error?: string; updated?: string };
  const errorMessage = typeof params.error === "string" ? params.error : null;
  const updated = params.updated === "1";

  return (
    <section className="space-y-8">
        <div className="space-y-3">
          <Badge>Settings</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Settings</h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Manage exchange rates, the default MOQ, shipping routes, and integration status.
            </p>
          </div>
        </div>

        {updated ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--success),0.25)] bg-[rgba(var(--success),0.08)] px-4 py-3 text-sm text-[rgb(var(--text-primary))]">
            Commerce settings updated.
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--danger),0.25)] bg-[rgba(var(--danger),0.08)] px-4 py-3 text-sm text-[rgb(var(--text-primary))]">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <IntegrationStatusCard
            lastRecordedAt={serverEnv.paystackSecretKey ? integrationActivity.paystackLastRecordedAt : null}
            name="Paystack"
            status={getConfigStatus(serverEnv.paystackSecretKey)}
          />
          <IntegrationStatusCard
            lastRecordedAt={serverEnv.elimApiKey ? integrationActivity.elimLastRecordedAt : null}
            name="ELIM"
            status={getConfigStatus(serverEnv.elimApiKey)}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <CurrencyPairsForm
            action={updateCommerceSettingsAction}
            cnyToNgnRate={settings.cnyToNgnRate}
            defaultMoq={settings.defaultMoq}
            usdToNgnRate={settings.usdToNgnRate}
          />
          <ShippingConfigForm routes={routes} />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <PricingRulesForm />
          <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6 xl:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
              Current setup
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Catalog</p>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-secondary))]">
                  Prices stay in CNY and convert to NGN at {settings.cnyToNgnRate.toLocaleString("en-NG")}.
                </p>
              </div>
              <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Shipping</p>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-secondary))]">
                  Invoices stay in USD and convert to NGN at {settings.usdToNgnRate.toLocaleString("en-NG")}.
                </p>
              </div>
              <div className="border-t border-[rgb(var(--border-subtle))] pt-4">
                <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Global MOQ</p>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-secondary))]">
                  Default MOQ is {settings.defaultMoq}. Product overrides stay allowed.
                </p>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
