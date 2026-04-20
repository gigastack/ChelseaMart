import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpAction } from "@/app/(storefront)/auth/actions";
import { sanitizeNextPath } from "@/lib/auth/redirects";
import { getCurrentUserAccess } from "@/lib/auth/session";
import { hasSupabaseAuthEnv } from "@/lib/config/env";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    next?: string | string[];
    notice?: string | string[];
  }>;
};

function readParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(readParam(params.next));
  const error = readParam(params.error);
  const notice = readParam(params.notice);
  const authConfigured = hasSupabaseAuthEnv();

  if (authConfigured) {
    const access = await getCurrentUserAccess();

    if (access.isAuthenticated) {
      redirect("/account/orders");
    }
  }

  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-xl space-y-6 px-6 py-16">
        <Badge>Sign up</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Create a buyer account for repeat orders</h1>
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">Buyer identity stays separate from consignee records so diaspora shoppers can order for multiple people in Nigeria.</p>
        </div>
        <form action={signUpAction} className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <input name="next" type="hidden" value={nextPath} />
          {notice ? (
            <p className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-alt))] px-4 py-3 text-sm text-[rgb(var(--text-secondary))]">
              {notice}
            </p>
          ) : null}
          {error ? <p className="text-sm font-medium text-[rgb(var(--danger))]">{error}</p> : null}
          {!authConfigured ? (
            <p className="text-sm font-medium text-[rgb(var(--danger))]">Supabase auth is not configured yet. Add the public auth env vars before testing sign-up.</p>
          ) : null}
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Full name
            <Input autoComplete="name" disabled={!authConfigured} name="fullName" placeholder="Ada Buyer" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Email address
            <Input autoComplete="email" disabled={!authConfigured} name="email" placeholder="buyer@example.com" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Password
            <Input autoComplete="new-password" disabled={!authConfigured} name="password" placeholder="Password" required type="password" />
          </label>
          <Button disabled={!authConfigured} type="submit">
            Create account
          </Button>
          <Link className="text-sm font-medium text-[rgb(var(--brand-600))]" href="/auth/sign-in">
            Already have an account?
          </Link>
        </form>
      </section>
    </main>
  );
}
