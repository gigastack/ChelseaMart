import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";

export type ImportJobRow = {
  duplicateCount: number;
  failedCount: number;
  id: string;
  importedCount: number;
  mode: "bulk_url" | "keyword_search" | "single_url";
  needsReviewCount: number;
  queuedCount: number;
  status: "completed" | "completed_with_errors" | "failed" | "processing" | "queued";
};

type ImportJobTableProps = {
  jobs: ImportJobRow[];
};

export function ImportJobTable({ jobs }: ImportJobTableProps) {
  return (
    <DataTable>
      <DataTableHeader>
        <DataTableRow>
          <DataTableHead>Job</DataTableHead>
          <DataTableHead>Status</DataTableHead>
          <DataTableHead>Queued</DataTableHead>
          <DataTableHead>Imported</DataTableHead>
          <DataTableHead>Duplicate</DataTableHead>
          <DataTableHead>Failed</DataTableHead>
          <DataTableHead>Needs review</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {jobs.map((job) => (
          <DataTableRow key={job.id}>
            <DataTableCell>
              <Link className="font-medium text-[rgb(var(--text-primary))] underline-offset-4 hover:underline" href={`/admin/imports/${job.id}`}>
                {job.mode}
              </Link>
            </DataTableCell>
            <DataTableCell>
              <Badge>{job.status}</Badge>
            </DataTableCell>
            <DataTableCell>{job.queuedCount}</DataTableCell>
            <DataTableCell>{job.importedCount}</DataTableCell>
            <DataTableCell>{job.duplicateCount}</DataTableCell>
            <DataTableCell>{job.failedCount}</DataTableCell>
            <DataTableCell>{job.needsReviewCount}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
