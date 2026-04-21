import Link from "next/link";

const footerColumns = [
  {
    links: [
      { href: "/catalog", label: "Catalog" },
      { href: "/search", label: "Search" },
      { href: "/cart", label: "Cart" },
    ],
    title: "Browse",
  },
  {
    links: [
      { href: "/account/orders", label: "Orders" },
      { href: "/account/consignees", label: "Consignees" },
      { href: "/auth/sign-in", label: "Sign in" },
    ],
    title: "Service",
  },
  {
    links: [
      { href: "/admin/settings", label: "Route terms" },
      { href: "/admin/bi", label: "Operational intelligence" },
      { href: "/admin/orders", label: "Warehouse queue" },
    ],
    title: "Trust",
  },
];

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[rgba(var(--brand-950),0.08)] bg-[rgb(var(--brand-950))] text-white">
      <div className="mx-auto grid max-w-[var(--max-shell)] gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,0.9fr))] lg:px-10">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/56">Chelsea Mart</p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">Buy products now. Settle shipping after warehouse proof.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/74">
            CNY-first merchandising, NGN product settlement, USD logistics invoices, and customer-visible proof before the
            second payment opens.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{column.title}</p>
            <div className="grid gap-3">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  className="text-sm font-medium text-white/76 transition-colors hover:text-white"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Logistics explainer</p>
          <div className="space-y-3 text-sm leading-7 text-white/72">
            <p>1. Browse products in CNY and pick a route before product payment.</p>
            <p>2. Warehouse receipt, measurement, and proof establish the shipping invoice later.</p>
            <p>3. Product and shipping payments stay split all the way through delivery.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
