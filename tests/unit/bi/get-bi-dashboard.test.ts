import { describe, expect, it } from "vitest";
import { getBiDashboard } from "@/lib/bi/get-bi-dashboard";

describe("getBiDashboard", () => {
  it("returns executive, sales, catalog, operations, and payment sections", async () => {
    const dashboard = await getBiDashboard({
      from: "2026-01-01",
      to: "2026-01-31",
    });

    expect(dashboard.executive).toBeDefined();
    expect(dashboard.sales).toBeDefined();
    expect(dashboard.catalog).toBeDefined();
    expect(dashboard.operations).toBeDefined();
    expect(dashboard.payments).toBeDefined();
  });
});
