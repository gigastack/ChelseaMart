import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BiFilterBarProps = {
  from: string;
  to: string;
};

export function BiFilterBar({ from, to }: BiFilterBarProps) {
  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-4 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-end">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Insights window</Badge>
        <p className="text-sm text-[rgb(var(--text-secondary))]">
          {from} to {to}
        </p>
      </div>
      <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
          From
          <input
            className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 text-sm text-[rgb(var(--text-primary))]"
            defaultValue={from}
            name="from"
            type="date"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
          To
          <input
            className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 text-sm text-[rgb(var(--text-primary))]"
            defaultValue={to}
            name="to"
            type="date"
          />
        </label>
        <Button className="self-end" type="submit">
          Apply
        </Button>
      </form>
    </section>
  );
}
