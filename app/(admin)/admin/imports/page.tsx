import { AdminImportWorkbench } from "@/components/admin/admin-import-workbench";
import { ImportJobTable, type ImportJobRow } from "@/components/admin/import-job-table";
import { ImportLogPanel } from "@/components/admin/import-log-panel";
import { UnavailableProductsTable, type UnavailableProductRow } from "@/components/admin/unavailable-products-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const jobs: ImportJobRow[] = [
  {
    duplicateCount: 12,
    failedCount: 4,
    id: "job-1",
    importedCount: 108,
    mode: "bulk_url",
    needsReviewCount: 6,
    queuedCount: 130,
    status: "processing",
  },
  {
    duplicateCount: 1,
    failedCount: 0,
    id: "job-2",
    importedCount: 5,
    mode: "keyword_search",
    needsReviewCount: 0,
    queuedCount: 6,
    status: "completed",
  },
];

const unavailableProducts: UnavailableProductRow[] = [
  {
    id: "product-2",
    sourceProductId: "source-down",
    statusBeforeHide: "live",
    title: "Unavailable lamp",
    unavailableSince: "Today",
  },
];

const jobLogLines = [
  "PARSED_URL :: https://detail.1688.com/offer/1.html",
  "FETCHED_SOURCE :: source-1",
  "DRAFT_CREATED :: product-1",
  "DUPLICATE_SKIPPED :: source-2",
  "IMPORT_FAILED :: source-7 :: timeout",
];

export default function AdminImportsPage() {
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
              <ImportJobTable jobs={jobs} />
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
            <UnavailableProductsTable products={unavailableProducts} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
