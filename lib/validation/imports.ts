import { z } from "zod";
import { elimPlatforms } from "@/lib/imports/elim-platform";

export const elimPlatformSchema = z.enum(elimPlatforms);

export const importEntrySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("url"),
    value: z.url(),
  }),
  z.object({
    type: z.literal("keyword"),
    value: z.string().trim().min(1),
  }),
]);

export const parsedSourceInputSchema = z.object({
  entries: z.array(importEntrySchema).min(1),
  mode: z.enum(["single_url", "bulk_url", "keyword_search"]),
});

export const elimProductPayloadSchema = z.object({
  images: z.array(z.url()).default([]),
  platform: elimPlatformSchema,
  priceCny: z.number().nonnegative(),
  productId: z.string().trim().min(1),
  title: z.string().trim().min(1),
  url: z.url(),
});

export const normalizedImportProductSchema = z.object({
  product: z.object({
    basePriceCny: z.number().nonnegative(),
    coverImageUrl: z.string().url().nullable(),
    moqOverride: z.null(),
    publishBlockingIssues: z.array(z.enum(["weight_required", "shipping_config_required"])),
    sellPriceCny: z.number().nonnegative(),
    shortDescription: z.string().nullable(),
    slug: z.string().trim().min(1),
    sourceType: z.literal("api"),
    status: z.literal("draft"),
    title: z.string().trim().min(1),
    weightKg: z.null(),
  }),
  source: z.object({
    availabilityStatus: z.enum(["available", "unknown"]),
    sourceCurrency: z.literal("CNY"),
    sourcePayload: z.record(z.string(), z.unknown()),
    sourcePlatform: elimPlatformSchema,
    sourcePrice: z.number().nonnegative(),
    sourceProductId: z.string().trim().min(1),
    sourceUrl: z.url(),
  }),
});

export type ImportEntry = z.infer<typeof importEntrySchema>;
export type ParsedSourceInput = z.infer<typeof parsedSourceInputSchema>;
export type ElimProductPayload = z.infer<typeof elimProductPayloadSchema>;
export type NormalizedImportProduct = z.infer<typeof normalizedImportProductSchema>;
