import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sourceOptions = [
  {
    ctaHref: "/admin/products/new?source=manual",
    ctaLabel: "Start manual upload",
    description: "Create a product from scratch with curated title, imagery, CNY pricing, weight, and MOQ controls.",
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
      <div className="grid gap-4 border-b border-[rgba(var(--border-subtle),0.92)] pb-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
            Start with a source choice
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
            Choose how this product enters the catalog.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
            Manual and API-linked products share the same local editor and publish rules. The difference is only how
            the draft is created and whether source linkage is preserved for later syncs.
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
          Choose the path that fits the operator task now, then keep the final publish logic the same afterward.
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sourceOptions.map((option) => (
          <article
            key={option.title}
            className="grid gap-5 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6"
          >
            <div className="space-y-2">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">{option.eyebrow}</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{option.title}</h2>
            </div>
            <p className="text-sm leading-7 text-[rgb(var(--text-secondary))]">{option.description}</p>
            <Link className={cn(buttonVariants())} href={option.ctaHref}>
              {option.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
