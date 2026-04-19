import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";

type DrilldownRow = {
  revenueNgn: number;
  title: string;
};

type BiDrilldownTableProps = {
  rows: DrilldownRow[];
};

export function BiDrilldownTable({ rows }: BiDrilldownTableProps) {
  return (
    <DataTable>
      <DataTableHeader>
        <DataTableRow>
          <DataTableHead>Product</DataTableHead>
          <DataTableHead>Revenue</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {rows.map((row) => (
          <DataTableRow key={row.title}>
            <DataTableCell>{row.title}</DataTableCell>
            <DataTableCell>NGN {row.revenueNgn.toLocaleString("en-NG")}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
