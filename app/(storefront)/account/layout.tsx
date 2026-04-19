import Link from "next/link";
import type { ReactNode } from "react";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/account/orders", label: "Orders" },
  { href: "/account/consignees", label: "Consignees" },
  { href: "/auth/sign-in", label: "Account" },
];

type AccountLayoutProps = {
  children: ReactNode;
};

export default async function AccountLayout({ children }: AccountLayoutProps) {
  if (hasSupabaseAuthEnv()) {
    await requireAuthenticatedUser("/auth/sign-in");
  }

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-12">
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
        {children}
      </section>
    </main>
  );
}
