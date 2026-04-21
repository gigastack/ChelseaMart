type BiSalesChartProps = {
  airCount: number;
  seaCount: number;
};

export function BiSalesChart({ airCount, seaCount }: BiSalesChartProps) {
  const total = airCount + seaCount || 1;

  return (
    <article className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
      <div className="space-y-2">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Sales intelligence</p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Route split</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
              <span>Air</span>
              <span>{airCount}</span>
            </div>
            <div className="h-3 rounded-full bg-[rgb(var(--surface-alt))]">
              <div
                className="h-3 rounded-full bg-[rgb(var(--brand-600))]"
                style={{ width: `${(airCount / total) * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[rgb(var(--text-secondary))]">
              <span>Sea</span>
              <span>{seaCount}</span>
            </div>
            <div className="h-3 rounded-full bg-[rgb(var(--surface-alt))]">
              <div
                className="h-3 rounded-full bg-[rgb(var(--text-primary))]"
                style={{ width: `${(seaCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
