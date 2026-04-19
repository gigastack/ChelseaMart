import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ShippingConfigForm() {
  return (
    <div className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
      <h2 className="text-xl font-semibold text-[rgb(var(--text-primary))]">Shipping config</h2>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Air price per KG (USD)
        <Input defaultValue="4.5" inputMode="decimal" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Sea price per KG (USD)
        <Input defaultValue="3" inputMode="decimal" />
      </label>
      <Button>Save route config</Button>
    </div>
  );
}
