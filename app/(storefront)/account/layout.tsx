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
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav className="flex flex-wrap gap-3">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                className={cn(
                  "rounded-full border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-4 py-2 text-sm font-medium text-[rgb(var(--text-secondary))]",
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {user?.email ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-[rgb(var(--text-secondary))]">{user.email}</p>
              <SignOutForm size="sm" variant="secondary" />
            </div>
          ) : null}
        </div>
        {children}
      </section>
    </main>
  );
}
