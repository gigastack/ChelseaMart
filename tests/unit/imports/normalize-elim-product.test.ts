import { describe, expect, it } from "vitest";
import { normalizeElimProduct } from "@/lib/imports/normalize-elim-product";

describe("normalizeElimProduct", () => {
  it("produces a CNY-native draft payload without converting prices at import time", () => {
    const normalized = normalizeElimProduct(
      {
        images: ["https://img.example.com/1.jpg"],
        platform: "alibaba",
        priceCny: 42,
        productId: "1688-abc",
        title: "Raw supplier title",
        url: "https://detail.1688.com/offer/1688-abc.html",
      },
      { defaultMoq: 4 },
    );

    expect(normalized.product.status).toBe("draft");
    expect(normalized.product.sourceType).toBe("api");
    expect(normalized.product.basePriceCny).toBe(42);
    expect(normalized.product.sellPriceCny).toBe(42);
    expect(normalized.product.moqOverride).toBeNull();
    expect(normalized.product.weightKg).toBeNull();
    expect(normalized.product.publishBlockingIssues).toContain("weight_required");
    expect(normalized.source.sourceProductId).toBe("1688-abc");
    expect(normalized.source.sourcePlatform).toBe("alibaba");
    expect(normalized.source.sourceCurrency).toBe("CNY");
  });
});
