"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Cog, CreditCard, Inbox, LayoutDashboard, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Boxes, label: "Products" },
  { href: "/admin/imports", icon: Inbox, label: "Imports" },
  { href: "/admin/orders", icon: Truck, label: "Orders" },
  { href: "/admin/bi", icon: BarChart3, label: "BI Suite" },
  { href: "/admin/settings", icon: Cog, label: "Settings" },
];

const pageMeta: Record<string, { description: string; title: string }> = {
  "/admin": {
    description: "See what needs action across orders, products, and payments.",
    title: "Operations dashboard",
  },
  "/admin/bi": {
    description: "Track revenue, payments, and warehouse workload.",
    title: "Business insights",
  },
  "/admin/imports": {
    description: "Review import activity and unavailable source products.",
    title: "Imports",
  },
  "/admin/orders": {
    description: "Move orders through warehouse, shipping, and delivery.",
    title: "Orders",
  },
  "/admin/products": {
    description: "Create, edit, and publish catalog products.",
    title: "Products",
  },
  "/admin/settings": {
    description: "Manage rates, defaults, routes, and integration status.",
    title: "Settings",
  },
};

type AdminShellProps = {
  children: ReactNode;
  signOutControl?: ReactNode;
};

export function AdminShell({ children, signOutControl }: AdminShellProps) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/admin"];

  return (
    <div className="min-h-screen bg-[rgb(var(--surface-alt))] md:grid md:grid-cols-[290px_minmax(0,1fr)]">
      <aside
        className="hidden border-r border-[rgba(var(--border-strong),0.55)] text-white md:flex md:min-h-screen md:flex-col"
        style={{
          backgroundColor: "rgb(var(--brand-950))",
          backgroundImage:
            "linear-gradient(180deg, rgba(4, 47, 46, 1) 0%, rgba(9, 19, 31, 0.98) 100%)",
        }}
      >
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Chelsea Mart</p>
            <h1 className="text-2xl font-semibold tracking-[-0.05em] text-white">Admin</h1>
            <p className="text-sm leading-6 text-white/68">Catalog, warehouse, and payments in one place.</p>
          </div>
          <Badge className="w-fit border-white/10 bg-white/10 text-white/76">Live data only</Badge>
        </div>

        <nav className="grid gap-1 px-4">
          {navItems.map((item) => {
            const active =
              item.href === "/admin" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/70 hover:bg-white/8 hover:text-white",
                )}
                href={item.href}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 p-6">
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-white/6 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">Settlement split</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 text-white/80">
                <span>Product checkout</span>
                <span className="inline-flex items-center gap-2 font-mono text-xs">
                  <CreditCard className="size-3.5" />
                  NGN
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-white/80">
                <span>Shipping invoice</span>
                <span className="inline-flex items-center gap-2 font-mono text-xs">
                  <Truck className="size-3.5" />
                  USD to NGN
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">{signOutControl}</div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-[rgba(var(--border-subtle),0.95)] bg-[rgba(var(--surface-card),0.9)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-[var(--max-shell)] flex-col gap-4 px-6 py-5 lg:px-10 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="border-[rgba(var(--brand-500),0.18)] bg-[rgba(var(--brand-500),0.12)] text-[rgb(var(--brand-700))]">
                  Admin shell
                </Badge>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[rgb(var(--text-muted))] md:hidden">
                  {meta.title}
                </p>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{meta.title}</h2>
                <p className="max-w-2xl text-sm leading-6 text-[rgb(var(--text-secondary))]">{meta.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-[rgba(var(--accent-premium),0.22)] bg-[rgba(var(--accent-premium),0.12)] text-[rgb(var(--text-primary))]">
                Product and shipping payments stay separate
              </Badge>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[var(--max-shell)] px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
