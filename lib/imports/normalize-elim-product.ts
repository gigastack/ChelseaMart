import {
  elimProductPayloadSchema,
  normalizedImportProductSchema,
  type ElimProductPayload,
  type NormalizedImportProduct,
} from "@/lib/validation/imports";
import { resolveEffectiveMoq } from "@/lib/settings/commerce-settings";

type NormalizeElimProductOptions = {
  defaultMoq: number;
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
  resolveEffectiveMoq({ defaultMoq: options.defaultMoq, moqOverride: null });

  return normalizedImportProductSchema.parse({
    product: {
      basePriceCny: parsedPayload.priceCny,
      coverImageUrl: parsedPayload.images[0] ?? null,
      moqOverride: null,
      publishBlockingIssues: ["weight_required"],
      sellPriceCny: parsedPayload.priceCny,
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
