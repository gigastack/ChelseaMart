import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type OverviewTile = {
  description: string;
  title: string;
  value: string;
};

type AdminDashboardPageProps = {
  overviewTiles: OverviewTile[];
};

const actionLinks = [
  { href: "/admin/orders", label: "Open orders" },
  { href: "/admin/products", label: "Open products" },
  { href: "/admin/bi", label: "Open insights" },
];

export function AdminDashboardPage({ overviewTiles }: AdminDashboardPageProps) {
  return (
    <section className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Dashboard</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              See what needs action.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Use this page to spot blocked work, open invoices, and catalog gaps.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {actionLinks.map((link) => (
            <Link
              key={link.href}
              className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm font-medium text-[rgb(var(--text-primary))] transition-colors hover:bg-[rgb(var(--surface-alt))]"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div
          className="grid gap-5 rounded-[var(--radius-lg)] p-6 text-[rgb(var(--surface-card))]"
          style={{
            backgroundColor: "rgb(var(--brand-950))",
            backgroundImage:
              "linear-gradient(180deg, rgba(4, 47, 46, 1) 0%, rgba(9, 19, 31, 0.98) 100%)",
          }}
        >
          <div className="space-y-2">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">Operating posture</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Product and shipping payments stay separate from start to finish.
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-[rgba(255,255,255,0.82)] md:grid-cols-3">
            <p>Catalog prices stay in CNY, while customers pay product totals in Naira.</p>
            <p>Shipping opens only after warehouse measurement and proof upload.</p>
            <p>Rates and the default MOQ are controlled from settings.</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Priority links</p>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Jump straight to the active queue.</h2>
          <div className="grid gap-3">
            {actionLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] px-4 py-3 text-sm text-[rgb(var(--text-primary))] transition-colors hover:bg-[rgb(var(--surface-alt))]"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewTiles.map((tile) => (
          <article
            key={tile.title}
            className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5"
          >
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{tile.title}</h3>
            <p className="text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{tile.value}</p>
            <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">{tile.description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
