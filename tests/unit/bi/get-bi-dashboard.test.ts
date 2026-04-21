import { describe, expect, it, vi } from "vitest";

const listAdminProductsMock = vi.fn();
const listAdminOrdersMock = vi.fn();
const listImportJobsMock = vi.fn();

vi.mock("@/lib/catalog/repository", () => ({
  listAdminProducts: listAdminProductsMock,
}));

vi.mock("@/lib/orders/repository", () => ({
  listAdminOrders: listAdminOrdersMock,
}));

vi.mock("@/lib/imports/repository", () => ({
  listImportJobs: listImportJobsMock,
}));

describe("getBiDashboard", () => {
  it("returns executive, sales, catalog, operations, and payment sections", async () => {
    listAdminProductsMock.mockResolvedValue([
      { id: "product-1", status: "live" },
      { id: "product-2", status: "draft" },
      { id: "product-3", status: "unavailable" },
    ]);
    listImportJobsMock.mockResolvedValue([
      { failedCount: 1, importedCount: 2 },
    ]);

    listAdminOrdersMock.mockResolvedValue([
      {
        createdAt: "2026-01-10T12:00:00.000Z",
        grandTotalNgn: 123360,
        items: [{ quantity: 1, sellPriceNgn: 92000, title: "Product Image Sample" }],
        paymentReference: "demo-paystack-ref-1001",
        productPaymentState: "paid",
        productPaymentTotalNgn: 92000,
        route: "air",
        shippingPaymentState: "paid",
        shippingCostNgn: 31360,
      },
      {
        createdAt: "2026-01-12T12:00:00.000Z",
        grandTotalNgn: 105440,
        items: [{ quantity: 1, sellPriceNgn: 81000, title: "ELIM Floor Lamp" }],
        paymentReference: null,
        productPaymentState: "pending",
        productPaymentTotalNgn: 81000,
        route: "sea",
        shippingPaymentState: "pending",
        shippingCostNgn: null,
      },
    ]);

    const { getBiDashboard } = await import("@/lib/bi/get-bi-dashboard");
    const dashboard = await getBiDashboard({
      from: "2026-01-01",
      to: "2026-01-31",
    });

    expect(dashboard.executive).toBeDefined();
    expect(dashboard.sales).toBeDefined();
    expect(dashboard.catalog).toBeDefined();
    expect(dashboard.operations).toBeDefined();
    expect(dashboard.payments).toBeDefined();
    expect(dashboard.catalog).toMatchObject({
      drafts: 1,
      live: 1,
      unavailable: 1,
    });
  });
});
