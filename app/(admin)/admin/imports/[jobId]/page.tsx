import { ImportLogPanel } from "@/components/admin/import-log-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ImportJobDetailPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

const lines = [
  "QUEUE_ACCEPTED :: 130 entries",
  "FETCHED_SOURCE :: source-1",
  "DRAFT_CREATED :: product-1",
  "SOURCE_UNAVAILABLE :: source-9",
];

export default async function AdminImportJobDetailPage({ params }: ImportJobDetailPageProps) {
  const { jobId } = await params;

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-3">
          <Badge>Import job detail</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Job {jobId}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Review job progress, failure reasons, and the technical event stream before retrying or investigating
              source issues.
            </p>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
          <Card>
            <CardHeader>
              <CardDescription>Job summary</CardDescription>
              <CardTitle>Bulk URL import</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Queued</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">130</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Imported</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">108</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Duplicate</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">12</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]">Failed</p>
                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--text-primary))]">4</p>
              </div>
            </CardContent>
          </Card>
          <ImportLogPanel lines={lines} />
        </section>
      </div>
    </main>
  );
}
