import { convertCnyToNgn } from "@/lib/pricing/calculate";
import {
  elimProductPayloadSchema,
  normalizedImportProductSchema,
  type ElimProductPayload,
  type NormalizedImportProduct,
} from "@/lib/validation/imports";

type NormalizeElimProductOptions = {
  cnyToNgnRate: number;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function normalizeElimProduct(
  payload: ElimProductPayload,
  options: NormalizeElimProductOptions,
): NormalizedImportProduct {
  const parsedPayload = elimProductPayloadSchema.parse(payload);
  const basePriceNgn = convertCnyToNgn({
    cnyToNgnRate: options.cnyToNgnRate,
    sourcePriceCny: parsedPayload.priceCny,
  });

  return normalizedImportProductSchema.parse({
    product: {
      basePriceNgn,
      coverImageUrl: parsedPayload.images[0] ?? null,
      moq: 1,
      publishBlockingIssues: ["weight_required"],
      sellPriceNgn: basePriceNgn,
      shortDescription: null,
      slug: slugify(parsedPayload.title || parsedPayload.productId) || parsedPayload.productId.toLowerCase(),
      sourceType: "api",
      status: "draft",
      title: parsedPayload.title,
      weightKg: null,
    },
    source: {
      availabilityStatus: "available",
      sourceCurrency: "CNY",
      sourcePayload: parsedPayload,
      sourcePlatform: parsedPayload.platform,
      sourcePrice: parsedPayload.priceCny,
      sourceProductId: parsedPayload.productId,
      sourceUrl: parsedPayload.url,
    },
  });
}
