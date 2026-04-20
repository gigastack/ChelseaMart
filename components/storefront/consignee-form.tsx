import { createConsigneeAction } from "@/app/(storefront)/account/consignees/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ConsigneeForm() {
  return (
    <form action={createConsigneeAction} className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
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
          className="min-h-24 rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] px-3 py-2 text-sm"
          name="notes"
          placeholder="Hub or contact notes"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))]">
        <input name="isDefault" type="checkbox" />
        Set as default consignee
      </label>
      <Button type="submit">Save consignee</Button>
    </form>
  );
}
