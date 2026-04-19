import Link from "next/link";
import { ShoppingBag, UserCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/catalog", label: "Catalog" },
  { href: "/search", label: "Search" },
  { href: "/account/orders", label: "Orders" },
];

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--border-subtle))] bg-[rgba(var(--surface-card),0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4 lg:px-12">
        <Link className="min-w-fit text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--brand-950))]" href="/">
          Mart
        </Link>
        <div className="hidden flex-1 items-center gap-3 rounded-full border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-base))] px-4 py-2 md:flex">
          <span className="text-sm text-[rgb(var(--text-muted))]">Search curated products</span>
        </div>
        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:text-[rgb(var(--text-primary))]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Badge className="hidden sm:inline-flex">NGN / USD</Badge>
          <Link className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2")} href="/auth/sign-in">
            <UserCircle2 className="size-4" />
            <span className="sr-only">Sign in</span>
          </Link>
          <Link className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2")} href="/cart">
            <ShoppingBag className="size-4" />
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
