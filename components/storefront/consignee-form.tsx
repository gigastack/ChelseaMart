import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ConsigneeForm() {
  return (
    <form className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Full name
        <Input placeholder="Recipient full name" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Phone
        <Input placeholder="+234..." />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        City / State
        <Input placeholder="Lagos" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Notes
        <textarea className="min-h-24 rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] px-3 py-2 text-sm" placeholder="Hub or contact notes" />
      </label>
      <Button>Save consignee</Button>
    </form>
  );
}
