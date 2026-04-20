import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ImportJobTable } from "@/components/admin/import-job-table";

describe("ImportJobTable", () => {
  it("shows queued, imported, duplicate, failed, and needs review counts", () => {
    render(
      <ImportJobTable
        jobs={[
          {
            duplicateCount: 1,
            failedCount: 1,
            id: "job-1",
            importedCount: 8,
            mode: "bulk_url",
            needsReviewCount: 2,
            queuedCount: 10,
            status: "processing",
          },
        ]}
      />,
    );

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
