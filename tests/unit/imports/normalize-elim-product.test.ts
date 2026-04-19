import { describe, expect, it } from "vitest";
import { normalizeElimProduct } from "@/lib/imports/normalize-elim-product";

describe("normalizeElimProduct", () => {
  it("produces a local draft-ready API product payload", () => {
    const normalized = normalizeElimProduct(
      {
        images: ["https://img.example.com/1.jpg"],
        platform: "alibaba",
        priceCny: 42,
        productId: "1688-abc",
        title: "Raw supplier title",
        url: "https://detail.1688.com/offer/1688-abc.html",
      },
      { cnyToNgnRate: 220 },
    );

    expect(normalized.product.status).toBe("draft");
    expect(normalized.product.sourceType).toBe("api");
    expect(normalized.product.basePriceNgn).toBe(9240);
    expect(normalized.product.sellPriceNgn).toBe(9240);
    expect(normalized.product.weightKg).toBeNull();
    expect(normalized.product.publishBlockingIssues).toContain("weight_required");
    expect(normalized.source.sourceProductId).toBe("1688-abc");
    expect(normalized.source.sourcePlatform).toBe("alibaba");
  });
});
