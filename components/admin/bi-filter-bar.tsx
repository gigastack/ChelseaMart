import { Badge } from "@/components/ui/badge";

type BiFilterBarProps = {
  from: string;
  to: string;
};

export function BiFilterBar({ from, to }: BiFilterBarProps) {
  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>BI filters</Badge>
        <p className="text-sm text-[rgb(var(--text-secondary))]">
          {from} to {to}
        </p>
      </div>
      <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
        Compare period, export, and stale-data controls remain the next operational enhancement; this surface already
        frames the live settlement window and keeps finance plus ops in the same range.
      </p>
      <div className="justify-self-start rounded-full border border-[rgba(var(--warning),0.24)] bg-[rgba(var(--warning),0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-primary))] xl:justify-self-end">
        Seed snapshot
      </div>
    </section>
  );
}
