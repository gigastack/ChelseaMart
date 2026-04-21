import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";

export type UnavailableProductRow = {
  id: string;
  sourceProductId: string;
  statusBeforeHide: "draft" | "live" | "removed";
  title: string;
  unavailableSince: string;
};

type UnavailableProductsTableProps = {
  products: UnavailableProductRow[];
};

export function UnavailableProductsTable({ products }: UnavailableProductsTableProps) {
  return (
    <DataTable>
      <DataTableHeader>
        <DataTableRow>
          <DataTableHead>Product</DataTableHead>
          <DataTableHead>Source ID</DataTableHead>
          <DataTableHead>Previous state</DataTableHead>
          <DataTableHead>Unavailable since</DataTableHead>
          <DataTableHead>Recovery</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {products.map((product) => (
          <DataTableRow key={product.id}>
            <DataTableCell>{product.title}</DataTableCell>
            <DataTableCell>{product.sourceProductId}</DataTableCell>
            <DataTableCell>{product.statusBeforeHide}</DataTableCell>
            <DataTableCell>{product.unavailableSince}</DataTableCell>
            <DataTableCell>No action from this screen yet.</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
