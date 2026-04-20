import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PricingRulesForm() {
  return (
    <div className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
      <h2 className="text-xl font-semibold text-[rgb(var(--text-primary))]">Pricing rules</h2>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Default markup (%)
        <Input defaultValue="0" inputMode="decimal" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Draft stale threshold (days)
        <Input defaultValue="3" inputMode="numeric" />
      </label>
      <Button>Save pricing rules</Button>
    </div>
  );
}
