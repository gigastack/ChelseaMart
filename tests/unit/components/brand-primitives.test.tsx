import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

describe("brand primitives", () => {
  it("merges utility classes predictably", () => {
    expect(cn("px-3 py-2", undefined, "px-5")).toContain("px-5");
    expect(cn("px-3 py-2", undefined, "px-5")).not.toContain("px-3");
  });

  it("renders the primary button with token-based styling", () => {
    render(<Button>Publish product</Button>);

    const button = screen.getByRole("button", { name: /publish product/i });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("bg-[rgb(var(--brand-500))]");
    expect(button.className).toContain("text-[rgb(var(--brand-950))]");
    expect(button.className).toContain("rounded-[var(--radius-md)]");
  });

  it("renders structured card content for admin and storefront blocks", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Catalog health</CardTitle>
          <CardDescription>Products missing required publish data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>12 drafts need review.</p>
        </CardContent>
      </Card>,
    );

    expect(screen.getByText("Catalog health")).toBeVisible();
    expect(screen.getByText("Products missing required publish data.")).toBeVisible();
    expect(screen.getByText("12 drafts need review.")).toBeVisible();
  });

  it("renders a tokenized input for forms", () => {
    render(<Input aria-label="Product name" placeholder="Product name" />);

    const input = screen.getByRole("textbox", { name: /product name/i });
    expect(input.className).toContain("border-[rgba(var(--border-strong),0.65)]");
    expect(input.className).toContain("bg-[rgba(var(--surface-card),0.94)]");
  });

  it("renders badges and skeletons for status-driven interfaces", () => {
    render(
      <>
        <Badge>Draft</Badge>
        <Skeleton data-testid="loading-card" />
      </>,
    );

    expect(screen.getByText("Draft").className).toContain("bg-[rgba(var(--surface-card),0.88)]");
    expect(screen.getByTestId("loading-card").className).toContain("animate-pulse");
  });

  it("renders a data table scaffold for operational screens", () => {
    render(
      <DataTable>
        <DataTableHeader>
          <DataTableRow>
            <DataTableHead>Product</DataTableHead>
            <DataTableHead>Status</DataTableHead>
          </DataTableRow>
        </DataTableHeader>
        <DataTableBody>
          <DataTableRow>
            <DataTableCell>Office chair</DataTableCell>
            <DataTableCell>Draft</DataTableCell>
          </DataTableRow>
        </DataTableBody>
      </DataTable>,
    );

    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByRole("columnheader", { name: /product/i })).toBeVisible();
    expect(screen.getByRole("cell", { name: /office chair/i })).toBeVisible();
  });
});
