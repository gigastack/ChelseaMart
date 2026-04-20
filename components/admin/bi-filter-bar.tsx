import { Badge } from "@/components/ui/badge";

type BiFilterBarProps = {
  from: string;
  to: string;
};

export function BiFilterBar({ from, to }: BiFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-4">
      <Badge>BI filters</Badge>
      <p className="text-sm text-[rgb(var(--text-secondary))]">
        {from} to {to}
      </p>
    </div>
  );
}
