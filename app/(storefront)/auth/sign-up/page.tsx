import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <main className="bg-[rgb(var(--surface-base))]">
      <section className="mx-auto max-w-xl space-y-6 px-6 py-16">
        <Badge>Sign up</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Create a buyer account for repeat orders</h1>
          <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">Buyer identity stays separate from consignee records so diaspora shoppers can order for multiple people in Nigeria.</p>
        </div>
        <div className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] p-6">
          <Input placeholder="Full name" />
          <Input placeholder="Email address" />
          <Input placeholder="Password" type="password" />
          <Button>Create account</Button>
          <Link className="text-sm font-medium text-[rgb(var(--brand-600))]" href="/auth/sign-in">
            Already have an account?
          </Link>
        </div>
      </section>
    </main>
  );
}
