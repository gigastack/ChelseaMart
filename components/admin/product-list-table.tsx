import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";

export type AdminProductRow = {
  id: string;
  priceNgn: number;
  sourceType: "api" | "manual";
  status: "draft" | "live" | "removed" | "unavailable";
  title: string;
  updatedLabel: string;
  weightKg: number | null;
};

type ProductListTableProps = {
  products: AdminProductRow[];
};

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "NGN",
  }).format(value);
}

export function ProductListTable({ products }: ProductListTableProps) {
  return (
    <DataTable>
      <DataTableHeader>
        <DataTableRow>
          <DataTableHead>Product</DataTableHead>
          <DataTableHead>Status</DataTableHead>
          <DataTableHead>Source</DataTableHead>
          <DataTableHead>Weight</DataTableHead>
          <DataTableHead>Price</DataTableHead>
          <DataTableHead>Updated</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {products.map((product) => (
          <DataTableRow key={product.id}>
            <DataTableCell>
              <Link className="font-medium text-[rgb(var(--text-primary))] underline-offset-4 hover:underline" href={`/admin/products/${product.id}`}>
                {product.title}
              </Link>
            </DataTableCell>
            <DataTableCell>
              <Badge>{product.status}</Badge>
            </DataTableCell>
            <DataTableCell>{product.sourceType}</DataTableCell>
            <DataTableCell>{product.weightKg ? `${product.weightKg} kg` : "Missing"}</DataTableCell>
            <DataTableCell>{formatNaira(product.priceNgn)}</DataTableCell>
            <DataTableCell>{product.updatedLabel}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
