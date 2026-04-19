import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-xl space-y-6 px-6 py-16">
        <Badge>Sign in</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Return to your orders and consignees</h1>
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">Email/password and Google login will be connected to Supabase auth in the next integration step.</p>
        </div>
        <div className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <Input placeholder="Email address" />
          <Input placeholder="Password" type="password" />
          <Button>Continue</Button>
          <Link className="text-sm font-medium text-[rgb(var(--brand-600))]" href="/auth/sign-up">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
