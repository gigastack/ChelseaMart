import { AdminImportWorkbench } from "@/components/admin/admin-import-workbench";
import { ImportJobTable, type ImportJobRow } from "@/components/admin/import-job-table";
import { ImportLogPanel } from "@/components/admin/import-log-panel";
import { UnavailableProductsTable, type UnavailableProductRow } from "@/components/admin/unavailable-products-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getImportJobActivity, listImportJobs, listUnavailableProducts } from "@/lib/imports/repository";

export default async function AdminImportsPage() {
  const [jobs, unavailableProducts] = await Promise.all([listImportJobs(), listUnavailableProducts()]);
  const primaryJob = jobs[0];
  const jobLogLines = primaryJob ? await getImportJobActivity(primaryJob.id) : ["No import activity yet."];
  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-3">
          <Badge>Imports and availability</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Import jobs</h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Support single URLs, keyword search, and bulk submissions above one hundred URLs while keeping every
              product draft-first and fully reviewable.
            </p>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <AdminImportWorkbench />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Card>
            <CardHeader>
              <CardDescription>Job overview</CardDescription>
              <CardTitle>Queued, imported, duplicate, failed, and review counts</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportJobTable jobs={jobs as ImportJobRow[]} />
            </CardContent>
          </Card>
          <ImportLogPanel lines={jobLogLines} />
        </section>

        <Card>
          <CardHeader>
            <CardDescription>Unavailable products</CardDescription>
            <CardTitle>Products hidden after admin-triggered availability scans</CardTitle>
          </CardHeader>
          <CardContent>
            <UnavailableProductsTable products={unavailableProducts as UnavailableProductRow[]} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
