import { ConsigneeForm } from "@/components/storefront/consignee-form";
import { Badge } from "@/components/ui/badge";
import type { ConsigneeRecord } from "@/lib/orders/repository";

type ConsigneesPageProps = {
  consignees: ConsigneeRecord[];
};

export function ConsigneesPage({ consignees }: ConsigneesPageProps) {
  const defaultConsignee = consignees.find((consignee) => consignee.isDefault) ?? null;

  return (
    <main className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Consignees</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Manage the recipients used when route acceptance turns into a real order.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Consignees are not profile decoration. They are the operational handoff record used when warehouse-bound
              orders are routed into the receiving flow.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Saved consignees</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{consignees.length}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Default recipient</p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              {defaultConsignee?.fullName ?? "Not set"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <section className="grid gap-4">
          {consignees.map((consignee) => (
            <article
              key={consignee.id}
              className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
                    {consignee.isDefault ? "Default consignee" : "Saved consignee"}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                    {consignee.fullName}
                  </h2>
                </div>
                <span className="rounded-full border border-[rgba(var(--border-subtle),0.92)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-secondary))]">
                  {consignee.cityOrState}
                </span>
              </div>

              <div className="grid gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 md:grid-cols-3">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Phone</p>
                  <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">{consignee.phone}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Delivery note</p>
                  <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">{consignee.notes || "No extra note supplied."}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Operational role</p>
                  <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                    Used during route acceptance and warehouse-bound order creation.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <ConsigneeForm />
      </div>
    </main>
  );
}
