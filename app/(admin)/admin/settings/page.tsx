import { IntegrationStatusCard } from "@/components/admin/settings/integration-status-card";
import { CurrencyPairsForm } from "@/components/admin/settings/currency-pairs-form";
import { ShippingConfigForm } from "@/components/admin/settings/shipping-config-form";
import { PricingRulesForm } from "@/components/admin/settings/pricing-rules-form";
import { Badge } from "@/components/ui/badge";
import { getConfigStatus, getOptionalServerEnv } from "@/lib/config/env";

export default function AdminSettingsPage() {
  const serverEnv = getOptionalServerEnv();

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <Badge>Settings</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
            Operational configuration
          </h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <IntegrationStatusCard
            lastSuccessAt={serverEnv.paystackSecretKey ? "2026-04-17T10:00:00.000Z" : undefined}
            name="Paystack"
            status={getConfigStatus(serverEnv.paystackSecretKey)}
          />
          <IntegrationStatusCard
            lastSuccessAt={serverEnv.elimApiKey ? "2026-04-17T09:40:00.000Z" : undefined}
            name="ELIM"
            status={getConfigStatus(serverEnv.elimApiKey)}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <CurrencyPairsForm />
          <ShippingConfigForm />
          <PricingRulesForm />
        </div>
      </div>
    </main>
  );
}
