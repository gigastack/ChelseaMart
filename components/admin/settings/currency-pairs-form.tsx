import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CurrencyPairsForm() {
  return (
    <div className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
      <h2 className="text-xl font-semibold text-[rgb(var(--text-primary))]">Currency pairs</h2>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        CNY → NGN
        <Input defaultValue="220" inputMode="decimal" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        USD → NGN
        <Input defaultValue="1200" inputMode="decimal" />
      </label>
      <Button>Save currency pairs</Button>
    </div>
  );
}
