type ImportLogPanelProps = {
  lines: string[];
};

export function ImportLogPanel({ lines }: ImportLogPanelProps) {
  return (
    <article className="grid gap-4 rounded-[var(--radius-lg)] bg-[rgb(var(--text-primary))] p-6 text-[rgb(var(--surface-card))]">
      <div className="space-y-2">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">Import activity log</p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Job stream</h2>
      </div>
      <div className="max-h-80 overflow-auto rounded-[var(--radius-md)] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-4 font-mono text-xs leading-6">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
    </article>
  );
}
