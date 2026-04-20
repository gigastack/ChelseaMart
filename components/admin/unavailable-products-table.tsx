import { Button } from "@/components/ui/button";
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
          <DataTableHead>Actions</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {products.map((product) => (
          <DataTableRow key={product.id}>
            <DataTableCell>{product.title}</DataTableCell>
            <DataTableCell>{product.sourceProductId}</DataTableCell>
            <DataTableCell>{product.statusBeforeHide}</DataTableCell>
            <DataTableCell>{product.unavailableSince}</DataTableCell>
            <DataTableCell>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary">
                  Retry
                </Button>
                <Button size="sm" variant="secondary">
                  Keep hidden
                </Button>
                <Button size="sm" variant="danger">
                  Delete
                </Button>
              </div>
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
