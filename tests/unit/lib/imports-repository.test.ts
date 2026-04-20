import { beforeEach, describe, expect, it, vi } from "vitest";

const getOptionalDatabaseClientMock = vi.fn();
const createSupabaseServiceRoleClientMock = vi.fn();

vi.mock("@/lib/db/client", () => ({
  getOptionalDatabaseClient: getOptionalDatabaseClientMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServiceRoleClient: createSupabaseServiceRoleClientMock,
}));

function createImportsClient() {
  return {
    from(table: string) {
      return {
        eq() {
          return this;
        },
        order() {
          if (table === "import_jobs") {
            return Promise.resolve({
              data: [
                {
                  duplicate_count: 1,
                  failed_count: 0,
                  id: "job-1",
                  import_job_items: [{ status: "needs_review" }, { status: "imported" }],
                  imported_count: 2,
                  mode: "bulk_url",
                  status: "processing",
                  submitted_count: 3,
                },
              ],
              error: null,
            });
          }

          if (table === "catalog_alerts") {
            return Promise.resolve({
              data: [
                {
                  created_at: "2026-04-18T14:15:00.000Z",
                  product_id: "product-1",
                  products: {
                    product_sources: [{ source_product_id: "taobao-floor-lamp-002" }],
                    status: "live",
                    title: "ELIM Floor Lamp",
                  },
                },
              ],
              error: null,
            });
          }

          expect(table).toBe("import_job_items");
          return Promise.resolve({
            data: [
              {
                created_at: "2026-04-18T14:00:00.000Z",
                source_input: "https://detail.1688.com/offer/123456789.html",
                source_product_id: "source-chair-001",
                status: "imported",
              },
              {
                created_at: "2026-04-18T14:01:00.000Z",
                failure_reason: "missing weight",
                source_input: "https://item.taobao.com/item.htm?id=123",
                source_product_id: "source-lamp-002",
                status: "failed",
              },
            ],
            error: null,
          });
        },
        select() {
          return this;
        },
      };
    },
  };
}

describe("imports repository", () => {
  beforeEach(() => {
    getOptionalDatabaseClientMock.mockReset();
    createSupabaseServiceRoleClientMock.mockReset();
    getOptionalDatabaseClientMock.mockReturnValue(null);
    createSupabaseServiceRoleClientMock.mockReturnValue(createImportsClient());
  });

  it("maps persisted import jobs", async () => {
    const { listImportJobs } = await import("@/lib/imports/repository");

    await expect(listImportJobs()).resolves.toEqual([
      expect.objectContaining({
        duplicateCount: 1,
        id: "job-1",
        importedCount: 2,
        needsReviewCount: 1,
        queuedCount: 3,
        status: "processing",
      }),
    ]);
  });

  it("maps unavailable-product review rows", async () => {
    const { listUnavailableProducts } = await import("@/lib/imports/repository");

    await expect(listUnavailableProducts()).resolves.toEqual([
      expect.objectContaining({
        id: "product-1",
        sourceProductId: "taobao-floor-lamp-002",
        title: "ELIM Floor Lamp",
      }),
    ]);
  });

  it("maps import activity lines", async () => {
    const { getImportJobActivity } = await import("@/lib/imports/repository");

    await expect(getImportJobActivity("job-1")).resolves.toEqual([
      "DRAFT_CREATED :: source-chair-001",
      "IMPORT_FAILED :: source-lamp-002 :: missing weight",
    ]);
  });
});
