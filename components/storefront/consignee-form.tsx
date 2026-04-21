import { createConsigneeAction } from "@/app/(storefront)/account/consignees/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ConsigneeForm() {
  return (
    <form
      action={createConsigneeAction}
      className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-strong),0.46)] bg-[rgba(var(--surface-card),0.96)] p-6 shadow-[0_24px_70px_rgba(4,47,46,0.08)] backdrop-blur"
    >
      <div className="space-y-2">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Add consignee</p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Add a new recipient.</h2>
      </div>

      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Full name
        <Input name="fullName" placeholder="Recipient full name" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Phone
        <Input name="phone" placeholder="+234..." required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        City / State
        <Input name="cityOrState" placeholder="Lagos" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Notes
        <textarea
          className="min-h-28 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-3 text-sm text-[rgb(var(--text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))]"
          name="notes"
          placeholder="Hub instructions, best contact times, or receiving notes"
        />
      </label>
      <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
        <input className="mt-1" name="isDefault" type="checkbox" />
        <span>Set this recipient as the default consignee for future checkouts.</span>
      </label>
      <Button size="lg" type="submit">
        Save consignee
      </Button>
    </form>
  );
}
