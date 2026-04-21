import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableBody, DataTableCell, DataTableHead, DataTableHeader, DataTableRow } from "@/components/ui/table";

export type AdminProductRow = {
  coverImageUrl: string | null;
  effectiveMoq: number;
  id: string;
  moqOverride: number | null;
  priceCny: number;
  priceNgn: number;
  shortDescription: string;
  sourceType: "api" | "manual";
  sourcePriceCny: number;
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

function formatCny(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    maximumFractionDigits: 2,
    style: "currency",
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
          <DataTableHead>MOQ</DataTableHead>
          <DataTableHead>Image</DataTableHead>
          <DataTableHead>Pricing</DataTableHead>
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
            <DataTableCell>
              {product.effectiveMoq}
              <div className="text-xs text-[rgb(var(--text-secondary))]">
                {product.moqOverride === null ? "global default" : "product override"}
              </div>
            </DataTableCell>
            <DataTableCell>{product.coverImageUrl ? "Added" : "Missing"}</DataTableCell>
            <DataTableCell>
              <div className="font-medium text-[rgb(var(--text-primary))]">{formatCny(product.priceCny)}</div>
              <div className="text-xs text-[rgb(var(--text-secondary))]">{formatNaira(product.priceNgn)} payable</div>
            </DataTableCell>
            <DataTableCell>{product.updatedLabel}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
