import { AdminImportWorkbench } from "@/components/admin/admin-import-workbench";
import { ImportJobTable, type ImportJobRow } from "@/components/admin/import-job-table";
import { ImportLogPanel } from "@/components/admin/import-log-panel";
import { UnavailableProductsTable, type UnavailableProductRow } from "@/components/admin/unavailable-products-table";
import { Badge } from "@/components/ui/badge";
import { getImportJobActivity, listImportJobs, listUnavailableProducts } from "@/lib/imports/repository";

export default async function AdminImportsPage() {
  const [jobs, unavailableProducts] = await Promise.all([listImportJobs(), listUnavailableProducts()]);
  const primaryJob = jobs[0];
  const jobLogLines = primaryJob ? await getImportJobActivity(primaryJob.id) : ["No import activity yet."];
  const queuedJobs = jobs.filter((job) => job.status === "queued" || job.status === "processing").length;
  const duplicateCount = jobs.reduce((sum, job) => sum + job.duplicateCount, 0);
  const failedCount = jobs.reduce((sum, job) => sum + job.failedCount, 0);
  const reviewCount = jobs.reduce((sum, job) => sum + job.needsReviewCount, 0);

  const summaryCards = [
    {
      description: "Jobs still in motion across queueing, fetch, or normalization.",
      title: "Queued and processing",
      value: String(queuedJobs),
    },
    {
      description: "Rows stopped because the source already existed in the local catalog.",
      title: "Duplicates",
      value: String(duplicateCount),
    },
    {
      description: "Rows that failed during fetch, parse, or review creation.",
      title: "Failures",
      value: String(failedCount),
    },
    {
      description: "Draft rows still waiting on an operator before they can publish.",
      title: "Needs review",
      value: String(reviewCount),
    },
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
        <div className="space-y-3">
          <Badge>Imports and availability</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Import engine
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Batch jobs, logs, and ELIM visibility should stay in one shell so operators can detect duplicates, review
              drafts, and quarantine failed rows without leaving the queue.
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">
            Operator notes
          </p>
          <div className="grid gap-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
            <p>Every import remains draft-first. Publishing still requires a separate catalog pass with MOQ and logistics readiness intact.</p>
            <p>Technical logs remain mono-styled so source parsing and dedupe errors can be diagnosed inline.</p>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.title}
            className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{card.title}</p>
            <p className="text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{card.value}</p>
            <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">{card.description}</p>
          </article>
        ))}
      </section>

      <AdminImportWorkbench />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <article className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))]">
          <div className="grid gap-2 border-b border-[rgba(var(--border-subtle),0.92)] px-6 py-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Job overview</p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Queued, imported, duplicate, failed, and review counts
            </h2>
          </div>
          <div className="px-6 py-5">
            <ImportJobTable jobs={jobs as ImportJobRow[]} />
          </div>
        </article>
        <ImportLogPanel lines={jobLogLines} />
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))]">
        <div className="grid gap-2 border-b border-[rgba(var(--border-subtle),0.92)] px-6 py-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Unavailable products</p>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
            Products hidden after admin-triggered availability scans
          </h2>
        </div>
        <div className="px-6 py-5">
          <UnavailableProductsTable products={unavailableProducts as UnavailableProductRow[]} />
        </div>
      </section>
    </section>
  );
}
