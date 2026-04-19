import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sourceOptions = [
  {
    ctaHref: "/admin/products/new?source=manual",
    ctaLabel: "Start manual upload",
    description: "Create a product from scratch with curated title, imagery, pricing, weight, and MOQ controls.",
    eyebrow: "Manual path",
    title: "Manual Upload",
  },
  {
    ctaHref: "/admin/imports?mode=api",
    ctaLabel: "Start API import",
    description: "Import by URL paste, keyword search, or large bulk jobs, then review everything as drafts before publish.",
    eyebrow: "ELIM path",
    title: "Fetch from API",
  },
];

export function CreateProductSourcePicker() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[rgb(var(--brand-600))]">
          Start with a source choice
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">
          Choose how this product enters the catalog
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--text-secondary))]">
          Manual and API-linked products share the same local editor and publish rules. The only difference is how the
          initial draft is created and whether source linkage is preserved for later syncs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sourceOptions.map((option) => (
          <Card key={option.title}>
            <CardHeader>
              <CardDescription>{option.eyebrow}</CardDescription>
              <CardTitle>{option.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">{option.description}</p>
              <Link className={cn(buttonVariants())} href={option.ctaHref}>
                {option.ctaLabel}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
