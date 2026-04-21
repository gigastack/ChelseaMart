import Link from "next/link";
import type { ReactNode } from "react";
import { SignOutForm } from "@/components/storefront/sign-out-form";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/account/orders", label: "Orders" },
  { href: "/account/consignees", label: "Consignees" },
];

type AccountLayoutProps = {
  children: ReactNode;
};

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const user = hasSupabaseAuthEnv() ? await requireAuthenticatedUser("/account/orders") : null;

  return (
    <section className="mx-auto max-w-[var(--max-shell)] px-6 py-10 lg:px-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-6 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgba(var(--surface-card),0.88)] p-6 shadow-[0_24px_70px_rgba(4,47,46,0.08)] backdrop-blur">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand-600))]">Service center</p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
                Keep product receipts, warehouse proof, and shipping actions in one place.
              </h1>
              <p className="text-sm leading-7 text-[rgb(var(--text-secondary))]">
                This account mode is built around post-purchase clarity, not generic profile settings.
              </p>
            </div>
          </div>

          <nav className="grid gap-2">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                className={cn(
                  "rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-base))] px-4 py-3 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:border-[rgb(var(--border-strong))] hover:text-[rgb(var(--text-primary))]",
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user?.email ? (
            <div className="space-y-3 border-t border-[rgb(var(--border-subtle))] pt-4">
              <p className="text-sm text-[rgb(var(--text-secondary))]">{user.email}</p>
              <SignOutForm size="sm" variant="secondary" />
            </div>
          ) : null}
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
