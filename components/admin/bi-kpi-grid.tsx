type BiKpiGridProps = {
  revenueNgn: number;
  totalOrders: number;
  unavailable: number;
};

export function BiKpiGrid({ revenueNgn, totalOrders, unavailable }: BiKpiGridProps) {
  const cards = [
    {
      description: "Combined product and logistics settlement recognized inside the current BI range.",
      label: "Revenue",
      value: `NGN ${revenueNgn.toLocaleString("en-NG")}`,
    },
    {
      description: "Orders contributing to the current date window across both settlement phases.",
      label: "Orders",
      value: String(totalOrders),
    },
    {
      description: "Catalog rows currently hidden after admin-triggered availability checks.",
      label: "Unavailable products",
      value: String(unavailable),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5"
        >
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{card.label}</p>
          <p className="text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{card.value}</p>
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">{card.description}</p>
        </article>
      ))}
    </div>
  );
}
