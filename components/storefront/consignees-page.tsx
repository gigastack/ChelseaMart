import {
  deleteConsigneeAction,
  setDefaultConsigneeAction,
  updateConsigneeAction,
} from "@/app/(storefront)/account/consignees/actions";
import { ConsigneeForm } from "@/components/storefront/consignee-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
              Manage the people who can receive your orders.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Keep your default recipient up to date so checkout is faster.
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
              {defaultConsignee ? defaultConsignee.fullName : "Not set"}
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
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    {consignee.cityOrState} · {consignee.phone}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!consignee.isDefault ? (
                    <form action={setDefaultConsigneeAction}>
                      <input name="consigneeId" type="hidden" value={consignee.id} />
                      <Button size="sm" type="submit" variant="secondary">
                        Set as default
                      </Button>
                    </form>
                  ) : null}
                  <form action={deleteConsigneeAction}>
                    <input name="consigneeId" type="hidden" value={consignee.id} />
                    <Button size="sm" type="submit" variant="danger">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>

              <div className="grid gap-4 border-t border-[rgba(var(--border-subtle),0.92)] pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="grid gap-2 text-sm text-[rgb(var(--text-secondary))]">
                  <p>{consignee.notes || "No extra note added."}</p>
                </div>

                <details className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-3">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[rgb(var(--text-primary))]">
                    Edit consignee
                  </summary>
                  <form action={updateConsigneeAction} className="mt-4 grid gap-3">
                    <input name="consigneeId" type="hidden" value={consignee.id} />
                    <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                      Full name
                      <input
                        className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 text-sm text-[rgb(var(--text-primary))]"
                        defaultValue={consignee.fullName}
                        name="fullName"
                        required
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                      Phone
                      <input
                        className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 text-sm text-[rgb(var(--text-primary))]"
                        defaultValue={consignee.phone}
                        name="phone"
                        required
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                      City or state
                      <input
                        className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 text-sm text-[rgb(var(--text-primary))]"
                        defaultValue={consignee.cityOrState}
                        name="cityOrState"
                        required
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                      Note
                      <textarea
                        className="min-h-24 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm text-[rgb(var(--text-primary))]"
                        defaultValue={consignee.notes}
                        name="notes"
                      />
                    </label>
                    <label className="flex items-center gap-3 text-sm text-[rgb(var(--text-secondary))]">
                      <input defaultChecked={consignee.isDefault} name="isDefault" type="checkbox" />
                      <span>Use as default at checkout</span>
                    </label>
                    <Button size="sm" type="submit">
                      Save changes
                    </Button>
                  </form>
                </details>
              </div>
            </article>
          ))}
        </section>

        <ConsigneeForm />
      </div>
    </main>
  );
}
