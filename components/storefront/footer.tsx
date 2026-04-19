import Link from "next/link";

const footerLinks = [
  { href: "/catalog", label: "Catalog" },
  { href: "/search", label: "Search" },
  { href: "/account/consignees", label: "Consignees" },
];

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-12">
        <div className="max-w-xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--brand-950))]">Mart</p>
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Curated China-to-Nigeria commerce with calmer browsing, NGN-first checkout, and admin-managed sourcing.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              className="text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:text-[rgb(var(--text-primary))]"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
