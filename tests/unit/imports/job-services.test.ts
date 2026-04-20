import { describe, expect, it, vi } from "vitest";
import { runAvailabilityScan } from "@/lib/imports/run-availability-scan";
import { runImportJob } from "@/lib/imports/run-import-job";

describe("runImportJob", () => {
  it("dedupes repeated source identities and creates draft imports", async () => {
    const fetchByUrl = vi.fn(async (url: string) => ({
      images: ["https://img.example.com/a.jpg"],
      platform: "alibaba" as const,
      priceCny: 30,
      productId: url.endsWith("1.html") ? "source-1" : "source-2",
      title: `Title for ${url}`,
      url,
    }));

    const result = await runImportJob({
      defaultMoq: 3,
      entries: [
        { type: "url", value: "https://detail.1688.com/offer/1.html" },
        { type: "url", value: "https://detail.1688.com/offer/1.html" },
        { type: "url", value: "https://detail.1688.com/offer/2.html" },
      ],
      existingSourceIds: new Set(["source-2"]),
      fetchByKeyword: vi.fn(),
      fetchByUrl,
      jobId: "job-1",
    });

    expect(result.summary.importedCount).toBe(1);
    expect(result.summary.duplicateCount).toBe(2);
    expect(result.createdProducts).toHaveLength(1);
    expect(result.createdProducts[0]?.product.sellPriceCny).toBe(30);
    expect(result.createdProducts[0]?.product.moqOverride).toBeNull();
    expect(result.createdProducts[0]?.source.sourcePlatform).toBe("alibaba");
    expect(result.jobItems.map((item) => item.status)).toEqual(["imported", "duplicate", "duplicate"]);
  });
});

describe("runAvailabilityScan", () => {
  it("hides unavailable products and emits alerts while preserving restorable records", async () => {
    const result = await runAvailabilityScan({
      checkAvailability: vi.fn(
        async (sourceProductId: string, sourcePlatform: "alibaba" | "taobao") =>
          !(sourceProductId === "source-down" && sourcePlatform === "taobao"),
      ),
      records: [
        {
          productId: "product-1",
          sourcePlatform: "alibaba",
          sourceProductId: "source-up",
          status: "live",
          title: "Available chair",
        },
        {
          productId: "product-2",
          sourcePlatform: "taobao",
          sourceProductId: "source-down",
          status: "live",
          title: "Unavailable lamp",
        },
      ],
    });

    expect(result.updatedProducts).toEqual([
      {
        nextStatus: "unavailable",
        previousStatus: "live",
        productId: "product-2",
      },
    ]);
    expect(result.alerts[0]).toMatchObject({
      alertType: "source_unavailable",
      productId: "product-2",
    });
    expect(result.summary.unavailableCount).toBe(1);
  });
});
